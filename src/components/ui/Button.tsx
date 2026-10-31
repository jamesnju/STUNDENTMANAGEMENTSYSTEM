import { cn } from "@/app/utils/utils";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  loading?: boolean;
}

export function Button({ className, variant = "primary", loading, children, disabled, ...props }: ButtonProps) {
  const variants = {
    primary: "bg-[var(--brand)] text-white hover:bg-[var(--brand-hover)]",
    secondary: "bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--fg-base)] hover:bg-[var(--bg-muted)]",
    danger: "bg-red-500 text-white hover:bg-red-600",
    ghost: "text-[var(--fg-base)] hover:bg-[var(--bg-muted)]",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--ring)] disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}