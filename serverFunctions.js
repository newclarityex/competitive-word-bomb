var players = []
var queue = []
var rooms = []

const path = require("path")

const { sendClient, removeQueue, queueList, setStatus, validatePlayer } = require(path.join(__dirname, "/globalFunctions"))
const matchmakingFunctions = require(path.join(__dirname, "/matchmaking"))
matchmakingFunctions.startMatchmaking(queue, rooms)

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function getOrCreatePlayer(identity) {
    var player=players.find((tempid)=>tempid==identity)
    if(!player){
        player={
            identity,elo:2000, status:"offline", validater:uuidv4()
        }
        players.push(player)
    }
    return player
}

function getRoom(roomId) {
    return rooms.find(room => room.id == roomId)
}

module.exports = {
    joinQueue(client, payload) {
        var player = getOrCreatePlayer(payload.identity);
        if (queue.find((player)=>player.client==client || player.data.identity == payload.identity || player.data.status == "ingame")) {
            sendClient(client, "console", "Already in queue!" + queueList(queue))
            return
        }
        queue.push({data:player, client, joinTime:new Date().getTime()})
        sendClient(client, "console", "Joined queue." + queueList(queue))
    },
    leaveQueue(client) {
        var player = removeQueue(queue, client);
        setStatus(player, "online")
        sendClient(client, "console", "Leave queue." + queueList(queue))
    },
    submitWord(client, payload) {
        var room = getRoom(payload.roomId)
        if (!room) {
            sendClient(client, "console", "Unable to submit word, room not found.")
            return
        }
        if (!room.started) {
            sendClient(client, "console", "Unable to submit word, game not started.")
            return
        }
        // future security
        // if (validatePlayer(payload.validater) != room.players[room.currentPlayer].identity) {
        if (payload.identity != room.players[room.currentPlayer].identity) {
            sendClient(client, "console", "Unable to submit word, not your turn!")
            return
        }
        room.submitWord(payload.identity, payload.word, payload.substring)
    },
    connect(client, payload) {
        var player = getOrCreatePlayer(payload.identity);
        setStatus(player, "offline")
    },
    disconnect(client) {
        var player = removeQueue(queue, client);
        setStatus(player, "offline")
    }
}