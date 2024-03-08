import { createSessionToken, hashSessionToken } from "@/session_tokens"
import { twilioClient } from "@/twilio_client"
import { getDataSource } from "@/typeorm/data-source"
import { AuthToken } from "@/typeorm/entity/AuthToken"
import { LoginToken } from "@/typeorm/entity/LoginToken"
import { SmsVerification } from "@/typeorm/entity/SmsVerification"
import { cookies } from "next/headers"

export async function POST(req: Request) {
  const cookieStore = cookies()
  const dataSource = await getDataSource()
  const loginTokenRepository = dataSource.getRepository(LoginToken)
  const loginCookie = cookieStore.get('login_token')
  if(!loginCookie) {
    return new Response('Not authorized', {
      status: 403
    })
  }
  const hashedToken = hashSessionToken(loginCookie.value)
  const loginToken = await loginTokenRepository.findOneBy({
    token: hashedToken
  })
  if(!loginToken) {
    return new Response('Not authorized', {
      status: 403
    })
  }
  const body = await req.json()
  let verification = await twilioClient.verify.v2.services(process.env.TWILIO_VERIFICATION_SERVICE_ID)
  .verificationChecks.create({ to: loginToken.user.phoneNumber, code: body.otp })
  const verificationRepository = dataSource.getRepository(SmsVerification)
  let savedVerification = await verificationRepository.createQueryBuilder()
  .where('"loginTokenId" = :tokenId', { tokenId: loginToken.id })
  .getOne()
  if(
    verification.status !== 'approved'
    || verification.sid !== savedVerification.verificationId
  ) {
    return new Response("Invalid Verification Code", {
      status: 401
    })
  }

  const token = createSessionToken()
  let authToken = new AuthToken()
  authToken.token = hashSessionToken(token)
  authToken.user = loginToken.user
  const authTokenRepository = dataSource.getRepository(AuthToken)
  authToken = await authTokenRepository.save(authToken)

  await verificationRepository.createQueryBuilder()
  .where('"loginTokenId" = :tokenId', { tokenId: loginToken.id })
  .delete().execute()

  await loginTokenRepository.delete(loginToken.id)

  cookieStore.delete('login_token')
  cookieStore.set('auth_token', token)

  return new Response('Success', {status:200})
}