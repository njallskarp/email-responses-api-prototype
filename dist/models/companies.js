"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Companies = void 0;
const mongoose_1 = require("mongoose");
const companySchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
});
exports.Companies = (0, mongoose_1.model)("companies", companySchema, "companies");
//# sourceMappingURL=companies.js.map