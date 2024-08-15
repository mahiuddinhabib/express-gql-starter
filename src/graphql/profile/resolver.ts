import { JwtPayload } from 'jsonwebtoken';
import appDataSource from '../../db/dataSource';
import { Profile } from '../../db/entities/Profile';
import gqlError from '../../errors/throwGraphQLError';
import { CustomContext } from '..';

const profileRepository = appDataSource.getRepository(Profile);

export const ProfileResolver = {
    Query: {
        profile: async (_: any, __: any, { userInfo }: CustomContext) => {
            if (!userInfo) {
                throw new gqlError('You are not authorized', 'UNAUTHORIZED');
            }
            const profile = await profileRepository.findOne({
                where: { user: { id: userInfo.id } },
            });

            if (!profile) {
                throw new gqlError('Profile not found', 'NOT_FOUND');
            }

            return profile;
        },
    },
    Mutation: {
        updateProfile: async (
            _: any,
            { input }: { input: Partial<Profile> },
            { userInfo }: CustomContext,
        ) => {
            if (!userInfo) {
                throw new gqlError('You are not authorized', 'UNAUTHORIZED');
            }

            const profile = await profileRepository.findOne({
                where: {
                    user: {
                        id: userInfo.id,
                    },
                },
            });

            if (!profile) {
                throw new gqlError('Profile not found', 'NOT_FOUND');
            }

            await profileRepository.update(profile.id, input);

            return await profileRepository.findOne({
                where: {
                    id: profile.id,
                },
            });
        },
    },
};
