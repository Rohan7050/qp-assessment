import * as jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

interface TokenPayload {
    id: number,
    email: string;
}

export const generateToken = (payload: object, options: jwt.SignOptions) => { 
    const token = jwt.sign(payload, getSecret(), {...options});
    return token;
}

const getSecret = (): string => {
    const secret: string = process.env.JWT_SECRET || '';
    return secret;
}

export const verifyToken = (token: string): TokenPayload | null => {
    try {
        return jwt.verify(token, getSecret()) as TokenPayload;
    } catch (error: unknown) {
        console.log(error);
        return null;
    }
};