var pathArray = window.location.pathname.split('/');
var name = pathArray[2];
var mainArea = document.getElementsByClassName("wrapper")[0];

fetch(`/api/user?username=${name}`).then(response => {
    if (response.ok) {
        response.json().then(data => userBox(data))
    } else { 
        userNotFound();
    }
});

function userBox(data) {
    const userBox = document.getElementsByClassName("user-box")[0];
    const nameBox = userBox.getElementsByClassName("user-name")[0];
    const dateArea = userBox.getElementsByClassName("date")[0];
    const eloArea = userBox.getElementsByClassName("elo")[0];
    const rankArea = userBox.getElementsByClassName("ranking")[0];
    const progressline = userBox.getElementsByClassName("position-progress")[0];
    const gameWin = document.getElementById("gamesWon");
    const gameLost = document.getElementById("gamesLost");
    const gamePlay = document.getElementById("gamesPlayed");
    const winRate = document.getElementById("winRate")
    /* jesus there is going to be alot of var 
    TODO when ranks get added add it */
    let joinDate = dateFormater(data.dateJoined);

    if (data.rankedPlayed === 0) {
        winrate = "N/A";
    } else {
        winrate = (data.rankedWon/data.rankedPlayed)*100;
    }

    nameBox.innerText = data.username;
    dateArea.innerText = joinDate;
    eloArea.innerText = data.elo;
    rankArea.innerText = `#${data.pos + 1}`;
    progressline.setAttribute("style", `--progress: ${(data.elo/2500)*100}%`);
    gameWin.innerText = data.rankedWon;
    gameLost.innerText = data.rankedLost;
    gamePlay.innerText = data.rankedPlayed;
    winRate.innerText = winrate;

    userBox.classList.remove("hidden");
}
function userNotFound() {
    var temp = document.getElementsByTagName("template")[0];
    var clone = temp.content.firstElementChild.cloneNode(true);

    mainArea.appendChild(clone);
}

function dateFormater(string){
    let joinDate = new Date(string);
    const mmddyyyy = [joinDate.getUTCMonth() + 1, joinDate.getUTCDate(), joinDate.getUTCFullYear()];
    return mmddyyyy.join("/");
}
