const Post = require("../models/post.js");
const {cloudinary} = require("../config/cloudinary.js") 
const {validationResult} = require("express-validator");



//read(GET)
module.exports.allPosts = async(req,res)=>{
    try{
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        const posts = await Post.find()
        .populate("author","username")
        .sort({ createdAt: -1})
        .skip(skip)
        .limit(limit);

        const total = await Post.countDocuments();

        res.json({posts, currentPage: page , totalPage: Math.ceil(total/limit), totalPost: total });
    }catch(err){
        res.status(500).json({error:err.message});
    }
};

//create(POST)
module.exports.createPost = async(req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    try{
        const {title,content} = req.body;
        const post = new Post({
            title,
            content,
            author:req.user._id
        });

        if(req.file){
            post.image = {
                url:req.file.path,
                publicId: req.file.filename
            };
        }

        await post.save();
        res.status(201).json(post);
    }catch(err){
        res.status(400).json({error:err.message});
    }

};

//update(PUT)
module.exports.editPost = async(req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
        if(!post) return res.status(404).json({error:"Post not found"});

        if(!post.author.equals(req.user._id)){
            return res.status(403).json({error:"Not authorized"});
        }

        post.title = req.body.title ?? post.title;
        post.content = req.body.content ?? post.content;

        if(req.file){
            if(post.image?.publicId){
                await cloudinary.uploader.destroy(post.image.publicId);
            }
            post.image = {
                url: req.file.path,
                publicId: req.file.filename
            };
        }

        await post.save();
        res.json(post);
    }catch(err){
        res.status(500).json({error:err.message});
    }
};

//delete(DELETE)
module.exports.deletePost = async(req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
        if(!post) return res.status(404).json({error:"Post not found"});

        if(!post.author.equals(req.user._id)){
            return res.status(403).json({error:"Not authorized"});
        }

        if(post.image?.publicId){
            await cloudinary.uploader.destroy(post.image.publicId);
        }

        await post.deleteOne();
        res.json({message:"Post deleted"});
    }catch(err){
        res.status(500).json({error:err.message});
    }
};

