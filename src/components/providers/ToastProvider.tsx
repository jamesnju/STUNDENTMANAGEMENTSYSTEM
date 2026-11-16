"use client";

import { Toaster } from "react-hot-toast";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        // Default options for all toasts
        duration: 4000,
        style: {
          background: "var(--bg-surface)",
          color: "var(--fg-base)",
          border: "1px solid var(--border-color)",
          borderRadius: "0.5rem",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        },
        // Custom styles for specific types
        success: {
          iconTheme: {
            primary: "var(--brand)",
            secondary: "var(--bg-surface)",
          },
        },
        error: {
          iconTheme: {
            primary: "#ef4444", // red-500
            secondary: "var(--bg-surface)",
          },
        },
      }}
    />
  );
}