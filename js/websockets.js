const socket = new WebSocket("ws://" + location.host);

socket.addEventListener("open", (event) => {
    console.log("Successfully connected!");
});

function sendServer(type, payload) {
    socket.send(JSON.stringify({ type, payload }));
}

socket.addEventListener("message", function (event) {
    let data = JSON.parse(event.data);
    console.log(event.data);
    clientFunctions[data.type](data.payload);
});
