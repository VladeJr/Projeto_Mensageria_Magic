import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from './users';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { hashSync } from 'bcrypt'
import { Role } from 'src/roles/enums/functions.enum';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) { }

    async getAllUsers() {
        try {
            return await this.userModel.find().exec();
        } catch (error) {
            throw new error;
        }
    }

    async create(user: User): Promise<{ message, statusCode }> {
        try {
            if (await this.getUserByEmail(user.email)) {
                return { message: "Already registered user", statusCode: 409 }
            }
            const password = await hashSync(user.pwd, 10);
            const userCreated = new this.userModel({
                name: user.name,
                email: user.email,
                pwd: password,
                roles: user.roles
            });
            await userCreated.save();
            return { message: "Created user", statusCode: 201 };
        } catch (err) {
            throw new err;
        }
    }

    async getUserById(id: string): Promise<User> {
        try {
            return await this.userModel.findById(id).exec();
        } catch (err) {
            throw new err;
        }
    }

    async getUserByEmail(email: string): Promise<User | undefined> {
        try {
            return await this.userModel.findOne({
                email: email,
            });
        } catch (err) {
            throw new err;
        }
    }

    async update(id: string, user: User): Promise<User> {
        try {
            const mainRole = await this.userModel.findById(id).exec();
            if (
                mainRole.roles.includes(Role.User) &&
                !mainRole.roles.includes(Role.Admin) &&
                user.roles.includes(Role.Admin)
            ) {
                throw new ForbiddenException;
            }
            return await this.userModel.findByIdAndUpdate(id, user).exec();
        } catch (err) {
            throw err;
        }
    }

    async delete(id: string) {
        try {
            const cardDeleted = this.userModel.findOneAndDelete({ _id: id }).exec();
            return await cardDeleted;
        } catch (err) {
            throw new err;
        }
    }

    async deleteAll() {
        try {
            await this.userModel.deleteMany();
        } catch (err) {
            throw new err;
        }
    }

}