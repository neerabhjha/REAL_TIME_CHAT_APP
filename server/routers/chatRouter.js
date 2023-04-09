const router = require("express").Router();
const requireUser = require("../middlewares/requireUser");
const {
  createNewChatController,
  getAllChatsController,
  clearAllUnreadMessagesController,
} = require("../routes/chatsRoute");

router.post("/createNewChat", requireUser, createNewChatController);
router.get("/getAllChats", requireUser, getAllChatsController);
router.post(
  "/clearUnreadMessages",
  requireUser,
  clearAllUnreadMessagesController
);

module.exports = router;
