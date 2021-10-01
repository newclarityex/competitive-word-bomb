const jwt = require("jsonwebtoken");
const { v4 } = require("uuid");
const User = require("../models/User");
const config = require("../config.json");

function createGuest() {
    return { id: "guest-" + v4(), username: "Guest", admin: false };
}

const verifyToken = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        req.user = createGuest();
        return next();
    }
    try {
        var decoded = jwt.verify(token, config.secret);
    } catch (err) {
        console.log(err);
        req.user = createGuest();
        return next();
    }
    let player = await User.findById(decoded.id).exec();
    if (player === null) {
        req.user = createGuest();
        return next();
    }
    req.user = player;
    return next();
};

module.exports = verifyToken;
