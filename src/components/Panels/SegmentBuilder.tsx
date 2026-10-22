"use client";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { getFacilities, applyFilters } from "@/lib/fakeData";

const FILTER_LABELS: Record<string, string> = {
  knownDoctor: "Znany lekarz",
  minSpecialists: "Powyżej 10 specjalistów",
  bigCitiesOnly: "Duże miasta",
  invoicesPaid: "Opłacone faktury",
};

function AnimatedNumber({ value }: { value: number }) {
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0.4, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      {value.toLocaleString("pl-PL")}
    </motion.span>
  );
}

export default function SegmentBuilder() {
  const { filters, segmentCount } = useStore();
  const facilities = useMemo(() => getFacilities(), []);
  const filtered = useMemo(() => applyFilters(facilities, filters), [facilities, filters]);
  const preview = filtered.slice(0, 25);

  const active = Object.keys(filters).filter((k) => (filters as Record<string, unknown>)[k]);

  const count = segmentCount || filtered.length;

  return (
    <div className="p-8 h-full flex flex-col gap-6">
      <div>
        <div className="text-xs uppercase tracking-wider text-[var(--muted)] mb-1">
          HubSpot · Segment
        </div>
        <h2 className="text-2xl font-semibold">Placówki POZ</h2>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1 bg-[var(--panel)] border border-[var(--border)] rounded-xl p-5">
          <div className="text-xs text-[var(--muted)] mb-2">W bazie ogółem</div>
          <div className="text-2xl font-semibold">
            {facilities.length.toLocaleString("pl-PL")}
          </div>
          <div className="mt-4 text-xs text-[var(--muted)] mb-2">Po filtrach</div>
          <div className="text-4xl font-semibold text-[var(--accent)]">
            <AnimatedNumber value={count} />
          </div>
        </div>

        <div className="col-span-2 bg-[var(--panel)] border border-[var(--border)] rounded-xl p-5">
          <div className="text-xs text-[var(--muted)] mb-3">Aktywne filtry</div>
          <div className="flex flex-wrap gap-2">
            {active.length === 0 && (
              <div className="text-sm text-[var(--muted)]">Brak — Growth Marketer AI za chwilę je doda…</div>
            )}
            {active.map((k) => (
              <motion.span
                key={k}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-xs px-3 py-1.5 rounded-full bg-[var(--panel-2)] border border-[var(--border)]"
              >
                {FILTER_LABELS[k] ?? k}
              </motion.span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 bg-[var(--panel)] border border-[var(--border)] rounded-xl overflow-hidden">
        <div className="grid grid-cols-12 text-xs uppercase text-[var(--muted)] px-5 py-3 border-b border-[var(--border)]">
          <div className="col-span-4">Placówka</div>
          <div className="col-span-2">Miasto</div>
          <div className="col-span-2">Specjaliści</div>
          <div className="col-span-2">Znany lekarz</div>
          <div className="col-span-2">Faktury</div>
        </div>
        <div className="divide-y divide-[var(--border)] max-h-[420px] overflow-y-auto">
          {preview.map((r) => (
            <div key={r.id} className="grid grid-cols-12 px-5 py-2 text-sm">
              <div className="col-span-4 truncate">{r.name}</div>
              <div className="col-span-2">{r.city}</div>
              <div className="col-span-2">{r.specialists}</div>
              <div className="col-span-2">{r.knownDoctor ? "Tak" : "Nie"}</div>
              <div className="col-span-2">{r.invoicesPaid ? "Opłacone" : "Zaległe"}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
