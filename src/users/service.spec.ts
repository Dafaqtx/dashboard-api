import 'reflect-metadata';
import { UserModel } from '@prisma/client';
import { Container } from 'inversify';

import { TYPES } from '../types';
import { IConfigService } from '../config/service';
import { IUsersRepository } from './repository';
import { UserService } from './service';
import { User } from './entity';

const ConfigServiceMock: IConfigService = {
	get: jest.fn(),
};

const UsersRepositoryMock: IUsersRepository = {
	find: jest.fn(),
	create: jest.fn(),
};

const container = new Container();
let configService: IConfigService;
let usersRepository: IUsersRepository;
let usersService: UserService;

beforeAll(() => {
	container.bind<UserService>(TYPES.UsersService).to(UserService);
	container.bind<IConfigService>(TYPES.ConfigService).toConstantValue(ConfigServiceMock);
	container.bind<IUsersRepository>(TYPES.UsersRepository).toConstantValue(UsersRepositoryMock);

	configService = container.get<IConfigService>(TYPES.ConfigService);
	usersRepository = container.get<IUsersRepository>(TYPES.UsersRepository);
	usersService = container.get<UserService>(TYPES.UsersService);
});

let user: UserModel | null;

describe('User Service', () => {
	it('should create a new user', async () => {
		configService.get = jest.fn().mockReturnValueOnce('1');
		usersRepository.create = jest
			.fn()
			.mockImplementationOnce(
				({ name, email, password }: User): UserModel => ({ name, email, password, id: 1 }),
			);
		user = await usersService.createUser({
			email: 'test@example.com',
			name: 'Test',
			password: '1',
		});

		expect(user?.id).toEqual(1);
		expect(user?.password).not.toEqual('1');
	});

	it('validateUser - success', async () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(user);
		const res = await usersService.validateUser({
			email: 'test@example.com',
			password: '1',
		});
		expect(res).toBeTruthy();
	});

	it('validateUser - wrong password', async () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(user);
		const res = await usersService.validateUser({
			email: 'test@example.com',
			password: '2',
		});
		expect(res).toBeFalsy();
	});

	it('validateUser - wrong user', async () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(null);
		const res = await usersService.validateUser({
			email: 'test@example.com',
			password: '2',
		});
		expect(res).toBeFalsy();
	});
});
