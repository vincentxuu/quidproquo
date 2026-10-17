# Review: 2026-10-17-bolting-history-ethics（zh + en）

Date: 2026-10-17. Groundlane MCP was not connected ("claude.ai Groundlane is not connected"), so sources were fetched with Jina reader / plain curl / Google Sheet CSV export, saved under the session scratchpad `agent-history/bolt13/`, and read in full. climbing.com and web.archive.org were blocked by Jina (403 abuse block), so the Rock and Ice "bolt wars" archive and the Climbing retro-bolting article were not used.

## post-verify

Report-only. Every claim was checked against a page fetched in full this session.

🟢 Confirmed
- 1972 Chouinard catalog essay "a word..." (Chouinard & Frost): piton-hole cracks, chocks instead of pitons, "Mad bolters... substitute for climbing", closing line "Remember the rock, the other climber — climb clean." Checked against the page 2–3 scans at frostworksclimbing.com.
- Doug Robinson's "The Whole Natural Art of Protection" is in the same catalog (Frostworks index + Wikipedia).
- Stannard coined "clean climbing" in 1971 and North America switched within about two years (Wikipedia Clean climbing; secondary, labelled as Wikipedia in the text).
- Sport climbing began with early-1980s French climbers and was controversial from the start; UK more reluctant (Wikipedia Sport climbing).
- Surveiller et punir 7a+, Jean Marc Troussier 1981, "one of the most photographed" (Planetmountain route page).
- Kurt Albert, 1975, red dot = climbed all free without aid (Planetmountain tribute).
- Action Directe: Güllich FA 14/09/1991 (Planetmountain list); first 9a (Wikipedia Sport climbing).
- BMC drilled equipment position: agreed by National Council 8 Feb 2014; open meetings; no vote at the first meeting; retro-bolting proposals publicised and agreed by consensus; 7 factors incl. first ascensionists' views; bolt-free norm areas named (BMC Bolting Policy docx linked from thebmc.co.uk/en/bolts).
- Ten Sleep 2019 open letter by three original developers; Access Fund stance quoted in the letter (Gripped). Text says "轉引".
- TOCC chronicle: 1978–1982 discovery; 1989-11-11 Long Dong Declaration published (event only); 1995 "中華民國" first rebolt; 2006 rebolt conference + Long Dong Day; 2014-07-19 titanium decision; 2015-07-24 Big Drum failure; 2016 first falcon closure; 2020-03-15 TOCC founded.
- TOCC LD page: Chinese 1978, English 1977; first written record Feb 1993 by 劉乃勳; Rebolting Team since 2010; falcon closures Feb–Jun with Keelung Wild Bird Society.
- TOCC Rebolting page: early rebolting by a few senior climbers; 2010 Dr. Chang project.
- TOCC route database (Google Sheet CSV, all 11 tabs): 16 entries "原為運攀路線…改為/保留為傳攀"; 2017/10/28 Wedding Route; 2018/03 Golden Valley routes; 2013 two top-rope routes bolted to sport; 福利社 2015/09/06 new P1/P2 Ti anchors by unknown persons, originally single pitch.
- TOCC 2021-10 position statement: "保護龍洞岩壁，減少不必要的鑽孔及破壞"; maintenance limited to three items; "絕對不同意私自鑽孔、打 bolt 的行為"; commissioned by the Northeast Coast administration; may remove questionable fixtures.
- TOCC 2021-05 essay (explicit personal opinion): ~600 routes / >2000 bolts; old bolts cannot be fully removed; each round takes worse positions; 304 bolts still self-installed.
- Mountain Project Taiwan history (community-written, labelled in text): mid-80s highway, 1987 martial law; 90s "many bolts had been placed"; 1998 guide 100+ routes; early 2000s Commissary Crack retro-bolt → "standard set to not add lead bolts to established trad routes".
- Ron's page: replaced bolts on a Kenting route in December 2000; original bolts were not stainless.
- CNA 2024-01-05: Banana Bay hooks; initial view not a banned spot; NT$1,500 / NT$3,000 under the National Park Act.
- LNT principle 4 "Leave What You Find"; Climber's Pact 12 items incl. the three quoted.

🟡 Unverifiable, left out of the article
- Year of the first bolt at Long Dong: no record. The article gives only the bounds (1978 to 1995).
- Text of the 1989 Long Dong Declaration: not online. The article states only the event.
- The 2000 Kenting ground-up rope-solo detail (from the community Kenting guide in the nobodyclimb repo): no public URL, and that guide asks readers to keep the crag low-profile. Only Ron's own public page is used.
- International "bolt wars" (Rock and Ice top-10 archive) and the Climbing.com retro-bolting article: blocked by the reader proxy, so not cited.
- The chronicle says the 2011 rebolt led to the project being set up "the following year" (2012); the Rebolting and LD pages say 2010. The article follows the two pages that say 2010.

This check covered only the N≈45 claims made in the text. It did not assess whether the article covers its topic completely.

## post-review

- Mechanical checks: `pnpm verify` is red only on `check:series-plan` because this review file was missing (fixed by writing this file) and on other agents' files. `check:references` for this slug: the only errors are the sibling `-en` slug `2026-10-17-taiwan-crags-rock-type-en` (not yet written). `check:links`: 19 external links, none broken; the 2 Planetmountain links return 403 to bots and open fine in the reader.
- Frontmatter: complete; type deep-dive; 5 tags, all existing; tldr has concrete nouns and numbers (BMC 2014, 16 entries, TOCC 2021); description ≠ tldr; series order 13 in both languages; glossary is 4 article-specific terms, frontmatter only.
- Structure follows the style reference: hook → eras → three kinds of dispute → Long Dong timeline table → present rules → everyday ethics → practice (4 `<details>`) → next steps → references. There is no nobodyclimb game category for order 13, so the practice section has no game link (by design).
- Coverage against the scope card: clean climbing ✓, Frankenjura/sport revolution ✓, 1978 discovery ✓, 1989 declaration (event only) ✓, 1995 rebolt ✓, Commissary Crack + consensus ✓, 2017–18 sport→trad ✓, TOCC opposition ✓, LNT ✓. The reader outcome ("explain why not to bolt at Long Dong yourself") is covered by the TOCC section and Q1/Q2.
- Topic ownership: material science (304/316/Ti, Big Drum) is handed off to order 3, and crag legality to order 12, rather than re-explained here.
- Inline links: every number and quote has an inline link at first mention.
- 🟢 Optional: a mermaid timeline could replace the table. I kept the table because it reads better on mobile.

## post-polish

- register-scan (after fixes): mid-length sentences 13 of about 140 sentences (<10%). Caveat paragraphs 4/83 (4%). One blockquote, the Chouinard/Frost closing line, kept because the original wording is the point. Number-dense paragraphs: 3 remain at exactly 4 numbers (Action Directe bullet, discovery-year note, Banana Bay fines). Each number there is load-bearing.
- Fixes applied: split the long Chouinard and Wikipedia sentences; split the Ten Sleep paragraph in two; turned the first-bolt bounds into a 2-item list; split the MP history sentence; turned the 16-entry sport→trad paragraph into a list; cut the BMC factor list down to a count plus the 4 relevant factors.
- Template patterns: 0 ledger hits; one "不是…" construction.
- Every section has a "今晚就能做的動作" with a concrete action.
- Taiwan reader position: the opening hook is set at Long Dong, and half the article is Taiwan evidence (TOCC, CNA).
- `pnpm check:tw`: 0 blocking, 0 to review.
