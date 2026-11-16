"use client";

import { useInbox, useMarkRead } from "@/hooks/useNotifications";
import { Button } from "@/components/ui/Button";
import { Loader2, Mail, MailOpen } from "lucide-react";

export function InboxList() {
  const { data, isLoading } = useInbox({ limit: 20 });
  const { mutate: markRead, isPending } = useMarkRead();

  if (isLoading) return <div className="p-8"><Loader2 className="animate-spin text-[var(--brand)]" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Inbox</h2>
        <Button variant="secondary" onClick={() => markRead()} loading={isPending} disabled={data?.meta.unread === 0}>
          Mark all as read ({data?.meta.unread || 0})
        </Button>
      </div>

      <div className="space-y-2">
        {data?.data.map((item: any) => (
          <div key={item.recipientId} className={`p-4 rounded-xl border ${item.readAt ? "border-[var(--border-color)] bg-[var(--bg-surface)]" : "border-[var(--brand)] bg-[var(--primary-50)] dark:bg-[var(--primary-900)]/20"}`}>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-[var(--fg-base)]">{item.notification.title}</h3>
                <p className="text-sm text-[var(--fg-muted)] mt-1">{item.notification.body}</p>
              </div>
              {!item.readAt && <span className="h-2 w-2 rounded-full bg-[var(--brand)]" />}
            </div>
            <p className="text-xs text-[var(--fg-muted)] mt-3">{new Date(item.notification.createdAt).toLocaleString()}</p>
          </div>
        ))}
        {data?.data.length === 0 && <p className="text-center text-[var(--fg-muted)] py-8">Your inbox is empty.</p>}
      </div>
    </div>
  );
}