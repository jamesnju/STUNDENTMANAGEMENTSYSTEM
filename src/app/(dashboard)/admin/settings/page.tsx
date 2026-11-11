"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSettings, useCreateSetting, useUpdateSetting, useDeleteSetting } from "@/hooks/useSettings";
import { Table, THead, TR, TH, TD, TBody } from "@/components/ui/Table";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Loader2, Settings2, Search, Plus, Edit2, Trash2 } from "lucide-react";
import { SettingsModal } from "@/components/admin/settings/SettingsModal";

export default function AdminSettingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";

  const [searchInput, setSearchInput] = useState(search);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSetting, setEditingSetting] = useState<any>(null);

  // Queries & Mutations
  const { data, isLoading } = useSettings({ page, limit: 10, search });
  const { mutate: createSetting, isPending: isCreating } = useCreateSetting();
  const { mutate: updateSetting, isPending: isUpdating } = useUpdateSetting();
  const { mutate: deleteSetting } = useDeleteSetting();

  // Handlers
  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchInput) params.set("search", searchInput);
    else params.delete("search");
    params.set("page", "1");
    router.push(`/admin/settings?${params.toString()}`);
  }, [searchInput, searchParams, router]);

  const handleSave = (payload: any) => {
    if (editingSetting) {
      // For updates, we only send the value fields
      const { param, description, ...updatePayload } = payload;
      updateSetting({ param: editingSetting.param, payload: updatePayload }, {
        onSuccess: () => setIsModalOpen(false)
      });
    } else {
      createSetting(payload, { onSuccess: () => setIsModalOpen(false) });
    }
  };

  const handleDelete = (param: string) => {
    if (confirm(`Are you sure you want to delete the setting "${param}"?`)) {
      deleteSetting(param);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-[var(--fg-base)]">
            <Settings2 className="h-6 w-6 text-[var(--brand)]" /> System Settings
          </h1>
          <p className="text-sm text-[var(--fg-muted)]">Manage school-wide parameters and configurations.</p>
        </div>
        <Button onClick={() => { setEditingSetting(null); setIsModalOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> Add Setting
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 max-w-md">
        <form onSubmit={handleSearch} className="flex w-full items-center gap-2">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--fg-muted)]" />
            <Input
              placeholder="Search parameters..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button type="submit" variant="secondary">Search</Button>
        </form>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-[var(--brand)]" /></div>
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Parameter</TH>
              <TH>Value</TH>
              <TH>Description</TH>
              <TH className="text-right">Actions</TH>
            </TR>
          </THead>
          <TBody>
            {data?.data.length === 0 && (
              <TR><TD colSpan={4} className="py-12 text-center text-[var(--fg-muted)]">No settings found.</TD></TR>
            )}
            {data?.data.map((setting: any) => {
              const val = setting.valString ?? setting.valInt ?? setting.valBool ?? setting.valJson;
              const isBool = typeof val === "boolean";

              return (
                <TR key={setting.id}>
                  <TD className="font-mono text-sm font-medium">{setting.param}</TD>
                  <TD>
                    {isBool ? (
                      <Badge variant={val ? "success" : "danger"}>{val ? "True" : "False"}</Badge>
                    ) : typeof val === "object" ? (
                      <pre className="text-xs bg-[var(--bg-muted)] p-2 rounded max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">{JSON.stringify(val)}</pre>
                    ) : (
                      <span className="font-medium bg-[var(--bg-muted)] px-2 py-1 rounded text-sm">{String(val)}</span>
                    )}
                  </TD>
                  <TD className="text-[var(--fg-muted)]">{setting.description || "—"}</TD>
                  <TD className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        className="h-8 w-8 p-0" 
                        onClick={() => { setEditingSetting(setting); setIsModalOpen(true); }}
                      >
                        <Edit2 className="h-4 w-4 text-[var(--fg-muted)] hover:text-[var(--brand)]" /> Edit
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="h-8 w-8 p-0" 
                        onClick={() => handleDelete(setting.param)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500/70 hover:text-red-500" />
                      </Button>
                    </div>
                  </TD>
                </TR>
              );
            })}
          </TBody>
        </Table>
      )}

      {/* Pagination */}
      {data?.meta && data.meta.total > data.meta.limit && (
        <div className="flex items-center justify-between border-t border-[var(--border-color)] pt-4">
          <span className="text-sm text-[var(--fg-muted)]">
            Showing page {data.meta.page} of {Math.ceil(data.meta.total / data.meta.limit)}
          </span>
          <div className="flex gap-2">
            <Button variant="secondary" disabled={page <= 1} onClick={() => {
              const p = new URLSearchParams(searchParams.toString());
              p.set("page", (page - 1).toString());
              router.push(`/admin/settings?${p.toString()}`);
            }}>Previous</Button>
            <Button variant="secondary" disabled={page >= Math.ceil(data.meta.total / data.meta.limit)} onClick={() => {
              const p = new URLSearchParams(searchParams.toString());
              p.set("page", (page + 1).toString());
              router.push(`/admin/settings?${p.toString()}`);
            }}>Next</Button>
          </div>
        </div>
      )}

      {/* Modal */}
      <SettingsModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialData={editingSetting}
        onSave={handleSave}
        isSaving={isCreating || isUpdating}
      />
    </div>
  );
}