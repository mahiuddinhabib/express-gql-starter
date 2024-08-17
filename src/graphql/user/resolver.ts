import { USER_ROLE } from '../../enums/user';
import { Response } from 'express';
import { UserService } from './service';

export const UserResolver = {
    Query: {
        login: async (
            _: any,
            {
                input,
            }: {
                input: {
                    email: string;
                    password: string;
                };
            },
            { res }: { res: Response },
        ) => {
            return await UserService.loginUser(input, res);
        },
    },
    Mutation: {
        register: async (
            _: any,
            {
                input,
            }: {
                input: {
                    fullName: string;
                    email: string;
                    password: string;
                    role?: USER_ROLE;
                };
            },
            { res }: { res: Response },
        ) => {
            return await UserService.registerUser(input, res);
        },
    },
};
