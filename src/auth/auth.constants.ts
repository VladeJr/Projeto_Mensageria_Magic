import * as dotenv from 'dotenv'
dotenv.config();

const { secret } = process.env
export const jwtConstants = {
    secret: secret
};
