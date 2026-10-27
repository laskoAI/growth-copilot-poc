"use client";
import {
  PREVIOUS_CAMPAIGN,
  EXCLUDED_OPEN_COMPLAINTS,
  previousTotalCost,
  previousRevenue,
  previousDiscountCostPerOrder,
} from "@/lib/scenario";
import { fmtNumber, fmtZl, fmtPct, fmtZlPerOrder } from "@/lib/format";
import Details from "@/components/ui/Details";

export default function PreviousCampaignDiagnosis() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <div className="text-xs uppercase tracking-wider text-[var(--muted)] mb-1">Krok 1 · Poprzednia kampania</div>
        <h2 className="text-2xl font-semibold">Rabat dla wszystkich kosztował więcej, niż trzeba</h2>
        <p className="text-sm text-[var(--muted)] mt-2 max-w-2xl">
          {fmtPct(PREVIOUS_CAMPAIGN.discountPct, 0)} rabatu do {fmtNumber(PREVIOUS_CAMPAIGN.recipients)} odbiorców,{" "}
          {PREVIOUS_CAMPAIGN.channel === "email" ? "e-mailem" : PREVIOUS_CAMPAIGN.channel}.
        </p>
      </div>

      <div className="bg-[var(--panel)] border border-[var(--border)] rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider text-[var(--muted)] mb-1">Koszt rabatów</div>
            <div className="text-4xl font-semibold text-[#dc2626]">{fmtZl(previousTotalCost())}</div>
            <div className="text-xs text-[var(--muted)] mt-1">{fmtZlPerOrder(previousDiscountCostPerOrder())} na każde zamówienie</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-[var(--muted)]">Przychód</div>
            <div className="text-2xl font-semibold">{fmtZl(previousRevenue())}</div>
            <div className="text-xs text-[var(--muted)] mt-1">{fmtNumber(PREVIOUS_CAMPAIGN.orders)} zamówień</div>
          </div>
        </div>
      </div>

      <div className="bg-[#fff7ed] border border-[#fed7aa] rounded-xl p-5">
        <div className="text-sm font-medium text-[#9a3412] mb-1">
          Narzędzie do wysyłek widzi tylko część obrazu
        </div>
        <p className="text-sm text-[#9a3412]/90 leading-relaxed">
          Nie wie, co klient robi w aplikacji, ani że ma otwartą reklamację. Wykluczam{" "}
          <span className="font-medium">{fmtNumber(EXCLUDED_OPEN_COMPLAINTS)} klientów</span> z otwartym zgłoszeniem w
          Zendesku, zanim wyślę cokolwiek nowego.
        </p>
      </div>

      <Details title="Szczegóły poprzedniej kampanii">
        <ul className="space-y-1.5">
          <li>• Odbiorcy: {fmtNumber(PREVIOUS_CAMPAIGN.recipients)}</li>
          <li>• Zamówienia: {fmtNumber(PREVIOUS_CAMPAIGN.orders)}</li>
          <li>• Przychód: {fmtZl(previousRevenue())}</li>
          <li>• Koszt rabatów: {fmtZl(previousTotalCost())}</li>
          <li>• Część klientów kupiłaby bez rabatu albo za mniejszy — stąd dopasowana zachęta zamiast jednej dla wszystkich.</li>
        </ul>
      </Details>
    </div>
  );
}
