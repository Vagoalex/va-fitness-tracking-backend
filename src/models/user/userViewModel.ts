import { ObjectId } from "mongodb";

export interface UserViewModel {
	_id: ObjectId;
	login: string;
	email: string;
	passwordSalt: string,
	passwordHash: string;
	createdAt: Date;
}

export interface UserViewModelClient {
	_id: ObjectId;
	login: string;
	email: string;
	passwordSalt: string,
	passwordHash: string;
	createdAt: Date;
}
