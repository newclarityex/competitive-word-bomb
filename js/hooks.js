var joinState = false;
var queueBtn = document.getElementById("queue-button")
queueBtn.addEventListener("click", () => {
    if (joinState) {
        sendServer("leaveQueue");
        queueBtn.textContent = "Join Queue"
        joinState = false
    } else {
        sendServer("joinQueue", {identity});
        queueBtn.textContent = "Leave Queue"
        joinState = true
    }
})