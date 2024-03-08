import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import { LoginToken } from "./entity/LoginToken"
import { AuthToken } from "./entity/AuthToken"
import { PendingRegistration } from "./entity/PendingRegistration"
import { LoginFailedAttempts } from "./entity/LoginFailedAttempts"
import { RegistrationVerificationFailedAttempts } from "./entity/RegistrationVerificationFailedAttempts"
import { PendingPhoneUpdate } from "./entity/PendingPhoneUpdate"
import { SmsVerification } from "./entity/SmsVerification"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: 5432,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "postgres",
    synchronize: true,
    logging: false,
    entities: [User, LoginToken, AuthToken, PendingRegistration, LoginFailedAttempts, RegistrationVerificationFailedAttempts, PendingPhoneUpdate, SmsVerification],
    migrations: [],
    subscribers: [],
})

let initialized = false;

 export async function getDataSource() {
    if(initialized) return AppDataSource;
    try {
        await AppDataSource.initialize()
        initialized = true
        return AppDataSource
    } catch(e) {
        console.log(e)
    }
}