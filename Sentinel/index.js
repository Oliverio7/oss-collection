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
client.on(Events.MessageCreate, async (message) => {
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
    case "!gif":
      if (args.length === 1) {
        message.reply("Please provide a search term");
        break;
      }

      const query = args.slice(1).join(" ");

      try {
        const response = await fetch(
          `https://api.giphy.com/v1/gifs/search?api_key=${process.env.GIPHY_API_KEY}&q=${query}&limit=10&rating=g`
        );

        const data = await response.json();

        if (data.data.length === 0) {
          message.reply("No results found");
          break;
        }

        const randomIndex = Math.floor(Math.random() * data.data.length);
        message.reply(data.data[randomIndex].url);
      } catch (error) {
        console.log(error);
        message.reply("An error occurred");
      }
      break;
    default:
      break;
  }
});

client.login(process.env.DISCORD_TOKEN);
