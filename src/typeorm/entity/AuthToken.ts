import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm"
import { User } from "./User"

@Entity()
export class AuthToken {

    @PrimaryGeneratedColumn()
    id: number

    @Column({length: 97})
    token: string

    @CreateDateColumn()
    createdOn: Date

    @Column()
    userId: string

    @ManyToOne(() => User, {eager: true})
    user: User

  }