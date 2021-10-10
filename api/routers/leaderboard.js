const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/leaderboard", (req, res) => {
    // what is first entry
    let skip = parseInt(req.query.skip);
    let limit = 50;

    if (!skip){
        skip = 0;
    }

    User.find({}, null, {skip, limit, sort: {elo : -1}}, (err, users) => {
        if (err){
            res.sendStatus(500)
            return;
        }
        res.status(200).json(users)
    });
    // load more
});

