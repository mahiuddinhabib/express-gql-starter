import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
} from 'typeorm';
import { CommonEntity } from './CommonEntity';
import { User } from './User';
import { Book } from './Book';

@Entity()
export class ReadingList extends CommonEntity {
    @Column()
    title: string;

    @ManyToOne(() => User, user => user.readingLists)
    user: User;

    @ManyToMany(() => Book, book => book.readingLists, {
        eager: true,
    })
    @JoinTable()
    books: Book[];

    constructor(partial: Partial<ReadingList>) {
        super();
        Object.assign(this, partial);
    }
}
