"use client";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { computeMetrics } from "@/lib/metrics";

export default function WeekLaterReport() {
  const { emailCount, smsCount } = useStore();
  const { email, sms } = computeMetrics(emailCount, smsCount);

  const winner = sms.ctr > email.ctr ? "SMS" : "Email";
  const winnerMeetings = sms.meetings;
  const loserMeetings = email.meetings;

  return (
    <div className="p-8">
      <div className="text-xs uppercase tracking-wider text-[var(--muted)] mb-1">Podsumowanie · dzień 7</div>
      <h2 className="text-2xl font-semibold mb-6">Wyniki i rekomendacje Growth Marketer AI</h2>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[var(--panel)] border border-[var(--border)] rounded-xl p-5"
        >
          <div className="text-xs text-[var(--muted)]">Zwycięski kanał</div>
          <div className="text-3xl font-semibold mt-1" style={{ color: "var(--accent-2)" }}>{winner}</div>
          <div className="text-xs text-[var(--muted)] mt-2">
            CTR {sms.ctr}% vs {email.ctr}% dla e-maila
          </div>
        </motion.div>
        <div className="bg-[var(--panel)] border border-[var(--border)] rounded-xl p-5">
          <div className="text-xs text-[var(--muted)]">Umówione spotkania</div>
          <div className="text-3xl font-semibold mt-1">{(winnerMeetings + loserMeetings).toLocaleString("pl-PL")}</div>
          <div className="text-xs text-[var(--muted)] mt-2">
            SMS: {winnerMeetings} · Email: {loserMeetings}
          </div>
        </div>
        <div className="bg-[var(--panel)] border border-[var(--border)] rounded-xl p-5">
          <div className="text-xs text-[var(--muted)]">Źle dobrany kanał</div>
          <div className="text-3xl font-semibold mt-1">~4 000</div>
          <div className="text-xs text-[var(--muted)] mt-2">
            kontaktów, które nie zareagowały ani na email, ani na SMS
          </div>
        </div>
      </div>

      <div className="bg-[var(--panel)] border border-[var(--border)] rounded-xl p-6 mb-4">
        <div className="text-sm uppercase tracking-wider text-[var(--muted)] mb-3">Diagnoza</div>
        <p className="text-sm leading-relaxed text-[var(--text)]">
          Dla segmentu POZ z opłaconymi fakturami SMS zdecydowanie dominuje jako kanał
          pierwszego kontaktu. Wybór 50/50 był konserwatywny — historia HubSpota już
          sugerowała przewagę SMS. Dla ~4 000 kontaktów oba kanały cyfrowe nie zadziałały;
          typowy profil: mniejsza placówka, brak aktywności mailowej od 6+ miesięcy.
        </p>
      </div>

      <div className="bg-[var(--panel)] border border-[var(--border)] rounded-xl p-6">
        <div className="text-sm uppercase tracking-wider text-[var(--muted)] mb-3">Rekomendacje</div>
        <ol className="text-sm leading-relaxed space-y-2 list-decimal list-inside">
          <li>
            Zwiększyć udział SMS do 80% w kolejnej fali kampanii — oczekiwany wzrost
            spotkań o ~35% przy tym samym budżecie.
          </li>
          <li>
            Wygenerować listę 5 000 kontaktów bez reakcji cyfrowej i przekazać do zespołu
            call center — Growth Marketer AI może przygotować skrypt rozmowy dopasowany do wybranej kreacji.
          </li>
          <li>
            Uruchomić retarget SMS z drugim wariantem kreacji (redukcja no-show) dla kontaktów,
            które kliknęły, ale nie umówiły spotkania (~180 kontaktów).
          </li>
        </ol>
        <div className="mt-6 flex gap-2">
          <button className="px-4 py-2 rounded-md bg-[var(--accent)] text-white text-sm font-medium">
            Przygotuj listę do call center
          </button>
          <button className="px-4 py-2 rounded-md border border-[var(--border)] text-sm hover:bg-[var(--panel-2)]">
            Uruchom retarget SMS
          </button>
        </div>
      </div>
    </div>
  );
}
