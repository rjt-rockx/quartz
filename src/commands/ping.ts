import { CommandInteraction, MessageEmbed } from "discord.js";
import { Command } from "../interfaces/command";

export default class Ping extends Command {
	info = {
		name: "ping",
		description: "Get the ping of the bot.",
		guildOnly: false,
	};

	async handleInteraction(interaction: CommandInteraction): Promise<void> {
		await interaction.reply({
			embeds: [{ description: `Pong! ${interaction.client.ws.ping}ms` }] as MessageEmbed[],
			ephemeral: true,
		});
	}
}
