import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';
import Cryptr from 'cryptr';

import { findByTypeAndEmployeeId, insert, TransactionTypes } from "../repositories/cardRepository";
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

    const cryptr = new Cryptr('SecretKey');

    const number = faker.finance.creditCardNumber('63[7-9]#-####-####-###L');
    const securityCode = cryptr.encrypt(faker.finance.creditCardCVV());
    const cardholderName = abreviateMiddleName(employee.fullName)
    const expirationDate = dayjs().add(5, 'year').format('MM/YY');

    const cardData = {
        employeeId,
        number,
        cardholderName,
        securityCode,
        expirationDate,
        isVirtual: false,
        isBlocked: false,
        type,
    }
    
    await insert(cardData)
}
