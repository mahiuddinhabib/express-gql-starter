import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { CommonEntity } from './CommonEntity';
import { User } from './User';

@Entity()
export class Profile extends CommonEntity {
    @Column()
    fullName: string;

    @Column({
        nullable: true,
    })
    phoneNumber: string;

    @Column({
        nullable: true,
    })
    address: string;

    @Column({
        nullable: true,
    })
    profilePhoto: string;

    @OneToOne(() => User, user => user.profile,{
        eager: true,
        cascade: ['insert', 'update'],
    })
    @JoinColumn()
    user: User;

    constructor(partial: Partial<Profile>) {
        super();
        Object.assign(this, partial);
    }
}
