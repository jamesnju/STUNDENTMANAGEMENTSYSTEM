import axios from "axios";
import { getSession, signOut } from "next-auth/react";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session?.user?.accessToken) {
    config.headers.Authorization = `Bearer ${session.user.accessToken}`;
  }
  return config;
});

// Add a response interceptor to catch 401s
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the token is invalid or expired, force logout
    if (error.response?.status === 401) {
      // Check if we are in the browser before redirecting
      if (typeof window !== "undefined") {
        // Optionally trigger a custom event so your InactivityProvider can show the modal
        // For now, we just hard-redirect to login with a reason
        signOut({ callbackUrl: "/login?reason=expired" });
      }
    }
    return Promise.reject(error);
  }
);

// import axios from "axios";
// import { getSession } from "next-auth/react";

// export const api = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1",
//   headers: { "Content-Type": "application/json" },
// });

// api.interceptors.request.use(async (config) => {
//   const session = await getSession();
//   if (session?.user?.accessToken) {
//     config.headers.Authorization = `Bearer ${session.user.accessToken}`;
//   }
//   return config;
// });