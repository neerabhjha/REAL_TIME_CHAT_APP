const {
  signupController,
  loginController,
} = require("../routes/usersRoute");

const router = require("express").Router();

router.post("/signup", signupController);
router.post("/login", loginController);

module.exports = router