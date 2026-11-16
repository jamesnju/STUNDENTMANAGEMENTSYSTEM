"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useNotifications, useCreateNotification, useCancelNotification } from "@/hooks/useNotifications";
import { Table, THead, TR, TH, TD, TBody } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Loader2, Send, XCircle, Plus, Bell } from "lucide-react";

export default function AdminNotificationsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = Number(searchParams.get("page")) || 1;

  const { data, isLoading } = useNotifications({ page, limit: 10 });
  const { mutate: cancelNotif } = useCancelNotification();
  const { mutate: createNotif, isPending: isCreating } = useCreateNotification();

  // Create Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: "", body: "", audience: "STUDENTS" });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createNotif({ ...formData, channels: ["EMAIL", "IN_APP"] }, {
      onSuccess: () => { setIsModalOpen(false); setFormData({ title: "", body: "", audience: "STUDENTS" }); }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-[var(--fg-base)]">
            <Bell className="h-6 w-6 text-[var(--brand)]" /> Notifications
          </h1>
          <p className="text-sm text-[var(--fg-muted)]">Broadcast announcements to the school.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> New Broadcast
        </Button>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-[var(--brand)]" /></div>
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Title</TH>
              <TH>Audience</TH>
              <TH>Status</TH>
              <TH>Recipients</TH>
              <TH>Date</TH>
              <TH className="text-right">Actions</TH>
            </TR>
          </THead>
          <TBody>
            {data?.data.map((notif: any) => (
              <TR key={notif.id}>
                <TD className="font-medium">{notif.title}</TD>
                <TD><Badge>{notif.audience}</Badge></TD>
                <TD>
                  <Badge variant={notif.status === "SENT" ? "success" : notif.status === "PENDING" ? "warning" : "danger"}>
                    {notif.status}
                  </Badge>
                </TD>
                <TD>{notif._count?.recipients || 0}</TD>
                <TD className="text-[var(--fg-muted)] text-sm">{new Date(notif.createdAt).toLocaleDateString()}</TD>
                <TD className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="secondary" className="h-8 px-3 text-xs" onClick={() => router.push(`/admin/notifications/${notif.id}`)}>View</Button>
                    {notif.status === "PENDING" && (
                      <Button variant="secondary" className="h-8 px-3 text-xs text-red-600" onClick={() => {
                        if(confirm("Cancel this notification?")) cancelNotif(notif.id);
                      }}>
                        Cancel
                      </Button>
                    )}
                  </div>
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      )}

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-xl">
            <div className="flex justify-between p-4 border-b border-[var(--border-color)]">
              <h2 className="font-bold text-lg">New Broadcast</h2>
              <button onClick={() => setIsModalOpen(false)}><XCircle className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleCreate} className="p-4 space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Title</label>
                <Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Message Body</label>
                <textarea className="w-full h-24 p-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)]" required value={formData.body} onChange={e => setFormData({...formData, body: e.target.value})} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Audience</label>
                <select className="w-full h-10 px-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)]" value={formData.audience} onChange={e => setFormData({...formData, audience: e.target.value})}>
                  <option value="STUDENTS">All Students</option>
                  <option value="PARENTS">All Parents</option>
                  <option value="TEACHERS">All Teachers</option>
                  <option value="STAFF">All Staff</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-[var(--border-color)]">
                <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" loading={isCreating}><Send className="mr-2 h-4 w-4" /> Send</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}