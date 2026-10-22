"use client";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";

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

export default function BaseProposal() {
  const { baseAccepted, setBaseAccepted } = useStore();

  const hubspot = 3120;
  const enriched = 6840;
  const total = hubspot + enriched;

  return (
    <div className="p-8 space-y-6">
      <div>
        <div className="text-xs uppercase tracking-wider text-[var(--muted)] mb-1">
          Propozycja bazy odbiorców
        </div>
        <h2 className="text-2xl font-semibold">
          Growth Marketer AI zbudował bazę pod Twój cel
        </h2>
        <p className="text-sm text-[var(--muted)] mt-2 max-w-3xl">
          Cel: <span className="text-[var(--text)]">więcej umówionych dem dla sprzedawców</span> ·
          Produkt: <span className="text-[var(--text)]">System do zarządzania POZ (rejestracja, grafik, NFZ + prywatni)</span>.
          Poniżej dwie warstwy bazy — zaakceptuj, żeby przejść do kreacji.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[var(--panel)] border border-[var(--border)] rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs uppercase tracking-wider text-[var(--muted)]">
              Warstwa 1 · Twój HubSpot
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--panel-2)] border border-[var(--border)] text-[var(--accent)]">
              first-party
            </span>
          </div>
          <div className="text-4xl font-semibold text-[var(--accent)]">
            <AnimatedNumber value={hubspot} />
          </div>
          <div className="text-xs text-[var(--muted)] mt-1">kontaktów z Twojej bazy</div>
          <div className="mt-4 text-xs uppercase tracking-wider text-[var(--muted)] mb-2">
            Kryteria doboru
          </div>
          <ul className="text-sm space-y-1.5">
            <li className="flex gap-2"><span className="text-[var(--accent)]">•</span> Placówki POZ + NZOZ z profilem „decision maker”</li>
            <li className="flex gap-2"><span className="text-[var(--accent)]">•</span> Powyżej 10 specjalistów w placówce</li>
            <li className="flex gap-2"><span className="text-[var(--accent)]">•</span> Opłacone faktury w ostatnich 12 mies.</li>
            <li className="flex gap-2"><span className="text-[var(--accent)]">•</span> Historia otwarć maila / kliknięć w SMS (engagement &gt; 0)</li>
            <li className="flex gap-2"><span className="text-[var(--accent)]">•</span> Brak aktywnego demo w ostatnich 6 mies. (nie kanibalizujemy pipeline’u)</li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[var(--panel)] border border-[var(--border)] rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs uppercase tracking-wider text-[var(--muted)]">
              Warstwa 2 · Enrichment z internetu
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--panel-2)] border border-[var(--border)] text-[var(--accent-2)]">
              third-party
            </span>
          </div>
          <div className="text-4xl font-semibold text-[var(--accent-2)]">
            <AnimatedNumber value={enriched} />
          </div>
          <div className="text-xs text-[var(--muted)] mt-1">nowych podmiotów leczniczych spoza Twojej bazy</div>
          <div className="mt-4 text-xs uppercase tracking-wider text-[var(--muted)] mb-2">
            Źródła danych
          </div>
          <ul className="text-sm space-y-1.5">
            <li className="flex gap-2"><span className="text-[var(--accent-2)]">•</span> Rejestr Podmiotów Wykonujących Działalność Leczniczą (RPWDL)</li>
            <li className="flex gap-2"><span className="text-[var(--accent-2)]">•</span> Publiczne dane NFZ o kontraktach POZ</li>
            <li className="flex gap-2"><span className="text-[var(--accent-2)]">•</span> Strony www placówek + LinkedIn (kontakty do dyrektorów)</li>
            <li className="flex gap-2"><span className="text-[var(--accent-2)]">•</span> Znany-Lekarz.pl (opinie, liczba specjalistów)</li>
            <li className="flex gap-2"><span className="text-[var(--accent-2)]">•</span> KRS + CEIDG (wielkość podmiotu, decision maker)</li>
          </ul>
        </motion.div>
      </div>

      <div className="bg-[var(--panel)] border border-[var(--border)] rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-[var(--muted)] mb-1">
              Łączna baza rekomendowana
            </div>
            <div className="text-3xl font-semibold">
              <AnimatedNumber value={total} /> <span className="text-sm text-[var(--muted)]">kontaktów</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-[var(--muted)]">Szacowana konwersja na dem</div>
            <div className="text-2xl font-semibold text-[var(--accent)]">~180-240</div>
            <div className="text-xs text-[var(--muted)]">spotkań w 4 tygodnie</div>
          </div>
        </div>

        <div className="h-3 rounded-full overflow-hidden bg-[var(--panel-2)] border border-[var(--border)] flex">
          <div className="bg-[var(--accent)]" style={{ width: `${(hubspot / total) * 100}%` }} />
          <div className="bg-[var(--accent-2)]" style={{ width: `${(enriched / total) * 100}%` }} />
        </div>
        <div className="flex justify-between text-xs text-[var(--muted)] mt-2">
          <span>HubSpot: {hubspot.toLocaleString("pl-PL")}</span>
          <span>Enrichment web: {enriched.toLocaleString("pl-PL")}</span>
        </div>

        <div className="mt-6 flex gap-2">
          <button
            onClick={() => setBaseAccepted(true)}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              baseAccepted
                ? "bg-[var(--panel-2)] border border-[var(--border)] text-[var(--muted)]"
                : "bg-[var(--accent)] text-white hover:opacity-90"
            }`}
          >
            {baseAccepted ? "Baza zaakceptowana ✓" : "Akceptuję bazę"}
          </button>
          <button className="px-4 py-2 rounded-md border border-[var(--border)] text-sm hover:bg-[var(--panel-2)]">
            Zawęź kryteria
          </button>
          <button className="px-4 py-2 rounded-md border border-[var(--border)] text-sm hover:bg-[var(--panel-2)]">
            Pokaż próbkę 50 rekordów
          </button>
        </div>
      </div>
    </div>
  );
}
