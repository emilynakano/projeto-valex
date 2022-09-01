import { Response} from 'express';

interface Error {
	type: string, message: string | string[]
}

export function notFoundError(entity: string): Error {
    return { type: 'error_not_found', message: `Could not find specified ${entity}` };
}

export function unprocessableError(error: any): Error {
	return { type: 'unprocessable_entity', message: error.details.map((err: any) => err.message)}
}

export default async function errorHandlingMiddleware(error: any, _req: any, res: Response, _next: any) {
	if (error.type === 'error_not_found') return res.status(404).send(error.message);
	if (error.type === 'unprocessable_entity') return res.status(422).send(error.message);
	
	console.log(error)
	return res.status(500).send(error)
}
