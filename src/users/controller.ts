import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';

import { TYPES } from './../types';
import { BaseController } from '../common/base-controller';
import { HTTPError } from '../errors/http-error';
import { ILogger } from '../logger/interface';
import { IUserController } from './interface';

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(@inject(TYPES.ILogger) private loggerService: ILogger) {
		super(loggerService);

		this.bindRoutes([
			{ path: '/register', method: 'post', func: this.register },
			{ path: '/login', method: 'post', func: this.login },
		]);
	}

	login(req: Request, res: Response, next: NextFunction): void {
		next(new HTTPError(401, 'Ошибка авторизации', 'login'));
	}

	register(req: Request, res: Response): void {
		this.ok(res, 'register');
	}
}
