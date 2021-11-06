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
        var userBox = document.getElementsByClassName("user-box")[0];
        var nameBox = userBox.getElementsByClassName("user-name")[0];
        var dateArea = userBox.getElementsByClassName("date")[0];
        var eloArea = userBox.getElementsByClassName("elo")[0];
        var rankArea = userBox.getElementsByClassName("ranking")[0];
        //position number for ranks would be right here but we dont have that yet
        var gameWin = document.getElementById("gamesWon");
        var gameLost = document.getElementById("gamesLost");
        var gamePlay = document.getElementById("gamesPlayed");
        var winsRate = document.getElementById("winRate")
        /* jesus there is going to be alot of var 
        TODO when ranks get added add it */
        
        userBox.classList.remove("hidden");
    }
}