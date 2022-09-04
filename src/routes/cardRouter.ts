import { Router } from 'express';

import * as cardController from '../controllers/cardController';
import * as cardSchemas from '../schemas/cardSchema'
import * as cardMiddleware from '../middlewares/cardMiddleware';

import { schemaValidationMiddleware } from '../middlewares/schemaValidationMiddleware';

const cardRouter = Router();

cardRouter.post('/cards', 
    cardMiddleware.apiKeyValidation, 
    schemaValidationMiddleware(cardSchemas.newCardSchema), 
    cardController.createCard
);

cardRouter.post('/cards/:id/activate', 
    cardMiddleware.cardIdValidation, 
    schemaValidationMiddleware(cardSchemas.activateCardSchema), 
    cardController.ativateCard
);

cardRouter.post('/cards/:id/block', 
    cardMiddleware.cardIdValidation, 
    schemaValidationMiddleware(cardSchemas.passwordCardSchema), 
    cardController.blockCard
);

cardRouter.post('/cards/:id/unlock', 
    cardMiddleware.cardIdValidation, 
    schemaValidationMiddleware(cardSchemas.passwordCardSchema), 
    cardController.unlockCard
);

cardRouter.post('/cards/:id/recharge', 
    cardMiddleware.apiKeyValidation, 
    cardMiddleware.cardIdValidation, 
    schemaValidationMiddleware(cardSchemas.amountCardSchema) ,
    cardController.rechargeCard
);
                                                                                                                
export default cardRouter