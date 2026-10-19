# Shared brief: climbing-travel bag catalog (research date 2026-10-19)

Goal: catalog CURRENT (on sale 2025–2026) bags from climbing/mountaineering/outdoor brands only. Exclude urban travel brands (Aer, Cotopaxi, Peak Design, Tortuga, Nomatic).

Brand pool: Black Diamond, Petzl, Mammut, Patagonia, Arc'teryx, Grivel, Edelrid, Ortovox, Mystery Ranch, Deuter, Blue Ice, Osprey, The North Face, Metolius, Fish/Yates, Wild Country, Climbing Technology, CAMP, Rab, Exped, Lowe Alpine, Millet, Salewa, Ocun, Beal, Simond (Decathlon), Hyperlite Mountain Gear, Gregory, Thule (only if outdoor-relevant).

Per model capture: brand | model | current version/year (if stated) | volume (L) | weight (official) | key features (category-specific) | official price (USD and/or EUR, say which store) | 1–2 retailer prices if easy (store + price + currency) | official page URL | independent reviews 2020+ (OutdoorGearLab, Switchback Travel, Climbing.com, GearJunkie, UKClimbing, Evening Sends, Gripped, Pack Hacker OK) with review date + URL | status: Current-verified (official page live & purchasable/listed) / Possibly discontinued (evidence) / Unverified.

## Tooling that WORKS in this session (verified 2026-10-19)
Groundlane MCP tools are NOT loaded in this session (ToolSearch finds none); Groundlane HTTP endpoint returns 401. So start at step 3:
- SEARCH (Keenable, keyless): 
  curl -s -m 30 -G 'https://api.keenable.ai/v1/search/public' --data-urlencode 'query=YOUR QUERY' -H 'X-Keenable-Title: quidproquo'
  (param is `query`, not `q`). Pipe through jq / python -I to extract title,url, and a short snippet. Returns full-ish snippets.
- FETCH (Jina reader, keyless, tier-5 fallback): curl -s -m 45 'https://r.jina.ai/<URL>' — pipe to grep/sed/head; never dump whole pages into context.
- SHOPIFY trick (BD, Blue Ice US, Mystery Ranch, Metolius, Hyperlite, many brand stores are Shopify): curl -s 'https://<store>/products/<handle>.json' or '.js' gives exact price, variants, availability, grams. Find handles via Keenable search or 'https://<store>/search/suggest.json?q=...&resources[type]=product'.
- If both fail for a page: ToolSearch "select:mcp__claude_ai_Exa__web_search_exa,mcp__claude_ai_Exa__web_fetch_exa" then use Exa. Last resort built-in WebFetch (load via ToolSearch "select:WebFetch").
- Record degradation per source in your notes (e.g. "fetched via Jina", "Exa").

Rules:
- Open every source you cite (official page + each review URL) at least via Jina/Exa; don't cite search snippets alone. If a review URL can't be opened after trying Jina + Exa, list it under Unverified with reasons.
- Use shell scripts to extract only needed bits (grep for 'L', 'g', 'oz', '$', '€', 'price', 'weight', 'discontinued', 'sold out'). Save raw fetches to your scratch subdir under /private/tmp/claude-501/-Users-xiaoxu-Projects-quidproquo/e958dc14-940d-4e17-ac59-bda5cbf29b72/scratchpad/<your-part>/ — never dump big pages into your context.
- Discontinued check: official page 404 / redirected to collection / "no longer available" / only on clearance at retailers → mark Possibly discontinued, and note the successor if any. Note popular models that ARE discontinued (very useful).
- Don't fabricate. Missing figure → "—" and say why in notes.
- Prices: don't convert currencies. Note sale vs MSRP.
- Write output ONLY to your assigned part file, as a markdown table (columns above; keep cells concise) + a "Notes / unverified / discontinued" section + "Tool degradation" line. English or Traditional Chinese fine (table headers English OK).
- Time budget: be efficient; aim for breadth (≥8 brands where products exist), 2–4 most relevant models per brand max.
- Final reply to parent: ≤6 lines: model count, brands covered, notable discontinued.
