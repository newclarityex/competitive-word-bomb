const clientFunctions = {
    console: (payload) => {
        console.log(payload);
    },
    matchFound: (payload) => {},
    matchData: (payload) => {
        console.log(payload.players);
        match = new Match(JSON.parse(payload.players), payload.options);
        if (match.options.gametype == "ranked") {
            match.opponent = match.players.find(
                (player) => player.id != user_id
            );
            addPlayerDiv(match.opponent.username, false);
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
