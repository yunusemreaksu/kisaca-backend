const express = require("express");
const { check } = require("express-validator");

const commentsController = require("../controllers/comments-controller");

const router = express.Router();

router.get("/:cid", commentsController.getCommentById);

router.get("/user/uid", commentsController.getCommentsByUserId);

router.post(
  "/",
  check("commentText").not().isEmpty(),
  commentsController.createComment
);

router.delete("/:cid", commentsController.deleteComment);

module.exports = router;
