import { cn } from "@/app/utils/utils";

export function Badge({ 
  children, 
  variant = "default",
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { 
  variant?: "default" | "success" | "warning" | "danger" 
}) {
  const variants = {
    default: "bg-[var(--bg-muted)] text-[var(--fg-base)]",
    success: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    danger: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  };

  return (
    <span 
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", 
        variants[variant],
        className // <-- Now accepts custom classes from the dashboard
      )}
      {...props}
    >
      {children}
    </span>
  );
}