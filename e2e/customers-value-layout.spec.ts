import { test, expect } from "@playwright/test";

test.describe("Customers value section layout", () => {
  test("inner row gets min-height 1400px and 144px column gap at lg+ viewport", async ({
    page,
  }) => {
    test.setTimeout(180_000);

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "domcontentloaded", timeout: 120_000 });

    const shell = page.locator("#endava-pixel-shell");
    await expect(shell).toBeAttached();

    await shell.evaluate((el) => {
      if (!el.innerHTML.includes("customers-value-container")) {
        throw new Error("Expected customers-value markup inside endava-pixel-shell");
      }
    });

    const header = page.getByTestId("customer-value-header");
    await expect(header).toBeVisible();
    await expect(header).not.toHaveText(/^$/);

    const row = page.locator(
      '[data-testid="customers-value-container"] > div[class*="gap-3xl"] > div[class*="max-w-[1312px]"]',
    );
    await expect(row).toBeVisible();

    const styles = await row.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return {
        display: cs.display,
        minHeightPx: Number.parseFloat(cs.minHeight),
        columnGapPx: Number.parseFloat(cs.columnGap),
        rowGapPx: Number.parseFloat(cs.rowGap),
        className: el.className,
      };
    });

    expect(styles.display, "row should lay out as flex").toBe("flex");
    expect(
      styles.className,
      "markup should include updated Tailwind-style utilities",
    ).toMatch(/max-w-\[1312px\]/);
    expect(
      styles.className,
      "markup should request tall min-height on large screens",
    ).toMatch(/lg:h-min-\[1400px\]/);
    expect(
      styles.minHeightPx,
      "min-height parity with live (globals.css fallback covers missing utilities)",
    ).toBeGreaterThanOrEqual(1400);

    expect(
      styles.columnGapPx,
      "horizontal spacing between columns (fallback + Tailwind)",
    ).toBe(144);
  });
});
