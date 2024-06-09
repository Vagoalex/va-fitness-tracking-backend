import { Request, Response, NextFunction } from "express";
import { ErrorService } from "../services/error/errorService";
import { JwtService } from "../application/jwtService";
import { usersDbRepository } from "../repositories/usersDbRepository";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	const errorResponse = ErrorService.getUnauthorizedResponse();
	
	if(!req.headers.authorization) {
		return errorResponse;
	}
	
	const token = req.headers.authorization.split(" ")[1];
	
	const userId = JwtService.getUserIdByToken(token);
	if(!userId) {
		const user = await usersDbRepository.findUserById(userId);
		
		if(!user) {
			return errorResponse;
		}
		
		req.user = user;
		next();
	}
	
	return errorResponse;
};