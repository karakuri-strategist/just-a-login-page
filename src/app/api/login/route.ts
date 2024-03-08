import { createSessionToken, hashSessionToken } from "@/session_tokens"
import { getDataSource } from "@/typeorm/data-source"
import { AuthToken } from "@/typeorm/entity/AuthToken"
import { LoginToken } from "@/typeorm/entity/LoginToken"
import { User } from "@/typeorm/entity/User"
import * as argon from 'argon2'
import { cookies } from "next/headers"

export async function POST(req: Request) {
  const body =  await req.json()
  const dataSource = await getDataSource()
  const userRepository = dataSource.getRepository(User)
  const user = await userRepository.findOneBy({
    email: body.email
  })
  if(!user) {
    return new Response('Login Failed', {
      status: 403
    })
  }
  const valid = await argon.verify(user.password, body.password)

  if(!valid) {
    return new Response('Login Failed', {
      status: 403
    })  
  }

  const cookieStore = cookies()

  if(user.twoFactorEnabled) {
    console.log('ENABLED')
    const token = createSessionToken()
    let loginToken = new LoginToken()
    loginToken.token = hashSessionToken(token)
    loginToken.user = user
    const loginTokenRepository = dataSource.getRepository(LoginToken)
    loginToken = await loginTokenRepository.save(loginToken)
    cookieStore.set('login_token', token)
    
    return new Response('Credentials Validated', {status:200})
  }
  console.log('DISABLED')
  const token = createSessionToken()
  let authToken = new AuthToken()
  authToken.token = hashSessionToken(token)
  authToken.user = user
  const loginTokenRepository = dataSource.getRepository(AuthToken)
  authToken = await loginTokenRepository.save(authToken)
  cookieStore.set('auth_token', token)

  return new Response('Login Successful', {status:200})
}