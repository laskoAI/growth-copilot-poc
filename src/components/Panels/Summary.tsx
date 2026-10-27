"use client";
import {
  PREVIOUS_CAMPAIGN,
  newRecipients,
  newOrders,
  previousRevenue,
  newRevenue,
  previousTotalCost,
  newTotalIncentiveCost,
  previousDiscountCostPerOrder,
  newCostPerOrder,
  previousConversionRate,
  newConversionRate,
  previousRoi,
  newRoi,
  previousNetResult,
  newNetResult,
  diffOrders,
  diffRevenue,
  diffCost,
  diffCostPct,
  diffNetResult,
} from "@/lib/scenario";
import { fmtNumber, fmtZl, fmtZlPerOrder, fmtPct, fmtRoi, fmtSigned } from "@/lib/format";

type Row = { label: string; prev: string; next: string; diff: string; emphasis?: boolean };

export default function Summary() {
  const rows: Row[] = [
    { label: "Odbiorcy", prev: fmtNumber(PREVIOUS_CAMPAIGN.recipients), next: fmtNumber(newRecipients()), diff: fmtSigned(newRecipients() - PREVIOUS_CAMPAIGN.recipients, fmtNumber) },
    { label: "Zamówienia", prev: fmtNumber(PREVIOUS_CAMPAIGN.orders), next: fmtNumber(newOrders()), diff: fmtSigned(diffOrders(), fmtNumber) },
    { label: "Odsetek kupujących", prev: fmtPct(previousConversionRate()), next: fmtPct(newConversionRate()), diff: fmtSigned(newConversionRate() - previousConversionRate(), (v) => fmtPct(v)) },
    { label: "Przychód", prev: fmtZl(previousRevenue()), next: fmtZl(newRevenue()), diff: fmtSigned(diffRevenue(), fmtZl) },
    { label: "Koszt promocji", prev: fmtZl(previousTotalCost()), next: fmtZl(newTotalIncentiveCost()), diff: fmtSigned(diffCost(), fmtZl) },
    { label: "Koszt promocji / zamówienie", prev: fmtZlPerOrder(previousDiscountCostPerOrder()), next: fmtZlPerOrder(newCostPerOrder()), diff: fmtSigned(newCostPerOrder() - previousDiscountCostPerOrder(), fmtZlPerOrder) },
    { label: "ROI promocji (zł przychodu / 1 zł rabatu)", prev: fmtRoi(previousRoi()), next: fmtRoi(newRoi()), diff: fmtSigned(newRoi() - previousRoi(), fmtRoi) },
    { label: "Wynik (przychód − koszt promocji)", prev: fmtZl(previousNetResult()), next: fmtZl(newNetResult()), diff: fmtSigned(diffNetResult(), fmtZl), emphasis: true },
  ];

  return (
    <div className="p-8 space-y-6">
      <div>
        <div className="text-xs uppercase tracking-wider text-[var(--muted)] mb-1">Krok 4 · Podsumowanie</div>
        <h2 className="text-2xl font-semibold">
          {fmtSigned(diffOrders(), fmtNumber)} zamówień, a promocja kosztowała {fmtZl(Math.abs(diffCost()))} mniej
        </h2>
        <p className="text-sm text-[var(--muted)] mt-2">
          {fmtSigned(diffOrders(), fmtNumber)} zamówień więcej, {fmtSigned(diffRevenue(), fmtZl)} przychodu, a promocja
          kosztowała {fmtSigned(diffCost(), fmtZl)} ({fmtSigned(diffCostPct(), (v) => fmtPct(v, 0))}).
        </p>
      </div>

      <div className="bg-[var(--panel)] border border-[var(--border)] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[var(--panel-2)] text-left text-xs text-[var(--muted)]">
              <th className="px-4 py-2.5 font-normal">Wskaźnik</th>
              <th className="px-4 py-2.5 font-normal">Poprzednia</th>
              <th className="px-4 py-2.5 font-normal">Nowa</th>
              <th className="px-4 py-2.5 font-normal">Różnica</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.label}
                className={`border-t border-[var(--border)] ${r.emphasis ? "bg-[var(--panel-2)]" : ""}`}
              >
                <td className={`px-4 py-2.5 ${r.emphasis ? "font-medium" : ""}`}>{r.label}</td>
                <td className="px-4 py-2.5 text-[var(--muted)]">{r.prev}</td>
                <td className={`px-4 py-2.5 font-medium ${r.emphasis ? "text-lg" : ""}`}>{r.next}</td>
                <td className="px-4 py-2.5 text-[var(--accent)] font-medium">{r.diff}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
