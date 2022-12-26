"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Models = __importStar(require("./models"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const openai_1 = require("openai");
const Prompts = __importStar(require("./prompts"));
const Secrets = __importStar(require("./secrets"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(body_parser_1.default.urlencoded());
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)({
    credentials: true,
    origin: [
        "https://mail.google.com",
        "chrome-extension://bdlpfigaeoobpclgnlfbimemempnankc"
    ],
}));
const MONGODB_URL = Secrets.MONGO_URL;
const ADMIN_KEY = Secrets.ADMIN_KEY;
const CLIENT_SECRETS = [
    "1bd4f10ce55b4a3f75aa256b10ed7718a" // lotus
];
mongoose_1.default.connect(MONGODB_URL, (err) => {
    if (err)
        console.log("Error connecting mongo", err);
    else
        console.log("Mongoose connected!");
});
app.use('/', (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
}));
const openai = new openai_1.OpenAIApi(new openai_1.Configuration({
    apiKey: Secrets.OPENAI_TOKEN,
}));
const requireCompanyId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.params.company_id)
            throw Error("company Id missing");
        const companyId = req.params.company_id;
        const company = yield Models.Companies.findOne({ _id: companyId });
        if (!company)
            throw Error("Company does not exist");
        req.body.company = company;
        next();
    }
    catch (e) {
        console.log("Could not attach company in hook", e);
        res.status(400).send({ message: "Unable to find company" });
    }
});
const requireEmployeeId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.params.employee_id)
            throw Error("employee Id missing");
        const employeId = req.params.employee_id;
        const employee = yield Models.Employees.findOne({ _id: employeId });
        if (!employee)
            throw Error("Company does not exist");
        req.body.employee = employee;
        next();
    }
    catch (e) {
        console.log("Could not attach employee in hook", e);
        res.status(400).send({ message: "Unable to find employee" });
    }
});
const requireCompanySecret = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const companySecret = req.headers['secret'];
    if (!CLIENT_SECRETS.includes(companySecret))
        res.status(400).send({
            message: "You do not have access to this resource"
        });
    else
        next();
});
const requireAdminKey = (req, res, next) => {
    const adminKey = req.headers['admin-key'];
    if (adminKey != ADMIN_KEY)
        res.status(400).send({
            message: "You do not have access to this resource"
        });
    else
        next();
};
app.post("/company", [requireAdminKey], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const company = yield Models.Companies.create(req.body);
        res.status(201).send(company);
    }
    catch (e) {
        console.log("Failed to create company", e);
        res.status(400).send({ message: "Unable to create company" });
    }
}));
app.get("/company/:id", [requireCompanySecret], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const company = yield Models.Companies.findById(req.params.id);
        res.status(200).send(company);
    }
    catch (e) {
        console.log("Failed to get company with Id ", e);
        res.status(404).send({ message: `Unable to find company with Id ${req.params.id}` });
    }
}));
app.get("/company/", [requireAdminKey], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const companies = yield Models.Companies.find();
        res.status(200).send(companies);
    }
    catch (e) {
        console.log("Unable to get companies", e);
        res.status(404).send({ message: `Unable to get companies` });
    }
}));
app.post("/employee", [requireAdminKey], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const employee = yield Models.Employees.create(req.body);
        res.status(201).send(employee);
    }
    catch (e) {
        console.log("Failed to create employee", e);
        res.status(400).send({ message: "Unable to create employee" });
    }
}));
app.get("/employee/:id", [requireAdminKey], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const employee = yield Models.Employees.findById(req.params.id);
        res.status(200).send(employee);
    }
    catch (e) {
        console.log("Failed to get employee with Id ", e);
        res.status(404).send({ message: `Unable to find employee with Id ${req.params.id}` });
    }
}));
app.get("/company/:company_id/employee", [requireCompanyId], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const company = req.body.company;
        const docs = yield Models.Employees.find({ companyId: company._id });
        res.send(docs);
    }
    catch (e) {
        console.log("Unable to generate list of employees for company", e);
        res.status(400).send({ messsage: "Unable to find list of employees" });
    }
}));
app.post("/company/:company_id/employee/:employee_id/request", [requireCompanyId, requireCompanySecret, requireEmployeeId], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const company = req.body.company;
        const employee = req.body.employee;
        const request = yield Models.Requests.create(Object.assign(Object.assign({}, req.body), { companyId: company._id, employeeId: employee._id }));
        const filledPrompt = Prompts.buildPrompt(request.emailBody, company, employee);
        const completion = yield openai.createCompletion({
            model: "text-davinci-003",
            prompt: filledPrompt,
            max_tokens: 200,
            temperature: 0.6,
            frequency_penalty: 1
        });
        const response = completion.data.choices[0].text;
        yield Models.Requests.findByIdAndUpdate(request._id, {
            $set: { response, respondedAt: new Date() }
        });
        res.send({
            response
        });
    }
    catch (e) {
        res.status(400).send({ message: "foo" });
    }
}));
app.listen(Secrets.PORT, () => {
    return console.log(`Express is listening at http://localhost:${Secrets.PORT}`);
});
//# sourceMappingURL=app.js.map