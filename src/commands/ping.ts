import { CommandInteraction, MessageEmbed } from "discord.js";
import { Command, CommandInfo } from "../interfaces/command";

export default class Ping extends Command {
	info: CommandInfo = {
		name: "ping",
		description: "Get the ping of the bot.",
		context: "guild",
		type: "CHAT_INPUT",
	};

	async onCommand(interaction: CommandInteraction): Promise<void> {
		await interaction.reply({
			embeds: [{ description: `Pong! ${interaction.client.ws.ping}ms` }] as MessageEmbed[],
			ephemeral: false,
		});
	}
}
