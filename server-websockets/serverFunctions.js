var players = [];
var queue = [];
var rooms = [];

const path = require("path");

const Match = require(path.join(__dirname, "./ingame/Match"));
const {
    sendClient,
    removeQueue,
    queueList,
    setStatus,
    generateRoomId,
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
    joinCasual(client, payload) {
        let availableRooms = rooms.filter(
            (room) =>
                room.players.length < 4 &&
                room.started == false &&
                !room.private
        );
        if (availableRooms.length == 0) {
            const roomId = generateRoomId();
            let matchOptions = {
                gametype: "casual",
                private: false,
                id: roomId,
            };
            let newRoom = new Match(
                [{ data: client.user, client }],
                matchOptions
            );
            rooms.push(newRoom);
            client.room = newRoom;
        } else {
            availableRooms[0].addPlayer({ data: client.user, client });
            client.room = availableRooms[0];
        }
    },
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
                    queuedPlayer.data.id == player.id
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
        let player = removeQueue(queue, client);
        if (player) {
            setStatus(player, "online");
        }
        sendClient(client, "console", "Leave queue." + queueList(queue));
    },
    editWord(client, payload) {
        let room = client.room;
        if (!checkTurn(client, room)) {
            sendClient(client, "console", "Unable to edit word.");
            return;
        }
        room.sendAll("editWord", {
            id: room.players[room.currentPlayer].id,
            word: payload.word,
        });
    },
    submitWord(client, payload) {
        let room = client.room;
        let check = checkTurn(client, room);
        if (!check.status) {
            sendClient(
                client,
                "console",
                "Unable to submit word. Error: " + check.error
            );
            return;
        }
        room.submitWord(client, payload.word, room.substring);
    },
    startCasual(client, payload) {
        let room = client.room;
        room.startGame();
    },
    disconnect(client) {
        let player = removeQueue(queue, client);
        // setStatus(player, "offline");
    },
};
