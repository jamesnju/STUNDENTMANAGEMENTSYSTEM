import axios from "axios";
import { getSession, signOut } from "next-auth/react";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1",
  headers: { "Content-Type": "application/json" },
});

// Module-level cache: holds the in-flight session promise
let sessionPromise: Promise<any> | null = null;

async function getCachedSession() {
  if (!sessionPromise) {
    sessionPromise = getSession();
    // Clear cache after 5s so subsequent calls get a fresh token
    setTimeout(() => {
      sessionPromise = null;
    }, 5000);
  }
  return sessionPromise;
}

api.interceptors.request.use(
  async (config) => {
    const session = await getCachedSession();
    if (session?.user?.accessToken) {
      config.headers.Authorization = `Bearer ${session.user.accessToken}`;
    } else {
      console.warn("⚠️ No access token available for:", config.url);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        signOut({ callbackUrl: "/login?reason=expired" });
      }
    }
    return Promise.reject(error);
  }
);