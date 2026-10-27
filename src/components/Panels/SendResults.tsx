"use client";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { script } from "@/lib/demoScript";
import {
  NEW_SEGMENTS,
  LARGEST_SEGMENT_KEY,
  largestSegment,
  AB_TEST_SAMPLE_SHARE,
  AB_TEST_RESULTS,
  abTestSampleSize,
  abTestRemainderSize,
  ATTRIBUTION_WAIT_DAYS,
} from "@/lib/scenario";
import { fmtNumber, fmtPct } from "@/lib/format";
import { PRICE_SENSITIVE_VARIANTS, PRICE_SENSITIVE_WINNER } from "@/lib/creatives";
import { SmsPreview } from "@/components/ui/MessagePreview";
import { goForward } from "@/lib/nav";

const CHANNEL_LABEL: Record<string, string> = { push: "Push (apka)", email: "Twoje narzędzie do e-maili", sms: "Twoja bramka SMS" };

function CheckIcon() {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-16 h-16 rounded-full bg-[var(--accent)]/10 flex items-center justify-center mb-5"
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6 9 17l-5-5" />
      </svg>
    </motion.div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex-1">
      <div className="text-[10px] uppercase tracking-wider text-[var(--muted)]">{label}</div>
      <div className="text-sm font-semibold">{value}</div>
    </div>
  );
}

export default function SendResults() {
  const stepIndex = useStore((s) => s.stepIndex);
  const currentStepId = script[stepIndex - 1]?.id;
  const phase: "testing" | "results" | "done" =
    currentStepId === "s7c_send_rest" ? "done" : currentStepId === "s7b_results" ? "results" : "testing";
  const largest = largestSegment();
  const otherSegments = NEW_SEGMENTS.filter((s) => s.key !== LARGEST_SEGMENT_KEY);

  if (phase === "testing") {
    return (
      <div className="p-8 flex flex-col items-center text-center">
        <CheckIcon />
        <div className="text-xs uppercase tracking-wider text-[var(--muted)] mb-2">Krok 3 · Wysyłka</div>
        <h2 className="text-2xl font-semibold mb-3">Test w toku: {fmtPct(AB_TEST_SAMPLE_SHARE, 0)} grupy „wrażliwi na cenę”</h2>
        <p className="text-sm text-[var(--muted)] max-w-md leading-relaxed mb-6">
          {otherSegments.map((s) => s.label).join(" i ")} poszły już w całości przez {otherSegments.map((s) => CHANNEL_LABEL[s.channel]).join(" i ")}.
          W grupie „{largest.label.toLowerCase()}” wysłałem oba warianty SMS-a do {fmtNumber(abTestSampleSize())} z{" "}
          {fmtNumber(largest.recipients)} osób — czekam na wynik, zanim wyślę do reszty.
        </p>

        <div className="grid grid-cols-2 gap-4 max-w-md w-full mb-6">
          {PRICE_SENSITIVE_VARIANTS.map((v) => (
            <div key={v.id} className="bg-[var(--panel)] border border-[var(--border)] rounded-xl p-3">
              <div className="text-[10px] uppercase tracking-wider text-[var(--muted)] mb-1">{v.label}</div>
              <SmsPreview body={v.body} />
            </div>
          ))}
        </div>

        <button
          onClick={() => goForward()}
          className="px-5 py-2.5 rounded-lg bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90"
        >
          Co pokazuje test? →
        </button>
      </div>
    );
  }

  if (phase === "results") {
    return (
      <div className="p-8 flex flex-col items-center text-center">
        <div className="text-xs uppercase tracking-wider text-[var(--muted)] mb-2">Krok 3 · Wysyłka</div>
        <h2 className="text-2xl font-semibold mb-3">Pierwsze wyniki testu</h2>

        <div className="grid grid-cols-2 gap-4 max-w-lg w-full mb-5">
          {PRICE_SENSITIVE_VARIANTS.map((v) => {
            const r = AB_TEST_RESULTS[v.id];
            const isWinner = v.id === PRICE_SENSITIVE_WINNER;
            return (
              <div
                key={v.id}
                className={`bg-[var(--panel)] border rounded-xl p-3 ${
                  isWinner ? "border-[var(--accent)] ring-2 ring-[var(--accent)]/20" : "border-[var(--border)]"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="text-[10px] uppercase tracking-wider text-[var(--muted)]">{v.label}</div>
                  {isWinner && <span className="text-[10px] font-semibold text-[var(--accent)]">liderem</span>}
                </div>
                <SmsPreview body={v.body} />
                <div className="flex gap-2 mt-3 pt-3 border-t border-[var(--border)]">
                  <Stat label="Otwarcia" value={fmtPct(r.openRate, 0)} />
                  <Stat label="Kliknięcia" value={fmtPct(r.clickRate, 0)} />
                  <Stat label="Zamówienia" value={fmtNumber(r.orders)} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="max-w-lg bg-[#fff7ed] border border-[#fed7aa] rounded-xl p-4 text-sm text-[#9a3412] mb-6">
          Zamówienia jeszcze trudno porównać — za mało danych i brak pełnej atrybucji. Ale po otwarciach i
          kliknięciach, czyli górze lejka, już widać, że wygrywa{" "}
          {PRICE_SENSITIVE_WINNER === "b" ? "wariant B" : "wariant A"}.
        </div>

        <button
          onClick={() => goForward()}
          className="px-5 py-2.5 rounded-lg bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90"
        >
          Tak, wyślij do reszty →
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-10">
      <CheckIcon />
      <div className="text-xs uppercase tracking-wider text-[var(--muted)] mb-2">Krok 3 · Wysyłka</div>
      <h2 className="text-2xl font-semibold mb-3">Kampania wysłana</h2>

      <p className="text-sm text-[var(--muted)] max-w-md leading-relaxed mb-2">
        W grupie „{largest.label.toLowerCase()}” wygrał{" "}
        {PRICE_SENSITIVE_WINNER === "b" ? "wariant B" : "wariant A"} — dostało go pozostałe{" "}
        {fmtNumber(abTestRemainderSize())} osób.
      </p>
      <p className="text-sm text-[var(--muted)] max-w-md leading-relaxed mb-6">
        Wysłane w całości, przez Twoje istniejące narzędzia:{" "}
        {NEW_SEGMENTS.map((s) => CHANNEL_LABEL[s.channel]).join(", ")}.
      </p>

      <div className="max-w-md bg-[var(--panel)] border border-[var(--border)] rounded-xl p-5">
        <div className="text-sm text-[var(--text)] leading-relaxed">
          Wracam za <span className="font-medium">{ATTRIBUTION_WAIT_DAYS} dni</span> z porównaniem wyników — tyle
          potrzeba, żeby zamówienia poprawnie zaatrybuowały się w Twoich systemach.
        </div>
      </div>

      <button
        onClick={() => goForward()}
        className="mt-6 px-5 py-2.5 rounded-lg border border-[var(--border)] text-sm hover:bg-[var(--panel-2)]"
      >
        Przewiń {ATTRIBUTION_WAIT_DAYS} dni →
      </button>
    </div>
  );
}
