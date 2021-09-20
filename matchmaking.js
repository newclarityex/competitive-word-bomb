const thresholdPerSecond = 10;

const path = require("path")

const { sendClient, queueList, removeQueue } = require(path.join(__dirname, "/globalFunctions"))

function generateUniquePairs(arr) {
    if (arr.length < 2) {
      return []
    }
    var first = arr[0];
    var rest = arr.slice(1);
    var pairs = rest.map((val) => [first, val]);
    return pairs.concat(generateUniquePairs(rest));
}

function validateMatch(pair, matchedPlayers) {
    if (pair[0] in matchedPlayers || pair[1] in matchedPlayers) {
        return false
    }
    var lowestTime = Math.max(pair[0].joinTime, pair[1].joinTime);
    var timeInQueue = (new Date().getTime() - lowestTime) / 1000;
    var ratingDifference = Math.abs(
        pair[0].data.rating - pair[1].data.rating
    );
    if (ratingDifference > thresholdPerSecond * timeInQueue) {
        return false
    }
    return true;
}

function generateMatches(pairs) {
    var generatedMatches = [];
    var matchedPlayers = [];
    for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i];
        if (!validateMatch(pair, matchedPlayers)) {
            continue
        }
        generatedMatches.push(pair);
        matchedPlayers.push(...pair);
    }
    return generatedMatches;
}

function generateRoomId() {
    var result = '';
    for (var i = 6; i > 0; --i) result += Math.floor(Math.random() * 36).toString(36);
    return result.toUpperCase();
}

const Match = require("./ingame-server/Match")
function createRooms(matches, rooms, queue) {
    if (matches.length > 0) {
        for (let i = 0; i < matches.length; i++) {
            const match = matches[i];
            const roomId = generateRoomId()
            var matchOptions = {
                gametype: "ranked",
                private: true,
                id: roomId
            }
            rooms.push(new Match(match, matchOptions))
            sendClient(match[0].client, "console", "Game Started, " + matchOptions.id)
            sendClient(match[1].client, "console", "Game Started" + matchOptions.id)
            removeQueue(queue, match[0].client)
            removeQueue(queue, match[1].client)
        }
    }
}

module.exports = {
    startMatchmaking(queue, rooms) {
        matchmaking = setInterval(() => {
            var pairs = generateUniquePairs(queue);
            var matches = generateMatches(pairs);
            createRooms(matches, rooms, queue);
        }, 1000);
    }
}