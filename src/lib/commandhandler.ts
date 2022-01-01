import { Guild, Client, ClientEvents } from "discord.js";
import { Command } from "../interfaces/command";
import fs from "fs";

export default class CommandHandler {
	client: Client;
	events: Map<keyof ClientEvents, Command[]>;

	constructor(client: Client) {
		this.client = client;
		this.events = new Map<keyof ClientEvents, Command[]>();
	}

	async registerAllCommands(guild: Guild): Promise<void> {
		for (const file of fs.readdirSync(`${process.cwd()}/commands/`)) {
			if (!file.endsWith(".ts")) continue;
			const { default: command } = await import(`${process.cwd()}/commands/${file}`);
			if (command.prototype instanceof Command) {
				const commandInstance: Command = new command(this.client) as Command;
				await guild.commands.create(commandInstance.info);
			}
		}
	}
}
