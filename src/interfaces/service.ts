import { Client, ClientEvents, Awaitable } from "discord.js";

interface ServiceInfo {
	name: string;
	context: "global" | "guild";
	events?: Array<keyof ClientEvents>;
}

type onEvent<T> = T extends `${infer C}${infer E}` ? `on${Uppercase<C>}${E}` : never;

type ReverseEventMap = {
	[K in keyof ClientEvents]: onEvent<K>;
};

type ReverseMap<T extends Record<keyof T, keyof never>> = {
    [P in T[keyof T]]: {
        [K in keyof T]: T[K] extends P ? K : never
    }[keyof T]
}

type EventMap = ReverseMap<ReverseEventMap>;

type Events = {
	[K in keyof EventMap]?: (...args: ClientEvents[EventMap[K]]) => Awaitable<void>;
};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Service extends Events {

}

abstract class Service {
	abstract info: ServiceInfo;

	constructor(public client: Client) {
		this.client = client;
	}
}

export { Service, Events, EventMap, ReverseEventMap, ServiceInfo };
