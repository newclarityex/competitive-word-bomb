const clientFunctions = {
    console: (payload) => {
        console.log(payload);
    },
    matchFound: (payload) => {},
    matchData: (payload) => {
        payload.players = JSON.parse(payload.players);
        match = new Match(payload.players, payload.options);
        if (match.options.gametype == "ranked") {
            leaveQueueBtn.style.display = "none";
            match.opponent = match.players.find(
                (player) => player.id != user_id
            );
            let element = addPlayerDiv(
                match.opponent.username,
                false,
                match.opponent.elo
            );
            match.opponent.element = element;

            match.self = match.players.find((player) => player.id == user_id);
            match.self.element = playerContainer;

            match.opponent.updateLives();
            match.self.updateLives();
        } else {
            leaveRoomBtn.style.display = "block";
            switchPage("ingame");
            players = 0;
            for (let i = 0; i < payload.players.length; i++) {
                const player = payload.players[i];
                console.log(player);
                playerContainer = addPlayerDiv(
                    player.username,
                    player.id == user_id
                );
                match.players[i].element = playerContainer;
                match.players[i].updateLives();
            }
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
        match.removeLife(payload.id);
    },
    editWord: (payload) => {
        match.editWord(payload.id, payload.word);
    },
    gameOver: (payload) => {
        match.gameOver(payload);
    },
    playerJoined: (payload) => {
        match.addPlayer(payload);
    },
};
