const { Server } = require("socket.io");

const io = new Server(8000, {
  cors: true,
});

const emailToSocketMapping = new Map();
const socketIdToEmailMapping = new Map();

io.on("connection", (socket) => {
  console.log("Socket Connected", socket.id);
  socket.on("room_joined", (data) => {
    const { email, roomId } = data;
    emailToSocketMapping.set(email, socket.id);
    socketIdToEmailMapping.set(socket.id, email);
    io.to(roomId).emit("user_joined", { email, id: socket.id });
    socket.join(roomId);
    io.to(socket.id).emit("room_joined", data);
  });

  socket.on("user_call", ({ to, offer }) => {
    io.to(to).emit("incoming_call", { from: socket.id, offer });
  });

  socket.on("call_accepted", ({ to, ans }) => {
    io.to(to).emit("call_accepted", { from: socket.id, ans });
  });

  socket.on("peer_Nego_needed", ({ to, offer }) => {
    io.to(to).emit("peer_Nego_needed", { from: socket.id, offer });
  });

  socket.on("peer_nego_done", ({ to, ans }) => {
    io.to(to).emit("peer_nego_final", { from: socket.id, ans });
  });
});
