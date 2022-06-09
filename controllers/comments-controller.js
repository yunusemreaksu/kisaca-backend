const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const { default: mongoose } = require("mongoose");

const HttpError = require("../models/http-error");
const Comment = require("../models/comment");
const User = require("../models/user");
const user = require("../models/user");

const getCommentById = async (req, res, next) => {
  const commentId = req.params.cid; // cid: comment id

  let comment;
  try {
    comment = await Comment.findById(commentId);
  } catch (err) {
    // GET request'te bir hata olursa
    const error = new HttpError("Bir hata oluştu: Yorum bulunamadı!", 500);
    return next(error); // Bunu eklemezsek error oluşması hâlinde code execution devam eder.
  }

  if (!comment) {
    // Genel hatalar için
    const error = new HttpError(
      "Sorgulanan id ile ilişkili bir yorum bulunamadı!",
      404
    );
    return next(error);
  }

  res.json({ comment: comment.toObject({ getters: true }) }); // getters: true -> Mongoose oluşturulan object'e id ekler
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

  const createdComment = new Comment({
    creator,
    commentText,
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),
  });

  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError(
      "Yorum oluşturulurken bir hata oluştu. Lütfen daha sonra tekrar deneyin!",
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError(
      "Sorgulanan id ile ilişkili bir kullanıcı bulunamadı!",
      404
    );
    return next(error);
  }

  try {
    // await createdComment.save(); // stores new document in database and creates unique id
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdComment.save({ session: sess });
    user.comments.push(createdComment); // Buradaki push() metodu standart js metodu olan değil, mongoose'a ait olan bir metot ve iki model arasında(user<->comment) bağlantı kurmayı sağlıyor. Sadece createdComment id'sini alıp user'daki comments'e ekler.
    await user.save({ session: sess });
    await sess.commitTransaction();
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
    comment = await Comment.findById(commentId).populate("creator"); // populate() metodu, başka bir collection'daki document'e ulaşmayı ve o document'teki data ile çalışmamızı sağlar. Bunu model'lardaki ref'ler sayesinde yapar.
  } catch (err) {
    const error = new HttpError("Bir hata oluştu: Yorum silinemedi!", 500);
    return next(error);
  }

  if (!comment) {
    const error = new HttpError(
      "Sorgulanan id ile ilişkili bir yorum bulunamadı!",
      404
    );
    return next(error);
  }

  try {
    // await comment.remove();
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await comment.remove({ session: sess });
    comment.creator.comments.pull(comment); // pull() metodu otomatik olarak ilgili id'yi siler.
    await comment.creator.save({ session: sess });
    await sess.commitTransaction();
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
