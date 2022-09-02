import { findByTypeAndEmployeeId, TransactionTypes } from "../repositories/cardRepository";
import { findByApiKey } from "../repositories/companyRepository";
import { findById } from "../repositories/employeeRepository";
import { conflictError, notFoundError, unauthorizedError } from "../middlewares/errorHandlingMiddleware";

export async function createCard (
    employeeId:number, 
    type:TransactionTypes, 
    apiKey: any
) {

    const apiKeyValidation = await findByApiKey(apiKey);
    if(!apiKeyValidation) throw notFoundError('company')
    
    const employee = await findById(employeeId);
    if(!employee) throw notFoundError('employee');

    const employeTypes = await findByTypeAndEmployeeId(type, employeeId)
    if(employeTypes) throw conflictError('card type')
    
}