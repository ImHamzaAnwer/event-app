"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerifyEmail() {
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const params = useSearchParams();

  const router = useRouter();
  const tokenFromParam = params?.get("token");

  const verifyEmail = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/verifyEmail", {
        token: tokenFromParam,
      });
      console.log(response);
      router.push("/");
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {tokenFromParam}
      <button
        type="button"
        className="w-max mx-auto bg-white text-black rounded-md p-3"
        onClick={verifyEmail}
      >
        {loading ? "verifying...." : "Verify your email"}
      </button>
    </div>
  );
}
