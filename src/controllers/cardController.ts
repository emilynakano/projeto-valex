import { Request, Response } from "express";

import * as cardService from '../services/cardService';

export async function createCard(req: Request, res: Response) {
    const {employeeId, type} = req.body;
    const {'x-api-key': apiKey} = req.headers;
    
    await cardService.createCard(employeeId, type, apiKey);
    res.status(201).send('card created sucessfuly!');
}