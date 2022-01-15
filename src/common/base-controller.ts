import { Router, Response } from 'express';
import { ExpressReturnType, IRoute } from './route-interface';
import { ILogger } from '../logger/interface';
import { injectable } from 'inversify';
import 'reflect-metadata';

export { Router } from 'express';

@injectable()
export abstract class BaseController {
	private readonly _router: Router;

	constructor(private logger: ILogger) {
		this._router = Router();
	}

	get router(): Router {
		return this._router;
	}

	public send<T>(res: Response, code: number, message: T): ExpressReturnType {
		res.type('application/json');
		return res.status(code).json(message);
	}

	public ok<T>(res: Response, message: T): ExpressReturnType {
		return this.send<T>(res, 200, message);
	}

	public created(res: Response): ExpressReturnType {
		return res.status(201);
	}

	protected bindRoutes(routes: IRoute[]): void {
		for (const route of routes) {
			const handler = route.func.bind(this);

			this.logger.log(`[${route.method} ${route.path}]`);
			this.router[route.method](route.path, handler);
		}
	}
}