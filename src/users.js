const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  movielists: {
    type: [
      {
        _id: String,
        title: String,
        backdrop: String,
      },
    ],
  },
});

const users = mongoose.model("user", userSchema);
module.exports = users;
