---
title: "{{Crag name}}: {{rock + style + place}}, {{the one tradeoff that changes the decision}} | {{Country}} Climbing Crags"
date: YYYY-MM-DD
category: climbing
type: guide
tags: [climbing, {{country-slug}}, outdoor-climbing, {{sport-climbing|trad-climbing|bouldering}}, {{multi-pitch?}}, {{city-or-region}}]
lang: en
series:
  name: "{{Country}} Climbing Crags"
  order: N
tldr: "{{Sentence 1: the crag itself — rock, style, signature routes and the skills they really need. Sentence 2: the one thing that most changes the trip (access / closure / season), written as an action.}}"
description: "A {{crag name}} climbing guide covering {{seasons}}, {{transport hub}} access, {{rules}}, {{signature routes}}, and {{source differences or special caveats}}."
draft: true
---

<!--
範本來源：src/content/posts/climbing/2026-10-21-korea-crag-insubong-en.md（仁壽峰英文版）。
先讀 ../references/crag-guide-contract.md；H2／H3 名稱、表格欄位、換算與來源分級以規格為準。
英文版通常由中文版翻譯（post-translate），frontmatter 的 date、series.order、tags 與中文版相同；事實、數字、來源連結不得和中文版不一致。
{{ }} 是待填處；發佈前全部刪掉，連同這段註解。
-->

> 🌏 [繁體中文版](/posts/climbing/YYYY-MM-DD-{{country}}-crag-{{slug}})

{{Opening 1–2 sentences: what you see on (or on the way to) the wall, leading into what makes the place distinctive. End by naming the common misjudgment (e.g. "A subway connection to the foot of the mountain does not make it an introductory outdoor lead venue.").}}

This guide helps you decide whether {{crag}} suits {{your team / level}}, {{when to go}}, {{how to approach without a car}}, and how {{signature routes}} compare.

## What kind of crag

{{Names: local script in bold, common English spellings; separate it from easily confused peaks / trails, and say which name to use for navigation at each stage.}}

{{Rock and climbing style: cracks / slabs / chimneys / face; protection (gear or bolts). Correct the misconception that leads to the wrong rack (e.g. "A few visible bolts do not make a route suitable for a rack of quickdraws alone.").}}

{{Size: route counts with source and year; list differing counts side by side and explain that coverage differs, so one cannot be inferred from the other.}}

{{Appeal and cost: why it is worth the trip, what you must handle yourself. One bold sentence on the real skill threshold (e.g. **Being able to climb 5.8 is different from leading a team through a 5.8 multipitch route.**), then concrete advice for a first visit.}}

## When to go

{{Best months and why, with source; say if the source is undated or historical, and what still needs checking (e.g. that year's thaw restrictions).}}

{{Aspect and sun: main faces, when they get sun, what that means on cold vs warm days; changing faces also changes approach and descent.}}

{{Winter / wet season effects on the approach (ice, river crossings), linking the managing authority's page.}}

{{Crowds and timing: weekend queues, turnaround time. Omit if there is no reliable source.}}

## Getting there

### Public transport

{{Operator / official page "checked in Month YYYY": which line, which station, which exit; the last leg by taxi or bus, with the local-script destination in bold to show the driver.}}

{{Separate the distances: which two points an official "N-minute walk" connects; the trailhead-to-cliff approach with its source. Do not present a summit itinerary as the approach time.}}

### Driving

{{Local-script name to put in the navigation app; warn about arriving at the wrong entrance when there are several.}}

### Parking

{{Capacity and conditions if an official source gives them; otherwise state plainly that the official page checked does not, and give the alternative (do not assume temple or private land is open to climbers).}}

## Rules before you go

**{{First rule: check notices for the named cliff and approach trail.}}** {{Link the control page; state the scope of any restriction precisely. A partial closure is not a blanket closure, and a park being partly open does not prove your cliff is open.}}

{{Seasonal bans (thaw, nesting birds): source and year; say whether it was that year's arrangement or a standing rule.}}

**{{Second rule: permits / declaration process.}}** {{If the generic page is insufficient, say so, cite the most recent evidence found, and list whom to ask and what (including how foreign visitors comply).}}

{{Fixed hardware: what the old guide and the newer topo each say, with their years; neither guarantees the state on the day. Bring protection for the route and settle the descent before leaving the ground.}}

For an emergency, call **{{number}}**; {{rescue authority's own page, and whether it serves foreigners}}. {{Save local-script crag and route names and offline maps.}} Ask your own insurer whether **{{trad / multipitch / bouldering}}, search and rescue, medical treatment and repatriation** are covered.

## Routes by level

{{NOTE_EN: paste the fixed conversion note from scripts/climbing-grade-convert.mjs verbatim.}}

{{Inclusion rule (required when the grade tables mix sources): one bold sentence on what these tables include and leave out (e.g. the beginner band takes guide + database lines, intermediate and up only lines both sources agree on); if Notes start with a marker such as "2025 ✓ / —", say what it means and what it does not.}}

{{Optional grading note: if the sources use YDS / UIAA / E grades, say the original is retained and not reverse-converted; A0–A2 denote aid; lengths and pitch counts come from which edition and are not descent instructions.}}

{{If there are route videos, one paragraph: videos sit in the table's Videos column, and a thumbnail opens that route's list; name each place where a clip differs from the table (a variation, a different pitch count, a solo or other demo not to copy). End with: a video's grade and route name describe that clip only; choose routes from the table's sources.}}

<!--
路線影片（條件段：有來源就必做；查過沒有才省略，並在審稿紀錄 `## 模板覆蓋` 寫查詢與日期。查找範圍見 crag-guide-contract.md「條件段」）：
- 影片資料寫在 src/data/climbing-videos.ts 的 videoGalleries.<岩場 key>，中英文共用一份；英文版只換 fence 的 lang。routeEn 開頭要和英文表格第一欄的路線名一致。
- 表格正下方緊接 layout: routes 區塊，影片欄（Videos）由外掛自動加，不要在 Markdown 表格手寫。不要加 ids：外掛用 routeEn 在第一個「 5.」之前的字串比對表格第一欄；ids 會去重，同一支影片涵蓋兩條路線時第二條會掛不到。routeEn 寫成「Route name 5.xx (original grade, sector)」，法國級數的岩場也要帶 YDS。改完 `pnpm build` 確認每支影片都掛上列：
  ```video-gallery
  key: {{crag key}}
  lang: en
  layout: routes
  ```
- 欄寬依表頭文字決定，表頭照寫（Route / Grade / YDS / Length / pitches / Sector / Notes），最後一欄必須是 Notes。Notes 控制在兩三句，長內容放到表格前後的段落。
- 接近 POV、下降等非單一路線的影片放 <details><summary>Watch the {{what}}</summary> … </details>，不加 layout。
-->

### Beginner: up to 6a (YDS 5.10a and below)

{{One paragraph: which two routes to compare first and how they differ (length, team speed); "Beginner" is a grade band, not a recommendation for a first outdoor lead.}}

| Route | Grade | YDS | Length / pitches | Sector | Notes |
| --- | --- | --- | --- | --- | --- |
| {{Route name / local script}} | {{original grade, "(hardest)" or per pitch for multipitch}} | {{fill with --write}} | {{length / pitches, and which edition}} | {{sector; "Locate using guide" if unsure}} | {{source; list both when sources disagree, and note link-up differences}} |

### Intermediate: 6a+ to 6c+ (YDS 5.10b–5.11c)

{{One paragraph: what characterizes this band here; when sources differ by a grade, plan for the harder one; plan short single-pitch lines separately from a full-day objective.}}

| Route | Grade | YDS | Length / pitches | Sector | Notes |
| --- | --- | --- | --- | --- | --- |
| {{}} | {{}} | {{}} | {{}} | {{}} | {{}} |

### Advanced: 7a to 7c+ (YDS 5.11d–5.13a)

{{One paragraph: what routes in this band look like; say so when a route includes aid or rests on a single source.}}

| Route | Grade | YDS | Length / pitches | Sector | Notes |
| --- | --- | --- | --- | --- | --- |
| {{}} | {{}} | {{}} | {{}} | {{}} | {{}} |

### Expert: 8a and up (YDS 5.13b and up)

{{Table as above if verifiable routes exist. Otherwise: "The {{sources}} used here do not provide a verified route in this band." Do not fill it with names from other crags or unverified entries; point readers to other crags in the series.}}

### Classic routes: {{faces or areas}}

<!-- 條件段：有來源就必做，查過沒有才省略並在審稿紀錄寫查詢與日期。社群公認的經典線不全符合分級表的來源規則時，獨立成這一節，不混進分級表。 -->

The grade tables above choose routes by difficulty. This section adds {{N}} lines that {{local}} climbers commonly treat as {{crag}} classics. **They do not all meet the {{which}} source rule used above**, so they sit here rather than in those tables. {{Which topo / guide each group follows, and which sources check lengths, pitch counts and first-ascent notes.}} Notes give the source and any version differences; a single source is not presented as settled fact.

Classic does not mean easy. {{Name the grade spread of these classics.}} Choose by your trad, multipitch and descent skills, not by the overall grade alone.

#### {{Face A}} classics

{{One or two sentences: which source sets the grade, and which edition the lengths and pitch counts describe.}}

| Route | Grade | YDS | Length / pitches | Notes |
| --- | --- | --- | --- | --- |
| {{Route name / local script}} | {{}} | {{}} | {{}} | {{topo number; first-ascent year and party; signature pitch; source differences}} |

{{If there are videos, follow with a layout: routes fence as above.}}

#### {{Face B}} classics

{{One or two sentences: why this group is separate (e.g. not on the East Face topo; mainly from which report), and that it is not because of a shared grade band.}}

| Route | Grade | YDS | Length / pitches | Notes |
| --- | --- | --- | --- | --- |
| {{}} | {{}} | {{}} | {{}} | {{}} |

### Route logs online

<!-- 條件段：有來源就必做，至少打開 5 個候選；只收實際打開讀過的頁面，沒讀到的不列。查過沒有才省略並在審稿紀錄寫查詢與日期。 -->

Beyond the guides, the topo and the magazine reports, {{local}} climbers' {{blogs / forums}} keep a batch of firsthand route logs. {{The most common entry point (author, year, link) and its reposts or same-family versions.}} These are versions of one compilation, not independent confirmation. The table below lists logs worth reading by route; they add approach details, timing and on-the-ground feel, while grades and pitch counts still follow the tables above.

| Route | Logs you can read | What each log adds |
| --- | --- | --- |
| {{Route name / local script}} | {{author or site}}'s [{{year}} log]({{full URL}}) | {{What it adds: pitch-by-pitch beta, real times, queues, rack, lessons from going off route; if its grade or pitch count differs from the tables, give both and say it is that log's count}} |

<!-- 傳攀（UIAA／E 級）與抱石的表格欄位、抱石的 Font 分級 H3，見規格「依程度挑路線」。 -->

## Where to look things up

- **Current management information:** {{control / permit pages}}, and what each covers.
- **Transport and hiking approach:** {{operator / official tourism / trail pages}}, and which points are easily confused.
- {{Online databases: theCrag / 27crags / Mountain Project etc., one line on what each is good for.}}
- **Guidebooks:** Grades and route counts here come mainly from online databases; the guidebook is the authority. {{If this article checked a book's tables directly, say so and keep its differences from newer topos.}}
  - [*{{Title}}*]({{listing URL}}), {{authors}}, {{publisher}}, {{edition and year}}. {{Language}}; {{coverage; pages for this crag}}. {{What it is not a source for (e.g. current transport and access rules).}}
  - {{Newer topo / digital guide: producer, date, faces covered, licence. Say so plainly if there has been no new print edition for years.}}

## References

- [{{Source: page name}}]({{full URL}})
- [Mountain Project: International climbing grade comparison](https://www.mountainproject.com/international-climbing-grades)
