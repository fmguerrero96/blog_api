const User = require('../models/user');
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs")

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

//Create User 
exports.createUser = [
    // Validate and sanitize input fields.
      body("first_name")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Please provide your first name."),
    body("username")
        .trim()
        .isLength({ min: 3})
        .escape()
        .withMessage('Username must be at least 3 characters long'),
    body("password")
        .trim()
        .isLength({ min: 3})
        .escape()
        .withMessage('Password must be at least 3 characters long'),
    body('confirm_password').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords do not match');
          }
          return true
          }),
    
    // Process request after validation and sanitization.
    asyncHandler(async (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);
    
        // Create User object with escaped and trimmed data
        const user = new User({
          first_name: req.body.first_name,
          username: req.body.username,
          password: '', //Set empty password for now
        });
    
        if(!errors.isEmpty()) {
            //if there are erros, then...
            return res.status(400).json({ errors: errors.array() })
        } else {
          // Data from form is valid.
          // Hash the password using bcrypt before saving it to the database.
          const hashedPassword = await bcrypt.hash(req.body.password, 10);
            // Set user.password to the hashed password
            user.password = hashedPassword;
    
            // Save user.
            await user.save();
            res.status(201).json(user); // Respond with the created user
          };
        }
      ),
];

//Delete User
exports.deleteUser = asyncHandler(async (req, res, next) => {
    //check if user exists
    const user = await User.findById(req.params.userid)
    console.log(user)

    try {
        if (!user) {
            res.status(404).json({ error: 'The user you are trying to delete does not exist.' });
        } else {
            await User.findByIdAndDelete(req.params.userid);
            res.status(204).end();  // 204 No Content for successful deletion
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error. Could not delete user.' });
    }
});

//Update user 
exports.updateUser = asyncHandler(async (req, res, next) => {
    // Validate and sanitize input fields.
    body("new_first_name")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Please provide your first name.")
    body("new_username")
        .trim()
        .isLength({ min: 3})
        .escape()
        .withMessage('Username must be at least 3 characters long')
    body("old_password")
        .trim()
        .escape()
    body("new_password")
        .trim()
        .isLength({ min: 3})
        .escape()
        .withMessage('New Password must be at least 3 charcaters long')
    body('confirm_new_password')
        .trim()
        .escape()
    
    if(req.body.new_password !== req.body.confirm_new_password){
        return res.status(400).json({ error: 'New password does not match confirmation' });
    }


    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        //if there are erros, then...
        return res.status(400).json({ errors: errors.array() })
    }


    try {
        // find the existing user
        const existingUser = await User.findById(req.params.userid);

        if (!existingUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Compare the old password using bcrypt
        const isPasswordMatch = await bcrypt.compare(req.body.old_password, existingUser.password);

        if (!isPasswordMatch) {
            return res.status(400).json({ error: 'Old password is incorrect' });
        }

        const hashedPassword = await bcrypt.hash(req.body.new_password, 10);

        // Update the post fields
        existingUser.first_name = req.body.new_first_name;
        existingUser.username = req.body.new_username;
        existingUser.password = hashedPassword;

        // Save the updated user to the database
        const updatedUser = await existingUser.save();

        res.status(200).json(updatedUser); // Respond with the updated post
    } catch (error) {
        // Handle any errors that occur during the update operation
        res.status(500).json({ error: 'Internal Server Error. Could not update the user' });
    }
});