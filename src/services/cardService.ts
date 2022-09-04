import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import * as cardRepository from "../repositories/cardRepository";
import { Company, findByApiKey } from "../repositories/companyRepository";
import { Employee, findById } from "../repositories/employeeRepository";
import * as errorMiddleware from "../middlewares/errorHandlingMiddleware";
import { abreviateMiddleName } from '../utils/cardUtilits';
import {compareCrypt, newCryptValue} from '../utils/encryptUtilits';
import * as rechargeRepository from '../repositories/rechargeRepository'

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
function ensureCardIsActivated (password: string | undefined) {
    if(!password) throw errorMiddleware.badRequestError('this card is not activated!')
}
function ensureSecurityCodeIsValid (reqSecurityCode: string, securityCode: string) {
    const securityCodeValid = compareCrypt(reqSecurityCode, securityCode);

    if(!securityCodeValid) {
        throw errorMiddleware.unauthorizedError('security code');
    }
}
function ensurePasswordIsValid (reqPassword: string, password: string | undefined) {
    if(!password) throw errorMiddleware.unauthorizedError('password'); 

    const passwordValidation = compareCrypt(reqPassword, password);
    
    if(!passwordValidation) throw errorMiddleware.unauthorizedError('password');
}
function ensureCardIsNotExpired(expirationDate: string) {
    if(!dayjs().isBefore(dayjs(expirationDate, 'MM/YY'), 'month')) {
        throw errorMiddleware.badRequestError('this card is expired!')
    }
}

function ensureCardIsNotBlocked (isBlocked: boolean) {
    if(isBlocked) throw errorMiddleware.badRequestError('this card is blocked');
}
function ensureCardIsBlocked (isBlocked: boolean) {
    if(!isBlocked) throw errorMiddleware.badRequestError('this card is not blocked');
}

export async function createCard (
    employeeId:number, 
    type:cardRepository.TransactionTypes, 
    apiKey: any
) {

    const company = await findByApiKey(apiKey);
    ensureApiKeyExists(company);
    
    const employee = await findById(employeeId);
    ensureEmployeeExists(employee);

    const employeTypes = await cardRepository.findByTypeAndEmployeeId(type, employeeId);
    ensureEmployeeDontHaveThisCardType(employeTypes);

    const number = faker.finance.creditCardNumber('63[7-9]#-####-####-###L');
    const securityCode = newCryptValue(faker.finance.creditCardCVV());
    const cardholderName = abreviateMiddleName(employee.fullName);
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
    
    await cardRepository.insert(cardData);

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

    await cardRepository.update(id, {password: passwordHash});

}

export async function blockCard(id: number, password: string) {

    const card = await cardRepository.findById(id);

    ensureCardExists(card);
    ensureCardIsNotExpired(card.expirationDate);
    ensureCardIsNotBlocked(card.isBlocked);
    ensureCardIsActivated(card.password);
    ensurePasswordIsValid(password, card.password);

    await cardRepository.update(id, {isBlocked: true});

}

export async function unlockCard(id: number, password: string) {

    const card = await cardRepository.findById(id);

    ensureCardExists(card);
    ensureCardIsNotExpired(card.expirationDate);
    ensureCardIsBlocked(card.isBlocked);
    ensureCardIsActivated(card.password);
    ensurePasswordIsValid(password, card.password);

    await cardRepository.update(id, {isBlocked: false});

}

export async function rechargeCard(amount: number, cardId: number, apiKey: any) {
   
    const card = await cardRepository.findById(cardId);
    const company = await findByApiKey(apiKey);

    ensureApiKeyExists(company);
    ensureCardExists(card);
    ensureCardIsActivated(card.password);
    ensureCardIsNotExpired(card.expirationDate);

    await rechargeRepository.insert({cardId, amount});  
    
}

export async function buy(
    id: number,
    businessId: number, 
    password: string, 
    amount: number
) {
    const card = await cardRepository.findById(id);
    ensureCardExists(card);
    ensureCardIsActivated(card.password);
    ensureCardIsNotExpired(card.expirationDate);
    ensureCardIsNotBlocked(card.isBlocked);
    ensurePasswordIsValid(password, card.password)
}

