import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';
import Cryptr from 'cryptr';

import * as cardRepository from "../repositories/cardRepository";
import { findByApiKey } from "../repositories/companyRepository";
import { findById } from "../repositories/employeeRepository";
import * as errorMiddleware from "../middlewares/errorHandlingMiddleware";
import { abreviateMiddleName } from '../utils/cardUtilits';

export async function createCard (
    employeeId:number, 
    type:cardRepository.TransactionTypes, 
    apiKey: any
) {

    const apiKeyValidation = await findByApiKey(apiKey);
    if(!apiKeyValidation) throw errorMiddleware.notFoundError('company')
    
    const employee = await findById(employeeId);
    if(!employee) throw errorMiddleware.notFoundError('employee');

    const employeTypes = await cardRepository.findByTypeAndEmployeeId(type, employeeId)
    if(employeTypes) throw errorMiddleware.conflictError('card type');

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

    await cardRepository.insert(cardData)
}
export async function ativateCard(
    id: number,
    employeeId:number, 
    securityCode:string, 
    password: string
    ) {
    
    const card = await cardRepository.findById(id);

    if(!card) throw errorMiddleware.notFoundError('card');
    if(card.password) throw errorMiddleware.conflictError('password');
}
