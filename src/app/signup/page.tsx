'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const SignupPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [failed, setFailed] = useState(false)
  const [failedMessage, setFailedMessage] = useState('')
  const router = useRouter()

  const handleSignup = async () => {
    // Implement your signup logic here (e.g., API calls, validation, etc.)
    let emailAttempt = email
    let passwordAttempt = password
    setEmail('')
    setPassword('')
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: emailAttempt,
        password: passwordAttempt
      })
    })
    if(res.status === 200) {
      router.push('/signup/verify-email')
    }
    if(res.status === 409) {
      setFailed(true)
      setFailedMessage('Email already in use')
    }
    if(res.status === 400) {
      setFailed(true)
      setFailedMessage('Invalid email')
    }
  };

  return (
    <div className="grow flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-6">Sign Up</h1>
        <form>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-medium">
              Email:
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 font-medium">
              Password:
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {
            failed && <div className='text-red-600 mb-4'>{failedMessage}</div>
          }
          <button
            type="button"
            onClick={handleSignup}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-500"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage