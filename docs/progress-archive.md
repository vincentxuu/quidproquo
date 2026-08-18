# progress.txt 歸檔

`progress.txt` 是 working memory，不是日誌：完成、過期或不再需要每個 session 都看到的條目移到這裡（最新的段落放最上面）。協定見 `docs/governance/operating-charter.md`。

## 2026-08-16 歸檔

### Recently completed（原 progress.txt 條目）

新增 AI-Engineering-Coach 導讀後 progress.txt 會達 93 行，依慣例移出最舊一筆。

- 2026-08-08: 研究 ByteByteGo 的 AI Agent 內容體系（十輪，三份檔案在 .research/）。
  用官方 sitemap 掃出 agent 相關 60 篇全部讀完 + 2 影片 + 3 課程頁（使用者原始清單
  只有 6 篇，最有料的四篇都不在裡面）。查了 19 份一手來源、約 40 項宣稱：4 個實質
  錯誤、1 個查無出處（Google 75%）、5 處脈絡缺失（最嚴重是 Klarna 已於 2025-05 公開
  反轉卻仍被當成功案例）、2 次平反。**六條方法論教訓已回饋進 deep-research skill 的
  反合理化表**，核心一條：清單能窮舉、每項只花一次抓取時，抽樣推斷沒有正當理由——
  我在這場研究裡犯了四次，最後一次讀完剩下 27 篇推翻了三處既有記載。
  對本 repo 可動手的三件事：規則要 scoped 不要 global、CLAUDE.md 是 config 層不是
  memory 層（失效模式是稀釋不是檢索錯）、skill 的 description 要當檢索鍵寫。

## 2026-08-10 歸檔

### Recently completed（原 progress.txt 條目）

補 drone 系列 series 欄位後 progress.txt 達 98 行，依慣例移出最舊一筆。

- 2026-08-06: post(learning) 數位學習之外紙筆還剩什麼 (zh + en)。四輪研究，中途
  推翻自己兩次（詳見 PR #126）。角度：數位是預設，實體仍有效的三個地方是閱讀
  （Delgado 17 萬人 g=-0.21，捲動時 0.35-0.48）、作答動筆（螢幕上題目越難越少用
  草稿紙）、畫圖（45% vs 20%）；唯一沒共識的是手寫筆記（四份 meta 從 -0.008 到
  +0.248）。八份核心文獻讀到七份全文，只有 Voyer 正文卡付費牆。新增 7 個全站
  glossary 術語。deep-research / post-verify skill 已補上抽取完整度、繞路清單、
  推論與事實分離三條規則。工具面：firecrawl/Exa 的 requires approval 是 claude.ai
  connector 層級的 ask，allow 規則擋不住；另外現有 mcp__claude_ai_*__* 規則在
  web session（server 為 UUID 命名）會靜默失效，尚未處理。

- 2026-08-06: post(learning) "Learning How to Learn" series (2 posts x zh/en,
  PR #127, open). Part 1 = learning science evidence audit; part 2 = generative AI.
  Six self-corrections during the write-up, all rooted in reading search snippets
  instead of documents. Three skills amended as a result: deep-research (source
  tiering 一手/摘要/轉引/未驗證 replaces "2 independent sources"; effect sizes must
  carry their comparison condition; check for corrections/retractions), post and
  post-review ("rewriting = re-asserting" — tldr/faq/glossary need re-verification
  against primary sources). Full findings in the PR body. Research note in .research/.

## 2026-08-01 歸檔

### post(ai) 數位員工（PR #130）

progress.txt 在合併 main 後達 95 行，本條目細節移到這裡。

- 骨幹是 Anthropic Project Vend phase 1+2（一手，且把失敗一起公開）。
- 第二輪查證修掉兩處實質錯誤：
  1. **定價表**原本整張取自競品比較文，改回廠商官方定價頁後發現：Zendesk 根本
     未公布 per-resolution 單價（方案內含額度＋超額計費，流傳的 ~$1.50 出自競品
     行銷內容）；Agentforce 已於 2025-05 從 $2/conversation 改為 Flex Credits
     $0.10/action；HubSpot 是 50 credits @ $9/1,000 ≈ $0.45，並把 resolution
     定義成「72 小時內未轉真人」。後兩者剛好佐證文章原本的論點（計價單位由賣方
     定義），改寫為以官方說法佐證。
  2. **Klarna 時間線**原本停在 2025-05，補上 Q3 2025（相當於 853 名客服、省 $60M）、
     2026-02（2030 年降至 2,000 人以下、靠自然流失）、2026-06（真人客服＝VIP）。
     原本的「反轉 vs 範圍修正」二選一因此改寫為持續演進。
- **MIT NANDA 樣本數衝突已解決**：報告 PDF 第 2 頁為 52 場訪談／153 份問卷／300+
  專案；流傳甚廣的「150 訪談／350 員工問卷」是誤傳，文章直接更正並引用原文。
- 新增 **EU AI Act** 一節：Article 26(2) 要求部署者將人為監督指派給具名自然人，
  2026-08-02 生效；Annex III 第 4 類使雇主（而非廠商）成為部署者。
- 維持並列不選邊：11x churn 70–80%（TechCrunch 引內部人士）vs 79% 留存（公司）；
  Salesforce 9,000→5,000 的「裁員」vs「rebalance」。
- 刻意不引用：Agentforce ARR（$800M vs 跨過 $1B run rate，來源衝突）、Gartner
  「50% 會重新聘回」（無一手 PR）。
- 新增 2 個全站 glossary 術語：數位員工、agent washing；2 個當篇術語。
- **未解缺口**：兩輪搜尋都找不到有第三方驗證成效數字的台灣導入案例，只有廠商
  新聞稿，因此文章維持這個缺口沒有硬填。
- Research note 在 `.research/2026-08-01-digital-employee.md`（不入版控）。

## 2026-08-06 歸檔

### Recently completed（原 progress.txt 條目）

- 2026-07-25: SEO/AEO batch 1. Platform: content schema gained optional
  `updated` + `faq`; BlogPosting now emits dateModified/inLanguage/
  articleSection/wordCount; FAQPage schema + visible `<details>` FAQ section;
第四批歸檔（PR #127 再次合併 main 後 progress.txt 達 95 行；依慣例移出最舊一筆）。

- 2026-08-06: post(tech) 手機沒偷聽你講話 (zh + en). deep-research pass on the
  "never searched it, only talked about it" phenomenon. Key find nobody has
  covered yet: FTC closed the Cox Media Group "Active Listening" case on
  2026-05-21 — the service collected NO voice data at all, it was reselling
  data-broker email lists at a markup; $930,000 across CMG + MindSift + 1010
  Digital Works. So the single strongest piece of "phones eavesdrop" evidence
  was a fraud. Second find: Meta's official PYMK signal list (transparency
  center, updated 2024-12-13) explicitly includes "whether or not your contact
  was uploaded by the person being suggested" — official confirmation of the
  shadow-profile path. Deliberately did NOT attribute household-IP graphs to
  Meta: privacy policy confirms it collects nearby Wi-Fi APs + IP, but the PYMK
  signal list contains no location/IP signal, so the article says "industry
  practice, Meta holds the same raw materials". Included the Webex counterexample
  (PoPETs 2022, reads mic while muted, 81.9% background-activity accuracy) so
  the piece is not one-sided. Added 9 site-wide glossary terms (Meta Pixel,
  Conversions API, Lookalike Audience, 資料掮客, 影子檔案, 頻率錯覺, 身分圖,
  地理圍欄, DMA). Research note in .research/ (not version-controlled).

第三批歸檔（2026-08-06 稍晚，兩條分支各自合併 main 後都觸發上限：圖示改 Koboyo
手繪風時 progress.txt 達 99 行，Learning How to Learn 系列 PR #127 時達 102 行。
兩者歸檔的是同一筆條目）。

- 2026-08-06: post(ai) AI certification fact-check (zh + en). Audited a
  circulating "2026 AI certs for engineers" list against primary sources only;
  three hard errors: MS AI-102 retired 2026-06-30 (cert page flagged retired +
  noindex), Google has NO GenAI Engineer cert (URL 404s; only GenAI Leader +
  PMLE exist), iPAS intermediate is 5-year not permanent (only beginner is
  permanent). Biggest practical find: PMLE's exam guide renamed every Vertex AI
  service to Gemini Enterprise Agent Platform, so all pre-mid-2026 study
  material is dead. Also: Claude certs are 4 exams gated behind Partner Network
  (per Pearson VUE). Prices are NOT officially published (third-party sources
  conflict: CCAR-F listed as both $125 and $175) — article says so explicitly.
  Added site-wide glossary term MLOps.
（2026-08-05 及之前的條目已移到 docs/progress-archive.md）

以下前兩筆為當日第二批歸檔（發布手機廣告追蹤機制文章後，progress.txt 達 85 行，
逼近 90 行上限而觸發）。

- 2026-08-05: post(tech) 手繪風 SVG 圖示三條路線（zh + en）。補上資產地圖系列缺的
  靜態 2D 向量那一塊（已有 Lottie 向量動畫 06-09、3D 工具 07-27），三篇互連。
  重點不是工具清單而是取捨：Koboyo 92,967 個免費圖示的授權禁止做競品畫布/圖示
  庫、也禁止使用者可挑選下載圖示的 app（原文照引）；sketchyicons 把 Lucide 幾何
  的直線段轉二次貝茲、偏移上限取該線段自身長度的比例、用 icon 名稱當種子做到
  byte-for-byte 一致；tldraw 用 shape ID 當種子撐過 resize + 兩趟疊描邊 + 依轉角
  角度動態圓角。Koboyo 命名結構像批次生成但官方未明說，文中標為推論。新增 CC0
  全站 glossary 詞條。post-verify 已跑並修正：Koboyo 數量同一天內從 92,967 掉到
  87,954（Google 索引還停在 71,238），改成不寫死數字並把浮動本身寫進文章；theSVG
  6,400+/4,487 → 6,502+/4,629；Wired Elements 星數改 10.8k。查授權原文後補上三條
  Streamline 限制（開源即使付費仍強制署名、禁止 AI 訓練、每組織僅一位 licensed
  user 能存取向量原始檔）與 Extended Allowance License 可解除 100 個上限；另發現
  Koboyo 自己也有 MCP，補進 MCP 那節。
- 2026-07-31: post(ai) image-to-video landscape (zh + en). deep-research pass
  corrected three claims that are widespread in secondary coverage: Wan 2.7 has
  NO open weights (Wan-Video GitHub org + HF Wan-AI both top out at 2.2 — many
  SEO sites claim Apache 2.0); Veo 3.1 Standard is $0.40/s per Google's official
  pricing page, not the $0.03–$0.75/s range review sites quote; Sora app closed
  2026-04-26 and its API closes 2026-09-24. Prices taken from official pricing
  pages only (ai.google.dev, docs.dev.runwayml.com). Added 5 site-wide glossary
  terms: DiT, VAE, latent space, classifier-free guidance, 模型蒸餾. Research
  note in .research/2026-07-31-image-to-video-ai.md (not version-controlled).
- 2026-07-27: post(ai) 3D modeling tools landscape (zh + en) — tool-selection
  companion to the 2026-07-22 paper-level 3D generation map, cross-linked both
  ways. Pricing taken from vendor pricing pages (Meshy/Tripo/Hyper3D) rather
  than review sites. Added 6 site-wide glossary terms: mesh, PBR, retopology,
  photogrammetry, Gaussian Splatting, 非流形. Also fixed the two pre-existing
  `astro check` errors in src/components/RelatedPosts.tsx (ts18046/ts2339) by
  typing the /api/related-posts JSON response — `astro check` now 0 errors.
- 2026-07-25: SEO/AEO batch 1. Platform: content schema gained optional
  `updated` + `faq`; BlogPosting now emits dateModified/inLanguage/
  articleSection/wordCount; FAQPage schema + visible <details> FAQ section;
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

歸檔說明：2026-07-25 條目裡未完成的 batch 2（需使用者提供第一手素材）已登錄為
`docs/governance/escalation-queue.md` 的 Q-008，不會因歸檔而遺失。

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
- 2026-08-05: post(tech) 手繪風 SVG 圖示三條路線（zh + en）。補上資產地圖系列缺的
  靜態 2D 向量那一塊（已有 Lottie 向量動畫 06-09、3D 工具 07-27），三篇互連。
  重點不是工具清單而是取捨：Koboyo 92,967 個免費圖示的授權禁止做競品畫布/圖示
  庫、也禁止使用者可挑選下載圖示的 app（原文照引）；sketchyicons 把 Lucide 幾何
  的直線段轉二次貝茲、偏移上限取該線段自身長度的比例、用 icon 名稱當種子做到
  byte-for-byte 一致；tldraw 用 shape ID 當種子撐過 resize + 兩趟疊描邊 + 依轉角
  角度動態圓角。Koboyo 命名結構像批次生成但官方未明說，文中標為推論。新增 CC0
  全站 glossary 詞條。post-verify 已跑並修正：Koboyo 數量同一天內從 92,967 掉到
  87,954（Google 索引還停在 71,238），改成不寫死數字並把浮動本身寫進文章；theSVG
  6,400+/4,487 → 6,502+/4,629；Wired Elements 星數改 10.8k。查授權原文後補上三條
  Streamline 限制（開源即使付費仍強制署名、禁止 AI 訓練、每組織僅一位 licensed
  user 能存取向量原始檔）與 Extended Allowance License 可解除 100 個上限；另發現
  Koboyo 自己也有 MCP，補進 MCP 那節。
- 2026-07-31: post(ai) image-to-video landscape (zh + en). deep-research pass
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


## 2026-08-09 — drone series tool notes（自 progress.txt 移入）

- `law.moj.gov.tw` 在本環境只能透過 firecrawl MCP 取得（curl 一律 403 CONNECT）。
- 單一法規條文檢索（便宜）：`LawClass/LawSearchContent.aspx?pcode=X&kw=Y`
- 全法規語料計數：`Law/LawSearchResult.aspx?cur=Ld&ty=ONEBAR&kw=Z`（回傳命中法規數）
- 單條文：`LawClass/LawSingle.aspx?pcode=X&flno=N`；沿革：`LawClass/LawHistory.aspx?pcode=X`
- g0v 政府採購 API 為 `pcc-api.openfun.app`；回應極大，一律用腳本解析，不要讀進 context。
  **關鍵字比對是模糊的**（查「干擾槍」會撈到「無人機干擾器」與「遠控無人機採購案」），
  不足以支撐任何數量結論。


## 2026-08-09 — drone series reusable lessons (1)–(7) 全文（自 progress.txt 移入）

1. **兩個總量同時解聯立＝猜。** B12 用兩個計畫總額解單價，結果**顛倒且差五倍**；逐項決標紀錄一直是公開的。我當時已經標了「那個數字看起來偏低」——**標示不確定性不等於消除它**。
2. **你列出的缺口可能反駁你的文章。** B16 自己寫的「沒有對照組」後來推翻了它的第一版結論（雲梯車無法決標比 0.54 vs 無人機 0.33）。寫「我沒做 X」之前先問：X 會不會反駁本文？會的話它是前提，不是未來工作。**現在的標準做法是逐項在文章裡回答這個問題。**
3. **THE RECURRING MISTAKE，六次後結案**：把題目預設成需要硬體／工廠／訪談／商業機密。六次全部是假的。
4. **要寫一個模糊的詞，去找資料來源被迫窮舉它的地方。** B13 的 `ModeReason`（每個 `set_mode()` 的第二引數，編譯器保證完整，56 項）；D32 的內政部警械種類 31 項；全法規語料「無人機」19 部 vs「反制無人機」1 部。
5. **條文形狀不對時，去找它的親代**（B14：資安檢測規範第 7 章源自 2022 國慶中國晶片事件與 2023-01-04 標案文字）。
6. **「有紀錄的要求」對「實際交付的文字」**是可重用的檢查（B14、C24）。
7. **負面結果只有可重跑才算數**：印出查詢指令與計數（B13 的 grep 命令與 ArduPilot 0／PX4 420；D32 的三個法規資料庫查詢 URL）。


## 2026-08-09/10 — drone series gap-closing rounds 全文（自 progress.txt 移入）

  (12)-(14) GAP-CLOSING 2026-08-09, three rounds. D31: both declared gaps
  closed from the source the gap itself named (later LY budget reports) —
  108年度 5 / 109年 4 / 110年 2 / 111年 9 / 112年1-8月 3, count did NOT fall so
  the post got stronger; two CAA submissions disagree on the same events →
  trend-only; 「國內各機場均已購置手持式干擾器…並視況反制無人機」 made D32's
  "own it, can't fire it" 現況 (back-written); 審計部 hit Songshan for 未妥為
  訂定驗收測試規範 = B16's disease again. C1 now prints its query (4 amendments,
  none in 2026) and self-corrected the "not yet in force" reading. D2 half-
  closed with pyulog on PX4 repo test logs (70 topics / 493 params) — but they
  are BENCH logs, so it shows what a log records, not crash reconstruction.
  STILL OPEN, reason known (worth more than "didn't check"): 判決書 + 交通部
  函釋 need on-site forms; D3 pass-rate is NOT published; 縣市公告 lists ship
  as ODS coordinate annexes on an unreachable host (itself a finding).
  TOOL WARNING: firecrawl's json extractor FABRICATED a Kaohsiung site list
  incl. non-existent 「高雄嫩江發電廠」; direct-quote mode showed the page says
  only 「如附件」. NEVER build a claim on the json extractor alone.
  RULE: when a gap names its own source, go get it.
  (15) A GAP-FILLING EDIT MUST ALSO CHECK title / description / inbound link
  text. I updated D31's body to 23 closures and left the title at 「六次」 —
  4x understated in the most-read line. Fixed 2026-08-10 (slug+date unchanged).
  (16) TIME-SENSITIVE POSTS NEED A REVIEW BLOCK, not just a caveat. Added dated
  「會過期的東西」tables with re-check URLs to E2 / hub / D32. E2 also now warns
  that the NT$210bn 國防自主無人載具採購特別條例 (still stuck in negotiation,
  its 2026-08-01 start date passed) is a DIFFERENT act from the already-in-force
  保衛國安…採購特別條例 cited in D32 — the two posts never cross-referenced.

- 2026-08-06: post(ai) AI certification fact-check (zh + en). Audited a
  circulating "2026 AI certs for engineers" list against primary sources only;
  three hard errors: MS AI-102 retired 2026-06-30 (cert page flagged retired +
  noindex), Google has NO GenAI Engineer cert (URL 404s; only GenAI Leader +
  PMLE exist), iPAS intermediate is 5-year not permanent (only beginner is
  permanent). Biggest practical find: PMLE's exam guide renamed every Vertex AI
  service to Gemini Enterprise Agent Platform, so all pre-mid-2026 study
  material is dead. Also: Claude certs are 4 exams gated behind Partner Network
  (per Pearson VUE). Prices are NOT officially published (third-party sources
  conflict: CCAR-F listed as both $125 and $175) — article says so explicitly.
  Added site-wide glossary term MLOps.
- 2026-08-06: 全站圖示改用 Koboyo 手繪風（27 個 UI 圖示 + favicon），是 08-05 那篇
  文章的自我應用。授權確認過：blog 當自家 UI 用不踩任何一條 "You can't"。三個名字
  沒有直接對應，改用 house / bar-chart / external-link。實測後兩個修正：(1) Koboyo
  畫在 90-210 單位格線上，筆畫換算到 24 格線只剩 0.5-0.7，在 11-16px 下是灰色細線
  像 disabled — Icons.astro 用 FATTEN_PX=0.9 疊描邊補回來（依各自 viewBox 換算，
  讓加粗量固定是 0.9 個渲染像素）；(2) 站上原本有 11-13px 的呼叫點，手繪筆觸撐不住，
  全部提到 14px。pin 用 pushpin-own，因為 koboyo 的 `pin` 是 103x202 縫衣針、頭在
  16px 以下會消失，斜角的那幾個在 14px 讀起來像法槌。順帶更新 08-05 那篇：授權頁
  數字從 87,954 回到 90,150，「主動刪減」的推論不成立改寫成上下跳動；另查 sitemap.xml
  是單一 flat urlset 只列 18,044 個 URL、約 17,930 個圖示頁，跟宣稱數字差五倍。
- 2026-08-06: post(tech) 手機沒偷聽你講話 (zh + en). deep-research pass on the
  "never searched it, only talked about it" phenomenon. Key find nobody has
  covered yet: FTC closed the Cox Media Group "Active Listening" case on
  2026-05-21 — the service collected NO voice data at all, it was reselling
  data-broker email lists at a markup; $930,000 across CMG + MindSift + 1010
  Digital Works. So the single strongest piece of "phones eavesdrop" evidence
  was a fraud. Second find: Meta's official PYMK signal list (transparency
  center, updated 2024-12-13) explicitly includes "whether or not your contact
  was uploaded by the person being suggested" — official confirmation of the
  shadow-profile path. Deliberately did NOT attribute household-IP graphs to
  Meta: privacy policy confirms it collects nearby Wi-Fi APs + IP, but the PYMK
  signal list contains no location/IP signal, so the article says "industry
  practice, Meta holds the same raw materials". Included the Webex counterexample
  (PoPETs 2022, reads mic while muted, 81.9% background-activity accuracy) so
  the piece is not one-sided. Added 9 site-wide glossary terms (Meta Pixel,
  Conversions API, Lookalike Audience, 資料掮客, 影子檔案, 頻率錯覺, 身分圖,
  地理圍欄, DMA). Research note in .research/ (not version-controlled).

## 2026-08-06 圖示改版與「文件解析實戰」系列（自 progress.txt 歸檔於 2026-08-08）

- 2026-08-06: 全站圖示改用 Koboyo 手繪風（27 個 UI 圖示 + favicon），是 08-05 那篇
  文章的自我應用。授權確認過：blog 當自家 UI 用不踩任何一條 "You can't"。三個名字
  沒有直接對應，改用 house / bar-chart / external-link。實測後兩個修正：(1) Koboyo
  畫在 90-210 單位格線上，筆畫換算到 24 格線只剩 0.5-0.7，在 11-16px 下是灰色細線
  像 disabled — Icons.astro 用 FATTEN_PX=0.9 疊描邊補回來（依各自 viewBox 換算，
  讓加粗量固定是 0.9 個渲染像素）；(2) 站上原本有 11-13px 的呼叫點，手繪筆觸撐不住，
  全部提到 14px。pin 用 pushpin-own，因為 koboyo 的 `pin` 是 103x202 縫衣針、頭在
  16px 以下會消失，斜角的那幾個在 14px 讀起來像法槌。順帶更新 08-05 那篇：授權頁
  數字從 87,954 回到 90,150，「主動刪減」的推論不成立改寫成上下跳動；另查 sitemap.xml
  是單一 flat urlset 只列 18,044 個 URL、約 17,930 個圖示頁，跟宣稱數字差五倍。
- 2026-08-06: 新系列「文件解析實戰」（slug `document-parsing`）建立並註冊於
  `src/utils/series.ts`。排序依閱讀路徑不是日期——骨幹是三層階梯（轉換/抽取/
  解析）。`getSeriesNav` 用嚴格 order±1，編號必須從 1 連號。現有 1 三層階梯總論、
  2 MarkItDown、3 anydoc、4 抽取層、5 解析層，zh/en 各一份，系列完整。AI 爬蟲
  全景圖退出系列，保留雙向連結。新寫四篇 post(ai)：三層階梯總論、anydoc、
  抽取層（PyMuPDF/pdfplumber/pypdf/Tika/Kreuzberg/extractous）、解析層（MinerU/
  Marker/Docling/olmOCR/dots.ocr + 商業 API）。
  post-verify 已跑並全數修正，兩個教訓值得記住：(1) 引 benchmark 前先讀它的計時
  與加總方式——anydoc 的 README 自己說 CLI 工具計時含 process spawn、綜合分數欄
  各行平均的格式集不同不可排名，我原本兩條都誤用了；(2) 對第三方 benchmark 要用
  跟廠商自評同一把尺——ParseBench 由 LlamaIndex 自製且榜首是自家產品，原本沒標。
  agentic-attachment-rag-survey（zh/en）的同源 ParseBench 誤述已一併修正。
  order 4/5 的星數與授權全部走 GitHub API 現查（2026-08-06）。最重要的發現是
  授權：PyMuPDF 是 AGPL-3.0（閉源 SaaS 的地雷）、MinerU 用自訂授權（過門檻要
  另談）、Marker/Surya 程式碼 Apache-2.0 但模型權重走改過的 OpenRAIL-M——只有
  Docling 是乾淨 MIT。extractous 自 2024-12 停更。repo 搬家：marker →
  datalab-to、docling → docling-project，站內舊連結已更新。一手條款已核對：
  MinerU LICENSE.md 的 100M MAU / $20M 月營收門檻正確，另補上更會踩到的揭露
  義務與「權利自動終止、無須通知」條款。Marker/Surya 的門檻矛盾**不在二手來源，
  在 Datalab 自己的兩份官方文件之間**——repo README 寫 $5M + Apache 2.0，
  on-prem 文件寫 $2M ARR + GPL + custom RAILs，數字差 2.5 倍且程式碼授權寫的
  也不一樣。結論改成「$2M–$5M 區間要寄信問並留書面回覆」，不是讀網頁能解決。
  這次的錯誤模式已回饋進 `post-verify` skill：新增步驟 3.5「benchmark 與授權的
  加驗」（benchmark 七問 + 授權五查）與新 verdict 🔵 Misframed（數字抄對但推論
  錯）。核心觀察是本 skill 原本只抓「數字錯」，抓不到「數字對、用法錯」。


## 2026-08-09/10 — drone series progress.txt 全文（合併 main 時自 progress.txt 移入）

- 2026-08-09: 8 posts (zh+en), series 30 -> 38. **B TECHNICAL GROUP COMPLETE
  (17 cells) AND D GROUP COMPLETE (4 cells).** Detail in plan §5.2; older entries archived to
  docs/progress-archive.md. Reusable lessons, ranked by what they cost me:
  (1) TWO AGGREGATES SOLVED SIMULTANEOUSLY IS GUESSING (B12: unit prices came
  out REVERSED and 5x off; the line-item record was public). Flagging "that
  looks low" is not removing the doubt. (2) A GAP YOU LIST CAN REFUTE THE POST
  (B16's own "no control group" killed its first conclusion) — so answer, per
  gap, "could X refute this?" inside the post. (3) THE RECURRING MISTAKE closed
  after 6 instances: nothing needed hardware/factory/interviews. (4) For a fuzzy
  word, find where the source is FORCED to enumerate it (B13 ModeReason=56;
  D32 内政部 31-item list; 「無人機」19 instruments vs「反制無人機」1).
  (5) Mis-shaped clause → find its PARENTAGE (B14). (6) Requests-on-record vs
  delivered-text (B14, C24). (7) Negative results must print query + counts.
  Full text of (1)-(7) in docs/progress-archive.md.
  (8) READ THE VERB, not just the actor. D32's whole finding came from noticing
  民航法 §99-13 gives airports 「取締」 while ports/prohibited-airspace get
  「制止或排除」 — I had tabulated that same paragraph in D29 and missed it.
  (9) FACT: CCP special-compulsory-measures chapter PASSED 2024-07-16 (§153-1~
  §153-10 = GPS / IMSI-catcher / private-space imaging); NO aerial article.
  (10) A BUDGET REVIEW IS AN EVIDENCE SOURCE — D31's itemised closures exist
  only because the LY Budget Center made the CAA produce them.
  (12)-(16) GAP-CLOSING ROUNDS 2026-08-09/10 — full text in progress-archive.
  Headlines: D31's series now 108年度 5 / 109年 4 / 110年 2 / 111年 9 /
  112年1-8月 3 (count did NOT fall → post stronger); 「國內各機場均已購置手持式
  干擾器…並視況反制無人機」 made D32's "own it, can't fire it" 現況; C1 prints
  its query and self-corrected; D2 half-closed with pyulog (bench logs only).
  STILL OPEN: D3 pass-rate NOT published; 縣市公告 ship as ODS coordinate
  annexes on an unreachable host; 交通部函釋 not yet retried post-(17).
  RULES: a gap naming its own source → go get it. A gap-filling edit must also
  fix title/description/inbound links (D31 title was 4x understated). Time-
  sensitive posts need a dated review block, not just a caveat.
  (17) 2026-08-10 SELF-CORRECTION: wrote 判決書/函釋 off as unreachable after
  ONE failed route each. Wrong — curl returns 000 for ALL .gov.tw here so curl
  is not the test (firecrawl is), and the judgment DB is a POST form reachable
  via firecrawl_interact. 「遙控無人機」32、＋干擾器 0、「空拍 蒐證」520 →
  written into D32 + C24. ONE FAILED TRANSPORT IS NOT A BLOCKED SOURCE; "I
  can't get it" is THE RECURRING MISTAKE's exact shape. (interact hard-timeouts
  at 60s and dumps huge trees: one number per call, grep the saved file.)
  TOOL WARNING: firecrawl's json extractor FABRICATES — it invented a Kaohsiung
  no-fly list incl. non-existent 「高雄嫩江發電廠」. Verify with direct-quote.
  (11) AN EMPTY GAP FIELD READS EXACTLY LIKE "NO GAPS". The 未答 column only
  became standard at B8; 20 earlier rows had none — all 38 now carry one
  (B4/B5/B9 from the posts themselves, 17 marked 回溯補寫); two stale rows fixed.
  NEXT BIGGEST HOLES — read plan §三 coverage note, do NOT guess: C22 surveying
  / C25 film / C26 environment / C27 entertainment-industry; all of I except
  61 privacy. Two named, fillable follow-ups I declared in the posts: D31 needs
  post-109/08 closure counts (LY publishes a budget report every year); D30
  needs the 縣市 announced-zone lists and a 函釋 search on 政府機關（構）.
- 2026-08-08 及更早: drone series 0 -> 30 (zh+en)。已歸檔到
  docs/progress-archive.md，per-post findings 在 plan §5.2——查覆蓋看那裡。
  仍約束我的 SITE FACTS：`category` 是容器、`drone` tag 才是主題（每篇 drone
  放第一個）；未來日期文章不會被 build，已發佈文章連到更晚日期＝硬 404；
  frontmatter glossary 會 shadow 站台預設；沒有 remark-math，數學寫 code block；
  資安檢測規範現行版 V2.0（2026-04-30）；英文文章連中文 slug 曾是全站性缺陷
  （163 檔／742 連結），批次改連結前先讀 archive 裡的三條安全規則。

## 2026-08-16 — RAG enterprise-quality P0

- D1 sync maintains post FTS rows; general queries keep hybrid retrieval; retries use
  critic gaps and disable BM25 short-circuit; language filtering and comparable ranking
  are applied. Writer abstains on weak evidence and critic reviews actual excerpts and
  fails closed. Evaluation scores independent candidate/live output against golden points,
  sources, and forbidden claims. Verification at completion: `pnpm test` 420/420,
  Astro check 0 errors, and `pnpm verify` green. Production rollout continued as Q-009.

## 2026-08-16 — Daily Digest frontend

- 中英頁完成 12 頻道矩陣、計數、URL 篩選、空狀態與共用分類測試；Astro
  check/build 通過。當時 `pnpm verify` 被未追蹤 Arxiv 文章缺參考資料擋住。

- 2026-08-10: drone 38 篇 x zh/en（76 檔）補 series＝「無人機產業拆解」／
  「Taiwan's Drone Industry, Taken Apart」，pillar 產業地圖排 order 1。初版「無人機
  拆解」被退回——站上 187 次「拆解」全搭抽象物（規範／策略／架構），搭實體機器會
  讀成拆機影片，而這系列一台都沒拆。content-plan-drone.md:481 當初決定
  「series 只給支線 D 用」，該判斷已過期（38 篇跨 5 分類且互相回指）。另在
  SERIES_DEFINITIONS 改為 slug-keyed、names 帶 zh/en 兩語，七個系列全部註冊。

- 2026-08-10: drone 系列 15 篇 x zh/en（30 檔）tldr 壓回寫作指南的 1-2 句：08-08 起
  漂成整段摘要（zh 269-676 字，全站中位數 115），現為 143-206 字；PostCard .excerpt
  加 3 行 line-clamp 當保險。正文與 description 未動。

- 2026-08-10: post(ai)「Agent 生產線」系列 7 篇 x zh/en（14 檔）。從 2026-08-08 的
  ByteByteGo 研究產出：①概念界線 ②模型只是元件 harness 才是系統 ③context 與記憶
  ④企業案例橫向讀 ⑤安全 ⑥協定層 ⑦RAG 三形態。原第 6 篇「引用查證」當天下架：
  它是研究工序紀錄不是給讀者的文章（開頭從作者視角寫、有一整節是自我檢討），且
  「五個數字被廣傳」這個賣點我拿不出證據——查證範圍只有 ByteByteGo 一個來源。
  查證結果本來就在寫作前併入七篇，七篇內容不受影響。各篇 1,242–1,930 字，
  全部在寫作指南的 1000–2000 區間。新增全站 glossary: context rot、lost in the
  middle；frontmatter glossary: unattended agent、containment rate。
  過程中先寫了一篇 3,800 字長文再拆掉——長度失控時我用「主題範圍」當藉口砍掉安全
  與 LinkedIn plan-and-execute 兩節，被使用者追問後承認那是把成本考量包裝成品質
  判斷。另攔下兩個自己捏造的引用（MAST 作者名、Meta blog URL），並實查 slopsquatting
  的 arXiv ID（2406.10279 正確）。
