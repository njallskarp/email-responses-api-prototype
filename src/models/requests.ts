import { Schema, model, Types } from "mongoose";

export interface RequestsInterface {
    emailBody: string;
    emailSubject: string;
    emailSender: string;
    companyId: Types.ObjectId;
    employeeId: Types.ObjectId;
    response: string;
    respondedAt: Date;
}

const RequestSchema = new Schema({
	emailBody: {type: String, required: true},
    emailSubject: {type: String, required: true},
    emailSender: {type: String, required: true},
    companyId: {type: Types.ObjectId, required: true},
    employeeId: {type: Types.ObjectId},
    response: {type: String},
    respondedAt: {type: Date}
})

export const Requests = model<RequestsInterface>(
	"requests",
	RequestSchema,
	"requests"
);