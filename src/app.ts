import { TYPES } from './types';
import express, { Express } from 'express';
import { Server } from 'http';
import { inject, injectable } from 'inversify';
import { ExceptionFilter } from './errors/exception-filter';
import { ILogger } from './logger/interface';
import { UserController } from './users/controller';
import 'reflect-metadata';

@injectable()
export class App {
	readonly app: Express;
	readonly port = 5555;
	protected server: Server;

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.UsersController) private userController: UserController,
		@inject(TYPES.ExceptionFilter) private exceptionFilter: ExceptionFilter,
	) {
		this.app = express();
	}

	useRoutes(): void {
		this.app.use('/users', this.userController.router);
	}

	useExceptionsFilter(): void {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
	}

	public async init(): Promise<void> {
		this.useRoutes();
		this.useExceptionsFilter();

		this.server = this.app.listen(this.port);
		this.logger.log(`Сервер запущен на http://localhost:${this.port}`);
	}
}
