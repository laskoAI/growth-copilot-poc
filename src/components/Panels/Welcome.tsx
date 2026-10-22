"use client";
import { useStore } from "@/lib/store";
import Logo from "@/components/Logo";

export default function Welcome() {
  const { setFlow } = useStore();
  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-10">
      <Logo size={64} className="mb-6" />
      <h1 className="text-3xl font-semibold tracking-tight mb-3">
        Growth Marketer AI
      </h1>
      <p className="text-[var(--muted)] max-w-xl mb-10">
        Powiedz, co chcesz osiągnąć. Growth Marketer AI zrobi resztę za Ciebie: dobierze bazę, komunikaty i kanały, a potem wróci z wynikami.
      </p>

      <div className="grid grid-cols-2 gap-4 w-full max-w-3xl">
        <button
          onClick={() => setFlow("C")}
          className="col-span-2 text-left bg-[var(--panel)] border-2 border-[#002f34] hover:shadow-lg rounded-xl p-6 transition"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-[#002f34] text-[#23e5db]">OLX</span>
            <span className="text-[10px] uppercase tracking-wider text-[var(--muted)]">E-commerce</span>
          </div>
          <div className="text-lg font-semibold mb-2">Więcej zakupów z Przesyłką OLX</div>
          <p className="text-sm text-[var(--muted)] leading-relaxed">
            Mówisz, że chcesz więcej zakupów z Przesyłką. Growth Marketer AI wybierze kategorie i grupy, napisze komunikaty, przetestuje je i każdemu wyśle tam, gdzie najchętniej reaguje: mailem, pushem albo w Tinkerbell.
          </p>
        </button>
        <button
          onClick={() => setFlow("A")}
          className="text-left bg-[var(--panel)] border border-[var(--border)] hover:border-[var(--accent)] rounded-xl p-6 transition"
        >
          <div className="text-[10px] uppercase tracking-wider text-[var(--muted)] mb-2">Masz już bazę</div>
          <div className="text-lg font-semibold mb-2">Wyślij do konkretnego segmentu</div>
          <p className="text-sm text-[var(--muted)] leading-relaxed">
            Opisujesz, do kogo chcesz dotrzeć. Growth Marketer AI wyciągnie segment z HubSpota, napisze kreacje, dobierze kanał i wyśle.
          </p>
        </button>

        <button
          onClick={() => setFlow("B")}
          className="text-left bg-[var(--panel)] border border-[var(--border)] hover:border-[var(--accent-2)] rounded-xl p-6 transition"
        >
          <div className="text-[10px] uppercase tracking-wider text-[var(--muted)] mb-2">Masz tylko cel</div>
          <div className="text-lg font-semibold mb-2">Więcej dem dla sprzedaży</div>
          <p className="text-sm text-[var(--muted)] leading-relaxed">
            Mówisz, co sprzedajesz. Growth Marketer AI znajdzie przychodnie w rejestrze i w Twojej bazie, rozpisze 2-tygodniową
            ścieżkę mail → SMS → WhatsApp i powie handlowcom, do kogo dzwonić.
          </p>
        </button>
      </div>

      <div className="mt-8 text-xs text-[var(--muted)]">
        Wybierz scenariusz i zacznij rozmowę po lewej.
      </div>
    </div>
  );
}
