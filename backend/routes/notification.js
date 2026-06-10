const express = require("express");
const router = express.Router();
const {isLoggedIn} = require("../middleware/auth");
const notifyCtrl = require("../controllers/notificationCon");

//get /notification
router.get("/",isLoggedIn,notifyCtrl.allNotification);

//patch /notification/read
router.patch("/read",isLoggedIn,notifyCtrl.markAsRead);

//get /notification/unread-count
router.get("/unread-count",isLoggedIn,notifyCtrl.unreadCount);

module.exports = router;