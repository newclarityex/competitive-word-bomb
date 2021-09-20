const { sendClient } = require("../globalFunctions");

class Player {
    constructor (client, player, options) {
        this.client = client
        this.identity = player.identity;
        this.lives = options.startingLives;
        this.remainingTime = options.startingTime;
        this.maxTime = options.maxTime;
    }
    lostLife(match) {
        this.lives--;
        if (lives == 0) {
            match.playerLost(this)
            return;
        }
        match.sendToAll("lifeLost", {identity:this.identity})
        match.nextRound();
    }
    turnStart(match) {
        this.countdownInterval = setInterval(() => {
            this.remainingTime--;
            if (remainingTime == 0) {
                this.lostLife(match)
            }
        }, 1000);
    }
    turnEnd(addedTime, bonusMultiplier) {
        clearInterval(this.countdownInterval)
        this.remainingTime += addedTime * bonusMultiplier
        match.sendToAll("turnEnd", {identity:this.identity, addedTime, bonusMultiplier})
        match.nextRound();
    }
}

module.exports = Player;