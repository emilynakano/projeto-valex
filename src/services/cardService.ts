import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import * as cardRepository from "../repositories/cardRepository";
import { findByApiKey } from "../repositories/companyRepository";
import { findById } from "../repositories/employeeRepository";
import * as errorMiddleware from "../middlewares/errorHandlingMiddleware";
import { abreviateMiddleName } from '../utils/cardUtilits';
import {compareCrypt, newCryptValue} from '../utils/encryptUtilits';

dayjs.extend(customParseFormat)

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

    const number = faker.finance.creditCardNumber('63[7-9]#-####-####-###L');
    const securityCode = newCryptValue(faker.finance.creditCardCVV());
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
export async function activateCard(
    id: number,
    employeeId:number, 
    securityCode:string, 
    password: string
    ) {

    const card = await cardRepository.findById(id);

    if(!card) throw errorMiddleware.notFoundError('card');
    if(card.password) throw errorMiddleware.forbiddenError('activate card because it is already activated');

    const securityCodeValid = compareCrypt(securityCode, card.securityCode);

    if(!securityCodeValid) {
        throw errorMiddleware.unauthorizedError('security code');
    }

    if(!dayjs().isBefore(dayjs(card.expirationDate, 'MM/YY'), 'month')) {
        throw errorMiddleware.forbiddenError('activate card because expiration date')
    }

    const passwordHash = newCryptValue(password);

    await cardRepository.update(id, {password: passwordHash})
}
export async function blockCard(id: number, password: string) {

    const card = await cardRepository.findById(id);

    if(!card) throw errorMiddleware.notFoundError('card');
    if(!dayjs().isBefore(dayjs(card.expirationDate, 'MM/YY'), 'month')) throw errorMiddleware.forbiddenError('block card because expiration date');
    if(card.isBlocked) throw errorMiddleware.forbiddenError('block card because it is already blocked');
    if(!card.password) throw errorMiddleware.forbiddenError('block card because it is not activated yet')
    
    const passwordValidation = compareCrypt(password, card.password);
    
    if(!passwordValidation) throw errorMiddleware.unauthorizedError('password');

    await cardRepository.update(id, {isBlocked: true})
}
