const express = require("express");
const router = express.Router();

const comments_controller = require('../controllers/commentController');

/// Routes for comments ///

//get all comments
router.get('/comments', comments_controller.getAllComments);

//get a specific comment by id
router.get('/comments/:commentid', comments_controller.getSingleComment);

module.exports = router;