const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const rateLimit = require("express-rate-limit");
const fs = require("fs");
const cookieParser = require("cookie-parser");

const uri = fs.readFileSync("./api/mongodb-uri.txt", { encoding: "utf8" });
mongoose.connect(uri, { sslValidate: false });

const User = require("./api/models/User");

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
});

const port = process.env.PORT || 80;
const app = express();
const expressWs = require("express-ws")(app);

app.use(express.json());
app.use(cookieParser());

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/html/index.html"));
});

app.use(
    express.static(path.join(__dirname, "/html"), {
        index: false,
        extensions: ["html"],
    })
);
app.use(express.static(path.join(__dirname, "/js")));
app.use(express.static(path.join(__dirname, "/css")));
app.use(express.static(path.join(__dirname, "/img")));

const serverFunctions = require(path.join(
    __dirname,
    "./server-websockets/serverFunctions"
));


const userDataRouter = require(path.join(
    __dirname,
    "/api/routers/userData"
));
app.use("/api", userDataRouter);

const authorizationMiddleware = require(path.join(
    __dirname,
    "/api/middleware/authorization"
));
app.use("/", authorizationMiddleware);

const { sendClient } = require("./server-websockets/globalFunctions");

app.ws("/", function (ws, req) {
    ws.user = req.user;
    ws.on("message", function (data) {
        try {
            data = JSON.parse(data);
        } catch (error) {
            sendClient(ws, "console", "Invalid socket request.");
            return
        }
        if (!(data.type in serverFunctions)) {
            sendClient(ws, "console", "Invalid socket request.");
            return
        }
        serverFunctions[data.type](ws, data.payload);
    });
    ws.on("close", function () {
        serverFunctions["leaveQueue"](ws);
    });
});


app.use("/api/", apiLimiter);

const authenticationRouter = require(path.join(
    __dirname,
    "/api/routers/authentication"
));
app.use("/api", authenticationRouter);

const leaderboardRouter = require(path.join(
    __dirname,
    "/api/routers/leaderboard"
));
app.use("/api", leaderboardRouter);

app.get('/user/:username', function(req, res) {
    res.sendFile(path.join(__dirname, 'html/user.html'));
});

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});
