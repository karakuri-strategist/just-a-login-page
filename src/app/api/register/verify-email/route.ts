
import { cookies } from "next/headers";
import { getDataSource } from "@/typeorm/data-source";
import { PendingRegistration } from "@/typeorm/entity/PendingRegistration";
import { twilioClient } from "@/twilio_client";
import { User } from "@/typeorm/entity/User";
import { AuthToken } from "@/typeorm/entity/AuthToken";
import { createSessionToken, hashSessionToken } from "@/session_tokens";
import { RegistrationVerificationFailedAttempts } from "@/typeorm/entity/RegistrationVerificationFailedAttempts";
import { VerificationCheckInstance } from "twilio/lib/rest/verify/v2/service/verificationCheck";

export async function POST(req: Request) {
  const body = await req.json()
  const dataSource = await getDataSource()


  const registrationRepository = dataSource.getRepository(PendingRegistration)
  const cookieStore = cookies()
  const pendingCookie = cookieStore.get('pending_registration_id')
  if(!pendingCookie) {
    return new Response('Unauthorized', {
      status: 403
    })
  }
  const registration = await registrationRepository.findOneBy({
    id: pendingCookie.value
  })

  if(registration === null) {
    return new Response('Unauthorized', {
      status: 403
    })
  }

  const attemptsRepository = dataSource.getRepository(RegistrationVerificationFailedAttempts)
  let failedAttempts = await attemptsRepository.findOneBy({
    email: registration.email
  })

  if(failedAttempts === null) {
    failedAttempts = new RegistrationVerificationFailedAttempts()
    failedAttempts.email = registration.email
    failedAttempts = await attemptsRepository.save(failedAttempts)
  }

  if(failedAttempts.attempts >= 5) {
    if(Date.now() - failedAttempts.updatedAt.getTime() < 1000 * 60 * 15) {
      return new Response('Operation Failed', {
        status: 403
      })
    } else {
      failedAttempts.attempts = 0
      failedAttempts = await attemptsRepository.save(failedAttempts)
    }
  }

  let verification: VerificationCheckInstance;

  try {
    verification = await twilioClient.verify.v2.services(process.env.TWILIO_VERIFICATION_SERVICE_ID)
    .verificationChecks.create({ to: registration.email, code: body.otp })
  } catch(error) {
    return new Response(error, {
      status: 429
    })
  }

  if(verification.status !== 'approved' || verification.sid !== registration.emailVerificationId) {
    failedAttempts.attempts += 1
    attemptsRepository.save(failedAttempts)

    return new Response('Operation failed', {
      status: 409
    })
  }

  const userRepository = dataSource.getRepository(User)
  let user = new User()
  user.password = registration.password
  user.email = registration.email
  user = await userRepository.save(user)

  registrationRepository.delete({ id: registration.id })

  const authRepository = dataSource.getRepository(AuthToken)
  let token = createSessionToken()
  let authToken = new AuthToken()
  authToken.token = hashSessionToken(token)
  authToken.user = user

  authRepository.save(authToken)

  cookieStore.set('auth_token', token)

  return new Response('Account Created', {status: 200})
}