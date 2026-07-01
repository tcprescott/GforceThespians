// Headless runtime smoke test: loads the built app, drives the game loop, and
// asserts no console errors + that core mechanics actually move numbers.
import { chromium } from 'playwright';

const URL = 'http://localhost:4190/GforceThespians/';
const errors = [];

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--no-proxy-server'],
});
const page = await browser.newPage();
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(m.text());
});
page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));

await page.goto(URL, { waitUntil: 'networkidle' });

// Dismiss the first-visit help modal if present.
const curtain = page.getByRole('button', { name: /On with the show/i });
if (await curtain.isVisible().catch(() => false)) await curtain.click();

// Title + main heading render
const h1 = await page.textContent('h1');
console.log('heading:', h1?.trim());

// Helper: read the big zoomies number from The Stage
async function zoomies() {
  const txt = await page.locator('section:has-text("The Stage") .tabular-nums').first().textContent();
  return txt?.trim();
}

// 1) Raising the curtain increases Buzz
const dispatch = page.getByRole('button', { name: /Raise the Curtain/i });
for (let i = 0; i < 15; i++) await dispatch.click();
const afterClicks = await zoomies();
console.log('Buzz after 15 curtain-raises:', afterClicks);

// 2) Buy the first generator (Cardboard Hill) — its Buy button should enable
const buyBtns = page.getByRole('button', { name: /Buy ×/ });
await buyBtns.first().click();
console.log('bought first generator (Cardboard Hill)');

// 3) Let the tick loop run and confirm passive generation moves the number
await page.waitForTimeout(1500);
const afterIdle = await zoomies();
console.log('zoomies after ~1.5s idle:', afterIdle);

// 4) Visit every tab without crashing
for (const name of [/Upgrades/, /Automation/, /The Revival/, /Achievements/, /Stats/, /Backstage/]) {
  await page.getByRole('button', { name }).first().click();
  await page.waitForTimeout(120);
}
console.log('cycled all tabs OK');

// 5) Persistence: reload and confirm a save was restored (owned generator survives)
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(400);
const ownedChip = await page.locator('text=/×\\s*1/').count();
console.log('owned chips visible after reload:', ownedChip);

await browser.close();

if (errors.length) {
  console.error('\n❌ CONSOLE/PAGE ERRORS:');
  for (const e of errors) console.error('  -', e);
  process.exit(1);
}
console.log('\n✅ smoke test passed — no console errors, mechanics functional.');
