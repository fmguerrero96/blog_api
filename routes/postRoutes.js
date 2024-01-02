const express = require("express");
const router = express.Router();

const posts_controller = require("../controllers/postController");

/// Rutes for blog posts //

//GET list of all posts 
router.get('/posts', posts_controller.getAllPosts);

//Get a specific blog post
router.get("/posts/:postid", posts_controller.getSinglePost);

//Create one blog post
router.post("/posts", posts_controller.createBlogPost);

//Delete a blog post
router.delete("/posts/:postid", posts_controller.deleteBlogPost);

//Update a blog post
router.put("/posts/:postid", posts_controller.updateBlogPost);

//get all comments from a blog post
router.get("/posts/:postid/comments", posts_controller.getCommentsFromPost);

module.exports = router;