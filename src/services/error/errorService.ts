import { StringObjectDictionary } from "../../types/dictionaries";
import { templateParts } from "../../constants/templateParts";
import { errorMessages } from "./constants";
import { HTTP_STATUSES_ENUM } from "../../types/HttpStatusesEnum";
import { TypedResponseWithStatusAndJson } from "../../types/express/typedResponseWithStatusAndJson";

export class ErrorService {
	static validateByEmptyFields<P>(payload: P): StringObjectDictionary[] {
		const errors: StringObjectDictionary[] = [];
		
		for (const key in payload) {
			if(!payload[key]) {
				errors.push({
					[key]: errorMessages.emptyField.replace(templateParts.value, key)
				});
			}
		}
		
		return errors;
	}
	
	static getUnauthorizedResponse<T>(): TypedResponseWithStatusAndJson<T> {
		return {
			status: HTTP_STATUSES_ENUM.UNAUTHORIZED_401,
			response: {
				messages: [
					{ 401: errorMessages.elementNotFound }
				]
			}
		};
	}
	
	static getElementNotFoundResponse<T>(): TypedResponseWithStatusAndJson<T> {
		return {
			status: HTTP_STATUSES_ENUM.NOT_FOUND_404,
			response: {
				messages: [
					{ 404: errorMessages.elementNotFound }
				]
			}
		};
	}
	
	static getWrongCredentialsResponse<T>(): TypedResponseWithStatusAndJson<T> {
		return {
			status: HTTP_STATUSES_ENUM.BAD_REQUEST_400,
			response: {
				messages: [
					{ login: errorMessages.wrongLoginOrPassword }
				]
			}
		};
	}


	static getUnexpendedErrorResponse<T>(): TypedResponseWithStatusAndJson<T> {
		return {
			status: HTTP_STATUSES_ENUM.BAD_REQUEST_400,
			response: {
				messages: [
					{ 400: errorMessages.unexpectedErrorOccurred }
				]
			}
		};
	}
}
