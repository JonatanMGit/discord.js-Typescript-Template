import { Client, Intents, TextChannel } from "discord.js";
import schedule = require("node-schedule");
import config from "./settings";
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});
import fs from "fs";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
}

// Refresh guild slash commands
const clientId = "851889838177255444";
const guildId = "779357485927759922";
const rest = new REST({ version: "9" }).setToken(config.DisToken);
(async () => {
  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: commands,
    });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();

// Every Bot event
client.login(config.DisToken);

client.on("ready", () => {
  client.user.setActivity("mit wer?", { type: "PLAYING" });
  console.log(
    `Logged in as "${client.user.tag}" with the ID "${client.user.id}"\nCurrently in ${client.guilds.cache.size} servers:`
  );
  client.guilds.cache.forEach((guild) => {
    console.log(`${guild.name} | ${guild.id}`);
  });
});

client.login(config.DisToken);

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = require(`./commands/${interaction.commandName}`);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    if (error.code == "10062") {
      console.log("DiscordAPIError: Unknown interaction.");
    } else {
      console.log(error);
    }
  }
});

process.on("unhandledRejection", function (err) {
  console.log("An Error has occured!");
  console.error(err);
});

process.on("uncaughtException", function (err) {
  console.log("An Error has occured!");
  console.error(err);
});
