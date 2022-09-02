import { faker } from '@faker-js/faker';

import { findByTypeAndEmployeeId, TransactionTypes } from "../repositories/cardRepository";
import { findByApiKey } from "../repositories/companyRepository";
import { findById } from "../repositories/employeeRepository";
import { conflictError, notFoundError, unauthorizedError } from "../middlewares/errorHandlingMiddleware";
import { abreviateMiddleName } from '../utils/cardUtilits';

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
    if(employeTypes) throw conflictError('card type');

    const cardNumber = faker.finance.creditCardNumber('63[7-9]#-####-####-###L');
    const cardCVC = faker.finance.creditCardCVV() 
    
    const employeeholderName = abreviateMiddleName(employee.fullName)
    console.log(employeeholderName)
}
