import { Client, ClientOptions, Intents, Message } from "discord.js";
import CommandHandler from "./lib/commandhandler";
import dotenv from "dotenv";

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
const commandHandler = new CommandHandler(client);

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
		await commandHandler.registerAllCommands(message.guild);
	}
	if (message.cleanContent === "!reset" && message.author.id === process.env.BOT_OWNER_ID) {
		await message.reply({ embeds: [{ description: "Resetting all commands." }] });
		if (client.application) {
			await client.application.commands.fetch();
			for (const [_, command] of client.application.commands.cache) {
				console.log(`Deleting ${command.name}`);
				await client.application.commands.delete(command);
			}
		}
	}
});
