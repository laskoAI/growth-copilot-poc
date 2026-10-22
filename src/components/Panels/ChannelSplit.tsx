"use client";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import creativesData from "@/data/creatives.json";

type Channel = "email" | "sms" | "push";

type Variant = {
  id: string;
  label: string;
  hypothesis: string;
  email: { subject: string; preheader: string; body: string; cta: string };
  sms: { body: string };
  push: { title: string; body: string };
};

type Creative = {
  id: string;
  title: string;
  angle: string;
  cta: string;
  email: { subject: string; preheader: string; body: string; cta: string };
  sms: { body: string };
  push: { title: string; body: string };
  variants: Variant[];
};

const SAMPLE_NAME = "Centrum Medyczne Warszawa";
function fill(text: string) {
  return text.replaceAll("{imie_placowki}", SAMPLE_NAME).replaceAll("{link}", "poz.link/demo");
}

function EmailPreview({ v }: { v: Variant }) {
  return (
    <div className="bg-[var(--panel)] border border-[var(--border)] rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-[var(--border)] bg-[var(--panel-2)] flex items-center gap-2">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="text-xs text-[var(--muted)] ml-2">Podgląd emaila · {v.label}</div>
      </div>
      <div className="px-5 py-4 border-b border-[var(--border)] text-xs text-[var(--muted)] space-y-1">
        <div><span className="text-[var(--text)]">Od:</span> TwojaFirma &lt;kontakt@twojafirma.pl&gt;</div>
        <div><span className="text-[var(--text)]">Do:</span> {SAMPLE_NAME}</div>
        <div className="pt-1"><span className="text-[var(--text)]">Temat:</span> <span className="text-[var(--text)] font-medium">{fill(v.email.subject)}</span></div>
        <div className="italic">{fill(v.email.preheader)}</div>
      </div>
      <div className="px-5 py-5 text-sm leading-relaxed whitespace-pre-wrap">{fill(v.email.body)}</div>
      <div className="px-5 pb-5">
        <span className="inline-block px-4 py-2 rounded-md bg-[var(--accent)] text-white text-sm font-medium">
          {v.email.cta}
        </span>
      </div>
    </div>
  );
}

function SmsPreview({ v }: { v: Variant }) {
  const body = fill(v.sms.body);
  return (
    <div className="bg-[var(--panel)] border border-[var(--border)] rounded-xl p-6 flex flex-col items-center">
      <div className="text-xs text-[var(--muted)] mb-4">Podgląd SMS · {v.label}</div>
      <div className="w-[220px] h-[340px] rounded-[36px] border-4 border-[#e3e6ee] bg-[#f5f6fa] p-4 flex flex-col">
        <div className="text-[10px] text-[var(--muted)] text-center mb-2">POZ-Product</div>
        <div className="flex-1 flex items-start">
          <div className="bg-gradient-to-br from-[var(--accent-2)] to-[#a78bfa] text-white text-xs leading-snug rounded-2xl rounded-bl-sm px-3 py-2 max-w-full">
            {body}
          </div>
        </div>
        <div className="text-[10px] text-[var(--muted)] text-center mt-2">{body.length}/160 znaków</div>
      </div>
    </div>
  );
}

function PushPreview({ v }: { v: Variant }) {
  return (
    <div className="bg-[var(--panel)] border border-[var(--border)] rounded-xl p-6 flex flex-col items-center">
      <div className="text-xs text-[var(--muted)] mb-4">Podgląd push · {v.label}</div>
      <div className="w-full max-w-[280px] bg-[#ffffff] border border-[var(--border)] rounded-xl p-4 shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)]" />
          <div className="text-[10px] text-[var(--muted)] uppercase tracking-wider">POZ-Product · teraz</div>
        </div>
        <div className="font-semibold text-sm mb-1 leading-snug">{fill(v.push.title)}</div>
        <div className="text-xs text-[var(--muted)] leading-snug">{fill(v.push.body)}</div>
      </div>
      <div className="text-[10px] text-[var(--muted)] mt-3">Powiadomienie mobilne / desktop</div>
    </div>
  );
}

export default function ChannelSplit() {
  const { emailCount, smsCount, selectedCreativeId } = useStore();
  const total = emailCount + smsCount;
  const emailPct = Math.round((emailCount / total) * 100);
  const smsPct = 100 - emailPct;

  const list = creativesData as Creative[];
  const current = list.find((c) => c.id === selectedCreativeId) ?? list[0];
  const variants = current.variants;

  // W kampanii A/B/C dzielimy każdy kanał na 3 równe podgrupy (jedna kreacja, 3 warianty)
  const [activeChannel, setActiveChannel] = useState<Channel>("email");
  const [activeVariantId, setActiveVariantId] = useState<string>(variants[0].id);
  const activeVariant = variants.find((v) => v.id === activeVariantId) ?? variants[0];

  // Ile kontaktów wchodzi w każdy podwariant
  const perVariantEmail = Math.floor(emailCount / 3);
  const perVariantSms = Math.floor(smsCount / 3);

  return (
    <div className="p-8">
      <div className="text-xs uppercase tracking-wider text-[var(--muted)] mb-1">Wybór kanału i testu A/B</div>
      <h2 className="text-2xl font-semibold mb-2">
        Kampania: <span className="text-[var(--accent)]">{current.angle}</span>
      </h2>
      <p className="text-sm text-[var(--muted)] mb-6 max-w-3xl">
        Wybrałeś wariant „{current.title}”. Aby wycisnąć maksimum z tej kampanii,
        Growth Marketer AI proponuje test A/B/C — trzy odmiany komunikatu tej samej kreacji, żeby
        sprawdzić, która hipoteza działa najlepiej. Split kanałów pozostaje 50/50 email vs SMS.
      </p>

      {/* Split kanałów */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-[var(--panel)] border border-[var(--border)] rounded-xl p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-[var(--muted)]">Email</div>
            <div className="text-xs px-2 py-0.5 rounded bg-[var(--panel-2)] border border-[var(--border)]">
              {emailPct}%
            </div>
          </div>
          <div className="text-3xl font-semibold text-[var(--accent)]">
            {emailCount.toLocaleString("pl-PL")}
          </div>
          <div className="text-xs text-[var(--muted)] mt-1">kontaktów · po ~{perVariantEmail.toLocaleString("pl-PL")} na wariant A/B/C</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-[var(--panel)] border border-[var(--border)] rounded-xl p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-[var(--muted)]">SMS</div>
            <div className="text-xs px-2 py-0.5 rounded bg-[var(--panel-2)] border border-[var(--border)]">
              {smsPct}%
            </div>
          </div>
          <div className="text-3xl font-semibold text-[var(--accent-2)]">
            {smsCount.toLocaleString("pl-PL")}
          </div>
          <div className="text-xs text-[var(--muted)] mt-1">kontaktów · po ~{perVariantSms.toLocaleString("pl-PL")} na wariant A/B/C</div>
        </motion.div>
      </div>

      <div className="h-3 rounded-full overflow-hidden bg-[var(--panel-2)] border border-[var(--border)] flex mb-8">
        <div className="bg-[var(--accent)]" style={{ width: `${emailPct}%` }} />
        <div className="bg-[var(--accent-2)]" style={{ width: `${smsPct}%` }} />
      </div>

      {/* Warianty A/B/C */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-xs uppercase tracking-wider text-[var(--muted)]">
            Test A/B/C · trzy odmiany komunikatu
          </div>
          <div className="text-xs text-[var(--muted)] mt-1">
            Kliknij wariant, żeby zobaczyć podgląd we wszystkich kanałach.
          </div>
        </div>
        <div className="flex gap-1 bg-[var(--panel-2)] border border-[var(--border)] rounded-lg p-1">
          {(["email", "sms", "push"] as Channel[]).map((c) => {
            const active = c === activeChannel;
            return (
              <button
                key={c}
                onClick={() => setActiveChannel(c)}
                className={`text-xs px-3 py-1.5 rounded-md transition capitalize ${
                  active
                    ? "bg-[var(--accent)] text-white font-medium"
                    : "text-[var(--muted)] hover:text-[var(--text)]"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-5">
        {variants.map((v) => {
          const active = v.id === activeVariantId;
          return (
            <button
              key={v.id}
              onClick={() => setActiveVariantId(v.id)}
              className={`text-left bg-[var(--panel)] border rounded-xl p-4 transition ${
                active
                  ? "border-[var(--accent)] ring-2 ring-[var(--accent)]/30"
                  : "border-[var(--border)] hover:border-[#c7cdda]"
              }`}
            >
              <div className="text-xs font-semibold mb-1">{v.label}</div>
              <div className="text-[11px] text-[var(--muted)] leading-snug mb-2">Hipoteza: {v.hypothesis}</div>
              <div className="text-[10px] text-[var(--muted)]">
                Email · {perVariantEmail.toLocaleString("pl-PL")} · SMS · {perVariantSms.toLocaleString("pl-PL")}
              </div>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeVariant.id + activeChannel}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
        >
          {activeChannel === "email" && <EmailPreview v={activeVariant} />}
          {activeChannel === "sms" && <SmsPreview v={activeVariant} />}
          {activeChannel === "push" && <PushPreview v={activeVariant} />}
        </motion.div>
      </AnimatePresence>

      <div className="mt-6 bg-[var(--panel)] border border-[var(--border)] rounded-xl p-5">
        <div className="text-xs uppercase tracking-wider text-[var(--muted)] mb-2">
          Raportowanie A/B/C
        </div>
        <ul className="text-sm text-[var(--muted)] space-y-1 list-disc list-inside">
          <li>Osobne metryki dla wariantu A, B i C w każdym kanale</li>
          <li>Winner detection po 48h — automatyczna eskalacja budżetu na wygrywający wariant</li>
          <li>Podział wyników email vs SMS + rekomendacje po tygodniu</li>
        </ul>
      </div>
    </div>
  );
}
