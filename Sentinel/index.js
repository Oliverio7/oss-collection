require("dotenv").config();
const PREFIX = process.env.PREFIX || "!";
console.log("Active PREFIX:: [" + PREFIX + "]");
const TOKEN = process.env.DISCORD_TOKEN;
const {
  Client,
  GatewayIntentBits,
  Events,
  EmbedBuilder,
} = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Client ready event
client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

// Command handler
client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(PREFIX)) return;
  const args = message.content.slice(PREFIX.length).trim().split(/ +/);

  const command = args.shift().toLowerCase();

  // Switch statement to handle different commands
  switch (command) {
    // Ping command to check bot latency
    case "ping":
      message.reply(`¡Pong! ${client.ws.ping} ms`);
      break;
    case "name":
      message.reply("Sentinel");
      break;
    // Avatar command to display user's avatar
    case "avatar":
      const targetUser = message.mentions.users.first() || message.author;

      const avatarUrl = targetUser.displayAvatarURL({
        size: 1024,
        dynamic: true,
      });
      const avatarEmbed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle(`${targetUser.username}'s avatar`)
        .setImage(avatarUrl)
        .setFooter({
          text: `Requested by: ${message.author.username} ID ${targetUser.id}`,
        })
        .setTimestamp();
      message.reply({ embeds: [avatarEmbed] });
      break;
    // 8ball command for random answers
    case "8ball":
      if (args.length === 0) {
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
    // Gif command to search for gifs using Giphy API
    case "gif":
      if (args.length === 0) {
        message.reply("Please provide a search term");
        break;
      }
      const query = args.join(" ");
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
    // Pokedex command to fetch Pokemon data
    case "pokedex":
      if (args.length === 0) {
        message.reply("Please provide a Pokemon name");
        break;
      }
      const pokeName = args[0].toLowerCase();
      try {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${pokeName}`
        );
        if (!response.ok) {
          message.reply("Pokemon not found");
          break;
        }
        const data = await response.json();
        const name = data.name.charAt(0).toUpperCase() + data.name.slice(1);
        const id = data.id;
        const type = data.types.map((t) => t.type.name).join(", ");
        const hp = data.stats[0].base_stat;
        const atk = data.stats[1].base_stat;
        const def = data.stats[2].base_stat;

        const sprite = data.sprites.front_default;
        const sprite_shiny = data.sprites.front_shiny;
        const spriteHD =
          data.sprites.other["official-artwork"].front_default ||
          data.sprites.front_default;

        // Create embed with Pokemon details
        const embed = new EmbedBuilder()
          .setColor(0xff0000)
          .setTitle(`${name} #${id}`)
          .setDescription(`**Types:** ${type}`)
          .addFields(
            { name: "HP", value: `${hp}`, inline: true },
            { name: "Attack", value: `${atk}`, inline: true },
            { name: "Defense", value: `${def}`, inline: true }
          )
          .setImage(spriteHD)
          .setTimestamp();

        message.reply({ embeds: [embed] });
      } catch (error) {
        console.log(error);
        message.reply("An error occurred");
      }
      break;
    case "coin":
    case "flip":
      const side = ["heads", "tails"];
      const winingSide = side[Math.floor(Math.random() * side.length)];
      message.reply(`The coin landed on ${winingSide}`);
      break;
    default:
      message.reply("Invalid command");
      break;
  }
});

client.login(process.env.DISCORD_TOKEN);
