var players = []
var queue = []
var rooms = []

const path = require("path")

const { sendClient, removeQueue, queueList, setStatus } = require(path.join(__dirname, "/globalFunctions"))
const matchmakingFunctions = require(path.join(__dirname, "/matchmaking"))
matchmakingFunctions.startMatchmaking(queue, rooms)


function getOrCreatePlayer(identity) {
    var player=players.find((tempid)=>tempid==identity)
    if(!player){
        player={
            identity,elo:2000, status:"offline"
        }
        players.push(player)
    }
    return player
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
        var room = rooms.find(room => room.id == payload.roomId)
        if (!room) {
            sendClient(client, "console", "Unable to submit word, room not found.")
            return
        }
        if (!room.started) {
            sendClient(client, "console", "Unable to submit word, game not started.")
            return
        }
        if (payload.identity != room.players[room.currentPlayer].identity) {
            sendClient(client, "console", "Unable to submit word, not your turn!")
            return
        }
        room.submitWord(payload.identity, payload.word, payload.substring)
    },
    disconnect(client) {
        var player = removeQueue(queue, client);
        setStatus(player, "offline")
    }
}