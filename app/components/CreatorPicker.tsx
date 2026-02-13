"use client";

import { useCreators } from "@/lib/use-convex-data";

interface CreatorPickerProps {
  value: string;
  onChange: (slug: string) => void;
  excludeSlug?: string;
  label: string;
}

export default function CreatorPicker({
  value,
  onChange,
  excludeSlug,
  label,
}: CreatorPickerProps) {
  const creators = useCreators();
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
          .filter((c) => c.slug !== excludeSlug)
          .map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
      </select>
    </div>
  );
}
