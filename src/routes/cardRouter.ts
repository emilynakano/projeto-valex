import { Router } from 'express';
import { createCard } from '../controllers/cardController';
import { schemaValidationMiddleware } from '../middlewares/schemaValidationMiddleware';
import {cardSchema} from '../schemas/cardSchema'
const cardRouter = Router();

cardRouter.post('/card',schemaValidationMiddleware(cardSchema), createCard)
                                                                                                                
export default cardRouter