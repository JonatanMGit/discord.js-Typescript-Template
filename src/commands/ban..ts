import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction, Guild, GuildMember, User} from "discord.js";

module.exports = {
	data: new SlashCommandBuilder()
		.setName("ban")
		.setDescription("Bans a user using their username or their id")
		.addSubcommand(subcommand =>
			subcommand
				.setName("user")
				.setDescription("Select a user currently on the Server")
				.addUserOption(option => option.setName("target").setDescription("The user to ban")))
		.addSubcommand(subcommand =>
			subcommand
				.setName("userid")
				.setDescription("Info about the server")
				.addStringOption(option => option.setName("target").setDescription("The user to ban"))),
	execute: async (interaction: CommandInteraction) => {
		const target = interaction.options.getUser("target") || (interaction.guild.members.cache.get(interaction.options.getString("target")));
		const member: GuildMember = interaction.member as GuildMember;
		const guild = member.guild as Guild;
		if (interaction.guild === null) {
			return interaction.reply("This command can only be used in a server!");
		}
		if (member.permissions.has("BAN_MEMBERS")) {
			return interaction.reply("You do not have permission to ban that user!");
		}
		try {
			await guild.members.ban(target, { days: 1, reason: "Banned by " + interaction.user.username });
			return interaction.reply(`Successfully banned ${target.tag}!`);
		} catch (e) {
			return interaction.reply("There was an error banning that user!");
		}
	},
};