import { test, expect } from "@playwright/test";

/**
 * Cross-checks the clone against the live site (same three H2 strings + structure).
 * Run locally when you have DNS and can hit www.endava.com:
 *   E2E_LIVE_COMPARE=1 npm run test:e2e -- e2e/capabilities-parity-live.spec.ts
 * Default CI runs do not depend on live Endava availability.
 */
const CAPABILITIES_HEADINGS = [
  "Create real value with leading capabilities",
  "Move your business forward with tailored expertise",
  "Discover how we help leading brands",
] as const;

const LIVE = "https://www.endava.com/";

function normalize(s: string) {
  return s.replace(/\s+/g, " ").trim();
}

test.describe("Capabilities vs www.endava.com (optional network)", () => {
  test.skip(
    process.env.E2E_LIVE_COMPARE !== "1",
    "Set E2E_LIVE_COMPARE=1 to compare against the live Endava homepage.",
  );

  test("clone and live site expose the same three capability headlines", async ({
    page,
  }) => {
    test.setTimeout(240_000);

    async function readHeadings(url: string) {
      await page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: 120_000,
      });
      const section = page.locator("#capabilities-case-studies-home");
      await expect(section).toBeAttached({ timeout: 60_000 });
      await section.scrollIntoViewIfNeeded();

      const out: string[] = [];
      for (let i = 0; i < CAPABILITIES_HEADINGS.length; i++) {
        const wrap = section.getByTestId(
          `capabilities-case-studies-home-${i}-wrapper`,
        );
        const h = wrap.locator('[data-testid="paragraph-type-three-header"]');
        await expect(h).toBeVisible({ timeout: 60_000 });
        out.push(normalize(await h.innerText()));
      }
      return out;
    }

    const clone = await readHeadings("/");
    const live = await readHeadings(LIVE);

    expect(clone).toEqual([...CAPABILITIES_HEADINGS]);
    expect(live).toEqual([...CAPABILITIES_HEADINGS]);
  });
});
