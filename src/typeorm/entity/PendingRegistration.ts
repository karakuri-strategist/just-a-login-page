import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm"

@Entity()
export class PendingRegistration {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({ unique: true })
    email: string

    @Column()
    phoneNumber: string

    @Column({length: 97})
    password: string

    @Column()
    emailVerificationId: string

    @CreateDateColumn()
    createdOn: Date;
}