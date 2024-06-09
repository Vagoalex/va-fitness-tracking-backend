import { CourseViewModel } from "./courseViewModel";

export interface GetCoursesResponseModel {
	items: CourseViewModel[];
	/** totalCount - items.length for pagination */
	totalCount: number;
}