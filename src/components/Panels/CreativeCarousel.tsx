"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
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

function ChannelTabs({ value, onChange }: { value: Channel; onChange: (c: Channel) => void }) {
  const tabs: { id: Channel; label: string }[] = [
    { id: "email", label: "Email" },
    { id: "sms", label: "SMS" },
    { id: "push", label: "Push" },
  ];
  return (
    <div className="inline-flex bg-[var(--panel-2)] border border-[var(--border)] rounded-md p-1 text-xs">
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={(e) => {
            e.stopPropagation();
            onChange(t.id);
          }}
          className={`px-3 py-1 rounded-md transition ${
            value === t.id ? "bg-[var(--accent)] text-white font-medium" : "text-[var(--muted)] hover:text-[var(--text)]"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

function ChannelPreview({ c, channel }: { c: Creative; channel: Channel }) {
  if (channel === "email") {
    return (
      <div className="text-xs">
        <div className="text-[10px] uppercase tracking-wider text-[var(--muted)] mb-1">Temat</div>
        <div className="font-medium mb-2 leading-snug">{fill(c.email.subject)}</div>
        <div className="text-[10px] uppercase tracking-wider text-[var(--muted)] mb-1">Preheader</div>
        <div className="italic text-[var(--muted)] mb-3">{fill(c.email.preheader)}</div>
        <div className="text-[10px] uppercase tracking-wider text-[var(--muted)] mb-1">Treść</div>
        <div className="whitespace-pre-wrap leading-relaxed text-[var(--text)]/90 line-clamp-6">
          {fill(c.email.body)}
        </div>
        <div className="mt-3 inline-block px-3 py-1 rounded bg-[var(--accent)] text-white text-[11px] font-medium">
          {c.email.cta}
        </div>
      </div>
    );
  }
  if (channel === "sms") {
    const body = fill(c.sms.body);
    return (
      <div className="flex flex-col items-center py-2">
        <div className="w-[180px] rounded-[24px] border-2 border-[#e3e6ee] bg-[#f5f6fa] p-3">
          <div className="text-[9px] text-[var(--muted)] text-center mb-1">POZ-Product</div>
          <div className="bg-gradient-to-br from-[var(--accent-2)] to-[#a78bfa] text-white text-[11px] leading-snug rounded-2xl rounded-bl-sm px-2.5 py-1.5">
            {body}
          </div>
        </div>
        <div className="text-[10px] text-[var(--muted)] mt-2">{body.length}/160 znaków</div>
      </div>
    );
  }
  // push
  return (
    <div className="py-2">
      <div className="bg-[#ffffff] border border-[var(--border)] rounded-xl p-3 shadow-lg">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-5 h-5 rounded bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)]" />
          <div className="text-[10px] text-[var(--muted)] uppercase tracking-wider">POZ-Product · teraz</div>
        </div>
        <div className="font-semibold text-xs mb-1 leading-snug">{fill(c.push.title)}</div>
        <div className="text-[11px] text-[var(--muted)] leading-snug">{fill(c.push.body)}</div>
      </div>
      <div className="text-[10px] text-[var(--muted)] mt-2 text-center">Powiadomienie mobilne / desktop</div>
    </div>
  );
}

export default function CreativeCarousel() {
  const { selectedCreativeId, setSelectedCreative } = useStore();
  const creatives = creativesData as Creative[];
  const [channels, setChannels] = useState<Record<string, Channel>>({});

  const getChannel = (id: string): Channel => channels[id] ?? "email";
  const setChannel = (id: string, c: Channel) =>
    setChannels((prev) => ({ ...prev, [id]: c }));

  return (
    <div className="p-8">
      <div className="text-xs uppercase tracking-wider text-[var(--muted)] mb-1">Kreacje</div>
      <h2 className="text-2xl font-semibold mb-2">Propozycje Growth Marketer AI</h2>
      <p className="text-sm text-[var(--muted)] mb-6 max-w-3xl">
        Trzy warianty pod różne kąty wartości. Każdy z podglądem treści dla e-maila, SMS
        i push — przełącz kanał na karcie, żeby zobaczyć jak brzmi komunikat. Wybierz
        wariant, który najlepiej pasuje.
      </p>

      <div className="grid grid-cols-3 gap-4">
        {creatives.map((c, i) => {
          const selected = selectedCreativeId === c.id;
          const ch = getChannel(c.id);
          return (
            <motion.button
              key={c.id}
              onClick={() => setSelectedCreative(c.id)}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`text-left bg-[var(--panel)] border rounded-xl p-5 transition flex flex-col ${
                selected
                  ? "border-[var(--accent)] ring-2 ring-[var(--accent)]/30"
                  : "border-[var(--border)] hover:border-[#c7cdda]"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="text-[10px] uppercase tracking-wider text-[var(--muted)]">
                  Wariant #{i + 1} · {c.angle}
                </div>
                <ChannelTabs value={ch} onChange={(v) => setChannel(c.id, v)} />
              </div>
              <div className="font-semibold mb-3 leading-snug">{c.title}</div>

              <div className="bg-[var(--panel-2)] border border-[var(--border)] rounded-lg p-3 min-h-[220px]">
                <ChannelPreview c={c} channel={ch} />
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-[var(--muted)]">
                <span>Podwarianty A/B: <span className="text-[var(--text)]">{c.variants.length}</span></span>
                <span className={selected ? "text-[var(--accent)]" : ""}>
                  {selected ? "✓ Wybrane" : "Kliknij, aby wybrać"}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
