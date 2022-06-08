const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema();

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { tyoe: String, required: true, unique: true }, // unique creates index for email, speeds up the queuing process.
  password: { type: String, required: true, minlength: 6 },
  comments: { type: String, required: true },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
