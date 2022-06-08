const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const commentSchema = new Schema({
  creator: { type: String, required: true },
  commentText: { type: String, required: true },
  time: { type: String, required: true },
});

module.exports = mongoose.model("Comment", commentSchema);
