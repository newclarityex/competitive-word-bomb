const port = 3000
const socket = new WebSocket('ws://localhost:' + port);

function sendServer(type, payload) {
    socket.send(JSON.stringify({type, payload}))
}

socket.addEventListener('open', function (event) {

});

socket.addEventListener('message', function (event) {
    var data = JSON.parse(event.data)
    console.log(event.data)
    clientFunctions[data.type](data.payload);
});

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