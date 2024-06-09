import express from "express";
import { HTTP_STATUSES_ENUM } from "./types/HttpStatusesEnum";
import { coursesRouter } from "./routes/courses";
import { usersRouter } from "./routes/users";
import { authRouter } from "./routes/auth";
import "dotenv/config";

export const app = express();

const jsonBodyMiddleware = express.json();

app.use(jsonBodyMiddleware);

app.use("/courses", coursesRouter);
app.use("/users", usersRouter);
app.use("/auth", authRouter);

app.get("*", (req, res) => {
	return res.sendStatus(HTTP_STATUSES_ENUM.NOT_FOUND_404).json({ messages: ["Route is not found"] });
});