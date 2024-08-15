import { CustomContext } from '..';
import appDataSource from '../../db/dataSource';
import { Book } from '../../db/entities/Book';
import { USER_ROLE } from '../../enums/user';
import gqlError from '../../errors/throwGraphQLError';

const bookRepository = appDataSource.getRepository(Book);

export const BookResolver = {
    Query: {
        book: async (
            _: any,
            {
                id,
            }: {
                id: string;
            },
        ) => {
            return await bookRepository.findOneBy({ id });
        },
        books: async () => {
            return await bookRepository.find();
        },
    },
    Mutation: {
        createBook: async (
            _: any,
            {
                input,
            }: {
                input: { title: string; author: string; publishedDate: Date };
            },
            { userInfo }: CustomContext,
        ) => {
            if (!userInfo || userInfo.role !== USER_ROLE.LIBRARIAN) {
                throw new gqlError(
                    'You are not authorized to perform this action',
                    'FORBIDDEN',
                );
            }

            console.log(input);

            const createdBook = await bookRepository.save(new Book(input));

            return createdBook;
        },
        updateBook: async (
            _: any,
            {
                id,
                input,
            }: {
                id: string;
                input: Partial<Book>;
            },
            { userInfo }: CustomContext,
        ) => {
            if (!userInfo || userInfo.role !== USER_ROLE.LIBRARIAN) {
                throw new gqlError(
                    'You are not authorized to perform this action',
                    'FORBIDDEN',
                );
            }

            const book = await bookRepository.findOneBy({ id });

            if (!book) {
                throw new gqlError('Book not found', 'NOT_FOUND');
            }

            await bookRepository.update(id, input);

            return await bookRepository.findOneBy({ id });
        },
        deleteBook: async (
            _: any,
            {
                id,
            }: {
                id: string;
            },
            { userInfo }: CustomContext,
        ) => {
            if (!userInfo || userInfo.role !== USER_ROLE.LIBRARIAN) {
                throw new gqlError(
                    'You are not authorized to perform this action',
                    'FORBIDDEN',
                );
            }

            const book = await bookRepository.findOneBy({ id });

            if (!book) {
                throw new gqlError('Book not found', 'NOT_FOUND');
            }

            await bookRepository.delete(id);

            return book;
        },
    },
};
