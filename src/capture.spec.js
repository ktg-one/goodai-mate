import { test } from '@playwright/test';
import path from 'path';

test('capture screenshots', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 850 });
  
  const logs = [];
  page.on('console', msg => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
      logs.push(`[CONSOLE ${msg.type().toUpperCase()}] ${msg.text()}`);
    }
  });
  page.on('pageerror', err => logs.push(`[PAGE ERROR] ${err.message}`));

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  const styles = await page.evaluate(() => {
    const bodyStyle = window.getComputedStyle(document.body);
    const heading = document.querySelector('h1') || document.querySelector('h2');
    const headingStyle = heading ? window.getComputedStyle(heading) : null;
    
    return {
      bodyBg: bodyStyle.backgroundColor,
      bodyFontFamily: bodyStyle.fontFamily,
      displayFontFamily: headingStyle ? headingStyle.fontFamily : 'not found',
      frauncesLoaded: document.fonts.check('1em Fraunces'),
      dmSansLoaded: document.fonts.check('1em DM Sans')
    };
  });

  console.log('\n--- COMPUTED BROWSER STYLES ---');
  console.log(JSON.stringify(styles, null, 2));

  console.log('\n--- BROWSER CONSOLE LOGS ---');
  if (logs.length === 0) console.log('(No console errors or warnings detected)');
  else logs.forEach(log => console.log(log));

  const scratchDir = 'C:\\Users\\kevin\\.gemini\\antigravity-cli\\brain\\1941f21f-2228-4e82-b875-216b4b79a45e';
  
  await page.screenshot({ path: path.join(scratchDir, 'hero.png') });
  console.log('Saved hero.png');
  
  const sections = page.locator('section');
  const count = await sections.count();
  
  for (let i = 0; i < count; i++) {
    const section = sections.nth(i);
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(scratchDir, `section_${i}.png`) });
    console.log(`Saved section_${i}.png`);
  }

  const footer = page.locator('footer');
  if (await footer.count() > 0) {
    await footer.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(scratchDir, 'footer.png') });
    console.log('Saved footer.png');
  }
});
