import { twilioClient } from "@/twilio_client";
import { getDataSource } from "@/typeorm/data-source";
import { PendingRegistration } from "@/typeorm/entity/PendingRegistration";
import { cookies } from "next/headers";


export async function POST() {
  const cookieStore = cookies()
  const pendingCookie = cookieStore.get('pending_registration_id')
  if(!pendingCookie) {
    return new Response('Unauthorized', {
      status: 403
    })
  }
  const dataSource = await getDataSource()
  const registrationRepository = dataSource.getRepository(PendingRegistration)
  const registration = await registrationRepository.findOneBy({
    id: pendingCookie.value
  })
  if(registration === null) {
    return new Response('Unauthorized', {
      status: 403
    })
  }

  const verification = await twilioClient.verify.v2.services(process.env.TWILIO_VERIFICATION_SERVICE_ID)
  .verifications
  .create({to: registration.email, channel: 'email'})

  registration.emailVerificationId = verification.sid
  registrationRepository.save(registration)

  return new Response('Success', {
    status: 200
  })
}