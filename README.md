# Growth Marketer AI: demo

Interaktywne demo asystenta growth marketingu. Po lewej rozmowa z AI, po prawej panel, który pokazuje, co AI robi: bazę, grupy, komunikaty, testy A/B, dobór kanałów i wyniki.

Wersja online: https://growth-copilot-poc.vercel.app

> Wszystkie dane, liczby, osoby i treści w demo są przykładowe.

## Uruchomienie u siebie

Potrzebujesz [Node.js](https://nodejs.org) w wersji 18.17 lub nowszej oraz gita.

```bash
git clone https://github.com/laskoAI/growth-copilot-poc.git
cd growth-copilot-poc
npm install
npm run dev
```

Potem otwórz w przeglądarce http://localhost:3000.

Na ekranie startowym wybierz scenariusz i klikaj sugestie pod polem rozmowy albo wpisuj własne wiadomości.

## Przydatne

- `npm run build && npm start` uruchamia wersję produkcyjną.
- `R` restartuje demo, a `→` przechodzi do następnego kroku (gdy kursor nie jest w polu tekstowym).
- Treść rozmów jest w `src/lib/demoScript.ts`, a panele w `src/components/Panels/`.
