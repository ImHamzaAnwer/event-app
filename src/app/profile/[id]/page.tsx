"use client";

import axios from "axios";
import { useEffect, useState } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function Profile() {
  const [user, setUser] = useState<any>(null);

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

  return (
    <div>
      <h3>Profile page</h3>
      {user && (
        <div>
          {user.username}
          <br />
          {user.email}
        </div>
      )}
    </div>
  );
}
