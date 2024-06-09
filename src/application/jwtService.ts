import jwt from "jsonwebtoken";
import { UserViewModel } from "../models/user/userViewModel";
import { settings } from "../settings/settings";
import { ObjectId } from "mongodb";

export class JwtService {
	static async createJWT(user: UserViewModel) {
		return jwt.sign({ userId: user._id }, settings.JWT_SECRET, { expiresIn: "1h" });
	}
	
	static async getUserIdByToken(token: string) {
		try {
			const result: any = jwt.verify(token, settings.JWT_SECRET);
			
			return new ObjectId(result.userId);
			
		} catch (err) {
			return null;
		}
	}
}