const express = require("express");
const router = express.Router();

const posts_controller = require("../controllers/postController");

/// Rutes for blog posts //

//GET list of all posts 
router.get('/posts', posts_controller.getAllPosts);

//Get a specific blog post
router.get("/posts/:postid", posts_controller.getSinglePost);

module.exports = router;