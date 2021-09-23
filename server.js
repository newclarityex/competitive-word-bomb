const express = require("express");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const port = process.env.PORT || 3000;
const app = express();
const expressWs = require("express-ws")(app);

app.use(express.static(path.join(__dirname, "/html")));
app.use(express.static(path.join(__dirname, "/js")));

const serverFunctions = require(path.join(
    __dirname,
    "./server-websockets/serverFunctions"
));

app.ws("/", function (ws, req) {
    ws.id = uuidv4();
    ws.on("message", function (data) {
        data = JSON.parse(data);
        serverFunctions[data.type](ws, data.payload);
    });
    ws.on("close", function () {
        serverFunctions["leaveQueue"](ws);
    });
});

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});
