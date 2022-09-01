import { Request, Response } from "express";
export function createCard(req: Request, res: Response) {
    const {employeeId, type} = req.body;
    const {'x-api-key': apiKey} = req.headers;
}