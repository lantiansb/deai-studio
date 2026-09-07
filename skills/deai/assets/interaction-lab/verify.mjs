// Original offline behavior checks. Requires an existing local Playwright installation.
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const require = createRequire(import.meta.url);
const packagePath = process.env.PLAYWRIGHT_MODULE || 'playwright';
const { chromium } = require(packagePath);
const directory = dirname(fileURLToPath(import.meta.url));
const evidence = join(directory, 'test-results');
await mkdir(evidence, { recursive: true });
const report = { executedAt: new Date().toISOString(), channel: 'msedge', protocol: 'file:', checks: [], errors: [], outboundRequests: [] };
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const check = async (name, run) => {
  try { await run(); report.checks.push({ name, passed: true }); }
  catch (error) { report.checks.push({ name, passed: false, error: error.message }); }
};
async function open(options = {}) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, ...options });
  const page = await context.newPage();
  page.on('pageerror', error => report.errors.push(error.message));
  page.on('request', request => { if (/^https?:/.test(request.url())) report.outboundRequests.push(request.url()); });
  await context.route(/^https?:/, route => route.abort());
  await page.goto(pathToFileURL(join(directory, 'index.html')).href);
  return { context, page };
}

try {
  const { context, page } = await open();
  await check('file:// page loads six independently enhanced examples', async () => {
    assert.match(await page.title(), /交互手记/);
    assert.equal(await page.locator('[data-enhanced="true"]').count(), 6);
  });
  await check('project preview follows keyboard focus and mouse hover', async () => {
    await page.locator('#project-2').focus();
    assert.equal(await page.locator('#project-2').getAttribute('aria-pressed'), 'true');
    assert.equal(await page.locator('#preview-2').isVisible(), true);
    await page.locator('#project-3').hover();
    assert.equal(await page.locator('#preview-3').isVisible(), true);
    await page.locator('#project-1').focus();
    assert.equal(await page.locator('#preview-1').isVisible(), true);
  });
  await check('segmented control supports Arrow, Home, End and roving focus', async () => {
    await page.locator('#tab-context').focus();
    await page.keyboard.press('ArrowRight');
    assert.equal(await page.locator('#tab-structure').evaluate(el => el === document.activeElement), true);
    assert.equal(await page.locator('#panel-structure').isVisible(), true);
    await page.keyboard.press('End');
    assert.equal(await page.locator('#tab-behavior').getAttribute('aria-selected'), 'true');
    await page.keyboard.press('Home');
    assert.equal(await page.locator('#tab-context').getAttribute('aria-selected'), 'true');
    assert.equal(await page.locator('[role="tab"][tabindex="0"]').count(), 1);
    assert.equal(await page.locator('[role="tabpanel"]:visible').count(), 1);
  });
  await check('native disclosure opens with keyboard and preserves focus', async () => {
    await page.locator('#detail-summary').focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('#design-detail').getAttribute('open'), '');
    assert.equal(await page.locator('#detail-summary').evaluate(el => el === document.activeElement), true);
    await page.keyboard.press('Space');
    assert.equal(await page.locator('#design-detail').getAttribute('open'), null);
  });
  await check('direct tab fragment and later hash changes select the corresponding visible panel', async () => {
    await page.goto(pathToFileURL(join(directory, 'index.html')).href + '#panel-behavior');
    await page.reload();
    assert.equal(await page.locator('#panel-behavior').isVisible(), true);
    assert.equal(await page.locator('#tab-behavior').getAttribute('aria-selected'), 'true');
    await page.evaluate(() => { location.hash = '#panel-structure'; });
    await page.waitForFunction(() => document.querySelector('#tab-structure').getAttribute('aria-selected') === 'true');
    assert.equal(await page.locator('#panel-structure').isVisible(), true);
  });
  await check('local submission shows pending, success, failure and retry without losing focus', async () => {
    const button = page.locator('#submit-demo');
    await button.click();
    assert.equal(await button.getAttribute('aria-disabled'), 'true');
    assert.match(await page.locator('#submit-status').innerText(), /处理中/);
    await page.waitForFunction(() => document.querySelector('#submit-example').dataset.state === 'success');
    assert.equal(await button.evaluate(el => el === document.activeElement), true);
    await page.locator('#outcome-failure').check();
    await button.click();
    await page.waitForFunction(() => document.querySelector('#submit-example').dataset.state === 'error');
    assert.match(await page.locator('#submit-status').innerText(), /未完成/);
    await page.locator('#outcome-success').check();
    await button.click();
    await page.waitForFunction(() => document.querySelector('#submit-example').dataset.state === 'success');
  });
  await check('list supports successive hides, empty state and LIFO undo with focus recovery', async () => {
    for (const key of ['map', 'type', 'light']) await page.locator(`[data-hide="${key}"]`).click();
    assert.equal(await page.locator('#list-empty').isVisible(), true);
    assert.match(await page.locator('#undo-button').innerText(), /日光观察/);
    await page.locator('#undo-button').click();
    assert.equal(await page.locator('[data-item="light"]').isVisible(), true);
    assert.equal(await page.locator('[data-hide="light"]').evaluate(el => el === document.activeElement), true);
    await page.locator('#undo-button').click();
    await page.locator('#undo-button').click();
    assert.equal(await page.locator('#archive-list li:visible').count(), 3);
    assert.equal(await page.locator('#undo-button').isVisible(), false);
  });
  await check('reader progress and chapter navigation stay inside the reading region', async () => {
    await page.locator('#reader').scrollIntoViewIfNeeded();
    await page.locator('#reader').focus();
    await page.keyboard.press('PageDown');
    await page.waitForFunction(() => document.querySelector('#reader').scrollTop > 50);
    await page.locator('#chapter-nav').scrollIntoViewIfNeeded();
    const outerScroll = await page.evaluate(() => scrollY);
    await page.locator('#chapter-nav a').last().click();
    await page.waitForFunction(() => document.querySelector('#reader').scrollTop > 100);
    assert.equal(await page.locator('#chapter-3').evaluate(el => el === document.activeElement), true);
    assert.equal(await page.evaluate(() => scrollY), outerScroll);
    await page.locator('#reader').evaluate(el => { el.scrollTop = el.scrollHeight; });
    await page.waitForFunction(() => document.querySelector('#reading-progress').value === 100);
    assert.equal(await page.locator('#chapter-nav a').last().getAttribute('aria-current'), 'location');
  });
  await check('desktop has no horizontal overflow', async () => {
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  });
  await page.screenshot({ path: join(evidence, 'desktop.png'), fullPage: true });
  await context.close();

  const mobile = await open({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
  await check('390px touch layout: no overflow, tap preview, tap tabs, controls meet 44px height', async () => {
    const page = mobile.page;
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    await page.locator('#project-2').tap();
    assert.equal(await page.locator('#preview-2').isVisible(), true);
    await page.locator('#tab-behavior').tap();
    assert.equal(await page.locator('#panel-behavior').isVisible(), true);
    for (const selector of ['#project-1', '#tab-context', '#submit-demo', '[data-hide="map"]', '#detail-summary']) {
      assert.ok((await page.locator(selector).boundingBox()).height >= 44, selector);
    }
  });
  await mobile.page.screenshot({ path: join(evidence, 'mobile.png'), fullPage: true });
  await mobile.context.close();

  const reduced = await open({ reducedMotion: 'reduce' });
  await check('reduced motion disables indicator/disclosure transitions and busy animation', async () => {
    const page = reduced.page;
    await page.locator('#tab-structure').click();
    assert.equal(await page.locator('.segment-indicator').evaluate(el => getComputedStyle(el).transitionDuration), '0s');
    await page.locator('#submit-demo').click();
    assert.equal(await page.locator('.status-symbol').evaluate(el => getComputedStyle(el).animationName), 'none');
    assert.equal(await page.locator('.disclosure-symbol').evaluate(el => getComputedStyle(el).transitionDuration), '0s');
    await page.locator('#chapter-nav a').last().click();
    assert.ok(await page.locator('#reader').evaluate(el => el.scrollTop > 100));
  });
  await reduced.context.close();

  const fallback = await open({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  await check('without JavaScript all previews/panels/list items remain readable and disclosure works', async () => {
    const page = fallback.page;
    assert.equal(await page.locator('.preview-figure:visible').count(), 3);
    assert.equal(await page.locator('.segment-panel:visible').count(), 3);
    assert.equal(await page.locator('#archive-list li:visible').count(), 3);
    assert.equal(await page.locator('#submit-demo').isDisabled(), true);
    await page.locator('#detail-summary').click();
    assert.equal(await page.locator('#design-detail').getAttribute('open'), '');
    await page.locator('#chapter-nav a').last().click();
    assert.match(page.url(), /#chapter-3$/);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  });
  await fallback.context.close();
  await check('no runtime errors or outgoing network requests', async () => {
    assert.deepEqual(report.errors, []);
    assert.deepEqual(report.outboundRequests, []);
  });
} catch (error) {
  report.checks.push({ name: 'test setup and execution', passed: false, error: error.message });
} finally {
  await browser.close();
  report.passed = report.checks.every(item => item.passed);
  report.count = report.checks.length;
  await writeFile(join(evidence, 'results.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report, null, 2));
  if (!report.passed) process.exitCode = 1;
}
