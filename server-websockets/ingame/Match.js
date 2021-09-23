const defaultOptions = require("./defaultRoomOptions.json");
const path = require("path");
const sqlite = require("better-sqlite3");

const wordListDb = new sqlite(path.join(__dirname, "./word_list.db"));

function getSubstring(frequency) {
    let sql =
        "SELECT * FROM substrings WHERE frequency>? ORDER BY RANDOM() LIMIT 1";
    let row = wordListDb.prepare(sql).get(frequency);
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
        this.sendAll("matchData", {
            players: players.map((player) => player.data.identity),
            options: this.options,
        });
        if (this.options.gametype == "ranked") {
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
    }
    nextRound() {
        if (this.players.filter((player) => player.lives != 0).length == 1) {
            this.gameOver(this.players.find((player) => player.lives != 0));
            return;
        }
        do {
            this.currentPlayer++;
            this.currentPlayer %= this.players.length;
        } while (this.players[this.currentPlayer].lives == 0);

        this.round++;

        let frequency = this.options.maxWordFrequency;
        if (this.combo > this.options.freqMarginStart) {
            frequency = Math.max(
                this.options.maxWordFrequency -
                    (this.combo - this.options.freqMarginStart) *
                        this.options.freqMarginScale,
                this.options.minWordFrequency
            );
            this.sendAll("difficultyUp", {
                frequency,
            });
        }
        console.log(frequency);
        this.substring = getSubstring(frequency);

        let player = this.players[this.currentPlayer];
        this.sendAll("startTurn", {
            player: player.identity,
            substring: this.substring,
            time: player.remainingTime,
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
    submitWord(identity, word, substring) {
        word = word.toLowerCase();
        let player = this.players[this.currentPlayer];
        if (identity != player.identity) {
            return;
        }
        let check = checkWord(word, substring);
        if (!check.status) {
            this.sendAll("failedSubmit", { identity, reason: check.error });
            return;
        }
        let addedTimes = this.calculateTime(word);
        this.combo++;
        this.usedWords.push(word);
        player.endTurn(this, ...addedTimes);
    }
}

module.exports = Match;
