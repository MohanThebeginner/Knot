const express = require('express');
const router = express.Router();

const {isLoggedIn} = require("../middleware/auth.js")
const postCtrl = require("../controllers/postCon.js");

router.get("/",isLoggedIn,postCtrl.allPosts);

router.post("/",isLoggedIn,postCtrl.createPost);

router.put("/:id",isLoggedIn,postCtrl.editPost);

router.delete("/:id",isLoggedIn,postCtrl.deletePost);



module.exports=router;