const thresholdPerSecond = 10;

const path = require("path");

const { sendClient, queueList, removeQueue } = require(path.join(
    __dirname,
    "./globalFunctions"
));

function generateUniquePairs(arr) {
    if (arr.length < 2) {
        return [];
    }
    let first = arr[0];
    let rest = arr.slice(1);
    let pairs = rest.map((val) => [first, val]);
    return pairs.concat(generateUniquePairs(rest));
}

function validateMatch(pair, matchedPlayers) {
    if (pair[0] in matchedPlayers || pair[1] in matchedPlayers) {
        return false;
    }
    let lowestTime = Math.max(pair[0].joinTime, pair[1].joinTime);
    let timeInQueue = (new Date().getTime() - lowestTime) / 1000;
    let ratingDifference = Math.abs(pair[0].data.elo - pair[1].data.elo);
    if (ratingDifference > thresholdPerSecond * timeInQueue) {
        return false;
    }
    return true;
}

function generateMatches(pairs) {
    let generatedMatches = [];
    let matchedPlayers = [];
    for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i];
        if (!validateMatch(pair, matchedPlayers)) {
            continue;
        }
        generatedMatches.push(pair);
        matchedPlayers.push(...pair);
    }
    return generatedMatches;
}

function generateRoomId() {
    let result = "";
    for (let i = 6; i > 0; --i)
        result += Math.floor(Math.random() * 36).toString(36);
    return result.toUpperCase();
}

const Match = require(path.join(__dirname, "./ingame/Match"));
function createRooms(matches, rooms, queue) {
    if (matches.length > 0) {
        for (let i = 0; i < matches.length; i++) {
            const match = matches[i];
            const roomId = generateRoomId();
            let matchOptions = {
                gametype: "ranked",
                private: true,
                id: roomId,
            };
            rooms.push(new Match(match, matchOptions));
            removeQueue(queue, match[0].client);
            removeQueue(queue, match[1].client);
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
    },
};
