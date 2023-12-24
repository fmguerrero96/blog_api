const User = require('../models/user');
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

//Get all users
exports.getAllUsers = asyncHandler(async (req, res, next) => {
    try {
        const users = await User.find({}).sort({ first_name: 1 });
        res.json(users);
    } catch (error) {
        // Handle database query error
        res.status(500).json({ error: 'Internal Server Error. Could not fetch users.' });
    }
});