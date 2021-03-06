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
    body.username = body.username.toLowerCase();

    const { error } = authenticationSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

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
        let data = { id: user.id, username: user.username, admin: user.admin };
        let token = jwt.sign(data, process.env.SECRET || config.secret, {
            expiresIn: 60 * 60 * 24 * 365,
        });
        res.cookie("token", token, { httpOnly: true });
        return res.status(200).send(data);
    });
});

router.post("/login", (req, res) => {
    let body = req.body;
    body.username = body.username.toLowerCase();

    const { error } = authenticationSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let authenticate = User.authenticate();
    authenticate(body.username, body.password, function (err, user) {
        if (err) {
            console.log(err);
            return res
                .status(500)
                .send("Unable to login, please try again later.");
        }
        if (!user) {
            return res.status(400).send("Invalid credentials.");
        }
        let data = { id: user.id, username: user.username, admin: user.admin };
        let token = jwt.sign(data, config.secret);
        res.cookie("token", token, {
            maxAge: 100 * 365 * 24 * 60 * 60,
            httpOnly: true,
        });
        return res.status(200).send(data);
    });
});

router.post("/logout", (req, res) => {
    res.clearCookie("token");
    return res.sendStatus(200);
});

module.exports = router;
