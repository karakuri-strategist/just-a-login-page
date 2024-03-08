import { hashSessionToken } from "@/session_tokens";
import { twilioClient } from "@/twilio_client";
import { getDataSource } from "@/typeorm/data-source";
import { AuthToken } from "@/typeorm/entity/AuthToken";
import { PendingPhoneUpdate } from "@/typeorm/entity/PendingPhoneUpdate";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const cookieStore = cookies()
  const dataSource = await getDataSource()
  const authTokenRepository = dataSource.getRepository(AuthToken)
  const authCookie = cookieStore.get('auth_token')
  if(!authCookie) {
    return new Response('Not authorized', {
      status: 403
    })
  }
  const hashedToken = hashSessionToken(authCookie.value)
  const authToken = await authTokenRepository.findOneBy({
    token: hashedToken
  })
  if(!authToken) {
    return new Response('Not authorized', {
      status: 403
    })
  }
  const body = await req.json()

  const verification = await twilioClient.verify.v2.services(process.env.TWILIO_VERIFICATION_SERVICE_ID)
  .verifications
  .create({to: body.phoneNumber, channel: 'sms'})

  const updateRepository = dataSource.getRepository(PendingPhoneUpdate)
  const phoneUpdate = new PendingPhoneUpdate()
  phoneUpdate.user = authToken.user
  phoneUpdate.phoneNumber = body.phoneNumber
  phoneUpdate.verificationId = verification.sid

  updateRepository.save(phoneUpdate)

  return new Response('Verification Code Sent')
}