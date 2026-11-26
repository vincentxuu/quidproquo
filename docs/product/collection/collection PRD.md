# Collection — 個人動漫/電影/戲劇收藏館（quidproquo.cc 整合版）

> 參考站：https://initiald.fan/zh/（單一 IP 深耕型粉絲百科）
> 本規格由原「media-vault 獨立專案」規劃改寫為站上整合版（2026-11-15）。

## 1. 使用者意圖

四層意圖，由深到淺（分 Phase 實現，不一次全做）：

1. **回顧**：看過的作品有結構化沉澱——評分、狀態、一句話感受、最愛場景。
2. **深耕真愛**：少數真愛作品有獨立深度頁（像 initiald.fan 的車隊頁/傳奇頁）。
3. **分享品味**：訪客 30 秒看懂「這個站主喜歡什麼、為什麼」。
4. **當推薦引擎**：朋友問「有什麼好看的」時丟一條 `/collection` 連結。

## 2. 與既有站點體系的關係（已確認）

- **收藏館為主體 + 文章連結**：收藏頁是結構化資料驅動的主體；真愛作品的心得日後寫成 posts（`film`/`anime` 分類已存在但尚無文章，收藏館會是該領域第一個內容），收藏頁與文章互相連結。
- **URL**：`quidproquo.cc/collection`（en 鏡像 `/en/collection/`）。
- **Hero 定調**：Hero 代表「我 / 我的收藏」，不是任何單一作品。內容為個人宣言 + 收藏統計（看了 N 部、真愛 M 部、品味關鍵詞）+ **收藏牆拼貼**（全站海報馬賽克，新增收藏自動長大）。單一作品的氣質只在自己內頁展開。

## 3. 現況苦工

| 苦工 | 類型 | 解法 |
|---|---|---|
| 每部作品基本資料（片名/年代/類型/簡介/海報）逐筆敲 | 重複勞動 | AI 提案 → 確認（build-time 腳本） |
| 寫心得從零開始 | 空白恐懼 | 小格子填空 → 草稿 → 改稿 |
| 為真愛做深度頁工程量大 | 重複勞動 | 角色場景 AI 提案 → 勾選 → 骨架生成 |
| 視覺做出 initiald.fan 質感 | 一次性 | 沿用站上 tokens.css + PostLayout 設計語言 |

## 4. Agent 介入設計（build-time，零 runtime AI 成本）

收藏是靜態資料 + prerender 頁面，AI 流程走本機腳本/skill，成果 commit 進 git。**不用 D1、R2、Workers AI runtime**。

### 4.1 新增作品 — 模式 A：輸入 → 提案 → 確認

- 執行 `pnpm collection:add "片名"`（或貼 Douban/IMDb/AniList/TMDB 連結）
- 腳本查 TMDB / AniList 公開 API → 回傳候選清單（海報縮圖、年份、類型）
- CLI 選單挑選 → 確認後自動寫入 `src/data/media-collection.json` + 下載海報至 `public/images/collection/`
- 站主手工欄位（**AI 永不代勞**）：評分、觀看狀態、私人筆記、一句話感受
- 簡介由 AI 草擬，git diff 時人工確認

### 4.2 評價工作台 — 快評＋慢評（`scripts/collection-review.mjs`，已實作）

- 用法與各步驟的輸入格式見腳本開頭註解；`--list` 列待快評、待慢評、主題曲待確認。
- **快評**（必填）：分數＋收藏等級。`rating` 為 0 就是「待評」，作品頁在快評前不顯示等級與評價區塊（`tier` 只是預設值）。
- **慢評**（每項可跳過）：一句話、推薦給、最愛角色（從 meta 角色牆勾選）、最愛場景、主題曲影片逐首確認（拒絕的標 `rejected`，頁面不嵌入、重跑抓影片腳本不覆蓋）。
- **一句話的邊界（2026-11-26 站主決定）**：站主隨口打感想，工具只把原話切成句子與子句當候選，站主選一句、可小改；工具不改寫、不生成。原話可選擇存成 `review`。
- 原規劃的「AI 依四格產生 300~600 字心得草稿」未實作：心得只收站主原話。

### 4.3 深度頁（真愛專屬）— 模式 B

- `pnpm collection:deep <slug>`：AI 依作品資料提案角色清單與經典場景 → CLI 勾選 → 產生角色介紹/場景賞析/金句的**骨架** → 逐格編輯定稿

## 5. 資料 schema（`src/data/media-collection.json`）

```jsonc
{
  "works": [{
    "slug": "initial-d-first-stage",     // URL 用
    "type": "anime",                     // anime | film | drama
    "title": "頭文字D", "originalTitle": "頭文字D",
    "year": 1998, "genres": ["賽車", "青春"],
    "poster": "/images/collection/initial-d-first-stage.jpg",
    "externalIds": { "tmdb": "...", "anilist": "..." },
    "synopsis": "…",                     // AI 草稿，人工確認
    "rating": 9.5,                        // 站主手填 1~10
    "status": "finished",                 // finished | watching | dropped
    "oneLiner": "…",                      // 站主手填一句話
    "favoriteScenes": ["…"],
    "audience": "同好",
    "review": "…",                        // 心得（Phase 2 由腳本生成草稿）
    "tier": "favorite",                   // favorite(真愛) | loved | watched
    "postSlugs": ["film/xxx"],            // 連結既有/未來影評文章
    "deep": { "characters": [], "scenes": [], "meaning": "" } // 真愛深度頁資料
  }]
}
```

## 6. 頁面與檔案對應（既有程式）

| 需求 | 做法 | 對應既有檔案 |
|---|---|---|
| 收藏資料 | `src/data/media-collection.json` | 範本：`src/data/agent-watchlist.json`、`src/data/climbing-videos.ts` |
| 收藏館首頁 `/collection` | prerender 敘事頁：Hero（宣言+拼貼牆）→ 三類型精選 → 真愛 TOP 5 → 深度頁入口 | 對照 initiald.fan 首頁區塊 |
| 作品單頁 `/collection/[slug]` | 真愛作品深度頁，prerender | 模式同 `src/pages/posts/[...slug].astro` |
| 收藏卡牆元件 | `CollectionCard.astro` | 模式同 `src/lib/videoGallery.ts` + 卡牆 CSS |
| Nav 連結 | header nav 加「收藏」 | `src/layouts/PostLayout.astro` L114-136 + `src/i18n/ui.ts` |
| 主題色 | 若需新 badge 色只改 tokens | `src/styles/tokens.css`（`--cat-anime`、`--cat-film` 已存在） |
| 海報圖 | `public/images/collection/` | 公開目錄直用 |
| AI 腳本 | `scripts/collection-{add,review,deep}.mjs`（review 已實作；跟既有收藏館腳本一樣用 `node scripts/…` 執行） | 模式同既有 scripts 慣例 |

## 7. 可控性檢查

- [x] 每個 agent 動作前後都有介入點：提案→挑選、草稿→git diff 人工改稿
- [x] 結果落在預期內：腳本只回結構化欄位/指定段落
- [x] 可重生 / 微調：腳本可重跑覆蓋單一欄位；心得逐段可改
- [x] 融進流程非 chat：三個 CLI 工作台（add / review / deep）
- [x] 評分、狀態、一句話感受、私人筆記永遠站主手填——保住「是我的收藏」成就感

## 8. 里程碑

- **Phase 1**：`media-collection.json` schema + `collection.astro`（Hero 拼貼牆原型 + 三類型列表）+ 作品基本單頁 + nav 連結。先手動填 3~5 部驗證資料結構
- **Phase 2**：AI 腳本三件套（add / review / deep）+ 海報下載
- **Phase 3**：真愛深度頁打磨（initiald.fan 質感：大圖 Hero + 區塊敘事）+ OG 圖（掛進 `generate-og-images.mjs`）
- **Phase 4**：`check-lang-parity` 對應的 en 鏡像 + 篩選/搜尋整合（接既有 search 頁）+（遠期）續集通知

## 9. 守門與風險

- `check-lang-parity`：collection 頁需 en 對照，Phase 1 可先暫列豁免、Phase 4 補齊
- `check-post-quality` / `check:references`：只管 posts，不影響 collection 頁
- 海報版權：僅作個人收藏展示用途（與站上既有慣例一致）
- `pnpm lint` / `pnpm verify` 需通過

## 10. 下一步

- [ ] 轉 OpenSpec change（`openspec/changes/collection-phase-1/`）或直接開工 Phase 1
- [ ] 準備 TMDB API key（免費申請）供 collection:add 使用
- [ ] 決定首批收錄清單（建議先 3 部動漫 + 3 部電影 + 2 部戲劇）
