import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import config from '../config';

const createToken = (
    payload: Record<string, unknown>,
    secret: Secret,
    expireTime: string,
): string => {
    return jwt.sign(payload, secret, {
        expiresIn: expireTime,
    });
};

const verifyToken = (token: string, secret: Secret): JwtPayload => {
    return jwt.verify(token, secret) as JwtPayload;
};

export const jwtHelpers = {
    createToken,
    verifyToken,
};
