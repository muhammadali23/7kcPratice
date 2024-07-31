const express = require("express");
const http = require("http");
const body_parser = require("body-parser");
const { Server } = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
app.use(body_parser.json());

const emailToSocketMapping = new Map();
const socketIdToEmailMapping = new Map();

io.on("connection", (socket) => {
  console.log("new Connection");
  socket.on("join_room", (data) => {
    const { emailId, roomId } = data;
    console.log("User ", emailId, " joined room", roomId);
    emailToSocketMapping.set(emailId, roomId);
    socketIdToEmailMapping.set(socket.id, emailId);
    // user join room using room Id
    socket.join(roomId);
    socket.emit("joined_room", { roomId });
    //tell the other joined user that a new user has joied it
    socket.broadcast.to(roomId).emit("user_joined", { emailId });
  });
  socket.on("call-user", (data) => {
    const { emailId, offer } = data;
    const fromEmail = socketIdToEmailMapping.get(socket.id);
    const socketId = emailToSocketMapping.get(emailId);
    socket.to(socketId).emit("incoming-call", { from: fromEmail, offer });
  });
  socket.on("call-accepted", (data) => {
    const { emailId, ans } = data;
    const socketId = emailToSocketMapping.get(emailId);
    socket.to(socketId).emit("call-accepted", { ans });
  });

  socket.on("connect_error", (err) => {
    // the reason of the error, for example "xhr poll error"
    console.log(err.message);

    // some additional description, for example the status code of the initial HTTP response
    console.log(err.description);

    // some additional context, for example the XMLHttpRequest object
    console.log(err.context);
  });
});
io.listen(8010, console.log("sssss"));
app.listen(8000, () => {
  console.log(`Server Started 8000 port`);
});
