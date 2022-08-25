import "reflect-metadata";
import { initDatabase } from "./database";
import { initInjection } from "./di";
import { initSocketServer } from "./socket";

const main = async () => {
	await initDatabase();
	await initInjection();
	await initSocketServer();
}

export { main };