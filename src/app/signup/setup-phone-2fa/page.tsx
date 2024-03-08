"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const LoginPage = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [sendSuccess, setSendSuccess] = useState(false);
  const [failMessage, setFailMessage] = useState(null);
  const router = useRouter();

  const submit = async () => {
    const res = await fetch("/api/account/update-phone", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phoneNumber: `+${phone}`,
      }),
    });
    if (res.status === 200) {
      setSendSuccess(true);
      setFailMessage(null);
    } else {
      setFailMessage("Failed to send");
    }
  };

  const verify = async () => {
    const res = await fetch("/api/account/verify-phone", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        otp
      }),
    });
    if(res.status === 200) {
      router.push('/account')
      console.log('success')
    } else {
      setFailMessage('Incorrect code')
    }
  };

  return (
    <div className="grow flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-6">
          Let&apos;s Setup Two Factor Authentication
        </h1>
        <form>
          {sendSuccess ? (
            <>
              <div className="mb-4">
                <div>We&apos;ve sent a one time verification code to your phone. Please enter below</div>
                <label
                  htmlFor="code"
                  className="block text-gray-700 font-medium mb-2"
                ></label>
                <input
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500 mb-4"
                  type="text"
                  id="code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                {
                  failMessage && <div className="text-red-600 mb-4">
                    {failMessage}
                  </div>
                }
                <div className="flex justify-stretch">
                  <button
                    type="button"
                    onClick={verify}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-500"
                  >
                    Verify
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="mb-4">
                <label
                  htmlFor="phone"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Phone Number:
                </label>
                <PhoneInput
                  inputProps={{ id: "phone" }}
                  country={"us"}
                  value={phone}
                  onChange={(p) => {
                    console.log(p);
                    setPhone(p);
                  }}
                />
              </div>
              {failMessage && (
                <div className="text-red-600 mb-4">{failMessage}</div>
              )}
              <button
                type="button"
                onClick={submit}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-500"
              >
                Send Code
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
