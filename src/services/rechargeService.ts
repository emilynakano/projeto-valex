import * as validations from '../validations/cardValidations';

import * as cardRepository from '../repositories/cardRepository';
import * as companyRepository from '../repositories/companyRepository';
import * as rechargeRepository from '../repositories/rechargeRepository';

export async function rechargeCard(amount: number, cardId: number, apiKey: any) {
   
    const card = await cardRepository.findById(cardId);
    const company = await companyRepository.findByApiKey(apiKey);

    validations.ensureApiKeyExists(company);
    validations.ensureCardExists(card);
    validations.ensureCardIsActivated(card.password);
    validations.ensureCardIsNotExpired(card.expirationDate);

    await rechargeRepository.insert({cardId, amount});  
    
}