const express = require("express");
const bodyParser = require("body-parser");

const mainRoutes = require("./routes/main-routes");

//const PORT = process.env.KISACA_APP_API_URL || 8080;

const app = express();

app.use("/api/main", mainRoutes);

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "Bilinmeyen bir hata oluştu." });
});

app.listen(8080);
