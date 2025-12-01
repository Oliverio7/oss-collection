require("dotenv").config();
const { Client, GatewayIntentBits, Events } = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const TOKEN = process.env.DISCORD_TOKEN;

client.on(Events.MessageCreate, (message) => {
  if (message.content === "!ping") {
    message.reply(`¡Pong! ${client.ws.ping} ms`);
  }
});
client.login(process.env.DISCORD_TOKEN);
