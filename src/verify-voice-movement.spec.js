import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

test('verify gem voice and movement UI states', async ({ page }) => {
  const artifactDir = 'C:\\Users\\kevin\\.gemini\\antigravity-cli\\brain\\f887eac6-4972-4560-bc26-980ba98f8d59';
  if (!fs.existsSync(artifactDir)) {
    fs.mkdirSync(artifactDir, { recursive: true });
  }

  const logs = [];
  page.on('console', msg => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
      logs.push(`[CONSOLE ${msg.type().toUpperCase()}] ${msg.text()}`);
    }
  });
  page.on('pageerror', err => logs.push(`[PAGE ERROR] ${err.message}`));

  console.log('Navigating to local site...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // 1. Verify "Gem" is rendered as the primary agent header on the page
  console.log('Verifying GemVoice is rendered...');
  const title = page.locator('h1:has-text("Talk to")');
  await expect(title).toContainText('Gem');
  
  const boxLabel = page.locator('span:has-text("Acoustic Box")');
  await expect(boxLabel).toBeVisible();

  // 2. Verify Avatar mode is active by default (shows the neutral video loop)
  const videoLoop = page.locator('video[src="/assets/gem-loop.mp4"]');
  await expect(videoLoop).toBeVisible();
  
  // Take screenshot of default avatar mode
  const visualizerBox = page.locator('.stamp-box').nth(0); // Under the hero
  await page.waitForTimeout(500); // Wait for transition
  const avatarPath = path.join(artifactDir, 'gem-avatar-mode.png');
  await visualizerBox.screenshot({ path: avatarPath });
  console.log(`Saved screenshot: ${avatarPath}`);

  // 3. Toggle to Wave mode and verify avatar disappears
  console.log('Toggling to WAVE mode...');
  const waveBtn = page.locator('button:has-text("WAVE")');
  await waveBtn.click();
  await page.waitForTimeout(300);
  
  // Verify avatar is hidden in wave mode
  await expect(videoLoop).not.toBeVisible();
  
  // Take screenshot of wave mode
  const wavePath = path.join(artifactDir, 'gem-wave-mode.png');
  await visualizerBox.screenshot({ path: wavePath });
  console.log(`Saved screenshot: ${wavePath}`);

  // 4. Toggle back to Avatar mode
  console.log('Toggling back to AVATAR mode...');
  const avatarBtn = page.locator('button:has-text("AVATAR")');
  await avatarBtn.click();
  await page.waitForTimeout(300);
  await expect(videoLoop).toBeVisible();

  // Print console logs gathered
  console.log('\n--- BROWSER CONSOLE REPORT ---');
  if (logs.length === 0) {
    console.log('✓ Clean console: No errors or warnings detected.');
  } else {
    logs.forEach(log => console.log(log));
  }
});
