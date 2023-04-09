import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetMessages, SendMessage } from "../../../apicalls/messages";
import { HideLoader, ShowLoader } from "../../../redux/loaderSlice";
import { toast } from "react-hot-toast";
import moment from "moment";
import { ClearChatMessages } from "../../../apicalls/chats";
import { SetAllChats } from "../../../redux/userSlice";
import store from "../../../redux/store";
import EmojiPicker from "emoji-picker-react";

function ChatArea({ socket, onlineUsers }) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isReceipentTyping, setIsReceipentTyping] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [messages = [], setMessages] = useState([]);
  const dispatch = useDispatch();
  const { selectedChat, user, allChats } = useSelector(
    (state) => state.userReducer
  );
  // console.log("selected", selectedChat);

  const receipentUser = selectedChat.members.find(
    (mem) => mem._id !== user._id
  );
  // console.log("resfrm receipentUser: ", receipentUser);

  const sendNewMessage = async (image) => {
    try {
      const message = {
        chat: selectedChat._id,
        sender: user._id,
        text: newMessage,
        image,
      };
      //send msg to server using socket
      socket.emit("sendMessage", {
        ...message,
        members: selectedChat.members.map((mem) => mem._id),
        createdAt: moment().format("DD-MM-YYYY hh:mm:ss"),
        read: false,
      });

      //sending msg to db
      const response = await SendMessage(message);
      if (response.success) {
        setNewMessage("");
        setShowEmojiPicker(false);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getMessages = async () => {
    try {
      dispatch(ShowLoader());
      const response = await GetMessages(selectedChat._id);
      dispatch(HideLoader());
      if (response.success) {
        setMessages(response.data);
      }
    } catch (error) {
      dispatch(HideLoader());
      toast.error(error.message);
    }
  };

  const clearUnreadMessages = async () => {
    try {
      socket.emit("clearUnreadMessages", {
        chat: selectedChat._id,
        members: selectedChat.members.map((mem) => mem._id),
      });

      const response = await ClearChatMessages(selectedChat._id);

      if (response.success) {
        const updatedChats = allChats.map((chat) => {
          if (chat._id === selectedChat._id) {
            return response.data;
          }
          return chat;
        });
        dispatch(SetAllChats(updatedChats));
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const onUploadImageClick = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader(file);
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      sendNewMessage(reader.result);
    };
  };

  useEffect(() => {
    getMessages();
    if (selectedChat?.lastMessage?.sender !== user._id) {
      clearUnreadMessages();
    }

    //receive message from server using socket
    socket.on("receiveMessage", (message) => {
      const tempSelectedChat = store.getState().userReducer.selectedChat;
      if (tempSelectedChat?._id === message.chat) {
        setMessages((prev) => [...prev, message]);
      }

      //updating blue ticks and clearing unreadmessages in real time
      if (
        tempSelectedChat._id === message.chat &&
        message.sender !== user._id
      ) {
        clearUnreadMessages();
      }
    });

    //clear unread messages from server using socket
    socket.on("unreadMessagesCleared", (data) => {
      const tempAllChats = store.getState().userReducer.allChats;
      const tempSelectedChat = store.getState().userReducer.selectedChat;
      if (data.chat === tempSelectedChat._id) {
        //update unread messages count in selected chat
        const updatedChats = tempAllChats.map((chat) => {
          if (chat._id === data.chat) {
            return {
              ...chat,
              unreadMessagesCount: 0,
            };
          }
          return chat;
        });
        dispatch(SetAllChats(updatedChats));

        //set all messages as read messages
        setMessages((prevMessages) => {
          return prevMessages.map((message) => {
            return {
              ...message,
              read: true,
            };
          });
        });
      }
    });

    //receipent typing message from server using socket
    socket.on("startedTyping", (data) => {
      const selectedChat = store.getState().userReducer.selectedChat;
      if (data.chat === selectedChat._id && data.sender !== user._id) {
        setIsReceipentTyping(true);
      }
      setTimeout(() => {
        setIsReceipentTyping(false);
      }, 1500);
    });
  }, [selectedChat]);

  useEffect(() => {
    //always scroll to bottom after every new message
    const messagesContainer = document.getElementById("message");
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }, [messages, isReceipentTyping]);

  return (
    <div className="shadow-2xl bg-gray-100 h-[75vh] border w-full rounded-2xl flex flex-col justify-between p-5">
      {/* 1st part : Receipent User */}
      <div>
        <div className="flex gap-3 items-center mb-2">
          {receipentUser.profilePic && (
            <img
              src={receipentUser.profilePic}
              alt="profile-pic"
              className="w-10 h-10 rounded-full"
            />
          )}
          {!receipentUser?.profilePic && (
            <div className="bg-gray-300 text-primary rounded-full h-10 w-10 flex items-center justify-center">
              <h1 className="uppercase text-xl font-bold">
                {receipentUser?.name?.charAt(0)}
              </h1>
            </div>
          )}
          <div>
            <h1 className="uppercase">{receipentUser?.name}</h1>
            {onlineUsers.includes(receipentUser?._id) && (
              <h1 className="text-gray-500 text-sm items-center justify-center">
                Online
              </h1>
            )}
          </div>
        </div>

        <hr />
      </div>

      {/* 2nd part : Chat messages */}
      <div className="overflow-y-scroll p-5 h-[55vh] " id="message">
        <div className="flex flex-col gap-3">
          {messages.map((message) => {
            const isCurrentUserIsSender = message.sender === user._id;
            return (
              <div className={`flex ${isCurrentUserIsSender && "justify-end"}`}>
                <div className="flex flex-col gap-1 ">
                  <div className="shadow-2xl">
                    {message.text && (
                      <h1
                        className={`${
                          isCurrentUserIsSender
                            ? "bg-primary text-white rounded-bl-none"
                            : "bg-gray-300 text-primary rounded-tr-none"
                        } p-2 rounded-xl  `}
                      >
                        {message.text}
                      </h1>
                    )}

                    {message.image && (
                      <img
                        src={message.image}
                        alt="chat-image"
                        className="w-24 h-24 rounded-xl"
                      />
                    )}
                  </div>
                  <h1 className="text-gray-500 text-xs">
                    {moment(message.createdAt).format("hh:mm:A")}
                  </h1>
                </div>
                {isCurrentUserIsSender && (
                  <i
                    className={`ri-check-double-line text-lg p-1
                ${message?.read ? "text-blue-1000" : "text-gray-400"}
                `}
                  ></i>
                )}
              </div>
            );
          })}
          {isReceipentTyping && (
            <h1 className="text-gray-500 text-sm">typing...</h1>
          )}
        </div>
      </div>

      {/* 3rd part : chat input */}

      <div className="relative h-18 rounded-xl border-gray-300 shadow-md border flex justify-between items-center p-2">
        {showEmojiPicker && (
          <div className="absolute bottom-12">
            <EmojiPicker
              height={350}
              width={600}
              onEmojiClick={(e) => {
                setNewMessage(newMessage + e.emoji);
                // setShowEmojiPicker(false);
              }}
            />
          </div>
        )}

        <div className="flex gap-2">
          <label htmlFor="file">
            <i className="ri-links-fill cursor-pointer text-2xl text-gray-700"></i>
            <input
              type="file"
              id="file"
              accept="image/gif,image/jpeg,image/png,image/jpg"
              style={{ display: "none" }}
              onChange={onUploadImageClick}
            />
          </label>
          <i
            className="ri-emotion-line cursor-pointer text-2xl text-gray-700"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          ></i>
        </div>
        <input
          type="text"
          placeholder="Message"
          className="w-[95%] border-0 h-full rounded-xl focus:border-none"
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value);
            socket.emit("typing", {
              chat: selectedChat._id,
              members: selectedChat.members.map((mem) => mem._id),
              sender: user._id,
            });
          }}
        />
        <button
          className="bg-primary text-white py-1 px-3 rounded h-max items-center"
          onClick={()=>sendNewMessage('')}
        >
          <i className="ri-send-plane-2-fill"></i>
        </button>
      </div>
    </div>
  );
}

export default ChatArea;
