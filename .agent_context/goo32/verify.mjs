import { chromium } from 'playwright-core';

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1280, height: 850 });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);

const info = await page.evaluate(() => {
  const h1 = document.querySelector('h1');
  const cs = h1 ? getComputedStyle(h1) : null;
  return {
    h1text: h1 ? h1.innerText.replace(/\s+/g, ' ').trim() : 'NO H1',
    fontFamily: cs ? cs.fontFamily : null,
    variationSettings: cs ? cs.fontVariationSettings : null,
    frauncesLoaded: document.fonts.check('1em Fraunces') || document.fonts.check("1em '__fraunces_fallback'"),
    fontFaces: [...document.fonts].map(f => f.family).filter((v,i,a)=>a.indexOf(v)===i),
  };
});
console.log(JSON.stringify(info, null, 2));

const h1 = page.locator('h1').first();
await h1.scrollIntoViewIfNeeded();
await page.screenshot({ path: '.agent_context/goo32/after-hero.png', clip: { x: 0, y: 0, width: 1280, height: 520 } });
await browser.close();
