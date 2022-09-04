import { Router } from 'express';
import * as cardController from '../controllers/cardController';
import { schemaValidationMiddleware } from '../middlewares/schemaValidationMiddleware';
import {newCardSchema, activateCardSchema, passwordCardSchema, amountCardSchema} from '../schemas/cardSchema'
import { apiKeyValidation, cardIdValidation } from '../middlewares/cardMiddleware';
const cardRouter = Router();

cardRouter.post('/cards', apiKeyValidation, schemaValidationMiddleware(newCardSchema), cardController.createCard);
cardRouter.post('/cards/:id/activate' , cardIdValidation, schemaValidationMiddleware(activateCardSchema), cardController.ativateCard);
cardRouter.post('/cards/:id/block', cardIdValidation, schemaValidationMiddleware(passwordCardSchema), cardController.blockCard);
cardRouter.post('/cards/:id/unlock', cardIdValidation, schemaValidationMiddleware(passwordCardSchema), cardController.unlockCard);
cardRouter.post('/cards/:id/recharge', apiKeyValidation, cardIdValidation, schemaValidationMiddleware(amountCardSchema) ,cardController.rechargeCard)
                                                                                                                
export default cardRouter