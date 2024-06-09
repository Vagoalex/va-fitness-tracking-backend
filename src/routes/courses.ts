import express from "express";
import {
	RequestWithBodyType,
	RequestWithParamsAndBodyType,
	RequestWithParamsType,
	RequestWithQueryType
} from "../types/express/typedRequest";
import { GetCoursesQueryModel } from "../models/course/getCoursesQueryModel";
import { TypedResponse } from "../types/express/typedResponse";
import { GetCoursesResponseModel } from "../models/course/getCoursesResponseModel";
import { CourseViewModel } from "../models/course/courseViewModel";
import { HTTP_STATUSES_ENUM } from "../types/HttpStatusesEnum";
import { TypedResponseMessage } from "../types/express/typedResponseMessage";
import { CourseCreateModel } from "../models/course/courseCreateModel";
import { CourseUpdateModel } from "../models/course/courseUpdateModel";
import { coursesService } from "../domain/coursesService";

export const coursesRouter = express.Router();

coursesRouter.get("/", async (req: RequestWithQueryType<GetCoursesQueryModel>, res: TypedResponse<GetCoursesResponseModel>) => {
	const courses = await coursesService.getCourses(req.query);
	
	return res.status(HTTP_STATUSES_ENUM.OK_200).json(courses);
});

coursesRouter.post("/",
	async (req: RequestWithBodyType<CourseCreateModel>, res: TypedResponse<CourseViewModel | TypedResponseMessage>) => {
		// const { status, response } = await coursesService.createCourse(req.body, req.user!._id);
		const { status, response } = await coursesService.createCourse(req.body);
		
		return res.status(status).json(response);
	});

coursesRouter.get("/:id([0-9]+)",
	async (req: RequestWithParamsType<{ id: string }>, res: TypedResponse<CourseViewModel | TypedResponseMessage>) => {
		const { status, response } = await coursesService.getCourseById(req.params.id);
		
		return res.status(status).json(response);
	});

coursesRouter.put("/:id([0-9]+)",
	async (req: RequestWithParamsAndBodyType<{ id: string }, CourseUpdateModel>, res: TypedResponse<TypedResponseMessage>) => {
		const { status, response } = await coursesService.updateCourse(req.params.id, req.body);
		
		if(response) {
			return res.status(status).json(response);
		} else {
			return res.status(status);
		}
	});

coursesRouter.delete("/:id([0-9]+)",
	async (req: RequestWithParamsType<{ id: string }>, res: TypedResponse<TypedResponseMessage>) => {
		const { status, response } = await coursesService.deleteCourse(req.params.id);
		
		if(response) {
			return res.status(status).json(response);
		} else {
			return res.status(status);
		}
	});
