import { GetCoursesQueryModel } from "../../models/course/getCoursesQueryModel";
import { CourseViewModel } from "../../models/course/courseViewModel";
import { CourseUpdateModel } from "../../models/course/courseUpdateModel";
import { MAIN_DB } from "../../infrastrucure/db";
import { Collection, DeleteResult, InsertOneResult, UpdateResult } from "mongodb";
import { settings } from "../../settings/settings";

const productsCollection: Collection<CourseViewModel> = MAIN_DB.collection<CourseViewModel>(
	settings.MONGO_DB_COURSES_COLLECTION_NAME!);

export const coursesDbRepository = {
	async findCourses({ title }: GetCoursesQueryModel): Promise<CourseViewModel[]> {
		const filter: any = {};
		
		if(title) {
			filter.title = { $regex: title };
		}
		
		return await productsCollection.find(filter).toArray();
	},
	async findCourseById(id: string): Promise<CourseViewModel | null> {
		return await productsCollection.findOne({ id });
	},
	async createCourse(payload: CourseViewModel): Promise<InsertOneResult<CourseViewModel>> {
		return await productsCollection.insertOne(payload);
	},
	async updateCourse(id: string, { title }: CourseUpdateModel): Promise<UpdateResult<CourseUpdateModel>> {
		return await productsCollection.updateOne({ id }, { $set: { title } });
	},
	async deleteCourse(id: string): Promise<DeleteResult> {
		return await productsCollection.deleteOne({ id });
	}
};