const express = require("express");
const rateLimit = require("express-rate-limit");
const router = express.Router();

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 600,
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
})

router.use("/leaderboard", apiLimiter);
router.use("/search", apiLimiter);
router.use("/userData", apiLimiter);
router.use("/authentication", authLimiter);

module.exports = router;