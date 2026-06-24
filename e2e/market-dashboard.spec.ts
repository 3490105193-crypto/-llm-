import { expect, test } from "@playwright/test";

test("app loads", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Market command center" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Signal rank" })).toBeVisible();
});

test("navigation works", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Signals" }).click();

  await expect(page).toHaveURL(/#signals$/);
  await expect(page.getByRole("heading", { name: "Macro stack" })).toBeVisible();
});

test("key user path filters and selects an asset", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("searchbox", { name: "Search assets" }).fill("NVDA");
  await page.getByRole("button", { name: /NVDA/ }).click();

  await expect(page.getByRole("heading", { name: "NVDA" })).toBeVisible();
  await expect(
    page.getByText("AI capex leadership remains the clearest earnings revision engine.")
  ).toBeVisible();
});
