import { GraphQLFormattedError } from 'graphql';
import { ApolloServerErrorCode } from '@apollo/server/errors';
import config from '../config';

export const formatError = (
    formattedError: GraphQLFormattedError,
    error: unknown,
): GraphQLFormattedError => {
    // Log the error
    // console.error(error);

    const isDevelopment = config.env === 'development';

    return {
        message: formattedError.message,
        extensions: {
            code:
                formattedError.extensions?.code ||
                ApolloServerErrorCode.INTERNAL_SERVER_ERROR,
            ...(isDevelopment && {
                details: formattedError.extensions?.stacktrace || [],
            }),
        },
    };
};
