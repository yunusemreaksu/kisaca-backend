const express = require("express");

const app = express();

app.use("/users", (req, res, next) => {
  res.send("<p>Test</p>");
});

app.listen(8080);
