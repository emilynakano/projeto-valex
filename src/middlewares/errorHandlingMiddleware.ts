import { Response} from 'express';

interface Error {
	type: string, message: string | string[]
}

export function forbiddenError(action: string): Error {
	return {type: 'error_forbbiden', message: `cannot ${action}`}
}

export function conflictError (entity: string): Error {
	return { type: 'error_conflict' , message: `${entity} already exists!`}
}

export function unauthorizedError (credential: string): Error {
    return { type: 'error_unauthorized', message: `Invalid or non-existent ${credential}` };
}

export function notFoundError(entity: string): Error {
    return { type: 'error_not_found', message: `Could not find specified ${entity}` };
}

export function unprocessableError(error: string[]): Error {
	return { type: 'unprocessable_entity', message: error}
}

export default async function errorHandlingMiddleware(error: any, _req: any, res: Response, _next: any) {
	if (error.type === 'error_not_found') return res.status(404).send(error.message);
	if (error.type === 'unprocessable_entity') return res.status(422).send(error.message);
	if(error.type === 'error_unauthorized') return res.status(401).send(error.message);
	if(error.type === 'error_conflict') return res.status(403).send(error.message);
	console.log(error)
	return res.status(500).send(error)
}
