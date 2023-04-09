const jwt = require("jsonwebtoken");
require("dotenv").config("./.env");

module.exports = (req, res, next) => {
  try {
    const accessToken = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_PRIVATE_KEY
    );
    req._id = decodedToken._id;
    next();
  } catch (e) {
    return res.send({
      message: e.message,
      success: false,
    });
  }
};
