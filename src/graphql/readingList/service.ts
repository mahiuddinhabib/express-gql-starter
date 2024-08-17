import { JwtPayload } from 'jsonwebtoken';
import appDataSource from '../../db/dataSource';
import { Book } from '../../db/entities/Book';
import { ReadingList } from '../../db/entities/ReadingList';
import { User } from '../../db/entities/User';
import { USER_ROLE } from '../../enums/user';
import gqlError from '../../errors/throwGraphQLError';

const readingListRepo = appDataSource.getRepository(ReadingList);
const userRepo = appDataSource.getRepository(User);
const bookRepo = appDataSource.getRepository(Book);

const getReadingList = async (id: string) => {
    const readingList = await readingListRepo.findOneBy({ id });

    if (!readingList) {
        throw new gqlError('Reading list not found', 'NOT_FOUND');
    }

    return readingList;
};

const getAllREadingLists = async (userInfo: JwtPayload) => {
    let readingLists: ReadingList[];

    if (userInfo.role === USER_ROLE.LIBRARIAN) {
        readingLists = await readingListRepo.find();
    } else {
        readingLists = await readingListRepo.find({
            where: { user: { id: userInfo.id } },
        });
    }

    return readingLists;
};

const createReadingList = async (title: string, userInfo: JwtPayload) => {
    const user = await userRepo.findOneBy({ id: userInfo.id });

    if (!user) {
        throw new gqlError('User not found', 'NOT_FOUND');
    }

    const readingList = new ReadingList({ title, user });

    await readingListRepo.save(readingList);

    return readingList;
}

const updateReadingList = async (id: string, title: string, userInfo: JwtPayload) => {
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
}

const deleteReadingList = async (id: string, userInfo: JwtPayload) => {
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
}

const addBookToReadingList = async (readingListId: string, bookId: string, userInfo: JwtPayload) => {
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
}

const removeBookFromReadingList = async (readingListId: string, bookId: string, userInfo: JwtPayload) => {
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

    readingList.books = readingList.books.filter(book => book.id !== bookId);

    await readingListRepo.save(readingList);

    return await readingListRepo.findOneBy({ id: readingListId });
}

export const readingListService = {
    getReadingList,
    getAllREadingLists,
    createReadingList,
    updateReadingList,
    deleteReadingList,
    addBookToReadingList,
    removeBookFromReadingList,
};
