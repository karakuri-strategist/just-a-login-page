import { hashSessionToken } from "@/session_tokens"
import { twilioClient } from "@/twilio_client"
import { getDataSource } from "@/typeorm/data-source"
import { AuthToken } from "@/typeorm/entity/AuthToken"
import { PendingPhoneUpdate } from "@/typeorm/entity/PendingPhoneUpdate"
import { User } from "@/typeorm/entity/User"
import { cookies } from "next/headers"

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
  const updateRepository = dataSource.getRepository(PendingPhoneUpdate)
  const update = await updateRepository.findOneBy({
    user: authToken.user
  })

  console.log(update.phoneNumber)

  let verification = await twilioClient.verify.v2.services(process.env.TWILIO_VERIFICATION_SERVICE_ID)
    .verificationChecks.create({ to: update.phoneNumber, code: body.otp })

  if(
    verification.status !== 'approved' 
    || update.verificationId !== verification.sid
    ) {
      return new Response('Operation failed', {
        status: 409
      })
    }

    await dataSource
    .createQueryBuilder()
    .update(User)
    .set({ phoneNumber: update.phoneNumber, twoFactorEnabled: true })
    .where("id = :id", { id: authToken.user.id })
    .execute()

    await updateRepository.delete({
      id: update.id
    })

    return new Response('Update Successful')
}