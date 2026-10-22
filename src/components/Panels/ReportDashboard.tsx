"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useStore } from "@/lib/store";
import { computeMetrics, dailySeries } from "@/lib/metrics";

function Stat({ label, value, hint, color }: { label: string; value: string; hint?: string; color?: string }) {
  return (
    <div className="bg-[var(--panel)] border border-[var(--border)] rounded-xl p-5">
      <div className="text-xs text-[var(--muted)] mb-1">{label}</div>
      <div className="text-2xl font-semibold" style={{ color }}>{value}</div>
      {hint && <div className="text-xs text-[var(--muted)] mt-1">{hint}</div>}
    </div>
  );
}

function useCounter(target: number, duration = 1200) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setV(Math.round(target * p));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return v;
}

export default function ReportDashboard() {
  const { emailCount, smsCount, weekAdvanced } = useStore();
  const { email, sms } = computeMetrics(emailCount, smsCount);

  // Podczas trwania kampanii (przed przewinięciem) pokazujemy wyniki cząstkowe (~30%),
  // po przewinięciu tygodnia — pełne.
  const factor = weekAdvanced ? 1 : 0.3;
  const eOpens = useCounter(Math.round(email.opens * factor));
  const eClicks = useCounter(Math.round(email.clicks * factor));
  const sOpens = useCounter(Math.round(sms.opens * factor));
  const sClicks = useCounter(Math.round(sms.clicks * factor));
  const meetings = useCounter(Math.round((email.meetings + sms.meetings) * factor));

  const data = [
    { name: "Wysłane", Email: email.sent, SMS: sms.sent },
    { name: "Dostarczone", Email: email.delivered, SMS: sms.delivered },
    { name: "Otwarcia", Email: Math.round(email.opens * factor), SMS: Math.round(sms.opens * factor) },
    { name: "Kliknięcia", Email: Math.round(email.clicks * factor), SMS: Math.round(sms.clicks * factor) },
    { name: "Spotkania", Email: Math.round(email.meetings * factor), SMS: Math.round(sms.meetings * factor) },
  ];

  const series = dailySeries(email.clicks + sms.clicks, weekAdvanced ? 7 : 2);

  return (
    <div className="p-8">
      <div className="text-xs uppercase tracking-wider text-[var(--muted)] mb-1">Raportowanie</div>
      <h2 className="text-2xl font-semibold mb-6">
        Kampania na żywo {weekAdvanced && <span className="text-sm text-[var(--muted)] ml-2">· dzień 7</span>}
      </h2>

      <div className="grid grid-cols-5 gap-4 mb-6">
        <Stat label="Email — otwarcia" value={eOpens.toLocaleString("pl-PL")} hint={`${email.openRate}% open rate`} color="var(--accent)" />
        <Stat label="Email — kliknięcia" value={eClicks.toLocaleString("pl-PL")} hint={`${email.ctr}% CTR`} color="var(--accent)" />
        <Stat label="SMS — otwarcia" value={sOpens.toLocaleString("pl-PL")} hint={`${sms.openRate}% open rate`} color="var(--accent-2)" />
        <Stat label="SMS — kliknięcia" value={sClicks.toLocaleString("pl-PL")} hint={`${sms.ctr}% CTR`} color="var(--accent-2)" />
        <Stat label="Spotkania" value={meetings.toLocaleString("pl-PL")} hint="konwersja CTA" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="col-span-2 bg-[var(--panel)] border border-[var(--border)] rounded-xl p-5 h-[320px]"
        >
          <div className="text-sm text-[var(--muted)] mb-3">Wyniki wg etapu lejka</div>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={data}>
              <CartesianGrid stroke="#e8eaf0" strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #e8eaf0" }} />
              <Bar dataKey="Email" fill="#4f6bff" radius={[4, 4, 0, 0]} />
              <Bar dataKey="SMS" fill="#7c5cff" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <div className="bg-[var(--panel)] border border-[var(--border)] rounded-xl p-5 h-[320px]">
          <div className="text-sm text-[var(--muted)] mb-3">Kliknięcia — timeline</div>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={series}>
              <CartesianGrid stroke="#e8eaf0" strokeDasharray="3 3" />
              <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #e8eaf0" }} />
              <Bar dataKey="value" fill="#4f6bff" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
