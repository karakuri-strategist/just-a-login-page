import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { LoginToken } from "./LoginToken";

@Entity()
export class SmsVerification {
  
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  verificationId: string

  @UpdateDateColumn()
  updatedAt: Date

  @OneToOne(() => LoginToken, {eager: true})
  @JoinColumn()
  loginToken: LoginToken
}