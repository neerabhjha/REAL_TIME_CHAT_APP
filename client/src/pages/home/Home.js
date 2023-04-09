import React, { useEffect, useState } from "react";
import UserSearch from "./components/UserSearch";
import ChatArea from "./components/ChatArea";
import UsersList from "./components/UsersList";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import bgImage from "../../images/bgImage.png";

const socket = io("https://quick-chat.onrender.com");

function Home() {
  const [searchKey, setSearchKey] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { selectedChat, user } = useSelector((state) => state.userReducer);

  useEffect(() => {
    if (user) {
      //joining the room
      socket.emit("joinRoom", user._id);

      socket.emit("cameOnline", user._id);
      socket.on("onlineUsers", (users) => {
        setOnlineUsers(users);
      });

      //send new message to receipent
      // socket.emit("sendMessage", {
      //   text: "This message is between only two users",
      //   sender: user._id,
      //   receipent: "642d1c8ee48368369aedbe69",
      // });

      //receive message from anotherUser in the room
      // socket.on("receiveMessage", (data) => {
      //   console.log("data", data);
      // });
    }
  }, [user]);

  return (
    <div className="flex gap-5">
      {/* 1st Part : userSearch, usersList/chatList */}
      <div className="w-96">
        <UserSearch searchKey={searchKey} setSearchKey={setSearchKey} />
        <UsersList
          searchKey={searchKey}
          socket={socket}
          onlineUsers={onlineUsers}
          setSearchKey={setSearchKey}
        />
      </div>

      {/* 2nd part: chatBox/chatArea */}

      {selectedChat && (
        <div className="w-full">
          <ChatArea socket={socket} onlineUsers={onlineUsers} />
        </div>
      )}
      {!selectedChat && (
        <div className="flex flex-col gap-3 items-center justify-center">
          <img src={bgImage} alt="bg-img" />
          <h1 className="text-3xl font-bold text-gray-700">
            Select a user to chat
          </h1>
        </div>
      )}
    </div>
  );
}

export default Home;
