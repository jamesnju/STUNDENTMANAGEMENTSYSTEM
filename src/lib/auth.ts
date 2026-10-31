import NextAuth from "next-auth";
import type { User as NextAuthUser } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { Role } from "@/types/user";

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

/**
 * Expected successful response from:
 * POST /api/v1/auth/login
 */
interface LoginResponse {
  success: true;
  data: {
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      email: string;
      role: Role;
      departmentId: string | null;
    };
  };
}

/**
 * Validated login information extracted from the backend response.
 */
interface ParsedLogin {
  accessToken: string;
  refreshToken: string;
  id: string;
  email: string;
  role: Role;
  departmentId: string | null;
}

/* -------------------------------------------------------------------------- */
/*                                Role Validation                             */
/* -------------------------------------------------------------------------- */

const VALID_ROLES: readonly Role[] = [
  "ADMIN",
  "TEACHER",
  "STUDENT",
  "PARENT",
];

/**
 * Check whether a value represents a valid application role.
 */
function isRole(value: unknown): value is Role {
  return (
    typeof value === "string" &&
    (VALID_ROLES as readonly string[]).includes(value)
  );
}

/* -------------------------------------------------------------------------- */
/*                             Response Validation                            */
/* -------------------------------------------------------------------------- */

/**
 * Safely parse and validate the backend login response.
 *
 * Returns null if:
 * - The response is not an object.
 * - success is not true.
 * - Required tokens are missing.
 * - User information is invalid.
 * - The supplied role is not recognized.
 */
function parseLoginResponse(raw: unknown): ParsedLogin | null {
  if (typeof raw !== "object" || raw === null) {
    return null;
  }

  const obj = raw as Record<string, unknown>;

  if (
    obj.success !== true ||
    typeof obj.data !== "object" ||
    obj.data === null
  ) {
    return null;
  }

  const data = obj.data as Record<string, unknown>;

  if (
    typeof data.accessToken !== "string" ||
    !data.accessToken ||
    typeof data.refreshToken !== "string" ||
    !data.refreshToken
  ) {
    return null;
  }

  if (typeof data.user !== "object" || data.user === null) {
    return null;
  }

  const user = data.user as Record<string, unknown>;

  if (
    typeof user.id !== "string" ||
    !user.id ||
    typeof user.email !== "string" ||
    !user.email ||
    !isRole(user.role)
  ) {
    return null;
  }

  if (
    user.departmentId !== null &&
    typeof user.departmentId !== "string" &&
    typeof user.departmentId !== "undefined"
  ) {
    return null;
  }

  return {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    id: user.id,
    email: user.email,
    role: user.role,
    departmentId:
      typeof user.departmentId === "string" ? user.departmentId : null,
  };
}

/* -------------------------------------------------------------------------- */
/*                              User Type Guard                               */
/* -------------------------------------------------------------------------- */

/**
 * Validate the user returned by the Credentials provider.
 *
 * This allows the JWT callback to safely access custom user properties.
 */
function isAppUser(user: unknown): user is NextAuthUser {
  if (typeof user !== "object" || user === null) {
    return false;
  }

  const u = user as Record<string, unknown>;

  return (
    typeof u.id === "string" &&
    typeof u.email === "string" &&
    isRole(u.role) &&
    typeof u.tokenVersion === "number" &&
    typeof u.accessToken === "string" &&
    typeof u.refreshToken === "string" &&
    (u.departmentId === null || typeof u.departmentId === "string")
  );
}

/* -------------------------------------------------------------------------- */
/*                              NextAuth Config                               */
/* -------------------------------------------------------------------------- */

export const { handlers, auth, signIn, signOut } = NextAuth({
  /* ------------------------------------------------------------------------ */
  /* Session Configuration                                                   */
  /* ------------------------------------------------------------------------ */

  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 8, // 8 hours
  },

  pages: {
    signIn: "/login",
  },

  trustHost: true,

  /* ------------------------------------------------------------------------ */
  /* Authentication Providers                                                */
  /* ------------------------------------------------------------------------ */

  providers: [
    Credentials({
      name: "Credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },

        password: {
          label: "Password",
          type: "password",
        },
      },

      /**
       * Authenticate the user against the backend API.
       *
       * Endpoint:
       * POST ${API_BASE_URL}/auth/login
       */
      async authorize(credentials): Promise<NextAuthUser | null> {
        /* ------------------------------------------------------------------ */
        /* Validate Credentials                                               */
        /* ------------------------------------------------------------------ */

        const email =
          typeof credentials?.email === "string"
            ? credentials.email.trim()
            : null;

        const password =
          typeof credentials?.password === "string"
            ? credentials.password
            : null;

        if (!email || !password) {
          return null;
        }

        /* ------------------------------------------------------------------ */
        /* Validate Backend URL                                               */
        /* ------------------------------------------------------------------ */

        const baseUrl = process.env.API_BASE_URL;

        if (!baseUrl) {
          console.error("[auth] API_BASE_URL is not configured.");
          return null;
        }

        /* ------------------------------------------------------------------ */
        /* Send Login Request                                                 */
        /* ------------------------------------------------------------------ */

        let response: Response;

        try {
          response = await fetch(
            `${baseUrl.replace(/\/+$/, "")}/auth/login`,
            {
              method: "POST",

              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },

              body: JSON.stringify({
                email,
                password,
              }),

              cache: "no-store",
            }
          );
        } catch (error) {
          console.error("[auth] Backend login request failed:", error);
          return null;
        }

        /* ------------------------------------------------------------------ */
        /* Handle Failed Authentication                                       */
        /* ------------------------------------------------------------------ */

        if (!response.ok) {
          console.error(
            `[auth] Backend authentication failed with status: ${response.status}`
          );

          return null;
        }

        /* ------------------------------------------------------------------ */
        /* Parse Backend Response                                             */
        /* ------------------------------------------------------------------ */

        const raw: unknown = await response.json().catch(() => null);

        const parsed = parseLoginResponse(raw);

        if (!parsed) {
          console.error("[auth] Invalid backend login response.");
          return null;
        }

        /* ------------------------------------------------------------------ */
        /* Construct Authenticated User                                       */
        /* ------------------------------------------------------------------ */

        const user: NextAuthUser = {
          id: parsed.id,
          email: parsed.email,

          name: null,
          image: null,

          role: parsed.role,
          departmentId: parsed.departmentId,

          tokenVersion: 0,

          accessToken: parsed.accessToken,
          refreshToken: parsed.refreshToken,
        };

        return user;
      },
    }),
  ],

  /* ------------------------------------------------------------------------ */
  /* Callbacks                                                                */
  /* ------------------------------------------------------------------------ */

  callbacks: {
  async jwt({ token, user }) {
    // Initial login
    if (isAppUser(user)) {
      token.id = user.id;
      token.email = user.email;
      token.role = user.role;
      token.departmentId = user.departmentId;
      token.tokenVersion = user.tokenVersion;
      token.accessToken = user.accessToken;
      token.refreshToken = user.refreshToken;
    }

    return token;
  },

  async session({ session, token }) {
    // Validate JWT values before exposing them to the session.
    const id = typeof token.id === "string" ? token.id : "";
    const role = isRole(token.role) ? token.role : "STUDENT";

    const departmentId =
      typeof token.departmentId === "string" ||
      token.departmentId === null
        ? token.departmentId
        : null;

    const tokenVersion =
      typeof token.tokenVersion === "number"
        ? token.tokenVersion
        : 0;

    const accessToken =
      typeof token.accessToken === "string"
        ? token.accessToken
        : "";

    session.user = {
      ...session.user,
      id,
      email: token.email ?? "",
      name: token.name ?? null,
      image: token.picture ?? null,
      role,
      departmentId,
      tokenVersion,
      accessToken,
    };

    return session;
  },
},

});