import dotenv from "dotenv";
import fs from "fs";

export const ENVIRONMENT = process.env.NODE_ENV;
export const isProd = ENVIRONMENT === "production";
export const isTest = ENVIRONMENT === "test";


const exitProcess = (msg: string) => {
	if (isTest) return;
	console.log(`FATAL ERROR: ${msg}`);
	process.exit(0);
};

if (fs.existsSync(".env")) {
	dotenv.config({ path: ".env" });
} else if (isProd) {
	console.log("Using HEROKU to supply config variables");
} else {
	exitProcess("No .env file supplied");
}

export const MONGO_URL = process.env["MONGO_URL"];
export const OPENAI_TOKEN = process.env["OPENAI_TOKEN"];
export const ADMIN_KEY = process.env['ADMIN_KEY']

if(!MONGO_URL){
    exitProcess("You need to supply mongo url");
}

if(!OPENAI_TOKEN){
    exitProcess("You need to supply open ai token");
}

if(!ADMIN_KEY){
    exitProcess("You need to submit the admin key secret");
}
