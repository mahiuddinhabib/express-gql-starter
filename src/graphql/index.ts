import { ApolloServer } from '@apollo/server';
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import { User } from './user';
import { Book } from './book';

const typeDefs = mergeTypeDefs([User.typeDef, Book.typeDef]);
const resolvers = mergeResolvers([User.resolver, Book.resolver]);

const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
});

export default apolloServer;
