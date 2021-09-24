const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const User = new Schema({
    elo: {
        type: Number,
        default: 1500,
    },
    email: String,
    admin: {
        type: Boolean,
        default: false,
    },
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", User);
