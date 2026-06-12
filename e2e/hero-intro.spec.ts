import { test, expect } from '@playwright/test';

test.describe('Hero home intro animation', () => {
  test('home-intro-animation.js loads and #IntroImageContainer scales on scroll', async ({
    page,
  }) => {
    test.setTimeout(180_000);

    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 120_000 });

    await page.waitForFunction(() => {
      const w = window as unknown as { __ENDAVA_HOME_INTRO_READY?: boolean };
      return w.__ENDAVA_HOME_INTRO_READY === true;
    }, { timeout: 60_000 });

    const introImg = page.locator('#IntroImageContainer');
    await expect(introImg).toBeAttached();

    const metrics = await page.evaluate(() => {
      const intro = document.getElementById('HomeIntroContainer');
      if (!intro) return null;
      return {
        scrollHeight: intro.offsetHeight - window.innerHeight,
        offsetHeight: intro.offsetHeight,
        innerHeight: window.innerHeight,
        offsetTop: intro.offsetTop,
      };
    });

    expect(metrics, '#HomeIntroContainer must exist').not.toBeNull();
    const m = metrics!;

    if (m.scrollHeight <= 0) {
      throw new Error(
        `Hero scroll math broken: scrollHeight=${m.scrollHeight} (offsetH=${m.offsetHeight}, inner=${m.innerHeight})`,
      );
    }

    await page.evaluate(() => {
      window.scrollTo(0, 0);
    });

    await page.waitForTimeout(250);

    const orangeTrail = await page.evaluate(() => {
      const el = document.querySelector('[aria-label="Path Orange"]');
      return el?.getAttribute('d') ?? null;
    });
    expect(orangeTrail, 'Path Orange must exist for animation').not.toBeNull();

    await page.evaluate(() => {
      const intro = document.getElementById('HomeIntroContainer');
      if (!intro) return;
      window.scrollTo(0, intro.offsetTop + intro.offsetHeight * 0.85);
    });

    await page.waitForTimeout(500);

    const transform = await introImg.evaluate((el) => el.style.transform);
    expect(transform, 'deep scroll should set scale(1) on #IntroImageContainer').toMatch(
      /scale\s*\(\s*1\s*\)/,
    );

    const trailAfter = await page.evaluate(() => {
      const el = document.querySelector('[aria-label="Path Orange"]');
      return el?.getAttribute('d') ?? null;
    });
    expect(trailAfter, 'trail path should mutate after scroll').not.toBe(orangeTrail);
  });
});
