import { expect, test } from "@playwright/test";

test("app loads", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Research workbench" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Institutional market cockpit" })).toBeVisible();
});

test("navigation works", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Portfolio" }).click();

  await expect(page.getByRole("heading", { name: "Risk lab" })).toBeVisible();
  await expect(page.getByText("Gross exposure")).toBeVisible();
});

test("key user path filters and selects an asset", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Screener" }).click();
  await page.getByRole("searchbox", { name: "Search assets" }).fill("NVDA");
  await page.getByRole("button", { name: /NVDA/ }).click();

  await expect(page.getByRole("heading", { name: "NVDA" })).toBeVisible();
  await expect(
    page.getByText("AI capex leadership remains the clearest earnings revision engine.")
  ).toBeVisible();
});

test("risk and alert workflow works", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "AI Brief" }).click();
  await expect(page.getByRole("heading", { name: "LLM market briefing" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Stock action board" })).toBeVisible();

  await page.getByRole("button", { name: "Scenarios" }).click();
  await expect(page.getByRole("heading", { name: "Scenario matrix" })).toBeVisible();
  await expect(page.getByRole("tab", { name: "Volatility reset" })).toBeVisible();

  await page.getByRole("button", { name: "Alerts" }).click();
  await expect(page.getByRole("heading", { name: "Triage queue" })).toBeVisible();
  await expect(page.getByText("Revision risk unresolved")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Due diligence" })).toBeVisible();
});
