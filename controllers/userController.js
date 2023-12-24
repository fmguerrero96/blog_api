const User = require('../models/user');
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

//Get all users
exports.getAllUsers = asyncHandler(async (req, res, next) => {
    try {
        const users = await User.find({}).sort({ first_name: 1 }).exec();
        res.json(users);
    } catch (error) {
        // Handle database query error
        res.status(500).json({ error: 'Internal Server Error. Could not fetch users.' });
    }
});

//Get a specific user by id
exports.getSingleUser = asyncHandler(async (req, res, next) => {
    try {
        const singleUser = await User.findById(req.params.userid).exec();
        if(!singleUser){
            //if no results...
            return res.status(404).json({ error: 'User not found'})
        }
        //send user if success
        res.json(singleUser)
    } catch {
        //Handle potential database query error
        res.status(500).json({ error: 'Internal server error. Could not fetch user'})
    }
});