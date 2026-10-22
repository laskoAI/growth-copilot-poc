import { faker } from "@faker-js/faker/locale/pl";

export type Facility = {
  id: string;
  name: string;
  city: string;
  region: string;
  specialists: number;
  knownDoctor: boolean;
  invoicesPaid: boolean;
  email: string;
  phone: string;
};

const BIG_CITIES = [
  "Warszawa", "Kraków", "Wrocław", "Poznań", "Gdańsk",
  "Łódź", "Katowice", "Szczecin", "Lublin", "Białystok",
];
const SMALL_CITIES = [
  "Kielce", "Radom", "Płock", "Elbląg", "Tarnów",
  "Gniezno", "Konin", "Chełm", "Zamość", "Nowy Sącz",
  "Piła", "Kalisz", "Legnica", "Słupsk", "Gorzów",
];
const REGIONS = [
  "mazowieckie", "małopolskie", "dolnośląskie", "wielkopolskie", "pomorskie",
  "łódzkie", "śląskie", "zachodniopomorskie", "lubelskie", "podlaskie",
];

let cache: Facility[] | null = null;

export function getFacilities(): Facility[] {
  if (cache) return cache;
  faker.seed(42);
  const out: Facility[] = [];
  const N = 25000;
  for (let i = 0; i < N; i++) {
    const isBig = faker.number.int({ min: 0, max: 99 }) < 55;
    const city = isBig
      ? BIG_CITIES[faker.number.int({ min: 0, max: BIG_CITIES.length - 1 })]
      : SMALL_CITIES[faker.number.int({ min: 0, max: SMALL_CITIES.length - 1 })];
    out.push({
      id: `POZ-${(i + 1).toString().padStart(6, "0")}`,
      name: `${faker.helpers.arrayElement(["Centrum Medyczne", "Przychodnia", "NZOZ", "MedPlus", "Salus", "Vitalis"])} ${faker.location.city()}`,
      city,
      region: REGIONS[faker.number.int({ min: 0, max: REGIONS.length - 1 })],
      specialists: faker.number.int({ min: 1, max: 45 }),
      knownDoctor: faker.number.int({ min: 0, max: 99 }) < 40,
      invoicesPaid: faker.number.int({ min: 0, max: 99 }) < 70,
      email: faker.internet.email().toLowerCase(),
      phone: faker.phone.number(),
    });
  }
  cache = out;
  return out;
}

export type Filters = {
  knownDoctor?: boolean;
  minSpecialists?: number;
  bigCitiesOnly?: boolean;
  invoicesPaid?: boolean;
};

export function applyFilters(list: Facility[], f: Filters): Facility[] {
  return list.filter((r) => {
    if (f.knownDoctor && !r.knownDoctor) return false;
    if (f.minSpecialists && r.specialists < f.minSpecialists) return false;
    if (f.bigCitiesOnly && !BIG_CITIES.includes(r.city)) return false;
    if (f.invoicesPaid && !r.invoicesPaid) return false;
    return true;
  });
}
