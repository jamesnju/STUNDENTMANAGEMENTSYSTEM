"use client";

import { useParams, useRouter } from "next/navigation";
import { useNotification } from "@/hooks/useNotifications";
import { Table, THead, TR, TH, TD, TBody } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotificationDetailPage() {
  const { id } = useParams() as { id: string };
  const { data: notif, isLoading } = useNotification(id);

  if (isLoading) return <div className="p-8"><Loader2 className="animate-spin text-[var(--brand)]" /></div>;
  if (!notif) return <div className="p-8 text-red-500">Not found.</div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/admin/notifications" className="p-2 rounded-full hover:bg-[var(--bg-muted)]"><ArrowLeft className="h-5 w-5" /></Link>
        <h1 className="text-2xl font-bold text-[var(--fg-base)]">Notification Details</h1>
      </div>

      <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6">
        <h2 className="text-xl font-bold mb-2">{notif.title}</h2>
        <p className="text-[var(--fg-muted)] mb-4">{notif.body}</p>
        <div className="flex gap-2">
          <Badge>{notif.audience}</Badge>
          <Badge variant={notif.status === "SENT" ? "success" : "warning"}>{notif.status}</Badge>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold">Delivery Status ({notif.recipients?.length || 0})</h3>
        <Table>
          <THead>
            <TR>
              <TH>User</TH>
              <TH>Channel</TH>
              <TH>Status</TH>
              <TH>Read At</TH>
            </TR>
          </THead>
          <TBody>
            {notif.recipients?.map((r: any) => (
              <TR key={r.id}>
                <TD>{r.user?.email}</TD>
                <TD><Badge>{r.channel}</Badge></TD>
                <TD>
                  <Badge variant={r.status === "SENT" ? "success" : "danger"}>{r.status}</Badge>
                  {r.error && <span className="text-xs text-red-500 block">{r.error}</span>}
                </TD>
                <TD className="text-[var(--fg-muted)]">{r.readAt ? new Date(r.readAt).toLocaleString() : "Unread"}</TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </div>
    </div>
  );
}