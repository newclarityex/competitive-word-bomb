var match;

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
    addPlayerDiv(username, true);
}
function leaveQueue() {
    sendServer("leaveQueue");
    switchPage("main-menu");
    setTimeout(() => {
        leaveQueueBtn.style.display = "none";
        clearPlayers();
    }, 500);
}

// var wordInput = document.getElementById("wordInput");

// function submitWord() {
//     var word = wordInput.value;
//     wordInput.value = "";
//     sendServer("submitWord", { roomId: match.options.id, word });
// }

// document.getElementById("wordButton").addEventListener("click", () => {
//     submitWord();
// });
// wordInput.onkeydown = function (e) {
//     if (e.keyCode == 13) {
//         submitWord();
//     }
// };
