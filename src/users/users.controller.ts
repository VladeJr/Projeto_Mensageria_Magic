import { Body, Controller, Delete, ForbiddenException, Get, NotFoundException, Param, Post, Put, Res, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users';
import { AuthGuard } from 'src/auth/auth.guard';
import { Public } from 'src/auth/auth.decorator';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/roles/enums/functions.enum';
import { Response } from 'express';

@UseGuards(AuthGuard)
@Roles(Role.Admin)
@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ) { }

    @Get()
    async getAllUsers(): Promise<User[]> {
        try {
            return await this.usersService.getAllUsers();
        } catch (err) {
            console.log("Error: " + err);
        }
    }

    @Public()
    @Roles(Role.User, Role.Admin)
    @Post()
    async create(@Body() user: User, @Res() res: Response): Promise<Response> {
        try {
            const result = await this.usersService.create(user);
            return res.status(result.statusCode).send({ message: result.message })
        } catch (err) {
            console.log("Error: " + err);
        }
    }

    @Get(':id')
    async getUserById(@Param('id') id: string): Promise<User> {
        try {
            return await this.usersService.getUserById(id);
        } catch (err) {
            console.log("Error: " + err);
        }
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() user: User): Promise<User> {
        try {
            return await this.usersService.update(id, user);
        } catch (err) {
            if (err instanceof ForbiddenException) {
                throw new ForbiddenException('Regular users cannot promote themselves to administrators');
            }
            if (err instanceof NotFoundException) {
                throw new NotFoundException({ statusCode: 204, message: "User not found" });
            }
            throw err;
        }
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<User> {
        try {
            return await this.usersService.delete(id)
        } catch (err) {
            console.log("Error: " + err);
        }
    }

    @Delete()
    async deleteAll(): Promise<void> {
        try {
            await this.usersService.deleteAll()
        } catch (err) {
            console.log("Error: " + err);
        }
    }
}
