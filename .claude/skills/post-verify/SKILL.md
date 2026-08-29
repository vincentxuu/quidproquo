---
name: post-verify
description: Fact-layer verification for a post draft under src/content/posts/<category>/ — extract every technical claim (version numbers, API names, prices, commands, dates, metrics, quoted statistics), cross-check each against current authoritative sources via the agent's search/scrape tools, and produce a verdict report (Confirmed / Outdated / Unverifiable / Contradicted). Does NOT modify the file. Complementary to `post-review` (which covers style/structure). Use when user says verify 一下 / 查證 / 對一下事實 / fact check / 確認版本 / 驗證 and references a draft post.
---

# post-verify skill

發文前的事實層審查。`post-review` 看格式與風格，**`post-verify` 看「寫的是不是真的」**。模型訓練資料截止會讓 LLM 自信地寫出過時的版本號、API 名稱、定價——這個 skill 抓的就是那些。

只報告，**永不 auto-fix**——是真錯還是只是換個說法，由使用者決定。

## 何時用 vs 跟其他 skill 區分

| 工作 | skill |
|---|---|
| 標題弱、tldr 沒數字、tags 分裂 | `post-review` |
| 章節結構亂、缺 `## 參考資料` | `post-review` |
| 「OpenAI 的 GPT-4 售價 $X」是不是真的 | **`post-verify`** |
| 「LangGraph 1.x breaking change 是 Y」是不是真的 | **`post-verify`** |
| 命令 `pnpm dlx foo` 是不是還能用 | **`post-verify`** |
| 改文章內容 | `post-update` |

## 工具映射

跟 `deep-research` 一樣遵守 Groundlane 邊界；目的不同。公開網頁研究與抓取一律用 Groundlane MCP，不用 `web.run`、WebFetch、Playwright scraping、Exa、Tavily、Firecrawl、Jina 或 Linkup 當 fallback。

| 用途 | 首選 |
|---|---|
| 找官方頁面 / release note / 論文頁 | Groundlane `web_search` |
| 抓官方文件 / release note / 定價頁內容 | Groundlane `web_fetch` |
| 固定欄位或表格抽取 | Groundlane `web_extract` |
| 程式碼 / GitHub 議題 / API spec 導向 | GitHub MCP / `gh api` / 官方 repo；需要讀公開頁再用 Groundlane |

**三條硬規則**：

1. **搜尋摘要不能作為 Confirmed 的依據。** Groundlane `web_search` 回傳的片段只能拿來找候選來源。要判 Confirmed，必須對那個來源做過 `web_fetch` 或來源專用 API 抽取。
2. **抽取驗證用的來源時優先完整讀頁。** 主要來源用 Groundlane `web_fetch`；需要 selector/table 欄位才用 `web_extract`。
3. **Groundlane 未掛載或未授權要明講。** 先檢查完整 callable tool inventory；如果已掛載但 authorization 失敗，回報 blocker，請使用者依 Groundlane free API / free tier 設定方式完成授權。

取不到全文的繞路順序 → `../deep-research/references/mcp-tools.md`

## 執行步驟

### 1. 定位草稿

使用者指定的路徑或 slug。多個候選 → 列出讓使用者挑。

### 2. 抽出所有技術宣告

逐段掃描，分類列出。**抽得寧多勿少**——少抽一條等於漏掉一個風險。

| 類別 | 例子 |
|---|---|
| 版本號 | "Astro 6"、"LangGraph 1.x"、"Node 22.12" |
| API / 函式名 | "createServerClient"、"BedrockModel"、"@tool 裝飾子" |
| 定價 / 數量 | "GPT-4 $30/M tokens"、"5,000 stars in days" |
| 命令 / 旗標 | "wrangler secret put X"、"--frozen-lockfile" |
| 日期 | "2024 年 11 月發布"、"2026 年 1 月 GA" |
| 統計 / metric | "提升 40% 可見度"、"24 passed tests" |
| benchmark 比較 | "A 比 B 快 256 倍"、"在 X-bench 拿 76.0%"、排名表 |
| 授權宣告 | "MIT 授權"、"可商用"、"開源免費" |
| 直接引用 | 「Karpathy 說："xxx"」 |
| 第三方事實 | "Anthropic 在 KDD 2024 發表"、"Princeton 研究團隊" |

**benchmark 與授權這兩類要另外做加驗**，見步驟 3.5——它們最常見的錯誤不是數字抄錯，是數字對但用法錯。

每條紀錄：
- 出現位置（行號或段落）
- 原句
- 類別

### 3. 逐條驗證（依風險決定來源數）

對每條 claim：

1. Groundlane `web_search` 找權威來源（官方文件 / release note / 論文 / 官方 blog 為優先）
2. Groundlane `web_fetch` 抓內容；固定欄位用 `web_extract`
3. 跟 claim 比對

不是所有 claim 都需要硬湊兩個來源；來源數取決於風險：

| Claim 風險 | 例子 | 最低來源要求 |
|---|---|---|
| 高風險 | 價格、版本變更、release 日期、統計數字、benchmark、法律/政策、研究結論 | 2 個獨立來源；至少 1 個 authoritative source |
| 中風險 | API 名稱、命令、設定旗標、產品能力、整合限制 | 1 個 authoritative source 可判 Confirmed；若來源模糊或互相矛盾，再找第 2 個 |
| 低風險 | 官方文件明確列出的基本名詞、套件名稱、站內已驗證的命令片段 | 1 個 authoritative source 即可；報告中標明是 single-source confirmed |
| 直接引用 | 名言、文件原文、論文句子 | 必須找到原始出處；找不到原文就是 Unverifiable |

來源排序：

```
官方 release / docs / 論文  >  作者本人 (X / blog) > 高品質二手  >  內容農場（跳過）
```

每條給 verdict：

| Verdict | 含義 |
|---|---|
| 🟢 Confirmed | 達到該風險等級的來源要求，內容符合 |
| 🟢 Confirmed (single-source) | 低/中風險 claim 由一個明確 authoritative source 支持 |
| 🟡 Unverifiable | 找不到必要來源 / 內容已被改動 / 暫時搜不到 |
| 🟠 Outdated | 來源支持「以前是真的，現在已經變了」 |
| 🔴 Contradicted | 來源直接打臉 |
| 🔵 Misframed | **數字抄對了，但推論或框架錯了**——見步驟 3.5。比 Contradicted 更難抓，因為每個數字單看都正確 |

### 3.5 benchmark 與授權的加驗

這兩類 claim 即使數字完全正確，仍可能整段結論是錯的。數字對不代表可以那樣用。

**benchmark 引用檢查（七問）**

引用任何 benchmark 數字前，逐條回答：

| 檢查 | 抓什麼 |
|---|---|
| 1. 誰做的？ | 廠商自評？榜首是不是作者自家產品？**對所有 benchmark 用同一把尺**——不能只質疑 A 的自評卻照抄 B 的自評 |
| 2. 測量基準對等嗎？ | 常見陷阱：CLI 工具計時含 process spawn、函式庫不含；冷啟動 vs 熱執行；硬體不同。只在同基準的組別之間算倍數 |
| 3. 加總方式可比嗎？ | 各行平均的母體是否相同？樣本數差多少？（例：某工具 70 分只涵蓋 1 種格式，另一個 80 分跨 14 種——同一欄但不是同一件事） |
| 4. 引的是總分還是單項？ | **把單項分數寫成總分是最常見的誤讀**。查清楚該數字出現在哪個維度 |
| 5. 測試集公開嗎？ | 不可複現就要在文中標明 |
| 6. 設定的代價形態？ | 「快 8 倍」是均勻掉幾分，還是某一整類文件直接歸零？後者要寫出來 |
| 7. 作者自己怎麼說？ | README / 論文常有「這欄不該這樣比」的但書。**先讀方法論段落再引數字** |

只要第 1、2、3、4 任一條沒過，該段就是 🔵 Misframed，即使數字全對。

**授權宣告檢查**

| 檢查 | 抓什麼 |
|---|---|
| badge ≠ 授權 | GitHub 的 license badge 只反映一個檔案。程式碼與模型權重常是兩套（`LICENSE` vs `MODEL_LICENSE`） |
| copyleft 的實際射程 | AGPL / GPL 在 SaaS 場景的義務要寫清楚，不能只寫「開源免費」 |
| 附加條款 | Apache/MIT「加上額外條件」的自訂授權很常見：營收門檻、MAU 門檻、揭露義務、自動終止條款。**門檻多半碰不到，揭露與終止條款才會踩到** |
| 一手 vs 一手衝突 | 廠商的 README 與官網文件可能互相矛盾。遇到就**兩邊都列出來**，並把結論改成「要書面向廠商確認」，不要挑一個當真 |
| 數字快照 | 星數、門檻金額都會變，標查詢日期 |

### 4. 產出報告

```
post-verify report: <slug>
─────────────────────────

🔴 Contradicted (要修)
1. 「GPT-4 input $30/M tokens」（line 42）
   → 官方目前 GPT-4.1 input $3/M tokens（2026-05 platform.openai.com 定價頁）
   → 來源 1: https://openai.com/api/pricing
   → 來源 2: https://platform.openai.com/docs/pricing
   建議修法：改寫成「GPT-4.1 input $3/M tokens（2026-05）」

🟠 Outdated (建議修)
2. 「LangGraph 預設 InMemorySaver」（line 88）
   → 1.0 後預設改用 ... 詳見 release note

🔵 Misframed (數字對，但推論錯)
3. 「A 比 LibreOffice 快 256 倍」（line 80）
   → 數字本身沒抄錯，但 README 明說 CLI 工具計時含 process spawn、函式庫不含。
     LibreOffice 是 CLI，A 是函式庫，兩者不同基準
   → 同基準的可比對象是 Docling（也是函式庫），倍數為 109×
   建議修法：改用同基準的 109×，並說明為何不跟 LibreOffice 比

🟡 Unverifiable (待人工確認)
3. 「Princeton 研究中 keyword stuffing 表現 -9%」（line 130）
   → arxiv 2311.09735 abstract 沒列 -9%；Performance Department 整理表有 -9%
   → 建議引用 Performance Department 的 breakdown 文章作為二手對應

🟢 Confirmed (不必動)
4. 「Astro 6 SSR mode」 ✓
5. 「Cloudflare Workers 支援 D1 / Vectorize / KV」 ✓
...
```

### 5. 永不 auto-fix

| 真錯 / 只是表達不同 / 故意保留歷史背景 | 由使用者決定 |
|---|---|
| 改寫法 / 加 disclaimer / 完全保留 | 由使用者決定 |
| 全文搜尋還有沒有同類錯誤 | 使用者要才做 |

報告交付後 skill 結束。如果使用者要修，**改用 `post-update` skill**。

## 反合理化

| 想偷懶 | 為什麼不行 |
|---|---|
| 「LLM 知道答案就直接判 Confirmed」 | LLM 訓練資料截止；Confirmed 必須有外部來源 |
| 「每條都硬湊兩個來源」 | 低風險 API 名稱有官方文件即可；硬湊二手來源反而降低品質 |
| 「高風險 claim 只找一個來源」 | 價格、版本、統計、研究結論容易過時或被轉述錯，至少兩源 |
| 「直接幫他改錯誤」 | 是不是真錯只有作者知道；auto-fix 會導入新錯誤 |
| 「Confirmed 的不報」 | 報告 Confirmed 的避免使用者重複自查 |
| 「跳過 quoted 引用，反正引用一定對」 | 名言類引用最常被 LLM 誤記，要查原始出處 |
| 「Unverifiable 直接判錯」 | 找不到不等於錯，要明確標 Unverifiable |
| 「benchmark 數字抄對就算 Confirmed」 | 數字對、推論錯是這個 skill 最難抓也最該抓的一類。走完步驟 3.5 的七問再判 |
| 「只質疑要介紹的那個工具的自評」 | 雙標。文中引到的每個 benchmark 都要標明誰做的，包含用來佐證的那些 |
| 「授權看 GitHub badge 就好」 | badge 只反映一個檔案；模型權重、附加條款都不在裡面 |
| 「找到官方頁面就當定論」 | 廠商自己的兩份文件可能打架。矛盾時要兩邊都列，別挑一個當真 |
| 「搜尋摘要裡數字對得上就判 Confirmed」 | 片段看不到但書。本站踩過：效果量抄對了，卻漏掉「控制工作記憶後主效果不顯著」——數字對、結論錯 |
| 「抽取時帶 `query` 比較省」 | 省下的是 context，付出的是把片段當全文。驗證來源一律全文抽取 |
| 「付費牆 → 直接判 Unverifiable」 | 先跑繞路清單（出版商免費 snippets、引用它的開放取用論文、機構典藏）。真的都沒有才判 Unverifiable，並在報告寫明試過哪幾條 |
| 「多個二手來源說法一致就算兩源」 | 二手站會集體抄同一個錯，那是一個來源不是多個。價格與產品線一律回官方頁 |
| 「這個數字我前面講過了，不用再查」 | **自己在對話或摘要裡講出的數字不是來源。** 本站踩過：把口頭說的「18 份投影片」直接寫進文章，實際是 17 個連結。凡是要進文章的數字，一律回原始材料重數一次，不管你多確定 |
| 「每條 claim 都 Confirmed，這篇就沒問題了」 | **本 skill 只驗準確度，不驗覆蓋度。** 全綠只代表「寫出來的每句話是對的」，不代表「該寫的都寫了」。而漏寫恰恰是驗證流程自己製造的：驗證以 claim 為單位，掛不上證據的部件從頭到尾不會進入清單，於是永遠不會被標記為缺。報告結尾固定加一句範圍聲明：**「本次只檢查了文中已提出的 N 條宣告，未評估文章對主題的覆蓋是否完整」**，覆蓋缺口交給 `post-review` 的步驟 6.5 |
| 「連結是活的就算有出處」 | 連結回 200 不代表那一頁支持你的宣稱。本站踩過：引 OWASP 2026 版卻掛到 2025 版的頁面，日期也錯一天。**逐條問：打開這個 URL 的人，看得到我說的那句話嗎？** 看不到就是換連結或刪宣稱 |

## 跟既有 skill 的關係

```
   post (新文)              post-update (改舊文)
        │                          │
        ▼                          ▼
   post-review (style)        post-verify (fact)
        │                          │
        └──────── 報告 ───────────┘
                    │
                    ▼
               使用者決定要修哪些
                    │
                    ▼
              post-update 動手改
```

`post-review` 與 `post-verify` 可以同時跑（不衝突），但兩個 skill 報告分開閱讀，不要混在一起。

## 詳細參考

- 寫作風格與 GEO 規則：`../post/references/writing-guide.md`
- frontmatter schema：`../post/references/frontmatter-schema.md`
- 改文章流程：`post-update` skill
