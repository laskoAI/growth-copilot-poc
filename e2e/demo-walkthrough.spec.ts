import { test, expect, type Page } from "@playwright/test";

const SHOT_DIR = "e2e/screenshots";

async function shoot(page: Page, name: string) {
  await page.screenshot({ path: `${SHOT_DIR}/${name}.png` });
}

async function forward(page: Page, waitMs = 1800) {
  await page.getByTitle("Skrót: →").click();
  await page.waitForTimeout(waitMs);
}

// toLocaleString("pl-PL") grupuje tysiące niełamliwą spacją (U+00A0), nie zwykłą
// spacją — normalizujemy przed porównaniem tekstu w asercjach.
function normalizeSpaces(s: string | null): string {
  return (s ?? "").replace(/[  ]/g, " ");
}

test.describe("Pełne demo: od celu do wyniku", () => {
  test("ścieżka główna — liniowa, bez rozgałęzień", async ({ page }) => {
    await page.goto("/");
    await shoot(page, "01-welcome");

    // Krok 1 — cel i dane
    await forward(page); // s1_goal
    await shoot(page, "02-data-sources-connected");

    await forward(page); // s2_mapping (kończy pytaniem o status_k)
    await shoot(page, "03-mapping-question");

    await forward(page); // s3_confirm_status — jedno potwierdzenie, bez wyboru
    await shoot(page, "04-wroc-confirm-suggestion");

    await forward(page); // s4_confirm_wroc — jedno potwierdzenie, przypomina cel
    await shoot(page, "05-potential-segment-12300");
    await expect(page.getByText("Cel:", { exact: false })).toBeVisible();

    await forward(page); // s5_diagnosis
    await shoot(page, "06-previous-campaign-diagnosis");

    // Krok 2 — plan kampanii
    await forward(page); // s6_plan
    await shoot(page, "07-campaign-plan");

    // Krok 3 — wysyłka: najpierw test A/B na żywo na części największej grupy...
    await page.getByRole("button", { name: "Zatwierdź i wyślij" }).click();
    await page.waitForTimeout(1600);
    await shoot(page, "08-send-test-in-progress");
    await expect(page.getByText("Test w toku", { exact: false })).toBeVisible();

    // ...pierwsze wyniki testu: 3 metryki per wariant, zamówienia jeszcze
    // trudne do porównania, ale góra lejka wskazuje zwycięzcę...
    await page.getByRole("button", { name: "Co pokazuje test? →" }).click();
    await page.waitForTimeout(1700);
    await shoot(page, "09-send-test-results");
    await expect(page.getByText("Pierwsze wyniki testu")).toBeVisible();
    await expect(page.getByText("liderem")).toBeVisible();

    // ...marketer akceptuje wysyłkę do reszty grupy.
    await page.getByRole("button", { name: "Tak, wyślij do reszty →" }).click();
    await page.waitForTimeout(1600);
    await shoot(page, "10-send-confirmation");
    await expect(page.getByText("Kampania wysłana")).toBeVisible();

    // Krok 4 — podsumowanie (przez własny CTA panelu "Przewiń 14 dni")
    await page.getByRole("button", { name: /Przewiń 14 dni/ }).click();
    await page.waitForTimeout(1600);
    await shoot(page, "11-summary-table");

    // Sprawdzenie liczb w tabeli podsumowania — muszą się zgadzać z briefem.
    const bodyText = normalizeSpaces(await page.textContent("body"));
    expect(bodyText).toContain("825");
    expect(bodyText).toContain("955");
    expect(bodyText).toContain("123 750 zł");
    expect(bodyText).toContain("143 250 zł");
    expect(bodyText).toContain("24 750 zł");
    expect(bodyText).toContain("15 608 zł");
    expect(bodyText).toContain("+130");
    expect(bodyText).toContain("+19 500 zł");
    // Wiersz "Wynik" (przychód − koszt promocji) musi być obecny i policzony poprawnie.
    expect(bodyText).toContain("Wynik (przychód");
    expect(bodyText).toContain("99 000 zł"); // poprzednia: 123 750 - 24 750
    expect(bodyText).toContain("127 643 zł"); // nowa: 143 250 - 15 607,5 (zaokrąglone w górę)
    // Sekcja "Następna kampania" została usunięta — flow kończy się na liczbach.
    expect(bodyText).not.toContain("Następna kampania");
  });
});

test.describe("Nawigacja: cofnij / dalej / restart", () => {
  test("cofnij i dalej nie psują stanu, restart wraca na początek", async ({ page }) => {
    await page.goto("/");
    await forward(page); // s1
    await forward(page); // s2
    await forward(page); // s3_confirm_status
    await forward(page); // s4_confirm_wroc
    await shoot(page, "11-nav-before-back");

    // Cofnij 2x — powinniśmy wrócić przed pytanie, do ekranu danych.
    await page.getByTitle("Skrót: ←").click();
    await page.waitForTimeout(300);
    await page.getByTitle("Skrót: ←").click();
    await page.waitForTimeout(300);
    await shoot(page, "12-nav-after-back-x2");
    await expect(page.getByText("4 źródła, jeden klient")).toBeVisible();

    // Dalej x2 — replay, natychmiastowy, bez ponownego pytania.
    await page.getByTitle("Skrót: →").click();
    await page.waitForTimeout(200);
    await page.getByTitle("Skrót: →").click();
    await page.waitForTimeout(500);
    await shoot(page, "13-nav-after-forward-replay");
    await expect(page.getByText("Największy potencjał", { exact: true })).toBeVisible();

    // Szybkie wielokrotne klikanie cofnij/dalej — nic nie powinno się wysypać,
    // nawet gdy trafi na granicę (przycisk disabled na stepIndex 0 lub na końcu).
    for (let i = 0; i < 6; i++) {
      await page
        .getByTitle("Skrót: ←")
        .click({ timeout: 1000 })
        .catch(() => {});
    }
    for (let i = 0; i < 6; i++) {
      await page
        .getByTitle("Skrót: →")
        .click({ timeout: 1000 })
        .catch(() => {});
    }
    await page.waitForTimeout(500);
    await shoot(page, "14-nav-rapid-clicks-survived");

    await page.getByTitle("Skrót: R").click();
    await page.waitForTimeout(300);
    await expect(page.getByText("Cześć! W czym mogę pomóc?")).toBeVisible();
    await shoot(page, "15-nav-after-restart");
  });
});
