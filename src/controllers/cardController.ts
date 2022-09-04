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

    await cardService.activateCard(Number(id), Number(employeeId), securityCode, password);
    res.status(200).send('card activated sucessfuly!')
}

export async function blockCard(req: Request, res: Response) {
    const { password } = req.body;
    const { id }  = req.params;

    await cardService.blockCard(Number(id), password)
    res.status(200).send('card blocked sucessfuly!')
}

export async function unlockCard(req: Request, res: Response) {
    const { password } = req.body;
    const { id }  = req.params;

    await cardService.unlockCard(Number(id), password)
    res.status(200).send('card unlocked sucessfuly!')
}

export async function rechargeCard(req: Request, res: Response) {
    const { id } = req.params;
    const { 'x-api-key': apiKey } = req.headers;
    const { amount } = req.body
    
    await cardService.rechargeCard(amount, Number(id), apiKey);
    res.status(200).send('card recharged sucessfuly!');
}

export async function buy(req: Request, res: Response) {
    const { id } = req.params;
    const { password, amount, businessId } = req.body
    
    await cardService.buy(Number(id), Number(businessId), password, amount)
    res.status(200).send('item purchased successfully!');
}
