import express from "express";
import { RequestWithBodyType } from "../types/express/typedRequest";
import { TypedResponse } from "../types/express/typedResponse";
import { TypedResponseMessage } from "../types/express/typedResponseMessage";
import { UserViewModel } from "../models/user/userViewModel";
import { usersService } from "../domain/usersService";
import { UserCreateModel } from "../models/user/userCreateModel";

export const usersRouter = express.Router();

usersRouter.post("/", async (req: RequestWithBodyType<UserCreateModel>, res: TypedResponse<UserViewModel | TypedResponseMessage>) => {
	const { status, response } = await usersService.createUser(req.body);
	
	return res.status(status).json(response);
});
