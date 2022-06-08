const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const Comment = require("../models/comment");

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

const createComment = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Geçersiz girdi! Lütfen kontrol edin!", 422));
  }

  const { id, creator, commentText, time } = req.body;

  // const createdComment = {
  //   id: uuidv4(),
  //   creator: creator,
  //   commentText: commentText,
  //   time: time,
  // };

  const createdComment = new Comment({
    creator,
    commentText,
    time,
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

  res.status(201).json({ comment: createdComment.toObject({ getters: true }) });
};

exports.createComment = createComment;
