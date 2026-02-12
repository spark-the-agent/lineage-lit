"use client";

import { creators } from "@/lib/data";

interface CreatorPickerProps {
  value: string;
  onChange: (id: string) => void;
  excludeId?: string;
  label: string;
}

export default function CreatorPicker({
  value,
  onChange,
  excludeId,
  label,
}: CreatorPickerProps) {
  return (
    <div>
      <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-100 focus:outline-none focus:border-amber-500/50"
      >
        <option value="">Select creator...</option>
        {creators
          .filter((c) => c.id !== excludeId)
          .map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
      </select>
    </div>
  );
}
