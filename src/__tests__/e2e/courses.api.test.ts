import { describe } from "node:test";
import request from "supertest";
import { dataBase } from "../../public/dataBase";
import { app } from "../../app";
import { HTTP_STATUSES_ENUM } from "../../types/HttpStatusesEnum";

describe("/courses", () => {
	beforeAll(() => {
		// clear test-db
		dataBase.clear();
	});

	it("should return 200 and empty array", async () => {
		const emptyResponse = { items: [], totalCount: 0 };
		await request(app).get("/courses").expect(HTTP_STATUSES_ENUM.OK_200, emptyResponse);
	});

	it("should return 404 for not existing course", async () => {
		const courseNumber = "11";
		const resMessage = { messages: [`Course with id: ${courseNumber} not found in DB`] };
		await request(app).get(`/courses/${courseNumber}`).expect(HTTP_STATUSES_ENUM.NOT_FOUND_404, resMessage);
	});
});