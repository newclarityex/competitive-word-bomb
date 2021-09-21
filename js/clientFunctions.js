const clientFunctions = {
    console: (payload) => {
        console.log(payload);
    },
    matchFound: (payload) => {
        console.log("Match Found!");
    },
    matchData: (payload) => {
        match = new Match(payload.players, payload.options);
    },
    startTurn: (payload) => {
        match.startTurn(payload.player, payload.substring, payload.time);
    },
};
