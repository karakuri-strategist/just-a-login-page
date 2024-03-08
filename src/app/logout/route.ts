import { hashSessionToken } from "@/session_tokens";
import { getDataSource } from "@/typeorm/data-source";
import { AuthToken } from "@/typeorm/entity/AuthToken";
import { cookies } from "next/headers";

export async function POST(req: Request, res: Response) {
  const dataSource = await getDataSource()
  const cookieStore = cookies()
  const authToken = cookieStore.get('auth_token')
  if(authToken) {
    const tokenHash = hashSessionToken(authToken.value)
    const authRepository = dataSource.getRepository(AuthToken)
    await authRepository.delete({
      token: tokenHash
    })
  }
  cookieStore.delete('auth_token')
  return new Response('Logout Successful')
}