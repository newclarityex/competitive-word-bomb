const express = require("express");
const router = express.Router();
const config = require("../config.json");

const User = require("../models/User");

const authenticationSchema = require("../validationSchemas/authentication");
const censorLib = require("censor-sensor");
const censor = new censorLib.CensorSensor();
censor.disableTier(5);
censor.disableTier(4);
censor.disableTier(3);
censor.disableTier(2);

const jwt = require("jsonwebtoken");

router.post("/register", (req, res) => {
    let body = req.body;

    const { error } = authenticationSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error });

    if (censor.isProfane(body.username)) {
        return res.status(400).send("Inappropriate Username.");
    }

    let userData = { username: body.username };
    if (body.email) {
        userData.email = body.email;
    }

    User.register(userData, body.password, function (err, user) {
        if (err) {
            if (err.name == "UserExistsError") {
                return res.status(400).send("User already exists!");
            }
            return res
                .status(500)
                .send("Unable to register user, please try again later.");
        }
        let token = jwt.sign(
            { id: user.id, username: user.username, admin: user.admin },
            process.env.SECRET || config.secret,
            { expiresIn: 60 * 60 * 24 * 365 }
        );
        res.cookie("token", token, { maxAge: 900000, httpOnly: true });
        return res.sendStatus(200);
    });
});

router.post("/login", (req, res) => {
    let body = req.body;

    const { error } = authenticationSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error });

    let authenticate = User.authenticate();
    authenticate(body.username, body.password, function (err, user) {
        if (err) {
            console.log(err);
            return res
                .status(500)
                .send("Unable to login, please try again later.");
        }
        let token = jwt.sign(
            { id: user.id, username: user.username, admin: user.admin },
            config.secret,
            { expiresIn: 60 * 60 * 24 * 365 }
        );
        res.cookie("token", token, { maxAge: 900000, httpOnly: true });
        return res.sendStatus(200);
    });
});

module.exports = router;
