"use client";
import Logo from "@/components/Logo";
import { COMPANY } from "@/lib/scenario";
import { fmtNumber } from "@/lib/format";

export default function Welcome() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-10">
      <Logo size={64} className="mb-6" />
      <h1 className="text-3xl font-semibold tracking-tight mb-3">{COMPANY.name}</h1>
      <p className="text-[var(--muted)] max-w-lg mb-6 leading-relaxed">
        {COMPANY.description}. {fmtNumber(COMPANY.totalCustomers)} klientów, {COMPANY.marketingTeamSize}-osobowy
        zespół marketingu.
      </p>
      <div className="bg-[var(--panel)] border border-[var(--border)] rounded-xl p-5 max-w-md text-left">
        <div className="text-[10px] uppercase tracking-wider text-[var(--muted)] mb-2">
          Growth Copilot działa nad Twoimi narzędziami, nie zamiast nich
        </div>
        <p className="text-sm text-[var(--muted)] leading-relaxed">
          Podaj cel, a agent połączy dane z kilku systemów, wybierze segmenty, napisze komunikaty, dobierze kanał,
          wyśle przez istniejące narzędzia i rozliczy wynik w złotówkach.
        </p>
      </div>
      <div className="mt-8 text-xs text-[var(--muted)]">Kliknij sugestię w czacie po lewej, żeby zacząć.</div>
    </div>
  );
}
