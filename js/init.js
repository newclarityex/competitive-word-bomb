var match;
var playerContainer;

const substringDiv = document.getElementById("substring");
// sendServer("leaveQueue");
const leaveQueueBtn = document.getElementById("leave-queue");
const leaveRoomBtn = document.getElementById("leave-room");

const loadingText = document.getElementsByClassName("finding-player")[0];
var dots = 0;
setInterval(() => {
    loadingText.textContent = "Searching for players";
    for (let i = 0; i < dots; i++) {
        loadingText.textContent += ".";
    }
    dots++;
    dots = dots % 4;
}, 1000);

var ranked;

function joinQueue() {
    ranked = true;
    sendServer("joinQueue");
    leaveQueueBtn.style.display = "block";
    switchPage("ingame");
    players = 0;
    playerContainer = addPlayerDiv(username, true, userData.elo);
}
function leaveQueue() {
    ranked = false;
    sendServer("leaveQueue");
    switchPage("main-menu");
    setTimeout(() => {
        leaveQueueBtn.style.display = "none";
        clearPlayers();
    }, 500);
}

var casualBtn = document.getElementsByClassName("gamemode-button casual")[0];
function joinCasual() {
    sendServer("joinCasual");
    casualBtn.disabled = true;
    substringDiv.textContent = "Start";
    substringDiv.style.display = "grid";
    substringDiv.style.opacity = 1;
    substringDiv.onclick = () => {
        sendServer("startCasual");
    };
}

function leaveRoom() {
    ranked = false;
    sendServer("leaveRoom");
    switchPage("main-menu");
    casualBtn.disabled = true;
    setTimeout(() => {
        leaveRoomBtn.style.display = "none";
        clearPlayers();
    }, 500);
}

let inputs = document.getElementsByClassName("ingame-input");

for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i];
    input.onkeydown = function (e) {
        sendServer("editWord", { roomId: match.options.id, word: input.value });
        if (e.keyCode == 13) {
            submitWord(input.value);
            input.value = "";
        }
    };
}
function submitWord(word) {
    sendServer("submitWord", { roomId: match.options.id, word: word });
}
