"use client";
import { useState } from "react";
import {
  NEW_SEGMENTS,
  LARGEST_SEGMENT_KEY,
  newRecipients,
  newTotalIncentiveCost,
  newCostPerOrder,
  previousTotalCost,
  type SegmentDef,
} from "@/lib/scenario";
import { fmtNumber, fmtZl, fmtZlPerOrder } from "@/lib/format";
import { APP_ACTIVE_PUSH, ABANDONED_CART_EMAIL, PRICE_SENSITIVE_VARIANTS } from "@/lib/creatives";
import { PushPreview, EmailPreview, SmsPreview } from "@/components/ui/MessagePreview";
import { goForward } from "@/lib/nav";

const CHANNEL_LABEL: Record<SegmentDef["channel"], string> = {
  push: "Push (apka)",
  email: "Twoje narzędzie do e-maili",
  sms: "Twoja bramka SMS",
};

function SegmentCreative({ segment }: { segment: SegmentDef }) {
  if (segment.key === "appActive") return <PushPreview {...APP_ACTIVE_PUSH} />;
  if (segment.key === "abandonedCart") return <EmailPreview {...ABANDONED_CART_EMAIL} />;
  return (
    <div className="grid grid-cols-2 gap-3 w-full">
      {PRICE_SENSITIVE_VARIANTS.map((v) => (
        <div key={v.id} className="text-center">
          <div className="text-[10px] uppercase tracking-wider text-[var(--muted)] mb-1">{v.label}</div>
          <SmsPreview body={v.body} />
        </div>
      ))}
    </div>
  );
}

function SegmentCard({ segment }: { segment: SegmentDef }) {
  const [feedback, setFeedback] = useState(false);
  const isLargest = segment.key === LARGEST_SEGMENT_KEY;

  return (
    <div className="bg-[var(--panel)] border border-[var(--border)] rounded-xl p-5 flex flex-col gap-3">
      <div>
        <div className="flex items-center justify-between mb-1">
          <div className="font-semibold">{segment.label}</div>
          <div className="text-xs text-[var(--muted)]">{fmtNumber(segment.recipients)} osób</div>
        </div>
        <p className="text-xs text-[var(--muted)] leading-relaxed">{segment.description}</p>
      </div>

      <div className="text-xs space-y-1.5">
        <div>
          <span className="text-[var(--muted)]">Zachęta: </span>
          <span className="font-medium">{segment.incentiveLabel}</span>
          <div className="text-[var(--muted)]">{segment.incentiveReason}</div>
        </div>
        <div>
          <span className="text-[var(--muted)]">Kanał: </span>
          <span className="font-medium">{CHANNEL_LABEL[segment.channel]}</span>
          <div className="text-[var(--muted)]">{segment.channelReason}</div>
        </div>
      </div>

      <div className="bg-[var(--panel-2)] border border-[var(--border)] rounded-lg p-3 flex items-center justify-center min-h-[140px]">
        <SegmentCreative segment={segment} />
      </div>
      {isLargest && (
        <div className="text-[11px] text-[var(--accent)] text-center -mt-1">
          Największa grupa — testuję 2 warianty naraz
        </div>
      )}

      <button
        onClick={() => setFeedback(true)}
        className="text-xs text-[var(--muted)] hover:text-[var(--text)] underline underline-offset-2 self-start"
      >
        Poproś o poprawkę
      </button>
      {feedback && (
        <div className="text-xs bg-[var(--panel-2)] border border-[var(--border)] rounded-md px-3 py-2 text-[var(--muted)]">
          Zostawiam tak jak jest — ten dobór najlepiej wychodzi z danych tej grupy.
        </div>
      )}
    </div>
  );
}

export default function CampaignPlan() {
  const forecastCost = newTotalIncentiveCost();

  return (
    <div className="p-8 space-y-6">
      <div>
        <div className="text-xs uppercase tracking-wider text-[var(--muted)] mb-1">Krok 2 · Plan kampanii</div>
        <h2 className="text-2xl font-semibold">3 grupy, zamiast jednego rabatu dla wszystkich</h2>
        <p className="text-sm text-[var(--muted)] mt-2 max-w-2xl">
          {fmtNumber(newRecipients())} odbiorców. Każda grupa ma inną przyczynę braku powrotu — więc inną zachętę i
          inny kanał.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {NEW_SEGMENTS.map((s) => (
          <SegmentCard key={s.key} segment={s} />
        ))}
      </div>

      <div className="bg-[var(--panel)] border border-[var(--border)] rounded-xl p-5 flex items-center justify-between gap-6">
        <div className="text-sm text-[var(--muted)]">
          Szacowany koszt zachęt: <span className="font-medium text-[var(--text)]">{fmtZl(forecastCost)}</span>{" "}
          (~{fmtZlPerOrder(newCostPerOrder())} / zamówienie) przy podobnej liczbie zamówień co poprzednio — zamiast{" "}
          {fmtZl(previousTotalCost())}.
        </div>
        <button
          onClick={() => goForward()}
          className="shrink-0 px-5 py-2.5 rounded-lg bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90"
        >
          Zatwierdź i wyślij
        </button>
      </div>
    </div>
  );
}
