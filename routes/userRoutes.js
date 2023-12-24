const express = require("express");
const router = express.Router();

const user_controller = require('../controllers/userController');

/// Routes for users ///

//Get all users
router.get('/users', user_controller.getAllUsers);

module.exports = router;