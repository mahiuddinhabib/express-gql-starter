import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import { USER_ROLE } from '../../enums/user';
import { CommonEntity } from './CommonEntity';
import { hashingHelper } from '../../helpers/hashingHelpers';

@Entity()
export class User extends CommonEntity {
    @Column()
    name: string;

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

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (this.password) {
            this.password = await hashingHelper.encrypt_password(this.password);
        }
    }

    async matchPassword(password: string): Promise<boolean> {
        return await hashingHelper.match_password(password, this.password);
    }
}
