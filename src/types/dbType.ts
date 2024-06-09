import { CourseViewModel } from "../models/course/courseViewModel";

export type DBType = {
	courses: CourseViewModel[],
	clear: () => void
}