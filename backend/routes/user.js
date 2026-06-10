const express = require('express');
const router = express.Router();
const {body} = require("express-validator")
const authCon = require("../controllers/authCon");
const {authLimiter} = require("../middleware/rateLimiter");


router.get("/signup", (req,res) => {
    res.send('Signup route working');
});

router.post("/signup",
    authLimiter,
    [
        body("username").notEmpty().isLength({max:30}).withMessage("Username required and should be max 30 characters"),
        body("password").isLength({min:8}).withMessage("Password Should be atleast 8 characters long"),
        body("email").isEmail().withMessage("Enter a vaild email")
    ],
    authCon.signup
);

router.get("/login",(req,res)=>{
    res.send("login route working")
})

router.post("/login",
    authLimiter,
    [
        body("username").notEmpty().withMessage("Username required"),
        body("password").notEmpty().withMessage("Password required")
    ],
    authCon.login);

router.get("/verify", authCon.verifyEmail);
router.post("/forget-password",authCon.forgetPassword);
router.post("/reset-password",authCon.resetPassword);

 module.exports = router;