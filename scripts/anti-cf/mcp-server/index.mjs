import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { chromium } from "playwright-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { z } from "zod";
import {
  Deadline,
  FetchError,
  Semaphore,
  assertSafeNetworkUrl,
  delay,
  publicError,
  truncateText,
  withinDeadline,
} from "./guards.mjs";
import { createSafeProxy } from "./safe-proxy.mjs";

chromium.use(StealthPlugin());

const MAX_CONCURRENCY = 4;
const MAX_QUEUE = 16;
const DEFAULT_MAX_CHARS = 100_000;
const limiter = new Semaphore(MAX_CONCURRENCY, MAX_QUEUE);

let browser = null;
let browserPromise = null;
let safeProxy = null;

async function getBrowser() {
  if (browser?.isConnected()) return browser;
  if (!browserPromise) {
    browserPromise = createSafeProxy()
      .then(async (proxy) => {
        safeProxy = proxy;
        try {
          const launched = await chromium.launch({
            headless: true,
            proxy: { server: proxy.url, bypass: "<-loopback>" },
            args: [
              "--disable-quic",
              "--force-webrtc-ip-handling-policy=disable_non_proxied_udp",
            ],
          });
          browser = launched;
          launched.once("disconnected", () => {
            if (browser === launched) browser = null;
            if (safeProxy === proxy) safeProxy = null;
            void proxy.close().catch(() => {});
          });
          return launched;
        } catch (error) {
          if (safeProxy === proxy) safeProxy = null;
          await proxy.close().catch(() => {});
          throw error;
        }
      })
      .finally(() => {
        browserPromise = null;
      });
  }
  return browserPromise;
}

async function closeBrowser() {
  const activeBrowser = browser;
  const activeProxy = safeProxy;
  browser = null;
  safeProxy = null;
  if (activeBrowser?.isConnected()) {
    await activeBrowser.close().catch(() => {});
  }
  await activeProxy?.close().catch(() => {});
}

function errorResult(error, requestId) {
  const safeError = publicError(error);
  console.error(`[stealth-fetch:${requestId}] ${safeError.code} at ${safeError.stage}`);
  return {
    content: [
      {
        type: "text",
        text: `Error [${safeError.code}] at ${safeError.stage}: ${safeError.message}`,
      },
    ],
    isError: true,
  };
}

async function challengePresent(page) {
  const [title, bodyStart] = await Promise.all([
    page.title(),
    page.evaluate(() => document.body?.innerText?.slice(0, 1_000)?.toLowerCase() ?? ""),
  ]);
  const lowerTitle = title.toLowerCase();
  return (
    lowerTitle.includes("just a moment") ||
    lowerTitle.includes("attention required") ||
    bodyStart.includes("checking your browser") ||
    bodyStart.includes("verify you are human") ||
    bodyStart.includes("performing security verification")
  );
}

const server = new McpServer({
  name: "stealth-fetch",
  version: "1.0.0",
});

server.registerTool(
  "stealth_fetch",
  {
    description:
      "Fetch a public HTTP(S) web page with a stealth browser. Returns bounded HTML, text, or a viewport screenshot.",
    inputSchema: {
      url: z
        .string()
        .refine((value) => {
          try {
            return ["http:", "https:"].includes(new URL(value).protocol);
          } catch {
            return false;
          }
        }, {
          message: "Only HTTP and HTTPS URLs are allowed",
        })
        .describe("Public HTTP(S) URL to fetch"),
      extract: z
        .enum(["html", "text", "screenshot", "all"])
        .default("text")
        .describe("What to extract: html, text, screenshot, or all"),
      wait_for: z
        .string()
        .trim()
        .min(1)
        .max(500)
        .optional()
        .describe("CSS selector that must appear before extraction"),
      timeout: z
        .number()
        .int()
        .min(1)
        .max(60)
        .default(30)
        .describe("Total request deadline in seconds (1-60)"),
      max_chars: z
        .number()
        .int()
        .min(1_000)
        .max(500_000)
        .default(DEFAULT_MAX_CHARS)
        .describe("Maximum characters returned for each text or HTML extraction"),
    },
    outputSchema: {
      requestedUrl: z.string(),
      finalUrl: z.string(),
      status: z.number().int().nullable(),
      title: z.string(),
      extract: z.enum(["html", "text", "screenshot", "all"]),
      challengeDetected: z.boolean(),
      challengeResolved: z.boolean(),
      waitForMatched: z.boolean().nullable(),
      blockedSubrequests: z.number().int().nonnegative(),
      elapsedMs: z.number().int().nonnegative(),
      text: z
        .object({ originalLength: z.number(), returnedLength: z.number(), truncated: z.boolean() })
        .optional(),
      html: z
        .object({ originalLength: z.number(), returnedLength: z.number(), truncated: z.boolean() })
        .optional(),
    },
    annotations: {
      readOnlyHint: true,
      openWorldHint: true,
    },
  },
  async ({ url, extract, wait_for, timeout, max_chars }, extra) => {
    const startedAt = performance.now();
    const deadline = new Deadline(timeout);
    const dnsCache = new Map();
    let context;
    let release;
    let stage = "validate";

    try {
      const requestedUrl = (
        await withinDeadline(
          assertSafeNetworkUrl(url, { cache: dnsCache }),
          deadline,
          extra.signal,
          stage
        )
      ).href;
      release = await limiter.acquire(deadline, extra.signal);

      stage = "launch";
      const activeBrowser = await withinDeadline(getBrowser(), deadline, extra.signal, stage);
      const contextPromise = activeBrowser.newContext({
          viewport: { width: 1280, height: 720 },
          serviceWorkers: "block",
        });
      try {
        context = await withinDeadline(contextPromise, deadline, extra.signal, stage);
      } catch (error) {
        void contextPromise.then((lateContext) => lateContext.close()).catch(() => {});
        throw error;
      }

      let blockedSubrequests = 0;
      let blockedMainRequest = null;
      await context.routeWebSocket("**/*", () => {
        blockedSubrequests += 1;
      });
      await context.route("**/*", async (route) => {
        const request = route.request();
        try {
          await withinDeadline(
            assertSafeNetworkUrl(request.url(), { cache: dnsCache }),
            deadline,
            extra.signal,
            "request"
          );
          if (
            (extract === "text" || extract === "html") &&
            ["image", "media", "font"].includes(request.resourceType())
          ) {
            await route.abort("blockedbyclient");
            return;
          }
          await route.continue();
        } catch (error) {
          blockedSubrequests += 1;
          if (request.isNavigationRequest() && request.frame() === request.frame().page().mainFrame()) {
            blockedMainRequest = publicError(error, "navigate");
          }
          await route.abort("blockedbyclient");
        }
      });

      stage = "navigate";
      const page = await withinDeadline(context.newPage(), deadline, extra.signal, stage);
      let navigationResponse;
      try {
        navigationResponse = await withinDeadline(
          page.goto(requestedUrl, {
            waitUntil: "domcontentloaded",
            timeout: deadline.remainingMs(stage),
          }),
          deadline,
          extra.signal,
          stage
        );
      } catch (error) {
        if (blockedMainRequest) throw blockedMainRequest;
        throw error;
      }

      stage = "challenge";
      let sawChallenge = await withinDeadline(
        challengePresent(page),
        deadline,
        extra.signal,
        stage
      );
      const challengeDetected = sawChallenge;
      while (sawChallenge) {
        try {
          await delay(500, deadline, extra.signal, stage);
          sawChallenge = await withinDeadline(
            challengePresent(page),
            deadline,
            extra.signal,
            stage
          );
        } catch (error) {
          if (error instanceof FetchError && error.code === "TIMEOUT") {
            throw new FetchError(
              "CHALLENGE_UNRESOLVED",
              stage,
              "The anti-bot challenge did not resolve before the request deadline"
            );
          }
          throw error;
        }
      }

      let waitForMatched = null;
      if (wait_for) {
        stage = "selector";
        try {
          await withinDeadline(
            page.evaluate((selector) => document.querySelector(selector), wait_for),
            deadline,
            extra.signal,
            stage
          );
        } catch (error) {
          if (error instanceof FetchError) throw error;
          throw new FetchError("INVALID_SELECTOR", stage, "The requested selector is invalid");
        }
        try {
          await withinDeadline(
            page.waitForSelector(wait_for, {
              state: "attached",
              timeout: deadline.remainingMs(stage),
            }),
            deadline,
            extra.signal,
            stage
          );
          waitForMatched = true;
        } catch (error) {
          if (error instanceof FetchError) throw error;
          throw new FetchError("WAIT_FOR_TIMEOUT", stage, "The requested selector did not appear");
        }
      }

      stage = "extract";
      deadline.remainingMs(stage);
      const content = [];
      const structuredContent = {
        requestedUrl,
        finalUrl: page.url(),
        status: navigationResponse?.status() ?? null,
        title: await withinDeadline(page.title(), deadline, extra.signal, stage),
        extract,
        challengeDetected,
        challengeResolved: true,
        waitForMatched,
        blockedSubrequests,
        elapsedMs: 0,
      };

      if (extract === "html" || extract === "all") {
        const html = truncateText(
          await withinDeadline(page.content(), deadline, extra.signal, stage),
          max_chars
        );
        structuredContent.html = {
          originalLength: html.originalLength,
          returnedLength: html.returnedLength,
          truncated: html.truncated,
        };
        content.push({ type: "text", text: `[HTML]\n${html.value}` });
      }

      if (extract === "text" || extract === "all") {
        const text = truncateText(
          await withinDeadline(
            page.evaluate(() => document.body?.innerText ?? ""),
            deadline,
            extra.signal,
            stage
          ),
          max_chars
        );
        structuredContent.text = {
          originalLength: text.originalLength,
          returnedLength: text.returnedLength,
          truncated: text.truncated,
        };
        content.push({ type: "text", text: text.value });
      }

      if (extract === "screenshot" || extract === "all") {
        const buffer = await withinDeadline(
          page.screenshot({ fullPage: false, timeout: deadline.remainingMs(stage) }),
          deadline,
          extra.signal,
          stage
        );
        content.push({ type: "image", data: buffer.toString("base64"), mimeType: "image/png" });
      }

      structuredContent.elapsedMs = Math.max(0, Math.round(performance.now() - startedAt));
      return { content, structuredContent };
    } catch (error) {
      if (!(error instanceof FetchError) && deadline.expiresAt <= performance.now()) {
        error = new FetchError("TIMEOUT", stage, "The request deadline was exceeded");
      }
      return errorResult(error, extra.requestId);
    } finally {
      try {
        if (context) {
          const closePromise = context.close();
          if (deadline.expiresAt > performance.now() && !extra.signal.aborted) {
            await withinDeadline(closePromise, deadline, extra.signal, "cleanup").catch(() => {});
          } else {
            void closePromise.catch(() => {});
          }
        }
      } finally {
        release?.();
      }
    }
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);

async function shutdown() {
  await closeBrowser();
  process.exitCode = 0;
}

process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);
