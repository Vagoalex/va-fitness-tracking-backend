import { CourseViewModel } from "../models/course/courseViewModel";
import { DBType } from "../types/dbType";

export let dataBase: DBType = {
	courses: [
		{ id: "1", title: "front-end", studentsCount: 122 },
		{ id: "2", title: "back-end", studentsCount: 76 },
		{ id: "3", title: "dev-ops", studentsCount: 23 },
		{ id: "4", title: "full-stack", studentsCount: 56 },
		{ id: "5", title: "qa", studentsCount: 112 }
	] as CourseViewModel[],
	clear: function (): void {
		this.courses = [];
	}
};