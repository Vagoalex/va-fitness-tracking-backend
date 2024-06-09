import { app } from "./app";
import { runDB } from "./infrastrucure/db";
import "dotenv/config";

const port = process.env.PORT ? Number(process.env.PORT) : 5000;

const startApp = async () => {
	await runDB();
	
	app.listen(port, () => {
		console.log(`Example app listening on port ${port}`);
	});
};

startApp().then(r => r);