import type { DefaultSession } from "next-auth";
import type { Role } from "./user";

declare module "next-auth" {
  interface User {
    role: Role;
    departmentId: string | null;
    tokenVersion: number;
    accessToken: string;
    refreshToken: string;
  }

  interface Session {
    user: {
      id: string;
      role: Role;
      departmentId: string | null;
      tokenVersion: number;
      accessToken: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
    departmentId: string | null;
    tokenVersion: number;
    accessToken: string;
    refreshToken: string;
  }
}