import { GraphQLError } from 'graphql';

class gqlError extends GraphQLError {
    constructor(message: string, code: string) {
        super(message, {
            extensions: {
                code,
            },
        });
    }
}

export default gqlError;

// export const throwGraphQLError = (message: string, code: string): never => {
//     throw new GraphQLError(message, {
//         extensions: {
//             code,
//         },
//     });
// };
