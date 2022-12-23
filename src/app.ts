import express from 'express';
import * as Models from "./models";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import {Request, Response, NextFunction} from "express"
import rateLimit from 'express-rate-limit'
import { Configuration, OpenAIApi } from "openai";
import * as Prompts from "./prompts";
import * as Secrets from "./secrets";
import cors from "cors";


const app = express();
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(
  cors({
    credentials: true,
    origin: [
      "https://mail.google.com",
    ],
  })
);

const MONGODB_URL = Secrets.MONGO_URL;
const ADMIN_KEY = Secrets.ADMIN_KEY;
const CLIENT_SECRETS = [
  "1bd4f10ce55b4a3f75aa256b10ed7718a" // lotus
]

mongoose.connect(MONGODB_URL, (err) => {
  if(err) console.log("Error connecting mongo", err);
  else console.log("Mongoose connected!")
});

app.use('/', rateLimit({
	windowMs: 60 * 1000,
	max: 5, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
}))

const openai = new OpenAIApi(new Configuration({
  apiKey: Secrets.OPENAI_TOKEN,
}));

const requireCompanyId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if(!req.params.company_id) throw Error("company Id missing");
    const companyId = req.params.company_id;
    const company = await Models.Companies.findOne({_id: companyId});
    if(!company) throw Error("Company does not exist");
    req.body.company = company;
    next();
  } catch(e) {
    console.log("Could not attach company in hook", e)
    res.status(400).send({message: "Unable to find company"});
  }
}

const requireEmployeeId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if(!req.params.employee_id) throw Error("employee Id missing");
    const employeId = req.params.employee_id;
    const employee = await Models.Employees.findOne({_id: employeId});
    if(!employee) throw Error("Company does not exist");
    req.body.employee = employee;
    next();
  } catch(e) {
    console.log("Could not attach employee in hook", e);
    res.status(400).send({message: "Unable to find employee"});
  }
}

const requireCompanySecret = async (req: Request, res: Response, next: NextFunction) => {
  const companySecret = req.headers['secret'];
  if(!CLIENT_SECRETS.includes(companySecret as string)) res.status(400).send({
    message: "You do not have access to this resource"
  });
  else next();
}

const requireAdminKey = (req: Request, res: Response, next: NextFunction) => {
  const adminKey = req.headers['admin-key'];
  if(adminKey != ADMIN_KEY) res.status(400).send({
    message: "You do not have access to this resource"
  });
  else next();
}

app.post("/company", [requireAdminKey], async (req: Request, res: Response) => {
  try {
    const company = await Models.Companies.create(req.body);
    res.status(201).send(company);
  } catch(e) {
    console.log("Failed to create company", e);
    res.status(400).send({message: "Unable to create company"});
  }
});

app.get("/company/:id", [requireCompanySecret], async (req: Request, res: Response) => {
  try {
    const company = await Models.Companies.findById(req.params.id);
    res.status(200).send(company);
  } catch(e) {
    console.log("Failed to get company with Id ", e);
    res.status(404).send({message: `Unable to find company with Id ${req.params.id}`});
  }
});

app.get("/company/", [requireAdminKey], async (req: Request, res: Response) => {
  try {
    const companies = await Models.Companies.find();
    res.status(200).send(companies);
  } catch(e) {
    console.log("Unable to get companies", e);
    res.status(404).send({message: `Unable to get companies`});
  }
});

app.post("/employee", [requireAdminKey], async (req: Request, res: Response) => {
  try {
    const employee = await Models.Employees.create(req.body);
    res.status(201).send(employee);
  } catch(e) {
    console.log("Failed to create employee", e);
    res.status(400).send({message: "Unable to create employee"});
  }
});

app.get("/employee/:id", [requireAdminKey], async (req: Request, res: Response) => {
  try {
    const employee = await Models.Employees.findById(req.params.id);
    res.status(200).send(employee);
  } catch(e) {
    console.log("Failed to get employee with Id ", e);
    res.status(404).send({message: `Unable to find employee with Id ${req.params.id}`});
  }
});

app.get("/company/:company_id/employee", [requireCompanyId], async (req: Request, res: Response) => {
 try{
  const company = req.body.company;
  const docs = await Models.Employees.find({companyId: company._id});
  res.send(docs);
 } catch(e) {
  console.log("Unable to generate list of employees for company", e);
  res.status(400).send({messsage: "Unable to find list of employees"})
 }
});

app.post(
  "/company/:company_id/employee/:employee_id/request", 
  [requireCompanyId, requireCompanySecret, requireEmployeeId], 
  async (req: Request, res: Response) => {
    try {
      const company = req.body.company;
      const employee = req.body.employee;
      
      const request = await Models.Requests.create({
        ...req.body,
        companyId: company._id,
        employeeId: employee._id
      });
      
      const filledPrompt = Prompts.buildPrompt(request.emailBody, company, employee);

      const completion = await openai.createCompletion({
        model: "text-davinci-003", // text-davinci-003 or text-curie-001
        prompt: filledPrompt,
        max_tokens: 200,
        temperature: 0.6,
        frequency_penalty: 1
      });

      const response = completion.data.choices[0].text;

      await Models.Requests.findByIdAndUpdate(request._id, {
        $set: {response, respondedAt: new Date()}
      })

      res.send({
        response
      });

    } catch(e) {
      res.status(400).send({message: "foo"});
    }
  }
)


app.listen(Secrets.PORT, () => {
  return console.log(`Express is listening at http://localhost:${Secrets.PORT}`);
});


