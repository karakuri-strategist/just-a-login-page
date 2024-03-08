"use client";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function NavBar2() {
  const [mounted, setMounted] = useState(false);
  const [cookie, setCookie] = useState(Cookies.get("auth_token"));
  const router = useRouter();
  useEffect(() => {
    setMounted(true);
    window.setInterval(function () {
      setCookie(Cookies.get("auth_token"));
    }, 100);
  }, []);

  if (!mounted) return <></>;

  const onLogout = async () => {
    await fetch("/logout", {
      method: "POST",
    });
    setCookie(Cookies.get("auth_token"));
    router.push("/login");
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="flex justify-between items-center">
        <a href="/" className="text-white font-bold text-xl">
          Just a Login Page
        </a>
        <div>
          {!cookie ? (
            <>
              <a href="/login">
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md mr-2">
                  Log In
                </button>
              </a>
              <a href="/signup">
                <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md">
                  Sign Up
                </button>
              </a>
            </>
          ) : (
            <button
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
              onClick={onLogout}
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
