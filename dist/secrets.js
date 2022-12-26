"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PORT = exports.ADMIN_KEY = exports.OPENAI_TOKEN = exports.MONGO_URL = exports.isTest = exports.isProd = exports.ENVIRONMENT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
exports.ENVIRONMENT = process.env.NODE_ENV;
exports.isProd = exports.ENVIRONMENT === "production";
exports.isTest = exports.ENVIRONMENT === "test";
const exitProcess = (msg) => {
    if (exports.isTest)
        return;
    console.log(`FATAL ERROR: ${msg}`);
    process.exit(0);
};
if (fs_1.default.existsSync(".env")) {
    dotenv_1.default.config({ path: ".env" });
}
else if (exports.isProd) {
    console.log("Using HEROKU to supply config variables");
}
else {
    exitProcess("No .env file supplied");
}
exports.MONGO_URL = process.env["MONGO_URL"];
exports.OPENAI_TOKEN = process.env["OPENAI_TOKEN"];
exports.ADMIN_KEY = process.env['ADMIN_KEY'];
exports.PORT = process.env["PORT"];
if (!exports.MONGO_URL) {
    exitProcess("You need to supply mongo url");
}
if (!exports.OPENAI_TOKEN) {
    exitProcess("You need to supply open ai token");
}
if (!exports.ADMIN_KEY) {
    exitProcess("You need to submit the admin key secret");
}
if (!exports.PORT) {
    exitProcess("You need to submit port to listen to");
}
//# sourceMappingURL=secrets.js.map