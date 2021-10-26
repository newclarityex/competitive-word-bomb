const clientFunctions = {
    console: (payload) => {
        console.log(payload);
    },
    matchFound: (payload) => {},
    matchData: (payload) => {
        match = new Match(JSON.parse(payload.players), payload.options);
        if (match.options.gametype == "ranked") {
            leaveQueueBtn.style.display = "none";
            match.opponent = match.players.find(
                (player) => player.id != user_id
            );
            addPlayerDiv(match.opponent.username, false, match.opponent.elo);
        }
    },
    startGame: (payload) => {
        match.startGame();
    },
    startTurn: (payload) => {
        match.startTurn(
            payload.player,
            payload.substring,
            payload.time,
            payload.currentPlayer
        );
    },
    endTurn: (payload) => {
        match.endTurn(payload.player, payload.time);
    },
};
