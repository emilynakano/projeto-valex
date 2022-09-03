import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import * as cardRepository from "../repositories/cardRepository";
import { Company, findByApiKey } from "../repositories/companyRepository";
import { Employee, findById } from "../repositories/employeeRepository";
import * as errorMiddleware from "../middlewares/errorHandlingMiddleware";
import { abreviateMiddleName } from '../utils/cardUtilits';
import {compareCrypt, newCryptValue} from '../utils/encryptUtilits';

dayjs.extend(customParseFormat);

function ensureApiKeyExists (company: Company) {
    if(!company) throw errorMiddleware.notFoundError('company')
}
function ensureEmployeeExists (employee: Employee) {
    if(!employee) throw errorMiddleware.notFoundError('employee');
}
function ensureEmployeeDontHaveThisCardType (employeTypes: {}) {
    if(employeTypes) throw errorMiddleware.conflictError('card type');
}

function ensureCardExists (card: {}) {
    if(!card) throw errorMiddleware.notFoundError('card');
}
function ensureCardIsNotActivated (password: string | undefined) {
    if(password) throw errorMiddleware.badRequestError('this card is already activated!')
}
function ensureSecurityCodeIsValid (reqSecurityCode: string, securityCode: string) {
    const securityCodeValid = compareCrypt(reqSecurityCode, securityCode);

    if(!securityCodeValid) {
        throw errorMiddleware.unauthorizedError('security code');
    }
}
function ensureCardIsNotExpired(expirationDate: string) {
    if(!dayjs().isBefore(dayjs(expirationDate, 'MM/YY'), 'month')) {
        throw errorMiddleware.badRequestError('this card is expired!')
    }
}

export async function createCard (
    employeeId:number, 
    type:cardRepository.TransactionTypes, 
    apiKey: any
) {

    const company = await findByApiKey(apiKey);
    ensureApiKeyExists(company)
    
    const employee = await findById(employeeId);
    ensureEmployeeExists(employee)

    const employeTypes = await cardRepository.findByTypeAndEmployeeId(type, employeeId)
    ensureEmployeeDontHaveThisCardType(employeTypes)

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

    ensureCardExists(card);
    ensureCardIsNotActivated(card.password);
    ensureSecurityCodeIsValid(securityCode, card.securityCode);
    ensureCardIsNotExpired(card.expirationDate);
    
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
