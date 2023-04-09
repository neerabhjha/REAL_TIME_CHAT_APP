import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CreateNewChat } from "../../../apicalls/chats";
import { SetAllChats, SetSelectedChat } from "../../../redux/userSlice";
import { HideLoader, ShowLoader } from "../../../redux/loaderSlice";
import { toast } from "react-hot-toast";
import moment from "moment";
import store from "../../../redux/store";

function UsersList({ searchKey, socket, onlineUsers, setSearchKey }) {
  const dispatch = useDispatch();
  const { allUsers, allChats, user, selectedChat } = useSelector(
    (state) => state.userReducer
  );

  const handleCreateNewChat = async (receipentUserId) => {
    try {
      dispatch(ShowLoader());
      const response = await CreateNewChat([user._id, receipentUserId]);
      // console.log("res from createChat", response);
      dispatch(HideLoader());
      if (response.success) {
        toast.success(response.message);
        const newChat = response.data;
        const updatedChats = [...allChats, newChat];
        dispatch(SetAllChats(updatedChats));
        dispatch(SetSelectedChat(newChat));
        setSearchKey("");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoader());
      toast.error(error.message);
    }
  };

  const handleOpenChat = async (receipentUserId) => {
    try {
      const chat = await allChats.find(
        (chat) =>
          chat.members.map((mem) => mem._id).includes(user._id) &&
          chat.members.map((mem) => mem._id).includes(receipentUserId)
      );
      if (chat) {
        // console.log("res from useList", chat);
        dispatch(SetSelectedChat(chat));
      }
    } catch (error) {
      console.log("catch error", error);
    }
  };

  const getData = () => {
    //if search key is empty then return all the chats else return filtered chats and users
    if (searchKey === "") {
      return allChats;
    }
    return allUsers.filter((user) =>
      user.name.toLowerCase().includes(searchKey.toLowerCase())
    );
  };

  const getIsSelectedChatOrNot = (userObj) => {
    if (selectedChat) {
      return selectedChat?.members?.map((mem) => mem._id).includes(userObj._id);
    } else {
      return false;
    }
  };

  const getLastMessage = (userObj) => {
    const chat = allChats.find((chat) =>
      chat.members.map((mem) => mem._id).includes(userObj._id)
    );
    if (!chat || !chat.lastMessage) {
      return "";
    } else {
      const lastMessagePerson =
        chat?.lastMessage?.sender === user._id ? "You:" : "";
      return (
        <div className="flex justify-between w-72">
          <h1 className="text-gray-600 text-sm">
            {lastMessagePerson} {chat?.lastMessage?.text}
          </h1>

          <h1 className="text-gray-500 text-xs">
            {moment(chat?.lastMessage?.createdAt).format("hh:mm:A")}
          </h1>
        </div>
      );
    }
  };

  const getUnreadMessages = (userObj) => {
    const chat = allChats.find((chat) =>
      chat.members.map((mem) => mem._id).includes(userObj._id)
    );
    if (
      chat &&
      chat?.unreadMessages &&
      chat?.lastMessage?.sender !== user._id
    ) {
      return (
        <div className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {chat?.unreadMessages}
        </div>
      );
    }
  };

  useEffect(() => {
    socket.on("receiveMessage", (message) => {
      //if the chat area opened !== chat in message then increase unread messages by 1 and update last message
      const tempSelectedChat = store.getState().userReducer.selectedChat;
      let tempAllChats = store.getState().userReducer.allChats;
      if (tempSelectedChat?._id !== message.chat) {
        const updatedAllChats = tempAllChats.map((chat) => {
          if (chat._id === message.chat) {
            return {
              ...chat,
              unreadMessages: (chat?.unreadMessages || 0) + 1,
              lastMessage: message,
            };
          }
          return chat;
        });
        tempAllChats = updatedAllChats;
      }

      //always latest msg chat will be on the top
      const latestChat = tempAllChats.find((chat) => chat._id === message.chat);
      const otherChats = tempAllChats.filter(
        (chat) => chat._id !== message.chat
      );
      tempAllChats = [latestChat, ...otherChats];
      dispatch(SetAllChats(tempAllChats));
    });
  }, []);

  return (
    <div className="flex flex-col gap-3 mt-5 lg:w-96 xl:w-96 md:w-60 sm:w-60">
      {getData().map((chatObjOrUserObj) => {
        let userObj = chatObjOrUserObj;
        if (chatObjOrUserObj.members) {
          userObj = chatObjOrUserObj.members.find(
            (mem) => mem._id !== user._id
          );
        }
        return (
          <div
            className={`shadow-md border rounded-xl bg-white p-3 flex justify-between items-center cursor-pointer w-full 
            ${getIsSelectedChatOrNot(userObj) && "bg-blue-300 shadow-2xl"}
            `}
            key={userObj._id}
            onClick={() => handleOpenChat(userObj._id)}
          >
            <div className="flex gap-5 items-center w-full">
              {userObj.profilePic && (
                <div className="relative">
                  <img
                    src={userObj.profilePic}
                    alt="profile-pic"
                    className="w-10 h-10 rounded-full"
                  />
                </div>
              )}
              {!userObj.profilePic && (
                <div className="bg-gray-400 text-primary rounded-full h-10 w-10 flex items-center justify-center relative">
                  <h1 className="uppercase text-xl font-bold">
                    {userObj.name[0]}
                  </h1>
                </div>
              )}
              <div className="flex flex-col gap-1">
                <div className="flex gap-1">
                  <div className="flex gap-2 items-center">
                    <h1>{userObj.name}</h1>
                    {onlineUsers.includes(userObj._id) && (
                      <div>
                        <div className="bg-green-700 h-3 w-3 rounded-full "></div>
                      </div>
                    )}
                  </div>

                  {getUnreadMessages(userObj)}
                </div>

                {getLastMessage(userObj)}
              </div>
            </div>
            <div onClick={() => handleCreateNewChat(userObj._id)}>
              {!allChats.find((chat) =>
                chat.members.map((mem) => mem._id).includes(userObj._id)
              ) && (
                <button className="text-primary text-2xl p-1 rounded">
                  <i className="ri-chat-new-line"></i>
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default UsersList;
