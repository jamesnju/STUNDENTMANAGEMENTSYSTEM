// src/app/layout.tsx
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/*
          Pre-paint theme script.
          - Runs before React hydrates → no flash of wrong theme.
          - The `data-settable` attribute is set to "true" by the dashboard
            layout via an inline script below (see step 3). Here it only
            handles the case where the user is NOT in the dashboard:
            force light.
          - We intentionally do NOT read localStorage here to keep
            landing/login always light. The dashboard flips it to dark
            if the user previously chose so — see step 3.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var settable = document.documentElement.getAttribute("data-theme-settable") === "true";
                  if (!settable) {
                    document.documentElement.classList.remove("dark");
                    return;
                  }
                  var t = localStorage.getItem("theme");
                  if (t === "dark") document.documentElement.classList.add("dark");
                  else document.documentElement.classList.remove("dark");
                } catch (_) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <SessionProvider>
          <QueryProvider>
            <ThemeProvider settable={false}>{children}</ThemeProvider>
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}