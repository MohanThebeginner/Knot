const Notification = require("../models/notification.js");

module.exports.sendNotification = async(io,connectedUsers,{recipient,sender,type,post}) => {
    if(recipient.toString() === sender.toString()) return;

    const notification = new Notification({recipient,sender,type,post});
    await notification.save();
    await notification.populate("sender","username");

    const socketId = connectedUsers.get(recipient.toString());
    if(socketId){
        io.to(socketId).emit("notification",{
            type,
            message: buildMessage(type,notification.sender.username),
            notification,
            createdAt: notification.createdAt
        });
    }
};

const buildMessage = (type, username) => {
    const message = {
        like:`${username} liked your post`,
        comment: `${username} commented on your post`
    };
    return message[type];
};