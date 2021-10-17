const defaultOptions = require("./defaultRoomOptions.json");
const path = require("path");
const sqlite = require("better-sqlite3");

const wordListDb = new sqlite(path.join(__dirname, "./word_list.db"));

function getSubstring(difficultyRange) {
    let sql =
        "SELECT * FROM substrings WHERE frequency BETWEEN ? AND ? ORDER BY RANDOM() LIMIT 1";
    let row = wordListDb
        .prepare(sql)
        .get(difficultyRange[1], difficultyRange[0]);
    return row.substring;
}

function checkWord(usedWords, word, substring) {
    if (usedWords.includes(word)) {
        return { status: false, error: "Word already used." };
    }
    let sql = "SELECT * FROM words WHERE word=?";
    let row = wordListDb.prepare(sql).get(word);
    if (row && word.includes(substring)) {
        return { status: true };
    } else {
        return { status: false, error: "Word doesn't exist." };
    }
}

const Elo = require("arpad");

const uscf = {
    default: 32,
    2100: 24,
    2400: 16,
};

const min_score = 100;
const max_score = 10000;

const elo = new Elo(uscf, min_score, max_score);

const Player = require("./Player");
const { sendClient } = require("../globalFunctions");

class Match {
    constructor(players, options) {
        this.started = false;
        if (options) {
            this.options = { ...defaultOptions, ...options };
        } else {
            this.options = defaultOptions;
        }
        this.players = players.map(
            (player) => new Player(player.client, player.data, this.options)
        );
        this.round = 0;
        this.combo = 0;
        this.currentPlayer = 0;
        this.id = this.options.id;
        this.substring = "";
        this.usedWords = [];
        this.difficulty = 0;
        this.sendAll("matchData", {
            players: JSON.stringify(
                players.map((player) => {
                    return {
                        id: player.data.id,
                        username: player.data.username,
                    };
                })
            ),
            options: this.options,
        });
        if (this.options.gametype == "ranked") {
            let avgElo = (this.players[0].elo + this.players[1].elo) / 2;
            this.difficulty = this.options.eloDifficulties.find(
                (bracket) => bracket.min <= avgElo && bracket.max >= avgElo
            ).difficulty;
            this.startGame();
        }
    }
    sendAll(type, payload) {
        for (let i = 0; i < this.players.length; i++) {
            const player = this.players[i];
            sendClient(player.client, type, payload);
        }
    }
    playerLost(player) {
        this.sendAll("lostLife", player.identity);
        this.nextRound();
    }
    gameOver(winner) {
        console.log("GAME OVER");
        this.sendAll("gameOver", { winner: winner.identity });
        if (this.options.gametype == "ranked") {
            this.calculateElo();
        }
    }
    calculateElo() {
        let player1 = this.players[0];
        let player2 = this.players[1];
        let player1Data = player1.client.user;
        let player2Data = player2.client.user;
        if (player1.lives == 0) {
            var player1Elo = elo.newRatingIfLost(
                player1Data.elo,
                player2Data.elo
            );
            var player2Elo = elo.newRatingIfWon(
                player2Data.elo,
                player1Data.elo
            );
        } else {
            var player1Elo = elo.newRatingIfWon(
                player1Data.elo,
                player2Data.elo
            );
            var player2Elo = elo.newRatingIfLost(
                player2Data.elo,
                player1Data.elo
            );
        }
        player1.setElo(player1Elo);
        player2.setElo(player2Elo);
    }
    checkRemainingPlayers() {
        // If there are more than 1 remaining players, return true.
        if (this.players.filter((player) => player.lives != 0).length == 1) {
            return false;
        }
        return true;
    }
    nextPlayer() {
        do {
            this.currentPlayer++;
            this.currentPlayer %= this.players.length;
        } while (this.players[this.currentPlayer].lives == 0);
    }
    updateDifficulty() {
        this.difficulty++;
        this.sendAll("difficultyUp", {});
    }
    nextRound() {
        if (!this.checkRemainingPlayers()) {
            this.gameOver(this.players.find((player) => player.lives != 0));
            return;
        }

        this.nextPlayer();

        this.round++;

        if (this.round % this.options.difficultyUpFrequency == 0) {
            this.updateDifficulty();
        }

        let wordFrequencyRange = this.options.difficultyRanges[this.difficulty];
        this.substring = getSubstring(wordFrequencyRange);

        let player = this.players[this.currentPlayer];
        this.sendAll("startTurn", {
            player: player.id,
            substring: this.substring,
            time: player.remainingTime,
            currentPlayer: this.currentPlayer,
        });
        this.players[this.currentPlayer].startTurn(this);
    }
    startGame() {
        this.started = true;
        this.sendAll("startGame", { roomId: this.options.id });
        setTimeout(() => {
            this.nextRound();
        }, 3000);
    }
    calculateTime(word) {
        let bonusMultiplier = 1;
        if (word.length > this.options.lengthBonusStart) {
            let lengthRange =
                this.options.lengthBonusEnd - this.options.lengthBonusStart;
            let bonusRange =
                this.options.lengthBonusMax - this.options.lengthBonusMin;
            bonusMultiplier =
                Math.min(
                    ((word.length - this.options.lengthBonusStart) /
                        lengthRange) *
                        bonusRange,
                    bonusRange
                ) + bonusRange;
        }
        let modifiedAddedTime = this.options.maxTime;
        if (this.combo > this.options.timeMarginStart) {
            modifiedAddedTime = Math.max(
                this.options.maxTime -
                    (this.combo - this.options.timeMarginStart) *
                        this.options.timeMarginScale,
                this.options.minTime
            );
        }
        return [modifiedAddedTime, bonusMultiplier];
    }
    submitWord(client, word, substring) {
        if (!word) {
            return;
        }
        word = word.toLowerCase();
        let player = this.players[this.currentPlayer];
        if (client != player.client) {
            return;
        }
        let check = checkWord(this.usedWords, word, substring);
        if (!check.status) {
            this.sendAll("failedSubmit", {
                id: client.user._id,
                reason: check.error,
            });
            return;
        }
        let addedTimes = this.calculateTime(word);
        this.combo++;
        this.usedWords.push(word);
        player.endTurn(this, ...addedTimes);
    }
}

module.exports = Match;
