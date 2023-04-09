const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dqb6ltkmy",
  api_key: "659597286231582",
  api_secret: "qXZhk1TmVOyZ-rE2UiIXS3swyU8",
  secure: true,
});

module.exports = cloudinary;
