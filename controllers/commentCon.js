const Post = require("../models/post.js");
const Comment = require("../models/comments.js");

const {validationResult} = require("express-validator");

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

        const comment = new Comment({
            body: req.body.body,
            author: req.user._id,
            post: post._id
        });

        await comment.save();
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