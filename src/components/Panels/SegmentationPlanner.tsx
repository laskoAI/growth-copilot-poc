"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Segment = {
  id: string;
  label: string;
  count: number;
  share: number;
  color: string;
  profile: string;
  reasoning: string;
  channel: string;
  angle: string;
  copyExample: string;
  expectedCtr: number;
};

const segments: Segment[] = [
  {
    id: "big-city",
    label: "Duże miasta · placówki 20+ specjalistów",
    count: 1900,
    share: 19,
    color: "#4f6bff",
    profile: "Warszawa, Kraków, Wrocław, Poznań — POZ z 20+ specjalistami",
    reasoning:
      "Dyrektorzy zalewani mailami sprzedażowymi — zwykły cold mail nie działa. Ale mają największy budżet i ból no-show w PLN.",
    channel: "Email z case study + push web + LinkedIn Ads",
    angle: "Ból finansowy w PLN, case z podobnej placówki wielkomiejskiej",
    copyExample:
      "„Warszawska poradnia z 25 specjalistami zwiększyła przychód z prywatnych o 340 tys. zł/rok. Zobacz case.”",
    expectedCtr: 3.8,
  },
  {
    id: "medium-city",
    label: "Miasta średnie · placówki 10-20 specjalistów",
    count: 3600,
    share: 36,
    color: "#7c5cff",
    profile: "Kielce, Radom, Płock, Tarnów, Kalisz, Legnica — POZ 10-20 specjalistów",
    reasoning:
      "Menedżerowie sami odbierają maile — dobrze reagują na pytania w temacie i konkretne dane. Główny segment kampanii.",
    channel: "Email z pytaniem w temacie + SMS follow-up po 3 dniach",
    angle: "Pytanie w temacie + storytelling (case z podobnej placówki średniej wielkości)",
    copyExample:
      "„Ile godzin lekarzy zjada Wam rejestracja? — 20 min demo dla placówek z 10-20 specjalistami.”",
    expectedCtr: 5.2,
  },
  {
    id: "small",
    label: "Małe miasta · placówki poniżej 10 specjalistów",
    count: 2500,
    share: 25,
    color: "#16a34a",
    profile: "Mniejsze miejscowości — właściciel = dyrektor = często lekarz",
    reasoning:
      "Nie czytają maili sprzedażowych, ale odbierają telefony i SMS. Prosty język, konkret, bez marketingowego stylu.",
    channel: "SMS + call center (bezpośrednio, bez fazy mailowej)",
    angle: "Krótko, konkretnie, bez marketingowej nowomowy",
    copyExample:
      "„Prosty system rejestracji dla POZ. 2 tyg. wdrożenia, bez migracji. Rozmowa 15 min: 800-12-34-56”",
    expectedCtr: 4.5,
  },
  {
    id: "warm-enrichment",
    label: "Enrichment web · wysoki intent (recent search / careers)",
    count: 1200,
    share: 12,
    color: "#d97706",
    profile:
      "Podmioty z RPWDL które ostatnio rekrutowały lekarzy / mają aktywne ogłoszenia rejestratorki",
    reasoning:
      "Aktywna faza rozwoju = otwarci na nowe narzędzia. Sygnał kupujący z zewnątrz Twojej bazy.",
    channel: "Email personalizowany + LinkedIn InMail do dyrektora",
    angle: "„Zauważyłem że rekrutujecie — nasz system pozwala odbierać więcej pacjentów tym samym zespołem”",
    copyExample:
      "„Widzę że rekrutujecie 2 lekarzy w {imie_placowki}. Zanim zwiększycie zespół, sprawdźcie ile pacjentów obsłużycie tym samym składem po wdrożeniu automatyzacji rejestracji.”",
    expectedCtr: 8.4,
  },
  {
    id: "unqualified",
    label: "Niepełne dane / wysokie ryzyko unsub",
    count: 760,
    share: 8,
    color: "#dc2626",
    profile: "Hard bounce, brak telefonu, 2+ kampanie bez otwarcia w ostatnich 12 mies.",
    reasoning:
      "Kampania do nich = strata deliverability domeny i psucie metryk. Najpierw naprawa danych lub pauza.",
    channel: "Suppression 90 dni + data enrichment (RPWDL/LinkedIn)",
    angle: "N/A — brak działania sprzedażowego, ochrona reputacji domeny",
    copyExample: "—",
    expectedCtr: 0,
  },
];

export default function SegmentationPlanner() {
  const total = segments.reduce((a, s) => a + s.count, 0);
  const activeCount = segments.filter((s) => s.id !== "unqualified").reduce((a, s) => a + s.count, 0);
  const [selectedId, setSelectedId] = useState<string>(segments[0].id);
  const current = segments.find((s) => s.id === selectedId) ?? segments[0];

  return (
    <div className="p-8 space-y-6">
      <div>
        <div className="text-xs uppercase tracking-wider text-[var(--muted)] mb-1">
          Plan segmentacji · przed launchem
        </div>
        <h2 className="text-2xl font-semibold">Growth Marketer AI dzieli bazę na 5 podsegmentów</h2>
        <p className="text-sm text-[var(--muted)] mt-2 max-w-3xl">
          Zanim odpalę kampanię, dzielę {total.toLocaleString("pl-PL")} kontaktów na segmenty
          po profilu (miasto, wielkość placówki, sygnały intentu) — każdy dostaje inny kanał
          i inne copy. Nie posyłam jednego maila do wszystkich, bo dyrektor wielkomiejskiego POZ
          i właściciel małej przychodni to dwa różne światy.
        </p>
      </div>

      {/* Pasek proporcji */}
      <div className="bg-[var(--panel)] border border-[var(--border)] rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-xs uppercase tracking-wider text-[var(--muted)]">
            Podział bazy {total.toLocaleString("pl-PL")}
          </div>
          <div className="text-xs text-[var(--muted)]">
            Aktywna kampania: <span className="text-[var(--text)]">{activeCount.toLocaleString("pl-PL")}</span> ·
            Suppression: <span className="text-[var(--text)]">760</span>
          </div>
        </div>
        <div className="h-4 rounded-full overflow-hidden flex bg-[var(--panel-2)] border border-[var(--border)]">
          {segments.map((s) => (
            <motion.div
              key={s.id}
              initial={{ width: 0 }}
              animate={{ width: `${s.share}%` }}
              transition={{ duration: 0.8 }}
              style={{ background: s.color }}
              title={`${s.label}: ${s.count.toLocaleString("pl-PL")}`}
            />
          ))}
        </div>
        <div className="grid grid-cols-5 gap-2 mt-3 text-[10px] text-[var(--muted)]">
          {segments.map((s) => (
            <div key={s.id} className="flex items-start gap-1">
              <span className="mt-0.5" style={{ color: s.color }}>■</span>
              <div className="leading-tight">
                <div className="text-[var(--text)]">{s.count.toLocaleString("pl-PL")}</div>
                <div>{s.share}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lista wyboru + detail */}
      <div className="grid grid-cols-[380px_1fr] gap-4">
        <div className="space-y-2">
          {segments.map((s) => {
            const active = s.id === selectedId;
            return (
              <button
                key={s.id}
                onClick={() => setSelectedId(s.id)}
                className={`w-full text-left rounded-lg px-4 py-3 border transition ${
                  active
                    ? "bg-[var(--panel-2)] border-[var(--accent)]"
                    : "bg-[var(--panel)] border-[var(--border)] hover:border-[#c7cdda]"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: s.color }}
                  />
                  <div className="text-xs font-semibold leading-tight">{s.label}</div>
                </div>
                <div className="flex items-center justify-between text-[10px] text-[var(--muted)] mt-2">
                  <span>{s.channel.split(" +")[0]}</span>
                  <span className="text-[var(--text)]">
                    {s.count.toLocaleString("pl-PL")} · {s.share}%
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="bg-[var(--panel)] border border-[var(--border)] rounded-xl p-6"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: current.color }} />
              <div className="text-xs uppercase tracking-wider text-[var(--muted)]">
                Podsegment
              </div>
            </div>
            <div className="text-lg font-semibold mb-1">{current.label}</div>
            <div className="text-xs text-[var(--muted)] mb-5">{current.profile}</div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-[var(--muted)] mb-1">
                  Dlaczego tak dobrany kanał
                </div>
                <div className="text-sm leading-relaxed text-[var(--text)]/90">
                  {current.reasoning}
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-[var(--muted)] mb-1">
                  Kanał
                </div>
                <div className="text-sm leading-relaxed text-[var(--text)]/90 mb-3">
                  {current.channel}
                </div>
                <div className="text-[10px] uppercase tracking-wider text-[var(--muted)] mb-1">
                  Kąt komunikatu
                </div>
                <div className="text-sm leading-relaxed text-[var(--text)]/90">{current.angle}</div>
              </div>
            </div>

            {current.copyExample !== "—" && (
              <div className="mb-4">
                <div className="text-[10px] uppercase tracking-wider text-[var(--muted)] mb-2">
                  Przykładowe copy
                </div>
                <div
                  className="bg-[var(--panel-2)] border-l-2 rounded-md p-3 text-sm italic leading-relaxed"
                  style={{ borderColor: current.color }}
                >
                  {current.copyExample}
                </div>
              </div>
            )}

            {current.expectedCtr > 0 && (
              <div className="flex items-center justify-between bg-[var(--panel-2)] rounded-md px-4 py-3 border border-[var(--border)]">
                <div className="text-xs text-[var(--muted)]">Prognozowany CTR</div>
                <div className="text-xl font-semibold" style={{ color: current.color }}>
                  {current.expectedCtr}%
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="bg-[var(--panel)] border border-[var(--border)] rounded-xl p-5">
        <div className="text-xs uppercase tracking-wider text-[var(--muted)] mb-2">
          Prognoza kampanii łącznie
        </div>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <div className="text-xs text-[var(--muted)]">Aktywnych w kampanii</div>
            <div className="text-2xl font-semibold">{activeCount.toLocaleString("pl-PL")}</div>
          </div>
          <div>
            <div className="text-xs text-[var(--muted)]">Prognozowany łączny CTR</div>
            <div className="text-2xl font-semibold text-[var(--accent)]">4,9%</div>
          </div>
          <div>
            <div className="text-xs text-[var(--muted)]">Prognoza spotkań (7 dni)</div>
            <div className="text-2xl font-semibold text-[var(--accent-2)]">~180</div>
          </div>
          <div>
            <div className="text-xs text-[var(--muted)]">Suppression / naprawa danych</div>
            <div className="text-2xl font-semibold text-[#dc2626]">760</div>
          </div>
        </div>
      </div>
    </div>
  );
}
