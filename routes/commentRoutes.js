const express = require("express");
const router = express.Router();

const comments_controller = require('../controllers/commentController');

/// Routes for comments ///

//get all comments
router.get('/comments', comments_controller.getAllComments);

module.exports = router;