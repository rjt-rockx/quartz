import { ApplicationCommand, ApplicationCommandData, Client, CommandInteraction, Guild, Interaction } from "discord.js";
interface CommandInfo extends ApplicationCommandData {
	guildOnly: boolean;
}

abstract class Command {
	abstract info: CommandInfo;
	abstract handleInteraction(interaction: CommandInteraction): void;

	async initialize(bearer: Guild | Client): Promise<ApplicationCommand | void> {
		if (bearer instanceof Guild && bearer.available)
			await bearer.commands.create(this.info);
		else if (bearer instanceof Client && bearer.application && !this.info.guildOnly)
			await bearer.application.commands.create(this.info);

		// TODO: move this logic to a separate event handler
		const client: Client = bearer instanceof Client ? bearer : bearer.client;
		client.on("interactionCreate", async (interaction: Interaction) => {
			if (interaction instanceof CommandInteraction && interaction.commandName === this.info.name) {
				if (this.info.guildOnly && !interaction.inGuild())
					return;
				return this.handleInteraction(interaction);
			}
		});
	}
}

export { Command, CommandInfo };
