const Message = require("../models/messageModel");
const Chat = require("../models/chatModel");

const newMessageController = async (req, res) => {
  try {
    //store messages
    const newMessage = new Message(req.body);
    const savedMessage = await newMessage.save();

    //update lastMessage and unreadMessageCount of chat
    await Chat.findOneAndUpdate(
      { _id: req.body.chat },
      {
        lastMessage: savedMessage._id,
        $inc: {
          unreadMessages: 1,
        },
      }
    );
    // console.log(Chat.unreadMessages);
    return res.send({
      success: true,
      message: "Message sent successfully",
      data: savedMessage,
    });
  } catch (error) {
    console.log(error);
    return res.send({
      success: false,
      message: error.message,
    });
  }
};

const getAllMessagesController = async (req, res) => {
  try {
    const messages = await Message.find({
      chat: req.params.chatId,
    }).sort({ createdAt: 1 });
    return res.send({
      success: true,
      message: "Messages fetched successfully",
      data: messages,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: "Error while fetching messages",
    });
  }
};

module.exports = { newMessageController, getAllMessagesController };
