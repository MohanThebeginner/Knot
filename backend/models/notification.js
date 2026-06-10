const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    recipient:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true
    },
    sender:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true
    },
    type:{
        type: String,
        enum:["like","comment"],
        required:true
    },
    post:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    },
    read:{ type: Boolean, default: false}
},{timestamps: true});

module.exports = mongoose.model("Notification", notificationSchema);