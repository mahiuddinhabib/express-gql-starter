import appDataSource from '../../db/dataSource';
import { Book } from '../../db/entities/Book';
import gqlError from '../../errors/throwGraphQLError';
import { bookFilterableFields, bookSearchableFields } from './constant';
import { IBookFilter } from './interface';

const bookRepository = appDataSource.getRepository(Book);

const getSingleBook = async (id: string) => {
    const book = await bookRepository.findOneBy({ id });

    if (!book) {
        throw new gqlError('Book not found', 'NOT_FOUND');
    }

    return book;
};

const getAllBooks = async (
    page: number,
    limit: number,
    sortBy: string,
    sortOrder: 'ASC' | 'DESC',
    search?: string,
    filter?: IBookFilter,
) => {
    const query = bookRepository.createQueryBuilder('book');

    // Searching
    if (search) {
        bookSearchableFields.forEach((field, index) => {
            if (index === 0) {
                query.where(`book.${field} ILIKE :search`, {
                    search: `%${search}%`,
                });
            } else {
                query.orWhere(`book.${field} ILIKE :search`, {
                    search: `%${search}%`,
                });
            }
        });
    }

    // Filtering
    if (filter) {
        bookFilterableFields.forEach(field => {
            if (filter[field]) {
                if (field === 'publishedDate') {
                    const { gte, lte } = filter[field];
                    if (gte && lte) {
                        query.andWhere(
                            `book.publishedDate BETWEEN :gte AND :lte`,
                            { gte, lte },
                        );
                    } else if (gte) {
                        query.andWhere(`book.publishedDate >= :gte`, {
                            gte,
                        });
                    } else if (lte) {
                        query.andWhere(`book.publishedDate <= :lte`, {
                            lte,
                        });
                    }
                } else {
                    query.andWhere(`book.${field} = :${field}`, {
                        [field]: filter[field],
                    });
                }
            }
        });
    }

    query
        .orderBy(`book.${sortBy}`, sortOrder)
        .skip((page - 1) * limit)
        .take(limit);

    const [books, total] = await query.getManyAndCount();

    return {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        books,
    };
};

const createBook = async (input: {
    title: string;
    author: string;
    publishedDate: Date;
}) => {
    const createdBook = await bookRepository.save(new Book(input));

    return createdBook;
};

const updateBook = async (id: string, input: Partial<Book>) => {
    const book = await bookRepository.findOneBy({ id });

    if (!book) {
        throw new gqlError('Book not found', 'NOT_FOUND');
    }

    await bookRepository.update(id, input);

    return await bookRepository.findOneBy({ id });
};

const deleteBook = async (id: string) => {
    const book = await bookRepository.findOneBy({ id });

    if (!book) {
        throw new gqlError('Book not found', 'NOT_FOUND');
    }

    await bookRepository.delete(id);

    return book;
}

export const bookService = {
    getSingleBook,
    getAllBooks,
    createBook,
    updateBook,
    deleteBook,
};
