import { Router } from 'express';
import { createCard, ativateCard } from '../controllers/cardController';
import { schemaValidationMiddleware } from '../middlewares/schemaValidationMiddleware';
import {newCardSchema, activateCardSchema} from '../schemas/cardSchema'
const cardRouter = Router();

cardRouter.post('/cards',schemaValidationMiddleware(newCardSchema), createCard)
cardRouter.post('/cards/:id/activate', schemaValidationMiddleware(activateCardSchema), ativateCard)
                                                                                                                
export default cardRouter