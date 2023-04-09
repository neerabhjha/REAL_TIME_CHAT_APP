const router = require("express").Router();
const requireUser = require("../middlewares/requireUser");
const {
  getAllMessagesController,
  newMessageController,
} = require("../routes/messagesRoute");

router.post("/newMessage", requireUser, newMessageController);
router.get("/getAllMessages/:chatId", requireUser, getAllMessagesController);

module.exports = router;
