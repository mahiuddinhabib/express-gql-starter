import { ApolloServer, BaseContext } from '@apollo/server';
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import { User } from './user';
import { Book } from './book';

const typeDefs = mergeTypeDefs([User.typeDef, Book.typeDef]);
const resolvers = mergeResolvers([User.resolver, Book.resolver]);

// interface CustomContext {
//     token: string;
// }

const apolloServer = new ApolloServer<BaseContext>({
    typeDefs,
    resolvers,
    status400ForVariableCoercionErrors: true,
});

export default apolloServer;
