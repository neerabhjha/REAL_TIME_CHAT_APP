const requireUser = require("../middlewares/requireUser");
const { getCurUserController, getAllUsers, updateProfilePictureController } = require("../routes/usersRoute");

const router = require("express").Router();

//get current user
router.get("/getCurrentUser", requireUser, getCurUserController);

//get all users except current user
router.get("/getAllUsers", requireUser, getAllUsers);

//update user profile pic
router.post(
  "/updateProfilePicture",
  requireUser,
  updateProfilePictureController
);

module.exports = router;
