const Post = require("../models/post.js");
const Comment = require("../models/comments.js");
const {cloudinary} = require("../config/cloudinary.js") 
const {validationResult} = require("express-validator");



//read(GET)
module.exports.allPosts = async(req,res,next)=>{
    try{
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;
        const search = req.query.search

        const query = search?{title:{$regex: search, $options: "i"}}:{};

        const posts = await Post.find(query)
        .populate("author","username")
        .sort({ createdAt: -1})
        .skip(skip)
        .limit(limit);

        // Add like info for current user
        const postsWithLikes = posts.map(post => ({
            ...post.toObject(),
            likeCount: post.likes?.length || 0,
            isLiked: req.user && post.likes ? post.likes.includes(req.user._id) : false
        }));

        const total = await Post.countDocuments();

        res.json({posts: postsWithLikes, currentPage: page , totalPage: Math.ceil(total/limit), totalPost: total });
    }catch(err){
        next(err);
    }
};

//create(POST)
module.exports.createPost = async(req,res,next)=>{
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
        next(err);
    }

};

//update(PUT)
module.exports.editPost = async(req,res,next)=>{
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
        next(err);
    }
};

//delete(DELETE)
module.exports.deletePost = async(req,res,next)=>{
    try{
        const post = await Post.findById(req.params.id);
        if(!post) return res.status(404).json({error:"Post not found"});

        if(!post.author.equals(req.user._id)){
            return res.status(403).json({error:"Not authorized"});
        }

        if(post.image?.publicId){
            await cloudinary.uploader.destroy(post.image.publicId);
        }

        await Comment.deleteMany({post: req.params.id});
        await post.deleteOne();
        res.json({message:"Post deleted"});
    }catch(err){
        next(err);
    }
};


//toggle like post
module.exports.toggleLike = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ error: "Post not found" });

        // Initialize likes array if it doesn't exist
        if (!post.likes) {
            post.likes = [];
        }

        const alreadyLiked = post.likes.includes(req.user._id);

        if (alreadyLiked) {
            post.likes.pull(req.user._id); // unlike
        } else {
            post.likes.push(req.user._id); // like
        }

        await post.save();
        res.json({ 
            likes: post.likes.length, 
            liked: !alreadyLiked,
            message: alreadyLiked ? "Post unliked" : "Post liked"
        });
    } catch (err) {
        next(err);
    }
};

module.exports.getPostLikes = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate("likes", "username"); // ← replace ObjectIds with usernames

        if (!post) return res.status(404).json({ error: "Post not found" });

        res.json({
            likesCount: post.likes.length,
            likedBy:    post.likes
        });
    } catch (err) {
        next(err);
    }
};

