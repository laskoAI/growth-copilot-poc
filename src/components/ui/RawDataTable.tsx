"use client";
import type { RawTable } from "@/lib/rawSamples";

export default function RawDataTable({ table }: { table: RawTable }) {
  return (
    <div className="border border-[var(--border)] rounded-lg overflow-hidden bg-white">
      <div className="px-3 py-2 bg-[var(--panel-2)] border-b border-[var(--border)] flex items-center justify-between gap-2">
        <div className="text-xs font-medium">{table.systemLabel}</div>
        <div className="text-[10px] text-[var(--muted)]">{table.sourceLabel}</div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[11px] font-mono">
          <thead>
            <tr className="border-b border-[var(--border)]">
              {table.columns.map((c) => (
                <th key={c} className="text-left px-2 py-1.5 text-[var(--muted)] font-normal whitespace-nowrap">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, i) => (
              <tr key={i} className="border-b border-[var(--border)] last:border-0">
                {row.map((cell, j) => (
                  <td key={j} className="px-2 py-1.5 whitespace-nowrap text-[var(--text)]/80">
                    {cell || "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {table.note && (
        <div className="px-3 py-1.5 text-[10px] text-[var(--muted)] border-t border-[var(--border)] bg-[var(--panel-2)]">
          {table.note}
        </div>
      )}
    </div>
  );
}
