const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/user", (req, res) => {
<<<<<<< HEAD
    let username = req.query.username;

    User.findOne({username: username}, "username elo admin", {}, (err, user) => {
=======
    let user = req.query.username;
    User.findOne({username: user}, "username elo admin", {}, (err, user) => {
>>>>>>> 61da5714cf3a04177001ec1808405612db786c57
        if (err){
            res.sendStatus(500)
            return;
        }
        res.status(200).json(user)
    });
});
module.exports = router;
