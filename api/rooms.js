const redis = require("redis");

const redisHost = process.env.REDIS_HOST || "localhost";
const redisPort = process.env.REDIS_PORT || 6379;
const redisPass = process.env.REDIS_PASS || "";

const client = redis.createClient({
  password: redisPass,
  socket: {
    host: redisHost,
    port: redisPort,
  },
});

client.on("error", (err) => console.error("Redis Client Error", err));

client.connect();

async function getRooms() {
  try {
    const roomsData = await client.get("rooms");
    if (!roomsData) return [];
    return JSON.parse(roomsData);
  } catch (error) {
    console.error("Error getting rooms:", error);
    return [];
  }
}

async function createRoom(name) {
  try {
    const rooms = await getRooms();
    const newRoom = {
      id: rooms.length + 1,
      name,
    };
    rooms.push(newRoom);
    await client.set("rooms", JSON.stringify(rooms));

    return newRoom;
  } catch (error) {
    console.error("Error creating room:", error);
    return null;
  }
}
module.exports = { getRooms, createRoom };
