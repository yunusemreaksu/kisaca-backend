const { validationResult } = require("express-validator");
const { v4: uuidv4 } = require("uuid");

const HttpError = require("../models/http-error");
const User = require("../models/user");

const DUMMY_USERS = [
  {
    id: "u1",
    name: "john doe",
    email: "john@test.com",
    password: "test1",
  },
  {
    id: "u2",
    name: "jenny doe",
    email: "jenny@test.com",
    password: "test2",
  },
];

const getUsers = (req, res, next) => {
  res.json({ users: DUMMY_USERS });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Geçersiz girdi! Lütfen kontrol edin!", 422));
  }

  const { name, email, password, comments } = req.body;

  // const hasUser = DUMMY_USERS.find((u) => u.email === email);
  // if (hasUser) {
  //   throw new HttpError("Bu e-mail ile zaten bir hesap oluşturulmuş!", 422);
  // }

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

  // const createdUser = {
  //   id: uuidv4(),
  //   name: name,
  //   email: email,
  //   password: password,
  // };

  const createdUser = new User({
    name,
    email,
    password,
    comments,
  });

  // DUMMY_USERS.push(createdUser);

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

  // const identifiedUser = DUMMY_USERS.find((u) => u.email === email);
  // if (!identifiedUser || identifiedUser.password !== password) {
  //   return next(new HttpError("Girilen bilgiler hatalı!", 401));
  // }

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Giriş işleminde bir hata oluştu. Lütfen daha sonra tekrar deneyin!",
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
