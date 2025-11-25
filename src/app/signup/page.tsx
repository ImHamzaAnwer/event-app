"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SignupPage() {
  const [user, setUser] = useState({ email: "", password: "", username: "" });
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (
      user.email.length > 0 &&
      user.password.length > 0 &&
      user.username.length > 0
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  const onSignup = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/signup", user);
      console.log(response);
      router.push("/login");
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-center">Signup</h3>
      <input
        className="p-2 border border-white"
        placeholder="username"
        value={user.username}
        onChange={(e) => setUser({ ...user, username: e.target.value })}
      />
      <input
        className="p-2 border border-white"
        placeholder="email"
        value={user.email}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
      />
      <input
        className="p-2 border border-white"
        placeholder="password"
        type="password"
        value={user.password}
        onChange={(e) => setUser({ ...user, password: e.target.value })}
      />

      <button
        type="button"
        disabled={buttonDisabled}
        onClick={onSignup}
        className="p-2 rounded bg-white text-black"
      >
        {loading ? "signin in..." : "Signup"}
      </button>

      <Link className="text-center" href={"/login"}>
        Login page
      </Link>
    </div>
  );
}
