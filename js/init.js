var match;

var joinState = false;

var queueBtn = document.getElementById("queue-button");
queueBtn.addEventListener("click", () => {
    if (joinState) {
        sendServer("leaveQueue");
        queueBtn.textContent = "Join Queue";
        joinState = false;
    } else {
        sendServer("joinQueue");
        queueBtn.textContent = "Leave Queue";
        joinState = true;
    }
});

var wordInput = document.getElementById("wordInput");

function submitWord() {
    var word = wordInput.value;
    wordInput.value = "";
    sendServer("submitWord", { roomId: match.options.id, word });
}

document.getElementById("wordButton").addEventListener("click", () => {
    submitWord();
});
wordInput.onkeydown = function (e) {
    if (e.keyCode == 13) {
        submitWord();
    }
};
