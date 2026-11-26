# UI delivery record — Collection Phase 1

## Scope and design

- Task / source revision: `/collection` 收藏館頁 + `/collection/[slug]` 作品頁 + nav 連結（feature/collection branch，自 `claude/fervent-clarke-8irxu7` 分出）
- Design source and controls reused: `src/styles/tokens.css`（--cat-anime/--cat-film/--cat-drama、--text/--bg/--border tokens、dark mode）、`PostLayout.astro` 共用版面；新增 `src/styles/collection.css`，色彩只取 token，另在 tokens.css 新增 `--cat-drama: #7c3aed`（dark theme 不覆寫 --cat-*，既有行為一致）
- Tool restrictions: 本機無截圖驗收授權紀錄，視覺驗收保留待驗；`pnpm test:visual` 未執行

| Screen / consumer | Relevant state or flow | Viewport / theme | Expected outcome |
|---|---|---|---|
| PostLayout nav（所有頁面 consumer） | zh-TW 顯示「收藏館」；en 不顯示（en 頁面 Phase 4 才做，避免 404） | 桌面 + 窄螢幕、深淺色 | nav 不溢出、連結可達 /collection |
| /collection（zh-TW） | 8 筆種子資料；真愛 TOP5 + 三類型區塊 + 空分類時 dashed 空狀態 | 桌面 + 窄螢幕（640px 斷點：mosaic 6 欄、work-hero 單欄）、深淺色 | hero 統計、拼貼牆、卡片可點擊 |
| /collection/[slug]（8 個） | 場景/心得/深度/延伸文章區塊依資料有無條件渲染；無 poster 用 slug 漸層 + 標題文字 | 桌面 + 窄螢幕、深淺色 | 資訊完整、回收藏館連結 |

## Evidence

| Gate | Status | Evidence / revision | Remaining work |
|---|---|---|---|
| Source and automated checks | pass | `pnpm lint` 0 errors；`pnpm exec astro check` 0 errors（84 hints 皆既有）；`pnpm build` 成功，`dist/client/collection/` 生成 index + 8 作品頁；`pnpm verify`（pre-commit）all green，commit `71b3dee64` | — |
| Interaction | pending | 連結導向 /collection/<slug> 為靜態 href；無 JS 互動邏輯 | 使用者或指定 reviewer 操作驗收 |
| Visual review | pending | 需瀏覽器驗收（深淺色 × 桌面/窄螢幕） | 待驗 |
| Deployment confirmation | not applicable | feature branch PR 流程，未部署 | — |

## Review findings

- 新增 `nav.collection` i18n key 於 `src/i18n/ui.ts`（zh-TW + en）；en nav 暫以 `lang !== 'en'` 條件隱藏，Phase 4 補 `/en/collection` 後移除條件。
- 無海報圖時以 `getGradientFor(slug)`（src/lib/collection.ts）產生穩定漸層，tile 內文字有 text-shadow 確保對比；Phase 2 海報下載後 poster 非空即改用 `<img>`。
- 評分/狀態/oneLiner 顯示於卡片與單頁 badge，皆為站主手填欄位，AI 不代勞（資料 schema 註解已標明）。
- `check-lang-parity` 針對 posts（zh/en md 配對），collection 頁不適用；此豁免已在 PRD 記錄。

## Delivery decision

- Ready stages and supporting evidence:（自動化檢查跑完後補）
- Pending acceptance / owner: 視覺與操作驗收待使用者
- Published revision, if authorized: 未授權發佈
