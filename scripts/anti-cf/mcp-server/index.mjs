import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { chromium } from "playwright-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { z } from "zod";

chromium.use(StealthPlugin());

let browser = null;

async function getBrowser() {
  if (!browser || !browser.isConnected()) {
    browser = await chromium.launch({ headless: true });
  }
  return browser;
}

const server = new McpServer({
  name: "stealth-fetch",
  version: "1.0.0",
});

server.tool(
  "stealth_fetch",
  "Fetch a web page bypassing Cloudflare anti-bot protection. Returns HTML, text, or screenshot.",
  {
    url: z.string().describe("URL to fetch"),
    extract: z
      .enum(["html", "text", "screenshot", "all"])
      .default("text")
      .describe("What to extract: html, text, screenshot, or all"),
    wait_for: z
      .string()
      .optional()
      .describe("CSS selector to wait for before extracting"),
    timeout: z
      .number()
      .default(30)
      .describe("Max seconds to wait for Cloudflare challenge"),
  },
  async ({ url, extract, wait_for, timeout }) => {
    const b = await getBrowser();
    const context = await b.newContext();
    const page = await context.newPage();

    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: timeout * 1000 });

      // Wait for Cloudflare challenge to resolve
      for (let i = 0; i < timeout; i++) {
        await new Promise((r) => setTimeout(r, 1000));
        const title = await page.title();
        const bodyStart = await page.evaluate(
          () => document.body?.innerText?.slice(0, 500)?.toLowerCase() || ""
        );
        const isChallenge =
          title.toLowerCase().includes("just a moment") ||
          bodyStart.includes("checking your browser") ||
          bodyStart.includes("verify you are human");
        if (!isChallenge) break;
      }

      // Wait for specific element
      if (wait_for) {
        await page.waitForSelector(wait_for, { timeout: timeout * 1000 }).catch(() => {});
      }

      // Settle
      await new Promise((r) => setTimeout(r, 1000));

      const result = { url: page.url() };
      const content = [];

      if (extract === "html" || extract === "all") {
        result.html = await page.content();
        content.push({ type: "text", text: `[HTML]\n${result.html}` });
      }

      if (extract === "text" || extract === "all") {
        result.text = await page.evaluate(() => document.body.innerText);
        content.push({ type: "text", text: result.text });
      }

      if (extract === "screenshot" || extract === "all") {
        const buf = await page.screenshot({ fullPage: false });
        const b64 = buf.toString("base64");
        content.push({ type: "image", data: b64, mimeType: "image/png" });
      }

      await context.close();
      return { content };
    } catch (err) {
      await context.close();
      return {
        content: [{ type: "text", text: `Error: ${err.message}` }],
        isError: true,
      };
    }
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
