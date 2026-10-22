"use client";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

type Row = {
  id: string;
  label: string;
  color: string;
  wave1: { count: number; ctr: number; meetings: number };
  wave2: { count: number; ctr: number; meetings: number };
  change: string;
  insight: string;
};

const rows: Row[] = [
  {
    id: "warm-enrichment",
    label: "Enrichment · recent search / careers",
    color: "#d97706",
    wave1: { count: 1200, ctr: 9.1, meetings: 52 },
    wave2: { count: 4800, ctr: 8.6, meetings: 198 },
    change: "3× wolumen, CTR trzyma się na 8,6%",
    insight:
      "Hipoteza potwierdzona — skalowanie 3× nie zabiło CTR. 198 spotkań z jednej listy zaciągniętej z RPWDL. To najbardziej niedowartościowany segment w Twoim rynku, warto zbudować pod niego stały pipeline enrichmentu (cotygodniowy scrape ogłoszeń rekrutacyjnych).",
  },
  {
    id: "big-city",
    label: "Duże miasta · 20+ specjalistów",
    color: "#4f6bff",
    wave1: { count: 1900, ctr: 2.4, meetings: 12 },
    wave2: { count: 1900, ctr: 4.1, meetings: 28 },
    change: "CTR 2,4% → 4,1% (+71%)",
    insight:
      "Naprawa zadziałała. Miękki case („12 warszawskich placówek już…”) + LinkedIn InMail od CEO dały +16 spotkań. Dalej to nie jest zwycięzca, ale przestał palić budżet. Rekomendacja: utrzymać ten format, nie skalować dopóki CTR nie osiągnie 5,5%+.",
  },
  {
    id: "medium-city",
    label: "Miasta średnie · 10-20 specjalistów",
    color: "#7c5cff",
    wave1: { count: 3600, ctr: 5.8, meetings: 78 },
    wave2: { count: 3600, ctr: 5.4, meetings: 74 },
    change: "CTR stabilny, -4 spotkania",
    insight:
      "Case study zamiast pytania w subject dał podobny wynik — publiczność wysycona po fali 1. Rekomendacja: zmienić kąt na kolejnej fali (redukcja no-show zamiast ROI czasu), inaczej wchodzimy w dekay.",
  },
  {
    id: "small",
    label: "Małe miasta · <10 specjalistów",
    color: "#16a34a",
    wave1: { count: 2500, ctr: 4.2, meetings: 38 },
    wave2: { count: 2500, ctr: 3.9, meetings: 34 },
    change: "Delikatny spadek",
    insight:
      "SMS + call center dalej działa. Drugi SMS follow-up po 5 dniach odzyskał 22 kontakty, które nie odebrały pierwszej rozmowy. Handlowcy w tym segmencie mają ~24% konwersję rozmowa→demo — najlepsza w kampanii.",
  },
  {
    id: "recovered",
    label: "Naprawione dane (fala 1 → suppression)",
    color: "#8b5cf6",
    wave1: { count: 0, ctr: 0, meetings: 0 },
    wave2: { count: 320, ctr: 3.6, meetings: 8 },
    change: "Nowy segment · data enrichment",
    insight:
      "320 kontaktów z hard bounce w fali 1 dostało poprawne numery telefonów z RPWDL. 8 spotkań — nie rewelacja, ale to leady, które w klasycznej kampanii byłyby stracone.",
  },
];

export default function Wave2Report() {
  const totalW1 = rows.reduce((a, r) => a + r.wave1.meetings, 0);
  const totalW2 = rows.reduce((a, r) => a + r.wave2.meetings, 0);
  const totalCombined = totalW1 + totalW2;
  const growth = Math.round(((totalW2 - totalW1) / totalW1) * 100);

  const chartData = rows
    .filter((r) => r.wave1.meetings + r.wave2.meetings > 0)
    .map((r) => ({
      name: r.label.split(" ·")[0],
      "Fala 1": r.wave1.meetings,
      "Fala 2": r.wave2.meetings,
    }));

  return (
    <div className="p-8 space-y-6">
      <div>
        <div className="text-xs uppercase tracking-wider text-[var(--muted)] mb-1">
          Wyniki drugiej fali · dzień 14
        </div>
        <h2 className="text-2xl font-semibold">
          {totalW2} spotkań w fali 2 ·{" "}
          <span className="text-[var(--muted)] text-lg">
            łącznie {totalCombined} z obu fal
          </span>
        </h2>
        <p className="text-sm text-[var(--muted)] mt-2 max-w-3xl">
          Druga fala odpalona zgodnie z rekomendacjami z tygodnia 1. Wolumen wzrósł 2×
          dzięki skalowaniu zwycięzcy, spotkania +{growth}%. Poniżej porównanie fala 1 vs fala 2
          i wnioski na kolejny krok.
        </p>
      </div>

      {/* KPI comparison */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-[var(--panel)] border border-[var(--border)] rounded-xl p-5">
          <div className="text-xs text-[var(--muted)]">Spotkania fala 1</div>
          <div className="text-3xl font-semibold">{totalW1}</div>
        </div>
        <div className="bg-[var(--panel)] border border-[var(--border)] rounded-xl p-5">
          <div className="text-xs text-[var(--muted)]">Spotkania fala 2</div>
          <div className="text-3xl font-semibold text-[var(--accent)]">{totalW2}</div>
          <div className="text-[10px] text-[#16a34a] mt-1">+{growth}% vs fala 1</div>
        </div>
        <div className="bg-[var(--panel)] border border-[var(--border)] rounded-xl p-5">
          <div className="text-xs text-[var(--muted)]">Łącznie po 2 falach</div>
          <div className="text-3xl font-semibold text-[var(--accent-2)]">{totalCombined}</div>
          <div className="text-[10px] text-[var(--muted)] mt-1">
            handlowcy: ~35 dem/tydz każdy
          </div>
        </div>
        <div className="bg-[var(--panel)] border border-[var(--border)] rounded-xl p-5">
          <div className="text-xs text-[var(--muted)]">Koszt / spotkanie</div>
          <div className="text-3xl font-semibold text-[#16a34a]">38 zł</div>
          <div className="text-[10px] text-[var(--muted)] mt-1">
            fala 1: 47 zł · spadek -19%
          </div>
        </div>
      </div>

      {/* Wykres porównawczy */}
      <div className="bg-[var(--panel)] border border-[var(--border)] rounded-xl p-5 h-[280px]">
        <div className="text-sm text-[var(--muted)] mb-3">
          Spotkania per segment · fala 1 vs fala 2
        </div>
        <ResponsiveContainer width="100%" height="85%">
          <BarChart data={chartData}>
            <CartesianGrid stroke="#e8eaf0" strokeDasharray="3 3" />
            <XAxis dataKey="name" stroke="#6b7280" fontSize={11} />
            <YAxis stroke="#6b7280" fontSize={11} />
            <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #e8eaf0" }} />
            <Legend />
            <Bar dataKey="Fala 1" fill="#4f6bff" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Fala 2" fill="#d97706" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Per segment */}
      <div className="space-y-3">
        {rows.map((r, i) => {
          const delta = r.wave2.meetings - r.wave1.meetings;
          const isNew = r.wave1.meetings === 0 && r.wave2.meetings > 0;
          return (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bg-[var(--panel)] border border-[var(--border)] rounded-xl p-5"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: r.color }} />
                <div className="font-semibold text-sm flex-1">{r.label}</div>
                <span className="text-[10px] text-[var(--muted)]">{r.change}</span>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-4 text-xs">
                <div>
                  <div className="text-[var(--muted)]">Wysłane (fala 2)</div>
                  <div className="text-[var(--text)] text-lg font-semibold">
                    {r.wave2.count.toLocaleString("pl-PL")}
                  </div>
                </div>
                <div>
                  <div className="text-[var(--muted)]">CTR fala 1 → 2</div>
                  <div className="text-[var(--text)] text-lg font-semibold">
                    {r.wave1.ctr > 0 ? `${r.wave1.ctr}%` : "—"} →{" "}
                    <span style={{ color: r.color }}>{r.wave2.ctr}%</span>
                  </div>
                </div>
                <div>
                  <div className="text-[var(--muted)]">Spotkania fala 2</div>
                  <div className="text-[var(--text)] text-lg font-semibold">{r.wave2.meetings}</div>
                </div>
                <div>
                  <div className="text-[var(--muted)]">Delta</div>
                  <div
                    className="text-lg font-semibold"
                    style={{
                      color: isNew ? r.color : delta > 0 ? "#16a34a" : delta < 0 ? "#dc2626" : "var(--muted)",
                    }}
                  >
                    {isNew ? "nowy" : delta > 0 ? `+${delta}` : delta}
                  </div>
                </div>
              </div>

              <div className="bg-[var(--panel-2)] border-l-2 rounded-md p-3 text-sm leading-relaxed">
                <span className="text-[var(--muted)] mr-2">Insight AI:</span>
                {r.insight}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Rekomendacje fala 3 */}
      <div className="bg-gradient-to-br from-[var(--panel)] to-[var(--panel-2)] border border-[var(--accent)]/40 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] flex items-center justify-center text-white text-xs font-bold">
            AI
          </div>
          <div className="text-xs uppercase tracking-wider text-[var(--accent)]">
            Co dalej — plan fali 3
          </div>
        </div>
        <p className="text-sm leading-relaxed text-[var(--text)] mb-4">
          Krzywa uczenia się jest już bardzo dobra: łącznie {totalCombined} spotkań w 14 dni,
          koszt na spotkanie spadł z 47 zł do 38 zł. Widzę teraz trzy dźwignie, które
          jeszcze nie zostały wykorzystane.
        </p>
        <ol className="text-sm leading-relaxed space-y-3 list-decimal list-inside">
          <li>
            <span className="text-[var(--text)] font-medium">
              Zbudować stały pipeline enrichmentu „recent hiring”
            </span>{" "}
            — cotygodniowy scrape RPWDL + LinkedIn ogłoszeń. Estymacja: ~800 nowych
            kontaktów/tydz z CTR ~8%. To będzie Twój nowy #1 kanał.
          </li>
          <li>
            <span className="text-[var(--text)] font-medium">
              Zmienić kąt dla miast średnich (segment się nasyca)
            </span>{" "}
            — kreacja „redukcja no-show” zamiast „ROI czasu lekarza”. Prognoza: CTR wróci
            do 6%+, +30 spotkań.
          </li>
          <li>
            <span className="text-[var(--text)] font-medium">
              Uruchomić lookalike w LinkedIn Ads na bazie 250 kontaktów, które umówiły demo
            </span>{" "}
            — nowe źródło, jeszcze niedotknięte, szacunek 400-600 dodatkowych sesji na landing page.
          </li>
          <li>
            <span className="text-[var(--text)] font-medium">
              Odpuścić duże miasta w tej kampanii
            </span>{" "}
            — CTR 4,1% to sub-optimal dla wysokiego kosztu LinkedIn Ads. Wrócić do nich
            osobną kampanią z produktem premium.
          </li>
        </ol>
        <div className="mt-5 flex gap-2 flex-wrap">
          <button className="px-4 py-2 rounded-md bg-[var(--accent)] text-white text-sm font-medium">
            Odpal falę 3 wg rekomendacji
          </button>
          <button className="px-4 py-2 rounded-md bg-[var(--panel-2)] border border-[var(--border)] text-sm hover:bg-[#eef1fb]">
            Ustaw stały pipeline enrichmentu
          </button>
          <button className="px-4 py-2 rounded-md border border-[var(--border)] text-sm hover:bg-[var(--panel-2)]">
            Eksport podsumowania 2 fal (PDF)
          </button>
        </div>
      </div>
    </div>
  );
}
