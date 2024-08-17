import { CustomContext } from '..';
import appDataSource from '../../db/dataSource';
import { Book } from '../../db/entities/Book';
import { ReadingList } from '../../db/entities/ReadingList';
import { User } from '../../db/entities/User';
import { USER_ROLE } from '../../enums/user';
import gqlError from '../../errors/throwGraphQLError';
import { readingListService } from './service';

const readingListRepo = appDataSource.getRepository(ReadingList);
const userRepo = appDataSource.getRepository(User);
const bookRepo = appDataSource.getRepository(Book);

export const ReadingListResolver = {
    Query: {
        readingList: async (
            _: any,
            { id }: { id: string },
            { userInfo }: CustomContext,
        ) => {
            if (!userInfo) {
                throw new gqlError('You are not authorized', 'UNAUTHORIZED');
            }

            return await readingListService.getReadingList(id);
        },

        readingLists: async (_: any, __: any, { userInfo }: CustomContext) => {
            if (!userInfo) {
                throw new gqlError('Unauthorized', 'UNAUTHORIZED');
            }

            return await readingListService.getAllREadingLists(userInfo);
        },
    },
    Mutation: {
        createReadingList: async (
            _: any,
            { title }: { title: string },
            { userInfo }: CustomContext,
        ) => {
            if (!userInfo) {
                throw new gqlError('You are not authorized', 'UNAUTHORIZED');
            }

            return await readingListService.createReadingList(title, userInfo);
        },

        updateReadingList: async (
            _: any,
            { id, title }: { id: string; title: string },
            { userInfo }: CustomContext,
        ) => {
            if (!userInfo) {
                throw new gqlError('Unauthorized', 'UNAUTHORIZED');
            }

            return await readingListService.updateReadingList(
                id,
                title,
                userInfo,
            );
        },

        deleteReadingList: async (
            _: any,
            { id }: { id: string },
            { userInfo }: CustomContext,
        ) => {
            if (!userInfo) {
                throw new gqlError('Unauthorized', 'UNAUTHORIZED');
            }

            return await readingListService.deleteReadingList(id, userInfo);
        },

        addBookToReadingList: async (
            _: any,
            {
                readingListId,
                bookId,
            }: { readingListId: string; bookId: string },
            { userInfo }: CustomContext,
        ) => {
            if (!userInfo) {
                throw new gqlError('You are not authorized', 'UNAUTHORIZED');
            }

            return await readingListService.addBookToReadingList(
                readingListId,
                bookId,
                userInfo,
            );
        },

        removeBookFromReadingList: async (
            _: any,
            {
                readingListId,
                bookId,
            }: { readingListId: string; bookId: string },
            { userInfo }: CustomContext,
        ) => {
            if (!userInfo) {
                throw new gqlError('You are not authorized', 'UNAUTHORIZED');
            }

            return await readingListService.removeBookFromReadingList(
                readingListId,
                bookId,
                userInfo,
            );
        },
    },
};
