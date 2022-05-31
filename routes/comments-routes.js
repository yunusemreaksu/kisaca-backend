const express = require("express");

const commentsController = require("../controllers/comments-controller");

const router = express.Router();

router.post("/", commentsController.createComment);

module.exports = router;
