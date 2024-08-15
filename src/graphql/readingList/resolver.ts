import { CustomContext } from '..';
import appDataSource from '../../db/dataSource';
import { Book } from '../../db/entities/Book';
import { ReadingList } from '../../db/entities/ReadingList';
import { User } from '../../db/entities/User';
import { USER_ROLE } from '../../enums/user';
import gqlError from '../../errors/throwGraphQLError';

const readingListRepo = appDataSource.getRepository(ReadingList);
const userRepo = appDataSource.getRepository(User);
const bookRepo = appDataSource.getRepository(Book);

export const ReadingListResolver = {
    Query: {
        readingList: async (_: any, { id }: { id: string }) => {
            const readingList = await readingListRepo.findOneBy({ id });

            if (!readingList) {
                throw new gqlError('Reading list not found', 'NOT_FOUND');
            }

            return readingList;
        },

        readingLists: async (_: any, __: any, { userInfo }: CustomContext) => {
            if (!userInfo) {
                throw new gqlError('Unauthorized', 'UNAUTHORIZED');
            }

            let readingLists: ReadingList[];

            if (userInfo.role === USER_ROLE.LIBRARIAN) {
                readingLists = await readingListRepo.find();
            } else {
                readingLists = await readingListRepo.find({
                    where: { user: { id: userInfo.id } },
                });
            }

            return readingLists;
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

            const user = await userRepo.findOneBy({ id: userInfo.id });

            if (!user) {
                throw new gqlError('User not found', 'NOT_FOUND');
            }

            const readingList = new ReadingList({ title, user });

            await readingListRepo.save(readingList);

            return readingList;
        },

        updateReadingList: async (
            _: any,
            { id, title }: { id: string; title: string },
            { userInfo }: CustomContext,
        ) => {
            if (!userInfo) {
                throw new gqlError('Unauthorized', 'UNAUTHORIZED');
            }

            const readingList = await readingListRepo.findOne({
                where: { id },
                relations: ['user'],
            });

            if (!readingList) {
                throw new gqlError('Reading list not found', 'NOT_FOUND');
            }

            if (readingList.user.id !== userInfo.id) {
                throw new gqlError(
                    'You are not authorized to update this reading list',
                    'FORBIDDEN',
                );
            }

            await readingListRepo.update(readingList.id, { title });

            return await readingListRepo.findOne({
                where: { id },
                relations: ['user'],
            });
        },

        deleteReadingList: async (
            _: any,
            { id }: { id: string },
            { userInfo }: CustomContext,
        ) => {
            if (!userInfo) {
                throw new gqlError('Unauthorized', 'UNAUTHORIZED');
            }

            const readingList = await readingListRepo.findOne({
                where: { id },
                relations: ['user'],
            });

            if (!readingList) {
                throw new gqlError('Reading list not found', 'NOT_FOUND');
            }

            if (readingList.user.id !== userInfo.id) {
                throw new gqlError(
                    'You are not authorized to delete this readingList',
                    'FORBIDDEN',
                );
            }

            await readingListRepo.delete(readingList.id);

            return readingList;
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

            const readingList = await readingListRepo.findOne({
                where: { id: readingListId },
                relations: ['user'],
            });

            if (!readingList) {
                throw new gqlError('Reading list not found', 'NOT_FOUND');
            }

            if (readingList.user.id !== userInfo.id) {
                throw new gqlError(
                    'You are not authorized to update this reading list',
                    'FORBIDDEN',
                );
            }

            const book = await bookRepo.findOneBy({ id: bookId });

            if (!book) {
                throw new gqlError('Book not found', 'NOT_FOUND');
            }

            readingList.books.push(book);

            await readingListRepo.save(readingList);

            return await readingListRepo.findOne({
                where: { id: readingListId },
                relations: ['user'],
            });
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

            const readingList = await readingListRepo.findOne({
                where: { id: readingListId },
                relations: ['user'],
            });

            if (!readingList) {
                throw new gqlError('Reading list not found', 'NOT_FOUND');
            }

            if (readingList.user.id !== userInfo.id) {
                throw new gqlError(
                    'You are not authorized to update this reading list',
                    'FORBIDDEN',
                );
            }

            readingList.books = readingList.books.filter(
                book => book.id !== bookId,
            );

            await readingListRepo.save(readingList);

            return await readingListRepo.findOneBy({ id: readingListId });
        },
    },
};
