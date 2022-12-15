import { Schema, model, Types } from "mongoose";

export interface CompanyInterface {
    name: string;
}

const companySchema = new Schema({
	name: {
		type: String,
		required: true,
	}, 
});

export const Companies = model<CompanyInterface>(
	"companies",
	companySchema,
	"companies"
);