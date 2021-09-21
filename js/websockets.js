const port = 3000;
const socket = new WebSocket("ws://localhost:" + port);

function sendServer(type, payload) {
    socket.send(JSON.stringify({ type, payload }));
}

socket.addEventListener("message", function (event) {
    let data = JSON.parse(event.data);
    console.log(event.data);
    clientFunctions[data.type](data.payload);
});
