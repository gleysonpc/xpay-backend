import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Unauthorized } from '../common/httpErrors';

interface JwtPayload {
    email: string
}

export function authentication(req: Request, _res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        throw new Unauthorized('Access Token not provided!');
    }
    const [, accessToken] = authHeader.split(' ');
    try {
        const decoded = jwt.verify(accessToken, process.env.SESSION_SECRET as string) as JwtPayload;
        const { email } = decoded;
        req.userEmail = email;
        return next();
    } catch (error) {
        throw new Unauthorized('Invalid token!');
    }
}
