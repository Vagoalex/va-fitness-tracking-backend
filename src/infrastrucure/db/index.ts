import { MongoClient } from "mongodb";
import { settings } from "../../settings/settings";

const MONGO_URL = settings.MONGO_DB_URI!;
const MONGO_DB_CLUSTER_NAME = settings.MONGO_DB_MAIN_CLUSTER_NAME;

export const client = new MongoClient(MONGO_URL);

export const MAIN_DB = client.db(settings.MONGO_DB_MAIN_CLUSTER_NAME!);

export const runDB = async () => {
	try {
		await client.connect();
		
		await client.db(MONGO_DB_CLUSTER_NAME).command({ ping: 1 });
		
		console.log("Connected successfully to MongoDB server");
	} catch (ex) {
		console.log("Can't connect to MongoDB server");
		await client.close();
	}
};