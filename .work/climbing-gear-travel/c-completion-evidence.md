# Shoes / harness / helmet and belay hardware evidence

Observed 2026-10-19. Ownership: four order5/6 articles, their two reviews, and c-* research files. No field testing, shop fitting, purchased items, stock reservation, or transactions. No commit/push/deploy.

## Research route and completeness

Groundlane complete callable inventory initially absent; parent established local HTTP service at 18087. Used provided client and schema, then a c- copy fixing SSE keepalive parsing before parent shared fix. Existing .env loaded only in process memory; credentials never printed.

Groundlane web_search used only for discovery. For facts used full selected `main` web_fetch with status200 and truncated:false. Initial full-page Petzl requests were truncated at 100000 due to enormous navigation; repeated selected main requests succeeded, and only those support article specifications. Original search/failed/truncated JSON retained alongside latest successful main captures. Retail REI requests failed bounded Groundlane extraction; used Exa fetch as explicitly separate fallback. These are not Groundlane success evidence. No retired tools/browser used.

PDF document_parse Groundlane bounded requests returned OUTPUT_LIMIT; used Exa manufacturer PDFs. Read complete EN sections, not complete multilingual PDFs or visual diagrams. Exa maxCharacters 130000/100000 captures multilingual text to cap; did not claim all languages complete. Text extraction cannot independently validate every diagram. EN sections stored separately as below.

## Groundlane complete main sources and observed facts

Each `c-fetch-<name>.json` stores envelope/status/truncated metadata; corresponding `c-page-<name>.md` contains returned main content.

- shoe-w: La Sportiva Tarantulace Women's, current official US product: leather/microfiber, laces, 5mm FriXion RS, US$99. Men's attempted path404 discarded. No sizing formula inferred.
- helix-w: SCARPA Women's F25 page: flat slight asymmetry, laces, 4mm XS Edge; $90.30 sale / $129 original. No assertion that this older inventory equals current REI new-fit model.
- tc: current official https://www.lasportivausa.com/products/tc-pro, `c-fetch-tc.json`, status200/not truncated. US$239; item ZFCS026, flat medium asymmetry, midheight cuff/malleolus protection, crack/technical edging/all-day support, 4mm XS Edge. Manufacturer own scales sensitivity1/5, rigidity5/5. Higher price and lower sensitivity are concrete selection tradeoffs, not tested comparative performance. No ankle-sprain prevention claim.
- momentum: current Men's Momentum, $74.95,350g, four gear loops, trakFIT legs. Women's REI price matches but sizing/body proportions not assumed interchangeable.
- adjama: current ADJAMA,$104.95, five loops,adjustable legs,weights370/385/410/435g by size. Product page links a PDF titled FOCUS, not ADJAMA. Article carefully identifies cited sit-harness document as FOCUS; does not claim its model-specific tying diagrams are ADJAMA's. Common controlled suspension testing principle attributed to Petzl sit-harness instructions. Reader directed to own model manual.
- boreo: $74.95,ABS/EPP/EPS,S/M300g M/L330g.
- half-dome: $69.95,ABS/EPS,340/356g. Do not mix with related lighter models shown later on page.
- scarpa-fit: measuring tools/conversion, not a universal downsize formula.
- grigri: current $104.95,175g,dynamic single8.5–11 optimized8.9–10.5,brake hand always.
- neox: current $154.95,235g,same single rope range,integrated wheel for lead slack feeding,brake hand always. Arithmetic difference60g/$50. No firsthand smoothness ranking.
- reverso: current $49.95,57g,single8.5–11 half7.1–9.2 twin6.9–9.2.
- atc: $54.95,8.1–11mm,80g (c-page-atc.md line95). Current manufacturer page links M10798_D_ATC-Guide_IS-WEB.pdf. Do not substitute Alpine Guide range.
- attache: M038AA,$25.95,58g,TypeH,pear screw-lock/round stock basket,manufacturer names VERSO/REVERSO/Munter uses. Does not generalize HMS to GRIGRI/NEOX.
- djinn: current12/17/25cm,12cm107g,$32.95 selected12cm. Concrete version conflict with REI11cm103g explicitly stated; no mixed weight total.
- clip: complete official quickdraw positioning text. Retainer placement model-specific; no blanket claim all climbing slings require STRING.

## Exa fetch fallback and English safety sections

- `c-exa-retailer-0.md`: original Exa fetch batch output (not search snippets); contains full product-description/specification sections before review text hits3000/page cap. Supports REI Helix$139/new forefoot/3.5mm, MomentumWomen's$74.95,BOREO$74.95,ATC$54.95/80g,ATTACHE$25.95,DJINN17cm$33.95/25cm$34.95 and11cm103g version mismatch. No claims of complete customer review history. NEOX returned Akamai page; discarded, no REI NEOX price claim. REI returned swap of ATTACHE minor/open strength fields; article avoids copying and uses manufacturer for safety.
- `c-exa-manual-0-0.md`: FOCUS EN section, controlled adjustment and suspension test in safe environment; inspection, distinct parts, tie-in/belay instructions. Not falsely identified as ADJAMA manual.
- `c-exa-boreo-english.md`: BOREO EN section, proper fit, change size/model if cannot adjust; major impact can reduce protection invisibly; retire after major impact; do not crush pack/heat/unauthorized adhesives.
- `c-exa-manual-0-2.md`: REVERSO EN section. Normal mode active braking; two strands similar diameter/condition/texture;carabiner locking;anchor assisted braking still brake hand;thin crossed ropes can defeat function;one follower loading can disable for other unless parallel;release technique insufficient for long lower;backup for rappel. Article omits incomplete operational recipe and directs training.
- `c-exa-atc-english.md`: complete EN section of manufacturer-linked M10798_D.8.1–11 range comes from product page, not invented from text. EN instructions require TypeH, brake hand always, two follower loading caveat, and rescue planning/qualified training. Diagram not independently reviewed.
- `c-exa-hardware-0-0.md`: manufacturer climbing-carabiner/sling notice includes EN section: keep anchor/rope carabiner roles constant because anchor notches can harm rope;main axis closed gate;inspection and positioning. Stored large text includes other languages; relevant EN complete.
- `c-exa-hardware-0-1.md`: Petzl GRIGRI/NEOX carabiner choice article complete text:rotation risks,D-shape benefits,pear tendency to rotate,lock checks/partner checks. Direct Exa fetch; not Groundlane evidence.

All prices are observed listed USD; no local-tax/freight/selected-size stock or guaranteed delivery claims. All performance suitability is reasoned from specified design, labeled candidate fitting/selection; no invented usage or review statistics.

## Gates and scope

`c-targeted-gates.log`: targeted references/quality/TW/process and register/phrase scans; all exit0. Initial references warning from only Latin coverage token HMS in heading is resolved by correct ATTACHE HMS reference label; final rerun clean. Chinese count before references ~2190 order5,~2020 order6 (tables/Latin not counted). No full-site verify or Astro/browser gate run by this worker; parent owns full integration gates.
