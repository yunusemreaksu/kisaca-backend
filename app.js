const express = require("express");

const app = express();
const PORT = process.env.KISACA_APP_API_URL || 8080

app.use("/users", (req, res, next) => {
  res.send("<p>Test</p>");
});

app.listen(PORT);
