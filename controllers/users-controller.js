const { validationResult } = require("express-validator");
const { v4: uuidv4 } = require("uuid");

const HttpError = require("../models/http-error");

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

const signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Geçersiz girdi! Lütfen kontrol edin!", 422);
  }

  const { name, email, password } = req.body;

  const hasUser = DUMMY_USERS.find((u) => u.email === email);
  if (hasUser) {
    throw new HttpError("Bu e-mail ile zaten bir hesap oluşturulmuş!", 422);
  }

  const createdUser = {
    id: uuidv4(),
    name: name,
    email: email,
    password: password,
  };

  DUMMY_USERS.push(createdUser);

  res.status(201).json({ user: createdUser });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  const identifiedUser = DUMMY_USERS.find((u) => u.email === email);

  if (!identifiedUser || identifiedUser.password !== password) {
    throw new HttpError("Girilen bilgiler hatalı!", 401);
  }
  res.json({ message: "Giriş yapıldı!" });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
