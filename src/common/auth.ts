import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import { IMiddleware } from './middleware-interface';

export class AuthMiddleware implements IMiddleware {
	constructor(private secret: string) {}
	async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
		if (req.headers.authorization) {
			const token = req.headers.authorization.split(' ')[1];

			verify(token, this.secret, (err, payload) => {
				if (err) {
					next();
				} else if (payload) {
					req.user = payload.email;
					next();
				}
			});
		} else {
			next();
		}
	}
}
