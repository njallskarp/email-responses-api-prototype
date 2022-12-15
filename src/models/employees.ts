import { Schema, model, Types } from "mongoose";
import * as Prompts from "../prompts"

export interface EmployeeInterface {
    name: string;
    tone1: string;
    tone2: string;
    objective: string;
    role: string;
	promptKey: Prompts.Prompts;
    companyId: Types.ObjectId;
	policies: string[];
}

const employeeSchema = new Schema({
	name: {
		type: String,
		required: true,
	}, 
	tone1: {
		type: String,
		required: true,
	}, 
	tone2: {
		type: String,
		required: true,
	}, 
	role: {
		type: String,
		required: true,
	}, 
	objective: {
		type: String,
		required: true,
	}, 
	promptKey: {
		type: String,
		required: true,
		enum: {
		  values: Prompts.ALLOWED_PROMPTS,
		  message: '{VALUE} is not supported for promptKey'
		}
	},
	companyId: {
		type: Types.ObjectId,
		required: true,
	}, 
	policies: {
		type: [String],
		required: true
	}
});

export const Employees = model<EmployeeInterface>(
	"employees",
	employeeSchema,
	"employees"
);