"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { X } from "lucide-react";

interface DepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any;
  onSave: (payload: any) => void;
  isSaving: boolean;
}

export function DepartmentModal({ isOpen, onClose, initialData, onSave, isSaving }: DepartmentModalProps) {
  const isEditing = !!initialData;
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setName(initialData?.name || "");
      setCode(initialData?.code || "");
      setError(null);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !code.trim()) {
      setError("Both name and code are required.");
      return;
    }
    onSave({ name, code: code.toUpperCase() });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[var(--border-color)] p-4">
          <h2 className="text-lg font-bold">{isEditing ? "Edit Department" : "New Department"}</h2>
          <button onClick={onClose} className="rounded p-1 hover:bg-[var(--bg-muted)]"><X className="h-5 w-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && <div className="p-2 bg-red-100 text-red-800 text-sm rounded">{error}</div>}

          <div>
            <label className="block text-sm font-medium mb-1">Department Name</label>
            <Input 
              required 
              placeholder="e.g. Sciences" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Department Code</label>
            <Input 
              required 
              placeholder="e.g. SCI" 
              value={code} 
              onChange={(e) => setCode(e.target.value)} 
              pattern="^[A-Z0-9_-]+$"
              title="Only uppercase letters, numbers, underscores, and hyphens"
            />
            <p className="text-xs text-[var(--fg-muted)] mt-1">Unique code (e.g. SCI, MATH, ADMIN).</p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border-color)]">
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
            <Button type="submit" loading={isSaving}>{isEditing ? "Save Changes" : "Create Department"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}