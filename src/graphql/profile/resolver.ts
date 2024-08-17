import { Profile } from '../../db/entities/Profile';
import gqlError from '../../errors/throwGraphQLError';
import { CustomContext } from '..';
import { profileService } from './service';

export const ProfileResolver = {
    Query: {
        profile: async (_: any, __: any, { userInfo }: CustomContext) => {
            if (!userInfo) {
                throw new gqlError('You are not authorized', 'UNAUTHORIZED');
            }

            return await profileService.getProfile(userInfo);
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

            return await profileService.updateProfile(input, userInfo);
        },

        getS3SignedUrl: async (
            _: any,
            { fileType }: { fileType: string },
            { userInfo }: CustomContext,
        ) => {
            if (!userInfo) {
                throw new gqlError('You are not authorized', 'UNAUTHORIZED');
            }

            return await profileService.getS3SignedUrl(fileType, userInfo);
        },
    },
};
