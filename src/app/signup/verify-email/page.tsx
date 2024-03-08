'use client'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const EmailValidation = () => {
  const [otp, setOtp] = useState('');
  const [failed, setFailed] = useState(false);
  const router = useRouter()

  const resend = async () => {
    await fetch('/api/register/resend-email-verification', {
      method: 'POST'
    })
  }

  const verify = async () => {
    const res = await fetch('/api/register/verify-email', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        otp
      })
    })
    if(res.status !== 200) {

      setFailed(true)
    } else {
      router.push('/signup/setup-phone-2fa') 
    }
  };

  return (
    <div className="grow flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-6">Verify Your Email</h1>
        <p className='mb-4'>We&apos;ve sent a verification code to your email. Please enter it below.</p>
        <form>
          <div className="mb-4">
            <input
              type="text"
              id="otp"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>
          <div className='flex flex-col lg:flex-row lg:space-x-2'>
          <button
            type="button"
            onClick={resend}
            className="grow basis-0 text-black py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring"
          >
            Resend Code
          </button>
          {
            failed && <div className='text-red-600 mb-4'>
              Invalid Code
            </div>
          }
          <button
            type="button"
            onClick={verify}
            className="grow basis-0 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-500"
          >
            Verify
          </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmailValidation;