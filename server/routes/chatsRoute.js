const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");

//create new chat
const createNewChatController = async (req, res) => {
  try {
    const newChat = new Chat(req.body);
    const savedChat = await newChat.save();
    await savedChat.populate("members");

    res.send({
      success: true,
      message: "Chat Created Successfully",
      data: savedChat,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: "Error Creating Chat",
      error: error.message,
    });
  }
};

//get all chats of current user
const getAllChatsController = async (req, res) => {
  try {
    const chats = await Chat.find({
      members: {
        $in: [req._id],
      },
    })
      .populate("members")
      .populate("lastMessage")
      .sort({ updatedAt: -1 });
    return res.send({
      success: true,
      message: "Chat fetched successfully",
      data: chats,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: "Error fetching chats",
      error: error.message,
    });
  }
};

const clearAllUnreadMessagesController = async (req, res) => {
  try {
    //find chat and update unread messages count to zero
    const chat = await Chat.findById(req.body.chat);
    if (!chat) {
      return res.send({
        success: false,
        message: "Chat not found",
      });
    }
    const updatedChat = await Chat.findByIdAndUpdate(
      req.body.chat,
      {
        unreadMessages: 0,
      },
      {
        new: true,
      }
    )
      .populate("members")
      .populate("lastMessage");

    //find all unread messages of chat and update them to read
    await Message.updateMany(
      {
        chat: req.body.chat,
        read: false,
      },
      {
        read: true,
      }
    );

    return res.send({
      success: true,
      message: "Unread messages cleared successfully",
      data: updatedChat,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: "Error clearing unread messages",
      error: error.message,
    });
  }
};

module.exports = {
  createNewChatController,
  getAllChatsController,
  clearAllUnreadMessagesController,
};
