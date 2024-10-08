// rooms.js

let rooms = []; // Simulando armazenamento de salas em memória

// Função para buscar todas as salas
function getRooms() {
  return rooms;
}

// Função para criar uma nova sala
function createRoom(name) {
  const newRoom = {
    id: rooms.length + 1, // ID único para a sala
    name,
  };
  rooms.push(newRoom);
  return newRoom;
}

module.exports = { getRooms, createRoom };