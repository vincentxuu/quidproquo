import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9,zh-TW;q=0.8,zh;q=0.7",
  "Accept-Encoding": "gzip, deflate, br",
  "Cache-Control": "no-cache",
  "Sec-Ch-Ua": '"Chromium";v="131", "Not_A Brand";v="24"',
  "Sec-Ch-Ua-Mobile": "?0",
  "Sec-Ch-Ua-Platform": '"macOS"',
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "none",
  "Sec-Fetch-User": "?1",
  "Upgrade-Insecure-Requests": "1",
};

const server = new McpServer({
  name: "web-fetch",
  version: "1.0.0",
});

server.tool(
  "fetch_page",
  "Fetch a web page with browser-like headers to avoid 403 errors. Returns the page content as text.",
  {
    url: z.string().url().describe("The URL to fetch"),
    max_length: z
      .number()
      .int()
      .positive()
      .optional()
      .default(50000)
      .describe("Maximum response length in characters (default: 50000)"),
  },
  async ({ url, max_length }) => {
    try {
      const res = await fetch(url, {
        headers: BROWSER_HEADERS,
        redirect: "follow",
        signal: AbortSignal.timeout(15000),
      });

      if (!res.ok) {
        return {
          content: [
            {
              type: "text",
              text: `HTTP ${res.status} ${res.statusText} for ${url}`,
            },
          ],
          isError: true,
        };
      }

      const contentType = res.headers.get("content-type") || "";
      let body = await res.text();

      // Strip HTML tags before truncating so the limit applies to text content
      if (contentType.includes("text/html")) {
        body = body.replace(/<script[\s\S]*?<\/script>/gi, "");
        body = body.replace(/<style[\s\S]*?<\/style>/gi, "");
        body = body.replace(/<[^>]+>/g, " ");
        body = body.replace(/\s+/g, " ").trim();
      }

      if (body.length > max_length) {
        body = body.slice(0, max_length) + "\n\n[...truncated]";
      }

      return {
        content: [{ type: "text", text: body }],
      };
    } catch (err) {
      return {
        content: [
          {
            type: "text",
            text: err.name === "AbortError"
              ? `Request to ${url} timed out.`
              : `Fetch error for ${url}: ${err.message}`,
          },
        ],
        isError: true,
      };
    }
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
