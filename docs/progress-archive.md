# progress.txt 歸檔

`progress.txt` 是 working memory，不是日誌：完成、過期或不再需要每個 session 都看到的條目移到這裡（最新的段落放最上面）。協定見 `docs/governance/operating-charter.md`。

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
