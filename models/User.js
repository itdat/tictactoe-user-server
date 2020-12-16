const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
  },
  username: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  token: {
    type: String,
  },
  provider: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("user", UserSchema);
