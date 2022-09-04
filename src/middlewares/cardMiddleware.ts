import { NextFunction, Request, Response } from "express";
import { apiKeySchema, cardIdSchema } from "../schemas/cardSchema";
import * as errorMiddleware from "./errorHandlingMiddleware";

export function apiKeyValidation(req: Request, res: Response, next: NextFunction) {
    const { 'x-api-key': apiKey } = req.headers;

    const { error } = apiKeySchema.validate({apiKey});
    if(error) throw errorMiddleware.unprocessableError(error.details.map((err: any) => err.message))

    next();
}
export function cardIdValidation(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    const { error } = cardIdSchema.validate(req.params);
    if(error) throw errorMiddleware.unprocessableError(error.details.map((err: any) => err.message))

    next();
}
