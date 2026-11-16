"use client";

import { useState } from "react";
import { useRooms, useCreateRoom, useDeleteRoom } from "@/hooks/useAcademic";
import { Table, THead, TR, TH, TD, TBody } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Loader2, Plus, Trash2, DoorOpen } from "lucide-react";

export default function RoomsPage() {
  const { data, isLoading } = useRooms();
  const { mutate: createRoom, isPending: isCreating } = useCreateRoom();
  const { mutate: deleteRoom } = useDeleteRoom();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", code: "", capacity: "30", building: "", floor: "1" });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createRoom({
      name: form.name,
      code: form.code || undefined,
      capacity: parseInt(form.capacity) || undefined,
      building: form.building || undefined,
      floor: parseInt(form.floor) || undefined,
    }, { onSuccess: () => setIsModalOpen(false) });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <DoorOpen className="h-6 w-6 text-[var(--brand)]" /> Rooms
          </h1>
          <p className="text-sm text-[var(--fg-muted)]">Manage physical classrooms and labs.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add Room</Button>
      </div>

      {isLoading ? <Loader2 className="animate-spin text-[var(--brand)]" /> : (
        <Table>
          <THead><TR><TH>Name</TH><TH>Building</TH><TH>Floor</TH><TH>Capacity</TH><TH>Actions</TH></TR></THead>
          <TBody>
            {data?.data.map((room: any) => (
              <TR key={room.id}>
                <TD className="font-medium">
                  {room.name} {room.code && <span className="text-[var(--fg-muted)] text-xs ml-2">({room.code})</span>}
                </TD>
                <TD className="text-sm text-[var(--fg-muted)]">{room.building || "—"}</TD>
                <TD className="text-sm text-[var(--fg-muted)]">{room.floor || "—"}</TD>
                <TD><Badge>{room.capacity || "N/A"}</Badge></TD>
                <TD><Button variant="ghost" onClick={() => deleteRoom(room.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button></TD>
              </TR>
            ))}
            {data?.data.length === 0 && <TR><TD colSpan={5} className="text-center py-8 text-[var(--fg-muted)]">No rooms created yet.</TD></TR>}
          </TBody>
        </Table>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <form onSubmit={handleCreate} className="w-full max-w-md bg-[var(--bg-surface)] p-6 rounded-xl space-y-4">
            <h2 className="font-bold text-lg">Create Room</h2>
            <Input placeholder="Room Name (e.g. Lab 1)" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            <Input placeholder="Code (optional, e.g. R-101)" value={form.code} onChange={e => setForm({...form, code: e.target.value})} />
            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="Building" value={form.building} onChange={e => setForm({...form, building: e.target.value})} />
              <Input type="number" placeholder="Floor" value={form.floor} onChange={e => setForm({...form, floor: e.target.value})} />
            </div>
            <Input type="number" placeholder="Capacity (e.g. 40)" required value={form.capacity} onChange={e => setForm({...form, capacity: e.target.value})} />
            
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" loading={isCreating}>Save Room</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}