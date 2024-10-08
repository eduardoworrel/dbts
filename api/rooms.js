const redis = require('redis');

const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = process.env.REDIS_PORT || 6379;
const redisPass = process.env.REDIS_PASS || "";

const client = redis.createClient({
    password: redisPass,
    socket: {
        host: redisHost,
        port: redisPort
    }
});


client.on('error', (err) => console.error('Redis Client Error', err));

client.connect();

async function getRooms() {
  const rooms = await client.lRange('rooms', 0, -1);  
  return rooms.map(room => JSON.parse(room)); 
}

// Função para criar uma nova sala
async function createRoom(name) {
  const rooms = await getRooms();
  const newRoom = {
    id: rooms.length + 1,  
    name,
  };
  
  await client.rPush('rooms', JSON.stringify(newRoom));

  return newRoom;
}

module.exports = { getRooms, createRoom };