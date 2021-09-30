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

const User = require("../api/models/User");

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
        if (client.user.id.startsWith("guest")) {
            sendClient(client, "console", "Guests cannot queue matchmaking!");
            return;
        }
        let player = client.user;
        if (
            queue.find(
                (queuedPlayer) =>
                    queuedPlayer.client == client ||
                    queuedPlayer.data._id == player._id
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
        if (client.user.id.startsWith("guest")) {
            sendClient(client, "console", "Guests cannot queue matchmaking!");
            return;
        }
        let player = client.user;
        queue = queue.filter(
            (queuedPlayer) => queuedPlayer.data._id != player._id
        );
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
    disconnect(client) {
        let player = removeQueue(queue, client);
        // setStatus(player, "offline");
    },
};
