import "dotenv/config";

const isDevelopment = process.env.NODE_ENV === "development";

export const settings = {
	MONGO_DB_URI: process.env.MONGO_DB_URI || "mongodb://localhost:27017/?maxPoolSize=20&w=majority",
	MONGO_DB_MAIN_CLUSTER_NAME: (isDevelopment ? process.env.MONGO_DB_MAIN_DEV_CLUSTER_NAME : process.env.MONGO_DB_MAIN_CLUSTER_NAME) || "va-fitness-tracking",
	MONGO_DB_USERS_COLLECTION_NAME: process.env.MONGO_DB_USERS_COLLECTION_NAME || "users",
	MONGO_DB_COURSES_COLLECTION_NAME: process.env.MONGO_DB_COURSES_COLLECTION_NAME || "courses",
	JWT_SECRET: process.env.JWT_SECRET || "secret"
};