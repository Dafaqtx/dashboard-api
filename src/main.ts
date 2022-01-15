import { Container, ContainerModule, interfaces } from 'inversify';
import { TYPES } from './types';
import { ILogger } from './logger/interface';
import { LoggerService } from './logger/service';
import { App } from './app';
import { UserController } from './users/controller';
import { ExceptionFilter, IExceptionFilter } from './errors/exception-filter';
import { IUserService, UserService } from './users/service';
import { IUserController } from './users/interface';

interface IBootstrap {
	app: App;
	appContainer: Container;
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(TYPES.ILogger).to(LoggerService);
	bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter);
	bind<IUserController>(TYPES.UsersController).to(UserController);
	bind<IUserService>(TYPES.UsersService).to(UserService);
	bind<App>(TYPES.Application).to(App);
});

function bootstrap(): IBootstrap {
	const appContainer = new Container();
	appContainer.load(appBindings);
	const app = appContainer.get<App>(TYPES.Application);

	app.init();

	return { app, appContainer };
}

export const { app, appContainer } = bootstrap();
