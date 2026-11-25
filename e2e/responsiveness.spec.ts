import { test, expect, type Page } from '@playwright/test';

const pagesToAudit = [
  { name: 'home', path: '/' },
];

const viewports = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];

async function checkNoHorizontalOverflow(page: Page): Promise<boolean> {
  return await page.evaluate(() => {
    return document.documentElement.scrollWidth <= window.innerWidth + 1;
  });
}

test.describe('Responsiveness & Layout Audit', () => {
  for (const vp of viewports) {
    test.describe(`${vp.name} (${vp.width}x${vp.height})`, () => {
      test.use({ viewport: { width: vp.width, height: vp.height } });

      for (const p of pagesToAudit) {
        test(`${p.name} page has no horizontal overflow`, async ({ page }) => {
          await page.goto(p.path, { waitUntil: 'domcontentloaded' });
          await page.waitForTimeout(400);

          const noOverflow = await checkNoHorizontalOverflow(page);
          expect(noOverflow, `Horizontal overflow detected on ${p.name} at ${vp.name}`).toBe(true);
        });
      }
    });
  }
});
