import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';
import { abreviateMiddleName } from '../utils/cardUtilits';
import { newCryptValue } from '../utils/encryptUtilits';

import * as cardRepository from "../repositories/cardRepository";
import * as companyRepository from "../repositories/companyRepository";
import * as employeeRepository from "../repositories/employeeRepository";
import * as rechargeRepository from '../repositories/rechargeRepository';
import * as paymentRepository from '../repositories/paymentRepository';

import { Payment } from '../interfaces/paymentInterface';
import { Recharge } from '../interfaces/rechargeInterface';

import * as validations from '../validations/cardValidations'

export function generateBalance(recharges: Recharge[], payments: Payment[]) {

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
