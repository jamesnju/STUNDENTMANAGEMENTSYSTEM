"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { X } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any; // If present, we are editing. If null, creating.
  onSave: (payload: any) => void;
  isSaving: boolean;
}

export function SettingsModal({ isOpen, onClose, initialData, onSave, isSaving }: SettingsModalProps) {
  const isEditing = !!initialData;

  const [param, setParam] = useState("");
  const [description, setDescription] = useState("");
  const [valueType, setValueType] = useState<"valString" | "valInt" | "valBool" | "valJson">("valString");
  const [value, setValue] = useState<string>("");

  // Reset form when opening/closing
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setParam(initialData.param);
        setDescription(initialData.description || "");
        if (initialData.valString !== null) { setValueType("valString"); setValue(initialData.valString); }
        else if (initialData.valInt !== null) { setValueType("valInt"); setValue(String(initialData.valInt)); }
        else if (initialData.valBool !== null) { setValueType("valBool"); setValue(String(initialData.valBool)); }
        else if (initialData.valJson !== null) { setValueType("valJson"); setValue(JSON.stringify(initialData.valJson, null, 2)); }
      } else {
        setParam("");
        setDescription("");
        setValueType("valString");
        setValue("");
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: any = { description };

    if (!isEditing) payload.param = param;

    // Enforce strict single value type
    if (valueType === "valString") payload.valString = value;
    if (valueType === "valInt") payload.valInt = parseInt(value, 10);
    if (valueType === "valBool") payload.valBool = value === "true";
    if (valueType === "valJson") {
      try {
        payload.valJson = JSON.parse(value);
      } catch (err) {
        alert("Invalid JSON format");
        return;
      }
    }

    onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[var(--border-color)] p-4">
          <h2 className="text-lg font-bold">{isEditing ? "Edit Setting" : "Create Setting"}</h2>
          <button onClick={onClose} className="rounded p-1 hover:bg-[var(--bg-muted)]"><X className="h-5 w-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Parameter Name</label>
            <Input 
              required 
              placeholder="e.g. grading.pass_mark" 
              value={param} 
              onChange={(e) => setParam(e.target.value)} 
              disabled={isEditing} // Cannot change param on edit
              pattern="^[a-z0-9_.]+$"
              title="Only lowercase letters, numbers, dots, and underscores"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Input required value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Value Type</label>
              <select 
                className="w-full h-10 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] px-3 text-sm focus:ring-2 focus:ring-[var(--ring)] focus:outline-none"
                value={valueType}
                onChange={(e) => { setValueType(e.target.value as any); setValue(""); }}
                disabled={isEditing} // Keep it simple: don't change types on edit
              >
                <option value="valString">String</option>
                <option value="valInt">Integer</option>
                <option value="valBool">Boolean</option>
                <option value="valJson">JSON Object</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Value</label>
              {valueType === "valBool" ? (
                <select 
                  className="w-full h-10 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] px-3 text-sm focus:ring-2 focus:ring-[var(--ring)] focus:outline-none"
                  value={value} onChange={(e) => setValue(e.target.value)} required
                >
                  <option value="" disabled>Select</option>
                  <option value="true">True</option>
                  <option value="false">False</option>
                </select>
              ) : valueType === "valJson" ? (
                <textarea 
                  className="w-full h-24 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] p-3 text-sm font-mono focus:ring-2 focus:ring-[var(--ring)] focus:outline-none"
                  placeholder='{ "A": 80, "B": 70 }'
                  value={value} onChange={(e) => setValue(e.target.value)} required
                />
              ) : (
                <Input 
                  type={valueType === "valInt" ? "number" : "text"} 
                  required 
                  value={value} 
                  onChange={(e) => setValue(e.target.value)} 
                />
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border-color)]">
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
            <Button type="submit" loading={isSaving}>Save Setting</Button>
          </div>
        </form>
      </div>
    </div>
  );
}