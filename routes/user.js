const express = require('express');
const router = express.Router();
const User = require("../models/user.js")
const passport = require("passport");

router.get("/signup", (req,res) => {
    res.send('Signup route working');
});

router.post("/signup", async(req,res)=>{
    try{
    let{username,email,password}=req.body;
    const newUser = new User({email,username});
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    res.send("User Registered")
    // res.redirect('/posts');
    }catch(err){
        console.log(err);
        res.status(500).send("Error Signing up");
    }
});

router.get("/login",(req,res)=>{
    res.send("login route working")
})

router.post("/login",passport.authenticate("local",{failureRedirect: '/login'}), async(req,res)=>{
    res.send("Welcome to Knots");
    // res.redirect("/posts")
});

 module.exports = router;