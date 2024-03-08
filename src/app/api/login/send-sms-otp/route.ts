import { hashSessionToken } from "@/session_tokens"
import { twilioClient } from "@/twilio_client"
import { getDataSource } from "@/typeorm/data-source"
import { LoginToken } from "@/typeorm/entity/LoginToken"
import { SmsVerification } from "@/typeorm/entity/SmsVerification"
import { cookies } from "next/headers"

export async function POST() {
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
  const verification = await twilioClient.verify.v2.services(process.env.TWILIO_VERIFICATION_SERVICE_ID)
  .verifications
  .create({to: loginToken.user.phoneNumber, channel: 'sms'})

  console.log('here!', JSON.stringify(loginToken))

  const verificationRepository = dataSource.getRepository(SmsVerification)

  let savedVerification = await verificationRepository.createQueryBuilder()
  .where('"loginTokenId" = :tokenId', { tokenId: loginToken.id })
  .getOne()

  console.log('json', JSON.stringify(savedVerification))
  
  if(!savedVerification) {
    savedVerification = new SmsVerification()
    savedVerification.loginToken = loginToken
    savedVerification.verificationId = verification.sid
    await verificationRepository.save(savedVerification)
  } else {
    await verificationRepository.save({
      id: savedVerification.id,
      verificationId: verification.sid
    })
  }

  return new Response('Verification Code Sent', {status: 200})
}