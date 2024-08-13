import { GraphQLError } from 'graphql';

export const throwGraphQLError = (message: string, code: string): never => {
    throw new GraphQLError(message, {
        extensions: {
            code,
        },
    });
};
