const express = require('express');
const router = express.Router();
const {body} = require("express-validator")
const authCon = require("../controllers/authCon");


router.get("/signup", (req,res) => {
    res.send('Signup route working');
});

router.post("/signup",
    [
        body("username").notEmpty().withMessage("Username required"),
        body("password").isLength({min:8}).withMessage("Password Should be atleast 8 characters long")
    ],
    authCon.signup
);

router.get("/login",(req,res)=>{
    res.send("login route working")
})

router.post("/login",authCon.login);

 module.exports = router;