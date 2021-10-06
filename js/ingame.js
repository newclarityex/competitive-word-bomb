var players = 0;
function addPlayerDiv(isSelf) {
    let curplayer = players + 1;
    let player = document.getElementById("player" + curplayer);
    player.style.display = "flex";
    players++;
    if (isSelf) {
        player.getElementsByClassName("opponent-word")[0].style.display =
            "none";
    }
}

function clearPlayers() {
    const players = document.getElementsByClassName("ingame-player");
    for (let i = 0; i < players.length; i++) {
        const element = players[i];
        element.style.display = "none";
    }
}
