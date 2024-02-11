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

//Create a new comment 
exports.createComment = asyncHandler(async (req, res, next) => {
    //Validate and sanitize the data
    body('message')
        .trim()
        .isLength({ min: 1, max: 300 })
        .escape()
        .withMessage('Comment must have between 1 and 300 characters');
    
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        //if there are erros, then...
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        // extract the user's id
        const authorId = req.user._id;

        // extract the postid
        const postId = req.params.postid;

        // Check if the post exists
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Create the new comment
        const newComment = new Comment({
            author: authorId,
            post: postId,
            message: req.body.message,
            time_stamp: new Date(),
        });

        const savedComment = await newComment.save();

        return res.status(201).json(savedComment);

    } catch(error) {
        // Handle any errors that occur during the save operation
        res.status(500).json({ error: 'Internal Server Error. Could not create a new comment' });
    }
});

exports.deleteComment = asyncHandler(async (req, res, next) => {
    //check that comment exists
    const comment = await Comment.findById(req.params.commentid);

    try {
        if(!comment){
            //if comment does not exist...
            return res.status(404).json({ error: 'The comment you are trying to delete does not exist.' });
        } else {
            //Delete the comment
            await Comment.findByIdAndDelete(req.params.commentid)
            return res.status(204).end();  // 204 No Content for successful deletion
        }

    } catch(error) {
        res.status(500).json({ error: 'Internal Server Error. Could not delete comment.'})
    }
});