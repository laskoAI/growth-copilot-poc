"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Bucket = {
  id: string;
  title: string;
  count: number;
  subtitle: string;
  color: string;
  action: string;
  details: string[];
};

const buckets: Bucket[] = [
  {
    id: "booked",
    title: "Umówili spotkanie",
    count: 50,
    subtitle: "konwersja z kampanii",
    color: "#16a34a",
    action: "Odfiltrowani — nie wysyłamy nic więcej",
    details: [
      "Przypięci do handlowca w HubSpot",
      "Status: „Meeting booked”",
      "Wykluczeni z dalszych wysyłek automatycznych",
    ],
  },
  {
    id: "clickers",
    title: "Kliknęli w mail, brak akcji",
    count: 1100,
    subtitle: "silny sygnał zakupowy",
    color: "var(--accent)",
    action: "Retarget: druga kreacja + warm lead do HubSpot",
    details: [
      "Otworzyli mail + kliknęli link do landing page",
      "Nie umówili spotkania w ciągu 7 dni",
      "Rekomendacja: druga kreacja („redukcja no-show”) w SMS + follow-up e-mail za 3 dni",
      "Sygnał wystarczający, by przekazać jako warm lead do sprzedaży — handlowcy mogą obdzwonić",
    ],
  },
  {
    id: "cold",
    title: "Nie kliknęli w mail",
    count: 10000,
    subtitle: "zimna baza",
    color: "#6b7280",
    action: "Nurkuję głębiej — segmentacja zamiast obdzwonki 10k",
    details: [
      "10 000 obdzwonki to za dużo — 4 handlowców tego nie obsłuży",
      "Zanim wrzucę to call center, rozbijam bazę na podsegmenty",
      "Dla każdego podsegmentu inne copy + inny kanał re-engagement",
      "Dopiero to co nie zareaguje idzie na call center — realnie 1-2k zamiast 10k",
    ],
  },
];

// Drill-down zimnej bazy 10 000 na podsegmenty
type ColdSegment = {
  id: string;
  label: string;
  count: number;
  share: number;
  reasoning: string;
  channel: string;
  angle: string;
  copyExample: string;
  color: string;
};

const coldSegments: ColdSegment[] = [
  {
    id: "big-city",
    label: "Duże miasta · placówki 20+ specjalistów",
    count: 2100,
    share: 21,
    reasoning:
      "Duże POZ w Warszawie/Krakowie/Wrocławiu. Dyrektorzy zalewani mailami sprzedażowymi — dlatego nie otwierają. Ale mają największy budżet i największy ból no-show.",
    channel: "Push web + LinkedIn Ads (nie SMS, nie kolejny mail)",
    angle: "Ból finansowy w PLN, case z podobnej placówki wielkomiejskiej",
    copyExample:
      "„Warszawska poradnia z 25 specjalistami zwiększyła przychód z prywatnych o 340 tys. zł/rok. Zobacz case.”",
    color: "#4f6bff",
  },
  {
    id: "medium-city",
    label: "Miasta średnie · placówki 10-20 specjalistów",
    count: 3800,
    share: 38,
    reasoning:
      "Kielce, Radom, Płock, Tarnów. Menedżerowie sami odbierają maile — brak otwarcia najczęściej oznacza zły subject line, nie brak zainteresowania.",
    channel: "Nowy mail za 5 dni + SMS jako fallback po 3 dniach",
    angle: "Pytanie w temacie + storytelling (case z podobnej placówki średniej wielkości)",
    copyExample:
      "„Ile godzin lekarzy zjada Wam rejestracja? — 20 min demo dla placówek z 10-20 specjalistami.”",
    color: "#7c5cff",
  },
  {
    id: "small",
    label: "Małe miasta · placówki poniżej 10 specjalistów",
    count: 2600,
    share: 26,
    reasoning:
      "Mniejsze POZ w mniejszych miejscowościach. Właściciel = dyrektor = często lekarz. Nie czytają maili sprzedażowych, ale odbierają telefony i SMS.",
    channel: "SMS + telefon (call center) w drugiej kolejności",
    angle: "Krótko, konkretnie, bez marketingowej nowomowy",
    copyExample:
      "„Prosty system rejestracji dla POZ. 2 tyg. wdrożenia, bez migracji. Rozmowa 15 min: 800-12-34-56”",
    color: "#16a34a",
  },
  {
    id: "no-contact",
    label: "Brak telefonu w HubSpot / niepoprawny email",
    count: 800,
    share: 8,
    reasoning:
      "Dane niekompletne albo hard bounce. Nie ma sensu inwestować w kampanię — najpierw wzbogacenie danych z RPWDL/LinkedIn.",
    channel: "Data enrichment przez Growth Marketer AI (najpierw naprawa danych)",
    angle: "N/A — brak działania sprzedażowego",
    copyExample: "—",
    color: "#6b7280",
  },
  {
    id: "unsub-risk",
    label: "Wysokie ryzyko unsub (2+ kampanie bez otwarcia)",
    count: 700,
    share: 7,
    reasoning:
      "Kontakty które już 2-3 razy nie otworzyły naszych maili. Kolejna wysyłka psuje deliverability domeny — lepiej ich uśpić.",
    channel: "Suppression list — pauza na 90 dni",
    angle: "N/A — chroni deliverability pozostałej bazy",
    copyExample: "—",
    color: "#dc2626",
  },
];

export default function SegmentBreakdown() {
  const total = buckets.reduce((a, b) => a + b.count, 0);
  const [drillDown, setDrillDown] = useState(false);
  const [selectedSeg, setSelectedSeg] = useState<string>(coldSegments[0].id);
  const currentSeg = coldSegments.find((s) => s.id === selectedSeg) ?? coldSegments[0];

  const callCenterCount = coldSegments
    .filter((s) => s.channel.toLowerCase().includes("call"))
    .reduce((a, s) => a + s.count, 0);

  return (
    <div className="p-8 space-y-6">
      <div>
        <div className="text-xs uppercase tracking-wider text-[var(--muted)] mb-1">
          Segmentacja po zachowaniu · dzień 7
        </div>
        <h2 className="text-2xl font-semibold">Growth Marketer AI dzieli bazę na 3 kubełki</h2>
        <p className="text-sm text-[var(--muted)] mt-2 max-w-3xl">
          Z {total.toLocaleString("pl-PL")} wysłanych wiadomości wyodrębniam trzy segmenty
          po zachowaniu. Dla „nie kliknęli w mail” mam ważny komentarz — nie posyłajmy 10&nbsp;000 na obdzwonkę.
        </p>
      </div>

      {/* Wizualny lejek */}
      <div className="bg-[var(--panel)] border border-[var(--border)] rounded-xl p-6">
        <div className="text-xs uppercase tracking-wider text-[var(--muted)] mb-4">Podział bazy</div>
        <div className="h-4 rounded-full overflow-hidden flex bg-[var(--panel-2)] border border-[var(--border)]">
          {buckets.map((b) => (
            <motion.div
              key={b.id}
              initial={{ width: 0 }}
              animate={{ width: `${(b.count / total) * 100}%` }}
              transition={{ duration: 0.8 }}
              style={{ background: b.color }}
              title={`${b.title}: ${b.count.toLocaleString("pl-PL")}`}
            />
          ))}
        </div>
        <div className="flex justify-between text-xs text-[var(--muted)] mt-2">
          {buckets.map((b) => (
            <span key={b.id}>
              <span style={{ color: b.color }}>■</span> {b.title}: {b.count.toLocaleString("pl-PL")}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {buckets.map((b, i) => (
          <motion.div
            key={b.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 * i }}
            className="bg-[var(--panel)] border border-[var(--border)] rounded-xl p-5 flex flex-col"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: b.color }} />
              <div className="text-xs uppercase tracking-wider text-[var(--muted)]">{b.title}</div>
            </div>
            <div className="text-4xl font-semibold" style={{ color: b.color }}>
              {b.count.toLocaleString("pl-PL")}
            </div>
            <div className="text-xs text-[var(--muted)] mt-1 mb-4">{b.subtitle}</div>

            <div className="text-xs uppercase tracking-wider text-[var(--muted)] mb-2">Następny krok</div>
            <div className="text-sm font-medium mb-3 leading-snug" style={{ color: b.color }}>
              {b.action}
            </div>
            <ul className="text-xs text-[var(--muted)] space-y-1.5 mt-auto">
              {b.details.map((d, j) => (
                <li key={j} className="flex gap-2">
                  <span style={{ color: b.color }}>•</span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {/* Inteligentna rekomendacja + drill-down */}
      <div className="bg-gradient-to-br from-[var(--panel)] to-[var(--panel-2)] border border-[var(--accent)]/40 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] flex items-center justify-center text-white text-xs font-bold">
            AI
          </div>
          <div className="text-xs uppercase tracking-wider text-[var(--accent)]">
            Komentarz Growth Marketer AI
          </div>
        </div>
        <p className="text-sm leading-relaxed text-[var(--text)] mb-4">
          Zanim wrzucisz 10&nbsp;000 osób na obdzwonkę — to za dużo dla Twoich 4 handlowców
          (realnie obsłużą ~200 rozmów tygodniowo). Ci ludzie <span className="text-[var(--accent)]">nie kliknęli w mail</span>,
          więc obdzwonka „na sucho” będzie miała słabą konwersję. Zanurkowałem w tę bazę i widzę
          wyraźne różnice: placówki z dużych miast reagują inaczej niż z małych, a ~1 500 kontaktów
          w ogóle nie powinno tam być (bounce/unsub). Proponuję <span className="text-[var(--accent)]">rozbić 10&nbsp;000 na 5 podsegmentów</span>,
          każdy dostaje inny kanał re-engagement i inne copy — dopiero to co nie zareaguje idzie na call center.
          Efekt: <span className="text-[var(--accent)]">~{callCenterCount.toLocaleString("pl-PL")} realnej obdzwonki</span> zamiast 10&nbsp;000.
        </p>
        <button
          onClick={() => setDrillDown((v) => !v)}
          className="px-4 py-2 rounded-md bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90"
        >
          {drillDown ? "Ukryj drill-down" : "Pokaż 5 podsegmentów zimnej bazy →"}
        </button>
      </div>

      <AnimatePresence>
        {drillDown && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            <div className="bg-[var(--panel)] border border-[var(--border)] rounded-xl p-6">
              <div className="text-xs uppercase tracking-wider text-[var(--muted)] mb-3">
                Rozbicie 10 000 „zimnych&quot; na podsegmenty
              </div>

              {/* Pasek proporcji */}
              <div className="h-3 rounded-full overflow-hidden flex bg-[var(--panel-2)] border border-[var(--border)] mb-4">
                {coldSegments.map((s) => (
                  <div
                    key={s.id}
                    style={{ width: `${s.share}%`, background: s.color }}
                    title={`${s.label}: ${s.count.toLocaleString("pl-PL")}`}
                  />
                ))}
              </div>

              {/* Lista wyboru podsegmentu */}
              <div className="space-y-2 mb-6">
                {coldSegments.map((s) => {
                  const active = s.id === selectedSeg;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setSelectedSeg(s.id)}
                      className={`w-full text-left rounded-lg px-4 py-3 border transition flex items-center gap-4 ${
                        active
                          ? "bg-[var(--panel-2)] border-[var(--accent)]"
                          : "bg-transparent border-[var(--border)] hover:border-[#c7cdda]"
                      }`}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ background: s.color }}
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium">{s.label}</div>
                        <div className="text-xs text-[var(--muted)] mt-0.5">{s.channel}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold" style={{ color: s.color }}>
                          {s.count.toLocaleString("pl-PL")}
                        </div>
                        <div className="text-[10px] text-[var(--muted)]">{s.share}%</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Szczegóły wybranego podsegmentu */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSeg.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="bg-[var(--panel-2)] border border-[var(--border)] rounded-xl p-5"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ background: currentSeg.color }}
                    />
                    <div className="text-sm font-semibold">{currentSeg.label}</div>
                    <div className="ml-auto text-xs text-[var(--muted)]">
                      {currentSeg.count.toLocaleString("pl-PL")} kontaktów
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-[var(--muted)] mb-1">
                        Dlaczego nie kliknęli
                      </div>
                      <div className="text-sm text-[var(--text)]/90 leading-relaxed">
                        {currentSeg.reasoning}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-[var(--muted)] mb-1">
                        Kanał re-engagement
                      </div>
                      <div className="text-sm text-[var(--text)]/90 leading-relaxed">
                        {currentSeg.channel}
                      </div>
                      <div className="text-[10px] uppercase tracking-wider text-[var(--muted)] mt-3 mb-1">
                        Kąt komunikatu
                      </div>
                      <div className="text-sm text-[var(--text)]/90 leading-relaxed">
                        {currentSeg.angle}
                      </div>
                    </div>
                  </div>

                  {currentSeg.copyExample !== "—" && (
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-[var(--muted)] mb-2">
                        Przykładowe copy dla tego podsegmentu
                      </div>
                      <div
                        className="bg-[var(--panel)] border-l-2 rounded-md p-3 text-sm italic leading-relaxed"
                        style={{ borderColor: currentSeg.color }}
                      >
                        {currentSeg.copyExample}
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Podsumowanie planu */}
            <div className="bg-[var(--panel)] border border-[var(--border)] rounded-xl p-6">
              <div className="text-xs uppercase tracking-wider text-[var(--muted)] mb-3">
                Plan działania dla zimnej bazy
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="text-xs text-[var(--muted)]">Re-engagement cyfrowy</div>
                  <div className="text-2xl font-semibold text-[var(--accent)]">7 900</div>
                  <div className="text-[10px] text-[var(--muted)] mt-1">
                    push, mail #2, SMS — dopasowane copy per miasto
                  </div>
                </div>
                <div>
                  <div className="text-xs text-[var(--muted)]">Call center (realna obdzwonka)</div>
                  <div className="text-2xl font-semibold text-[var(--accent-2)]">
                    {callCenterCount.toLocaleString("pl-PL")}
                  </div>
                  <div className="text-[10px] text-[var(--muted)] mt-1">
                    małe miasta + fallback tych co nie zareagują na re-engagement
                  </div>
                </div>
                <div>
                  <div className="text-xs text-[var(--muted)]">Wykluczone / naprawa danych</div>
                  <div className="text-2xl font-semibold text-[#dc2626]">1 500</div>
                  <div className="text-[10px] text-[var(--muted)] mt-1">
                    suppression + data enrichment
                  </div>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <button className="px-4 py-2 rounded-md bg-[var(--accent)] text-white text-sm font-medium">
                  Odpal re-engagement dla 5 podsegmentów
                </button>
                <button className="px-4 py-2 rounded-md bg-[var(--panel-2)] border border-[var(--border)] text-sm hover:bg-[#eef1fb]">
                  Wrzuć {callCenterCount.toLocaleString("pl-PL")} do call center
                </button>
                <button className="px-4 py-2 rounded-md border border-[var(--border)] text-sm hover:bg-[var(--panel-2)]">
                  Pauza 1 500 kontaktów (suppression)
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
