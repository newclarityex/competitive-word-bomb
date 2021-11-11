var pathArray = window.location.pathname.split('/');
var name = pathArray[2];
var mainArea = document.getElementsByClassName("wrapper")[0];

console.log(name);

fetch(`/api/user?username=${name}`).then(response => response.json()).then(data => userBox(data));

function userBox(data) {
    if (data === null){
        console.log("UsernotFound")
        var temp = document.getElementsByTagName("template")[0];
        var clone = temp.content.firstElementChild.cloneNode(true);

        mainArea.appendChild(clone);
    }
    else {
        console.log(data)
        const userBox = document.getElementsByClassName("user-box")[0];
        const nameBox = userBox.getElementsByClassName("user-name")[0];
        const dateArea = userBox.getElementsByClassName("date")[0];
        const eloArea = userBox.getElementsByClassName("elo")[0];
        const rankArea = userBox.getElementsByClassName("ranking")[0]; // need to rember the 
        //position number for ranks would be right here but we dont have that yet
        const progressline = userBox.getElementsByClassName("position-progress")[0];
        const gameWin = document.getElementById("gamesWon");
        const gameLost = document.getElementById("gamesLost");
        const gamePlay = document.getElementById("gamesPlayed");
        const winsRate = document.getElementById("winRate")
        /* jesus there is going to be alot of var 
        TODO when ranks get added add it */
        let joinDate = dateFormater(data.dateJoined);

        nameBox.innerText = data.username;
        dateArea.innerText = joinDate;
        eloArea.innerText = data.elo;
        progressline.setAttribute("style", `--progress: ${(data.elo/2500)*100}%`);
        gameWin.innerText = data.rankedWon;
        gameLost.innerText = data.rankedLost;
        gamePlay.innerText = data.rankedPlayed;
        winsRate.innerText = (data.rankedWon/data.rankedPlayed)*100;
        console.log((0/0)*100)

        userBox.classList.remove("hidden");
    }
}

function dateFormater(string){
    let joinDate = new Date(string);
    const mmddyyyy = [joinDate.getUTCMonth() + 1, joinDate.getUTCDate(), joinDate.getUTCFullYear()];
    return mmddyyyy.join("/");
}