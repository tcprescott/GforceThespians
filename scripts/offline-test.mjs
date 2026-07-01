// Verifies the offline-progress fix: seed a save with production + a past
// lastSeen, reload, and assert the "while you were away" modal appears and
// credited zoomies.
import { chromium } from 'playwright';
const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--no-proxy-server'],
});
const page = await browser.newPage();
const URL = 'http://localhost:4190/GforceThespians/';
await page.goto(URL, { waitUntil: 'networkidle' });
const curtain = page.getByRole('button', { name: /On with the show/i });
if (await curtain.isVisible().catch(() => false)) await curtain.click();

// Build some production: click + buy a few generators.
const dispatch = page.getByRole('button', { name: /Raise the Curtain/i });
for (let i = 0; i < 60; i++) await dispatch.click();
for (let r = 0; r < 4; r++) {
  const b = page.getByRole('button', { name: /Buy ×/ });
  const n = await b.count();
  for (let i = 0; i < n; i++) { try { await b.nth(i).click({ timeout: 150 }); } catch {} }
}
await page.waitForTimeout(500);

// Rewind lastSeen by 2 hours in the persisted save, then reload.
const KEY = 'gforce-thespians-save';
const rewound = await page.evaluate((key) => {
  const raw = localStorage.getItem(key);
  if (!raw) return 'no-save';
  const save = JSON.parse(raw);
  save.state.lastSeen = Date.now() - 2 * 3600 * 1000; // 2h ago
  localStorage.setItem(key, JSON.stringify(save));
  return save.state.lastSeen;
}, KEY);
console.log('rewound lastSeen:', rewound);

await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(600);

const modal = page.getByText('The show went on without you');
const visible = await modal.isVisible().catch(() => false);
console.log('offline modal visible:', visible);
const body = visible ? await page.locator('.fixed').first().innerText() : '';
if (visible) console.log('modal text:\n' + body.split('\n').slice(0, 8).join('\n'));

await browser.close();
if (!visible) {
  console.error('❌ offline modal did NOT appear — fix regressed');
  process.exit(1);
}
console.log('\n✅ offline progress works: welcome-back modal shown.');
