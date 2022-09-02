import { Request, Response, NextFunction } from 'express'
import {unprocessableError} from '../middlewares/errorHandlingMiddleware'

export function schemaValidationMiddleware(schema: any) {

    return (req: Request, res: Response, next: NextFunction) => {

        const {error} = schema.validate(req.body, {abortEarly:false});

        if(error) {
            const message:string[] = error.details.map((err: any) => err.message)
            throw unprocessableError(message)
        }

        next()
    }
    
}