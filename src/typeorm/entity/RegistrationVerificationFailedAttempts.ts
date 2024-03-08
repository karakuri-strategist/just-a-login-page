import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class RegistrationVerificationFailedAttempts {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  email: string

  @Column()
  attempts: number = 0

  @UpdateDateColumn()
  updatedAt: Date
}