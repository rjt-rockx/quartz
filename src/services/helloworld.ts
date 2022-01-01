import { Client } from "discord.js";
import { Service, ServiceInfo } from "../interfaces/service";

export default class HelloWorldService extends Service {
	info: ServiceInfo = {
		name: "Hello World",
		context: "global",
	}
	constructor(client: Client) {
		super(client);
	}
}
