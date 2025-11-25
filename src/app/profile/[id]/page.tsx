"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await axios.get("/api/me");
        if (response.data.user) {
          setUser(response.data.user);
        }
      } catch (err) {
        console.error(err);
      }
    }

    fetchProfile();
  }, []);

  const logout = async () => {
    const response = await axios.post("/api/logout");
    if (response.status === 200) router.push("/");
  };

  return (
    <div>
      <h3>Profile page</h3>
      {user && (
        <div>
          {user.username}
          <br />
          {user.email}
          <br />
          <button
            onClick={logout}
            className="p-2 rounded bg-white text-red-500"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
