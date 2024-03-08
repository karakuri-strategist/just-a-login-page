import { randomBytes, createHash } from 'crypto'

export function createSessionToken() {
  return randomBytes(16).toString('hex')
}

export function hashSessionToken(token: string) {
  return createHash('sha256').update(token).digest('base64')
}