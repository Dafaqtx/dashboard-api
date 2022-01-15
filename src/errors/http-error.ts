export class HTTPError extends Error {
	constructor(public statusCode: number, public message: string, public context?: string) {
		super(message);
	}
}
