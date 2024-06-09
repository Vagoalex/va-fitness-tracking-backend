import { UserViewModel } from "../models/user/userViewModel";

declare global {
	declare namespace Express {
		export interface Request {
			user: UserViewModel | null;
		}
	}
}