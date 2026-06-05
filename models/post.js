const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
    title:{type:String ,required:true},
    content:{type:String , required:true},
    author:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    image:{
        url : {type:String},
        publicId: {type:String}
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]

},
{
    timestamps:true
}

);

const Post = mongoose.model('Post',postSchema);

module.exports = Post;