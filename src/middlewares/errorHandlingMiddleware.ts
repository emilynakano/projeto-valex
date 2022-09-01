import { Response} from 'express';

interface Error {
	type: string, message: string
}

export function notFoundError(entity: string): Error {
    return { type: 'error_not_found', message: `Could not find specified ${entity}` };
}

export default async function errorHandlingMiddleware(error: any, _req: any, res: Response, _next: any) {
	if (error.type === "error_not_found") return res.status(404).send(error.message);
	return res.sendStatus(500);
}
