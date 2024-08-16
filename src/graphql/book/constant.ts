import { IBookFilter } from './interface';

export const bookSearchableFields = ['title', 'author'];

export const bookFilterableFields: Array<keyof IBookFilter> = [
    'author',
    'publishedDate',
];
