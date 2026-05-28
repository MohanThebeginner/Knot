const express = require('express');
const router = express.Router({ mergeParams: true });
const {body} = require("express-validator");
const {isLoggedIn} = require("../middleware/auth.js");
const commCon = require("../controllers/commentCon.js");

router.get("/",isLoggedIn, commCon.readComment);

router.post("/",isLoggedIn,[body("body").notEmpty().withMessage("Comment cannot be empty")],commCon.createComment);

router.delete("/:id", isLoggedIn , commCon.deleteComment);

module.exports = router;