const jwt = require("jsonwebtoken");
const { v4 } = require("uuid");
const User = require("../models/User");
const config = require("../config.json");

const verifyToken = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        req.user = { id: "guest-" + v4(), username: "Guest", admin: false };
        return next();
    }
    try {
        var decoded = jwt.verify(token, config.secret);
    } catch (err) {
        console.log(err);
        return res.status(401).send("Invalid Token.");
    }
    let player = await User.findById(decoded.id).exec();
    if (player === null) {
        return res.status(401).send("User not found.");
    }
    req.user = player;
    return next();
};

module.exports = verifyToken;
