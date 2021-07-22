import { Client, ClientOptions, Intents } from "discord.js";
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
client.login(process.env.BOT_TOKEN);

client.once("ready", () => console.log(`Logged in as ${client.user?.tag}!`));
