const defaultOptions = {
    gametype: "ffa",
    private: "false",
    lives: 3,
    startingTime: 20,
    maxTime: 5,
    minTime: 1,
    marginStart: 4,
    marginScale: 1,
    lengthBonusStart: 8,
    lengthBonusEnd: 14,
    lengthBonusMin: 1,
    lengthBonusMax: 2
}

var sqlite=  require("better-sqlite3");
var wordListDb = new sqlite("./word_list.db")

function getSubstring() {
    let sql = "SELECT * FROM substrings WHERE frequency>1000 ORDER BY RANDOM() LIMIT 1"
    var row = wordListDb.prepare(sql).get();
    return row.substring;
} 

function checkWord(word, substring) {
    let sql = "SELECT * FROM words WHERE word=?"
    var row = wordListDb.prepare(sql).get(word);
    if (row && word.includes(substring)) {
        return true;
    } else {
        return false;
    }
}
 
const Player = require("./Player")
const { sendClient } = require("../globalFunctions");

class Match {
    constructor(players, options) {
        this.started = false;
        if (options) {
            this.options = {...defaultOptions, ...options}
        } else {
            this.options = defaultOptions
        }
        this.players = players.map(player => Player(player.client, player.data, this.options))
        this.round = 0
        this.combo = 0
        this.currentPlayer = 0
        if (gametype=="ranked") {
            this.startGame()
        }
    }
    sendToAll(type, payload) {
        for (let i = 0; i < this.players.length; i++) {
            const player = this.players[i]
            sendClient(player.client, type, payload)
        }
    }
    playerLost(player) {
        this.sendToAll("startTurn", player.identity)
        this.nextRound();
        var playersLeft = this.players.filter(player=>player.lives != 0)
        if (playersLeft == 1) {
            this.gameOver();
        }
    }
    gameOver() {
        console.log("GAME OVER");
    }
    nextRound() {
        this.round++;
        var substring = getSubstring()
        this.sendToAll("startTurn", {player:this.players[this.currentPlayer].identity, substring})
        this.players[this.currentPlayer].startTurn(this)
        do {
            this.currentPlayer++
            this.currentPlayer %= this.players.length;
        } while (this.players[this.currentPlayer].lives !=0)
    }
    startGame() {
        this.started = true;
        this.sendToAll("startGame", {roomId: this.options.id})
        setTimeout(() => {
            this.nextRound()
        }, 3000);
    }
    calculateTime(word) {
        var bonusMultiplier = 1
        if (word.length > this.options.lengthBonusStart) {
            var lengthRange = this.options.lengthBonusEnd - this.options.lengthBonusStart
            var bonusRange = this.options.lengthBonusMax - this.options.lengthBonusMin
            bonusMultiplier = Math.min(
                (word.length - this.options.lengthBonusStart) / lengthRange * bonusRange
                , bonusRange
            ) + bonusRange
        }
        var modifiedAddedTime = this.maxTime
        if (this.combo > this.options.marginStart) {
            modifiedAddedTime = Math.max(this.maxTime-(this.combo-this.marginStart)*this.marginScale, this.minTime)
        }
        return [modifiedAddedTime, bonusMultiplier]
    }
    submitWord(identity, word, substring) {
        word = word.toLowerCase()
        var player = this.players[this.currentPlayer];
        if (identity != player.identity) {
            return
        }
        if (!checkWord(word, substring)) {
            this.sendToAll("failedSubmit", {identity})
            return
        }
        var addedTimes = this.calculateTime()
        turnEnd(...addedTimes)
    }
}

module.exports = Match;