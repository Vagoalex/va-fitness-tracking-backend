import { TypedResponseWithStatusAndJson } from "../types/express/typedResponseWithStatusAndJson";
import { HTTP_STATUSES_ENUM } from "../types/HttpStatusesEnum";
import { UserCreateModel } from "../models/user/userCreateModel";
import { usersDbRepository } from "../repositories/usersDbRepository";
import { UserViewModel } from "../models/user/userViewModel";
import { ErrorService } from "../services/error/errorService";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";
import { UserAuthModel } from "../models/user/userAuthModel";

export const usersService = {
	async createUser(payload: UserCreateModel): Promise<TypedResponseWithStatusAndJson<UserViewModel>> {
		const loginOrEmail = payload.login || payload.email;
		
		const errors = ErrorService.validateByEmptyFields({ loginOrEmail, password: payload.password });
		
		if(errors.length || !loginOrEmail) {
			return {
				status: HTTP_STATUSES_ENUM.BAD_REQUEST_400,
				response: {
					messages: errors
				}
			};
		}
		
		const user = await usersDbRepository.findByLoginOrEmail(loginOrEmail);
		
		if(!user) {
			return ErrorService.getUnexpendedErrorResponse();
		}
		
		const passwordSalt = await bcrypt.genSalt(8);
		const passwordHash = await this._generateHash(payload.password!, passwordSalt);
		
		const newUser = {
			_id: new ObjectId(),
			login: payload.login,
			email: payload.email,
			passwordHash,
			passwordSalt,
			createdAt: new Date()
		} as UserViewModel;
		
		await usersDbRepository.createUser(newUser);
		
		return {
			status: HTTP_STATUSES_ENUM.CREATED_201,
			response: newUser
		};
	},
	async checkCredentials(payload: UserAuthModel): Promise<TypedResponseWithStatusAndJson<UserViewModel>> {
		const loginOrEmail = payload.login || payload.email;
		
		const errors = ErrorService.validateByEmptyFields({ loginOrEmail, password: payload.password });
		
		if(errors.length || !loginOrEmail) {
			return {
				status: HTTP_STATUSES_ENUM.BAD_REQUEST_400,
				response: {
					messages: errors
				}
			};
		}
		
		const user = await usersDbRepository.findByLoginOrEmail(loginOrEmail);
		
		if(!user) {
			return ErrorService.getWrongCredentialsResponse();
		}
		
		const passwordHash = await this._generateHash(payload.password!, user.passwordSalt);
		
		if(user.passwordHash !== passwordHash) {
			return ErrorService.getWrongCredentialsResponse();
		}
		
		return {
			status: HTTP_STATUSES_ENUM.OK_200,
			//TODO: вернуть токен
			response: user
		};
	},
	async _generateHash(password: string, salt: string) {
		return await bcrypt.hash(password, salt);
	},
	async getUserById(id: string): Promise<TypedResponseWithStatusAndJson<UserViewModel>> {
		const item: UserViewModel | null = await usersDbRepository.findUserById(id);
		
		if(!item) {
			return ErrorService.getElementNotFoundResponse();
		} else {
			return {
				status: HTTP_STATUSES_ENUM.OK_200,
				response: item as UserViewModel
			};
		}
	}
};