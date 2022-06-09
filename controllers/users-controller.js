const { validationResult } = require("express-validator");
const { v4: uuidv4 } = require("uuid");

const HttpError = require("../models/http-error");
const User = require("../models/user");

const getUsers = async (req, res, next) => {
  // res.json({ users: DUMMY_USERS });
  let users;
  try {
    users = await User.find({}, "email name");
  } catch (err) {
    const error = new HttpError(
      "Kullanıcı bilgileri alınırken hata oluştu. Lütfen daha sonra tekrar deneyin!",
      500
    );
    return next(error);
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Geçersiz girdi! Lütfen kontrol edin!", 422));
  }

  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Üye olma işlemi esnasında bir hata oluştu. Lütfen daha sonra tekrar deneyin!",
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError("Kullanıcı zaten mevcut!", 422);
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    password,
    comments: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError(
      "Üye olma işlemi esnasında bir hata oluştu. Lütfen daha sonra tekrar deneyin!",
      500
    );
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Giriş işlemi esnasında bir hata oluştu. Lütfen daha sonra tekrar deneyin!",
      500
    );
    return next(error);
  }

  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError(
      "Kullanıcı bilgileri hatalı! Giriş işlemi gerçekleştirilemedi!",
      401
    );
    return next(error);
  }

  res.json({ message: "Giriş işlemi başarıyla gerçekleşti!" });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
