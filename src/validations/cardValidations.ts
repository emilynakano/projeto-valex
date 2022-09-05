import { Business } from '../interfaces/businessInterface';
import { Company } from '../interfaces/companyInterfaces';
import { Employee } from '../interfaces/employeeInterfaces';
import { Payment } from '../interfaces/paymentInterface';
import { Recharge } from '../interfaces/rechargeInterface';
import { Card } from '../interfaces/cardInterfaces';
import * as errorMiddleware from '../middlewares/errorHandlingMiddleware';
import { compareCrypt } from '../utils/encryptUtilits';
import dayjs from 'dayjs';

export function ensureApiKeyExists (company: Company) {
    if(!company) throw errorMiddleware.notFoundError('company')
}
export function ensureEmployeeExists (employee: Employee) {
    if(!employee) throw errorMiddleware.notFoundError('employee');
}
export function ensureEmployeeDontHaveThisCardType (employeTypes: {}) {
    if(employeTypes) throw errorMiddleware.conflictError('card type');
}

export function ensureCardExists (card: Card) {
    if(!card) throw errorMiddleware.notFoundError('card');
}
export function ensureCardIsNotActivated (password: string | undefined) {
    if(password) throw errorMiddleware.badRequestError('this card is already activated!')
}
export function ensureCardIsActivated (password: string | undefined) {
    if(!password) throw errorMiddleware.badRequestError('this card is not activated!')
}
export function ensureSecurityCodeIsValid (reqSecurityCode: string, securityCode: string) {
    const securityCodeValid = compareCrypt(reqSecurityCode, securityCode);

    if(!securityCodeValid) {
        throw errorMiddleware.unauthorizedError('security code');
    }
}
export function ensurePasswordIsValid (reqPassword: string, password: string | undefined) {
    if(!password) throw errorMiddleware.unauthorizedError('password'); 

    const passwordValidation = compareCrypt(reqPassword, password);
    
    if(!passwordValidation) throw errorMiddleware.unauthorizedError('password');
}
export function ensureCardIsNotExpired(expirationDate: string) {
    if(!dayjs().isBefore(dayjs(expirationDate, 'MM/YY'), 'month')) {
        throw errorMiddleware.badRequestError('this card is expired!')
    }
}

export function ensureCardIsNotBlocked (isBlocked: boolean) {
    if(isBlocked) throw errorMiddleware.badRequestError('this card is blocked');
}
export function ensureCardIsBlocked (isBlocked: boolean) {
    if(!isBlocked) throw errorMiddleware.badRequestError('this card is not blocked');
}

export function ensurebusinessExists (business: Business) {
    if(!business) throw errorMiddleware.notFoundError('business');
}
export function ensureCardTypeIsEqualToBusinessType (cardType: string, businessType: string) {
    if(cardType !== businessType) throw errorMiddleware.badRequestError('type card is not the same business type!');
}
export function ensureBalanceIsGreaterThanAmount (balance: number, amount: number) {
    if(amount > balance) throw errorMiddleware.badRequestError('amount is greater than the balance!')
}