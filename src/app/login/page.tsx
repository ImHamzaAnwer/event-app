"use client";
import AuthLayout from "@/components/AuthLayout";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const [user, setUser] = useState({ email: "", password: "" });
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (user.email.length > 0 && user.password.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  const onSignin = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/login", user);
      console.log(response);
      router.push("/");
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AuthLayout>
        <div>
          <Image
            height={40}
            width={40}
            alt="Your Company"
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=red&shade=800"
            className="h-10 w-auto dark:hidden"
          />
          <Image
            height={40}
            width={40}
            alt="Your Company"
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
            className="hidden h-10 w-auto dark:block"
          />
          <h2 className="mt-8 text-2xl/9 font-bold tracking-tight text-[#6f1d1b]">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm/6 text-gray-500 dark:text-gray-400">
            Not a member?{" "}
            <Link
              href="/signup"
              className="font-semibold text-[#6f1d1b]/80 hover:text-[#6f1d1b]/70"
            >
              Signup here
            </Link>
          </p>
        </div>

        <div className="space-y-6 mt-10">
          <div>
            <label
              htmlFor="email"
              className="block text-sm/6 font-medium text-gray-900 dark:text-gray-100"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:-outline-offset-2 focus:outline-[#6f1d1b] sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm/6 font-medium text-gray-900 dark:text-gray-100"
            >
              Password
            </label>
            <div className="mt-2">
              <input
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:-outline-offset-2 focus:outline-[#6f1d1b] sm:text-sm/6"
              />
            </div>
          </div>

          <div className="text-sm/6">
            <a
              href="#"
              className="font-semibold text-[#6f1d1b] hover:text-[#6f1d1b]/80"
            >
              Forgot password?
            </a>
          </div>

          <button
            disabled={buttonDisabled}
            onClick={onSignin}
            type="button"
            className="disabled:bg-gray-200 disabled:text-gray-600 disabled:cursor-not-allowed cursor-pointer flex w-full justify-center rounded-md bg-[#6f1d1b] px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-[#6f1d1b]/90 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#6f1d1b]/80"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </div>
      </AuthLayout>
    </>
  );
}
