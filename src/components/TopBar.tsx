"use client";
import Logo from "@/components/Logo";
import ProgressBar from "@/components/ProgressBar";
import type { StageId } from "@/lib/store";

export default function TopBar({
  stage,
  onBack,
  onForward,
  onRestart,
  canBack,
  canForward,
}: {
  stage: StageId;
  onBack: () => void;
  onForward: () => void;
  onRestart: () => void;
  canBack: boolean;
  canForward: boolean;
}) {
  return (
    <div className="h-14 border-b border-[var(--border)] flex items-center justify-between px-6 bg-[var(--panel)] gap-4">
      <div className="flex items-center gap-3 shrink-0">
        <Logo size={28} />
        <div className="font-semibold tracking-tight">Nuvera · Growth Copilot</div>
      </div>

      <div className="flex-1 flex justify-center min-w-0">
        <ProgressBar stage={stage} />
      </div>

      <div className="flex items-center gap-2 text-xs shrink-0">
        <button
          onClick={onBack}
          disabled={!canBack}
          className="px-3 py-1.5 rounded-md border border-[var(--border)] hover:bg-[var(--panel-2)] disabled:opacity-30 disabled:hover:bg-transparent"
          title="Skrót: ←"
        >
          ← Cofnij
        </button>
        <button
          onClick={onForward}
          disabled={!canForward}
          className="px-3 py-1.5 rounded-md border border-[var(--border)] hover:bg-[var(--panel-2)] disabled:opacity-30 disabled:hover:bg-transparent"
          title="Skrót: →"
        >
          Dalej →
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
