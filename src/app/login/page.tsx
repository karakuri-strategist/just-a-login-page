'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [failed, setFailed] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    // Implement your login logic here (e.g., API calls, validation, etc.)
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password
      }),
    })

    if(res.status === 200) {
      // do something
      await fetch('/api/login/send-sms-otp', {
        method: 'POST'
      })
      router.push('/login/verify-sms-otp')
      setFailed(false)
    } else {
      setFailed(true)
    }
  };

  return (
    <div className="grow flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-6">Log In</h1>
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
            failed && <div className='text-red-600 mb-4'>
              Login Failed
            </div>
          }
          <button
            type="button"
            onClick={handleLogin}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-500"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;