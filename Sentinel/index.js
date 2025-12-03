require("dotenv").config();
const TOKEN = process.env.DISCORD_TOKEN;
const { Client, GatewayIntentBits, Events } = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Command handler
client.on(Events.MessageCreate, (message) => {
  if (message.author.bot) return;
  const args = message.content.split(" ");
  const command = args[0].toLowerCase();

  switch (command) {
    case "!ping":
      message.reply(`¡Pong! ${client.ws.ping} ms`);
      break;
    case "!name":
      message.reply("Sentinel");
      break;
    case "!avatar":
      message.reply(message.author.displayAvatarURL());
      break;
    case "!8ball":
      if (args.length === 1) {
        message.reply("Please provide a question");
        break;
      }
      const box = [
        "Yes",
        "No",
        "Maybe",
        "Ask again",
        "I don't know",
        "That's for sure",
        "Never",
        "Always",
      ];
      const index = Math.floor(Math.random() * box.length);
      message.reply(box[index]);
      break;
    default:
      break;
  }
});

client.login(process.env.DISCORD_TOKEN);
