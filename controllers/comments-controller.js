const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");

const Comment = require("../models/comment");
const User = require("../models/user");

const DUMMY_COMMENTS = [
  {
    id: "c1",
    creator: "u1",
    commentText: "t1",
    time: "10:52",
  },
  {
    id: "c2",
    creator: "u2",
    commentText: "t2",
    time: "11:30",
  },
];

const getCommentById = async (req, res, next) => {
  const commentId = req.params.cid; // cid: comment id

  let comment;
  try {
    comment = await Comment.findById(commentId);
  } catch (err) {
    const error = new HttpError("Bir hata oluştu: Yorum bulunamadı!", 500);
    return next(error);
  }

  if (!comment) {
    const error = new HttpError(
      "Sorgulanan id ile ilişkili bir yorum bulunamadı!",
      404
    );
    return next(error);
  }

  res.json({ comment: comment.toObject({ getters: true }) });
};

const getCommentsByUserId = async (req, res, next) => {
  const userId = req.params.uid; // uid: user id

  let comments;
  try {
    comments = await Comment.find({ creator: userId });
  } catch (err) {
    const error = new HttpError(
      "Yorumlar alınırken bir hata oluştu. Lütfen daha sonra tekrar deneyin!",
      500
    );
    return next(error);
  }

  if (!comments || comments.length === 0) {
    return next(
      new HttpError("Sorgulanan id ile ilişkili yorumlar bulunamadı.", 404)
    );
  }

  res.json({
    comments: comments.map((comment) => comment.toObject({ getters: true })),
  });
};

const createComment = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Geçersiz girdi! Lütfen kontrol edin!", 422));
  }

  const { id, creator, commentText, date, time } = req.body;

  // const createdComment = {
  //   id: uuidv4(),
  //   creator: creator,
  //   commentText: commentText,
  //   time: time,
  // };

  const createdComment = new Comment({
    creator,
    commentText,
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),
  });

  // DUMMY_COMMENTS.push(createdComment);

  try {
    await createdComment.save();
  } catch (err) {
    const error = new HttpError(
      "Yorum oluşturulurken bir hata oluştu. Lütfen daha sonra tekrar deneyin!",
      500
    );
    return next(error);
  }

  res.status(201).json({ comment: createdComment });
};

const deleteComment = async (req, res, next) => {
  const commentId = req.params.cid;

  let comment;
  try {
    comment = await Comment.findById(commentId);
  } catch (err) {
    const error = new HttpError("Bir hata oluştu: Yorum silinemedi!", 500);
    return next(error);
  }

  try {
    await comment.remove();
  } catch (err) {
    const error = new HttpError("Bir hata oluştu: Yorum silinemedi!", 500);
    return next(error);
  }

  res.status(200).json({ message: "Yorum silindi!" });
};

exports.getCommentById = getCommentById;
exports.getCommentsByUserId = getCommentsByUserId;
exports.createComment = createComment;
exports.deleteComment = deleteComment;
