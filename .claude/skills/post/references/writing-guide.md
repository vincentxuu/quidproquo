# quidproquo 寫作風格指南

## 核心原則

寫給「一週後的自己」看，也寫給遇到同樣事情的人看。具體 > 抽象，可驗證 > 模糊聲明。

## 各分類風格

**tech（問題解決型 / `type: debug`）**：直接、具體，程式碼要完整，含可複製的命令。標題包含關鍵錯誤或技術名稱。結構固定：情境 → 問題 → 嘗試 → 解法 → 原因 → 學到的事。篇幅精簡，不需要鋪墊。

**tech / ai（專文介紹型 / `type: deep-dive`）**：適合介紹工具、技術棧、架構設計。目標長度 1000-2000 字。不需要大量第一人稱經驗，介紹文的價值在於讓讀者理解工具、做出選擇。每個段落至少展開：設計哲學 / 跟常見替代方案的比較 / 適合與不適合的情境 / 具體用法 / 限制。有程式碼範例就加，架構圖用 ASCII 畫。標題直接點主題，不要加「的解法」。

**guide / `type: guide`**：是 how-to，讀者期望照著做能複製結果。每步寫前置條件、可貼可跑的命令、預期輸出、常見錯誤。

**project / `type: project`**：自己做的東西。從問題出發，說清楚為什麼做、怎麼做、做出來之後呢、現在還活著嗎。

**climbing**：臨場感。路線名稱、岩場地點、身體感受要寫出來。
**surf**：狀態、浪況、感受。不需要技術術語，但要有畫面。
**film**：不劇透開頭，說清楚為什麼值得看（或不值得）。
**coffee**：豆子來源、風味描述、沖煮參數（有的話）。
**career**：誠實，包含猶豫和失敗的部分，對讀者最有用。
**life**：隨意，不需要結構。

## Title 原則

- 具體 > 抽象
- `tech` debug 類：包含錯誤關鍵字，結尾常加「的解法」「踩坑記錄」
- 其他：直接說這篇在講什麼，配一句點題副標（用全形冒號連接）
- 避免賣弄詞或網路梗，標題會留很久

## tldr / description 原則

- `tldr`：1-2 句、含名詞與數字，讀者用來決定要不要點進來
- `description`：SEO meta，1-2 句，描述「這篇講什麼」而不是「這篇有多好」
- 不要兩個欄位寫一樣

## tags 原則

- 全小寫 kebab-case：`claude-code` ✅、`Claude Code` ❌
- 用既有 tag 優先，避免同義詞分裂（`llm` vs `large-language-model`）
- 寫前先看附近文章用什麼 tag：
  ```bash
  grep -h "^tags:" src/content/posts/<category>/*.md | sort -u
  ```
- 一篇 3-7 個就好，**核心主題在前**

## 語氣

- 直接，不客套
- 可以有情緒、可以說「不推薦」、「踩到坑」
- 不需要介紹自己

## AI 搜尋友善（GEO）

依 Princeton / Georgia Tech / Allen AI / IIT Delhi 在 KDD 2024 發表的 GEO 論文（arxiv 2311.09735），這幾條會顯著影響 ChatGPT / Claude / Perplexity 引用你文章的機率：

| 規則 | 量化效果 | 怎麼做 |
|---|---|---|
| **Inline 直接引用權威原文** | Quotation Addition +41% | 不要只放連結；把官方文件 / release note / 論文段落 quote 出來，標明出處 |
| **數字 > 形容詞** | Statistics Addition +33%（Perplexity 上 +37%） | 「很貴」改「$30/M tokens」、「很多」改「5,000 stars in 3 days」 |
| **流暢度 > 術語密度** | Fluency Optimization +29% | 簡潔通順比堆技術詞或唯一字更被引用 |
| **Inline 標來源**（不是只在文末） | Cite Sources +28%（一般站）；對 SERP 第 5 名的網站 **+115.1%** | 引用就 inline 標：「依 Anthropic 文件...」、「KDD 2024 報告...」 |
| **不要關鍵字塞詞** | Keyword Stuffing **−9%**（懲罰） | 同一關鍵字硬塞會被 GEO 打分扣回去 |

### 在 quidproquo 怎麼落實

- 引述外部研究、官方文件 → 直接 quote 原文段（一兩句），標明出處
- 比較數字 → 用具體 metric 而非形容詞（速度差「快很多」→「快 3.2 倍 / TTFT 從 800ms 降到 250ms」）
- 第一段就帶 1-2 個關鍵數字或名詞，方便被當成 snippet 抽取
- 文末 `## 參考資料` 列完整來源清單**不能取代** inline 標來源
- 寫長文時，每個主要章節都要至少一個可引用的事實點（數字、quote、版本號）

## 參考資料規則（硬性）

- 文章引用外部工具、框架、模型、官方文件、論文、版本資訊、數據比較、外部說法 → 文末必須有 `## 參考資料`
- 用 Markdown 清單，格式：`- [顯示名稱](URL)`
- 比較多個工具時，**每個主要對象都要有一條**對應連結，不要只放一條泛用首頁
- 站內連結用相對路徑：`[文章標題](/posts/<category>/<slug>)`
- `tech` / `ai` / `learning` / `education` / `policy` / `design` / `marketing` / `product` 類**預設都要有**參考資料
- 寫完跑：
  ```bash
  pnpm check:references
  ```
  有錯誤先修。

## Inline 連結規則（論文 / 工具 / 外部資源）

文末 `## 參考資料` 只是清單，**不能取代 inline 連結**。讀者在文章中間讀到名稱就想點，等到文末才有連結會流失。

- **論文**：名稱第一次出現時就設為超連結，指向 arXiv abstract 頁（`https://arxiv.org/abs/XXXX.XXXXX`）或 DOI。格式：`[PaperName](https://arxiv.org/abs/...)（arXiv:XXXX.XXXXX）`
- **工具 / 框架**：名稱第一次出現時連結到官方文件或 GitHub repo，後續提及不需重複連結
- **比較表**：表格第一欄的論文 / 工具名稱都要有連結，讓讀者能直接從表格跳轉
- arXiv ID 裸文字（`arXiv:2605.27366`）出現時，本身也要是可點擊連結，不是純文字

不需要每次提及都加連結——**同一篇文章中，第一次出現 + 比較表** 這兩處有連結即可。

## 寫前 / 寫後 checklist

寫前：
- [ ] category 是現有的（不要自己創）
- [ ] tags 看過附近文章，沒有同義詞分裂

寫後：
- [ ] frontmatter 必填欄位齊全
- [ ] tldr / description 有具體名詞與數字
- [ ] 引用的外部資源都在 `## 參考資料` 列出
- [ ] 論文 / 工具名稱**第一次出現**時是可點擊連結（inline，不是只在文末）
- [ ] 比較表第一欄的論文 / 工具名稱都有連結
- [ ] `pnpm check:references` 全綠
- [ ] `pnpm lint` 全綠
- [ ] `pnpm astro check` 全綠
- [ ] 已給使用者 review，得到明確 OK
