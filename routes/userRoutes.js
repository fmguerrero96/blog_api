const express = require("express");
const router = express.Router();
const passport = require("passport");

// authentication middleware function to protect routes
const authenticateJWT = passport.authenticate('jwt', { session: false });

const user_controller = require('../controllers/userController');

/// Routes for users ///

//Get all users
router.get('/users', user_controller.getAllUsers);

//Get a specific user by id
router.get('/users/:userid', user_controller.getSingleUser);

//Create a user
router.post('/users', user_controller.createUser);

//User login
router.post('/users/login', user_controller.login_post);

//Delete a user
router.delete('/users/:userid', user_controller.deleteUser);

//update a User
router.put('/users/:userid', user_controller.updateUser);

module.exports = router;