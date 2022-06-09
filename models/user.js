const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // unique creates index for email, speeds up the queuing process.
  password: { type: String, required: true, minlength: 6 },
  comments: [{ type: mongoose.Types.ObjectId, required: true, ref: "Comment" }],
});

userSchema.plugin(uniqueValidator); // Daha önce bu email ile hesap oluşturulup oluşturulmadığını kontrol eder

module.exports = mongoose.model("User", userSchema);
