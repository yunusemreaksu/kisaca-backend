const express = require("express");
const { check } = require("express-validator");

const commentsController = require("../controllers/comments-controller");

const router = express.Router();

router.post(
  "/",
  check("commentText").not().isEmpty(),
  commentsController.createComment
);

module.exports = router;
