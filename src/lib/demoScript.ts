import type { PanelId, FlowId } from "./store";

export type PanelAction =
  | { type: "setPanel"; panel: PanelId }
  | { type: "applyFilter"; key: "knownDoctor" | "minSpecialists" | "bigCitiesOnly" | "invoicesPaid"; value: number | boolean }
  | { type: "selectCreative"; id: string }
  | { type: "setSplit"; email: number; sms: number; share: number }
  | { type: "launch" }
  | { type: "advanceWeek" }
  | { type: "acceptBase" };

export type Step = {
  id: string;
  quickReply: string;
  keywords?: string[];
  aiTypingMs?: number;
  aiMessage: string;
  actions?: PanelAction[];
  timeline?: { delayMs: number; action: PanelAction }[];
};

export const demoScriptA: Step[] = [
  {
    id: "s1_query",
    quickReply:
      "Wyciągnij z HubSpota listę placówek: znany lekarz, powyżej 10 specjalistów, duże miasta, opłacone faktury.",
    keywords: ["hubspot", "placówki", "lekarz", "specjalist", "miast", "faktur"],
    aiTypingMs: 900,
    aiMessage:
      "Jasne. Odpalam zapytanie do HubSpota i nakładam filtry na Twojej bazie ~25 000 placówek POZ. Zobacz panel po prawej — dodaję kryteria po kolei.",
    actions: [{ type: "setPanel", panel: "segment" }],
    timeline: [
      { delayMs: 700, action: { type: "applyFilter", key: "knownDoctor", value: true } },
      { delayMs: 1600, action: { type: "applyFilter", key: "minSpecialists", value: 10 } },
      { delayMs: 2500, action: { type: "applyFilter", key: "bigCitiesOnly", value: true } },
      { delayMs: 3400, action: { type: "applyFilter", key: "invoicesPaid", value: true } },
    ],
  },
  {
    id: "s2_brief",
    quickReply:
      "Mam produkt dla POZ, chcę do tych placówek wysłać komunikację i umówić spotkania sprzedażowe.",
    keywords: ["produkt", "poz", "komunikacj", "sprzeda", "spotkan"],
    aiTypingMs: 1000,
    aiMessage:
      "Świetnie. Żeby dobrze napisać kreację — co jest realną wartością dla placówki POZ i co już wcześniej próbowałeś? Zaproponuję kilka wersji dopasowanych do tego.",
  },
  {
    id: "s3_value",
    quickReply:
      "Oszczędność czasu lekarza, mniej no-show i lepsza obsługa NFZ + prywatnych. Wcześniej były zwykłe newslettery bez segmentacji.",
    keywords: ["czas", "no-show", "nfz", "newsletter", "warto"],
    aiTypingMs: 1200,
    aiMessage:
      "Dziękuję. Przygotowałem trzy kreacje pod różne kąty: ROI czasu lekarza, redukcja no-show i unifikacja NFZ + prywatni. Na każdej karcie zobaczysz podgląd treści dla e-maila, SMS i push — przełączaj kanały na karcie. Wybierz wariant, który najlepiej pasuje do CTA „umów demo”.",
    actions: [{ type: "setPanel", panel: "creatives" }],
  },
  {
    id: "s4_pick",
    quickReply: "Idziemy z pierwszą — ROI czasu lekarza. CTA: umów demo.",
    keywords: ["pierwsz", "roi", "czas", "umów", "cta"],
    aiTypingMs: 900,
    aiMessage:
      "Zapisane. Skupiam się już tylko na tej kreacji, a żeby wycisnąć maksimum, proponuję test A/B/C — trzy odmiany tego samego komunikatu z różnymi hipotezami (konkretna liczba, storytelling case study, pytanie w temacie). Split kanałów zostawiam 50/50 email vs SMS, w każdym kanale dzielę bazę na 3 równe podgrupy. Zobacz warianty i podglądy po prawej.",
    actions: [
      { type: "selectCreative", id: "c1" },
      { type: "setPanel", panel: "channel" },
      { type: "setSplit", email: 5000, sms: 5000, share: 0.5 },
    ],
  },
  {
    id: "s5_launch",
    quickReply: "OK, akceptuję split. Odpalaj kampanię.",
    keywords: ["odpal", "execute", "start", "launch", "akceptuj"],
    aiTypingMs: 800,
    aiMessage:
      "Uruchamiam kampanię. Konfiguracja raportowania włączona automatycznie — zobaczysz metryki na żywo.",
    actions: [
      { type: "setPanel", panel: "launch" },
      { type: "launch" },
    ],
    timeline: [
      { delayMs: 3500, action: { type: "setPanel", panel: "report" } },
    ],
  },
  {
    id: "s6_week",
    quickReply: "Przewiń o tydzień — co wyszło?",
    keywords: ["tydzie", "week", "wynik", "raport"],
    aiTypingMs: 1100,
    aiMessage:
      "Podsumowanie po 7 dniach: SMS wygrał zdecydowanie — CTR 4,8% vs 1,2% dla e-maila, 95 umówionych spotkań vs 16. Kanał został źle dobrany dla części bazy (~4 000 kontaktów). Rekomendacja: wygenerować listę 5 000 kontaktów z niskim engagementem cyfrowym do obdzwonienia przez zespół sprzedaży. Chcesz, żebym przygotował tę listę?",
    actions: [
      { type: "advanceWeek" },
      { type: "setPanel", panel: "weekLater" },
    ],
  },
  {
    id: "s7_calllist",
    quickReply: "Tak, przygotuj listę do call center — pokaż co dokładnie proponujesz.",
    keywords: ["tak", "call", "obdzwo", "lista", "przygotuj", "pokaż"],
    aiTypingMs: 1200,
    aiMessage:
      "Robi się. Jest taki temat — z tego testu wyszło, że 50 osób umówiło spotkanie, ale 1 100 kliknęło w maila i nie zrobiło żadnej akcji, a 10 000 nie kliknęło w ogóle. Do tych co się umówili odfiltrowuję. Do tych co weszli w maila wysyłam drugą kreację („redukcja no-show”) w SMS — moim zdaniem to dobry sygnał zakupowy, dodaję ich do HubSpota jako warm lead, żeby handlowcy mogli obdzwonić. Ale zatrzymaj się przy tej zimnej bazie 10 000 — nie posyłałbym tego całego na call center, bo Twoich 4 handlowców tego nie obsłuży, a i tak konwersja będzie słaba (nie kliknęli w mail = brak sygnału). Zanurkowałem w tę bazę: widzę wyraźne różnice po mieście i wielkości placówki. Duże miasta reagują inaczej niż małe, ~1 500 kontaktów w ogóle nie powinno tam być. Rozbiłem to na 5 podsegmentów, dla każdego inny kanał i inne copy. Kliknij „Pokaż 5 podsegmentów” po prawej — zobacz co proponuję.",
    actions: [{ type: "setPanel", panel: "segmentBreakdown" }],
  },
  {
    id: "s8_retarget",
    quickReply: "Zgadzam się. Odpal re-engagement dla 5 podsegmentów i wrzuć do HubSpota co trzeba.",
    keywords: ["zgadzam", "warm", "wrzuć", "hubspot", "call", "tak", "podsegm", "engagement"],
    aiTypingMs: 1200,
    aiMessage:
      "Zrobione. Rozpisuję: 1 100 klikaczy → HubSpot „POZ · warm lead” z historią engagementu, retarget SMS z drugą kreacją jutro 10:00. Zimna baza 10 000: (1) 2 100 dużych miast → push web + LinkedIn Ads z case wielkomiejskim, (2) 3 800 średnich miast → mail #2 z pytaniem w temacie + SMS fallback za 3 dni, (3) 2 600 małych miast → SMS + telefon (call center — 2 600 to obciążenie realne dla 4 handlowców), (4) 800 z niekompletnymi danymi → data enrichment przez Growth Marketer AI, (5) 700 wysokie ryzyko unsub → suppression 90 dni. Szacowana konwersja: +85 spotkań z klikaczy + ~140 z re-engagement zimnej bazy. Cała pętla zamknięta.",
  },
];

// ============================================================
// FLOW B — od potrzeby biznesowej
// ============================================================
export const demoScriptB: Step[] = [
  {
    id: "b1_goal",
    quickReply: "Chciałbym mieć jak najwięcej nowych dem dla zespołu sprzedażowego. Sprzedajemy produkt dla POZ.",
    keywords: ["dem", "sprzeda", "poz", "produkt", "handlow"],
    aiTypingMs: 1600,
    aiMessage:
      "Dobra, rozumiem. Szukamy przychodni POZ, które mogą chcieć Waszego produktu.\n\nZacząłem od rejestru RPWDL, bo tam jest pełna lista placówek w Polsce. Po wybraniu POZ wychodzi 6 000 placówek (unikalnych NIP-ów).\n\nPotem zestawiłem je po NIP z Waszą bazą wewnętrzną (płacący klienci z NIP-em zmatchowanym z RPWDL):\n• 4 700 POZ-ów już macie w bazie, to 8 300 kontaktów. Zgodę marketingową ma 7 100 z nich, a 1 200 nie ma.\n• 1 300 POZ-ów w ogóle nie ma w Waszej bazie, więc nie mamy do nich żadnej zgody.\n\nTu potrzebuję Twojej decyzji. Bez zgody marketingowej nie wyślę maila, SMS-a ani WhatsAppa. Wysyłamy tylko do 7 100 kontaktów ze zgodą? Pozostałych mogę odłożyć albo przekazać handlowcom.",
    actions: [{ type: "setPanel", panel: "pozBase" }],
  },
  {
    id: "b2_consent",
    quickReply: "Wysyłamy tylko do tych ze zgodą. Resztę na razie odkładamy.",
    keywords: ["zgod", "tylko", "wysyłamy", "odkład"],
    aiTypingMs: 1500,
    aiMessage:
      "Jasne, zostaje 7 100 kontaktów ze zgodą.\n\nNie wiemy, ilu specjalistów ma każda przychodnia, więc dzielę bazę po wielkości miasta. To najlepsze przybliżenie wielkości placówki i tego, kto u nich decyduje:\n\n• Duże miasta: 5 000 kontaktów. Większe placówki, decyduje dyrektor albo kierownik.\n• Małe miasta: 2 000 kontaktów. Często decyduje sam właściciel-lekarz.\n• Odrzuty: 100. Placówki zamknięte w RPWDL, błędne dane, duplikaty. Do nich nie piszemy.\n\nPotwierdzasz taki podział?",
    actions: [{ type: "acceptBase" }, { type: "setPanel", panel: "pozClusters" }],
  },
  {
    id: "b3_content",
    quickReply: "Potwierdzam. Co do nich wysyłamy?",
    keywords: ["potwierdzam", "wysył", "treść", "komunikat", "co"],
    aiTypingMs: 1500,
    aiMessage:
      "Do każdego klastra inny komunikat:\n\n• Duże miasta: „mniej czasu na rejestrację, więcej na pacjentów”. Tam jest dużo pacjentów, kolejki na telefonie i kilka osób w rejestracji, więc gramy oszczędnością czasu.\n• Małe miasta: „prosto i bez wdrożenia”. Właściciel sam wszystkiego pilnuje, liczy się prostota i wsparcie.\n\nPo prawej masz treści dla dużych miast: mail od handlowca, SMS i WhatsApp. Wszystko prowadzi do jednego celu, czyli umówienia 20-minutowego demo.",
    actions: [{ type: "setPanel", panel: "pozContent" }],
  },
  {
    id: "b4_path",
    quickReply: "Dobre. Jak to rozplanujesz na najbliższe 2 tygodnie?",
    keywords: ["plan", "tygodni", "ścieżk", "rozplanuj", "kiedy"],
    aiTypingMs: 1600,
    aiMessage:
      "Proponuję taką ścieżkę dla dużych miast:\n\n1. Dzień 1: mail do wszystkich.\n2. Dzień 2: jeśli ktoś nie otworzył maila w 24 h, idzie SMS.\n3. Dzień 4: jeśli nadal cisza, WhatsApp z przyciskami „wtorek / czwartek / nie teraz”.\n4. Dzień 8: mail przypominający z case study przychodni z tego samego miasta.\n5. Dzień 11: ostatni SMS, „czy mam się już nie odzywać?”.\n\nJeśli ktoś w trakcie da sygnał (otworzy maila 2+ razy, kliknie w link do demo albo odpisze), zatrzymuję automat i daję go handlowcowi do telefonu, razem z historią tego, co zrobił. Kto umówi demo albo kliknie „nie teraz”, wypada ze ścieżki. Maks. jedna wiadomość dziennie, tylko w godzinach pracy przychodni.\n\nOdpalamy?",
    actions: [{ type: "setPanel", panel: "pozPath" }],
  },
  {
    id: "b5_launch",
    quickReply: "Odpalaj.",
    keywords: ["odpal", "start", "uruchom", "jedziemy"],
    aiTypingMs: 900,
    aiMessage:
      "Poszło. Po prawej widać, jak ścieżka idzie dzień po dniu: kto dostał SMS, bo nie otworzył maila, kto trafił do handlowca i kto już umówił demo.",
    actions: [{ type: "setPanel", panel: "pozLive" }, { type: "launch" }],
  },
  {
    id: "b6_summary",
    quickReply: "Przewiń o 2 tygodnie. Jak poszło?",
    keywords: ["przewiń", "tygodn", "wynik", "poszło", "podsumow"],
    aiTypingMs: 1700,
    aiMessage:
      "Podsumowanie 2 tygodni dla dużych miast (5 000 kontaktów):\n\n• 85 umówiło demo: 31 z maila, 22 z SMS-a i 32 z WhatsAppa. WhatsApp okazał się najskuteczniejszy, mimo że był dopiero trzecim krokiem.\n• 640 weszło w interakcję, ale nie umówiło się: otworzyli maila kilka razy, kliknęli w link albo odpisali.\n• 4 100 nie zrobiło nic na żadnym z 5 kontaktów.\n• 175 to odbicia, wypisy i „nie teraz”.\n\nMoja rekomendacja:\n1. Tych 640 trzeba obdzwonić teraz. Są zainteresowani, a rozmowa z człowiekiem domknie to najszybciej. Najpierw 190 osób, które kliknęły link do demo.\n2. Do tych 4 100 spróbujmy innej treści i innej ścieżki: case study przychodni z ich miasta zamiast oszczędności czasu, i zacznijmy od WhatsAppa.",
    actions: [{ type: "advanceWeek" }, { type: "setPanel", panel: "pozSummary" }],
  },
  {
    id: "b7_next",
    quickReply: "Zgoda. Daj listę handlowcom i przygotuj nową ścieżkę dla reszty.",
    keywords: ["zgoda", "list", "handlow", "nową", "ścieżk"],
    aiTypingMs: 1400,
    aiMessage:
      "Zrobione.\n\n• 640 kontaktów jest w CRM jako zadania dla handlowców, posortowane od najgorętszych. Przy każdym widać, co ta osoba otworzyła, w co kliknęła i co odpisała, żeby handlowiec wiedział, od czego zacząć rozmowę.\n• Dla 4 100 osób bez reakcji przygotowałem nową ścieżkę: WhatsApp z case study na start, potem mail z pełnym case study, a na koniec SMS z zaproszeniem na 15-minutowe demo. Rusza w poniedziałek.\n• Równolegle startuje ścieżka dla małych miast (2 000 kontaktów) z komunikatem „prosto i bez wdrożenia”.\n\nZa 2 tygodnie wrócę z wynikami obu.",
    actions: [{ type: "setPanel", panel: "pozNext" }],
  },
];

// ============================================================
// FLOW C — OLX e-commerce · AI Decisioning
// ============================================================
export const demoScriptC: Step[] = [
  {
    id: "c1_goal",
    quickReply: "Chcemy, żeby więcej osób kupowało na OLX z Przesyłką.",
    keywords: ["olx", "przesyłk", "zakup", "kupow", "cel", "więcej"],
    aiTypingMs: 1500,
    aiMessage:
      "Jasne. Rzuciłem okiem na dane z ostatnich 3 miesięcy. Po prawej masz lejek nowych użytkowników: ok. 420 tys. rejestracji miesięcznie, 9% pisze do sprzedającego, a z Przesyłką kupuje tylko 3,2%. Najbardziej boli moment między wiadomością a zakupem, bo ludzie są już naprawdę blisko i odpadają.\n\nZanim zaproponuję, do kogo z tym iść: patrzymy tylko na nowych użytkowników, czy też na tych, którzy są z nami dłużej, ale zawsze kupują osobiście, bez Przesyłki?",
    actions: [{ type: "setPanel", panel: "olxDiagnosis" }],
  },
  {
    id: "c2_context",
    quickReply: "Bierzemy tylko nowych użytkowników. Powiedz mi, na jakich kategoriach się skupić.",
    keywords: ["nowych", "kategori", "skupić", "tylko", "powiedz"],
    aiTypingMs: 1700,
    aiMessage:
      "Ok, tylko nowi. Do 30 dni od rejestracji i bez zakupu z Przesyłką to ok. 610 tys. osób.\n\nPorównałem kategorie pod dwoma względami: ilu nowych ludzi tam szuka i jak daleko im do zakupu z Przesyłką. Skupiłbym się na trzech:\n\n• Elektronika, ok. 190 tys.: bardzo dużo ogląda i pisze, a z Przesyłką kupuje tylko 2,1%. Ludzie boją się, że dostaną zepsuty telefon. To największa luka.\n• Moda, ok. 140 tys.: małe, lekkie rzeczy, idealne do paczki, a mimo to większość umawia się na odbiór osobisty. Łatwo to zmienić.\n• Dla dzieci, ok. 70 tys.: rodzice kupują często i dużo, ale ostrożnie. Dobrze reagują na wszystko, co daje poczucie bezpieczeństwa.\n\nOdpuściłbym Motoryzację i Dom i ogród, bo tam sporo rzeczy jest za dużych na paczkę, oraz Nieruchomości i Pracę, bo Przesyłka tam nie ma sensu.\n\nRazem to ok. 400 tys. osób, już bez tych, którzy nie mają żadnej zgody marketingowej. 10% odłożę jako grupę kontrolną, żebyśmy uczciwie widzieli efekt. Szczegóły po prawej. Idziemy w to?",
    actions: [{ type: "setPanel", panel: "olxBase" }],
  },
  {
    id: "c3_accept",
    quickReply: "Tak, bierzemy te 3 kategorie.",
    keywords: ["tak", "bierzemy", "pasuje", "akceptuj", "ok", "idziemy"],
    aiTypingMs: 1700,
    aiMessage:
      "Super. Przekopałem tę bazę i podzieliłbym ją na 3 grupy. Każdą blokuje coś innego, więc każda powinna dostać inny komunikat:\n\n1. Łowcy okazji (Elektronika, Moda), ok. 150 tys.: obserwują po kilka ogłoszeń i czekają na lepszą cenę.\n2. Ostrożni (Dla dzieci i droższa Elektronika), ok. 130 tys.: długo oglądają, rzadko piszą. Boją się kupić od obcej osoby.\n3. Prawie kupili, ok. 40 tys.: napisali do sprzedającego i nie kupili w 48 h. Najgorętsza grupa.\n\nZostaje ok. 80 tys. osób, które od rejestracji niczego nie otworzyły. Do nich bym na razie nie pisał.\n\nGrupy masz po prawej. Co sądzisz?",
    actions: [{ type: "acceptBase" }, { type: "setPanel", panel: "olxSegments" }],
  },
  {
    id: "c4_creatives",
    quickReply: "Dobry podział. Co do nich wysyłamy?",
    keywords: ["podział", "wysył", "komunikat", "co", "kreacj", "dobry"],
    aiTypingMs: 1500,
    aiMessage:
      "Do każdej grupy co innego:\n\n1. Łowcy okazji: „Okazja nie poczeka”. Cena spadła w obserwowanym ogłoszeniu.\n2. Ostrożni: „Kup bez ryzyka”. Pakiet Ochronny: jeśli coś będzie nie tak, oddajemy pieniądze.\n3. Prawie kupili: „Dokończ zakup”. Sprzedawca odpowiedział, rzecz wciąż czeka, paczka w 2 dni.\n\nKażdy komunikat ma wersję na maila, pusha i Tinkerbell. Po prawej przełączasz grupy i możesz przeczytać dokładnie, co pójdzie do ludzi.",
    actions: [{ type: "setPanel", panel: "olxCreatives" }],
  },
  {
    id: "c5_ab",
    quickReply: "Podoba mi się. Jak to przetestujemy?",
    keywords: ["test", "a/b", "przetest", "podoba", "sprawdz"],
    aiTypingMs: 1400,
    aiMessage:
      "W każdej grupie osobny test A/B, bo w każdej sprawdzamy coś innego:\n\n• Łowcy okazji: A „ile oszczędzasz” (tańszy o 200 zł) vs B „inni też patrzą” (ogląda 14 osób).\n• Ostrożni: A „oddamy Ci pieniądze” vs B „2 mln osób już tak kupiło”.\n• Prawie kupili: A „sprzedawca odpowiedział, rzecz czeka” vs B „kup jednym kliknięciem, paczka za 2 dni”.\n\nW każdej grupie A dostaje 45%, B 45%, a 10% zostaje bez komunikacji jako kontrola. Zwycięzcę ogłaszam osobno w każdej grupie. Może się okazać, że w jednej wygra A, a w innej B. Wszystkie wersje masz po prawej.",
    actions: [{ type: "setPanel", panel: "olxAB" }],
  },
  {
    id: "c6_channels",
    quickReply: "Ok. A jak to roześlesz?",
    keywords: ["kanał", "roześl", "wyśl", "jak", "ok"],
    aiTypingMs: 1600,
    aiMessage:
      "Komunikat wynika z grupy, ale kanał dobieram każdej osobie osobno, według tego, na co reagowała do tej pory:\n\n• Łowcy okazji: głównie push (60 tys.), bo pushe otwierają 3× częściej niż maile, zwłaszcza wieczorem. Mail dostanie 45 tys. osób z wyłączonymi pushami, Tinkerbell 22 tys., które olewają i jedno, i drugie, ale siedzą w aplikacji.\n• Ostrożni: głównie mail (62 tys.), bo czytają dokładnie, zwykle rano. Push dostanie 30 tys., Tinkerbell 18 tys.\n• Prawie kupili: głównie Tinkerbell (22 tys.), bo codziennie są w aplikacji i łapiemy ich w trakcie sesji. Push dostanie 9 tys., mail 4 tys.\n• Do tego SMS dla 16 tys. osób bez aplikacji, które wcześniej klikały w SMS-y.\n\nTo plan na start. Jak ktoś przestanie reagować na swój kanał, przełączę go na inny. Odpalamy?",
    actions: [{ type: "setPanel", panel: "olxChannelPlan" }],
  },
  {
    id: "c7_launch",
    quickReply: "Odpalamy.",
    keywords: ["odpal", "uruchom", "start", "dawaj", "jedziemy"],
    aiTypingMs: 1000,
    aiMessage:
      "Poszło. Po prawej widzisz wysyłki na żywo: kto z której grupy, jaką wersję testu dostaje, jakim kanałem i dlaczego, np. „3 maile bez otwarcia, więc push”.",
    actions: [
      { type: "setPanel", panel: "olxLive" },
      { type: "launch" },
    ],
  },
  {
    id: "c8_people",
    quickReply: "Pokaż na konkretnych osobach, kto co dostaje.",
    keywords: ["osob", "konkret", "pokaż", "dostaje", "kto"],
    aiTypingMs: 1500,
    aiMessage:
      "Proszę, 5 osób z dzisiejszych wysyłek. Kliknij każdą po prawej, żeby zobaczyć dokładnie, co dostaje i dokąd:\n\n• Kasia (Ostrożni, wózek): 3 maile bez otwarcia, ale otwiera 4 z 5 pushy. Dostaje push „2 mln osób kupiło już z Pakietem Ochronnym” (wersja B) o 19:30.\n• Marek (Łowcy okazji, iPhone): pushe wyłączone, maile otwiera wszystkie. Dostaje maila „Cena spadła o 200 zł” (wersja A) o 7:45.\n• Ola (Prawie kupili, kurtka): olewa maile i pushe, ale codziennie jest w aplikacji. Dostaje Tinkerbell „Sprzedająca odpowiedziała” (wersja A).\n• Tomek (Ostrożni, PS5): nie ma aplikacji, ale kliknął w SMS. Dostaje SMS „oddamy Ci pieniądze” (wersja A).\n• Piotr: zero reakcji od rejestracji, więc do niego nie piszę.",
    actions: [{ type: "setPanel", panel: "olxPeople" }],
  },
  {
    id: "c9_results",
    quickReply: "Przewiń o 14 dni. Co wyszło?",
    keywords: ["przewiń", "dni", "wynik", "raport", "tydzie", "wyszło"],
    aiTypingMs: 1700,
    aiMessage:
      "Po 2 tygodniach zakupy z Przesyłką wzrosły z 3,2% do 3,9%, czyli o 21,9% (ok. +2,5 tys. nowych kupujących). Wysłaliśmy o 34% mniej wiadomości, a wypisów z maili było o 41% mniej.\n\nPo grupach:\n\n• Łowcy okazji (+25% vs kontrola): wygrała B, „inni też patrzą”, 4,5% vs 4,0%. Najlepszy kanał to push, 4,9%.\n• Ostrożni (+30%): wygrała B, „2 mln osób już tak kupiło”, 3,9% vs 3,5%. Najlepsze są Tinkerbell (4,3%) i mail (4,1%).\n• Prawie kupili (+25%): tu wygrała A, „sprzedawca odpowiedział”, 8,1% vs 7,2%. Tinkerbell w trakcie sesji daje ponad 9%.\n\nDo tego osoby, którym zmieniłem kanał z maila na push, Tinkerbell albo SMS, kupowały o 29% częściej niż te, którym zostawiłem maila. Szczegóły po prawej. Mogę pokazać, skąd to wiem i co bym teraz zmienił.",
    actions: [
      { type: "advanceWeek" },
      { type: "setPanel", panel: "olxLearnings" },
    ],
  },
  {
    id: "c10_next",
    quickReply: "Skąd to wiesz? I co byś zmienił?",
    keywords: ["skąd", "jak", "propon", "zmieni", "dalej", "dlaczego"],
    aiTypingMs: 1700,
    aiMessage:
      "Jak do tego doszedłem:\n• Dni 1–3: w każdej grupie A i B po równo, do tego różne pory i kanały.\n• Dni 4–8: po ok. 60 tys. wysyłek i 2 tys. zakupów było widać zwycięzców, a u części ludzi trzeba było zmienić kanał. Np. maile szły do osób, które ich nie otwierały, więc przełączyłem je na push albo Tinkerbell.\n• Dni 9–14: każda grupa dostaje swoją lepszą wersję, a kanały są już dobrane. Ok. 1/3 wysyłek dalej testuję, żeby nie przegapić zmian.\n\nNa wykresie po prawej widać, jak udział maili spadał na rzecz pusha i Tinkerbell.\n\nCo bym zmienił:\n1. Zwycięzców puścić do wszystkich (B, B i A) i w każdej grupie testować nową wersję C.\n2. Elektronikę powyżej 1 000 zł przenieść z łowców okazji do ostrożnych, bo przy drogim sprzęcie bardziej liczy się ochrona niż cena.\n3. Pushe do łowców wysyłać tylko 19–21, maile do ostrożnych rano.\n4. Do „prawie kupili” dołączyć osoby, które obserwują 3+ ogłoszenia (ok. 45 tys.). Ta grupa konwertuje najlepiej.",
    actions: [{ type: "setPanel", panel: "olxNext" }],
  },
  {
    id: "c9_winback",
    quickReply: "Wdrażamy wszystkie 4. I zróbmy coś podobnego dla sprzedających, którzy nic nie wystawili od 60 dni.",
    keywords: ["sprzedaj", "powrót", "druga", "kampani", "60", "wdraż"],
    aiTypingMs: 1500,
    aiMessage:
      "Zrobione, wszystkie 4 zmiany wdrożone. Druga kampania to „Powrót sprzedających”:\n\n• Do kogo: ok. 310 tys. osób, które coś sprzedały, ale od 60 dni nie wystawiły nic nowego\n• Na co patrzymy: nowe ogłoszenie w 21 dni, najlepiej z Przesyłką\n• Komunikaty: darmowe wyróżnienie ogłoszenia, podpowiedź ceny, „wystaw w 2 minuty ze zdjęcia”, sezonowe przypomnienie, informacja, że w ich kategorii rośnie popyt\n\nTo, czego nauczyliśmy się o porach i kanałach, przenoszę od razu, więc start będzie szybszy. Szacuję +9–12% powrotów. Obie kampanie mają wspólny limit wiadomości, więc nikt nie dostanie za dużo.",
    actions: [{ type: "setPanel", panel: "olxWinback" }],
  },
];

export function getScript(flow: FlowId): Step[] {
  if (flow === "B") return demoScriptB;
  if (flow === "C") return demoScriptC;
  return demoScriptA;
}

// Alias wsteczny (na wypadek starych importów)
export const demoScript = demoScriptA;
