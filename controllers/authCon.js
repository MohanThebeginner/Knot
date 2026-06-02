const jwt = require("jsonwebtoken");
const User = require("../models/user.js");

module.exports.signup = async(req,res,next) => {
    try{
        const {username,password,email} = req.body;

        const existing = await User.findOne({username});
        if(existing) return res.status(400).json({error:"Username already taken"});

        const user = new User({username,password,email});
        await user.save();

        res.status(201).json({message:"User Register Successfully"});
    }catch(err){
        next(err);
    }
};

module.exports.login = async(req,res,next) => {
    try{
        const {username,password} = req.body;

        const user = await User.findOne({username});
        if(!user) return res.status(401).json({error:"Invalid Credentials"});

        const isMatch = await user.comparePassword(password);
        if(!isMatch) return res.status(401).json({error:"Invalid Credentials"})

        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET,{expiresIn: "7d"});    

        res.json({token});
    }catch(err){
        next(err);
    }
};