const express = require("express");
const bodyParser = require("body-parser");

const dotenv = require("dotenv");
dotenv.config();

const HttpError = require("./models/http-error");

const mainRoutes = require("./routes/main-routes");
const usersRoutes = require("./routes/users-routes");
const commentsRoutes = require("./routes/comments-routes");

const app = express();

app.use(bodyParser.json());

app.use("/api/main", mainRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/main/comments", commentsRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route!", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "Bilinmeyen bir hata oluştu." });
});

app.listen(process.env.PORT);
