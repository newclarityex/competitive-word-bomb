const { sendClient } = require("../globalFunctions");

class Player {
    constructor(client, player, options) {
        this.client = client;
        this.identity = player.identity;
        this.lives = options.startingLives;
        this.remainingTime = options.startingTime;
        this.maxTime = options.maxTime;
    }
    lostLife(match) {
        this.lives--;
        this.remainingTime = match.options.startingTime;
        if (this.lives == 0) {
            match.playerLost(this);
            return;
        }
        match.sendAll("lifeLost", { identity: this.identity });
        match.nextRound();
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
            identity: this.identity,
            addedTime,
            bonusMultiplier,
        });
        match.nextRound();
    }
}

module.exports = Player;
