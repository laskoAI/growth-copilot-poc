"use client";
import Logo from "@/components/Logo";

export default function TopBar({ onRestart, onAdvance }: { onRestart: () => void; onAdvance: () => void }) {
  return (
    <div className="h-14 border-b border-[var(--border)] flex items-center justify-between px-6 bg-[var(--panel)]">
      <div className="flex items-center gap-3">
        <Logo size={28} />
        <div className="font-semibold tracking-tight">Growth Marketer AI</div>
      </div>
      <div className="flex items-center gap-2 text-xs">
        <button
          onClick={onAdvance}
          className="px-3 py-1.5 rounded-md border border-[var(--border)] hover:bg-[var(--panel-2)]"
          title="Skrót: →"
        >
          Przewiń 7 dni →
        </button>
        <button
          onClick={onRestart}
          className="px-3 py-1.5 rounded-md border border-[var(--border)] hover:bg-[var(--panel-2)]"
          title="Skrót: R"
        >
          Restart
        </button>
      </div>
    </div>
  );
}
