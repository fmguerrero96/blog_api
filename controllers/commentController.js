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