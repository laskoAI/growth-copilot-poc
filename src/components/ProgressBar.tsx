"use client";
import type { StageId } from "@/lib/store";

const STAGES: { id: 1 | 2 | 3 | 4; label: string }[] = [
  { id: 1, label: "Cel i dane" },
  { id: 2, label: "Plan kampanii" },
  { id: 3, label: "Wysyłka" },
  { id: 4, label: "Podsumowanie" },
];

export default function ProgressBar({ stage }: { stage: StageId }) {
  return (
    <div className="flex items-center gap-2">
      {STAGES.map((s, i) => {
        const state = stage === s.id ? "current" : stage > s.id ? "done" : "upcoming";
        return (
          <div key={s.id} className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 ${state === "upcoming" ? "opacity-40" : ""}`}>
              <div
                className={`w-5 h-5 shrink-0 rounded-full flex items-center justify-center text-[10px] font-semibold ${
                  state === "current"
                    ? "bg-[var(--accent)] text-white"
                    : state === "done"
                    ? "bg-[var(--accent)]/15 text-[var(--accent)]"
                    : "bg-[var(--panel-2)] text-[var(--muted)] border border-[var(--border)]"
                }`}
              >
                {state === "done" ? "✓" : s.id}
              </div>
              <span
                className={`text-xs hidden lg:inline ${
                  state === "current" ? "font-semibold text-[var(--text)]" : "text-[var(--muted)]"
                }`}
              >
                {s.label}
              </span>
            </div>
            {i < STAGES.length - 1 && <div className="w-5 h-px bg-[var(--border)]" />}
          </div>
        );
      })}
    </div>
  );
}
