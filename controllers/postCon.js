const Post = require("../models/post.js");

//read
module.exports.allPosts = async(req,res)=>{
    try{
        const posts = await Post.find().populate("author","username");
        res.json(posts);
    }catch(err){
        res.status(500).json({error:err.message});
    }
};

//create
module.exports.createPost = async(req,res)=>{
    try{
        const {title,content} = req.body;
        const post = new Post({
            title,
            content,
            author:req.user._id
        });
        await post.save();
        res.status(201).json(post);
    }catch(err){
        res.status(400).json({error:err.message});
    }

};
//put
module.exports.editPost = async(req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
        if(!post) return res.status(404).json({error:"Post not found"});

        if(!post.author.equals(req.user._id)){
            return res.status(403).json({error:"Not authorized"});
        }

        post.title = req.body.title ?? post.title;
        post.content = req.body.content ?? post.content;
        await post.save();
        res.json(post);
    }catch(err){
        res.status(500).json({error:err.message});
    }
};

//delete
module.exports.deletePost = async(req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
        if(!post) return res.status(404).json({error:"Post not found"});

        if(!post.author.equals(req.user._id)){
            return res.status(403).json({error:"Not authorized"});
        }

        await post.deleteOne();
        res.json({message:"Post deleted"});
    }catch(err){
        res.status(500).json({error:err.message});
    }
};

