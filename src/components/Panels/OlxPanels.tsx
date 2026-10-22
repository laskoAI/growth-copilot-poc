"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ---------- wspólne ---------- */

const OLX_TEAL = "#002f34";
const OLX_GREEN = "#23e5db";

function Header({ eyebrow, title, badge }: { eyebrow: string; title: string; badge?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span
            className="text-[10px] font-black tracking-tight px-1.5 py-0.5 rounded"
            style={{ background: OLX_TEAL, color: OLX_GREEN }}
          >
            OLX
          </span>
          <span className="text-xs uppercase tracking-wider text-[var(--muted)]">{eyebrow}</span>
        </div>
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      </div>
      {badge}
    </div>
  );
}

function Card({ title, children, className = "" }: { title?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-[var(--panel)] border border-[var(--border)] rounded-xl p-5 ${className}`}>
      {title && <div className="text-sm font-semibold mb-4">{title}</div>}
      {children}
    </div>
  );
}

function Stat({ label, value, sub, tone }: { label: string; value: string; sub?: string; tone?: "good" | "accent" }) {
  const color = tone === "good" ? "text-[#16a34a]" : tone === "accent" ? "text-[var(--accent)]" : "";
  return (
    <div className="bg-[var(--panel)] border border-[var(--border)] rounded-xl p-4">
      <div className="text-xs text-[var(--muted)]">{label}</div>
      <div className={`text-2xl font-semibold mt-1 tracking-tight ${color}`}>{value}</div>
      {sub && <div className="text-[11px] text-[var(--muted)] mt-1">{sub}</div>}
    </div>
  );
}

function Pill({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "good" | "accent" | "warn" }) {
  const map = {
    neutral: "bg-[var(--panel-2)] text-[var(--muted)] border-[var(--border)]",
    good: "bg-[#e8f7ee] text-[#15803d] border-[#c6ecd4]",
    accent: "bg-[#eef1ff] text-[var(--accent)] border-[#d9defe]",
    warn: "bg-[#fff6e6] text-[#b45309] border-[#fde3b0]",
  };
  return <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border ${map[tone]}`}>{children}</span>;
}

const wrap = "p-8 max-w-4xl mx-auto";

/* ---------- 1. Diagnoza lejka ---------- */

export function OlxDiagnosis() {
  const funnel = [
    { label: "Rejestracja", value: 420000, pct: 100 },
    { label: "Ogląda ogłoszenia", value: 256200, pct: 61 },
    { label: "Obserwuje ogłoszenie", value: 75600, pct: 18 },
    { label: "Pisze do sprzedającego", value: 37800, pct: 9 },
    { label: "Kupuje z Przesyłką OLX", value: 13440, pct: 3.2 },
  ];
  return (
    <div className={wrap}>
      <Header eyebrow="Diagnoza · nowi użytkownicy" title="Lejek pierwszego zakupu (14 dni)" />
      <div className="grid grid-cols-3 gap-3 mb-5">
        <Stat label="Rejestracje / mies." value="420 tys." />
        <Stat label="Konwersja do zakupu" value="3,2%" sub="w 14 dni od rejestracji" />
        <Stat label="Piszą do sprzedającego" value="9%" sub="ale tylko co trzeci kupuje" />
      </div>
      <Card title="Gdzie tracimy użytkowników">
        <div className="space-y-3">
          {funnel.map((f, i) => (
            <div key={f.label}>
              <div className="flex justify-between text-sm mb-1.5">
                <span>{f.label}</span>
                <span className="text-[var(--muted)]">
                  {f.value.toLocaleString("pl-PL")} · <b className="text-[var(--text)]">{f.pct.toLocaleString("pl-PL")}%</b>
                </span>
              </div>
              <div className="h-3 rounded-full bg-[var(--panel-2)] overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(f.pct, 2)}%` }}
                  transition={{ delay: i * 0.15, duration: 0.6 }}
                  className="h-full rounded-full"
                  style={{ background: i === 4 ? "#dc2626" : `linear-gradient(90deg, ${OLX_TEAL}, #0b7a75)` }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-lg bg-[#fff6e6] border border-[#fde3b0] p-3 text-sm text-[#92400e] leading-6">
          <b>Największa strata:</b> z 37,8 tys. osób, które piszą do sprzedającego, kupuje tylko 13,4 tys.
          Ludzie są już blisko zakupu i odpadają.
        </div>
      </Card>
    </div>
  );
}

/* ---------- 2. Rekomendacja kategorii i baza ---------- */

export function OlxBase() {
  const cats = [
    { n: "Elektronika", users: 190000, conv: 2.1, why: "Dużo pytań do sprzedających, strach przed zepsutym sprzętem", pick: true },
    { n: "Moda", users: 140000, conv: 2.8, why: "Małe, lekkie rzeczy, a większość umawia się na odbiór osobisty", pick: true },
    { n: "Dla dzieci", users: 70000, conv: 3.0, why: "Rodzice kupują często, ale ostrożnie", pick: true },
    { n: "Dom i ogród", users: 95000, conv: 1.4, why: "Dużo rzeczy za dużych na paczkę", pick: false },
    { n: "Motoryzacja", users: 60000, conv: 0.9, why: "Części tak, ale większość to gabaryty i auta", pick: false },
    { n: "Nieruchomości, Praca", users: 55000, conv: 0, why: "Przesyłka nie ma tu zastosowania", pick: false },
  ];
  return (
    <div className={wrap}>
      <Header eyebrow="Tylko nowi użytkownicy · do 30 dni" title="Na jakich kategoriach się skupić" badge={<Pill tone="accent">400 tys. osób</Pill>} />
      <Card title="Kategorie nowych użytkowników">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-[var(--muted)]">
              <th className="pb-2 font-medium">Kategoria</th>
              <th className="pb-2 font-medium text-right">Nowi</th>
              <th className="pb-2 font-medium text-right pr-4">Kupuje z Przesyłką</th>
              <th className="pb-2 font-medium">Dlaczego</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {cats.map((c, i) => (
              <motion.tr key={c.n} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.08 }} className={c.pick ? "" : "opacity-50"}>
                <td className="py-2.5">
                  <div className="flex items-center gap-2">
                    {c.pick ? <span className="text-[var(--accent)]">✓</span> : <span className="text-[var(--muted)]">–</span>}
                    <span className="font-medium">{c.n}</span>
                  </div>
                </td>
                <td className="py-2.5 text-right">{(c.users / 1000).toLocaleString("pl-PL")} tys.</td>
                <td className="py-2.5 text-right pr-4">{c.conv ? `${c.conv.toLocaleString("pl-PL")}%` : "nie dotyczy"}</td>
                <td className="py-2.5 text-xs text-[var(--muted)]">{c.why}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 rounded-lg bg-[#eef1ff] border border-[#d9defe] p-3 text-sm text-[#2f3a8f] leading-6">
          <b>Rekomendacja:</b> Elektronika, Moda i Dla dzieci. Dużo nowych ludzi, rzeczy dobre do paczki i największa luka między zainteresowaniem a zakupem z Przesyłką.
        </div>
      </Card>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <Card title="Baza do kampanii">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-[var(--muted)]">Nowi w 3 kategoriach</span><span className="font-medium">400 tys.</span></div>
            <div className="flex justify-between"><span className="text-[var(--muted)]">Grupa kontrolna (10%)</span><span className="font-medium">−40 tys.</span></div>
            <div className="flex justify-between pt-2 border-t border-[var(--border)]"><span className="font-medium">Do kampanii</span><span className="text-lg font-semibold">360 tys.</span></div>
          </div>
          <div className="text-[11px] text-[var(--muted)] mt-2">Bez osób bez zgód marketingowych i w trakcie reklamacji</div>
        </Card>
        <Card title="Założenia">
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between"><span className="text-[var(--muted)]">Kto</span><span className="font-medium">Nowi, do 30 dni</span></div>
            <div className="flex justify-between"><span className="text-[var(--muted)]">Cel</span><span className="font-medium">Zakup z Przesyłką</span></div>
            <div className="flex justify-between"><span className="text-[var(--muted)]">Kanały</span><span className="font-medium text-right">Mail, push,<br />Tinkerbell, SMS</span></div>
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ---------- 2b. Podgrupy (maks. 3) ---------- */

type Group = {
  id: "g1" | "g2" | "g3";
  name: string;
  size: number;
  color: string;
  who: string;
  insight: string;
  creative: string;
  angle: string;
  mail: Msg;
  push: Msg;
  tb: Msg;
  ab: { a: { label: string; text: string }; b: { label: string; text: string } };
  channels: { ch: Ch; n: number; why: string }[];
};

export const OLX_GROUPS: Group[] = [
  {
    id: "g1",
    name: "Łowcy okazji",
    size: 150000,
    color: "#4f6bff",
    who: "Elektronika, Moda · obserwują ogłoszenia i czekają na lepszą cenę",
    insight: "Porównują ceny, obserwują po kilka ogłoszeń naraz. Ruszają ich konkretne liczby.",
    creative: "Okazja nie poczeka",
    angle: "Cena i pilność",
    mail: {
      title: "Cena spadła: iPhone 13, który obserwujesz, jest tańszy o 200 zł",
      body: "Cześć Marek,\n\niPhone 13 128 GB, którego obserwujesz, kosztuje teraz 1 899 zł zamiast 2 099 zł.\n\nKup z Przesyłką OLX, a paczka może być u Ciebie już w czwartek.",
      cta: "Kup teraz z Przesyłką",
    },
    push: { title: "iPhone 13 tańszy o 200 zł 🔥", body: "Ogłoszenie, które obserwujesz, kosztuje teraz 1 899 zł. Kup z Przesyłką." },
    tb: { title: "Cena spadła w obserwowanym ogłoszeniu", body: "iPhone 13 128 GB: teraz 1 899 zł (było 2 099 zł). Kup od razu z Przesyłką OLX.", cta: "Zobacz ogłoszenie" },
    ab: {
      a: { label: "Ile oszczędzasz", text: "iPhone 13, który obserwujesz, jest tańszy o 200 zł" },
      b: { label: "Inni też patrzą", text: "iPhone 13, który obserwujesz, ogląda teraz 14 osób. I jest tańszy o 200 zł" },
    },
    channels: [
      { ch: "Push", n: 60000, why: "pushe otwierają 3× częściej niż maile, wieczorem" },
      { ch: "Email", n: 45000, why: "pushe wyłączone, maile otwierają" },
      { ch: "Tinkerbell", n: 22000, why: "ignorują mail i push, ale są codziennie w aplikacji" },
      { ch: "SMS", n: 8000, why: "brak aplikacji, klikali w SMS-y" },
    ],
  },
  {
    id: "g2",
    name: "Ostrożni",
    size: 130000,
    color: "#7c5cff",
    who: "Dla dzieci i droższa Elektronika · boją się kupić od obcej osoby",
    insight: "Długo oglądają, czytają opisy i opinie, rzadko piszą. Blokuje ich strach przed oszustwem.",
    creative: "Kup bez ryzyka",
    angle: "Zaufanie",
    mail: {
      title: "Kupuj spokojnie: jeśli coś będzie nie tak, oddamy Ci pieniądze",
      body: "Cześć Kasia,\n\nwózek Cybex, który obserwujesz, możesz kupić z Przesyłką OLX i Pakietem Ochronnym. Pieniądze trafiają do sprzedającego dopiero wtedy, gdy potwierdzisz, że wszystko jest w porządku.\n\nJeśli przedmiot nie zgadza się z opisem, oddamy Ci całą kwotę.",
      cta: "Kup bezpiecznie",
    },
    push: { title: "Kupuj bez ryzyka 🛡", body: "Wózek Cybex z Pakietem Ochronnym: jeśli coś będzie nie tak, oddamy pieniądze." },
    tb: { title: "Ten zakup jest chroniony", body: "Kupując z Przesyłką OLX, masz Pakiet Ochronny. Płacisz sprzedającemu dopiero, gdy wszystko się zgadza.", cta: "Kup z ochroną" },
    ab: {
      a: { label: "Zwrot pieniędzy", text: "Jeśli coś będzie nie tak, oddamy Ci pieniądze" },
      b: { label: "Inni już tak kupują", text: "2 mln osób kupiło już z Pakietem Ochronnym. Ty też możesz" },
    },
    channels: [
      { ch: "Email", n: 62000, why: "czytają maile, głównie rano" },
      { ch: "Push", n: 30000, why: "maile ignorują, pushe otwierają" },
      { ch: "Tinkerbell", n: 18000, why: "aktywni w aplikacji, maile i pushe bez reakcji" },
      { ch: "SMS", n: 7000, why: "brak aplikacji, zgoda na SMS" },
    ],
  },
  {
    id: "g3",
    name: "Prawie kupili",
    size: 40000,
    color: "#db2777",
    who: "Napisali do sprzedającego i nie kupili w 48 h",
    insight: "Najgorętsza grupa. Coś ich zatrzymało tuż przed zakupem: brak odpowiedzi, wątpliwość albo zwykłe zapomnienie.",
    creative: "Dokończ zakup",
    angle: "Domknięcie",
    mail: {
      title: "Kurtka, o którą pytałaś, wciąż na Ciebie czeka",
      body: "Cześć Ola,\n\nsprzedająca odpowiedziała na Twoją wiadomość. Kurtka Zara jest nadal dostępna.\n\nKup ją z Przesyłką OLX, a paczka będzie w automacie obok Ciebie za 2 dni.",
      cta: "Dokończ zakup",
    },
    push: { title: "Kurtka wciąż na Ciebie czeka 🧥", body: "Sprzedająca odpowiedziała. Kup z Przesyłką, paczka za 2 dni." },
    tb: { title: "Sprzedająca odpowiedziała", body: "Kurtka Zara, o którą pytałaś, jest nadal dostępna. Kup od razu z Przesyłką OLX.", cta: "Dokończ zakup" },
    ab: {
      a: { label: "Sprzedawca czeka", text: "Sprzedająca odpowiedziała. Kurtka wciąż na Ciebie czeka" },
      b: { label: "Wygoda", text: "Kup jednym kliknięciem, paczka będzie w automacie obok za 2 dni" },
    },
    channels: [
      { ch: "Tinkerbell", n: 22000, why: "codziennie w aplikacji, łapiemy ich w sesji" },
      { ch: "Push", n: 9000, why: "wyszli z aplikacji, pushe otwierają" },
      { ch: "Email", n: 4000, why: "maile otwierają, pushe wyłączone" },
      { ch: "SMS", n: 1000, why: "brak aplikacji" },
    ],
  },
];

const SUPPRESSED = { name: "Bez reakcji", size: 80000, who: "Nie otwierają niczego od rejestracji. Do nich nie piszemy." };

export function OlxSegments() {
  const total = OLX_GROUPS.reduce((a, g) => a + g.size, 0) + SUPPRESSED.size;
  return (
    <div className={wrap}>
      <Header eyebrow="Podgrupy w bazie 400 tys." title="3 grupy, które znalazłem" />
      <div className="h-3 rounded-full overflow-hidden flex mb-2">
        {OLX_GROUPS.map((g) => (
          <motion.div key={g.id} initial={{ width: 0 }} animate={{ width: `${(g.size / total) * 100}%` }} style={{ background: g.color }} />
        ))}
        <motion.div initial={{ width: 0 }} animate={{ width: `${(SUPPRESSED.size / total) * 100}%` }} className="bg-[#d1d5db]" />
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[var(--muted)] mb-5">
        {OLX_GROUPS.map((g) => (
          <span key={g.id} className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: g.color }} />{g.name} · {Math.round((g.size / total) * 100)}%</span>
        ))}
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#d1d5db]" />{SUPPRESSED.name} · {Math.round((SUPPRESSED.size / total) * 100)}%</span>
      </div>
      <div className="space-y-3">
        {OLX_GROUPS.map((g, i) => (
          <motion.div key={g.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-[var(--panel)] border border-[var(--border)] rounded-xl p-4 flex gap-4">
            <span className="w-1.5 rounded-full" style={{ background: g.color }} />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">{i + 1}. {g.name}</div>
                <div className="text-sm font-semibold">{(g.size / 1000).toLocaleString("pl-PL")} tys.</div>
              </div>
              <div className="text-xs text-[var(--muted)] mt-0.5">{g.who}</div>
              <div className="text-xs mt-2 leading-5 text-[#374151]">💡 {g.insight}</div>
            </div>
          </motion.div>
        ))}
        <div className="rounded-xl border border-dashed border-[var(--border)] p-4 text-sm text-[var(--muted)] flex justify-between">
          <span><b className="text-[var(--text)]">{SUPPRESSED.name}</b> · {(SUPPRESSED.size / 1000).toLocaleString("pl-PL")} tys.</span>
          <span>{SUPPRESSED.who}</span>
        </div>
      </div>
      <div className="mt-4 rounded-xl bg-[#eef1ff] border border-[#d9defe] p-4 text-sm text-[#2f3a8f] leading-6">
        Każda grupa dostanie swój komunikat. Kanał dobiorę każdej osobie osobno, według tego, na co reagowała wcześniej.
      </div>
    </div>
  );
}

/* ---------- 3a. Komunikat dla każdej grupy ---------- */

function GroupTabs({ active, setActive }: { active: number; setActive: (i: number) => void }) {
  return (
    <div className="grid grid-cols-3 gap-2 mb-5">
      {OLX_GROUPS.map((g, i) => (
        <button
          key={g.id}
          onClick={() => setActive(i)}
          className={`text-left rounded-xl border p-3 transition ${i === active ? "bg-[#eef1ff] ring-4 ring-[#eef1ff]" : "bg-[var(--panel)] hover:border-[#c7cdda]"}`}
          style={{ borderColor: i === active ? g.color : "var(--border)" }}
        >
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[var(--muted)]">
            <span className="w-2 h-2 rounded-full" style={{ background: g.color }} />
            {g.name}
          </div>
          <div className="text-sm font-semibold mt-0.5">„{g.creative}”</div>
        </button>
      ))}
    </div>
  );
}

export function OlxCreatives() {
  const [active, setActive] = useState(0);
  const g = OLX_GROUPS[active];
  return (
    <div className={wrap}>
      <Header eyebrow="Komunikaty" title="Osobny komunikat dla każdej grupy" />
      <GroupTabs active={active} setActive={setActive} />
      <AnimatePresence mode="wait">
        <motion.div key={g.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
          <div className="text-sm text-[#374151] mb-4 leading-6">
            <Pill tone="accent">{g.angle}</Pill> <span className="ml-1">{g.insight}</span>
          </div>
          <div className="text-[10px] uppercase tracking-wider text-[var(--muted)] mb-2">Mail</div>
          <FullMail msg={g.mail} />
          <div className="grid grid-cols-2 gap-4 mt-5">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-[var(--muted)] mb-2">Push</div>
              <MsgPreview ch="Push" msg={g.push} to="" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-[var(--muted)] mb-2">Tinkerbell</div>
              <MsgPreview ch="Tinkerbell" msg={g.tb} to="" />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/** Pełny, czytelny mail */
function FullMail({ msg }: { msg: Msg }) {
  return (
    <div className="rounded-xl border border-[var(--border)] overflow-hidden bg-white">
      <div className="px-4 py-3 bg-[var(--panel-2)] border-b border-[var(--border)] text-xs space-y-0.5">
        <div><span className="text-[var(--muted)]">Od:</span> OLX &lt;powiadomienia@olx.pl&gt;</div>
        <div className="text-sm font-semibold pt-1">{msg.title}</div>
      </div>
      <div className="px-4 pt-3">
        <span className="text-[10px] font-black px-1.5 py-0.5 rounded" style={{ background: OLX_TEAL, color: OLX_GREEN }}>OLX</span>
      </div>
      <div className="px-4 py-3 text-sm leading-6 text-[#374151] whitespace-pre-line">
        {msg.body}
        {msg.cta && (
          <div className="mt-4">
            <span className="inline-block px-4 py-2 rounded-md text-sm font-semibold text-white" style={{ background: OLX_TEAL }}>{msg.cta}</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- 3b. Test A/B w każdej grupie ---------- */

export function OlxAB() {
  return (
    <div className={wrap}>
      <Header eyebrow="Testy A/B" title="Osobny test w każdej grupie" badge={<Pill tone="accent">A 45% · B 45% · kontrola 10%</Pill>} />
      <div className="space-y-4">
        {OLX_GROUPS.map((g, i) => (
          <motion.div key={g.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-[var(--panel)] border border-[var(--border)] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: g.color }} />
              <span className="text-sm font-semibold">{g.name}</span>
              <span className="text-xs text-[var(--muted)]">· „{g.creative}”</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {(["a", "b"] as const).map((k) => (
                <div key={k} className="rounded-lg bg-[var(--panel-2)] border border-[var(--border)] p-3">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`w-6 h-6 rounded-md text-white text-xs font-bold flex items-center justify-center ${k === "a" ? "bg-[var(--accent)]" : "bg-[var(--accent-2)]"}`}>{k.toUpperCase()}</span>
                    <span className="text-xs font-semibold">{g.ab[k].label}</span>
                  </div>
                  <div className="text-sm leading-5">„{g.ab[k].text}”</div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
      <div className="mt-4 rounded-xl bg-[#eef1ff] border border-[#d9defe] p-4 text-sm text-[#2f3a8f] leading-6">
        W każdej grupie i w każdym kanale dzielę pół na pół, więc wynik nie zależy od tego, kto dostał maila, a kto pusha. Zwycięzcę ogłaszam osobno w każdej grupie, gdy różnica będzie pewna.
      </div>
    </div>
  );
}

/* ---------- 3c. Plan kanałów: grupa × kanał ---------- */

const CH_ORDER: Ch[] = ["Email", "Push", "Tinkerbell", "SMS"];

export function OlxChannelPlan() {
  const totals = CH_ORDER.map((ch) => OLX_GROUPS.reduce((a, g) => a + (g.channels.find((c) => c.ch === ch)?.n ?? 0), 0));
  return (
    <div className={wrap}>
      <Header eyebrow="Plan kanałów" title="Kanał dobrany do każdej osoby" badge={<Pill tone="accent">288 tys. wysyłek</Pill>} />
      <div className="space-y-4">
        {OLX_GROUPS.map((g, gi) => {
          const sum = g.channels.reduce((a, c) => a + c.n, 0);
          return (
            <motion.div key={g.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: gi * 0.1 }} className="bg-[var(--panel)] border border-[var(--border)] rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: g.color }} />
                  <span className="text-sm font-semibold">{g.name}</span>
                  <span className="text-xs text-[var(--muted)]">· „{g.creative}”</span>
                </div>
                <span className="text-xs text-[var(--muted)]">{(sum / 1000).toLocaleString("pl-PL")} tys. osób</span>
              </div>
              <div className="h-3 rounded-full overflow-hidden flex mb-3">
                {g.channels.map((c) => (
                  <motion.div key={c.ch} initial={{ width: 0 }} animate={{ width: `${(c.n / sum) * 100}%` }} style={{ background: CH_COLOR[c.ch] }} />
                ))}
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                {g.channels.map((c) => (
                  <div key={c.ch} className="flex items-start gap-2 text-xs">
                    <span className="w-20 shrink-0"><ChBadge ch={c.ch} /></span>
                    <span className="w-12 shrink-0 font-semibold">{(c.n / 1000).toLocaleString("pl-PL")} tys.</span>
                    <span className="text-[var(--muted)] leading-4">{c.why}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
      <Card title="Razem" className="mt-4">
        <div className="grid grid-cols-5 gap-2 text-center">
          {CH_ORDER.map((ch, i) => (
            <div key={ch}><ChBadge ch={ch} /><div className="text-lg font-semibold mt-1">{(totals[i] / 1000).toLocaleString("pl-PL")} tys.</div></div>
          ))}
          <div><Pill>Nie piszemy</Pill><div className="text-lg font-semibold mt-1">72 tys.</div></div>
        </div>
      </Card>
      <div className="mt-4 rounded-xl bg-[#eef1ff] border border-[#d9defe] p-4 text-sm text-[#2f3a8f] leading-6">
        To plan na start. Jeśli ktoś przestanie reagować na swój kanał, przełączę go na inny. Komunikat zostaje ten sam, bo wynika z grupy, a nie z kanału.
      </div>
    </div>
  );
}

/* ---------- 4. Kampania na żywo ---------- */

const NAMES = ["Kasia z Poznania", "Marek z Gdańska", "Ola z Radomia", "Piotr z Krakowa", "Ania z Lublina", "Tomek z Wrocławia", "Ewa z Kielc", "Bartek z Łodzi", "Magda z Opola", "Kuba z Warszawy"];
const DECISIONS = [
  { d: "Push · 19:40 · Ostrożni · B", why: "3 maile bez otwarcia, otwiera 80% pushy", tone: "accent" as const },
  { d: "Mail · 8:15 · Łowcy okazji · A", why: "otwiera maile rano, push wyłączony", tone: "accent" as const },
  { d: "Tinkerbell · Prawie kupili · A", why: "ignoruje mail i push, codziennie w aplikacji", tone: "accent" as const },
  { d: "Pominięto: niska szansa reakcji", why: "0 reakcji od rejestracji na żadnym kanale", tone: "neutral" as const },
  { d: "Tinkerbell · Łowcy okazji · B", why: "maile trafiają do zakładki Oferty, aktywny w app", tone: "accent" as const },
  { d: "Push · 20:10 · Łowcy okazji · B", why: "aktywny wieczorem, maile ignoruje", tone: "accent" as const },
  { d: "Mail · 7:50 · Ostrożni · A", why: "czyta maile rano, pushe wyłączone", tone: "accent" as const },
  { d: "Wstrzymano: limit 3 kontaktów", why: "już 3 wiadomości w tym tygodniu", tone: "warn" as const },
  { d: "SMS · 17:30 · Ostrożni · A", why: "brak aplikacji, maile bez otwarcia, zgoda na SMS", tone: "accent" as const },
];

export function OlxLive() {
  const [feed, setFeed] = useState<{ id: number; who: string; d: string; why: string; tone: "accent" | "neutral" | "warn" }[]>([]);
  const [count, setCount] = useState(0);
  const [explore, setExplore] = useState(90);

  useEffect(() => {
    let n = 0;
    const iv = setInterval(() => {
      n++;
      const pick = DECISIONS[Math.floor(Math.random() * DECISIONS.length)];
      const who = NAMES[Math.floor(Math.random() * NAMES.length)];
      setFeed((f) => [{ id: n, who, ...pick }, ...f].slice(0, 7));
      setCount((c) => c + 37 + Math.floor(Math.random() * 40));
      setExplore((e) => Math.max(35, e - 2));
    }, 900);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className={wrap}>
      <Header eyebrow="AI Decisioning · na żywo" title="Kampania: Pierwszy zakup z Przesyłką" badge={<Pill tone="good">● Aktywny</Pill>} />
      <div className="grid grid-cols-3 gap-3 mb-4">
        <Stat label="Decyzje dzisiaj" value={count.toLocaleString("pl-PL")} tone="accent" />
        <Stat label="Grupa kontrolna" value="10%" sub="bez komunikacji od AI" />
        <Stat label="Smart suppression" value="Włączony" sub="pomija osoby bez szans na reakcję" />
      </div>
      <Card title="Eksploracja vs. optymalizacja">
        <div className="h-3 rounded-full overflow-hidden flex">
          <motion.div animate={{ width: `${explore}%` }} className="h-full bg-[#a5b4fc]" />
          <motion.div animate={{ width: `${100 - explore}%` }} className="h-full bg-[var(--accent)]" />
        </div>
        <div className="flex justify-between text-xs text-[var(--muted)] mt-2">
          <span>Testowanie nowych opcji · {explore}%</span>
          <span>Wysyłanie najlepszych · {100 - explore}%</span>
        </div>
      </Card>
      <Card title="Ostatnie decyzje" className="mt-4">
        <div className="space-y-2 min-h-[320px]">
          <AnimatePresence initial={false}>
            {feed.map((f) => (
              <motion.div
                key={f.id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3 rounded-lg border border-[var(--border)] px-3 py-2.5"
              >
                <span className="w-8 h-8 rounded-full bg-[var(--panel-2)] flex items-center justify-center text-[11px] font-semibold text-[var(--muted)]">
                  {f.who.split(" ")[0].slice(0, 2)}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm">{f.who}</div>
                  <div className="text-[11px] text-[var(--muted)] truncate">↳ {f.why}</div>
                </div>
                <Pill tone={f.tone}>{f.d}</Pill>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </Card>
    </div>
  );
}

/* ---------- 4b. Dobór kanału i komunikatu dla konkretnych osób ---------- */

type Ch = "Email" | "Push" | "In-app" | "Tinkerbell" | "SMS";
const CH_COLOR: Record<Ch, string> = {
  Email: "#4f6bff",
  Push: "#7c5cff",
  "In-app": "#0b7a75",
  Tinkerbell: "#db2777",
  SMS: "#d97706",
};

type Msg = { title: string; body: string; cta?: string };

type Person = {
  name: string;
  meta: string;
  contact: string;
  history: { ch: Ch; sent: number; opened: number; note?: string }[];
  decision: { ch: Ch | null; variant: string; when?: string };
  msg?: Msg;
  why: string;
};

const PEOPLE: Person[] = [
  {
    name: "Kasia N.",
    meta: "Ostrożni · Poznań · Dla dzieci · 6 dni od rejestracji",
    contact: "iPhone 14 · aplikacja OLX · push włączony",
    history: [
      { ch: "Email", sent: 3, opened: 0 },
      { ch: "Push", sent: 5, opened: 4 },
      { ch: "Tinkerbell", sent: 0, opened: 0, note: "brak danych" },
    ],
    decision: { ch: "Push", variant: "Ostrożni · wersja B", when: "dziś 19:30" },
    msg: {
      title: "2 mln osób kupiło już z Pakietem Ochronnym 🛡",
      body: "Wózek Cybex, który obserwujesz, też możesz kupić bez ryzyka. Kup z Przesyłką OLX.",
    },
    why: "3 maile bez otwarcia, a 4 z 5 pushy otwarte. Wysyłam push wieczorem, kiedy zwykle jest w aplikacji.",
  },
  {
    name: "Marek W.",
    meta: "Łowcy okazji · Gdańsk · Elektronika · 3 dni od rejestracji",
    contact: "m.wisniewski@gmail.com",
    history: [
      { ch: "Email", sent: 4, opened: 4 },
      { ch: "Push", sent: 0, opened: 0, note: "wyłączone" },
      { ch: "In-app", sent: 1, opened: 0 },
    ],
    decision: { ch: "Email", variant: "Łowcy okazji · wersja A", when: "jutro 7:45" },
    msg: {
      title: "Cena spadła: iPhone 13, który obserwujesz, jest tańszy o 200 zł",
      body: "Cześć Marek, iPhone 13 128 GB kosztuje teraz 1 899 zł zamiast 2 099 zł. Kup z Przesyłką OLX, a paczka może być u Ciebie już w czwartek.",
      cta: "Kup teraz z Przesyłką",
    },
    why: "Pushe wyłączone, ale otwiera każdy mail, zwykle rano przed 8:00. Zostaję przy mailu.",
  },
  {
    name: "Ola K.",
    meta: "Prawie kupili · Radom · Moda · 9 dni od rejestracji",
    contact: "Android · aplikacja OLX · codziennie aktywna",
    history: [
      { ch: "Email", sent: 3, opened: 0 },
      { ch: "Push", sent: 4, opened: 0 },
      { ch: "Tinkerbell", sent: 2, opened: 2 },
    ],
    decision: { ch: "Tinkerbell", variant: "Prawie kupili · wersja A", when: "przy następnej sesji" },
    msg: {
      title: "Sprzedająca odpowiedziała",
      body: "Kurtka Zara, o którą pytałaś, wciąż na Ciebie czeka. Kup od razu z Przesyłką OLX.",
      cta: "Dokończ zakup",
    },
    why: "Ignoruje maile i pushe, ale codziennie przegląda aplikację i otwiera wiadomości w Tinkerbell. Odzywam się tam, gdzie jest.",
  },
  {
    name: "Tomek L.",
    meta: "Ostrożni · Ostrołęka · Elektronika · 4 dni od rejestracji",
    contact: "+48 6•• ••• •12 · zgoda SMS",
    history: [
      { ch: "Email", sent: 3, opened: 0 },
      { ch: "Push", sent: 0, opened: 0, note: "brak aplikacji" },
      { ch: "SMS", sent: 1, opened: 1 },
    ],
    decision: { ch: "SMS", variant: "Ostrożni · wersja A", when: "dziś 17:30" },
    msg: {
      title: "OLX",
      body: "OLX: konsolę PS5, którą oglądałeś, kupisz bez ryzyka. Jeśli coś będzie nie tak, oddamy pieniądze: olx.pl/p/k8Xz",
    },
    why: "Nie ma aplikacji, maili nie otwiera, a w jedyny SMS kliknął. Ma zgodę na SMS.",
  },
  {
    name: "Piotr S.",
    meta: "Bez reakcji · Kraków · Moda · 12 dni od rejestracji",
    contact: "p.sikora@wp.pl · Android",
    history: [
      { ch: "Email", sent: 3, opened: 0 },
      { ch: "Push", sent: 3, opened: 0 },
      { ch: "In-app", sent: 2, opened: 0 },
    ],
    decision: { ch: null, variant: "Brak kontaktu (Smart suppression)" },
    why: "0 reakcji na żadnym kanale od rejestracji i spadająca aktywność. Kolejna wiadomość to głównie ryzyko wypisu.",
  },
];

function ChBadge({ ch }: { ch: Ch }) {
  return (
    <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-semibold text-white" style={{ background: CH_COLOR[ch] }}>
      {ch}
    </span>
  );
}

/** Podgląd komunikatu tak, jak zobaczy go odbiorca */
function MsgPreview({ ch, msg, to }: { ch: Ch; msg: Msg; to: string }) {
  if (ch === "Email") {
    return (
      <div className="rounded-lg border border-[var(--border)] overflow-hidden text-xs bg-white">
        <div className="px-3 py-2 bg-[var(--panel-2)] border-b border-[var(--border)] space-y-0.5">
          <div><span className="text-[var(--muted)]">Od:</span> OLX &lt;powiadomienia@olx.pl&gt;</div>
          <div><span className="text-[var(--muted)]">Do:</span> {to}</div>
          <div className="font-semibold">{msg.title}</div>
        </div>
        <div className="p-3 leading-5 text-[#374151]">
          {msg.body}
          {msg.cta && (
            <div className="mt-2.5">
              <span className="inline-block px-3 py-1.5 rounded-md text-[11px] font-semibold" style={{ background: OLX_TEAL, color: "#fff" }}>{msg.cta}</span>
            </div>
          )}
        </div>
      </div>
    );
  }
  if (ch === "Push") {
    return (
      <div className="rounded-2xl bg-[#1f2937] p-2.5">
        <div className="rounded-xl bg-white/95 p-2.5 flex gap-2.5">
          <span className="w-8 h-8 shrink-0 rounded-lg flex items-center justify-center text-[9px] font-black" style={{ background: OLX_TEAL, color: OLX_GREEN }}>OLX</span>
          <div className="min-w-0 text-xs">
            <div className="flex justify-between gap-2"><b className="truncate">{msg.title}</b><span className="text-[10px] text-[var(--muted)] shrink-0">teraz</span></div>
            <div className="text-[#374151] leading-4 mt-0.5">{msg.body}</div>
          </div>
        </div>
      </div>
    );
  }
  if (ch === "SMS") {
    return (
      <div className="rounded-xl bg-[var(--panel-2)] border border-[var(--border)] p-3 text-xs">
        <div className="text-[10px] text-[var(--muted)] mb-1.5">SMS od: OLX · do: {to.split("·")[0].trim()}</div>
        <div className="inline-block max-w-full rounded-2xl rounded-bl-sm bg-[#e5e7eb] px-3 py-2 leading-4 text-[#111827]">{msg.body}</div>
      </div>
    );
  }
  // Tinkerbell / In-app
  return (
    <div className="rounded-xl border-2 p-3 text-xs bg-white" style={{ borderColor: CH_COLOR[ch] }}>
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: CH_COLOR[ch] }}>
          {ch === "Tinkerbell" ? "🔔 Tinkerbell · w aplikacji" : "In-app · baner"}
        </span>
      </div>
      <div className="font-semibold">{msg.title}</div>
      <div className="text-[#374151] leading-4 mt-1">{msg.body}</div>
      {msg.cta && <div className="mt-2 text-[11px] font-semibold" style={{ color: OLX_TEAL }}>{msg.cta} →</div>}
    </div>
  );
}

const RECIPIENTS: { who: string; city: string; to: string; ch: Ch | null; variant: string; when: string; why: string }[] = [
  { who: "Kasia N.", city: "Poznań", to: "iPhone · app", ch: "Push", variant: "Ostrożni · B", when: "19:30", why: "email 0/3, push 4/5" },
  { who: "Marek W.", city: "Gdańsk", to: "m.wisniewski@gmail.com", ch: "Email", variant: "Łowcy · A", when: "7:45", why: "email 4/4, push wył." },
  { who: "Ola K.", city: "Radom", to: "Android · app", ch: "Tinkerbell", variant: "Prawie kupili · A", when: "sesja", why: "aktywna w app" },
  { who: "Tomek L.", city: "Ostrołęka", to: "+48 6•• ••• •12", ch: "SMS", variant: "Ostrożni · A", when: "17:30", why: "brak app, SMS 1/1" },
  { who: "Ania B.", city: "Lublin", to: "a.bak@onet.pl", ch: "Email", variant: "Ostrożni · B", when: "8:10", why: "email 3/3" },
  { who: "Kuba Z.", city: "Warszawa", to: "iPhone · app", ch: "Push", variant: "Łowcy · B", when: "20:15", why: "email 1/4, push 5/6" },
  { who: "Ewa M.", city: "Kielce", to: "Android · app", ch: "Tinkerbell", variant: "Łowcy · A", when: "sesja", why: "maile w „Ofertach”, codziennie w app" },
  { who: "Piotr S.", city: "Kraków", to: "-", ch: null, variant: "-", when: "-", why: "0 reakcji od rejestracji" },
];

export function OlxPeople() {
  const [open, setOpen] = useState(0);
  return (
    <div className={wrap}>
      <Header eyebrow="Kto co dostaje · per osoba" title="Ten sam cel, różne kanały i komunikaty" badge={<Pill tone="good">● Aktywna</Pill>} />
      <div className="rounded-xl bg-[#eef1ff] border border-[#d9defe] p-4 text-sm text-[#2f3a8f] leading-6 mb-4">
        Bez reguł typu „po 3 mailach przełącz na push”. Patrzę na historię reakcji każdej osoby na każdym kanale i wybieram ten,
        na który realnie reaguje, razem z treścią dopasowaną do tego, co oglądała. Kliknij osobę, żeby zobaczyć, co dokładnie dostaje.
      </div>

      <div className="space-y-3">
        {PEOPLE.map((p, i) => {
          const isOpen = open === i;
          return (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`bg-[var(--panel)] border rounded-xl transition ${isOpen ? "border-[var(--accent)] ring-4 ring-[#eef1ff]" : "border-[var(--border)]"}`}
            >
              <button onClick={() => setOpen(isOpen ? -1 : i)} className="w-full flex items-center gap-3 p-4 text-left">
                <span className="w-9 h-9 rounded-full bg-[var(--panel-2)] border border-[var(--border)] flex items-center justify-center text-xs font-semibold">
                  {p.name.slice(0, 2)}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold">{p.name}</div>
                  <div className="text-[11px] text-[var(--muted)] truncate">{p.meta}</div>
                </div>
                {p.decision.ch ? <ChBadge ch={p.decision.ch} /> : <Pill>Pominięto</Pill>}
                <span className="text-xs text-[var(--muted)] w-36 truncate text-right">{p.decision.variant}</span>
                <span className={`text-[var(--muted)] transition ${isOpen ? "rotate-90" : ""}`}>›</span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 grid grid-cols-2 gap-5 border-t border-[var(--border)] pt-4">
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-[var(--muted)] mb-2">Historia reakcji (14 dni)</div>
                        <div className="space-y-1.5">
                          {p.history.map((h) => {
                            const rate = h.sent ? h.opened / h.sent : 0;
                            return (
                              <div key={h.ch} className="flex items-center gap-2 text-xs">
                                <span className="w-20 shrink-0">{h.ch}</span>
                                {h.note ? (
                                  <span className="text-[var(--muted)] italic">{h.note}</span>
                                ) : (
                                  <>
                                    <div className="flex-1 h-1.5 rounded-full bg-[var(--panel-2)] overflow-hidden">
                                      <div className="h-full rounded-full" style={{ width: `${Math.max(rate * 100, 3)}%`, background: rate > 0.5 ? "#16a34a" : rate > 0 ? "#d97706" : "#dc2626" }} />
                                    </div>
                                    <span className="w-14 text-right text-[var(--muted)]">{h.opened}/{h.sent} otw.</span>
                                  </>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        <div className="text-[10px] uppercase tracking-wider text-[var(--muted)] mt-4 mb-1">Dlaczego tak</div>
                        <div className="text-xs leading-5 text-[#374151]">{p.why}</div>
                        <div className="text-[10px] uppercase tracking-wider text-[var(--muted)] mt-4 mb-1">Odbiorca</div>
                        <div className="text-xs font-medium">{p.contact}</div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-[var(--muted)] mb-2">
                          Co dostaje{p.decision.when ? ` · ${p.decision.when}` : ""}
                        </div>
                        {p.decision.ch && p.msg ? (
                          <MsgPreview ch={p.decision.ch} msg={p.msg} to={p.contact} />
                        ) : (
                          <div className="rounded-xl border border-dashed border-[var(--border)] p-6 text-center text-xs text-[var(--muted)]">
                            Brak wysyłki. Osoba wraca do puli za 7 dni, jeśli pojawi się nowa aktywność.
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      <Card title="Lista wysyłek na dziś (fragment z 1 842 decyzji)" className="mt-5">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-left text-[var(--muted)]">
              <th className="pb-2 font-medium">Odbiorca</th>
              <th className="pb-2 font-medium">Dokąd</th>
              <th className="pb-2 font-medium">Kanał</th>
              <th className="pb-2 font-medium">Grupa · wersja</th>
              <th className="pb-2 font-medium">Kiedy</th>
              <th className="pb-2 font-medium">Powód</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {RECIPIENTS.map((r) => (
              <tr key={r.who}>
                <td className="py-2"><div className="font-medium">{r.who}</div><div className="text-[10px] text-[var(--muted)]">{r.city}</div></td>
                <td className="py-2 text-[var(--muted)] max-w-[140px] truncate">{r.to}</td>
                <td className="py-2">{r.ch ? <ChBadge ch={r.ch} /> : <Pill>Pominięto</Pill>}</td>
                <td className="py-2">{r.variant}</td>
                <td className="py-2 text-[var(--muted)]">{r.when}</td>
                <td className="py-2 text-[var(--muted)]">{r.why}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

/* ---------- 5. Wyniki po 14 dniach ---------- */

const RESULTS: Record<Group["id"], { control: number; a: number; b: number; winner: "A" | "B"; ch: { ch: Ch; conv: number }[]; note: string }> = {
  g1: {
    control: 3.6, a: 4.0, b: 4.5, winner: "B",
    ch: [{ ch: "Push", conv: 4.9 }, { ch: "Tinkerbell", conv: 4.6 }, { ch: "Email", conv: 3.9 }, { ch: "SMS", conv: 3.7 }],
    note: "Informacja, że inni też patrzą, działa mocniej niż sama kwota. Push wieczorem najlepszy.",
  },
  g2: {
    control: 3.0, a: 3.5, b: 3.9, winner: "B",
    ch: [{ ch: "Tinkerbell", conv: 4.3 }, { ch: "Email", conv: 4.1 }, { ch: "Push", conv: 3.6 }, { ch: "SMS", conv: 3.3 }],
    note: "„2 mln osób już tak kupiło” uspokaja lepiej niż obietnica zwrotu. Mail rano działa, bo ci ludzie czytają dokładnie.",
  },
  g3: {
    control: 6.5, a: 8.1, b: 7.2, winner: "A",
    ch: [{ ch: "Tinkerbell", conv: 9.2 }, { ch: "Push", conv: 7.4 }, { ch: "Email", conv: 5.6 }, { ch: "SMS", conv: 5.0 }],
    note: "Tu wygrywa A: info, że sprzedawca odpowiedział, domyka zakup. Tinkerbell w trakcie sesji daje ponad 9%.",
  },
};

export function OlxLearnings() {
  return (
    <div className={wrap}>
      <Header eyebrow="Po 14 dniach · vs grupa kontrolna" title="Co wyszło po 2 tygodniach" badge={<Pill tone="good">● Aktywna</Pill>} />
      <div className="grid grid-cols-4 gap-3 mb-5">
        <Stat label="Zakupy z Przesyłką" value="+21,9%" sub="3,2% → 3,9%" tone="good" />
        <Stat label="Nowi kupujący z Przesyłką" value="+2,5 tys." sub="w 2 tygodnie" tone="good" />
        <Stat label="Wysłane wiadomości" value="−34%" sub="bez pisania do „bez reakcji”" tone="accent" />
        <Stat label="Wypisy z maili" value="−41%" tone="good" />
      </div>

      <div className="space-y-4">
        {OLX_GROUPS.map((g, gi) => {
          const r = RESULTS[g.id];
          const lift = Math.round(((Math.max(r.a, r.b) - r.control) / r.control) * 100);
          const bars = [
            { n: `A · ${g.ab.a.label}`, v: r.a, c: "var(--accent)", win: r.winner === "A" },
            { n: `B · ${g.ab.b.label}`, v: r.b, c: "var(--accent-2)", win: r.winner === "B" },
            { n: "Kontrola", v: r.control, c: "#c7cdda", win: false },
          ];
          const max = Math.max(...r.ch.map((c) => c.conv), r.a, r.b);
          return (
            <motion.div key={g.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: gi * 0.12 }} className="bg-[var(--panel)] border border-[var(--border)] rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: g.color }} />
                  <span className="text-sm font-semibold">{g.name}</span>
                  <span className="text-xs text-[var(--muted)]">· „{g.creative}” · {(g.size / 1000).toLocaleString("pl-PL")} tys.</span>
                </div>
                <span className="text-sm font-semibold text-[#16a34a]">+{lift}% vs kontrola</span>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-[var(--muted)] mb-2">Test A/B</div>
                  <div className="space-y-2">
                    {bars.map((b) => (
                      <div key={b.n} className="flex items-center gap-2 text-xs">
                        <span className="w-32 shrink-0 truncate">{b.n}</span>
                        <div className="flex-1 h-2 rounded-full bg-[var(--panel-2)] overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${(b.v / max) * 100}%` }} className="h-full rounded-full" style={{ background: b.c }} />
                        </div>
                        <span className={`w-12 text-right ${b.win ? "font-bold text-[#16a34a]" : "font-medium"}`}>{b.win ? "🏆 " : ""}{b.v.toLocaleString("pl-PL")}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-[var(--muted)] mb-2">Kanały</div>
                  <div className="space-y-2">
                    {r.ch.map((c) => (
                      <div key={c.ch} className="flex items-center gap-2 text-xs">
                        <span className="w-20 shrink-0"><ChBadge ch={c.ch} /></span>
                        <div className="flex-1 h-2 rounded-full bg-[var(--panel-2)] overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${(c.conv / max) * 100}%` }} className="h-full rounded-full" style={{ background: CH_COLOR[c.ch] }} />
                        </div>
                        <span className="w-10 text-right font-medium">{c.conv.toLocaleString("pl-PL")}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-3 text-xs text-[#374151] leading-5 rounded-lg bg-[var(--panel-2)] px-3 py-2">💡 {r.note}</div>
            </motion.div>
          );
        })}
      </div>

      <Card title="Zmiana kanału na podstawie historii" className="mt-4">
        <div className="text-sm leading-6 text-[#374151]">
          38% osób dostawało komunikat innym kanałem niż mail, bo wcześniej lepiej reagowały na push, Tinkerbell albo SMS.
          W tej grupie konwersja była o <b className="text-[#16a34a]">29% wyższa</b> niż u osób, którym zostawiliśmy mail.
        </div>
      </Card>
    </div>
  );
}

/* ---------- 5b. Jak to się uczyło + nowe propozycje ---------- */

export function OlxNext() {
  // udział kanałów w wysyłkach w kolejnych dniach (%)
  const days = [1, 3, 5, 7, 9, 11, 14];
  const series = [
    { n: "Mail", c: "#4f6bff", v: [60, 58, 52, 47, 44, 42, 41] },
    { n: "Push", c: "#7c5cff", v: [25, 26, 29, 31, 32, 33, 33] },
    { n: "Tinkerbell / in-app", c: "#db2777", v: [10, 11, 13, 15, 16, 17, 17] },
    { n: "SMS", c: "#d97706", v: [5, 5, 6, 7, 8, 8, 9] },
  ];
  const explore = [90, 85, 70, 55, 45, 38, 35];
  const signals = [
    "Kategoria oglądanych ogłoszeń",
    "Cena obserwowanych rzeczy",
    "Pora aktywności w aplikacji",
    "Historia reakcji na każdym kanale",
    "Lokalizacja (duże / małe miasto)",
    "Wiadomość do sprzedającego",
    "Urządzenie i zgody na kanały",
  ];
  const proposals = [
    {
      tag: "Zamknij testy",
      tone: "warn" as const,
      title: "Zwycięzcy do wszystkich: B, B i A",
      why: "W każdej grupie wygrała inna wersja. Teraz każda grupa dostaje swoją lepszą, a w każdej testuję nową wersję C.",
      impact: "prognoza +4–6% konwersji",
    },
    {
      tag: "Przesunięcie",
      tone: "accent" as const,
      title: "Elektronika powyżej 1 000 zł do „Ostrożnych”",
      why: "Przy drogim sprzęcie łowcy okazji reagują jak ostrożni: bardziej liczy się ochrona niż cena.",
      impact: "prognoza +8–12% w grupie",
    },
    {
      tag: "Pora",
      tone: "accent" as const,
      title: "Push w Elektronice 19–21, maile do rodziców 7:30–9",
      why: "Poza tymi godzinami otwieralność spada o połowę, a zakupów prawie nie ma.",
      impact: "prognoza +5% konwersji",
    },
    {
      tag: "Poszerzenie",
      tone: "good" as const,
      title: "Do „Prawie kupili” dołączyć obserwujących 3+ ogłoszenia",
      why: "Ok. 45 tys. osób, które jeszcze nie napisały, ale zachowują się podobnie. Ta grupa konwertuje najlepiej.",
      impact: "prognoza +2 tys. zakupów",
    },
  ];

  const W = 100;
  const H = 100;
  const x = (i: number) => (i / (days.length - 1)) * W;
  const y = (v: number) => H - (v / 70) * H;

  return (
    <div className={wrap}>
      <Header eyebrow="Kontekst uczenia" title="Skąd to wiem i co bym zmienił" badge={<Pill tone="good">● Aktywna</Pill>} />

      <Card title="Jak przesuwały się kanały (dni 1–14)">
        <div className="text-xs text-[var(--muted)] -mt-2 mb-3">Coraz mniej maili do osób, które ich nie otwierają, a więcej tam, gdzie ludzie naprawdę reagują</div>
        <div className="flex gap-5">
          <div className="flex-1">
            <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="w-full h-44 overflow-visible">
              {[0, 20, 40, 60].map((g) => (
                <line key={g} x1={0} x2={W} y1={y(g)} y2={y(g)} stroke="#e8eaf0" strokeWidth={0.4} />
              ))}
              {series.map((s, si) => (
                <motion.polyline
                  key={s.n}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: si * 0.1 }}
                  fill="none"
                  stroke={s.c}
                  strokeWidth={1.4}
                  vectorEffect="non-scaling-stroke"
                  points={s.v.map((v, i) => `${x(i)},${y(v)}`).join(" ")}
                />
              ))}
            </svg>
            <div className="flex justify-between text-[10px] text-[var(--muted)] mt-1">
              {days.map((d) => <span key={d}>dzień {d}</span>)}
            </div>
          </div>
          <div className="w-40 space-y-1.5 text-xs">
            {series.map((s) => (
              <div key={s.n} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: s.c }} />
                <span className="flex-1 truncate">{s.n}</span>
                <span className="text-[var(--muted)]">{s.v[s.v.length - 1]}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-5">
          {[
            { d: "Dni 1–3", t: "Testowanie", s: "Wersje A i B po równo, różne pory i kanały", e: explore[1] },
            { d: "Dni 4–8", t: "Pierwsze wzorce", s: "60 tys. wysyłek, 2 tys. zakupów", e: explore[3] },
            { d: "Dni 9–14", t: "Robimy to, co działa", s: "Większość wysyłek w najlepsze kombinacje", e: explore[6] },
          ].map((p) => (
            <div key={p.d} className="rounded-lg bg-[var(--panel-2)] border border-[var(--border)] p-3">
              <div className="text-[10px] uppercase tracking-wider text-[var(--muted)]">{p.d}</div>
              <div className="text-sm font-semibold mt-0.5">{p.t}</div>
              <div className="text-[11px] text-[var(--muted)] mt-1 leading-4">{p.s}</div>
              <div className="text-[11px] mt-2"><b className="text-[var(--accent)]">{p.e}%</b> <span className="text-[var(--muted)]">wysyłek na testy</span></div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Na co patrzę" className="mt-4">
        <div className="flex flex-wrap gap-2">
          {signals.map((s) => <Pill key={s}>{s}</Pill>)}
        </div>
      </Card>

      <div className="flex items-center justify-between mt-6 mb-3">
        <div className="text-sm font-semibold">Co bym zmienił</div>
        <div className="text-xs text-[var(--muted)]">każdą zmianę sprawdzę na żywo</div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {proposals.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className="bg-[var(--panel)] border border-[var(--border)] rounded-xl p-4 flex flex-col"
          >
            <div className="mb-2"><Pill tone={p.tone}>{p.tag}</Pill></div>
            <div className="text-sm font-semibold leading-5">{p.title}</div>
            <div className="text-xs text-[var(--muted)] mt-1.5 leading-5 flex-1">{p.why}</div>
            <div className="mt-3 pt-3 border-t border-[var(--border)] text-xs font-semibold text-[#16a34a]">{p.impact}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ---------- 6. Druga kampania: powrót sprzedających ---------- */

export function OlxWinback() {
  const inc = [
    { n: "Darmowe wyróżnienie ogłoszenia", t: "Zachęta finansowa" },
    { n: "Sugerowana cena od AI", t: "Mniej wysiłku" },
    { n: "Wystaw w 2 minuty ze zdjęcia", t: "Mniej wysiłku" },
    { n: "Wiosenne porządki w szafie", t: "Sezonowość" },
    { n: "„W Twojej kategorii rośnie popyt”", t: "Dowód popytu" },
  ];
  return (
    <div className={wrap}>
      <Header eyebrow="AI Decisioning · kampanie" title="Kampanie OLX" />
      <div className="grid grid-cols-2 gap-4 mb-4">
        <Card>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold">Pierwszy zakup z Przesyłką</span>
            <Pill tone="good">● Aktywny</Pill>
          </div>
          <div className="text-xs text-[var(--muted)]">Nowi kupujący · 420 tys./mies.</div>
          <div className="text-2xl font-semibold text-[#16a34a] mt-2">+21,9%</div>
          <div className="text-[11px] text-[var(--muted)]">pierwsze zakupy vs kontrola</div>
        </Card>
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className="border-[var(--accent)] ring-4 ring-[#eef1ff]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold">Powrót sprzedających</span>
              <Pill tone="accent">● Startuje</Pill>
            </div>
            <div className="text-xs text-[var(--muted)]">Brak ogłoszenia od 60 dni · 310 tys.</div>
            <div className="text-2xl font-semibold text-[var(--accent)] mt-2">+9–12%</div>
            <div className="text-[11px] text-[var(--muted)]">prognozowany wzrost powrotów</div>
          </Card>
        </motion.div>
      </div>
      <Card title="Kampania: Powrót sprzedających">
        <div className="grid grid-cols-[140px_1fr] gap-y-3 text-sm">
          <span className="text-xs text-[var(--muted)]">Cel</span>
          <span className="font-medium">Nowe ogłoszenie w 21 dni <span className="text-[var(--muted)] font-normal">· pomocniczy: ogłoszenie z Przesyłką</span></span>
          <span className="text-xs text-[var(--muted)]">Kanały</span>
          <span className="font-medium">Email · Push · In-app</span>
          <span className="text-xs text-[var(--muted)]">Przeniesiona wiedza</span>
          <span className="font-medium">Godziny wysyłki i limity kontaktu z kampanii dla kupujących</span>
          <span className="text-xs text-[var(--muted)]">Smart suppression</span>
          <span className="font-medium">Włączony od pierwszego dnia</span>
        </div>
      </Card>
      <Card title="Warianty zachęt" className="mt-4">
        <div className="grid grid-cols-1 gap-2">
          {inc.map((x, i) => (
            <motion.div key={x.n} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }} className="flex items-center justify-between rounded-lg border border-[var(--border)] px-3 py-2.5 text-sm">
              <span>{x.n}</span>
              <Pill>{x.t}</Pill>
            </motion.div>
          ))}
        </div>
      </Card>
      <div className="mt-4 rounded-xl bg-[#eef1ff] border border-[#d9defe] p-4 text-sm text-[#2f3a8f] leading-6">
        🛡 Wspólne limity kontaktu dla obu kampanii: ta sama osoba (kupująca i sprzedająca) nie dostanie więcej niż 3 wiadomości tygodniowo łącznie.
      </div>
    </div>
  );
}
