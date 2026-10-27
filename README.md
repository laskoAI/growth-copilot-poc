# Nuvera — Growth Copilot: demo

Interaktywne, w pełni oskryptowane demo agenta AI do growth marketingu, działającego nad istniejącymi narzędziami wysyłek (nie zamiast nich). Po lewej rozmowa z agentem, po prawej panel pokazujący, co robi i dlaczego: podłączanie danych, segmenty, kreacje, wysyłkę i wynik w złotówkach.

Scenariusz: fikcyjna marka "Nuvera" (kosmetyki i suplementy, wyłącznie online), cel marketera — "Chcę, żeby klienci częściej u nas zamawiali." Agent łączy 4 bałaganiarskie źródła danych, znajduje największy potencjał i tańszą alternatywę dla poprzedniej kampanii z rabatem dla wszystkich.

Wersja online: https://growth-copilot-poc.vercel.app

> Wszystkie dane, liczby, osoby i treści w demo są przykładowe. Marka "Nuvera" jest fikcyjna.

## Uruchomienie u siebie

Potrzebujesz [Node.js](https://nodejs.org) w wersji 18.17 lub nowszej oraz gita.

```bash
git clone https://github.com/laskoAI/growth-copilot-poc.git
cd growth-copilot-poc
npm install
npm run dev
```

Potem otwórz w przeglądarce http://localhost:3000.

Kliknij sugestię pod polem rozmowy, żeby zacząć — demo prowadzi przez 4 kroki: cel i dane, plan kampanii, wysyłka i wyniki, podsumowanie.

## Przydatne

- `npm run build && npm start` uruchamia wersję produkcyjną.
- `R` restartuje demo, `→` przechodzi krok do przodu, `←` krok do tyłu (gdy kursor nie jest w polu tekstowym) — te same akcje są dostępne jako przyciski w pasku na górze.
- Wszystkie liczby demo liczą się z jednego miejsca: `src/lib/scenario.ts` (surowe dane + wyliczenia) i `src/lib/format.ts` (zaokrąglanie do wyświetlenia) — żaden panel nie wpisuje liczby na sztywno.
- Treść rozmowy jest w `src/lib/demoScript.ts`, panele w `src/components/Panels/`.
- `npx playwright test` przechodzi całe demo (obiema odpowiedziami na pytania doprecyzowujące + nawigację cofnij/dalej/restart) i zapisuje zrzuty ekranu każdego kroku do `e2e/screenshots/`.
