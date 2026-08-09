# progress.txt 歸檔

`progress.txt` 是 working memory，不是日誌：完成、過期或不再需要每個 session 都看到的條目移到這裡（最新的段落放最上面）。協定見 `docs/governance/operating-charter.md`。

## 2026-08-06 歸檔

### Recently completed（原 progress.txt 條目）

- 2026-07-25: SEO/AEO batch 1. Platform: content schema gained optional
  `updated` + `faq`; BlogPosting now emits dateModified/inLanguage/
  articleSection/wordCount; FAQPage schema + visible `<details>` FAQ section;
  title tag drops brand suffix past ~60 display cols; generated /llms.txt.
  Content: product-builder post retargeted from the "product builder" head
  term to long-tail (vs PM / how to transition), FAQ added, and de-orphaned
  with 6 two-way internal links. Batch 2 (original first-hand material) still
  needs input from the user.
- 2026-07-06: governance framework established — operating charter
  (docs/governance/operating-charter.md), unified `pnpm verify` gate
  (pre-commit + Stop hook + preview CI), skills mirror sync
  (`pnpm check:skills-sync` / `pnpm skills:sync`), escalation queue,
  progress.txt protocol + archive. Skills are edited ONLY in
  .agents/skills/, then `pnpm skills:sync`.

## 2026-07-06 歸檔

### Recently completed（原 progress.txt 條目）

- Stock screening Rounds 1-4 complete: 61 new stocks evaluated against four-criteria framework (AI供應鏈拓撲圖 sections A/B/C). Results in `.agents/skills/tw-stock-screen/references/four-criteria.md`.
- 13 new AI posts published (2026-06-04 agent series + arXiv paper guide).
- Glossary expanded: 13 site-wide terms (terms.ts now 113) + frontmatter glossary on 7 new posts; density check shows median 11 terms/post, next signal is monthly glossary_lookup_stats review.
- Internal broken post references fixed and enforced in CI.
- Pre-commit hook added for `pnpm lint` and `pnpm check:references`（2026-07-06 起改為 `pnpm verify`）.
- Root `CLAUDE.md` added.
- 404 page and English search page added.
- Crawler chunk size reduced to 1500 chars.
- Post evaluator added for frontmatter, internal links, tags, and heading structure.
- RAG search tool descriptions clarified, including abstract-vs-post-vs-doc usage.

### agent-* 專案狀態快照（code complete，細節保存於此）

- agent-foundation: complete — 10 cross-cutting concerns centralized, settings tables reconciled (migration 0010 applied 2026-05-17, 0010b gated on soak), schema audit shipped in docs/schema-audit.md; ready for agent-os Phase 1
- agent-evidence: complete — store + extraction + reputation + conflict + verification shipped; deep-research dogfooded with citation_required+min_sources=2; R2 blob offload wired (AGENT_EVIDENCE_R2_BLOBS flag); AGENT_EVIDENCE_ENABLED=false default; archived 2026-05-23. Production deployment deferred: run `wrangler r2 bucket create quidproquo-agent-evidence` before enabling.
- agent-flow: Phase 5 code complete — DSL+runtime+durable+presets+deep-research-loop shipped; AgentFlowWorkflow class created; parity tests added; approval runbook documented; co-located DSL+runtime+step tests added (87/98 tasks done)
- agent-artifact: code complete — registry+versioning+exporters (file/csv/pdf/pptx/notion/slack/github-issue/github-pr/email) shipped; per-exporter flags wired; R2 offload binding added; rollout runbook documented
- agent-policy: code complete — budget+provider+quality+security+human-gate enforcement wired; retry overlay shipped; policy runbook documented
- agent-pipelines-unify: code complete — 13 pipeline flags wired; admin/jobs reads from flow_runs only; caller files marked with TODO; drop_admin_jobs migration written; pending production observation (28-day zero-write window)
- agent-console: code complete — 8 section pages wired; flow card index + preset panel + SSE stream + cost header shipped; a11y+keyboard+touch+visual-regression test specs added; lhci config added; runbook documented; per-page flags retired 2026-05-23 (task 9.4.3)
- agent-providers: code complete — 5 LLM + 3 search + 4 reader + 4 knowledge + 5 action providers in central registry; routing fallback+health+load-balance+rate-limit wired; model.invoke + search routed through registry; parity/E2E tests added; runbook + alerting hooks shipped; pending production rollout observation
- agent-os: kernel live with critic agent on since 4d3b12c; writer/research/planner pending prod observation windows; scheduler+R2 bindings wired; pending production flag flips

未完成的決策（production flag flips、soak windows）已登錄到 `docs/governance/escalation-queue.md`，不會因歸檔而遺失。

## 2026-07-27 — post(ai) 3D 建模工具地景（zh + en）

post(ai) 3D modeling tools landscape (zh + en) — tool-selection
  companion to the 2026-07-22 paper-level 3D generation map, cross-linked both
  ways. Pricing taken from vendor pricing pages (Meshy/Tripo/Hyper3D) rather
  than review sites. Added 6 site-wide glossary terms: mesh, PBR, retopology,
  photogrammetry, Gaussian Splatting, 非流形. Also fixed the two pre-existing
  `astro check` errors in src/components/RelatedPosts.tsx (ts18046/ts2339) by
  typing the /api/related-posts JSON response — `astro check` now 0 errors.

## 2026-07-31 — post(ai) 圖生影片地景（zh + en）

post(ai) image-to-video landscape (zh + en). deep-research pass
  corrected three claims that are widespread in secondary coverage: Wan 2.7 has
  NO open weights (Wan-Video GitHub org + HF Wan-AI both top out at 2.2 — many
  SEO sites claim Apache 2.0); Veo 3.1 Standard is $0.40/s per Google's official
  pricing page, not the $0.03–$0.75/s range review sites quote; Sora app closed
  2026-04-26 and its API closes 2026-09-24. Prices taken from official pricing
  pages only (ai.google.dev, docs.dev.runwayml.com). Added 5 site-wide glossary
  terms: DiT, VAE, latent space, classifier-free guidance, 模型蒸餾. Research
  note in .research/2026-07-31-image-to-video-ai.md (not version-controlled).

## 2026-08-06 — 無人機系列 glossary 債清償

Glossary debt for the drone series is CLEARED: the 5 terms (BVLOS, FPV,
非紅供應鏈, Blue UAS, C-UAS) are now in `src/lib/glossary/terms.ts` (191 total),
and the duplicate frontmatter block was removed from the hub post. The
shadowing mechanic that made the duplicate a problem — frontmatter glossary is
prepended before `DEFAULT_GLOSSARY_TERMS` and deduped first-wins — is kept in
`progress.txt` because it still binds future posts.

## 2026-08-07 — 無人機系列 13 → 23 篇（完整版）

Ten posts (zh+en): spec-sheet reading, crash anatomy, CAA question-bank (the D
line, unblocked by dropping the "must buy a drone" premise); B5 tender
financials; counter-UAS; the application block's ag-spraying / disaster-SAR /
inspection / logistics (four value logics: cheaper / no denominator /
cheaper+safer / only-thing-available); plus the privacy piece closing the
series' biggest vantage-point gap. Per-post findings live in
`docs/content-plan-drone.md` §5.2.

Claims to handle carefully if reused: the registered-drone count
75,240→40,134→38,683 is an INFERENCE (Art.10 two-year validity), not a finding;
the "rice only, 5 chemicals" drone-spray approval is a 2021 baseline — check
APHIA systems before quoting as current.

Investing-line boundary settled: named-company public filings are fine as a
worked example, with zero buy/sell judgment (user approved this reading).

Two planning assumptions corrected, both about BVLOS. Inspection isn't blocked —
it SEGMENTS work into within-line-of-sight units. Logistics isn't either — the
CAA approved 10 cases / 24 corridors and the IOT ran PoC→PoS→PoB from 2020,
routing around by getting corridors approved one at a time, which fails for
inspection (demand spread over 22k bridges) and works for logistics (demand on a
few routes). General lesson, still live: ask whether the regime's GRANULARITY
fits the demand's SHAPE, not whether a framework exists.

Privacy findings: the Legislative Yuan's own 2020 report admits the drone
chapter has NO privacy provision (it is flight-safety and national-security
law); the AirTag "dragnet surveillance" doctrine — public movements aggregating
into a non-public picture — is ready-made for drones but unused, and is the same
REPETITION property the inspection piece treats as a virtue; the real bottleneck
is evidence, and the CAA's flight-logging system is closed to the public.

## 2026-08-08 — 英文文章站內連結全站修正

English posts linked to zh slugs, so English readers landed on Chinese posts.
163 files / 742 links rewritten in two passes (281409f for the drone series,
2d2be1e for the rest), plus b57b04c which translated
`ai/2026-07-22-3d-generative-models-landscape` to close the last gap. Final
scan: 0 broken links, 0 links still pointing at a Chinese post.

Rules that made it safe, reuse them for any similar sweep:

- rewrite a link ONLY when the `-en` file actually exists;
- never touch the `🌏 [中文版]` line — that one is meant to point at the
  Chinese post (361 preserved untouched);
- the category can be NESTED (`/posts/tech/deep-dive/...`). A single-level
  regex silently skips those — it missed 187 links on the first pass and
  reported success.

Two zh posts still have no English version at all:
`ai/2026-07-10-ai-courses-2026-guide` and
`coffee/2026-07-25-pour-over-dripper-trapezoid-vs-cone`. Nothing links to them
from English, so that is a coverage gap, not a broken-link one.

## 2026-08-08 — 無人機系列 B 技術群開工（B8／B10／B9）

Three posts in one day opened the B (technical) block, which had been entirely
empty, and produced the series' first first-hand output. Per-post findings live
in `docs/content-plan-drone.md` §5.2; this is the shape of the thing.

- **B8 PX4 vs ArduPilot vs 自研** — both stacks cloned and built, one SITL
  sortie flown. ArduPilot's `AP_NavEKF3.h` cites `github.com/PX4/ecl` for its
  derivation and Paul Riseborough maintains both projects, so the two are
  common-descent at the hardest layer. Contributor structure is inverted
  against the stereotype: PX4 is company domains (Auterion = 16% of human
  commits), ArduPilot is personal mailboxes but far more concentrated (one
  person 37%); PX4 also carries 645 bot commits (22%) that break naive commit
  comparisons. The real decision points are BSD-3 vs GPLv3 and which layer you
  extend.
- **B10 遙控鏈路** — ExpressLRS hop sequence derives from the binding phrase via
  MD5 → LCG; ported to Python and diffed bit-identical against verbatim C. No
  link encryption, only CRC14. LP0002 §4.10.1.2 gives 2.4 GHz hoppers 1 W at
  ≥75 channels and 0.125 W below, and ELRS uses exactly 80.
- **B9 GNSS 拒止** — first interventional experiment: `SIM_GPS1_JAM` on at 28 m,
  and the aircraft landed itself in ~7 s of sim time rather than flying away.
  PX4's `EKF2_GPS_CHECK` default leaves jamming detection off and spoofing on,
  because both flags come from the receiver and only jamming is inferable.

The recurring mistake this closed: "technical topic" had been silently filed
under "needs hardware." All three were codebase questions. The real barrier was
Python dependencies.

## 2026-08-08 — 無人機系列 B 群續寫（B17 資安規範、B11 續航物理）

- **B17 資安檢測規範拆解**（policy）— read the spec end to end after citing it
  four times. Current version is V2.0, in force 2026-04-30 (the spec-sheet post
  said 2024-12, which was V1.0, and now carries a correction note). Of seven
  mandatory items the aircraft carries only three; §6.4.1 passes on disclosure
  rather than encryption; §6.5.1 tests the update path, not the firmware, which
  resolves the "does reflashing make a new series" question; §5.1.1 lets Green
  UAS substitute for the domestic test; and the five items that test resilience
  are all in the optional Chapter 8. Its §8.1.2 pass criterion is literally the
  LAND behaviour measured in SITL the day before.
- **B11 續航物理**（tech）— pure computation, no regulation. Optimal battery
  mass = 2×(airframe+payload) and the derivation cancels every parameter. The
  legal weight thresholds do NOT cap endurance (every class tops out at 45–60
  min); payload does. The 30–45 minute band is today's cell chemistry. Taiwan
  exception: Molicel / E-One Moli Energy (TCC Group) is the one BOM layer Taiwan
  leads, and the 2025-07-14 Kaohsiung fire cost TCC about NT$11 bn while orders
  ran at twice capacity.

Per-post detail for both is in `docs/content-plan-drone.md` §5.2.

## 2026-08-08 — 無人機系列 B15 機體形態與能源階梯

Paid off the debt B11 stated in print ("no forward flight"). Two power laws:
hover goes as mass^1.5 over the square root of disk area; cruise goes as mass to
the first power, divided by L/D. Same 5 kg aircraft and 2 kg pack: 512 W and 41
minutes hovering, versus 128 W, 164 minutes and 197 km cruising.

Second all-parameters-cancel result of the series, after B11's 2/3 battery
optimum: fixed-wing range `R = E·(L/D)·η/(m·g)` is **independent of cruise
speed** — power rises and time falls proportionally.

A VTOL's cost is not transition energy (2.4% of the pack) but mass: 0.5 kg of
extra structure comes out of the battery and costs a quarter of the range. A
single 2.5 m rotor doubles hover endurance over a quad at 25 kg — and the two
TTSB failures from the crash-anatomy post were in exactly the mechanisms that
buys, which makes those reports the bill for the trade.

Biggest surprise, and it corrects an impression the earlier posts may have left:
Taiwan has a domestic aircraft at every rung of the endurance ladder — AXH-E230RS
(AVIX, electric single rotor, ~60 min) → DRAGONFLY (Zang Shi, tiltrotor, 13 kg /
150 km / 1.8 h) → ITRI fuel-cell twin (63 kg / 2 h) → ITRI × AVIX fuel-cell light
helicopter (24.9 kg / 3 h) → Thunder Tiger T-400 (Rotax 912 piston, 180 kg /
250 km / 6 h). Fuel cells buy roughly 3×; the piston rung is different physics.
And 24.9 kg is regulatory arbitrage again, this time by a national research
institute.


## 2026-08-09 — 無人機系列 B 群完工（B14／B12／B16／B13／C24）＋兩次自我更正

一天內出五篇（zh+en），系列 30 → 35，**B 技術群 17 格全數寫完**。

**B14 群飛**：Skybrush 開源燈光秀韌體（ArduPilot 分支 CMCopter-4.6，9,199 行）
機間零協調；協調的全部內容是一個 GPS 週內秒；bubble fence 量的是自己離自己
的 setpoint，預設 Report only；GNSS 是單點。台灣資安檢測規範第 7 章十二項，
「遙控無人機」欄全是「-」，引用標準是物聯網場域指引與 Wi-Fi 分享器測試規範。
方法教訓：**條文形狀不對時去查它的出身**（監察院報告把第 7 章追到 2022 國慶
晶片爭議與 2023-01-04 投標須知的「飛行場域資通安全防護評估」）；**有紀錄的
要求 vs 發布的條文**是可重用的檢查（2022-11-11 會議要求納入群飛任務軟體檢測，
四年後第 7 章零項）。

**B12 酬載**：ECCN 6A003.b.4.b 切在 111,000 個焦平面陣列元素；384×288 =
110,592 差 408 過關，上一階 640×480 = 307,200——**門檻畫在產品階梯的空隙裡**。
Note 3.b 的 2 mrad IFOV 限制的是焦距不是解析度（12 µm、640×512 需 HFOV ≥ 73°）。
FLIR 的 9 Hz SKU 只因 Note 3.a 存在。台灣不在 Country Group A:1（瓦聖納），
且 RS Column 1 與 2 都打勾（日本只有 Column 1）→ **111,000 對台灣不構成
許可與否的分界**。

**B16 量產爬坡**：不需要工廠，證據在採購網。消防署 88+88 案，中央定價
（無人機 4 組 400 萬／機器人 4 台 2,600 萬），六個消防局第一次流標，
七件決標全部等於預算（雲林只有一家投標），臺中招三次、履約期 121→58 天，
投標池六家（含一家保全公司）。

**兩次自我更正（都留在原文裡）**：
1. B12 用兩個計畫總額解聯立得 547 萬／203 萬，逐案紀錄顯示是 100 萬／650 萬
   ——方向相反、差五倍。收束段的「核心佔 2.1%」改為 11.4%。
2. B16 的對照組（雲梯車流標／決標 0.54，高於無人機的 0.33）**推翻了 B16
   自己第七節的第一條結論**——流標在台灣消防裝備採購是常態。

**B13 自主性**：ArduPilot `ModeReason` enum 是被編譯器保證完整的自主決策清單，
56 項；21/43 非人為理由是「偵測到危險」，**只有 `SOARING_THERMAL_DETECTED`
是為了機會**。PX4 主線有 end-to-end NN（mc_nn_control，15→4，直發
actuator_motors，tensor arena 10 KB，Kconfig default n），ArduPilot 沒有。

**C24 警用蒐證**：民航法 §99-16 II 是飛安豁免不是調查授權（臺北市法規會
111 年度鑑定意見）；空中蒐證唯一的專門條文（科偵法草案 §4 的 30 日累計上限
→ 刑訴 §153-2）被法務部自己建議再酌。時間軸只到 2024-06。

**簿記**：計畫 §三 的 ✅ 曾經只維護 B 群，補齊 23 格並加覆蓋盤點；總覽加了
依讀者身分的六條閱讀路徑。
