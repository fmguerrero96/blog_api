const Post = require("../models/post")
const asyncHandler = require("express-async-handler");

//GET list of all posts
exports.getAllPosts = asyncHandler(async (req, res, next) => {
    const allPosts = await Post.find({}).populate('comments').sort({ title: 1 }).exec();
    res.json(allPosts)
});

//Get a specific blog post
exports.getSinglePost = asyncHandler(async (req, res, next) => {
    const singlePost = await Post.findById(req.params.postid)
    .populate('comments').exec()

    if (singlePost === null) {
        // No results.
        const err = new Error("Post not found");
        err.status = 404;
        return next(err);
      }

    res.json(singlePost)
});