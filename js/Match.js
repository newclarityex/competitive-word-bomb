class Match {
    constructor(players, options) {
        this.players = players
        this.options = options
    }
    startTurn(player, substring, time) {
        document.getElementById("substring").textContent = substring
        if (player == identity) {
            console.log("YOUR TURN");
        }
        clearInterval(this.countdown)
        document.getElementById("timer").textContent = time + " seconds."
        var startTime = new Date().getTime()
        var this_ = this
        this.countdown = setInterval(() => {
            var curTime = time - parseInt((new Date().getTime() - startTime) / 1000)
            document.getElementById("timer").textContent = Math.max(curTime,0) + " seconds."
            if (curTime <= 0) {
                clearInterval(this_.countdown)
            }
        }, 1000);
    }
}