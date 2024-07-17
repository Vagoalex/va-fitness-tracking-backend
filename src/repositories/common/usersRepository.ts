import { UserCreateModel } from "../../models/user/userCreateModel";
import { TypedResponseWithStatusAndJson } from "../../types/express/typedResponseWithStatusAndJson";
import { UserViewModel } from "../../models/user/userViewModel";
import { ErrorService } from "../../services/error/errorService";
import { HTTP_STATUSES_ENUM } from "../../types/HttpStatusesEnum";
import { usersDbRepository } from "../db/usersDbRepository";
import bcrypt from "bcrypt";
import { usersService } from "../../domain/usersService";
import { ObjectId } from "mongodb";

export const usersRepository = {
	async createUser(payload: UserCreateModel): Promise<TypedResponseWithStatusAndJson<UserViewModel>> {
		/* Получаем payload в виде login или email */
		const loginOrEmail = payload.login || payload.email;
		
		/* Проверяем на пустоту login/email и password */
		const errors = ErrorService.validateByEmptyFields({ loginOrEmail, password: payload.password });
		
		if(errors.length || !loginOrEmail) {
			return {
				status: HTTP_STATUSES_ENUM.BAD_REQUEST_400,
				response: {
					messages: errors
				}
			};
		}
		
		/* Ищем пользователя по совпадению с login или email, если пользак нашелся, то кидаем exception */
		const user = await usersDbRepository.findByLoginOrEmail(loginOrEmail);
		if(user) {
			return ErrorService.getUnexpendedErrorResponse();
		}
		
		/* Создаем соль и генерируем hash */
		const passwordSalt = await bcrypt.genSalt(8);
		const passwordHash = await usersService._generateHash(payload.password!, passwordSalt);
		
		/* Формируем рабочую viewModel для user  */
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
	}
}