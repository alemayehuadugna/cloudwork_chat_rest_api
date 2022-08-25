import { Db, MongoClient } from "mongodb";
import { container } from "./di";

const mongodb = {
	database: 'cloudwork',
	host: 'mongodb://localhost:27017',
	username: 'cloudwork',
	password: 'cloudwork',
};

const initDatabase = async () => {
	const client = new MongoClient(mongodb.host, {
		auth: { username: mongodb.username, password: mongodb.password },
	});
	
	await client.connect();
	client.on("error", console.error.bind(console, " connection error: "));

	const db = client.db(mongodb.database);
	container.bind<Db>('Db').toConstantValue(db);

	return async () => {
		client.close();
	}
}

export { initDatabase };
