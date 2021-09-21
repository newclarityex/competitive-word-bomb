module.exports = {
    sendClient(client, type, payload) {
        client.send(JSON.stringify({ type, payload }));
    },
    setStatus(player, status) {
        player.status = status;
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
        return JSON.stringify(queue.map((player) => player.data.identity));
    },
    // future security
    validatePlayer(validater) {
        return;
    },
};
