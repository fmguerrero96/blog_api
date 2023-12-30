const Comment = require('../models/comment');
const Post = require('../models/post');
const User = require('../models/user');
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

//fetch all comments 
exports.getAllComments = asyncHandler(async (req, res, next) => {
    try {
        const allComments = await Comment.find({})
            .populate({
                path: 'author',
                select: 'first_name username', 
            })
            .populate('post')
            .sort({ 'author.first_name': 1 })
            .exec();
        res.status(200).json(allComments);
    } catch (error) {
        // Handle database query error
        res.status(500).json({ error: 'Internal Server Error. Could not fetch comments.' });
    }
});


//fetch a single comment
exports.getSingleComment = asyncHandler(async (req, res, next) => {
    try {
        const singleComment = await Comment.findById(req.params.commentid)
            .populate({
                path: 'author',
                select: 'first_name username', 
            })
            .populate('post')
            .exec();
        res.status(200).json(singleComment)
    } catch (error) {
        // Handle database query error
        res.status(500).json({ error: 'Internal Server Error. Could not fetch the comment you are looking for.' });
    }
});