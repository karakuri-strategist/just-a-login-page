import { hashSessionToken } from "@/session_tokens"
import { getDataSource } from "@/typeorm/data-source"
import { AuthToken } from "@/typeorm/entity/AuthToken"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function Account() {
  const cookieStore = cookies()
  const authToken = cookieStore.get('auth_token')
  if(!authToken) {
    return redirect('/login')
  }
  const dataSource = await getDataSource()
  const authRepository = dataSource.getRepository(AuthToken)
  const tokenHash = hashSessionToken(authToken.value)
  const auth = await authRepository.findOneBy({
    token: tokenHash
  })
  if(!auth) {
    return redirect('/login')
  }

  return     <div className="mx-auto max-w-screen-md py-12 px-4 lg:px-0">
      <h1 className="text-2xl mb-4">
        Welcome to your awesome account!
      </h1>
      <p>
        Well? Wasn&apos;t it all worth it? Aren&apos;t you happy you signed up, so you can see this page?
      </p>
  </div>
}