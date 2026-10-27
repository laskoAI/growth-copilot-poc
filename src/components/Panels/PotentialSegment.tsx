"use client";
import { motion } from "framer-motion";
import { COMPANY, GOAL_PROMPT, ONE_TIME_BUYERS_90D } from "@/lib/scenario";
import { fmtNumber } from "@/lib/format";

function AnimatedNumber({ value }: { value: number }) {
  return (
    <motion.span key={value} initial={{ opacity: 0.3, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      {fmtNumber(value)}
    </motion.span>
  );
}

export default function PotentialSegment() {
  const share = ONE_TIME_BUYERS_90D / COMPANY.totalCustomers;
  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-10">
      <div className="text-xs uppercase tracking-wider text-[var(--muted)] mb-2">Największy potencjał</div>
      <div className="text-6xl font-semibold text-[var(--accent)] mb-3">
        <AnimatedNumber value={ONE_TIME_BUYERS_90D} />
      </div>
      <p className="text-[var(--text)] max-w-lg leading-relaxed">
        klientów {COMPANY.name} kupiło <span className="font-medium">dokładnie raz</span> w ostatnich 90 dniach i
        nie wróciło.
      </p>

      <div className="mt-8 w-full max-w-md">
        <div className="h-3 rounded-full overflow-hidden bg-[var(--panel-2)] border border-[var(--border)]">
          <div className="h-full bg-[var(--accent)]" style={{ width: `${Math.round(share * 100)}%` }} />
        </div>
        <div className="flex justify-between text-xs text-[var(--muted)] mt-2">
          <span>z {fmtNumber(COMPANY.totalCustomers)} klientów ogółem</span>
          <span>{Math.round(share * 100)}%</span>
        </div>
      </div>

      <div className="mt-8 max-w-md bg-[var(--panel)] border border-[var(--border)] rounded-xl p-4 text-left">
        <div className="text-[10px] uppercase tracking-wider text-[var(--muted)] mb-1.5">
          Cel: „{GOAL_PROMPT}”
        </div>
        <p className="text-xs text-[var(--muted)] leading-relaxed">
          Dlatego ta grupa: już raz kupili i znają markę — są bliżej kolejnego zamówienia niż ktokolwiek, kto
          jeszcze nic nie kupił.
        </p>
      </div>
    </div>
  );
}
