import { ApolloServer, BaseContext } from '@apollo/server';
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import { Book } from './book';
import { formatError } from '../errors/errorFormatter';
import { User } from './user';
import { Profile } from './profile';
import { Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { ReadingList } from './readingList';

const typeDefs = mergeTypeDefs([
    `#graphql
    enum UserRole {
        librarian
        user
    }

    input rangeInput {
        gte: String
        lte: String
    }
    `,
    User.typeDef,
    Profile.typeDef,
    Book.typeDef,
    ReadingList.typeDef,
]);

const resolvers = mergeResolvers([
    User.resolver,
    Profile.resolver,
    Book.resolver,
    ReadingList.resolver,
]);

export interface CustomContext {
    req: Request;
    res: Response;
    userInfo: JwtPayload | null;
}

const apolloServer = new ApolloServer<CustomContext>({
    typeDefs,
    resolvers,
    status400ForVariableCoercionErrors: true,
    formatError,
});

export default apolloServer;
