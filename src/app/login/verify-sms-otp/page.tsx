'use client'

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function VerifyLogin() {
  const [otp, setOtp] = useState('')
  const [failed, setFailed] = useState(false)
  const router = useRouter()

  const verify = async () => {
    const res = await fetch('/api/login/verify-sms-otp', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        otp
      }),
    })
    if(res.status === 200) {
      // go to account page
      router.push('/account')
    } else {
      setFailed(true)
    }
  }

  return (
    <div className="grow flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-6">Enter Your One Time Password</h1>
        <form>
          <div className="mb-4">
            <div>We&apos;ve sent a one time code to your phone. Enter it below.</div>
            <input
              type="text"
              id="email"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>
          {
            failed && <div className='text-red-600'>
              Invalid Code
            </div>
          }
          <button
            type="button"
            onClick={verify}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-500"
          >
            Verify
          </button>
        </form>
      </div>
    </div>
  )
}