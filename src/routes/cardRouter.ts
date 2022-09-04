import { Router } from 'express';
import * as cardController from '../controllers/cardController';
import { schemaValidationMiddleware } from '../middlewares/schemaValidationMiddleware';
import {newCardSchema, activateCardSchema, passwordCardSchema} from '../schemas/cardSchema'
const cardRouter = Router();

cardRouter.post('/cards',schemaValidationMiddleware(newCardSchema), cardController.createCard);
cardRouter.post('/cards/:id/activate', schemaValidationMiddleware(activateCardSchema), cardController.ativateCard);
cardRouter.post('/cards/:id/block', schemaValidationMiddleware(passwordCardSchema), cardController.blockCard);
cardRouter.post('/cards/:id/unlock', schemaValidationMiddleware(passwordCardSchema), cardController.unlockCard);
cardRouter.post('/cards/:id/recharge', cardController.rechargeCard)
                                                                                                                
export default cardRouter