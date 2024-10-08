// server.js

const express = require('express');
const cors = require('cors');
const { getRooms, createRoom } = require('./rooms');
const http = require('http'); // Necessário para o Socket.IO
const { Server } = require('socket.io');

const app = express();
const PORT = 8080;

// Criar o servidor HTTP e integrar o Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Permite que o frontend se conecte de qualquer lugar
  },
});

// Middleware do Express
app.use(cors());
app.use(express.json()); // Processar JSON no corpo da requisição

// ----------------- Rotas da API -----------------

// Rota para obter todas as salas
app.get('/api/rooms', (req, res) => {
  const rooms = getRooms();
  res.json(rooms); // Enviar as salas como resposta
});

// Rota para criar uma nova sala
app.post('/api/rooms', (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Room name is required' });
  }

  const newRoom = createRoom(name); // Cria a nova sala
  res.status(201).json(newRoom); // Retorna a nova sala criada
});

// ----------------- Lógica do Socket.IO -----------------

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Quando o cliente entra em uma sala
  socket.on('join_room', (roomId) => {
    socket.join(roomId); // Adicionar o cliente à sala
    console.log(`Client ${socket.id} joined room ${roomId}`);
  });

  // Quando uma mensagem é enviada para a sala
  socket.on('send_message', (message) => {
    const { roomId, user, message: msg } = message;
    io.to(roomId).emit('receive_message', { user, message: msg }); // Enviar mensagem para todos na sala
  });

  // Quando o cliente sai ou desconecta
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Iniciar o servidor
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});