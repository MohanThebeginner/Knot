const rateLimit = require("express-rate-limit");

module.exports.limiter = rateLimit({
    windowMs: 15*60*1000,
    max:100,
    message:{error:"Too many requests, Slow down."}
});

module.exports.authLimiter = rateLimit({
    windowMs: 15*60*1000,
    max:10,
    message:{error:"Too many login attempts."}
});