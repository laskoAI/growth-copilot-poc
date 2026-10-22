"use client";

/** Znak Growth Marketer AI: rosnąca linia wzrostu z iskrą na gradientowym kafelku */
export default function Logo({ size = 32, className = "" }: { size?: number; className?: string }) {
  const icon = Math.round(size * 0.62);
  return (
    <div
      style={{ width: size, height: size, borderRadius: Math.round(size * 0.3) }}
      className={`shrink-0 flex items-center justify-center bg-gradient-to-br from-[#5b7cff] via-[var(--accent)] to-[var(--accent-2)] shadow-[0_4px_12px_rgba(79,107,255,0.35)] ${className}`}
    >
      <svg width={icon} height={icon} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M3.5 17.5 L9 12 L12.5 15 L19 8"
          stroke="white"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M15 8 H19 V12" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        <path
          d="M6 3.2 L6.7 5 L8.5 5.7 L6.7 6.4 L6 8.2 L5.3 6.4 L3.5 5.7 L5.3 5 Z"
          fill="white"
          opacity="0.9"
        />
      </svg>
    </div>
  );
}
