# 產品評估：幫「技術不熟但想要自己的 AI 部落格」的人做出來

評估日期：2026-07-27（TA 釐清後重寫）　｜　狀態：建議做，但先驗一個技術前提

## 修正

第一版評估把「快速做出 AI 部落格」讀成**量產內容農場**，據此主張不要服務非技術者。TA 釐清後這個前提是錯的：你的使用者要的是**一個人、一個屬於自己的部落格**，不是一天發五十篇。對他來說 Google 的 scaled content abuse 幾乎不成立——那條政策打的是量，不是「用了 AI」。

結論因此翻轉：**這個產品值得做**，而且有一個很硬的時機理由。

---

## 1. 為什麼是現在：終端機這道牆剛倒

「非技術者想要 AI 部落格」一直沒被好好服務，原因不是沒需求，是**過去這件事必須開終端機**。裝 Node、設 git、跑 npm、看懂 PATH——每一關都在殺人。

2026 年這道牆倒了：

**Claude 側**——Cowork 用[官方的話](https://support.claude.com/en/articles/13345190-get-started-with-claude-cowork)說是「the same agentic architecture that powers Claude Code, **with no terminal required**」。而且：

- 桌面版能**直接讀寫你本機的檔案**，不用上傳下載。
- 讀寫 `.md`、`.docx`、`.xlsx`、`.csv`、圖片、`.yaml` 等等。
- 可以裝 **plugin**（skill + connector + sub-agent 的組合包），從 [claude.com/plugins](https://claude.com/plugins) 一鍵安裝。
- 能**排程無人值守執行**——關了筆電它繼續跑。
- 含在 **Pro $20/mo**（官方註明 Cowork 消耗額度比 Chat 快）。
- 桌面、網頁、手機都能用（後兩者 beta）。

而依 [Claude Code 官方文件](https://code.claude.com/docs/en/skills)，Cowork session 載入的是**你 claude.ai 帳號啟用的 skill**，從桌面版側欄的 Customize 或 claude.ai 設定管理——**完全不碰檔案系統**。

**OpenAI 側**——ChatGPT 桌面版側欄有 Skills 面板，ChatGPT 與 Codex [共用同一個 plugin 目錄](https://learn.chatgpt.com/docs/skills-and-plugins)。

**所以整條產線現在可以零終端機跑完。** 這是一個時機窗口，而且大多數人還沒反應過來——市面上的 skill pack 幾乎都還在教人 `git clone` 跟 `/plugin install`。

---

## 2. 對手其實沒有正面對上

第一版我說 Wix / Framer / Squarespace / Lovable 讓你勝算為零。**這個判斷太快了**，因為它們解的不是同一個問題：

| | 它們給你 | 你的 TA 真正要的 |
|---|---|---|
| Wix / Framer / Durable | 一個**網站** | 網站只是容器 |
| Substack / Medium | 一個**發表平台** | 但內容還是要自己生 |
| Jasper / Copy.ai / Frase | 一段**文字** | 但要複製貼上、沒有自己的檔案 |
| **你的產品** | 一條**產線**：研究 → 寫作 → 查核 → 發布，跑在他自己的檔案上 | ✅ |

關鍵差別是**「自己的」**三個字。Wix 給的網站住在 Wix，Substack 給的文章住在 Substack。你的 TA 說「我想做**自己的** AI 部落格」，那個「自己的」包含檔案是他的、能搬走、AI 直接改。這件事沒有人在賣給非技術者。

至於「一鍵生成整個部落格」那類 AI 網站生成器——它們生完就結束了，**沒有持續寫作的產線**。你的 TA 第二篇文章要怎麼寫，它們沒有答案。

---

## 3. 產品長什麼樣

三個零件，一個都不能少：

### ① Plugin（核心價值）

裝在 Cowork / ChatGPT 桌面版，內含幾個 skill：

| Skill | 做什麼 | 對應你既有的 |
|---|---|---|
| 研究 | 拆子問題 → 多源蒐集 → 交叉驗證 → research note | `deep-research` |
| 寫作 | research note → 帶 frontmatter 與引用的文章 | `post` |
| 審稿 | 結構、tldr、tag、標題階層 | `post-review` |
| 查證 | 抽出所有事實逐條對回權威來源 | `post-verify` |
| 發布 | 存檔 → 推上去 → 確認上線 | （新做） |

**這五個你已經有四個**，而且是在 671 篇文章上磨出來的。這是別人抄不走的部分——檔案能抄，判準跟踩過的坑抄不走。

### ② 部落格範本（容器）

GitHub template repo，用網頁上的「Use this template」按鈕複製，Cloudflare Pages 從 web dashboard 接上。**全程瀏覽器，不開終端機。**

範本要內建的不是漂亮，是**護欄**：frontmatter schema、連結檢查、發布前的驗證腳本。讓使用者做不出壞東西比讓他做出好東西重要。

### ③ 上手動線（決定成敗）

這是最容易被低估的一塊。非技術者的死亡率在**第一次卡關**，不在功能多寡。所以需要：

- 一份圖文教學（就是文章系列的第 1–4 篇）。
- 一個「壞掉了怎麼辦」的排除清單。
- 第一次成功要在 **30 分鐘內**發生——不是完美的部落格，是**一個能給朋友看的網址**。

---

## 4. 必須先驗的技術前提（做任何東西之前）

整個產品架在一個假設上：**非技術者能在不開終端機的情況下，把文章推上線。**

Cowork 能讀寫本機檔案、能開瀏覽器、能排程，這些官方都寫了。但「它能不能可靠地完成 git commit + push，或用瀏覽器操作 GitHub 網頁介面上傳」——**我沒有查證，這是整個產品的單點風險。**

### 一天內做完的測試

拿一台乾淨的電腦（或新帳號），**全程不開終端機**：

1. 裝 Cowork 桌面版，登入 Pro 帳號。
2. 在 GitHub 網頁按「Use this template」複製一個 Astro 部落格範本。
3. Cloudflare dashboard 接上該 repo，拿到網址。
4. 在 Cowork 說「幫我研究 X 並寫成文章，存到這個資料夾」。
5. 說「把它發布上去」。

**第 5 步成不成，決定這個產品成不成。**

- ✅ 成功 → 產品成立，往下做。
- ⚠️ 需要一次性設定（例如先幫使用者設好 GitHub 授權）→ 產品仍成立，但「設定服務」變成必要的一環，而且**那正好是可以收錢的地方**。
- ❌ 完全不行 → 退回「Cowork 寫檔案 + 使用者用 GitHub 網頁拖檔案上傳」的半自動流程，體驗打折但仍可行。

**在這個測試做完之前，不要寫任何產品程式碼。**

---

## 5. 商業模式

TA 是非技術者，這決定了定價與交付形態：

| 層 | 內容 | 價格 | 說明 |
|---|---|---|---|
| **免費** | 文章系列第 1–4 篇（A 動線） | $0 | 這就是漏斗。**第一版評估建議跳過 1–4 篇是錯的——它們才是入口** |
| **產品** | Plugin + 範本 + 圖文教學 | 一次性 $29–79 | 非技術者不會為 skill pack 付 $199，但會為「有人幫我把整套弄好」付一頓飯錢 |
| **服務** | 一對一設定 + 一小時教學 | $300–800 | **這層最賺，而且 TA 最需要**。非技術者最怕的是卡住沒人問 |

### 不要做訂閱

你自己整理過的資料：[AI 產品 <$50/mo 的 GRR 只有 23%](/posts/product/2026-07-25-digital-product-value-validation)。而且訂閱制要你扛 runtime 與支援，跟「檔案是你自己的」這個核心主張直接矛盾。**檔案賣一次就好。**

### 支援負擔是真的，但可以設計掉

第一版我把支援負擔當成「不要做」的理由，這太保守。它是**設計問題**，不是否決理由：

- 零終端機本身就砍掉八成的卡關（沒有 npm、沒有 PATH、沒有 Node 版本）。
- 產品內建「壞掉了問 AI」——使用者手上就有一個 agent，教他怎麼問。
- 把高接觸需求**定價出去**：需要手把手的人走 $300–800 那層，不要免費吸收。

---

## 6. 真實風險

| 風險 | 說明 | 怎麼處理 |
|---|---|---|
| **Cowork 發布做不到** | 整個產品的單點依賴 | §4 的一天測試，做任何事之前先驗 |
| **官方吃掉** | Anthropic 隨時可能出「一鍵做部落格」plugin | 真實。護城河不在 skill 檔案，在判準與持續累積的內容 |
| **平台變動** | Cowork 還在快速演進，skill 路徑與行為半年就變 | 反而是賣點——你維護，顧客不用追。但這是持續成本 |
| **TA 付費意願低** | 非技術者對「一包檔案」的心理價位很低 | 所以主要營收在服務層，產品層當引流 |
| **時間排擠寫作** | 671 篇是你的主資產 | 產品做成文章的副產品，不要反過來 |

---

## 7. 建議的順序

1. **先做 §4 的一天測試。** 這是唯一的前置條件。
2. **文章系列改回 A 動線優先**（1 → 2 → 3 → 4）。第一版建議跳過這四篇是基於錯誤的 TA 假設，現在它們是漏斗入口，而且寫作過程本身就在測「非技術者跟不跟得上」。
3. **第 3 篇（架站）就是產品的說明書。** 寫的時候直接用你要賣的範本，文章寫完＝範本驗證完。
4. **第 4 篇底部放意向收集**——「想要整套裝好的版本，留個信箱」。這是最低成本的行為訊號。
5. **第 5–7 篇照寫**（研究 / 寫作 / 查核）。這三篇是 plugin 裡三個 skill 的規格書，寫完就是做完。
6. **訊號成立才包裝上架。** 門檻要發文前訂死。

好處跟第一版一樣沒變：**不管產品成不成，文章都不會白寫。**

---

## 8. 待你拍板

1. **§4 的測試要不要我幫你把範本先做出來**（一個能按「Use this template」的 Astro repo），這樣你可以直接跑測試？
2. **價格帶**：產品層 $29–79、服務層 $300–800，同意這個量級嗎？
3. **意向收集的形式**：信箱表單、Discord、還是先只看留言？

---

## 附錄：來源

- [Get started with Claude Cowork](https://support.claude.com/en/articles/13345190-get-started-with-claude-cowork) — 「no terminal required」、本機檔案讀寫；訪問日 2026-07-27
- [Claude Cowork 產品頁](https://claude.com/product/cowork) — plugin、排程、支援檔案格式、Pro 含 Cowork、Cowork vs Claude Code 的官方分界；訪問日 2026-07-27
- [Claude Code — skills 文件](https://code.claude.com/docs/en/skills) — Cowork session 載入 claude.ai 帳號啟用的 skill，不讀本機 `~/.claude/skills/`
- [ChatGPT Learn — Skills & Plugins](https://learn.chatgpt.com/docs/skills-and-plugins) — ChatGPT 與 Codex 共用 plugin 目錄；桌面版 Skills 面板
- [Google gen-AI 指引](https://developers.google.com/search/docs/fundamentals/using-gen-ai-content) — AI 適合用於研究與結構化；禁區是量產無價值頁面
- 留存與定價基準：本站 `product/2026-07-25-digital-product-value-validation`
- ⚠️ **未查證**：Cowork 能否可靠完成 git push 或以瀏覽器操作 GitHub 上傳——見 §4
