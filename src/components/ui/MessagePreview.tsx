"use client";
import { COMPANY } from "@/lib/scenario";

export function PushPreview({ title, body }: { title: string; body: string }) {
  return (
    <div className="py-1">
      <div className="bg-white border border-[var(--border)] rounded-xl p-3 shadow-lg max-w-[300px]">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-5 h-5 rounded bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)]" />
          <div className="text-[10px] text-[var(--muted)] uppercase tracking-wider">{COMPANY.name} · teraz</div>
        </div>
        <div className="font-semibold text-xs mb-1 leading-snug">{title}</div>
        <div className="text-[11px] text-[var(--muted)] leading-snug">{body}</div>
      </div>
    </div>
  );
}

export function EmailPreview({
  subject,
  preheader,
  body,
  cta,
}: {
  subject: string;
  preheader: string;
  body: string;
  cta: string;
}) {
  return (
    <div className="bg-white border border-[var(--border)] rounded-xl overflow-hidden max-w-[380px]">
      <div className="px-4 py-2 border-b border-[var(--border)] bg-[var(--panel-2)] text-[10px] text-[var(--muted)]">
        Od: {COMPANY.name} &lt;hello@nuvera.pl&gt;
      </div>
      <div className="p-4">
        <div className="text-[10px] uppercase tracking-wider text-[var(--muted)] mb-1">Temat</div>
        <div className="font-medium mb-2 leading-snug text-sm">{subject}</div>
        <div className="text-[10px] uppercase tracking-wider text-[var(--muted)] mb-1">Podgląd</div>
        <div className="italic text-[var(--muted)] text-xs mb-3">{preheader}</div>
        <div className="whitespace-pre-wrap leading-relaxed text-xs text-[var(--text)]/90">{body}</div>
        <div className="mt-3 inline-block px-3 py-1.5 rounded bg-[var(--accent)] text-white text-[11px] font-medium">
          {cta}
        </div>
      </div>
    </div>
  );
}

export function SmsPreview({ body }: { body: string }) {
  return (
    <div className="flex flex-col items-center py-1 w-full">
      <div className="w-full max-w-[200px] rounded-[20px] border-2 border-[#e3e6ee] bg-[#f5f6fa] p-2.5">
        <div className="text-[9px] text-[var(--muted)] text-center mb-1">{COMPANY.name}</div>
        <div className="bg-gradient-to-br from-[var(--accent-2)] to-[#a78bfa] text-white text-[10px] leading-snug rounded-2xl rounded-bl-sm px-2.5 py-1.5">
          {body}
        </div>
      </div>
      <div className="text-[10px] text-[var(--muted)] mt-2">{body.length}/160 znaków</div>
    </div>
  );
}
