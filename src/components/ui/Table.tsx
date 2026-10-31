import { cn } from "@/app/utils/utils";

export function Table({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)]">
      <table className={cn("w-full text-left text-sm", className)}>{children}</table>
    </div>
  );
}

export function THead({ children }: { children: React.ReactNode }) {
  return <thead className="border-b border-[var(--border-color)] bg-[var(--bg-muted)]/50">{children}</thead>;
}

export function TBody({ children }: { children: React.ReactNode }) {
  return <tbody>{children}</tbody>;
}

// Update TR to accept standard HTML attributes
export function TR({ children, className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr 
      className={cn("border-b border-[var(--border-color)] last:border-0 hover:bg-[var(--bg-muted)]/30 transition-colors", className)} 
      {...props}
    >
      {children}
    </tr>
  );
}

// Update TH to accept standard HTML attributes
export function TH({ children, className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th 
      className={cn("whitespace-nowrap px-4 py-3 font-medium text-[var(--fg-muted)]", className)} 
      {...props}
    >
      {children}
    </th>
  );
}

// Update TD to accept standard HTML attributes (fixes colSpan error)
export function TD({ children, className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td 
      className={cn("px-4 py-3 text-[var(--fg-base)]", className)} 
      {...props}
    >
      {children}
    </td>
  );
}