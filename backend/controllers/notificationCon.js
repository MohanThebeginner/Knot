const Notification = require("../models/notification");

module.exports.allNotification = async(req,res,next) => {
    try{
        const notifications = await Notification.find({recipient:req.user._id})
            .populate("sender","username")
            .populate("post","title")
            .sort({createdAt: -1})
            .limit(20);
        
        res.json(notifications);
    } catch(err){
        next(err);
    }
};

module.exports.markAsRead = async(req,res,next) => {
    try{
        await Notification.updateMany(
            { recipient: req.user._id, read: false},
            {read: true}
        );
        res.json({message:"All marked as read"});
    } catch(err){
        next(err);
    }
};

module.exports.unreadCount = async(req,res,next) => {
    try{
        const count = await Notification.countDocuments({
            recipient : req.user._id,
            read: false
        });

        res.json({count});
    } catch(err){
        next(err);
    }
};