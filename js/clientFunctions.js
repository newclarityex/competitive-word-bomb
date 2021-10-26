const clientFunctions = {
    console: (payload) => {
        console.log(payload);
    },
    matchFound: (payload) => {},
    matchData: (payload) => {
        match = new Match(payload.players, payload.options);
        if (match.options.gametype == "ranked") {
            leaveQueueBtn.style.display = "none";
            match.opponent = match.players.find(
                (player) => player.id != user_id
            );
            let element = addPlayerDiv(match.opponent.username, false, match.opponent.elo);
            match.opponent.element = element
            
            match.self = match.players.find(
                (player) => player.id == user_id
            );
            match.self.element = playerContainer

            match.opponent.updateLives();
            match.self.updateLives();
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
    lifeLost: (payload) => {
        match.removeLife(payload.id)
    },
    gameOver: (payload) => {
        match.gameOver(payload)
    }
};
