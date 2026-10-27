// Czysto poglądowe, celowo "brudne" próbki z 4 źródeł do Kroku 1.
// Nie wchodzą do żadnych wyliczeń (patrz scenario.ts) — mają tylko wyglądać
// wiarygodnie bałaganiarsko: niejasne nazwy kolumn, różne formaty dat, duplikaty.

export type RawTable = {
  id: string;
  systemLabel: string;
  sourceLabel: string;
  columns: string[];
  rows: string[][];
  note?: string;
};

export const RAW_TABLES: RawTable[] = [
  {
    id: "orders",
    systemLabel: "Sklep internetowy",
    sourceLabel: "eksport zamówień (CSV)",
    columns: ["id_zam", "data_zam", "email", "wartosc_koszyka", "kod_rabatowy", "status_zwrotu"],
    rows: [
      ["ZM-88213", "2026-07-14", "anna.kowalska@gmail.com", "189,90", "", "brak"],
      ["ZM-88220", "03/08/2026", "anna.kowalska@gmail.com", "145,00", "WROC20", "brak"],
      ["ZM-88305", "12 sie", "p.nowak88@wp.pl", "99,00", "", "zwrot częściowy"],
      ["ZM-88401", "2026-08-20", "k.wisniewska@onet.pl", "210,50", "WROC20", "brak"],
      ["ZM-88402", "20/08/2026", "m.zareba@gmail.com", "76,00", "", "brak"],
    ],
  },
  {
    id: "getresponse",
    systemLabel: "GetResponse",
    sourceLabel: "zgody i kampanie",
    columns: ["contact_id", "zgoda_mkt", "ostatnia_kampania", "otwarcia_30d", "klikniecia_30d", "status_k"],
    rows: [
      ["GR-5521", "tak", "Rabat_20_wszyscy_WRZ", "2", "0", "3"],
      ["GR-5522", "tak", "Rabat_20_wszyscy_WRZ", "5", "1", "1"],
      ["GR-5390", "nie", "—", "0", "0", "3"],
      ["GR-5601", "tak", "Newsletter_sierpien", "8", "3", "1"],
    ],
    note: "status_k nie jest opisany nigdzie w dokumentacji GetResponse klienta.",
  },
  {
    id: "app",
    systemLabel: "Aplikacja mobilna",
    sourceLabel: "zdarzenia z BigQuery",
    columns: ["user_pseudo_id", "event_name", "event_timestamp", "seg2", "push_token"],
    rows: [
      ["a1f9-77c2", "session_start", "1755161822000000", "A2", "ey81…"],
      ["a1f9-77c2", "view_item", "1755161830000000", "A2", "ey81…"],
      ["b02e-91ad", "add_to_cart", "1754999120000000", "B1", "brak"],
      ["c771-10bb", "screen_view", "1755300002000000", "A2", "ey90…"],
    ],
    note: "event_timestamp w mikrosekundach Unix, seg2 to wewnętrzny kod bez opisu.",
  },
  {
    id: "zendesk",
    systemLabel: "Zendesk",
    sourceLabel: "zgłoszenia obsługi klienta",
    columns: ["ticket_id", "telefon", "temat", "status", "utworzono"],
    rows: [
      ["ZD-2291", "+48 501 222 345", "Brak paczki", "otwarte", "2026-08-11"],
      ["ZD-2305", "501222345", "Pytanie o zwrot", "zamknięte", "02.07.2026"],
      ["ZD-2350", "+48 600 888 212", "Reklamacja jakości", "otwarte", "19.08.2026"],
    ],
  },
];

// Przykład klienta widocznego pod 2 różnymi identyfikatorami w 2 systemach —
// agent wskazuje to wprost przy mapowaniu pól.
export const DUPLICATE_CUSTOMER_EXAMPLE = {
  name: "ten sam klient",
  viaEmail: "anna.kowalska@gmail.com (sklep, GetResponse)",
  viaPhone: "501 222 345 (Zendesk, zapisany bez prefiksu i spacji)",
};
