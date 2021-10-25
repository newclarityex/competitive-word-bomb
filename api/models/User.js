const { number, string } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const User = new Schema({
    elo: {
        type: Number,
        default: 1300,
    },
    email: String,
    status: String,
    admin: {
        type: Boolean, // So true bestie
        default: false,
    },
    dateJoined: {
        type: Date,
        defualt: Date.now
    },
    gamesWon: {
        type: Number,
        defualt: 0
    },
    gamesLost: {
        type: Number,
        defualt: 0
    },
    lastSeen: {
      type: Date,
      defualt: Date.now  
    },
    bio: String
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", User);
