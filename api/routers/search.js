const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/search", (req, res) => {
    let input = req.query.input;
    let reqTime = req.query.reqTime;
    User.find({"username" : {$regex : `${input}`} }, (err, users) => {
        if (err){
            res.sendStatus(500)
            return;
        }
        returnObj = {users, reqTime}
        res.status(200).json(returnObj)
    });
});
module.exports = router;
