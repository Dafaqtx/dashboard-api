import { UserModel } from '@prisma/client';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { IConfigService } from '../config/service';
import { TYPES } from '../types';
import { UserLoginDto } from './dto/login';
import { UserRegisterDto } from './dto/register';
import { User } from './entity';
import { IUsersRepository } from './repository';

export interface IUserService {
	createUser(dto: UserRegisterDto): Promise<UserModel | null>;
	validateUser(dto: UserLoginDto): Promise<boolean>;
	getUserInfo(email: string): Promise<UserModel | null>;
}

@injectable()
export class UserService implements IUserService {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.UsersRepository) private usersRepository: IUsersRepository,
	) {}

	async createUser({ email, name, password }: UserRegisterDto): Promise<UserModel | null> {
		const candidate = await this.usersRepository.find(email);
		if (candidate) {
			return null;
		}

		const salt = this.configService.get('SALT');
		const user = new User(email, name);
		await user.setPassword(password, Number(salt));
		return this.usersRepository.create(user);
	}

	async validateUser({ email, password }: UserLoginDto): Promise<boolean> {
		const candidate = await this.usersRepository.find(email);
		if (!candidate) {
			return false;
		}
		const newUser = new User(candidate.email, candidate.name, candidate.password);
		return newUser.comparePassword(password);
	}

	async getUserInfo(email: string): Promise<UserModel | null> {
		return this.usersRepository.find(email);
	}
}
