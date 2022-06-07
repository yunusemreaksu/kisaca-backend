const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const newsSchema = new Schema({
  date: { type: String, required: true },
  time: { type: String, required: true },
  newsText: { type: String, required: true },
});

module.exports = mongoose.model("News", newsSchema);
