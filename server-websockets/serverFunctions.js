var players = [];
var queue = [];
var rooms = [];

const path = require("path");

const {
    sendClient,
    removeQueue,
    queueList,
    setStatus,
    validatePlayer,
} = require(path.join(__dirname, "/globalFunctions"));
const matchmakingFunctions = require(path.join(__dirname, "/matchmaking"));
matchmakingFunctions.startMatchmaking(queue, rooms);

function uuidv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
            let r = (Math.random() * 16) | 0,
                v = c == "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        }
    );
}

function getOrCreatePlayer(identity) {
    let player = players.find((tempid) => tempid == identity);
    if (!player) {
        player = {
            identity,
            elo: 2000,
            status: "offline",
            validater: uuidv4(),
        };
        players.push(player);
    }
    return player;
}

function getRoom(roomId) {
    return rooms.find((room) => room.id == roomId);
}

function checkTurn(client, room) {
    if (!room) {
        return { status: false, error: "Room doesn't exist" };
    }
    if (!room.started) {
        return { status: false, error: "Room hasn't started" };
    }
    if (client != room.players[room.currentPlayer].client) {
        return { status: false, error: "Not your turn!" };
    }
    return { status: true };
}

module.exports = {
    joinQueue(client, payload) {
        let player = getOrCreatePlayer(payload.identity);
        if (
            queue.find(
                (player) =>
                    player.client == client ||
                    player.data.identity == payload.identity ||
                    player.data.status == "ingame"
            )
        ) {
            sendClient(
                client,
                "console",
                "Already in queue!" + queueList(queue)
            );
            return;
        }
        queue.push({ data: player, client, joinTime: new Date().getTime() });
        sendClient(client, "console", "Joined queue." + queueList(queue));
    },
    leaveQueue(client) {
        let player = removeQueue(queue, client);
        setStatus(player, "online");
        sendClient(client, "console", "Leave queue." + queueList(queue));
    },
    editWord(client, payload) {
        let room = getRoom(payload.roomId);
        if (!checkTurn(client, room)) {
            sendClient(client, "console", "Unable to edit word.");
            return;
        }
        room.sendAll("editWord", { word: payload.word });
    },
    submitWord(client, payload) {
        let room = getRoom(payload.roomId);
        let check = checkTurn(client, room);
        if (!check.status) {
            sendClient(
                client,
                "console",
                "Unable to submit word. Error: " + check.error
            );
            return;
        }
        room.submitWord(payload.identity, payload.word, room.substring);
    },
    connect(client, payload) {
        let player = getOrCreatePlayer(payload.identity);
        setStatus(player, "online");
    },
    disconnect(client) {
        let player = removeQueue(queue, client);
        // setStatus(player, "offline");
    },
};
