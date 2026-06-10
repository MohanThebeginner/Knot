const Groq = require("groq-sdk");

const Post = require("../models/post.js");
const Comment = require("../models/comments.js");

const {validationResult} = require("express-validator");
const {sendNotification} = require("../utils/notify");

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });


//GET comment
module.exports.readComment = async(req,res,next) => {
    try{
        const post = await Post.findById(req.params.id);
        if(!post) return res.status(401).json({error: "Post not found"});

        const comment = await Comment.find({post:req.params.id})
        .populate("author","username")
        .sort({createdAt: -1});

        res.json(comment);
    }catch(err){
        next(err);
    }
};

//POST Comment
module.exports.createComment = async (req,res,next) => {
    const errors =validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    try{
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({error:"Post not found"});

        const moderation = await client.chat.completions.create({
            model:      "llama-3.3-70b-versatile", 
            max_tokens: 10,
            messages: [{
                role:    "user",
                content: `Is this comment toxic, hateful, or spam? Reply only YES or NO:\n\n"${req.body.body}"`
            }]
        })

        const isToxic = moderation.choices[0].message.content.trim().toUpperCase() === "YES";
        if(isToxic){
            return res.status(400).json({error:"Your comment was flagged as inappropriate and could not be posted."})
        }

        const comment = new Comment({
            body: req.body.body,
            author: req.user._id,
            post: post._id
        });

        await comment.save();

        await sendNotification(
            req.app.get("io"),
            req.app.get("connectedUsers"),
            {
                recipient: post.author,
                sender: req.user._id,
                type: "comment",
                post: post._id
            }
        );

        res.status(201).json(comment);

    }catch (err){
        next(err);
    }
};

//DELETE comment
module.exports.deleteComment = async(req,res,next) => {
    try{
        const comment = await Comment.findById(req.params.id);
        if(!comment) return res.status(404).json({error:"Comment not found"});

        if(!comment.author.equals(req.user._id)){
            return res.status(403).json({error:"Not Authorized"});
        }

        await comment.deleteOne();
        res.json({message:"Comment Deleted"});
    }catch(err){
        next(err);  
    }

};