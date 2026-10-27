import type { PanelId, StageId, ChatMessage } from "./store";
import {
  COMPANY,
  GOAL_PROMPT,
  MATCH_RATE,
  ONE_TIME_BUYERS_90D,
  EXCLUDED_OPEN_COMPLAINTS,
  PREVIOUS_CAMPAIGN,
  previousTotalCost,
  previousDiscountCostPerOrder,
  previousRevenue,
  newRecipients,
  ATTRIBUTION_WAIT_DAYS,
  AB_TEST_SAMPLE_SHARE,
  abTestSampleSize,
  abTestRemainderSize,
  AB_TEST_RESULTS,
} from "./scenario";
import { fmtNumber, fmtZl, fmtPct } from "./format";
import { PRICE_SENSITIVE_WINNER } from "./creatives";

const winnerName = PRICE_SENSITIVE_WINNER === "b" ? "B" : "A";

// Skrypt jest w pełni liniowy — żadnych rozgałęzień. Każdy krok to jedna
// sugestia użytkownika i jedna odpowiedź agenta; pytania doprecyzowujące
// w Kroku 1 też mają tylko jedną, oczywistą odpowiedź (to demo pokazuje,
// że agent dopytuje, a nie prawdziwy wybór ścieżki).
export type Step = {
  id: string;
  stage: StageId;
  panel: PanelId;
  aiTypingMs?: number;
  quickReply: string;
  aiMessage: string;
};

export const script: Step[] = [
  // ---------------------------------------------------------------- Krok 1
  {
    id: "s1_goal",
    stage: 1,
    panel: "dataSources",
    quickReply: GOAL_PROMPT,
    aiTypingMs: 1000,
    aiMessage:
      `Jasne. Żeby to zrobić dobrze, muszę zobaczyć więcej niż widzi samo narzędzie do wysyłek. Podłączam 4 źródła: eksport zamówień ze sklepu, GetResponse, zdarzenia z aplikacji (BigQuery) i zgłoszenia z Zendeska.\n\nDane są, jak to zwykle bywa, w nieładzie — zobacz próbki po prawej.`,
  },
  {
    id: "s2_mapping",
    stage: 1,
    panel: "dataSources",
    quickReply: "Co z tego wychodzi?",
    aiTypingMs: 1400,
    aiMessage:
      `Każde źródło nazywa tego samego klienta inaczej, a część kolumn nie ma opisu — np. "status_k" w GetResponse czy "seg2" w zdarzeniach z aplikacji. Dopasowałem rekordy po e-mailu, telefonie i identyfikatorze urządzenia: ${fmtPct(
        MATCH_RATE,
        0
      )} rekordów połączyłem w jednego klienta (np. w Zendesku ten sam klient figuruje pod numerem telefonu bez prefiksu, a w sklepie pod e-mailem).\n\nZanim pójdę dalej — status_k = 3 w GetResponse: czy to oznacza klienta nieaktywnego?`,
  },
  {
    id: "s3_confirm_status",
    stage: 1,
    panel: "dataSources",
    quickReply: "Tak, nieaktywny",
    aiTypingMs: 900,
    aiMessage:
      "Dobrze, czyli status_k = 3 to klienci nieaktywni — tak jak zakładałem przy łączeniu danych.\n\nJeszcze jedno: kod WROC20 w zamówieniach to kampania \"20% dla wszystkich\" z 15 września, zgadza się?",
  },
  {
    id: "s4_confirm_wroc",
    stage: 1,
    panel: "potentialSegment",
    quickReply: "Tak, to ta kampania",
    aiTypingMs: 1200,
    aiMessage:
      `Potwierdzone.\n\nWracając do celu: chcesz, żeby klienci częściej u Was zamawiali. Najbliżej tego są ludzie, którzy kupili już raz, ale nie wrócili — znają markę i mieli pierwsze dobre doświadczenie, więc potrzebują tylko impulsu do drugiego zamówienia. Łącząc wszystkie źródła: to ${fmtNumber(
        ONE_TIME_BUYERS_90D
      )} klientów w ostatnich 90 dniach.`,
  },
  {
    id: "s5_diagnosis",
    stage: 1,
    panel: "previousCampaignDiagnosis",
    quickReply: "Czy coś już do nich wysyłaliśmy?",
    aiTypingMs: 1500,
    aiMessage:
      `Tak. Ostatnio wysłałeś tej grupie ${fmtPct(
        PREVIOUS_CAMPAIGN.discountPct,
        0
      )} rabatu dla wszystkich, e-mailem. Wróciło ${fmtNumber(
        PREVIOUS_CAMPAIGN.orders
      )} osób, przychód ${fmtZl(previousRevenue())}, a same rabaty kosztowały Cię ${fmtZl(
        previousTotalCost()
      )} — to ${fmtZl(previousDiscountCostPerOrder())} na każde zamówienie. Część z tych klientów kupiłaby bez rabatu albo za mniejszy.\n\nSamo GetResponse nie widziało, że ${fmtNumber(
        EXCLUDED_OPEN_COMPLAINTS
      )} z tych klientów ma teraz otwartą reklamację w Zendesku — wykluczam ich, zanim napiszę do kogokolwiek. Spróbuję zrobić to taniej.`,
  },

  // ---------------------------------------------------------------- Krok 2
  {
    id: "s6_plan",
    stage: 2,
    panel: "campaignPlan",
    quickReply: "Dobra, co proponujesz zamiast rabatu dla wszystkich?",
    aiTypingMs: 1500,
    aiMessage:
      `Zamiast jednego rabatu dla wszystkich — ${fmtNumber(
        newRecipients()
      )} odbiorców w 3 dopasowanych grupach, każda z inną zachętą i innym kanałem. W największej grupie testuję 2 wersje SMS-a naraz. Zobacz plan po prawej i zatwierdź wysyłkę.`,
  },
  {
    id: "s7_launch_test",
    stage: 3,
    panel: "sendResults",
    quickReply: "Zatwierdzam. Wyślij.",
    aiTypingMs: 1200,
    aiMessage:
      `Zaczynam. „Aktywni w aplikacji” i „porzucili koszyk” idą od razu w całości. W największej grupie — wrażliwi na cenę — wysyłam najpierw oba warianty SMS-a do ${fmtPct(
        AB_TEST_SAMPLE_SHARE,
        0
      )} kontaktów (${fmtNumber(abTestSampleSize())} osób), żeby zobaczyć, który działa lepiej, zanim wyślę do reszty.`,
  },
  {
    id: "s7b_results",
    stage: 3,
    panel: "sendResults",
    quickReply: "Co pokazuje test?",
    aiTypingMs: 1300,
    aiMessage:
      `Otwarcia: ${fmtPct(AB_TEST_RESULTS.a.openRate, 0)} (A) vs ${fmtPct(
        AB_TEST_RESULTS.b.openRate,
        0
      )} (B). Kliknięcia: ${fmtPct(AB_TEST_RESULTS.a.clickRate, 0)} vs ${fmtPct(
        AB_TEST_RESULTS.b.clickRate,
        0
      )}. Zamówienia jeszcze trudno porównać — ${AB_TEST_RESULTS.a.orders} vs ${
        AB_TEST_RESULTS.b.orders
      }, za mało danych i brak pełnej atrybucji. Ale po górze lejka już widać, że wygrywa wariant ${winnerName}. Wysłać go do reszty?`,
  },
  {
    id: "s7c_send_rest",
    stage: 3,
    panel: "sendResults",
    quickReply: "Tak, wyślij do reszty.",
    aiTypingMs: 1200,
    aiMessage:
      `Wysłane — pozostałe ${fmtNumber(
        abTestRemainderSize()
      )} osób w tej grupie dostaje wariant ${winnerName}. Wszystko poszło przez Twoje istniejące narzędzia (e-mail, apka, bramka SMS). Wracam za ${ATTRIBUTION_WAIT_DAYS} dni z porównaniem wyników — tyle potrzeba, żeby zamówienia poprawnie zaatrybuowały się w Twoich systemach.`,
  },

  // ---------------------------------------------------------------- Krok 4
  {
    id: "s8_summary",
    stage: 4,
    panel: "summary",
    quickReply: `Minęło ${ATTRIBUTION_WAIT_DAYS} dni. Pokaż wyniki.`,
    aiTypingMs: 1400,
    aiMessage: `${COMPANY.name} w liczbach: więcej zamówień, mniejszy koszt promocji. Pełne porównanie — po prawej.`,
  },
];

export function getPanelForStep(stepIndex: number): PanelId {
  if (stepIndex <= 0) return "welcome";
  const idx = Math.min(stepIndex, script.length) - 1;
  return script[idx].panel;
}

export function getStageForStep(stepIndex: number): StageId {
  if (stepIndex <= 0) return 0;
  const idx = Math.min(stepIndex, script.length) - 1;
  return script[idx].stage;
}

function uid(stepId: string, suffix: string) {
  return `${stepId}-${suffix}`;
}

// Czysta funkcja: widoczne wiadomości zależą wyłącznie od stepIndex. Nie ma
// tu żadnego stanu do "rozjechania" przy cofnij/dalej/restart.
export function getVisibleMessages(stepIndex: number): ChatMessage[] {
  const out: ChatMessage[] = [];
  const limit = Math.min(stepIndex, script.length);
  for (let i = 0; i < limit; i++) {
    const step = script[i];
    out.push(
      { id: uid(step.id, "u"), role: "user", text: step.quickReply },
      { id: uid(step.id, "a"), role: "ai", text: step.aiMessage }
    );
  }
  return out;
}

export function getCurrentStep(stepIndex: number): Step | undefined {
  return script[stepIndex];
}
