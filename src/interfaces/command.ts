import { Client, CommandInteraction, Interaction, ApplicationCommandData } from "discord.js";

type CommandContext = { context: "global" | "guild"; };

type CommandInfo = CommandContext & ApplicationCommandData;

abstract class Command {
	abstract info: CommandInfo;
	abstract onCommand(interaction: CommandInteraction): void;

	constructor(client: Client) {
		client.on("interactionCreate", async (interaction: Interaction): Promise<void> => {
			console.log(interaction);
			if (interaction instanceof CommandInteraction && interaction.commandName === this.info.name) {
				if (this.info.context === "global" && !interaction.inGuild())
					return;
				return this.onCommand(interaction);
			}
		});
	}
}

export { Command, CommandInfo };
