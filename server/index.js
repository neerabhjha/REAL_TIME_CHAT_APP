const express = require("express");
const app = express();
const dbConnect = require("./dbConnect");
require("dotenv").config("./.env");
const cors = require("cors");

const authRouter = require("./routers/authRouter");
const userRouter = require("./routers/userRouter");
const chatRouter = require("./routers/chatRouter");
const messageRouter = require("./routers/messageRouter");

app.use(express.json({ limit: "100mb" }));

const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

//check the connection of socket from client
let onlineUsers = [];
io.on("connection", (socket) => {
  //socket events will be here
  socket.on("joinRoom", (userId) => {
    // console.log("user Joined", userId);
    socket.join(userId);
  });

  //send message to clients (who are present in members array)
  socket.once("sendMessage", (message) => {
    io.to(message.members[0])
      .to(message.members[1])
      .emit("receiveMessage", message);
  });

  //clear unread messages
  socket.on("clearUnreadMessages", (data) => {
    io.to(data.members[0])
      .to(data.members[1])
      .emit("unreadMessagesCleared", data);
  });

  //typing event
  socket.on("typing", (data) => {
    io.to(data.members[0]).to(data.members[1]).emit("startedTyping", data);
  });

  //online users functionality
  socket.on("cameOnline", (userId) => {
    if (!onlineUsers.includes(userId)) {
      onlineUsers.push(userId);
    }
    // console.log(onlineUsers);
    socket.emit("onlineUsers", onlineUsers);
  });

  // // receiving data from user1 and sending it to user2
  // socket.on("sendMessage", ({ text, sender, receipent }) => {
  //   // 'to' method is used to send data only to single user
  //   //for sending data to both the sender and receiver we use 'on method'
  //   io.to(receipent).emit("receiveMessage",
  //     {
  //       text,
  //       sender,
  //     });
  // });
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);

const port = process.env.PORT || 4000;

dbConnect();

const path = require("path");
__dirname = path.resolve();
// render deployment
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}

server.listen(port, () => {
  console.log(`Server running on ${port}`);
});
