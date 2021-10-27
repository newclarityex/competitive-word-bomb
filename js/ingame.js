var players = 0;
function addPlayerDiv(username, isSelf, elo) {
    console.log("Adding player: " + username);
    let curplayer = players + 1;
    let player = document.getElementById("player" + curplayer);
    player.style.display = "flex";
    players++;
    player.getElementsByClassName("ingame-username")[0].textContent = username;
    if (isSelf) {
        player.getElementsByClassName("opponent-word")[0].style.display =
            "none";
    } else {
        player.getElementsByClassName("ingame-input")[0].style.display = "none";
    }
    if (players > 1) {
        loadingText.style.display = "none";
    }
    player.getElementsByClassName("opponent-word")[0].textContent = "";
    player.getElementsByClassName("ingame-timer")[0].textContent = "";
    player.getElementsByClassName("ingame-lives")[0].textContent = "";
    player.getElementsByClassName("ingame-elo")[0].style.color = "white";
    if (ranked) {
        player.getElementsByClassName(
            "ingame-elo"
        )[0].textContent = `${elo} ELO`;
        player.getElementsByClassName("ingame-elo")[0].style.display = "block";
    } else {
        player.getElementsByClassName("ingame-elo")[0].style.display = "none";
    }
    return player;
}

function clearPlayers() {
    const players = document.getElementsByClassName("ingame-player");
    for (let i = 0; i < players.length; i++) {
        const element = players[i];
        element.style.display = "none";
    }
    loadingText.style.display = "grid";
}
