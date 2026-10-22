"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, Stat, Pill } from "./OlxPanels";

/* ---------- wspólne ---------- */

const wrap = "p-8 max-w-4xl mx-auto";

type PCh = "Mail" | "SMS" | "WhatsApp" | "Telefon";
const PCH_COLOR: Record<PCh, string> = {
  Mail: "#4f6bff",
  SMS: "#d97706",
  WhatsApp: "#16a34a",
  Telefon: "#7c5cff",
};

function Header({ eyebrow, title, badge }: { eyebrow: string; title: string; badge?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[10px] font-bold tracking-tight px-1.5 py-0.5 rounded bg-[#0f766e] text-white">POZ</span>
          <span className="text-xs uppercase tracking-wider text-[var(--muted)]">{eyebrow}</span>
        </div>
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      </div>
      {badge}
    </div>
  );
}

function ChTag({ ch }: { ch: PCh }) {
  return (
    <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-semibold text-white" style={{ background: PCH_COLOR[ch] }}>
      {ch}
    </span>
  );
}

const fmt = (n: number) => n.toLocaleString("pl-PL");

/* ---------- 1. Baza: RPWDL vs baza wewnętrzna i zgody ---------- */

export function PozBase() {
  return (
    <div className={wrap}>
      <Header eyebrow="Skąd bierzemy placówki" title="POZ w rejestrze i w Waszej bazie" />

      <Card title="1. Rejestr RPWDL">
        <div className="flex items-center gap-4">
          <div className="flex-1 text-sm text-[#374151] leading-6">
            Rejestr Podmiotów Wykonujących Działalność Leczniczą, czyli pełna lista placówek w Polsce. Filtruję na <b>POZ</b>.
          </div>
          <div className="text-right">
            <div className="text-3xl font-semibold">{fmt(6000)}</div>
            <div className="text-xs text-[var(--muted)]">POZ (unikalne NIP-y)</div>
          </div>
        </div>
      </Card>

      <div className="flex justify-center text-[var(--muted)] my-2">↓ łączę po NIP z Waszą bazą</div>

      <Card title="2. Baza wewnętrzna">
        <div className="flex flex-wrap gap-2 mb-4">
          <Pill tone="accent">Płacący klient</Pill>
          <Pill tone="accent">NIP zmatchowany z RPWDL</Pill>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg border border-[var(--border)] p-4">
            <div className="text-xs text-[var(--muted)]">Jest w Waszej bazie</div>
            <div className="text-2xl font-semibold mt-1">{fmt(4700)} <span className="text-sm font-normal text-[var(--muted)]">NIP</span></div>
            <div className="text-xs text-[var(--muted)] mt-0.5">{fmt(8300)} kontaktów</div>
            <div className="mt-3 space-y-1.5 text-sm">
              <div className="flex justify-between"><span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#16a34a]" />Ze zgodą marketingową</span><b>{fmt(7100)}</b></div>
              <div className="flex justify-between"><span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#d97706]" />Bez zgody</span><b>{fmt(1200)}</b></div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-lg border border-dashed border-[var(--border)] p-4">
            <div className="text-xs text-[var(--muted)]">Nie ma w Waszej bazie</div>
            <div className="text-2xl font-semibold mt-1">{fmt(1300)} <span className="text-sm font-normal text-[var(--muted)]">NIP</span></div>
            <div className="text-xs text-[var(--muted)] mt-0.5">brak kontaktów i brak zgody</div>
            <div className="mt-3 text-xs text-[#374151] leading-5">
              Znamy ich z rejestru, ale nie mamy żadnej zgody na komunikację marketingową.
            </div>
          </motion.div>
        </div>
      </Card>

      <div className="mt-4 rounded-xl bg-[#fff6e6] border border-[#fde3b0] p-4 text-sm text-[#92400e] leading-6">
        <b>Twoja decyzja:</b> bez zgody marketingowej nie wyślę maila, SMS-a ani WhatsAppa. Czy wysyłamy tylko do {fmt(7100)} kontaktów ze zgodą?
        Pozostałe ({fmt(1200)} kontaktów bez zgody i {fmt(1300)} POZ spoza bazy) mogę odłożyć na bok albo przekazać handlowcom.
      </div>
    </div>
  );
}

/* ---------- 2. Klastry ---------- */

const CLUSTERS = [
  { n: "Duże miasta", v: 5000, c: "#4f6bff", d: "Miasta powyżej 100 tys. mieszkańców. Zwykle większe placówki, decyzję podejmuje dyrektor albo kierownik." },
  { n: "Małe miasta", v: 2000, c: "#0f766e", d: "Mniejsze przychodnie, często decyduje sam właściciel-lekarz." },
  { n: "Odrzuty", v: 100, c: "#9ca3af", d: "Placówki zamknięte w RPWDL, błędne dane kontaktowe, duplikaty." },
];

export function PozClusters() {
  const total = CLUSTERS.reduce((a, c) => a + c.v, 0);
  return (
    <div className={wrap}>
      <Header eyebrow="Podział bazy" title="3 klastry do potwierdzenia" badge={<Pill tone="accent">{fmt(total)} kontaktów ze zgodą</Pill>} />
      <div className="h-4 rounded-full overflow-hidden flex mb-5">
        {CLUSTERS.map((c) => (
          <motion.div key={c.n} initial={{ width: 0 }} animate={{ width: `${(c.v / total) * 100}%` }} transition={{ duration: 0.6 }} style={{ background: c.c }} />
        ))}
      </div>
      <div className="space-y-3">
        {CLUSTERS.map((c, i) => (
          <motion.div key={c.n} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className={`bg-[var(--panel)] border border-[var(--border)] rounded-xl p-4 flex gap-4 ${c.n === "Odrzuty" ? "opacity-70" : ""}`}>
            <span className="w-1.5 rounded-full" style={{ background: c.c }} />
            <div className="flex-1">
              <div className="flex justify-between">
                <span className="text-sm font-semibold">{c.n}</span>
                <span className="text-sm font-semibold">{fmt(c.v)}</span>
              </div>
              <div className="text-xs text-[var(--muted)] mt-1 leading-5">{c.d}</div>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="mt-4 rounded-xl bg-[#eef1ff] border border-[#d9defe] p-4 text-sm text-[#2f3a8f] leading-6">
        Nie wiemy, ilu specjalistów ma każda placówka, więc dzielę po wielkości miasta. To najlepsze przybliżenie wielkości placówki i tego, kto u nich decyduje.
      </div>
    </div>
  );
}

/* ---------- 3. Treści dla dużych miast ---------- */

export function PozContent() {
  return (
    <div className={wrap}>
      <Header eyebrow="Treści · duże miasta (5 000)" title="Mniej czasu na rejestrację, więcej na pacjentów" />

      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="rounded-xl border-2 border-[#4f6bff] bg-[#eef1ff] p-3">
          <div className="text-[10px] uppercase tracking-wider text-[var(--muted)]">Duże miasta · pokazane niżej</div>
          <div className="text-sm font-semibold mt-0.5">Skala i oszczędność czasu</div>
          <div className="text-xs text-[#374151] mt-1">Dużo pacjentów, kolejki na telefonie, kilka osób w rejestracji.</div>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--panel)] p-3 opacity-70">
          <div className="text-[10px] uppercase tracking-wider text-[var(--muted)]">Małe miasta · kolejna fala</div>
          <div className="text-sm font-semibold mt-0.5">Prosto i bez wdrożenia</div>
          <div className="text-xs text-[#374151] mt-1">Właściciel sam wszystkiego pilnuje, liczy się prostota i wsparcie.</div>
        </div>
      </div>

      <div className="text-[10px] uppercase tracking-wider text-[var(--muted)] mb-2">Mail</div>
      <div className="rounded-xl border border-[var(--border)] overflow-hidden bg-white">
        <div className="px-4 py-3 bg-[var(--panel-2)] border-b border-[var(--border)] text-xs space-y-0.5">
          <div><span className="text-[var(--muted)]">Od:</span> Anna Kowalczyk &lt;anna.kowalczyk@twojafirma.pl&gt;</div>
          <div><span className="text-[var(--muted)]">Do:</span> dyrektor@przychodnia-mokotow.pl</div>
          <div className="text-sm font-semibold pt-1">Jak przychodnie w Warszawie skracają kolejkę na telefonie o połowę</div>
        </div>
        <div className="px-4 py-4 text-sm leading-6 text-[#374151] whitespace-pre-line">
          {`Dzień dobry Pani Dyrektor,

w dużych POZ-ach rejestracja potrafi zjeść kilka godzin dziennie, bo telefony, przełożone wizyty i pacjenci, którzy nie przychodzą.

Pomagamy przychodniom takim jak Pani:
• pacjenci sami umawiają i przekładają wizyty online,
• automatyczne przypomnienia SMS ograniczają nieobecności,
• rejestracja odbiera o połowę mniej telefonów.

Czy znajdzie Pani 20 minut w przyszłym tygodniu, żebym pokazała, jak to wygląda w przychodni podobnej do Państwa?`}
          <div className="mt-4 flex items-center gap-3">
            <span className="inline-block px-4 py-2 rounded-md text-sm font-semibold text-white bg-[#0f766e]">Wybierz termin demo</span>
            <span className="text-xs text-[var(--muted)]">link do kalendarza handlowca</span>
          </div>
          <div className="mt-4 text-xs text-[var(--muted)]">Anna Kowalczyk · opiekun placówek medycznych · 600 123 456</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-5">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-[var(--muted)] mb-2">SMS</div>
          <div className="rounded-xl bg-[var(--panel-2)] border border-[var(--border)] p-3">
            <div className="text-[10px] text-[var(--muted)] mb-1.5">Od: TwojaFirma</div>
            <div className="inline-block rounded-2xl rounded-bl-sm bg-[#e5e7eb] px-3 py-2 text-[13px] leading-5 text-[#111827]">
              Dzień dobry, tu Anna z TwojaFirma. Wysłałam maila o skróceniu kolejki na telefonie w Państwa POZ. Pokażę w 20 min, jak to działa: twojafirma.pl/demo
            </div>
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-[var(--muted)] mb-2">WhatsApp</div>
          <div className="rounded-xl p-3" style={{ background: "#efeae2" }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-7 h-7 rounded-full bg-[#0f766e] text-white text-[10px] font-bold flex items-center justify-center">AK</span>
              <div className="text-xs"><b>Anna · TwojaFirma</b><div className="text-[10px] text-[var(--muted)]">konto firmowe</div></div>
            </div>
            <div className="rounded-lg rounded-tl-sm bg-white px-3 py-2 text-[13px] leading-5 text-[#111827] shadow-sm">
              Dzień dobry 👋 Pomagamy dużym POZ-om odciążyć rejestrację: mniej telefonów, mniej nieobecności pacjentów. Mogę pokazać to w 20 minut. Pasuje Pani wtorek albo czwartek?
              <div className="text-[10px] text-[var(--muted)] text-right mt-1">10:02 ✓✓</div>
            </div>
            <div className="flex gap-2 mt-2">
              {["Wtorek", "Czwartek", "Nie teraz"].map((b) => (
                <span key={b} className="flex-1 text-center rounded-lg bg-white text-[12px] font-medium text-[#0f766e] py-1.5 shadow-sm">{b}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- 4. Ścieżka na 2 tygodnie ---------- */

const PATH: { day: string; ch: PCh; what: string; cond: string }[] = [
  { day: "Dzień 1 · wt 9:00", ch: "Mail", what: "Mail „Skróćcie kolejkę na telefonie o połowę”", cond: "Start dla wszystkich" },
  { day: "Dzień 2", ch: "SMS", what: "Krótki SMS z linkiem do demo", cond: "Jeśli mail nie został otwarty w 24 h" },
  { day: "Dzień 4", ch: "WhatsApp", what: "Wiadomość z przyciskami „wtorek / czwartek / nie teraz”", cond: "Jeśli brak reakcji na mail i SMS" },
  { day: "Dzień 8", ch: "Mail", what: "Przypomnienie z case study przychodni z tego samego miasta", cond: "Jeśli nadal brak reakcji" },
  { day: "Dzień 11", ch: "SMS", what: "Ostatnia wiadomość: „Czy mam się już nie odzywać?”", cond: "Jeśli nadal brak reakcji" },
];

export function PozPath() {
  return (
    <div className={wrap}>
      <Header eyebrow="Ścieżka wysyłek · duże miasta" title="Najbliższe 2 tygodnie" badge={<Pill tone="accent">{fmt(5000)} kontaktów</Pill>} />
      <div className="relative pl-6">
        <div className="absolute left-[11px] top-2 bottom-2 w-px bg-[var(--border)]" />
        <div className="space-y-3">
          {PATH.map((p, i) => (
            <motion.div key={p.day} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }} className="relative">
              <span className="absolute -left-6 top-4 w-[11px] h-[11px] rounded-full ring-4 ring-[var(--bg)]" style={{ background: PCH_COLOR[p.ch], left: "-19px" }} />
              <div className="bg-[var(--panel)] border border-[var(--border)] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-[var(--muted)] w-32">{p.day}</span>
                  <ChTag ch={p.ch} />
                </div>
                <div className="text-sm font-medium">{p.what}</div>
                <div className="text-xs text-[var(--muted)] mt-1">↳ {p.cond}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-5">
        <Card title="Kiedy przekazuję do handlowca">
          <div className="space-y-2 text-sm">
            {[
              "otworzył maila 2+ razy",
              "kliknął w link do demo, ale nie umówił",
              "odpisał na SMS albo WhatsApp",
            ].map((t) => (
              <div key={t} className="flex items-center gap-2"><ChTag ch="Telefon" /><span>{t}</span></div>
            ))}
          </div>
          <div className="text-xs text-[var(--muted)] mt-3 leading-5">Automat się zatrzymuje, a handlowiec dostaje kontakt z historią: co ta osoba otworzyła i w co kliknęła.</div>
        </Card>
        <Card title="Kiedy kończę ścieżkę">
          <div className="space-y-2 text-sm text-[#374151]">
            <div>✅ umówił demo</div>
            <div>🚫 kliknął „nie teraz” albo wypisał się</div>
            <div>⏹ minęły 2 tygodnie</div>
          </div>
          <div className="text-xs text-[var(--muted)] mt-3 leading-5">Maks. 1 wiadomość dziennie i tylko w godzinach pracy przychodni.</div>
        </Card>
      </div>
    </div>
  );
}

/* ---------- 5. Przebieg na żywo ---------- */

export function PozLive() {
  const [day, setDay] = useState(1);
  useEffect(() => {
    const iv = setInterval(() => setDay((d) => (d >= 14 ? 14 : d + 1)), 700);
    return () => clearInterval(iv);
  }, []);
  const p = day / 14;
  const stats = [
    { l: "Wysłane wiadomości", v: Math.round(13800 * p), tone: "accent" as const },
    { l: "Otwarcia / odczyty", v: Math.round(2150 * p) },
    { l: "Przekazane handlowcom", v: Math.round(640 * p) },
    { l: "Umówione dema", v: Math.round(85 * p), tone: "good" as const },
  ];
  const events: { d: number; t: string; ch: PCh }[] = [
    { d: 1, t: "Przychodnia Mokotów otworzyła maila 3 razy → do handlowca", ch: "Mail" },
    { d: 2, t: "Centrum Medyczne Ursus: brak otwarcia w 24 h → SMS", ch: "SMS" },
    { d: 3, t: "POZ Wrocław-Krzyki kliknął link do demo → do handlowca", ch: "Mail" },
    { d: 4, t: "Przychodnia Rodzinna Gdańsk wybrała „czwartek” → demo umówione", ch: "WhatsApp" },
    { d: 6, t: "NZOZ Łódź-Bałuty odpisał na SMS → do handlowca", ch: "SMS" },
    { d: 8, t: "Przychodnia Kraków-Nowa Huta: case study otwarte → demo umówione", ch: "Mail" },
    { d: 11, t: "POZ Poznań-Jeżyce: „nie teraz” → koniec ścieżki", ch: "WhatsApp" },
  ];
  return (
    <div className={wrap}>
      <Header eyebrow="Wysyłka trwa · duże miasta" title={`Dzień ${day} z 14`} badge={<Pill tone="good">● W toku</Pill>} />
      <div className="h-2 rounded-full bg-[var(--panel-2)] overflow-hidden mb-5">
        <motion.div animate={{ width: `${p * 100}%` }} className="h-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)]" />
      </div>
      <div className="grid grid-cols-4 gap-3 mb-4">
        {stats.map((s) => <Stat key={s.l} label={s.l} value={fmt(s.v)} tone={s.tone} />)}
      </div>
      <Card title="Co się dzieje">
        <div className="space-y-2 min-h-[260px]">
          {events.filter((e) => e.d <= day).reverse().map((e) => (
            <motion.div key={e.t} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 rounded-lg border border-[var(--border)] px-3 py-2.5 text-sm">
              <span className="text-xs text-[var(--muted)] w-14 shrink-0">dzień {e.d}</span>
              <ChTag ch={e.ch} />
              <span className="flex-1">{e.t}</span>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ---------- 6. Podsumowanie po 2 tygodniach ---------- */

const OUTCOME = [
  { n: "Umówili demo", v: 85, c: "#16a34a", d: "Mail 31 · SMS 22 · WhatsApp 32" },
  { n: "Interakcja bez demo", v: 640, c: "#4f6bff", d: "Otworzyli maila kilka razy, kliknęli albo odpisali, ale nie umówili się" },
  { n: "Nic nie zrobili", v: 4100, c: "#9ca3af", d: "Nie otworzyli ani nie odpisali na żaden z 5 kontaktów" },
  { n: "Odbicia i wypisy", v: 175, c: "#dc2626", d: "Błędne adresy i numery, „nie teraz”, wypis" },
];

export function PozSummary() {
  return (
    <div className={wrap}>
      <Header eyebrow="Podsumowanie · duże miasta · 2 tygodnie" title="Jak poszło" />
      <div className="grid grid-cols-4 gap-3 mb-5">
        <Stat label="Kontakty w ścieżce" value={fmt(5000)} />
        <Stat label="Umówione dema" value="85" tone="good" />
        <Stat label="Do obdzwonienia" value="640" tone="accent" />
        <Stat label="Najlepszy kanał" value="WhatsApp" sub="32 dema z 1 900 wiadomości" />
      </div>
      <Card title="Co zrobiło 5 000 kontaktów">
        <div className="h-4 rounded-full overflow-hidden flex mb-4">
          {OUTCOME.map((o) => (
            <motion.div key={o.n} initial={{ width: 0 }} animate={{ width: `${Math.max((o.v / 5000) * 100, 1.5)}%` }} transition={{ duration: 0.6 }} style={{ background: o.c }} />
          ))}
        </div>
        <div className="space-y-2.5">
          {OUTCOME.map((o) => (
            <div key={o.n} className="flex items-start gap-3 text-sm">
              <span className="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0" style={{ background: o.c }} />
              <div className="flex-1">
                <div className="font-medium">{o.n}</div>
                <div className="text-xs text-[var(--muted)]">{o.d}</div>
              </div>
              <span className="font-semibold">{fmt(o.v)}</span>
            </div>
          ))}
        </div>
      </Card>
      <div className="mt-5 text-sm font-semibold mb-3">Moja rekomendacja</div>
      <div className="grid grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border-2 border-[#7c5cff] bg-white p-4">
          <div className="flex items-center gap-2 mb-2"><ChTag ch="Telefon" /><span className="text-sm font-semibold">640 → obdzwonić teraz</span></div>
          <div className="text-xs text-[#374151] leading-5">Są zainteresowani, ale coś ich zatrzymało. Rozmowa z człowiekiem domknie to najszybciej. Kolejność: najpierw ci, którzy kliknęli link do demo (190).</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-xl border-2 border-[var(--accent)] bg-white p-4">
          <div className="flex items-center gap-2 mb-2"><Pill tone="accent">Nowa ścieżka</Pill><span className="text-sm font-semibold">4 100 → inna treść i kolejność</span></div>
          <div className="text-xs text-[#374151] leading-5">Ten komunikat ich nie ruszył. Spróbujmy innego kąta (case study przychodni z ich miasta) i zacznijmy od WhatsAppa, bo tam reakcja była najlepsza.</div>
        </motion.div>
      </div>
    </div>
  );
}

/* ---------- 7. Następny krok ---------- */

const CALL_LIST = [
  { who: "Przychodnia Mokotów, Warszawa", person: "dr Ewa Nowak, dyrektor", signal: "kliknęła link do demo 2×", prio: "Gorący" },
  { who: "POZ Wrocław-Krzyki", person: "Marek Zieliński, kierownik", signal: "kliknął link, nie wybrał terminu", prio: "Gorący" },
  { who: "NZOZ Łódź-Bałuty", person: "Joanna Wójcik, rejestracja", signal: "odpisała na SMS: „proszę o kontakt”", prio: "Gorący" },
  { who: "Centrum Medyczne Ursus, Warszawa", person: "Piotr Lis, dyrektor", signal: "otworzył maila 4×", prio: "Ciepły" },
  { who: "Przychodnia Rodzinna Oliwa, Gdańsk", person: "Katarzyna Mazur, właścicielka", signal: "odczytała WhatsApp, bez odpowiedzi", prio: "Ciepły" },
];

const NEW_PATH: { day: string; ch: PCh; what: string }[] = [
  { day: "Dzień 1", ch: "WhatsApp", what: "Case study: „Przychodnia z Twojego miasta przyjmuje o 15% więcej pacjentów”" },
  { day: "Dzień 3", ch: "Mail", what: "Pełne case study z liczbami i opinią kierownika" },
  { day: "Dzień 7", ch: "SMS", what: "Zaproszenie na 15-minutowe demo online" },
];

export function PozNext() {
  return (
    <div className={wrap}>
      <Header eyebrow="Następny krok" title="Lista dla handlowców i nowa ścieżka" />
      <Card title="Do obdzwonienia: 640 kontaktów (w CRM, posortowane)">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-[var(--muted)]">
              <th className="pb-2 font-medium">Placówka</th>
              <th className="pb-2 font-medium">Osoba</th>
              <th className="pb-2 font-medium">Co zrobiła</th>
              <th className="pb-2 font-medium text-right">Priorytet</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {CALL_LIST.map((c) => (
              <tr key={c.who}>
                <td className="py-2.5 font-medium">{c.who}</td>
                <td className="py-2.5 text-[var(--muted)] text-xs">{c.person}</td>
                <td className="py-2.5 text-xs">{c.signal}</td>
                <td className="py-2.5 text-right"><Pill tone={c.prio === "Gorący" ? "warn" : "accent"}>{c.prio}</Pill></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-xs text-[var(--muted)] mt-3">…i 635 kolejnych. Każdy kontakt ma w CRM historię: co otworzył, w co kliknął i co odpisał.</div>
      </Card>
      <Card title="Nowa ścieżka dla 4 100 bez reakcji" className="mt-4">
        <div className="space-y-2">
          {NEW_PATH.map((p) => (
            <div key={p.day} className="flex items-center gap-3 text-sm rounded-lg border border-[var(--border)] px-3 py-2.5">
              <span className="text-xs text-[var(--muted)] w-16 shrink-0">{p.day}</span>
              <ChTag ch={p.ch} />
              <span>{p.what}</span>
            </div>
          ))}
        </div>
        <div className="text-xs text-[var(--muted)] mt-3">Inna treść (case study zamiast oszczędności czasu) i inna kolejność (WhatsApp na start). Rusza w poniedziałek.</div>
      </Card>
      <div className="mt-4 rounded-xl bg-[#eef1ff] border border-[#d9defe] p-4 text-sm text-[#2f3a8f] leading-6">
        Równolegle startuje ścieżka dla małych miast (2 000 kontaktów) z komunikatem „prosto i bez wdrożenia”.
      </div>
    </div>
  );
}
