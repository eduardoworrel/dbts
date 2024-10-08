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

(async () => {
  await client.connect();
})();

async function getMessages(roomId) {
  try {
    const messagesData = await client.get(`messages:${roomId}`);
    if (!messagesData) return [];
    return JSON.parse(messagesData);
  } catch (error) {
    console.error("Error getting messages:", error);
    return [];
  }
}

async function addMessage(roomId, user, message) {
  try {
    const messages = await getMessages(roomId);
    const newMessage = { user, message, timestamp: new Date() };

    messages.push(newMessage);
    await client.set(`messages:${roomId}`, JSON.stringify(messages));

    return newMessage;
  } catch (error) {
    console.error("Error adding message:", error);
    return null;
  }
}

async function disconnectRedis() {
  try {
    await client.disconnect();
    console.log("Redis client disconnected.");
  } catch (error) {
    console.error("Error disconnecting Redis:", error);
  }
}

module.exports = { getMessages, addMessage, disconnectRedis };
