/**
 * Playwright-extra + Stealth plugin test
 * Usage: node scripts/anti-cf/test-stealth.mjs [url]
 */
import { chromium } from "playwright-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

chromium.use(StealthPlugin());

const url = process.argv[2] || "https://nowsecure.nl";

const browser = await chromium.launch({ headless: false });
const context = await browser.newContext();
const page = await context.newPage();

console.log(`Navigating to ${url} ...`);
await page.goto(url, { waitUntil: "domcontentloaded" });

// Wait for Cloudflare challenge to resolve (up to 30s)
console.log("Waiting for Cloudflare challenge...");
try {
  await page.waitForURL((u) => !u.href.includes("challenge"), {
    timeout: 30_000,
  });
  console.log("Challenge passed! Current URL:", page.url());
} catch {
  console.log("Challenge did not auto-resolve. Current URL:", page.url());
}

// Take screenshot
const path = `scripts/anti-cf/screenshot-stealth-${Date.now()}.png`;
await page.screenshot({ path });
console.log(`Screenshot saved: ${path}`);

// Keep browser open for 10s to inspect
await new Promise((r) => setTimeout(r, 10_000));
await browser.close();
