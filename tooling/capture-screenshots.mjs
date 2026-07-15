// Regenerates the USER_GUIDE screenshots the manual embeds (T-user-manual-
// screenshots / F2). Drives the frontend's dev-only capture gallery
// (`frontend/capture.html`, served by `vite dev`): for each documented view it
// navigates `?view=<name>`, waits for fonts, and screenshots the view node (or
// the portalled dialog) into USER_GUIDE/images/<name>.png.
//
// Determinism: the gallery forces light theme + reduced motion; here we pin the
// timezone, emulate prefers-reduced-motion, freeze `Date` to a fixed instant
// (so CalendarView's month grid + any "today" marker never drift), and render at
// deviceScaleFactor 2. Same inputs → byte-stable PNGs; the per-view snapshot
// tests are the drift trigger that signals a rerun.
//
// Usage (from tooling/, with the frontend dev server already running):
//   BASE=http://localhost:5173 node capture-screenshots.mjs
// or let it boot/tear down its own dev server via `npm run capture` (see below).
// Substrate-B shots (add-transaction, import-*, parser-picker) stay hand-kept —
// this script leaves any image it doesn't own untouched.

import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import puppeteer from 'puppeteer';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const IMAGES = path.resolve(HERE, '../USER_GUIDE/images');
const BASE = process.env.BASE ?? 'http://localhost:5173';

// Frozen "now" — a February 2026 instant so CalendarView's fixed-monthKey grid
// resolves with a stable (out-of-window ⇒ absent) today marker.
const FROZEN = new Date('2026-02-15T06:30:00Z').getTime();

function freezeDate(frozen) {
  const OriginalDate = Date;
  class FrozenDate extends OriginalDate {
    constructor(...args) {
      if (args.length === 0) super(frozen);
      else super(...args);
    }
    static now() {
      return frozen;
    }
  }
  // eslint-disable-next-line no-global-assign
  Date = FrozenDate;
}

async function settle(page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
  await new Promise((r) => setTimeout(r, 150));
}

async function capture(browser, entry) {
  const page = await browser.newPage();
  await page.emulateTimezone('Asia/Kolkata');
  await page.emulateMediaFeatures([
    { name: 'prefers-reduced-motion', value: 'reduce' },
    { name: 'prefers-color-scheme', value: 'light' },
  ]);
  await page.evaluateOnNewDocument(freezeDate, FROZEN);
  await page.setViewport({
    width: entry.width + 64,
    height: 1000,
    deviceScaleFactor: 2,
  });

  await page.goto(`${BASE}/capture.html?view=${entry.name}`, {
    waitUntil: 'networkidle0',
  });

  const out = path.join(IMAGES, `${entry.name}.png`);

  // A full standalone page (landing) — its below-the-fold showcase strip mounts
  // on a 600ms timer + lazy chunk, so wait past the timer, let the chunk settle,
  // then full-page screenshot.
  if (entry.chrome === 'page') {
    await new Promise((r) => setTimeout(r, 900));
    await page.waitForNetworkIdle({ idleTime: 500, timeout: 15_000 }).catch(() => {});
    await settle(page);
    await page.screenshot({ path: out, fullPage: true });
    await page.close();
    return out;
  }

  const selector =
    entry.chrome === 'dialog'
      ? '[role="dialog"]'
      : `[data-capture="${entry.name}"]`;
  await page.waitForSelector(selector, { visible: true, timeout: 15_000 });
  await settle(page);

  const handle = await page.$(selector);
  await handle.screenshot({ path: out });
  await page.close();
  return out;
}

async function main() {
  await mkdir(IMAGES, { recursive: true });
  const browser = await puppeteer.launch({
    headless: 'new',
    // Falls back to puppeteer's bundled Chromium; set PUPPETEER_EXECUTABLE_PATH
    // (e.g. /usr/bin/google-chrome) to reuse a system Chrome instead of the
    // ~130 MB download.
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    args: ['--no-sandbox', '--force-color-profile=srgb'],
  });
  try {
    const manifestPage = await browser.newPage();
    await manifestPage.goto(`${BASE}/capture.html`, {
      waitUntil: 'networkidle0',
    });
    const views = await manifestPage.evaluate(() => window.__CAPTURE_VIEWS__);
    await manifestPage.close();
    if (!Array.isArray(views) || views.length === 0) {
      throw new Error('capture manifest empty — is the gallery built?');
    }

    for (const entry of views) {
      const out = await capture(browser, entry);
      console.log(`  ${entry.name} → ${path.relative(process.cwd(), out)}`);
    }

    console.log(`Captured ${views.length} screenshots.`);
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
