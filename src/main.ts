import { Client, ClientOptions, Intents, Message } from "discord.js";
import dotenv from "dotenv";
import fs from "fs";
import { Command } from "./interfaces/command";

dotenv.config();

const options: ClientOptions = {
	partials: ["REACTION"],
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
		Intents.FLAGS.GUILD_WEBHOOKS,
		Intents.FLAGS.GUILD_INVITES,
		Intents.FLAGS.GUILD_BANS,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_PRESENCES,
	],
};

const client = new Client(options);
client.login(process.env.BOT_TOKEN);

client.once("ready", async () => {
	if (!client.user)
		throw new Error("No bot user detected.");
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", async (message: Message) => {
	if (!message.guild) return;
	if (message.cleanContent === "!deploy" && message.author.id === process.env.BOT_OWNER_ID) {
		await message.reply({ embeds: [{ description: "Deploying to this guild!" }] });
		for (const file of fs.readdirSync(`${process.cwd()}/src/commands/`)) {
			if (!file.endsWith(".ts")) continue;

			const { default: command } = await import(`./commands/${file}`);
			if (command.prototype instanceof Command)
				await new command().initialize(message.guild);
		}
	}
});
