class Player {
    constructor (data) {
        this.id = data.id;
        this.lives = data.lives;
        this.username = data.username;
        this.elo = data.elo;
        this.element;
    }
    updateLives() {
        let livesEle = this.element.getElementsByClassName("ingame-lives")[0]
        livesEle.textContent = "❤️".repeat(this.lives)
    }
    updateWord(word) {
        this.element.getElementsByClassName("opponent-word")[0].textContent = word;
    }
}