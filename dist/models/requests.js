"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Requests = void 0;
const mongoose_1 = require("mongoose");
const RequestSchema = new mongoose_1.Schema({
    emailBody: { type: String, required: true },
    emailSubject: { type: String, required: true },
    emailSender: { type: String, required: true },
    companyId: { type: mongoose_1.Types.ObjectId, required: true },
    employeeId: { type: mongoose_1.Types.ObjectId },
    response: { type: String },
    respondedAt: { type: Date }
});
exports.Requests = (0, mongoose_1.model)("requests", RequestSchema, "requests");
//# sourceMappingURL=requests.js.map