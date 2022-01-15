import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';

import { TYPES } from './../types';
import { BaseController } from '../common/base-controller';
import { HTTPError } from '../errors/http-error';
import { ILogger } from '../logger/interface';
import { IUserController } from './interface';
import { UserLoginDto } from './dto/login';
import { UserRegisterDto } from './dto/register';
import { IUserService } from './service';
import { ValidateMiddleware } from '../common/validate';

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.UsersService) private userService: IUserService,
	) {
		super(loggerService);

		this.bindRoutes([
			{
				path: '/register',
				method: 'post',
				func: this.register,
				middlewares: [new ValidateMiddleware(UserRegisterDto)],
			},
			{
				path: '/login',
				method: 'post',
				func: this.login,
				middlewares: [new ValidateMiddleware(UserLoginDto)],
			},
		]);
	}

	async login(
		{ body }: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userService.validateUser(body);

		if (!result) return next(new HTTPError(401, 'Ошибка авторизации', 'login'));

		this.ok(res, {});
	}

	async register(
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userService.createUser(body);

		if (!result) return next(new HTTPError(422, 'Такой пользователь уже существует'));

		this.ok(res, { email: result.email, id: result.id });
	}
}
