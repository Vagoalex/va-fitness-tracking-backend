import { Collection, InsertOneResult } from "mongodb";
import { MAIN_DB } from "../infrastrucure/db";
import { UserViewModel } from "../models/user/userViewModel";
import { settings } from "../settings/settings";

const usersCollection: Collection<UserViewModel> = MAIN_DB.collection<UserViewModel>(
	settings.MONGO_DB_USERS_COLLECTION_NAME!);


export const usersDbRepository = {
	async createUser(payload: UserViewModel): Promise<InsertOneResult<UserViewModel>> {
		return await usersCollection.insertOne(payload);
	},
	async findByLoginOrEmail(loginOrEmail: string) {
		return usersCollection.findOne({
			$or: [
				{ email: loginOrEmail }, { userName: loginOrEmail }
			]
		});
	},
	async findUserById(id: string): Promise<UserViewModel | null> {
		return await usersCollection.findOne({ id });
	}
};