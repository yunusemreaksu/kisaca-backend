const express = require("express");
const bodyParser = require("body-parser");

const mainRoutes = require("./routes/main-routes");

//const PORT = process.env.KISACA_APP_API_URL || 8080;

const app = express();

app.use("/api/main", mainRoutes);

app.listen(8080);
