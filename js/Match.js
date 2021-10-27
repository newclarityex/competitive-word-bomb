function getTimer(id) {
    return document
        .getElementById(id)
        .getElementsByClassName("ingame-timer")[0];
}

function enableInput() {
    let input = playerContainer.getElementsByClassName("ingame-input")[0];
    input.disabled = false;
    input.focus();
}

function disableInput() {
    let input = playerContainer.getElementsByClassName("ingame-input")[0];
    input.disabled = true;
    input.value = "";
}

const colors = ["#912f56", "#527a54", "#004777", "#8b912f"];

class Match {
    constructor(players, options) {
        this.players = JSON.parse(players).map(player => new Player(player));
        this.options = options;
        this.currentPlayer = 0;
    }
    startGame() {
        substringDiv.style.backgroundColor = "#9a348e"
        substringDiv.style.opacity = 1;
        let num = 3;
        substringDiv.textContent = num;
        var countdown = setInterval(() => {
            if (num == 1) {
                clearInterval(countdown);
                return;
            }
            num--;
            substringDiv.textContent = num;
        }, 1000);
    }
    startTurn(player, substring, time, currentPlayer) {
        if (player == user_id) {
            enableInput();
        } else {
            disableInput();
        }

        // Timer
        clearInterval(this.countdown);
        if (this.options.gametype == "ranked") {
            if (player == user_id) {
                currentPlayer = 0;
            } else {
                currentPlayer = 1;
            }
        }
        this.currentPlayer = currentPlayer;
        substringDiv.textContent = substring;
        substringDiv.style.backgroundColor = colors[currentPlayer];

        let timer = getTimer("player" + (currentPlayer + 1));
        timer.textContent = time - 1;
        let startTime = new Date().getTime();
        let this_ = this;
        this.countdown = setInterval(() => {
            let curTime =
                time - parseInt((new Date().getTime() - startTime) / 1000) - 1;
            timer.textContent = Math.max(curTime, 0);
            if (curTime <= 0) {
                clearInterval(this_.countdown);
            }
        }, 1000);
    }
    endTurn(player, time) {
        let timer = getTimer("player" + (this.currentPlayer + 1));
        timer.textContent = time;
    }
    removeLife(id) {
        let player = this.players.find(player => player.id == id)
        player.lives--;
        player.updateLives()
        console.log("lives updated");
    }
    editWord(id, word) {
        if (id == this.self.id) {
            return;
        }

        let player = this.players.find(player => player.id == id)
        player.updateWord(word);
    }
    gameOver(payload) {
        disableInput();

        substringDiv.style.opacity = 0;

        if (ranked) {
            let winner = this.players.find(player => player.id == payload.winner)
            let loser = this.players.find(player => player.id != payload.winner)

            loser.lives = 0
            loser.updateLives()

            let winnerEloElement = winner.element.getElementsByClassName("ingame-elo")[0]
            let loserEloElement = loser.element.getElementsByClassName("ingame-elo")[0]

            winnerEloElement.style.color = "lightgreen"
            loserEloElement.style.color = "#ff6169"

            winnerEloElement.textContent = `${winner.elo + payload.eloDiff} ELO (+${payload.eloDiff})`
            loserEloElement.textContent = `${loser.elo - payload.eloDiff} ELO (-${payload.eloDiff})`

            if (winner.id == this.self.id) {
                userData.elo = winner.elo + payload.eloDiff
            } else {
                userData.elo = loser.elo - payload.eloDiff
            }
        }
        
        leaveRoomBtn.style.display = "block";
    }
}
