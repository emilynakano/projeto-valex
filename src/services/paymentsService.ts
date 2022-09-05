import * as cardRepository from "../repositories/cardRepository";
import * as rechargeRepository from '../repositories/rechargeRepository';
import * as businessRepository from '../repositories/businessRepository';
import * as paymentRepository from '../repositories/paymentRepository';

import * as validations from '../validations/cardValidations';

import { generateBalance } from "./cardService";


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