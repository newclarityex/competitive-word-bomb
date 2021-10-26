const { sendClient } = require("../globalFunctions");

const User = require("../../api/models/User");

class Player {
    constructor(client, player, options) {
        this.client = client;
        this.id = player._id;
        this.username = player.username;
        this.lives = options.startingLives;
        this.remainingTime = options.startingTime;
        this.maxTime = options.maxTime;
        this.elo = player.elo;
    }
    lostLife(match) {
        this.lives--;
        this.remainingTime = match.options.startingTime;
        if (this.lives == 0) {
            match.playerLost(this);
            return;
        }
        match.sendAll("lifeLost", { id: this.id });
        match.nextRound(true);
    }
    startTurn(match) {
        this.startTime = new Date().getTime();
        this.countdownTimeout = setTimeout(() => {
            this.lostLife(match);
        }, 1000 * this.remainingTime);
    }
    endTurn(match, addedTime, bonusMultiplier) {
        clearTimeout(this.countdownTimeout);
        this.remainingTime -= (new Date().getTime() - this.startTime) / 1000;
        console.log(this.remainingTime, addedTime, bonusMultiplier);
        this.remainingTime += addedTime * bonusMultiplier;
        this.remainingTime = parseInt(this.remainingTime);
        match.sendAll("endTurn", {
            player: this._id,
            time: this.remainingTime,
            addedTime,
            bonusMultiplier,
        });
        match.nextRound(false);
    }
    setElo(elo) {
        User.findByIdAndUpdate(this.client.user._id, { elo }, (err) => {
            if (err) {
                console.log(err);
            }
        });
    }
}

module.exports = Player;
