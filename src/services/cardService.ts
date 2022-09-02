import { TransactionTypes } from "../repositories/cardRepository";
import { findByApiKey } from "../repositories/companyRepository";
import { findById } from "../repositories/employeeRepository";
import { notFoundError, unauthorizedError } from "../middlewares/errorHandlingMiddleware";

export async function createCard (
    employeeId:number, 
    type:TransactionTypes, 
    apiKey: any
) {

    const apiKeyValidation = await findByApiKey(apiKey);
    if(!apiKeyValidation) throw unauthorizedError('apiKey')
    
    const employee = await findById(employeeId);
    if(!employee) throw notFoundError('employee');
    
}