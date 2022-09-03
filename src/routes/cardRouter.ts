import { Router } from 'express';
import * as cardController from '../controllers/cardController';
import { schemaValidationMiddleware } from '../middlewares/schemaValidationMiddleware';
import {newCardSchema, activateCardSchema} from '../schemas/cardSchema'
const cardRouter = Router();

cardRouter.post('/cards',schemaValidationMiddleware(newCardSchema), cardController.createCard);
cardRouter.post('/cards/:id/activate', schemaValidationMiddleware(activateCardSchema), cardController.ativateCard);
cardRouter.post('/cards/:id/block', cardController.blockCard);
                                                                                                                
export default cardRouter