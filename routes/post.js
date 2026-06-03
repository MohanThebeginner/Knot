const express = require('express');
const router = express.Router();

const {isLoggedIn} = require("../middleware/auth.js");
const postCtrl = require("../controllers/postCon.js");
const {upload} = require("../config/cloudinary.js")
const {body} = require("express-validator");
const validate = [
    body("title").notEmpty().withMessage("Title is required"),
    body("content").isLength({min: 10}).withMessage("Content is too short")
]

router.get("/",postCtrl.allPosts);

router.post("/",isLoggedIn,upload.single("image"),validate,postCtrl.createPost);

router.put("/:id",isLoggedIn,upload.single("image"),postCtrl.editPost);

router.delete("/:id",isLoggedIn,postCtrl.deletePost);



module.exports=router;