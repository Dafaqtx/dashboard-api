import { inject, injectable } from 'inversify';
import { UserModel } from '@prisma/client';
import 'reflect-metadata';
import { TYPES } from '../types';
import { PrismaService } from '../database/prisma-service';
import { UserRegisterDto } from './dto/register';
import { User } from './entity';

export interface IUsersRepository {
	create: (user: User) => Promise<UserModel>;
	find: (email: string) => Promise<UserModel | null>;
}

@injectable()
export class UsersRepository implements IUsersRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}

	async create(data: User): Promise<UserModel> {
		return this.prismaService.client.userModel.create({ data });
	}

	async find(email: UserRegisterDto['email']): Promise<UserModel | null> {
		return this.prismaService.client.userModel.findFirst({
			where: { email },
		});
	}
}
