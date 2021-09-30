const User = require("../api/models/User");

module.exports = {
    sendClient(client, type, payload) {
        client.send(JSON.stringify({ type, payload }));
    },
    setStatus(player, status) {
        User.findByIdAndUpdate(player.id, { status });
    },
    removeQueue(queue, client) {
        for (let i = queue.length - 1; i >= 0; i--) {
            const player = queue[i];
            if (client == player.client) {
                var removedPlayer = player.data;
                queue.splice(i, 1);
            }
        }
        return removedPlayer;
    },
    queueList(queue) {
        return JSON.stringify(queue.map((player) => player.data.username));
    },
    // future security
    validatePlayer(validater) {
        return;
    },
};
