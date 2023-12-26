const express = require("express");
const router = express.Router();

const user_controller = require('../controllers/userController');

/// Routes for users ///

//Get all users
router.get('/users', user_controller.getAllUsers);

//Get a specific user by id
router.get('/users/:userid', user_controller.getSingleUser);

//Create a user
router.post('/users', user_controller.createUser);

module.exports = router;