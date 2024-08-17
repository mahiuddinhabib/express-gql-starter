import { JwtPayload } from 'jsonwebtoken';
import appDataSource from '../../db/dataSource';
import { Profile } from '../../db/entities/Profile';
import gqlError from '../../errors/throwGraphQLError';
import generateUploadURL from '../../utils/generateS3SignedUrl';
import config from '../../config';

const profileRepository = appDataSource.getRepository(Profile);

const getProfile = async (userInfo: JwtPayload) => {
    const result = await profileRepository.findOne({
        where: { user: { id: userInfo.id } },
    });

    if (!result) {
        throw new gqlError('Profile not found', 'NOT_FOUND');
    }

    return result;
};

const updateProfile = async (
    payload: Partial<Profile>,
    userInfo: JwtPayload,
) => {
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

    await profileRepository.update(profile.id, payload);

    return await profileRepository.findOne({
        where: {
            id: profile.id,
        },
    });
};

const getS3SignedUrl = async (fileType: string, userInfo: JwtPayload) => {
    const fileName = `${userInfo.id}`;
    const signedUrl = await generateUploadURL(fileName, fileType);

    return {
        url: `https://${config.aws.bucketName}.s3.amazonaws.com/${fileName}`,
        signedUrl: signedUrl,
    };
};

export const profileService = {
    getProfile,
    updateProfile,
    getS3SignedUrl,
};
