import { GetCoursesQueryModel } from "../models/course/getCoursesQueryModel";
import { GetCoursesResponseModel } from "../models/course/getCoursesResponseModel";
import { CourseViewModel } from "../models/course/courseViewModel";
import { TypedResponseWithStatusAndJson } from "../types/express/typedResponseWithStatusAndJson";
import { HTTP_STATUSES_ENUM } from "../types/HttpStatusesEnum";
import { TypedResponseMessage } from "../types/express/typedResponseMessage";
import { CourseCreateModel } from "../models/course/courseCreateModel";
import { CourseUpdateModel } from "../models/course/courseUpdateModel";
import { coursesDbRepository } from "../repositories/coursesDbRepository";
import { ErrorService } from "../services/error/errorService";

export const coursesService = {
	async getCourses(queryParams: GetCoursesQueryModel): Promise<GetCoursesResponseModel> {
		let items: CourseViewModel[] = [];
		
		items = await coursesDbRepository.findCourses(queryParams);
		
		const totalCount: number = items.length;
		
		return { items, totalCount };
	},
	async getCourseById(id: string): Promise<TypedResponseWithStatusAndJson<CourseViewModel>> {
		const item: CourseViewModel | null = await coursesDbRepository.findCourseById(id);
		
		if(!item) {
			return ErrorService.getElementNotFoundResponse();
		} else {
			return {
				status: HTTP_STATUSES_ENUM.OK_200,
				response: {
					id: item.id,
					title: item.title,
					studentsCount: item.studentsCount
				} as CourseViewModel
			};
		}
	},
	async createCourse(payload: CourseCreateModel): Promise<TypedResponseWithStatusAndJson<CourseViewModel>> {
		let status: HTTP_STATUSES_ENUM = HTTP_STATUSES_ENUM.CREATED_201;
		
		const errors = ErrorService.validateByEmptyFields(payload);
		
		if(errors.length) {
			status = HTTP_STATUSES_ENUM.BAD_REQUEST_400;
			
			return {
				status,
				response: {
					messages: errors
				}
			};
		}
		
		const newCourse = {
			id: String(Date.now()),
			studentsCount: 0,
			secretToken: "",
			title: payload.title
		} as CourseViewModel;
		
		await coursesDbRepository.createCourse(newCourse);
		
		return {
			status: HTTP_STATUSES_ENUM.CREATED_201,
			response: newCourse
		};
	},
	async updateCourse(id: string, body: CourseUpdateModel): Promise<TypedResponseWithStatusAndJson<TypedResponseMessage>> {
		const errors = ErrorService.validateByEmptyFields({ id, title: body.title });
		
		if(errors.length) {
			return {
				status: HTTP_STATUSES_ENUM.BAD_REQUEST_400,
				response: {
					messages: errors
				}
			};
		}
		
		const response = await coursesDbRepository.updateCourse(id, body);
		
		if(!response.matchedCount) {
			return ErrorService.getElementNotFoundResponse();
		} else {
			return { status: HTTP_STATUSES_ENUM.NO_CONTENT_204 };
		}
	},
	async deleteCourse(id: string): Promise<TypedResponseWithStatusAndJson<TypedResponseMessage>> {
		const errors = ErrorService.validateByEmptyFields({ id });
		
		if(errors.length) {
			return {
				status: HTTP_STATUSES_ENUM.BAD_REQUEST_400,
				response: {
					messages: errors
				}
			};
		}
		
		const deleteResult = await coursesDbRepository.deleteCourse(id);
		
		if(!deleteResult.deletedCount) {
			return ErrorService.getElementNotFoundResponse();
		} else {
			return {
				status: HTTP_STATUSES_ENUM.NO_CONTENT_204
			};
		}
	}
};