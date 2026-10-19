# Care7 live official replacement links

2026-10-19. Three old Petzl News URLs must be replaced in both languages, body and references. No article edited by this worker.

## Ready-to-use replacements

### Harness

Replace old https://www.petzl.com/US/en/Sport/News/2018-1-24/How-to-inspect-your-climbing-harness

with **Petzl sport-harness PPE inspection procedure**:

https://www.petzl.com/on/demandware.static/-/Sites-petzl-master-catalog/default/dwc708b57b/media/product/verif-EPI-harnais-SPORT-procedure-EN_068bK00000fXc8ZQAS.pdf

Live HEAD status200 application/pdf, no redirect. Current ADJAMA product PPEInspection download points here (c-page-adjama.md). Exa parsed body independently read: routine checks plus competent detailed inspection12months/afterexceptionalevent; use intensity may require more frequent inspection; quarantine questionabledegradation; knownhistory; inspect straps hiddenbybuckles/protectors; inspect safety stitching bothsides; tiein protectivewebbing and buckles. These support current article's same claims without relying on old news.

Suggested labels: 中文「Petzl吊帶PPE檢查程序」；English「Petzl sport-harness PPE inspection procedure」.

### Rope

Replace old https://www.petzl.com/INT/en/Professional/News/2020-3-6/How-To-Inspect-Your-Rope

with **Petzl ropes PPE inspection procedure**:

https://www.petzl.com/on/demandware.static/-/Sites-petzl-master-catalog/default/dwf2c4f0de/media/product/verif-EPI-cordes-procedure-EN_068bK00000uzxirQAA.pdf

Live HEAD status200 application/pdf, no redirect. Current VOLTA product GL status200 complete main body points here under PPEInspection (rope-price-care-current-volta.json). Exa parsed body read: full-length sheath check cuts/burns/frayed/fuzzy/chemicals; full-length tactile core check hardspots/swelling/soft/crushedareas; history/serialnumber/lifespan; quarantinequestionabledegradation; detailedinspection12months/afterevent. Supports same rope-inspection paragraph/table claims. Do not add unrelated splice details from PDF to dynamic-rope article.

Suggested labels: 中文「Petzl繩索PPE檢查程序」；English「Petzl ropes PPE inspection procedure」.

### Helmet

Replace old https://www.petzl.com/US/en/Sport/News/2019-2-14/How-to-inspect-your-helmet

with **Petzl helmets PPE inspection procedure**:

https://www.petzl.com/on/demandware.static/-/Sites-petzl-master-catalog/default/dw09aba595/media/product/verif-EPI-casques-SPORT-procedure-EN_068Tx00000PpQ29IAF.pdf

Live HEAD status200 application/pdf, no redirect. Current BOREO product PPEInspection download points here (c-page-boreo.md). Exa parsed body identifies HELMETS(221225) and supports shellinside/outside, foamdeformation/cracks/missingparts, removecomfortparts to seehiddenareas, **do not remove foam attached to shell**, cradle/headbandattachments and lifetime/history. Covers article's liner/comfortparts distinction and inspection table.

Suggested labels: 中文「Petzl頭盔PPE檢查程序」；English「Petzl helmets PPE inspection procedure」.

## Evidence boundaries

- Groundlane-first search used and saved rope-price-care-current-{harness,rope,helmet}-search.json. Search still returned old NewsURLs, so those were not accepted as live repairs.
- Product-derived links avoid guessing canonical News URLs. GL live VOLTA read succeeded; existing same-turn ADJAMA/BOREOGL product snapshots contain their exact download links.
- GL web_fetch with10MB maxBytes and GLdocument_parse url/cacheMode refresh both failed deployment OUTPUT_LIMIT for these2.5–2.7MB PDFs. Artifacts rope-price-care-current-*-pdf-full.json and *-parse.json record failures. These are not successful-read proof.
- After bounded GL failure, Exa public official-PDF body fetch was used; readable text saved rope-price-care-current-exa-pdfs.json. Extract is bounded/truncated, but all article claims above were in the returned text; not described as entire-PDF review.
- **Live reachability is separately established by direct public HTTP HEAD**, not Exa cached text: rope-price-care-current-head.json records all3status200/currentfinalURL/application/pdf. HEAD does not claim a full content read. This is the current-URL proof the old Exa News snapshots lacked.
- No secret/auth/private content, login, or retired fetch/browser tool used. Main agent should replace URLs and labels then run its final gates/link inventory.
