import { IUsersRepository, UsersRepository } from './users/repository';
import { Container, ContainerModule, interfaces } from 'inversify';
import { TYPES } from './types';
import { ILogger } from './logger/interface';
import { LoggerService } from './logger/service';
import { App } from './app';
import { UserController } from './users/controller';
import { ExceptionFilter, IExceptionFilter } from './errors/exception-filter';
import { IUsersService, UserService } from './users/service';
import { IUserController } from './users/interface';
import { PrismaService } from './database/prisma-service';
import { ConfigService, IConfigService } from './config/service';

interface IBootstrap {
	app: App;
	appContainer: Container;
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();
	bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter);
	bind<IUserController>(TYPES.UsersController).to(UserController);
	bind<IUsersService>(TYPES.UsersService).to(UserService);
	bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope();
	bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
	bind<IUsersRepository>(TYPES.UsersRepository).to(UsersRepository).inSingletonScope();
	bind<App>(TYPES.Application).to(App);
});

async function bootstrap(): Promise<IBootstrap> {
	const appContainer = new Container();
	appContainer.load(appBindings);
	const app = appContainer.get<App>(TYPES.Application);

	await app.init();

	return { app, appContainer };
}

export const boot = bootstrap();
