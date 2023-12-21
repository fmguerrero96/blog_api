const Post = require("../models/post")
const asyncHandler = require("express-async-handler");

//GET list of all posts
exports.getAllPosts = asyncHandler(async (req, res, next) => {
    const allPosts = await Post.find({}).populate('comments').sort({ title: 1 }).exec();
    res.json(allPosts)
});