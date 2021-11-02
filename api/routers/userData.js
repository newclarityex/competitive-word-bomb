const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/user", (req, res) => {
    let user = req.query.username;
    User.findOne({username: user}, "username elo admin", {}, (err, user) => {
        if (err){
            res.sendStatus(500)
            return;
        }
        res.status(200).json(user)
    });
});
module.exports = router;
