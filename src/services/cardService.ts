import { TransactionTypes } from "../repositories/cardRepository";
import { findByApiKey } from "../repositories/companyRepository";
import { unauthorizedError } from "../middlewares/errorHandlingMiddleware";

export async function createCard (
    employeeId:number, 
    type:TransactionTypes, 
    apiKey: any
) {
    
    const apiKeyValidation = await findByApiKey(apiKey);
   
    if(!apiKeyValidation) {
        throw unauthorizedError('apiKey')
    }

}