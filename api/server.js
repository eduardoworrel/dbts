const express = require("express");
const cors = require("cors");
const { getRooms, createRoom } = require("./rooms");
const { getMessages, addMessage } = require("./messages");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const PORT = 8080;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());
app.use(express.json());

let activeUsers = [];

app.get("/api/rooms", async (req, res) => {
  const rooms = await getRooms();
  res.json(rooms);
});

app.post("/api/rooms", async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Room name is required" });
  }

  const newRoom = await createRoom(name);
  res.status(201).json(newRoom);
});

app.post("/api/validate-username", (req, res) => {
  const { username } = req.body;

  if (activeUsers.includes(username)) {
    return res.json({ isValid: false });
  }

  return res.json({ isValid: true });
});

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("join_room", async ({ roomId, username }) => {
    socket.join(roomId);

    if (!activeUsers.includes(username)) {
      activeUsers.push(username);
    }

    console.log(`Client ${socket.id} (${username}) joined room ${roomId}`);

    const messages = await getMessages(roomId);
    socket.emit("load_messages", messages);
  });

  socket.on("send_message", async (message) => {
    const { roomId, user, message: msg } = message;

    const newMessage = await addMessage(roomId, user, msg);

    io.to(roomId).emit("receive_message", newMessage);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);

    activeUsers = activeUsers.filter(
      (username) => username !== socket.username,
    );
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
