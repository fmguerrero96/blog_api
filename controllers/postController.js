const Post = require("../models/post")
const Comment = require("../models/comment")
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

//GET list of all posts
exports.getAllPosts = asyncHandler(async (req, res, next) => {
    try {
        const allPosts = await Post.find({}).populate('comments author').sort({ title: 1 }).exec();
        res.json(allPosts);
    } catch (error) {
        // Handle database query error
        res.status(500).json({ error: 'Internal Server Error. Could not fetch posts.' });
    }
});

//Get a specific blog post
exports.getSinglePost = asyncHandler(async (req, res, next) => {
    const singlePost = await Post.findById(req.params.postid)
    .populate('comments author').exec()

    if (singlePost === null) {
        // No results.
        const err = new Error("Post not found");
        err.status = 404;
        return next(err);
      }

    res.json(singlePost)
});

//Create one blog post
exports.createBlogPost = asyncHandler(async (req, res, next) => {
    //Validate and sanitize data
    body('title')
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Please provide a title")
    body('text')
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Please provide the body for this blog post")
    body('public')
        .isBoolean()
        .withMessage('Please specify if blog post is public or not')
    
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        //if there are erros, then...
        return res.status(400).json({ errors: errors.array() })
    }

    //Create new blog post
    const newPost = new Post({
        title: req.body.title,
        text: req.body.text,
        public: req.body.public,
        comments: [],
        author: req.user._id,
    })

    try {
        // Save the new post to the database
        const savedPost = await newPost.save();
    
        res.status(201).json(savedPost); // Respond with the created post
      } catch (error) {
        // Handle any errors that occur during the save operation
        res.status(500).json({ error: 'Internal Server Error. Could not create blog post' });
      }
});

//Delete a blog post
exports.deleteBlogPost = asyncHandler(async (req, res, next) => {
    //check if post exists
    const post = await Post.findById(req.params.postid)

    try{
        if(!post){
            //if post does not exist...
            res.status(404).json({ error: 'The blog post you are trying to delete does not exist.' });
        } else {
            // Delete all comments associated with the post
            await Comment.deleteMany({ post: req.params.postid });

            //Delete the blog post
            await Post.findByIdAndDelete(req.params.postid)
            res.status(204).end();  // 204 No Content for successful deletion
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error. Could not delete post.'})
    }
});

//Update a blog post
exports.updateBlogPost = asyncHandler(async (req, res, next) => {
    //Validate and sanitize data
    body('title')
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Please provide a title")
    body('text')
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Please provide the body for this blog post")
    body('public')
        .isBoolean()
        .withMessage('Please specify if blog post is public or not')
    
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        //if there are erros, then...
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        // find the existing post
        const existingPost = await Post.findById(req.params.postid);

        if (!existingPost) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Update the post fields
        existingPost.title = req.body.title;
        existingPost.text = req.body.text;
        existingPost.public = req.body.public;

        // Save the updated post to the database
        const updatedPost = await existingPost.save();

        res.status(200).json(updatedPost); // Respond with the updated post
    } catch (error) {
        // Handle any errors that occur during the update operation
        res.status(500).json({ error: 'Internal Server Error. Could not update the blog post' });
    }
});