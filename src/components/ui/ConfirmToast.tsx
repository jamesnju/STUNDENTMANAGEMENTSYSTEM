import toast from "react-hot-toast";
import { Button } from "./Button";
import { AlertTriangle } from "lucide-react";

interface ConfirmToastProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmToast({ title, message, onConfirm, onCancel }: ConfirmToastProps) {
  return (
    <div className="flex flex-col gap-3 w-full max-w-sm">
      <div className="flex items-start gap-3">
        <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full text-red-600 dark:text-red-400">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-bold text-[var(--fg-base)]">{title}</h3>
          <p className="text-sm text-[var(--fg-muted)] mt-1">{message}</p>
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-2">
        <Button variant="secondary" onClick={onCancel} className="h-8 px-3 text-xs">Cancel</Button>
        <Button variant="danger" onClick={onConfirm} className="h-8 px-3 text-xs">Confirm</Button>
      </div>
    </div>
  );
}

// Helper function to trigger it easily
export function confirmToast(title: string, message: string, onConfirm: () => void) {
  toast.custom((t) => (
    <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl shadow-lg p-4`}>
      <ConfirmToast 
        title={title} 
        message={message} 
        onConfirm={() => {
          toast.dismiss(t.id);
          onConfirm();
        }} 
        onCancel={() => toast.dismiss(t.id)} 
      />
    </div>
  ), { duration: 10000 }); // Stay for 10s
}