// Jedyne źródło prawdy dla liczb w demo. Każdy panel czyta wyłącznie stąd
// (i z format.ts do zaokrągleń) — nigdy nie wpisuje liczby na sztywno.
// Zaokrąglanie dzieje się wyłącznie w format.ts, na granicy wyświetlania.

export const COMPANY = {
  name: "Nuvera",
  description: "kosmetyki i suplementy, wyłącznie online: sklep internetowy i aplikacja mobilna",
  totalCustomers: 80000,
  marketingTeamSize: 2,
} as const;

export const GOAL_PROMPT = "Chcę, żeby klienci częściej u nas zamawiali.";

export const AVERAGE_BASKET = 150;

// ---------------------------------------------------------------------------
// Dopasowanie klientów między 4 źródłami (Krok 1)
// ---------------------------------------------------------------------------
export const MATCH_RATE = 0.87;
export const ONE_TIME_BUYERS_90D = 12300; // kupili raz w ostatnich 90 dniach i nie wrócili

// ---------------------------------------------------------------------------
// Poprzednia kampania: 20% rabatu dla wszystkich, e-mail
// ---------------------------------------------------------------------------
export const PREVIOUS_CAMPAIGN = {
  recipients: 11000,
  discountPct: 0.20,
  channel: "email" as const,
  orders: 825,
};

export const previousDiscountCostPerOrder = () => AVERAGE_BASKET * PREVIOUS_CAMPAIGN.discountPct; // 30 zł
export const previousRevenue = () => PREVIOUS_CAMPAIGN.orders * AVERAGE_BASKET; // 123 750 zł
export const previousTotalCost = () => PREVIOUS_CAMPAIGN.orders * previousDiscountCostPerOrder(); // 24 750 zł
export const previousConversionRate = () => PREVIOUS_CAMPAIGN.orders / PREVIOUS_CAMPAIGN.recipients; // 7.5%
export const previousRoi = () => previousRevenue() / previousTotalCost(); // 5.0

// ---------------------------------------------------------------------------
// Wykluczenie: otwarta reklamacja w Zendesku
// ---------------------------------------------------------------------------
export const EXCLUDED_OPEN_COMPLAINTS = 300;

// ---------------------------------------------------------------------------
// Nowa kampania: 3 segmenty z dopasowaną zachętą i kanałem
// ---------------------------------------------------------------------------
export type Channel = "push" | "email" | "sms";

export type SegmentDef = {
  key: "appActive" | "abandonedCart" | "priceSensitive";
  label: string;
  description: string;
  channel: Channel;
  channelReason: string;
  recipients: number;
  incentiveLabel: string;
  incentiveReason: string;
  incentiveCostPerOrder: number; // zł, koszt zachęty na jedno zamówienie
  orders: number;
  // Poglądowe wskaźniki zaangażowania do "Szczegółów" w Kroku 3 — nie wchodzą
  // do żadnych wyliczeń finansowych (te liczą się wyłącznie z recipients/orders/koszt powyżej).
  openRate: number;
  clickRate: number;
};

export const NEW_SEGMENTS: readonly SegmentDef[] = [
  {
    key: "appActive",
    label: "Aktywni w aplikacji",
    description: "Otwierają aplikację co tydzień, oglądają produkty, ale nie złożyli drugiego zamówienia.",
    channel: "push",
    channelReason: "Otwiera aplikację co tydzień, więc push.",
    recipients: 4000,
    incentiveLabel: "Darmowa dostawa",
    incentiveReason: "I tak wracają — potrzebują tylko impulsu, nie rabatu.",
    incentiveCostPerOrder: 12,
    orders: 360,
    openRate: 0.41,
    clickRate: 0.14,
  },
  {
    key: "abandonedCart",
    label: "Porzucili koszyk",
    description: "Dodali produkty do koszyka w ostatnich 90 dniach, ale nie dokończyli zakupu.",
    channel: "email",
    channelReason: "Nie ma aplikacji, ale czyta e-maile, więc e-mail.",
    recipients: 3500,
    incentiveLabel: "Rabat 10% na produkty z koszyka",
    incentiveReason: "Koszyk już wybrany — mały rabat wystarczy, żeby domknąć.",
    incentiveCostPerOrder: 15,
    orders: 280,
    openRate: 0.29,
    clickRate: 0.07,
  },
  {
    key: "priceSensitive",
    label: "Wrażliwi na cenę",
    description: "Kupili wcześniej wyłącznie z kodem rabatowym — bez promocji nie wracają.",
    channel: "sms",
    channelReason: "Nie otwiera e-maili, więc SMS.",
    recipients: 4500,
    incentiveLabel: "Rabat 15%",
    incentiveReason: "Kupują tylko w promocji — to grupa, która najbardziej potrzebuje zachęty.",
    incentiveCostPerOrder: 22.5,
    orders: 315,
    openRate: 0.93,
    clickRate: 0.19,
  },
] as const;

// Segment z największą liczbą odbiorców — tu pokazujemy test A/B dwóch wariantów SMS-a.
export const LARGEST_SEGMENT_KEY: SegmentDef["key"] = "priceSensitive";
export const largestSegment = (): SegmentDef =>
  NEW_SEGMENTS.find((s) => s.key === LARGEST_SEGMENT_KEY)!;

// Test A/B startuje na tej części największego segmentu, zanim wygrany wariant
// idzie do reszty — pokazywane na żywo w Kroku 3.
export const AB_TEST_SAMPLE_SHARE = 0.3;
export const abTestSampleSize = () => Math.round(largestSegment().recipients * AB_TEST_SAMPLE_SHARE);
export const abTestRemainderSize = () => largestSegment().recipients - abTestSampleSize();

// Pierwsze wyniki testu na próbce (przed wysyłką do reszty). Zamówienia są tu
// celowo małe i bliskie siebie — to pokazuje, dlaczego trudno je jeszcze
// porównać (brak pełnej atrybucji), a decyzję opiera się na górze lejka.
export type AbTestResult = { openRate: number; clickRate: number; orders: number };
export const AB_TEST_RESULTS: Record<"a" | "b", AbTestResult> = {
  a: { openRate: 0.81, clickRate: 0.11, orders: 3 },
  b: { openRate: 0.93, clickRate: 0.19, orders: 4 },
};

export const newRecipients = () => NEW_SEGMENTS.reduce((s, g) => s + g.recipients, 0); // 12 000
export const newOrders = () => NEW_SEGMENTS.reduce((s, g) => s + g.orders, 0); // 955
export const newRevenue = () => newOrders() * AVERAGE_BASKET; // 143 250 zł
export const newTotalIncentiveCost = () =>
  NEW_SEGMENTS.reduce((s, g) => s + g.orders * g.incentiveCostPerOrder, 0); // 15 607,5 zł
export const newConversionRate = () => newOrders() / newRecipients(); // 8.0%
export const newCostPerOrder = () => newTotalIncentiveCost() / newOrders(); // ~16,30 zł
export const newRoi = () => newRevenue() / newTotalIncentiveCost(); // ~9.2

export const diffOrders = () => newOrders() - PREVIOUS_CAMPAIGN.orders; // +130
export const diffRevenue = () => newRevenue() - previousRevenue(); // +19 500 zł
export const diffCost = () => newTotalIncentiveCost() - previousTotalCost(); // -9 142,5 zł
export const diffCostPct = () => diffCost() / previousTotalCost(); // -36,9%

// Wynik netto: przychód minus koszt promocji — jedna liczba do porównania "na dole".
export const previousNetResult = () => previousRevenue() - previousTotalCost();
export const newNetResult = () => newRevenue() - newTotalIncentiveCost();
export const diffNetResult = () => newNetResult() - previousNetResult();

if (process.env.NODE_ENV !== "production") {
  const matched = ONE_TIME_BUYERS_90D - EXCLUDED_OPEN_COMPLAINTS;
  console.assert(
    newRecipients() === matched,
    `scenario.ts: suma odbiorców segmentów (${newRecipients()}) powinna równać się ${matched}`
  );
}

export const ATTRIBUTION_WAIT_DAYS = 14;
