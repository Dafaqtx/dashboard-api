import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { UserLoginDto } from './dto/login';
import { UserRegisterDto } from './dto/register';
import { User } from './entity';

export interface IUserService {
	createUser(dto: UserRegisterDto): Promise<User | null>;
	validateUser(dto: UserLoginDto): Promise<boolean>;
}

@injectable()
export class UserService implements IUserService {
	async createUser({ email, name, password }: UserRegisterDto): Promise<User | null> {
		const user = new User(email, name);
		await user.setPassword(password);
		return user;
	}

	async validateUser(dto: UserLoginDto): Promise<boolean> {
		return true;
	}
}
