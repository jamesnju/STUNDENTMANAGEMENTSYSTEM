"use client";

import { useEffect, useRef, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { ShieldAlert } from "lucide-react";

// Timeouts (in milliseconds)
const IDLE_TIMEOUT = 15 * 60 * 1000; // 15 minutes of inactivity
const WARNING_TIMEOUT = 2 * 60 * 1000; // Show warning 2 minutes before logout

export function SessionGuard() {
  const { data: session, update } = useSession();
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Function to reset all timers
  const resetTimers = () => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    
    // If the prompt is already open, don't restart timers automatically
    if (isPromptOpen) return;

    // Set warning timer
    warningTimerRef.current = setTimeout(() => {
      showWarning();
    }, IDLE_TIMEOUT - WARNING_TIMEOUT);

    // Set hard logout timer
    idleTimerRef.current = setTimeout(() => {
      handleLogout();
    }, IDLE_TIMEOUT);
  };

  const showWarning = () => {
    setIsPromptOpen(true);
    toast.custom((t) => (
      <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} w-full max-w-md bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl shadow-2xl p-6`}>
        <div className="flex items-start gap-4">
          <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-full text-yellow-600 dark:text-yellow-400">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[var(--fg-base)]">Are you still there?</h3>
            <p className="text-sm text-[var(--fg-muted)] mt-1">
              You've been inactive for a while. We'll log you out in 2 minutes to keep your account secure.
            </p>
            <div className="flex gap-3 mt-4">
              <Button 
                onClick={() => handleStillHere(t.id)} 
                className="flex-1"
              >
                Yes, I'm here
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => handleLogout(t.id)} 
                className="flex-1"
              >
                Log out
              </Button>
            </div>
          </div>
        </div>
      </div>
    ), { duration: WARNING_TIMEOUT, id: "session-warning" });
  };

  const handleStillHere = async (toastId: string) => {
    toast.dismiss(toastId);
    setIsPromptOpen(false);
    
    // Trigger NextAuth update to refresh the token via backend
    const refreshToast = toast.loading("Refreshing session...");
    try {
      await update({ refreshSession: true });
      toast.success("Session extended", { id: refreshToast });
      resetTimers(); // Restart the 15-minute timer
    } catch (error) {
      toast.error("Failed to refresh session. Please log in again.", { id: refreshToast });
      handleLogout();
    }
  };

  const handleLogout = (toastId?: string) => {
    if (toastId) toast.dismiss(toastId);
    toast.dismiss("session-warning");
    signOut({ callbackUrl: "/login?error=SessionExpired" });
  };

  // Attach event listeners to detect activity
  useEffect(() => {
    if (!session) return; // Don't run if not logged in

    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    
    const handleActivity = () => {
      if (!isPromptOpen) resetTimers();
    };

    // Initialize timers
    resetTimers();

    // Bind events
    events.forEach((event) => window.addEventListener(event, handleActivity));

    // Cleanup
    return () => {
      events.forEach((event) => window.removeEventListener(event, handleActivity));
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    };
  }, [session, isPromptOpen]);

  return null; // This component doesn't render anything visually (toasts are handled globally)
}