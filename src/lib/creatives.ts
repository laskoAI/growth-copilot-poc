// Treści kreacji per segment. Czysto prezentacyjne — nie wchodzą do wyliczeń
// (patrz scenario.ts). Bez zdjęć z sieci: podglądy budujemy w CSS.
import { COMPANY } from "./scenario";

export type EmailCreative = { subject: string; preheader: string; body: string; cta: string };
export type PushCreative = { title: string; body: string };
export type SmsVariant = { id: "a" | "b"; label: string; body: string };

export const APP_ACTIVE_PUSH: PushCreative = {
  title: "Twoja paczka czeka na mały impuls",
  body: `${COMPANY.name}: zamów dziś, dostawa gratis — bez kodu, nalicza się automatycznie w koszyku.`,
};

export const ABANDONED_CART_EMAIL: EmailCreative = {
  subject: "Zostawiłaś/eś coś w koszyku",
  preheader: "10% rabatu na produkty, które oglądałaś/eś",
  body:
    "Cześć,\n\nTwoje produkty wciąż czekają w koszyku. Dokończ zamówienie z rabatem 10% — kod ważny 48 godzin.",
  cta: "Wróć do koszyka",
};

export const PRICE_SENSITIVE_VARIANTS: readonly SmsVariant[] = [
  {
    id: "a",
    label: "Wariant A · rabat w nagłówku",
    body: `${COMPANY.name}: wraca 15% rabatu na Twoje ulubione kosmetyki i suplementy. Kod: WRACAJ15. nuvera.pl/wracaj15`,
  },
  {
    id: "b",
    label: "Wariant B · presja czasu",
    body: `${COMPANY.name}: Twój rabat 15% wygasa za 3 dni. Odbierz, zanim zniknie: nuvera.pl/wracaj15`,
  },
] as const;

// Zwycięski wariant testu na żywo w Kroku 3 — jedno miejsce prawdy, żeby chat
// (demoScript.ts) i panel (SendResults.tsx) zawsze zgadzały się, który wygrał.
export const PRICE_SENSITIVE_WINNER: "a" | "b" = "b";
