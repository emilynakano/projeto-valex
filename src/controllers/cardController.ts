import { Request, Response } from "express";

import * as cardService from '../services/cardService';

export async function createCard(req: Request, res: Response) {
    const { employeeId, type } = req.body;
    const { 'x-api-key': apiKey } = req.headers;
    
    await cardService.createCard(employeeId, type, apiKey);
    res.status(201).send('card created sucessfuly!');
}
export async function ativateCard(req: Request, res: Response) {
    const { employeeId, securityCode, password } = req.body;
    const { id }  = req.params;

    cardService.ativateCard(Number(id), Number(employeeId), securityCode, password);
    res.status(200).send('card activated sucessfuly!')
}