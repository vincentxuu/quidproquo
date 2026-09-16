# 內容商業模式系列群完成度稽核

稽核日期：2026-09-17
方法：本機 frontmatter／Markdown／路徑掃描，不做外網研究、不修改文章。

## 結論

**系列群結構完成，沒有找不到目標的內鏈、遺失中英配對、漏雙向語言連結、重複 order 或缺參考資料章節。** 本次納入 66 個內容檔（33 組 zh/en）。

唯一的順序例外是母系列 `Content Selling Business Models`／`內容販售商業模式拆解` 缺 metadata order 2。這不是遺失稿：規劃明確讓 order 2 連到另一個既有系列「一個人的媒體公司」，而該中英入口都存在。`check:series-order` 仍會把它列為 warning；整合時應保留為已知例外，不要為消除 warning 複製文章或竄改另一系列 metadata。

## 系列完成矩陣

| 範圍 | 預期 | 實際 | zh/en | order | 導讀／入口 | 結論 |
|---|---:|---:|---|---|---|---|
| 母系列總覽 | 1 組 | 1 組 | 完整 | order 0 | 中英互鏈，連到三個導讀、OMP、AI order 0 | PASS |
| B2B 子系列 | orders 0–6＋導讀 | 7 組＋1 組導讀 | 完整 | 0–6 無缺／無重 | 導讀中英各自連到 0–6 | PASS |
| 創作者平台 | orders 1–7＋導讀 | 7 組＋1 組導讀 | 完整 | 1–7 無缺／無重 | 導讀中英各自連到 1–7 | PASS |
| 免費內容 | orders 1–8＋導讀 | 8 組＋order 0 導讀 | 完整 | 0–8 無缺／無重 | 導讀中英各自連到 1–8 | PASS |
| AI 搜尋 | orders 0–6 | 7 組 | 完整 | 0–6 無缺／無重 | metadata 驅動站內 series nav；5↔6 另有文內導覽 | PASS |
| 一個人的媒體公司 | 既有中英入口 | 1 組既有入口 | 完整 | 保留其原系列 | 母總覽與平台導讀均有連結 | PASS |

## 母系列與導讀定位

母系列中英 frontmatter 目前有 order 0、1、3：

- order 0：`2026-09-16-content-selling-four-models{,-en}.md`
- order 1：`2026-09-16-b2b-intelligence-business{,-en}.md`，同時是 B2B 導讀
- order 2：不另建檔，連到 `career/2026-08-26-one-person-media-company-overview{,-en}.md`
- order 3：`2026-09-16-ugc-platform-creator-economy{,-en}.md`，同時是創作者平台導讀

免費內容導讀 `2026-09-16-free-content-side-monetization{,-en}.md` 直接使用子系列 order 0。這三種定位不完全相同，但連結與讀者路徑均成立。

## 逐系列 order 與圖表盤點

數字格式為 `Mermaid / 表格資料列`。表格資料列為 Markdown `|...|` 行數，包含 header 與 separator，因此只用來確認「有表」，不當成資料筆數。

### B2B：情報如何成為一門企業生意

| order | slug | zh | en | 圖表 |
|---:|---|---|---|---|
| 0 | digitimes-supply-chain-intelligence | ✓ | ✓ | 2 / 5 |
| 1 | the-information-exclusive-news | ✓ | ✓ | 1 / 6 |
| 2 | seeking-alpha-contributor-marketplace | ✓ | ✓ | 2 / 7 |
| 3 | cb-insights-research-to-workflow | ✓ | ✓ | 1 / 6 |
| 4 | pitchbook-private-market-data | ✓ | ✓ | 3 / 11 |
| 5 | gartner-decision-insurance | ✓ | ✓ | 2 / 6 |
| 6 | taiwan-vertical-intelligence-opportunity | ✓ | ✓ | 2 / 7 |

導讀：`b2b-intelligence-business{,-en}`，3 Mermaid／8 表格行；涵蓋 0–6 全部內鏈。

### 創作者平台：誰掌握創作者與讀者的關係

| order | slug | zh | en | 圖表 |
|---:|---|---|---|---|
| 1 | medium-vocus-platform-distribution | ✓ | ✓ | 2 / 8 |
| 2 | substack-ten-percent-discovery | ✓ | ✓ | 3 / 12 |
| 3 | patreon-membership-value-ladder | ✓ | ✓ | 2 / 8 |
| 4 | ghost-ownership-not-just-hosting | ✓ | ✓ | 3 / 8 |
| 5 | beehiiv-newsletter-operating-system | ✓ | ✓ | 2 / 9 |
| 6 | creator-platform-migration-assets | ✓ | ✓ | 2 / 8 |
| 7 | taiwan-creator-platform-choice | ✓ | ✓ | 3 / 8 |

導讀：`ugc-platform-creator-economy{,-en}`，3 Mermaid／8 表格行；涵蓋 1–7 全部內鏈，也連到 OMP 中英入口。

### 免費內容：免費內容如何替別的生意獲客

| order | slug | zh | en | 圖表 |
|---:|---|---|---|---|
| 0 | free-content-side-monetization（導讀） | ✓ | ✓ | 2 / 10 |
| 1 | anue-attention-ad-market | ✓ | ✓ | 3 / 7 |
| 2 | cmoney-content-tool-community | ✓ | ✓ | 3 / 7 |
| 3 | biggo-finance-ai-content-funnel | ✓ | ✓ | 2 / 7 |
| 4 | fugle-information-to-trading | ✓ | ✓ | 3 / 5 |
| 5 | affiliate-marketing-unit-economics | ✓ | ✓ | 3 / 15 |
| 6 | free-tools-seo-compounding | ✓ | ✓ | 3 / 8 |
| 7 | content-acquisition-cac-ltv | ✓ | ✓ | 3 / 15 |
| 8 | ai-takes-clicks-free-content-assets | ✓ | ✓ | 2 / 7 |

導讀已連到 1–8 全部 slug。order 8 的 Cloudflare request/request 與 Pew 事後重跑分類修正已出現在目前稿件。

### AI 搜尋：AI 搜尋正在重寫內容生意

| order | slug | zh | en | 圖表 |
|---:|---|---|---|---|
| 0 | ai-overviews-change-traffic-path | ✓ | ✓ | 2 / 7 |
| 1 | answer-engine-content-commoditization | ✓ | ✓ | 2 / 7 |
| 2 | ai-search-block-license-lawsuit | ✓ | ✓ | 4 / 6 |
| 3 | seo-to-brand-direct | ✓ | ✓ | 2 / 9 |
| 4 | first-party-community-tools | ✓ | ✓ | 2 / 7 |
| 5 | content-model-ai-exposure-defense | ✓ | ✓ | 2 / 6 |
| 6 | ai-era-content-asset-portfolio | ✓ | ✓ | 2 / 7 |

order 5 的 quadrant 3／4 已在目前稿件修正。AI 系列沒有獨立於 order 0 的導讀檔，但 0–6 的 metadata 完整，網站版型會依 series/order 產生前後篇導覽；不構成缺稿。

## 全檔機械檢查結果

- 33 組 zh/en 均存在。
- 66 檔均有正確語言切換連結，且 counterpart 反向連回原檔。
- 66 檔均有 `## 參考資料`／`## References`。
- 66 檔均至少有 1 張 Mermaid 與 1 個 Markdown 表格。
- 所有 scoped Markdown 內部文章連結均可解析到現存檔案：0 個不存在目標。
- B2B、創作者、免費內容三個導讀均涵蓋其所有 order。
- 沒有子系列重號；B2B 0–6、創作者 1–7、免費內容 0–8、AI 0–6 均連續。
- 母系列 order 2 是刻意外接 OMP 的已知 warning，不是遺失檔。

## Blocking gaps

**結構層面無 blocking gap。** 發布／commit 前仍應把整合後的 `pnpm verify` 當最後 gate；本報告不把各 review dossier 的舊必修標題本身視為未修，因為多份文章已在 review 後更新，必須以目前文章內容為準。

唯一需要在交付說明中明列的例外：

1. 母系列 order 2 不在同 series metadata 中，`check:series-order` 可能持續 warning；原因是它指向既有 OMP 系列。
2. `the-information-exclusive-news` 與 `cb-insights-research-to-workflow` 各只有 1 張 Mermaid，但都有表格與參考資料。系列計畫要求圖表有解釋價值，並未對這兩篇設定 2 張的硬 gate，因此不列 blocking。

## 建議納入系列群 commit 的 paths

### 發布內容（66 檔）

- 母系列／導讀：
  - `src/content/posts/product/2026-09-16-content-selling-four-models{,-en}.md`
  - `src/content/posts/product/2026-09-16-b2b-intelligence-business{,-en}.md`
  - `src/content/posts/product/2026-09-16-ugc-platform-creator-economy{,-en}.md`
- B2B orders 0–6：
  - `2026-09-16-{digitimes-supply-chain-intelligence,the-information-exclusive-news,seeking-alpha-contributor-marketplace}{,-en}.md`
  - `2026-09-17-{cb-insights-research-to-workflow,pitchbook-private-market-data,gartner-decision-insurance,taiwan-vertical-intelligence-opportunity}{,-en}.md`
- 創作者 orders 1–7：
  - `2026-09-17-{medium-vocus-platform-distribution,substack-ten-percent-discovery,patreon-membership-value-ladder,ghost-ownership-not-just-hosting,beehiiv-newsletter-operating-system,creator-platform-migration-assets,taiwan-creator-platform-choice}{,-en}.md`
- 免費內容 order 0–8：
  - `2026-09-16-free-content-side-monetization{,-en}.md`
  - `2026-09-17-{anue-attention-ad-market,cmoney-content-tool-community,biggo-finance-ai-content-funnel,fugle-information-to-trading,affiliate-marketing-unit-economics,free-tools-seo-compounding,content-acquisition-cac-ltv,ai-takes-clicks-free-content-assets}{,-en}.md`
- AI 搜尋 orders 0–6：
  - `2026-09-17-{ai-overviews-change-traffic-path,answer-engine-content-commoditization,ai-search-block-license-lawsuit,seo-to-brand-direct,first-party-community-tools,content-model-ai-exposure-defense,ai-era-content-asset-portfolio}{,-en}.md`

以上未帶完整前綴者都位於 `src/content/posts/product/`。

### 研究與工作 SSOT（系列相關，可另做 research/work commit）

- `.research/content-business/` 全部 dossier、review 與本 audit。
- `.work/content-business-series-plan.md`
- `.work/content-business-batch-a-brief.md`
- `progress.txt` 的內容系列狀態更新。

### 相關但建議獨立 commit

- `src/pages/posts/[...slug].astro`：Mermaid light/dark theme variables 與 rendering theme 調整。它服務本批大量圖表，但屬網站程式碼，不是內容稿；應獨立 review／test／commit，避免混在 66 檔內容 commit。

## 疑似其他 session／unrelated paths

- `.research/2026-09-16-biggo-finance-podcast-ai-teardown.md`：位於舊的 `.research/` 根層，不在本次統一的 `.research/content-business/` SSOT；Git 顯示 untracked。它可能是 BigGo dossier 的前置來源，但不是本系列批次建立的標準 owned path。**不要自動納入內容 commit**；若要保存，先由擁有它的 session／使用者確認，再單獨納入 research commit。
- `src/pages/posts/[...slug].astro`：如上，可能來自視覺／版型 session，不能假定由內容批次擁有。
- `progress.txt`：雖與本計畫相關，但屬共享治理檔；commit 前需確認沒有覆蓋其他 session 的最新狀態。
- `.work/content-business-*` 與 `.research/content-business/`：主題相關，但含多 agent 研究產物。可納入系列研究 commit，不應和不相干程式碼一起用 `git add .`。

## Commit 前的安全選檔方式

不要使用 `git add .`。先用上述明確內容路徑建立 66 檔清單，核對 `git diff --name-only --cached`；研究、工作檔、Mermaid renderer 與 legacy BigGo teardown 分開決定。這能避免把共享 worktree 的 `src/pages/posts/[...slug].astro` 或根層研究檔意外帶入內容 commit。
