import { test, expect } from "@playwright/test";

/** Copy taken from synced `endava-pixel-body.html` — same intent as www.endava.com marketing copy. */
const CAPABILITIES_HEADINGS = [
  "Create real value with leading capabilities",
  "Move your business forward with tailored expertise",
  "Discover how we help leading brands",
] as const;

test.describe("Capabilities / case studies (production island path)", () => {
  test("three pillar blocks show the same headlines as the synced Endava homepage", async ({
    page,
  }) => {
    test.setTimeout(180_000);

    await page.goto("/", { waitUntil: "domcontentloaded", timeout: 120_000 });

    const section = page.locator("#capabilities-case-studies-home");
    await expect(section).toBeAttached();
    await section.scrollIntoViewIfNeeded();

    for (let i = 0; i < CAPABILITIES_HEADINGS.length; i++) {
      const wrap = section.getByTestId(`capabilities-case-studies-home-${i}-wrapper`);
      const heading = wrap.locator(
        '[data-testid="paragraph-type-three-header"]',
      );
      await expect(heading).toHaveText(CAPABILITIES_HEADINGS[i], {
        timeout: 60_000,
      });
    }
  });
});
