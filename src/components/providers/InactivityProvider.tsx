"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { Clock, LogOut, ShieldAlert } from "lucide-react";

// ⚠️ TESTING: 1 minute
const IDLE_TIMEOUT_MS = 60 * 1000; 
// ⚠️ TESTING: 15 seconds warning
const WARNING_TIMEOUT_MS = 15 * 1000; 

export function InactivityProvider({ children }: { children: React.ReactNode }) {
  const { status, update } = useSession();
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(15);

  // We use a Ref to hold the timer so we can clear it from ANY function
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Function to start/reset the timer
  const resetTimer = useCallback(() => {
    if (showWarning) return; // Don't reset if the warning is already showing

    // Clear any existing timer
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }

    // Start a new timer
    idleTimerRef.current = setTimeout(() => {
      console.log("⚠️ Triggering Inactivity Warning!");
      setShowWarning(true);
    }, IDLE_TIMEOUT_MS);
  }, [showWarning]);

  // 2. Start the timer on mount when authenticated
  useEffect(() => {
    if (status !== "authenticated") return;

    console.log(`⏱️ Inactivity timer started. Will trigger in ${IDLE_TIMEOUT_MS / 1000}s`);
    resetTimer();

    // Cleanup on unmount
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [status, resetTimer]);

  // 3. Listen for user activity to reset the timer
  useEffect(() => {
    if (status !== "authenticated" || showWarning) return;

    const handleActivity = () => {
      resetTimer();
    };

    const events = ["mousemove", "mousedown", "keydown", "touchstart", "scroll"];
    events.forEach((e) => window.addEventListener(e, handleActivity));

    return () => {
      events.forEach((e) => window.removeEventListener(e, handleActivity));
    };
  }, [status, showWarning, resetTimer]);

  // 4. Countdown timer while the warning is visible
  useEffect(() => {
    if (!showWarning) return;

    setCountdown(15);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showWarning]);

  // 5. Auto-logout when countdown hits 0
  useEffect(() => {
    if (showWarning && countdown === 0) {
      signOut({ callbackUrl: "/login?reason=timeout" });
    }
  }, [showWarning, countdown]);

  // 6. Handle "Stay Logged In"
  const handleStayLoggedIn = async () => {
    setShowWarning(false);
    await update(); // Refresh the session token
    resetTimer(); // Restart the inactivity timer
  };

  return (
    <>
      {children}

      {showWarning && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 shadow-2xl text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30">
              <ShieldAlert className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
            </div>
            
            <h2 className="text-2xl font-bold text-[var(--fg-base)] mb-2">Are you still there?</h2>
            <p className="text-sm text-[var(--fg-muted)] mb-6">
              You've been inactive. We'll log you out in{" "}
              <strong className="text-[var(--brand)]">{countdown} seconds</strong>.
            </p>

            <div className="flex gap-3 justify-center">
              <Button variant="secondary" onClick={() => signOut({ callbackUrl: "/login?reason=timeout" })} className="flex-1">
                <LogOut className="mr-2 h-4 w-4" /> Log Out
              </Button>
              <Button onClick={handleStayLoggedIn} className="flex-1">
                <Clock className="mr-2 h-4 w-4" /> Stay Logged In
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}