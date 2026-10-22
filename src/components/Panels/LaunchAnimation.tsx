"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";

export default function LaunchAnimation() {
  const { emailCount, smsCount, launched } = useStore();
  const total = emailCount + smsCount;
  const [sent, setSent] = useState(0);

  useEffect(() => {
    if (!launched) return;
    let n = 0;
    const step = Math.max(1, Math.round(total / 60));
    const iv = setInterval(() => {
      n = Math.min(total, n + step);
      setSent(n);
      if (n >= total) clearInterval(iv);
    }, 50);
    return () => clearInterval(iv);
  }, [launched, total]);

  const pct = Math.round((sent / total) * 100);

  return (
    <div className="p-8 h-full flex flex-col items-center justify-center">
      <div className="text-xs uppercase tracking-wider text-[var(--muted)] mb-4">
        Uruchamianie kampanii
      </div>
      <div className="w-full max-w-xl bg-[var(--panel)] border border-[var(--border)] rounded-xl p-8 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] mb-6"
        />
        <div className="text-4xl font-semibold mb-1">
          {sent.toLocaleString("pl-PL")} / {total.toLocaleString("pl-PL")}
        </div>
        <div className="text-sm text-[var(--muted)] mb-6">wiadomości wysłanych</div>
        <div className="h-2 rounded-full overflow-hidden bg-[var(--panel-2)]">
          <motion.div
            animate={{ width: `${pct}%` }}
            className="h-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)]"
          />
        </div>
        <div className="mt-6 flex justify-between text-xs text-[var(--muted)]">
          <span>Email: {emailCount.toLocaleString("pl-PL")}</span>
          <span>SMS: {smsCount.toLocaleString("pl-PL")}</span>
        </div>
      </div>
    </div>
  );
}
