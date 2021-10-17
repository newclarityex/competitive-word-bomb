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

function joinQueue() {
    sendServer("joinQueue");
    leaveQueueBtn.style.display = "block";
    switchPage("ingame");
    players = 0;
    playerContainer = addPlayerDiv(username, true);
    console.log(playerContainer);
}
function leaveQueue() {
    sendServer("leaveQueue");
    switchPage("main-menu");
    setTimeout(() => {
        leaveQueueBtn.style.display = "none";
        clearPlayers();
    }, 500);
}

let inputs = document.getElementsByClassName("ingame-input");

for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i];
    input.onkeydown = function (e) {
        if (e.keyCode == 13) {
            submitWord(input);
        }
    };
}
function submitWord(input) {
    sendServer("submitWord", { roomId: match.options.id, word: input.value });
    input.value = "";
}
