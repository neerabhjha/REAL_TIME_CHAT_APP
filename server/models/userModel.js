const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    profilePic: {
      type: String,
      required: false
    },
    
  },
  { timeStamps: true }
);

module.exports = mongoose.model("users", userSchema);
