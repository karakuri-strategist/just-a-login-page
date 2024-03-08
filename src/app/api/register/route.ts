
import { twilioClient } from "@/twilio_client";
import { getDataSource } from "@/typeorm/data-source";
import { PendingRegistration } from "@/typeorm/entity/PendingRegistration";
import { User } from "@/typeorm/entity/User";
import * as argon from 'argon2';
import { cookies } from 'next/headers'
import validator from 'email-validator'

export async function POST(req: Request) {

  const body = await req.json();

  if(!validator.validate(body.email)) {
    return new Response('Invalid email', {status: 400})
  }

  const dataSource = await getDataSource()
  
  const userRepository = dataSource.getRepository(User)
  
  // check that there isn't a user in the database with that email already.
  const user = await userRepository.findOneBy({ email: body.email })
  if(user) {
    return new Response('A user with that email address already exists.', { status: 409 })
  }
  
  // Save the user information to the pending registration table
  const pendingRegistration = new PendingRegistration()
  pendingRegistration.email = body.email
  pendingRegistration.password = await argon.hash(body.password)
  pendingRegistration.phoneNumber = ''
  pendingRegistration.emailVerificationId = ''
  let savedRegistration = await dataSource.manager.save(pendingRegistration)

  // Send a verification email with twilio
  const verification = await twilioClient.verify.v2.services(process.env.TWILIO_VERIFICATION_SERVICE_ID)
  .verifications
  .create({to: body.email, channel: 'email'})
  
  // update with sid
  savedRegistration.emailVerificationId = verification.sid
  savedRegistration = await dataSource.manager.save(savedRegistration)

  const cookieStore = cookies()
  let expires = Date.now() + 1000 * 60 * 60 * 24

  cookieStore.set('pending_registration_id', savedRegistration.id, { 
    secure: true,
    expires
  })

  return new Response('Success', {
    status: 200,
  })

}

