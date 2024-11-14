import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) { }

    async signIn(
        email: string,
        pass: string
    ): Promise<{access_token: string}> {
        const user = await this.usersService.getUserByEmail(email);
        const isPasswordValid = await compare(pass, user.pwd);
        if (!isPasswordValid) {
            throw new UnauthorizedException();
        }
        const payload = { sub: user._id, email: user.email, roles: user.roles};
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
}