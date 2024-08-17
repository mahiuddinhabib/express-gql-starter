import { CustomContext } from '..';
import { Book } from '../../db/entities/Book';
import { USER_ROLE } from '../../enums/user';
import gqlError from '../../errors/throwGraphQLError';
import { IBookFilter } from './interface';
import { bookService } from './service';

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
            return await bookService.getSingleBook(id);
        },

        books: async (
            _: any,
            {
                page = 1,
                limit = 10,
                sortBy = 'title',
                sortOrder = 'ASC',
                search,
                filter,
            }: {
                page: number;
                limit: number;
                sortBy: string;
                sortOrder: 'ASC' | 'DESC';
                search?: string;
                filter?: IBookFilter;
            },
        ) => {
            return await bookService.getAllBooks(
                page,
                limit,
                sortBy,
                sortOrder,
                search,
                filter,
            );
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

            return await bookService.createBook(input);
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

            return await bookService.updateBook(id, input);
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

            return await bookService.deleteBook(id);
        },
    },
};
