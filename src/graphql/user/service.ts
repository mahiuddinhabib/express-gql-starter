import { Response } from 'express';
import appDataSource from '../../db/dataSource';
import { User } from '../../db/entities/User';
import gqlError from '../../errors/throwGraphQLError';
import { hashingHelper } from '../../helpers/hashingHelpers';
import { jwtHelpers } from '../../helpers/jwtHelpers';
import config from '../../config';
import { Secret } from 'jsonwebtoken';
import { Profile } from '../../db/entities/Profile';
import { USER_ROLE } from '../../enums/user';

const userRepository = appDataSource.getRepository(User);

const loginUser = async (
    input: { email: string; password: string },
    res: Response,
) => {
    const user = await userRepository
        .createQueryBuilder('user')
        .addSelect('user.password')
        .where('user.email = :email', { email: input.email })
        .leftJoinAndSelect('user.profile', 'profile')
        .getOne();

    if (!user) {
        throw new gqlError('User not found', 'NOT_FOUND');
    }

    const isPasswordMatch = await hashingHelper.match_password(
        input.password,
        user.password,
    );

    if (!isPasswordMatch) {
        throw new gqlError('Invalid credentials', 'INVALID_CREDENTIALS');
    }

    const accessToken = jwtHelpers.createToken(
        { id: user.id, email: user.email, role: user.role },
        config.jwt.secret as Secret,
        config.jwt.expires_in as string,
    );

    const refreshToken = jwtHelpers.createToken(
        { id: user.id, email: user.email, role: user.role },
        config.jwt.refresh_secret as Secret,
        config.jwt.refresh_expires_in as string,
    );

    const cookieOptions = {
        secure: config.env === 'production',
        httpOnly: true,
    };

    res.cookie('refreshToken', refreshToken, cookieOptions);

    return {
        accessToken,
        user,
    };
};

const registerUser = async (
    input: {
        fullName: string;
        email: string;
        password: string;
        role?: USER_ROLE;
    },
    res: Response,
) => {
    const isExist = await userRepository.findOneBy({ email: input.email });

    if (isExist) {
        throw new gqlError('User already exists', 'CONFLICT');
    }

    const { fullName, ...userInput } = input;

    const profile = new Profile({ fullName });
    const user = new User({ profile, ...userInput });

    const createdUser = await userRepository.save(user);

    const accessToken = jwtHelpers.createToken(
        {
            id: createdUser.id,
            email: createdUser.email,
            role: createdUser.role,
        },
        config.jwt.secret as Secret,
        config.jwt.expires_in as string,
    );

    const refreshToken = jwtHelpers.createToken(
        {
            id: createdUser.id,
            email: createdUser.email,
            role: createdUser.role,
        },
        config.jwt.refresh_secret as Secret,
        config.jwt.refresh_expires_in as string,
    );

    const cookieOptions = {
        secure: config.env === 'production',
        httpOnly: true,
    };

    res.cookie('refreshToken', refreshToken, cookieOptions);

    return {
        accessToken,
        user: await userRepository.findOne({
            where: { id: createdUser.id },
            relations: ['profile'],
        }),
    };
};

export const UserService = {
    loginUser,
    registerUser,
};
