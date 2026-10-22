"use client";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

type Row = {
  id: string;
  label: string;
  count: number;
  color: string;
  ctr: number;
  meetings: number;
  costPerMeeting: number;
  performance: "excellent" | "good" | "underperform" | "off";
  insight: string;
};

const rows: Row[] = [
  {
    id: "warm-enrichment",
    label: "Enrichment · recent search / careers",
    count: 1200,
    color: "#d97706",
    ctr: 9.1,
    meetings: 52,
    costPerMeeting: 34,
    performance: "excellent",
    insight:
      "Zwycięzca kampanii. Segment znaleziony poza HubSpot — placówki które ostatnio rekrutowały. CTR 9,1% to 2× powyżej średniej. Rekomendacja: skalować 3× w następnej fali i przenieść wszystkie leady do HubSpota jako „POZ · high intent”.",
  },
  {
    id: "medium-city",
    label: "Miasta średnie · 10-20 specjalistów",
    count: 3600,
    color: "#7c5cff",
    ctr: 5.8,
    meetings: 78,
    costPerMeeting: 41,
    performance: "good",
    insight:
      "Główny driver spotkań (78 z 180). Pytanie w temacie zadziałało — subject „Ile godzin lekarzy zjada Wam rejestracja?” dał open rate 34%. Rekomendacja: druga fala z tym samym subject line, ale z case study zamiast pytania w bodym.",
  },
  {
    id: "small",
    label: "Małe miasta · <10 specjalistów",
    count: 2500,
    color: "#16a34a",
    ctr: 4.2,
    meetings: 38,
    costPerMeeting: 58,
    performance: "good",
    insight:
      "SMS + call center zadziałał zgodnie z prognozą. 38 spotkań, koszt na spotkanie 58 zł — najwyższy w kampanii przez czas handlowca, ale konwersja rozmowa→demo aż 24%. Rekomendacja: utrzymać ten kanał, dodać drugi SMS follow-up po 5 dniach dla tych którzy nie odebrali telefonu.",
  },
  {
    id: "big-city",
    label: "Duże miasta · 20+ specjalistów",
    count: 1900,
    color: "#4f6bff",
    ctr: 2.4,
    meetings: 12,
    costPerMeeting: 156,
    performance: "underperform",
    insight:
      "Underperformer. CTR 2,4% vs prognoza 3,8%. Push web działa (52% open), ale copy „340 tys. zł/rok” brzmi jak clickbait dla dyrektorów szpitali — nie wierzą. Rekomendacja: druga fala z bardziej stonowanym case (procent zamiast PLN) + LinkedIn InMail od C-level w Twojej firmie.",
  },
  {
    id: "unqualified",
    label: "Suppression / naprawa danych",
    count: 760,
    color: "#dc2626",
    ctr: 0,
    meetings: 0,
    costPerMeeting: 0,
    performance: "off",
    insight:
      "Nie wysyłaliśmy nic. Data enrichment odzyskał 320 kontaktów (poprawne numery telefonów z RPWDL) — wchodzą do następnej fali. Reszta: suppression trwa.",
  },
];

const perfLabel: Record<Row["performance"], string> = {
  excellent: "★ Zwycięzca",
  good: "✓ Zgodnie z prognozą",
  underperform: "⚠ Underperform",
  off: "— Pominięte",
};

const perfColor: Record<Row["performance"], string> = {
  excellent: "#d97706",
  good: "#16a34a",
  underperform: "#dc2626",
  off: "var(--muted)",
};

export default function SegmentPerformanceReport() {
  const totalMeetings = rows.reduce((a, r) => a + r.meetings, 0);
  const chartData = rows
    .filter((r) => r.meetings > 0)
    .map((r) => ({ name: r.label.split(" ·")[0], Spotkania: r.meetings, CTR: r.ctr }));

  return (
    <div className="p-8 space-y-6">
      <div>
        <div className="text-xs uppercase tracking-wider text-[var(--muted)] mb-1">
          Raport per segment · dzień 7
        </div>
        <h2 className="text-2xl font-semibold">
          {totalMeetings} spotkań umówionych ·{" "}
          <span className="text-[var(--muted)] text-lg">rozbicie po podsegmentach</span>
        </h2>
        <p className="text-sm text-[var(--muted)] mt-2 max-w-3xl">
          Kampania rozbita na 5 podsegmentów zadziałała — poniżej analiza per segment
          z inteligentnymi rekomendacjami na drugą falę. Segmentacja od początku pozwala
          zobaczyć realną wartość każdego kanału.
        </p>
      </div>

      {/* KPI top */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-[var(--panel)] border border-[var(--border)] rounded-xl p-5">
          <div className="text-xs text-[var(--muted)]">Umówione spotkania</div>
          <div className="text-3xl font-semibold text-[var(--accent)]">{totalMeetings}</div>
          <div className="text-[10px] text-[var(--muted)] mt-1">prognoza była ~180 — trafione</div>
        </div>
        <div className="bg-[var(--panel)] border border-[var(--border)] rounded-xl p-5">
          <div className="text-xs text-[var(--muted)]">Łączny CTR</div>
          <div className="text-3xl font-semibold text-[var(--accent-2)]">5,1%</div>
          <div className="text-[10px] text-[var(--muted)] mt-1">
            vs 1,2% przy jednym mailu do wszystkich = 4,2× lepiej
          </div>
        </div>
        <div className="bg-[var(--panel)] border border-[var(--border)] rounded-xl p-5">
          <div className="text-xs text-[var(--muted)]">Zwycięski segment</div>
          <div className="text-3xl font-semibold text-[#d97706]">Enrichment</div>
          <div className="text-[10px] text-[var(--muted)] mt-1">CTR 9,1%, 52 spotkania z 1 200</div>
        </div>
        <div className="bg-[var(--panel)] border border-[var(--border)] rounded-xl p-5">
          <div className="text-xs text-[var(--muted)]">Underperformer</div>
          <div className="text-3xl font-semibold text-[#dc2626]">Duże miasta</div>
          <div className="text-[10px] text-[var(--muted)] mt-1">CTR 2,4% vs prognoza 3,8%</div>
        </div>
      </div>

      {/* Wykres */}
      <div className="bg-[var(--panel)] border border-[var(--border)] rounded-xl p-5 h-[260px]">
        <div className="text-sm text-[var(--muted)] mb-3">Spotkania per segment</div>
        <ResponsiveContainer width="100%" height="85%">
          <BarChart data={chartData}>
            <CartesianGrid stroke="#e8eaf0" strokeDasharray="3 3" />
            <XAxis dataKey="name" stroke="#6b7280" fontSize={11} />
            <YAxis stroke="#6b7280" fontSize={11} />
            <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #e8eaf0" }} />
            <Bar dataKey="Spotkania" fill="#4f6bff" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Per segment insights */}
      <div className="space-y-3">
        {rows.map((r, i) => (
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
              <span
                className="text-[10px] px-2 py-0.5 rounded border"
                style={{ color: perfColor[r.performance], borderColor: perfColor[r.performance] }}
              >
                {perfLabel[r.performance]}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-4 text-xs">
              <div>
                <div className="text-[var(--muted)]">Wysłane</div>
                <div className="text-[var(--text)] text-lg font-semibold">
                  {r.count.toLocaleString("pl-PL")}
                </div>
              </div>
              <div>
                <div className="text-[var(--muted)]">CTR</div>
                <div className="text-[var(--text)] text-lg font-semibold" style={{ color: r.color }}>
                  {r.ctr > 0 ? `${r.ctr}%` : "—"}
                </div>
              </div>
              <div>
                <div className="text-[var(--muted)]">Spotkania</div>
                <div className="text-[var(--text)] text-lg font-semibold">{r.meetings}</div>
              </div>
              <div>
                <div className="text-[var(--muted)]">Koszt / spotkanie</div>
                <div className="text-[var(--text)] text-lg font-semibold">
                  {r.costPerMeeting > 0 ? `${r.costPerMeeting} zł` : "—"}
                </div>
              </div>
            </div>

            <div className="bg-[var(--panel-2)] border-l-2 rounded-md p-3 text-sm leading-relaxed">
              <span className="text-[var(--muted)] mr-2">Insight AI:</span>
              {r.insight}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Rekomendacje na drugą falę */}
      <div className="bg-gradient-to-br from-[var(--panel)] to-[var(--panel-2)] border border-[var(--accent)]/40 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] flex items-center justify-center text-white text-xs font-bold">
            AI
          </div>
          <div className="text-xs uppercase tracking-wider text-[var(--accent)]">
            Rekomendacje na drugą falę
          </div>
        </div>
        <ol className="text-sm leading-relaxed space-y-3 list-decimal list-inside">
          <li>
            <span className="text-[var(--text)] font-medium">Skalować „Enrichment · recent search” 3×</span> —
            zaciągnąć kolejne 3 600 podmiotów z RPWDL z aktywnymi ogłoszeniami rekrutacyjnymi. Prognoza: +140 spotkań.
          </li>
          <li>
            <span className="text-[var(--text)] font-medium">Naprawić „Duże miasta”</span> — zmienić copy z twardej
            liczby PLN na miękki case („X placówek w Warszawie już…”) + LinkedIn InMail od C-level. Prognoza: CTR z 2,4% → ~4%.
          </li>
          <li>
            <span className="text-[var(--text)] font-medium">Utrzymać „Miasta średnie” i „Małe miasta”</span> — druga
            fala z tym samym subjectem/kanałem, tylko z case study zamiast pytania. Prognoza: +90 spotkań łącznie.
          </li>
          <li>
            <span className="text-[var(--text)] font-medium">Wrócić do 320 naprawionych kontaktów</span> z suppression —
            data enrichment dał poprawne telefony, wchodzą do SMS + call center dla małych miast.
          </li>
        </ol>
        <div className="mt-5 flex gap-2 flex-wrap">
          <button className="px-4 py-2 rounded-md bg-[var(--accent)] text-white text-sm font-medium">
            Odpal drugą falę wg rekomendacji
          </button>
          <button className="px-4 py-2 rounded-md bg-[var(--panel-2)] border border-[var(--border)] text-sm hover:bg-[#eef1fb]">
            Wrzuć wszystkie leady do HubSpota
          </button>
          <button className="px-4 py-2 rounded-md border border-[var(--border)] text-sm hover:bg-[var(--panel-2)]">
            Eksport raportu PDF
          </button>
        </div>
      </div>
    </div>
  );
}
