import { Column, Entity, ManyToMany } from 'typeorm';
import { CommonEntity } from './CommonEntity';
import { ReadingList } from './ReadingList';

@Entity()
export class Book extends CommonEntity {
    @Column()
    title: string;

    @Column()
    author: string;

    @Column()
    publishedDate: Date;

    @ManyToMany(() => ReadingList, readingList => readingList.books)
    readingLists: ReadingList[];

    constructor(partial: Partial<Book>) {
        super();
        Object.assign(this, partial);
    }
}
