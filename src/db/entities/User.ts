import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    Entity,
    OneToMany,
    OneToOne,
} from 'typeorm';
import { USER_ROLE } from '../../enums/user';
import { CommonEntity } from './CommonEntity';
import { hashingHelper } from '../../helpers/hashingHelpers';
import { Profile } from './Profile';
import { ReadingList } from './ReadingList';

@Entity()
export class User extends CommonEntity {
    @Column({ unique: true })
    email: string;

    @Column({ select: false })
    password: string;

    @Column({
        type: 'enum',
        enum: USER_ROLE,
        default: USER_ROLE.USER,
    })
    role: USER_ROLE = USER_ROLE.USER;

    constructor(partial: Partial<User>) {
        super();
        Object.assign(this, partial);
    }

    @OneToOne(() => Profile, profile => profile.user, {
        cascade: ['insert', 'update'],
    })
    profile: Profile;

    @OneToMany(() => ReadingList, readingList => readingList.user, {
        eager: true,
    })
    readingLists: ReadingList[];

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (this.password) {
            this.password = await hashingHelper.encrypt_password(this.password);
        }
    }
}
