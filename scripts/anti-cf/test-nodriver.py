"""
nodriver test - bypasses Cloudflare anti-bot detection
Usage: .venv/bin/python scripts/anti-cf/test-nodriver.py [url]
"""
import sys
import asyncio
import nodriver as uc


async def main():
    url = sys.argv[1] if len(sys.argv) > 1 else "https://nowsecure.nl"

    browser = await uc.start()
    page = await browser.get(url)

    print(f"Navigating to {url} ...")
    print("Waiting for Cloudflare challenge...")

    # Wait up to 30s for challenge to resolve
    for i in range(30):
        await asyncio.sleep(1)
        # Check if we passed the challenge
        title = await page.evaluate("document.title")
        if "just a moment" not in title.lower() and "challenge" not in title.lower():
            print(f"Challenge passed after {i+1}s! Title: {title}")
            break
    else:
        title = await page.evaluate("document.title")
        print(f"Challenge may not have resolved. Title: {title}")

    # Take screenshot
    path = f"scripts/anti-cf/screenshot-nodriver-{int(asyncio.get_event_loop().time())}.png"
    await page.save_screenshot(path)
    print(f"Screenshot saved: {path}")

    # Keep open for inspection
    await asyncio.sleep(10)
    browser.stop()


if __name__ == "__main__":
    asyncio.run(main())
