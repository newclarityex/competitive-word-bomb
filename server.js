const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const rateLimit = require("express-rate-limit");
const fs = require("fs");

const uri = fs.readFileSync("./api/mongodb-uri.txt", { encoding: "utf8" });
mongoose.connect(uri, { sslValidate: false });

const User = require("./api/schemas/User");
// User.register({ username: "username" }, "password", function (err, user) {
//     if (err) {
//         console.log(err);
//     }

//     var authenticate = User.authenticate();
//     authenticate("username", "password", function (err, result) {
//         console.log(err);
//         console.log(result);
//     });
// });

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
});

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
    ws.on("message", function (data) {
        data = JSON.parse(data);
        serverFunctions[data.type](ws, data.payload);
    });
    ws.on("close", function () {
        serverFunctions["leaveQueue"](ws);
    });
});

app.use("/api/", apiLimiter);

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});
