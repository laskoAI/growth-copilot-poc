"use client";
import { motion } from "framer-motion";
import { RAW_TABLES, DUPLICATE_CUSTOMER_EXAMPLE } from "@/lib/rawSamples";
import { MATCH_RATE } from "@/lib/scenario";
import { fmtPct } from "@/lib/format";
import RawDataTable from "@/components/ui/RawDataTable";
import Details from "@/components/ui/Details";

export default function DataSources() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <div className="text-xs uppercase tracking-wider text-[var(--muted)] mb-1">Krok 1 · Cel i dane</div>
        <h2 className="text-2xl font-semibold">4 źródła, jeden klient</h2>
        <p className="text-sm text-[var(--muted)] mt-2 max-w-2xl">
          Narzędzie do wysyłek widzi tylko swój kawałek obrazu. Agent łączy je z zamówieniami, aplikacją i obsługą
          klienta — po surowych, niespójnych danych.
        </p>
      </div>

      <div className="bg-[var(--panel)] border border-[var(--border)] rounded-xl p-6 flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-wider text-[var(--muted)] mb-1">Dopasowanie klientów</div>
          <div className="text-4xl font-semibold text-[var(--accent)]">{fmtPct(MATCH_RATE, 0)}</div>
          <div className="text-xs text-[var(--muted)] mt-1">rekordów połączonych w jednego klienta</div>
        </div>
        <div className="text-right text-xs text-[var(--muted)] max-w-xs leading-relaxed">
          Przykład: {DUPLICATE_CUSTOMER_EXAMPLE.viaEmail} i {DUPLICATE_CUSTOMER_EXAMPLE.viaPhone} to{" "}
          {DUPLICATE_CUSTOMER_EXAMPLE.name}.
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {RAW_TABLES.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <RawDataTable table={t} />
          </motion.div>
        ))}
      </div>

      <Details title="Szczegóły mapowania pól">
        <ul className="space-y-1.5">
          <li>• e-mail (sklep, GetResponse) ↔ user_pseudo_id (aplikacja) ↔ telefon (Zendesk)</li>
          <li>• daty ujednolicone mimo 3 różnych formatów w samym eksporcie zamówień</li>
          <li>• kody rabatowe (np. WROC20) dopasowane do kampanii z GetResponse po dacie wysyłki</li>
          <li>• status_k i seg2 — pola bez dokumentacji, potwierdzone wprost w rozmowie</li>
        </ul>
      </Details>
    </div>
  );
}
