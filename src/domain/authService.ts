import { TypedResponseWithStatusAndJson } from "../types/express/typedResponseWithStatusAndJson";
import { HTTP_STATUSES_ENUM } from "../types/HttpStatusesEnum";
import { UserCreateModel } from "../models/user/userCreateModel";
import { usersDbRepository } from "../repositories/db/usersDbRepository";
import { UserModelsMapper, UserViewModel, UserViewModelClient } from "../models/user/userViewModel";
import { ErrorService } from "../services/error/errorService";
import bcrypt from "bcrypt";
import { UserAuthModel } from "../models/user/userAuthModel";
import { usersRepository } from "../repositories/common/usersRepository";
import jwt from "jsonwebtoken";
import { settings } from "../settings/settings";
import { ResponseMessage } from "../types/express/typedResponseMessage";

/* Работа с авторизацией для пользователей */
export const authService = {
	async createUser(payload: UserCreateModel): Promise<TypedResponseWithStatusAndJson<UserViewModelClient>> {
		const { status, response } = await usersRepository.createUser(payload);
		
		if(status !== HTTP_STATUSES_ENUM.CREATED_201) {
			const negativeResponse = response as ResponseMessage;
			
			return { status, response: negativeResponse };
		}
		
		const positiveResponse = response as UserViewModel;
		
		const token = jwt.sign({ id: positiveResponse.id, email: positiveResponse.email }, settings.JWT_SECRET, { expiresIn: "1h" });
		
		const mappedUser = UserModelsMapper.mapFromDatabaseToClientModel(positiveResponse, token);
		
		return { status, response: mappedUser };
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