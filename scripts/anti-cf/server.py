"""
Stealth Fetch API — local HTTP API wrapping nodriver to bypass Cloudflare
Usage: .venv13/bin/python scripts/anti-cf/server.py

Endpoints:
  GET  /fetch?url=https://example.com&wait_for=css_selector&extract=html|text|screenshot|all
  GET  /health
"""

import asyncio
import base64
import logging
from contextlib import asynccontextmanager
from typing import Optional

import nodriver as uc
from fastapi import FastAPI, Query, HTTPException
from fastapi.responses import JSONResponse
import uvicorn

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("stealth-fetch")

# Shared browser instance
_browser = None
_lock = asyncio.Lock()


async def get_browser():
    global _browser
    if _browser is None:
        async with _lock:
            if _browser is None:
                logger.info("Starting browser...")
                _browser = await uc.start(headless=True)
                logger.info("Browser started")
    return _browser


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield
    global _browser
    if _browser:
        _browser.stop()
        _browser = None


app = FastAPI(title="Stealth Fetch API", lifespan=lifespan)


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.get("/fetch")
async def fetch(
    url: str = Query(..., description="URL to fetch"),
    wait_for: Optional[str] = Query(None, description="CSS selector to wait for"),
    extract: str = Query("all", description="html, text, screenshot, or all"),
    timeout: int = Query(30, description="Timeout in seconds"),
):
    browser = await get_browser()

    try:
        page = await browser.get(url)

        # Wait for Cloudflare challenge to pass
        for i in range(timeout):
            await asyncio.sleep(1)
            try:
                title = await page.evaluate("document.title")
                body_text = await page.evaluate("document.body.innerText")
            except Exception:
                continue

            # Cloudflare challenge pages have these indicators
            is_challenge = (
                "just a moment" in title.lower()
                or "checking your browser" in body_text.lower()[:200]
                or "verify you are human" in body_text.lower()[:500]
            )
            if not is_challenge:
                logger.info(f"Cloudflare passed after {i+1}s for {url}")
                break
        else:
            logger.warning(f"Cloudflare challenge may not have resolved for {url}")

        # Wait for specific element if requested
        if wait_for:
            for _ in range(timeout):
                try:
                    el = await page.query_selector(wait_for)
                    if el:
                        break
                except Exception:
                    pass
                await asyncio.sleep(1)

        # Extra settle time
        await asyncio.sleep(1)

        result = {"url": page.url}

        if extract in ("html", "all"):
            result["html"] = await page.get_content()

        if extract in ("text", "all"):
            result["text"] = await page.evaluate("document.body.innerText")

        if extract in ("screenshot", "all"):
            screenshot_path = f"/tmp/stealth-fetch-{id(page)}.png"
            await page.save_screenshot(screenshot_path)
            with open(screenshot_path, "rb") as f:
                result["screenshot"] = base64.b64encode(f.read()).decode()

        # Close the tab
        await page.close()

        return JSONResponse(result)

    except Exception as e:
        logger.error(f"Error fetching {url}: {e}")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=3000)
