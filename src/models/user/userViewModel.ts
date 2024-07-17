import { ObjectId } from "mongodb";

export interface UserViewModel {
	_id: ObjectId;
	id: string;
	login: string;
	email: string;
	passwordSalt: string,
	passwordHash: string;
	createdAt: Date;
}

export interface UserViewModelClient {
	id: string;
	login: string;
	email: string;
	createdAt: Date;
	token: string;
}

export class UserModelsMapper {
	static mapFromDatabaseToClientModel(source: UserViewModel, token: string): UserViewModelClient {
		const { id, login, email, createdAt } = source;
		return {
			id,
			login,
			email,
			createdAt,
			token
		};
	}
}