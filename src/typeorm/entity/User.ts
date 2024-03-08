import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class User {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({ unique: true })
    email: string

    @Column({ nullable: true })
    phoneNumber?: string

    @Column({length: 97})
    password: string

    @Column()
    twoFactorEnabled: boolean = false

    @Column({ length: 32, nullable: true })
    toptKey?: string

}
