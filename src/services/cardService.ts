import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { abreviateMiddleName } from '../utils/cardUtilits';
import {compareCrypt, decryptValue, newCryptValue} from '../utils/encryptUtilits';

import * as cardRepository from "../repositories/cardRepository";
import * as companyRepository from "../repositories/companyRepository";
import * as employeeRepository from "../repositories/employeeRepository";
import * as rechargeRepository from '../repositories/rechargeRepository';
import * as businessRepository from '../repositories/businessRepository';
import * as paymentRepository from '../repositories/paymentRepository';

import { Payment } from '../interfaces/paymentInterface';
import { Recharge } from '../interfaces/rechargeInterface';
import * as validations from '../validations/cardValidations'

dayjs.extend(customParseFormat);



function generateBalance(recharges: Recharge[], payments: Payment[]) {

    let balancePositive = 0;
    recharges.forEach((recharge) => balancePositive += recharge.amount);

    let balanceNegative = 0;
    payments.forEach((payment) => balanceNegative += payment.amount);

    const balance = balancePositive - balanceNegative;
    
    return balance
}
export async function createCard (
    employeeId:number, 
    type:cardRepository.TransactionTypes, 
    apiKey: any
) {

    const company = await companyRepository.findByApiKey(apiKey);
    validations.ensureApiKeyExists(company);
    
    const employee = await employeeRepository.findById(employeeId);
    validations.ensureEmployeeExists(employee);

    const employeTypes = await cardRepository.findByTypeAndEmployeeId(type, employeeId);
    validations.ensureEmployeeDontHaveThisCardType(employeTypes);

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

    validations.ensureCardExists(card);
    validations.ensureCardIsNotActivated(card.password);
    validations.ensureSecurityCodeIsValid(securityCode, card.securityCode);
    validations.ensureCardIsNotExpired(card.expirationDate);
    
    const passwordHash = newCryptValue(password);

    await cardRepository.update(id, {password: passwordHash});

}

export async function blockCard(id: number, password: string) {

    const card = await cardRepository.findById(id);

    validations.ensureCardExists(card);
    validations.ensureCardIsNotExpired(card.expirationDate);
    validations.ensureCardIsNotBlocked(card.isBlocked);
    validations.ensureCardIsActivated(card.password);
    validations.ensurePasswordIsValid(password, card.password);

    await cardRepository.update(id, {isBlocked: true});

}

export async function unlockCard(id: number, password: string) {

    const card = await cardRepository.findById(id);

    validations.ensureCardExists(card);
    validations.ensureCardIsNotExpired(card.expirationDate);
    validations.ensureCardIsBlocked(card.isBlocked);
    validations.ensureCardIsActivated(card.password);
    validations.ensurePasswordIsValid(password, card.password);

    await cardRepository.update(id, {isBlocked: false});

}

export async function rechargeCard(amount: number, cardId: number, apiKey: any) {
   
    const card = await cardRepository.findById(cardId);
    const company = await companyRepository.findByApiKey(apiKey);

    validations.ensureApiKeyExists(company);
    validations.ensureCardExists(card);
    validations.ensureCardIsActivated(card.password);
    validations.ensureCardIsNotExpired(card.expirationDate);

    await rechargeRepository.insert({cardId, amount});  
    
}

export async function buy(
    id: number,
    businessId: number, 
    password: string, 
    amount: number
) {

    const card = await cardRepository.findById(id);

    validations.ensureCardExists(card);
    validations.ensureCardIsActivated(card.password);
    validations.ensureCardIsNotExpired(card.expirationDate);
    validations.ensureCardIsNotBlocked(card.isBlocked);
    validations.ensurePasswordIsValid(password, card.password);

    const business = await businessRepository.findById(businessId);

    validations.ensurebusinessExists(business);
    validations.ensureCardTypeIsEqualToBusinessType(card.type, business.type);

    const recharges = await rechargeRepository.findByCardId(id);
    const payments = await paymentRepository.findByCardId(id);

    const balance = generateBalance(recharges, payments)

    validations.ensureBalanceIsGreaterThanAmount(balance, amount);

    const paymentData = {
        cardId: id, 
        businessId, 
        amount
    }

    await paymentRepository.insert(paymentData);

}

export async function getBlanceAndTransaction(id: number) {
    
    const card = await cardRepository.findById(id);

    validations.ensureCardExists(card);

    const recharges = await rechargeRepository.findByCardId(id);
    const transactions = await paymentRepository.findByCardId(id);

    const balance = generateBalance(recharges, transactions);

    const cardData = {
        balance,
        transactions,
        recharges
    }

    return cardData;

}
