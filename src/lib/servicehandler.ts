import { Client } from "discord.js";
import { Service, ReverseEventMap, EventMap } from "../interfaces/service";
import fs from "fs";

const onText = (text: keyof ReverseEventMap): keyof EventMap => (text.replace(/\w\S*/g, txt => "on" + txt.charAt(0).toUpperCase() + txt.substring(1))) as keyof EventMap;

export default class ServiceHandler {
	client: Client;
	events: Map<keyof ReverseEventMap, Service[]>;

	constructor(client: Client) {
		this.client = client;
		this.events = new Map<keyof ReverseEventMap, Service[]>();
	}

	async registerAllServices(path = `${process.cwd()}/src/services/`): Promise<void> {
		for (const file of fs.readdirSync(path)) {
			if (!file.endsWith(".ts")) continue;
			const { default: service } = await import(`${path}${file}`);
			if (service.prototype instanceof Service) {
				const serviceInstance: Service = new service(this.client) as Service;
				this.registerServiceEvents(serviceInstance);
			}
		}
	}

	registerServiceEvents(service: Service): void {
		if (service.info.events) {
			for (const event of service.info.events) {
				const existingServices = (this.events.has(event)
					&& Array.isArray(this.events.get(event))
					? this.events.get(event) : []) as Service[];
				existingServices.push(service);
				this.events.set(event, existingServices);
			}
		}
	}

	listenEvents(events: typeof this.events): void {
		for (const [event, services] of events) {
			this.client.on(event, (...args) => {
				if (Array.isArray(services) && services.length) {
					for (const service of services) {
						const fnName = onText(event);
						if (fnName in service) {
							service[fnName](...args);
							// borked
						}
					}
				}
			});
		}
	}
}
