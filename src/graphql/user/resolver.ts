import { GraphQLError } from 'graphql';
import appDataSource from '../../db/dataSource';
import { User } from '../../db/entities/User';
import { throwGraphQLError } from '../../errors/throwGraphQLError';

const userRepository = appDataSource.getRepository(User);

export const UserResolver = {
    Query: {
        users: async () => {
            return await userRepository.find();
        },
        user: async (_: any, { id }: any) => {
            return await userRepository.findOneBy({ id });
        },
    },
    Mutation: {
        createUser: async (_: any, { input }: any) => {
            const user = new User(input);
            const createdUser = await userRepository.save(user);

            if (!createdUser) {
                throw new Error('User not created');
            }

            return await userRepository.findOneBy({ id: createdUser.id });
        },
        updateUser: async (_: any, { id, input }: any) => {
            const user = await userRepository.findOneBy({ id });

            if (!user) {
                throwGraphQLError('User not found', 'USER_NOT_FOUND');
            }

            await userRepository.update({ id }, input);

            return await userRepository.findOneBy({ id });
        },
        deleteUser: async (_: any, { id }: any) => {
            const user = await userRepository.findOneBy({ id });

            if (!user) {
                throw new Error('User not found');
            }

            await userRepository.delete({ id });

            return user;
        },
    },
};
