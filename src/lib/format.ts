// Jedyne miejsce, gdzie zaokrąglamy liczby do wyświetlenia.
// Każdy panel ma importować stąd — nigdy nie wpisuje sformatowanej liczby na sztywno.

export function fmtNumber(n: number): string {
  return Math.round(n).toLocaleString("pl-PL");
}

export function fmtZl(n: number): string {
  return `${Math.round(n).toLocaleString("pl-PL")} zł`;
}

export function fmtZlPerOrder(n: number): string {
  return `${n.toFixed(2).replace(".", ",").replace(",00", "")} zł`;
}

export function fmtPct(n: number, decimals = 1): string {
  return `${(n * 100).toFixed(decimals).replace(".", ",")}%`;
}

export function fmtRoi(n: number): string {
  return n.toFixed(1).replace(".", ",");
}

export function fmtSigned(n: number, formatter: (v: number) => string): string {
  const sign = n > 0 ? "+" : n < 0 ? "−" : "";
  return `${sign}${formatter(Math.abs(n))}`;
}
