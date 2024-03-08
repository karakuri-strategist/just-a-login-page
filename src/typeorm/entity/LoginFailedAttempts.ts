import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class LoginFailedAttempts {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  email: string

  @Column()
  attempts: number = 0

  @UpdateDateColumn()
  updatedAt: Date
}