import express from "express";
import { RequestWithBodyType } from "../types/express/typedRequest";
import { TypedResponse } from "../types/express/typedResponse";
import { UserViewModel } from "../models/user/userViewModel";
import { TypedResponseMessage } from "../types/express/typedResponseMessage";
import { usersService } from "../domain/usersService";
import { UserAuthModel } from "../models/user/userAuthModel";

export const authRouter = express.Router();

authRouter.post("/login", async (req: RequestWithBodyType<UserAuthModel>, res: TypedResponse<UserViewModel | TypedResponseMessage>) => {
	const { status, response } = await usersService.checkCredentials(req.body);
	
	return res.status(status).json(response);
});