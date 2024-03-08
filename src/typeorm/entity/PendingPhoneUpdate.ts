import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class PendingPhoneUpdate {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  phoneNumber: string

  @Column()
  verificationId: string

  @CreateDateColumn()
  createdAt: Date

  @OneToOne(() => User)
  @JoinColumn()
  user: User
}