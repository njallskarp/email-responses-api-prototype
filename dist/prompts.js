"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALLOWED_PROMPTS = void 0;
const CAR_RENTAL_CUSTOMER_REPRESENTATIVE = "car_rental_customer_representative";
const CAR_RENTAL_COMPLAINT_MANAGER = "car_rental_complaint_manager";
exports.ALLOWED_PROMPTS = [
    CAR_RENTAL_CUSTOMER_REPRESENTATIVE,
    CAR_RENTAL_COMPLAINT_MANAGER
];
const __customerRepresentativePrompt = (email, customer, employee) => `A customer sent this email to ${customer.name}: "${email}".

    ${customer.name}'s policies are the following:
    \t- ${employee.policies.join("\n\t- ")}
    
    You are a ${employee.role} for ${customer.name}. Write a response email to the customer that is ${employee.tone1} and ${employee.tone2}. Use some of ${customer.name}'s policies 
    and use as few policies as necessary. Your goal with the response is to ${employee.objective}. Write the email in less than 5 sentences.`;
const __customerComplaintManagerPrompt = (email, customer, employee) => `A customer sent this complaint to ${customer.name}: "${email}".
    
    When dealing with complaints, ${customer.name}'s policies are the following:
    \t- ${employee.policies.join("\n\t- ")}

    You are a ${employee.role} for ${customer.name}. Write an email that addresses the issue which is ${employee.tone1} and ${employee.tone2}. Use some of ${customer.name}'s policies 
    and use as few policies as necessary. Your goal with the response is to ${employee.objective}`;
`;

export const buildPrompt = (email: string, customer: Models.CompanyInterface, employee: Models.EmployeeInterface) => {
    let promptBuildFunc = undefined;
    if      (employee.promptKey === CAR_RENTAL_CUSTOMER_REPRESENTATIVE) promptBuildFunc = __customerRepresentativePrompt;
    else if (employee.promptKey === CAR_RENTAL_COMPLAINT_MANAGER)       promptBuildFunc = __customerComplaintManagerPrompt;
    else throw Error(`;
Prmopt;
type;
{
    promptType;
}
is;
not;
recognized `);
    return promptBuildFunc(email, customer, employee);
}
;
//# sourceMappingURL=prompts.js.map