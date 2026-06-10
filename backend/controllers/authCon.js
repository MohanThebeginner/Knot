const jwt = require("jsonwebtoken");
const User = require("../models/user.js");
const crypto = require("crypto");
const {sendVerificationEmail, sendPasswordResetEmail} = require("../config/mailer");

module.exports.signup = async(req,res,next) => {
    try{
        const {username,password,email} = req.body;

        const existing = await User.findOne({username});
        if(existing) return res.status(400).json({error:"Username already taken"});

        const existingEmail = await User.findOne({email});
        if(existingEmail) return res.status(400).json({error:"Email alredy Existing"});

        const verificationToken = crypto.randomBytes(32).toString("hex");

        const user = new User({username,password,email,verificationToken});
        await user.save();
        await sendVerificationEmail(email, verificationToken);
        res.status(201).json({message:"Register, please verify your Email"});
    }catch(err){
        next(err);
    }
};

module.exports.verifyEmail = async(req,res,next) => {
    try{
        const user = await User.findOne({verificationToken: req.query.token});
        if(!user) return res.status(400).json({error: "Invalid or expierd token"});

        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();

        res.json({message: "Email verified! You can now login"});
    } catch(err){
        next(err);
    }
}


module.exports.login = async(req,res,next) => {
    try{
        const {username,password} = req.body;

        const user = await User.findOne({username});
        if(!user) return res.status(401).json({error:"Invalid Credentials"});

        if(!user.isVerified){
            return res.status(400).json({error:"Please verify your email first"})
        }

        const isMatch = await user.comparePassword(password);
        if(!isMatch) return res.status(401).json({error:"Invalid Credentials"})

        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET,{expiresIn: "7d"});    

        res.json({token});
    }catch(err){
        next(err);
    }
};


module.exports.forgetPassword = async(req,res,next) => {
    try{
        const user = await User.findOne({email: req.body.email});

        if(!user) return res.json({message:"If that email exist, a reset link was sent."});

        const resetToken = crypto.randomBytes(32).toString("hex");
        user.resetToken = resetToken;
        user.resetTokenExpiry= new Date(Date.now()+30*60*1000);
        await user.save();

        await sendPasswordResetEmail(user.email, resetToken);
        res.json({message:"If that email exist, a reset link was sent."})
    } catch(err){
        next(err);
    }
};


module.exports.resetPassword = async(req,res,next) => {
    try{
        const user = await User.findOne({
            resetToken: req.query.token,
            resetTokenExpiry: {$gt:Date.now()}
        });

        if(!user) return res.status(400).json({error:"Invalid or expired reset token"});

        user.password = req.body.password;
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();

        res.json({message:"Password reset sucessful. You can now login"});
    } catch(err){
        next(err);
    }
};