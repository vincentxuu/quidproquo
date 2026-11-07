# AI 月報競品：實際一期觀察

調查日：2026-11-07。只記實際讀到的內容，沒看到寫「未見」。

**讀取方式**：Groundlane `web_fetch` 優先。它輸出有截斷時，用 curl 下載同一 URL，以腳本抽標題、全文長度、連結與圖片數和文末，所以「字數」「連結數」是腳本估計值，含少量版面文字。Medium 與 Counterpoint 的 Groundlane 回 `browser-challenge`，改用 firecrawl 讀到。

**閱讀深度**：Scan、Echo、ToolDirectory、Buteau、RapidCanvas、CoddyKit、Agno、BI Japan 讀了開頭、全部節標題與文末，中段只讀了一部分。abmedia、agents-radar、2toLead、WEEL 週報、Medium 讀完全文。Air Street 讀了開頭、節標題與文末。Counterpoint 只讀到公開目錄頁。

## 逐份紀錄

### 1. The Scan（AI Risk Explorer）
- **URL／期別**：https://airiskexplorer.substack.com/p/the-scan-october-2026 ，2026-10，11-05 發布
- **發行者與讀者**：AI Risk Explorer（AIRE）。讀者未明示，內容偏 AI 風險與資安政策
- **節結構**：Cyber Offense／Loss of Control／Biological Risk／Manipulation，四個領域下再分小節
- **長度**：約 2,100 字，60 個連結，4 張圖
- **開頭**：一句話說明本月主題，接四個領域各一段結論，第一段就帶數字
- **選題方法**：揭露母數，數字來自自家資料庫（Threat Watch 53 筆、Agentic Incidents Monitor 55 筆）。納入標準在本期未見
- **月對月／固定指標**：有，且最完整。分母與比較期都寫出，如 58% vs 9 月 39%、64% vs Q3 41%
- **回顧／更正**：未見
- **前瞻段**：未見
- **給讀者的行動**：未見
- **來源密度**：高，幾乎每項都連到一手或主流媒體
- **圖表**：有，資料圖
- **閘門**：未見付費牆，文末有訂閱鈕
- **AI 生成揭露**：未見
- **摘錄**：
  - 「in 31 of the 53 entries (58%), up from 39% in September」
  - 「only 3 caused real operational impact, against about 6 a month in Q3」
  - 「the effect on voting behavior is uncertain」

### 2. What Changed in AI for Operators（The ECHO Files）
- **URL／期別**：https://echofiles.substack.com/p/what-changed-in-ai-for-operators-october-2026 ，2026-10，11-05 發布，作者稱這是第二期月報
- **發行者與讀者**：Jeremy Wright，個人電子報；讀者是行銷與營運者（operators）
- **節結構**：Since last month（上月 5 個判斷逐一更新）／Did September's pattern hold?／本月 5 個新判斷／What I got wrong／The pattern
- **長度**：約 6,000 字，185 個連結，16 張圖
- **開頭**：先寫製作方法，再給「The short answer」，接判決總表
- **選題方法**：揭露。從四篇週報中選新判斷，標準是出現最多、最會改變讀者作法
- **月對月**：有，上月判斷逐條給新判決
- **回顧／更正**：最完整。固定節列出對週報的更正，並說明錯誤來自哪個環節
- **前瞻段**：未見獨立一節；文末只提 11 月視回饋再出
- **給讀者的行動**：有，每段以「Update:」給具體動作
- **來源密度**：非常高，並標註 secondary、partly paywalled
- **圖表**：有，判決表、時間軸與資料表（FIG／TBL 編號）
- **閘門**：未見
- **AI 生成揭露**：有，且具體：10 個研究 agent、一個起草 agent、5 個查核 agent，最後人工編輯
- **摘錄**：
  - 「None of the ten held exactly as my roundups wrote it.」
  - 「Most errors were a source upgraded on the way through」
  - 「My dedup step checks whether a link has run before, never whether the news has.」

### 3. State of AI newsletter（Air Street Press）
- **URL／期別**：https://press.airstreet.com/p/state-of-ai-may-2026 ，涵蓋 2026-04，05-04 發布。這是封存 API 標題比對到的最新一期
- **發行者與讀者**：Nathan Benaich，投資機構 Air Street。讀者未明示，內容涵蓋政策、研究、產業與新創
- **節結構**：開頭消息／四個主題節（Cyber、Microsoft-OpenAI、China、Agents）／Research／Investments／Exits／This issue at a glance／What to watch in May and Q2
- **長度**：約 3,600 字，74 個連結，6 張圖
- **開頭**：先放活動、投資組合消息與徵才，之後才進主題
- **選題方法**：自稱 editorialized，未揭露母數或標準
- **月對月**：主題內有趨勢比較，未見固定指標
- **回顧／更正**：未見
- **前瞻段**：有，以開放問題形式寫
- **給讀者的行動**：未見；前瞻段是問題，不是動作
- **來源密度**：高
- **圖表**：有
- **閘門**：audience=everyone，免費
- **AI 生成揭露**：未見
- **利益揭露**：投資組合消息明示為「Portfolio news!」
- **出刊規律**：封存標題比對到 2026 年只有 2、4、5 月。作者 10-08 年度報告仍寫有月度通訊，但 5 月之後的標題未比對到月刊。比對可能漏掉標題不同的期別
- **摘錄**：
  - 「these evaluations do not yet prove efficacy against hardened targets」
  - 「has effectively been liquidated by the data」（語氣強，與上一句的保留形成對比）

### 4. New AI tools October 2026（ToolDirectory.ai）
- **URL／期別**：https://tooldirectory.ai/blog/ai-tools-news-october-2026 ，第五期，11-01 發布
- **發行者與讀者**：工具目錄站；讀者是追工具的一般使用者與團隊
- **節結構**：New AI tools／Model releases／The big one／Deals and consolidation／Shutdowns and sunsets／Legal and policy／What we're watching in November／How we source this roundup／FAQ
- **長度**：約 2,500 字，2 張圖
- **開頭**：一句話定性本月，接著說明自家登記簿如何用來核對頭條
- **選題方法**：揭露來源與核對方式，事件日期與主張分開查，並點名排除的項目
- **月對月**：有固定指標，「graveyard」累計 347 筆（153／77／117 分類）
- **回顧／更正**：有上月後續追蹤（Nvidia／Hugging Face），未見更正節
- **前瞻段**：有，寫成可驗證的觀察條件
- **給讀者的行動**：未見獨立一節
- **來源密度**：內文多指向站內頁，媒體來源多以名稱提及，外部連結少
- **圖表**：未見資料圖
- **閘門**：無；有電子報訂閱
- **AI 生成揭露**：未揭露使用方式；訂閱區宣稱「no AI-generated filler」
- **摘錄**：
  - 「We check every item's event date separately from the claim itself.」
  - 「we mark figures as reported when the company has not confirmed them」
  - 「actually September events or earlier … and we left them out」

### 5. The AI Landscape（Concerned human，Medium）
- **URL／期別**：https://medium.com/@ConcernedhumanonAI/the-ai-landscape-october-2026-a0a44c7b111e ，2026-10，11-01 發布
- **發行者與讀者**：匿名個人，頁面顯示 35 位追蹤者；讀者未明示
- **節結構**：Here's where everyone stands／各廠商一節（OpenAI、Anthropic、Google、Meta、Mistral、SpaceXSI）／China's Model Ecosystem／Smaller Models and Local AI／Cybersecurity／AI and Scientific Discovery／The Big Picture
- **長度**：頁面標示 7 分鐘
- **開頭**：兩段摘要全月，再逐家報告
- **選題方法**：未見
- **月對月**：未見固定指標；有 9 月期
- **回顧／更正**：未見
- **前瞻段**：未見
- **給讀者的行動**：未見
- **來源密度**：讀到的正文沒有內文連結，只提來源名稱
- **圖表**：封面圖
- **閘門**：無（Medium 有訂閱提示）
- **AI 生成揭露**：未見
- **摘錄**：
  - 「downloadable weights should not be confused with unrestricted open-source licensing」
  - 「their involvement is not certification」

### 6. AI 產業月報（鏈新聞 ABMedia）— 繁中直接競品
- **URL／期別**：https://abmedia.io/ai-industry-monthly-report-august-2026 ，2026-08，08-25 發布（月底前）
- **其他期別**：找不到 9、10 月期。站內搜尋與 `/tag/月報` 頁都只顯示這一篇
- **發行者與讀者**：Elponcrab，台灣區塊鏈媒體；讀者是中文科技與加密貨幣讀者
- **節結構**：模型與產品／融資與基建／政策與安全，最後一段總結
- **長度**：短，三節各約兩段
- **開頭**：一句話定性本月，再預告三大面向
- **選題方法**：未見
- **月對月**：未見
- **回顧／更正**：未見
- **前瞻段**：未見
- **給讀者的行動**：未見
- **來源密度**：連結不少，但讀到的全部指向站內文章，未見原始來源
- **圖表**：未見
- **閘門**：無；文中有廣告，文末有交易所橫幅與加密貨幣投資風險提示
- **AI 生成揭露**：未見
- **摘錄**：
  - 「連完整評測都追不上」
  - 「帶你一次掌握 8 月的產業全貌」

### 7. AI 工具生态月报（agents-radar 分支）
- **URL／期別**：https://github.com/ycsxh/agents-radar/issues/100 ，標題 2026-10，11-01 由 github-actions 發布
- **發行者與讀者**：`duanyytop/agents-radar`（1,154 星）的分支（0 星）；讀者是開發者與企業選型者。上游的月報未讀
- **節結構**：月度要闻／CLI 工具月度进展／AI Agent 生态月报／技术趋势总结／社区生态健康度／官方动态回顾／下月展望
- **長度**：長，多張大表
- **開頭**：先以「口径说明」揭露實際觀測窗，再列 10 條要聞
- **選題方法**：揭露輸入（2 份週報）；篩選標準未見
- **月對月／固定指標**：有固定的工具健康度表（版本節奏、Issue／PR）；未見與上月比較
- **回顧／更正**：未見
- **前瞻段**：有，5 條主線加潛在事件預判
- **給讀者的行動**：有「决策建议」
- **來源密度**：讀到的內容未見連結，只有 HN 分數與 issue 編號
- **圖表**：只有表格
- **閘門**：無
- **AI 生成揭露**：有，文末標明自動生成，但寫成「本日报」
- **摘錄**：
  - 「实际观测窗口主要集中在 2026-09-04～2026-10-05」
  - 「部分数据为 09-06 单日快照」

### 8. Monthly Learnings from the Daily Digest（Antoine Buteau）
- **URL／期別**：https://www.antoinebuteau.com/monthly-learnings-2026-10/ ，2026-10，11-01 發布
- **發行者與讀者**：個人網站；讀者是工程與 AI 營運主管
- **節結構**：The month in one sentence／Five learnings that kept showing up／Weak signals to watch／What the month clarified／Practical implications／Source notes
- **長度**：約 2,400 字，22 個連結
- **開頭**：三段敘事，接「一句話總結本月」
- **選題方法**：揭露母數（31 天、457 筆），也說明日報不是原創報導；篩選標準未見
- **月對月**：未見
- **回顧／更正**：未見
- **前瞻段**：有，Weak signals
- **給讀者的行動**：有，Practical implications 五條
- **來源密度**：每節列幾條，X 貼文占比高
- **圖表**：未見
- **閘門**：無；有週報訂閱
- **AI 生成揭露**：未見
- **摘錄**：
  - 「Reviewed 31 digest days and 457 parsed items.」
  - 「rather than representing original reporting」
  - 「shifting entirely to deterministic execution harnesses」（全稱斷言）

### 9. AI 360 Pulse（Counterpoint Research）
- **URL／期別**：https://counterpointresearch.com/en/reports/AI-360-Pulse-Industry-Trends-Intelligence-and-Impact-January-2026 ，2026-01。另有 2025-10 頁面，更新的期別未找到
- **發行者與讀者**：分析師機構；讀者未明示，推測是付費企業客戶
- **節結構（公開目錄）**：AI Industry Activity／AI + Semi、Agents、Models、Telco、Devices、Applications、Regulation、Finance、Ecosystem、China／News Summary and Impact on AI Trends／Key Event Recap／New AI Research
- **長度**：60 頁
- **其他項目**：內文讀不到，開頭、方法、月對月、更正、前瞻、行動、來源、圖表、AI 揭露皆無法判斷
- **閘門**：需訂閱
- **摘錄**：
  - 「it connects the dots to help you see where the industry is heading」

### 10. This Month in AI（RapidCanvas）
- **URL／期別**：https://www.rapidcanvas.ai/blogs/month-in-ai-oct-2026 ，2026-10，10-30 發布
- **發行者與讀者**：企業 AI 廠商；讀者是企業主管
- **節結構**：五到六個問題式主題（Is AI successful…、Finance is watching…、Was success ever defined?、Agents are outrunning governance、Workforce plans lag）／How RapidCanvas helps／News from RapidCanvas
- **長度**：約 2,150 字，21 個連結，8 張圖
- **開頭**：一個問題加一句回答，再用一段點出串起全文的主因
- **選題方法**：未見；內容以調查報告綜述為主，納入 9 月底發布的調查
- **月對月**：引用調查的季對季數字，未見自有固定指標
- **回顧／更正**：未見
- **前瞻段**：未見獨立一節
- **給讀者的行動**：每節末一段粗體評論，多屬方向性建議
- **來源密度**：高，多為 BCG、KPMG、Gartner、Forrester 原始新聞稿
- **圖表**：有圖片，資料圖與否未逐張確認
- **閘門**：無；文末有訂閱與產品推廣
- **AI 生成揭露**：未見
- **摘錄**：
  - 「The number shrinks as the bar rises.」
  - 「Each of this month's findings comes back to setting goals and limits」（接著轉入產品介紹）

### 11. Agent Intelligence Newsletter（2toLead）
- **URL／期別**：https://www.2tolead.com/insights/ai-agent-newsletter-october-2026 ，2026-10，10-20 發布
- **發行者與讀者**：微軟生態顧問公司；讀者是 IT 與治理主管
- **節結構**：Featured Story／The Strategic Shift／Agent Spotlight／On-Demand Webinar／Featured Toolkit／Upcoming Trainings／Your Next Step
- **長度**：短，每節一段加一個連結
- **開頭**：一句判斷，接本期三個問題
- **選題方法**：未見；各節導向自家文章與資源
- **月對月**：未見
- **回顧／更正**：未見
- **前瞻段**：未見，只有訓練場次
- **給讀者的行動**：有，導向報名與諮詢
- **來源密度**：讀到的連結幾乎都是自家頁面與活動報名
- **圖表**：封面圖
- **閘門**：內文無；後續資源是否需留資未確認
- **AI 生成揭露**：未見
- **摘錄**：
  - 「Find out if you could stop your agents in minutes」
  - 「Let's map it out together.」

### 12. The State of AI Agents（CoddyKit）
- **URL／期別**：https://www.coddykit.com/pages/blog-detail?id=5130010&slug=the-state-of-ai-agents-october-2026-what-30-days-and-100-repositories-reveal-abo ，2026-10，10-31 發布
- **發行者與讀者**：程式課程平台；讀者是開發者
- **節結構**：Three Undeniable Truths／Seven Architectural Patterns／Five Repos That Will Still Matter in 2030／Three Skills／What Developers Should Do Right Now／Agent Platform Wars of 2027／Conclusion
- **長度**：約 2,600 字，3 個連結
- **開頭**：宣告三個「不可否認的真相」
- **選題方法**：揭露母數（30 天 GitHub Trending、100+ repo），未見篩選標準與反例
- **月對月**：有 star 成長數字
- **回顧／更正**：未見
- **前瞻段**：有，多條 2027、2030 預測
- **給讀者的行動**：有，導向課程
- **來源密度**：極低
- **圖表**：未見
- **閘門**：無；文末有課程推廣
- **AI 生成揭露**：未見
- **核對**：用 `gh api` 查五個 repo，今日 star 分別是 graphify 143,684、orca 118,046、RuView 102,765、opencode 225,128、headroom 79,045，與文中 10-31 數字方向一致。star 數沒有問題，問題在由此推出的結論
- **摘錄**：
  - 「These aren't predictions — they're observations」（之後每節都寫「Prediction for 2027」）
  - 「The winners are already clear.」
  - 「80% token reduction with zero accuracy loss」（未附出處）

### 13. Community Roundup（Agno）
- **URL／期別**：https://www.agno.com/blog/community-roundup-october-2026 ，2026-10，11-04 發布
- **發行者與讀者**：Agent 框架廠商；讀者是自家使用者與開發者
- **節結構**：New releases & features／New tools & integrations／Breaking changes／Community projects & showcases／Contributor shoutouts／Get involved／FAQ
- **長度**：約 2,300 字，60 個連結，2 張圖
- **開頭**：兩句主題，接本月數字
- **選題方法**：範圍就是自家產品；社群案例的選取方式有說明
- **月對月／固定指標**：有本月數字（13 releases、35 位貢獻者、41 PR），未見與上月比較
- **回顧／更正**：未見
- **前瞻段**：未見
- **給讀者的行動**：Breaking changes 給升級動作
- **來源密度**：高，多為自家 changelog、文件與 cookbook
- **圖表**：未見資料圖
- **閘門**：無
- **AI 生成揭露**：未見
- **摘錄**：
  - 「we shipped 13 releases」
  - 「35 contributors merging 41 PRs」

### 14. 生成AI主要サービス料金早見表（Business Insider Japan）
- **URL／期別**：https://businessinsider.jp/article/2611-how-much-did-major-generative-ai-service-fees ，2026 年 11 月版，11-06 發布；有 10 月版
- **發行者與讀者**：商業媒體；讀者是日本的個人付費使用者
- **節結構**：月度敘述／各服務當月更新（ChatGPT、Claude、Gemini、Copilot、Grok、Genspark、Perplexity）／料金早見表（エントリー、ミドル、ヘビーユーザー）
- **長度**：3 張表加各服務條列
- **開頭**：三條重點，再講本月兩個趨勢
- **選題方法**：範圍明確（主要服務的個人方案）；納入標準未見。標題顯示 10 月版 8 項、11 月版 7 項
- **月對月／固定指標**：有，每月同一張價格表，並註明時點與匯率
- **回顧／更正**：有承接上期（提及「10月版で触れた」），未見更正節
- **前瞻段**：未見
- **給讀者的行動**：有一處提醒確認合約內容
- **來源密度**：高，每條更新附官方連結與日期
- **圖表**：3 張表
- **閘門**：無；同頁有贊助內容
- **AI 生成揭露**：未見
- **地區視角**：明確區分日本是否可用
- **摘錄**：
  - 「2026年11月6日時点」
  - 「同じ料金で使える中身は動いている」
  - 「日本は対象外」

### 15. 生成AIトレンドレポート（WEEL）
- **URL／期別**：https://note.com/weel_media/n/n37350b428175 是 10/12–10/18 週報；月度版是 PDF：https://weel.co.jp/media/download/%E3%83%88%E3%83%AC%E3%83%B3%E3%83%89%E3%83%AC%E3%83%9D%E3%83%BC%E3%83%88/
- **發行者與讀者**：生成 AI 顧問公司；讀者是 DX 推進與導入負責人
- **節結構（週報）**：5 則工具解說，各以✅條列，最後まとめ。PDF 月報的結構未讀到
- **長度**：週報中等；PDF 未知
- **選題方法**：未見
- **月對月、回顧、前瞻**：週報未見，PDF 無法判斷
- **給讀者的行動**：每則末有一句建議，文末導向諮詢
- **來源密度**：週報正文未見外部來源，只有圖片連結
- **閘門**：月度 PDF 要填表單
- **AI 生成揭露**：未見
- **摘錄**：
  - 「※続きはフォームからお問い合わせ下さい。」
  - 「1か月のAIニュースをこの一冊でキャッチアップ」

## 覆蓋矩陣

| 維度 | 值 | 案例 | 缺口 |
|---|---|---|---|
| 發行者 | 媒體 | ABMedia、BI Japan | 未讀到 AI 專業媒體的月刊 |
| 發行者 | 獨立作者 | ECHO、Buteau、Concerned human | |
| 發行者 | 廠商 | RapidCanvas、2toLead、CoddyKit、Agno、ToolDirectory、WEEL | 占比最高 |
| 發行者 | 分析師／投資機構 | Counterpoint、Air Street | Counterpoint 內文讀不到 |
| 發行者 | 研究組織 | AI Risk Explorer | 只有風險領域 |
| 發行者 | 全自動 | agents-radar（分支） | 上游月報未讀 |
| 語言 | 英 | 11 份 | 占多數 |
| 語言 | 簡中 | agents-radar | 搜尋結果中的 cnblogs、CSDN 月度文未打開 |
| 語言 | 繁中 | ABMedia | 只找到 1 期，且是區塊鏈媒體 |
| 語言 | 日 | BI Japan、WEEL | WEEL 月度 PDF 未讀 |
| 方法 | 編輯判斷 | Air Street、ABMedia、Concerned human、RapidCanvas | |
| 方法 | 資料驅動 | Scan、ToolDirectory、BI Japan、Agno | |
| 方法 | 再查證 | ECHO | 僅此一家 |
| 方法 | 日報或週報合成 | ECHO、Buteau、agents-radar | |
| 品質 | 正面參考 | Scan、ECHO、ToolDirectory、BI Japan | |
| 品質 | 反面案例 | agents-radar、CoddyKit、ABMedia、2toLead | |
| 生命週期 | 出刊中斷的跡象 | ABMedia（只見 1 期）、Air Street（5 月後未比對到） | 兩者都可能是比對遺漏；未找到明確停刊的案例 |

**偏誤**：
- 候選主要來自 2026-11-07 的搜尋結果前段，偏向 10 月當期、可公開讀取、SEO 做得好的內容。
- 廠商內容行銷占比高；大型付費月報與機構內部月報幾乎看不到。
- AI 專業媒體的月刊未被搜到，不代表不存在。
- 掃到但未打開：newsletterscan 趨勢頁、ThorstenMeyerAI 年度回顧、mean.ceo、aiagentsdirectory 每日簡報。

## 做法比較

| 做法 | 採用者 |
|---|---|
| 逐條回顧上月判斷 | ECHO |
| 固定「我哪裡錯了」更正節 | ECHO |
| 承接上月事件的後續 | ToolDirectory、BI Japan（部分）、ECHO |
| 分子／分母加比較期 | Scan；ToolDirectory 只有累計數，Agno 只有當月數 |
| 跨期可比的固定表 | BI Japan（價格）、agents-radar（工具健康度）、ToolDirectory（登記簿） |
| 事件日期與主張分開查，並點名排除項 | ToolDirectory |
| 標註「未經公司確認」或二手來源 | ToolDirectory、ECHO |
| 揭露合成母數 | Buteau（31 天／457 筆）、ECHO、agents-radar、CoddyKit、Scan |
| 揭露 AI 參與方式 | ECHO（詳細）、agents-radar（只標自動生成） |
| 揭露投資或商業關係 | Air Street（投資組合）；廠商文的推廣節可直接看出 |
| 前瞻寫成可驗證條件 | ToolDirectory、Air Street（開放問題）；agents-radar 有事件預判 |
| 弱訊號獨立成節 | Buteau |
| 依讀者給可做的動作 | ECHO（每段）、Buteau（文末）、agents-radar（決策建議） |
| 區分地區可用性 | BI Japan |
| 區分「有影響」與「真正造成營運影響」 | Scan |
| 一句話總結本月 | Buteau、ECHO（short answer） |
| FAQ 結尾 | ToolDirectory、Agno |

## 反面案例

看起來不可信的做法，指到原文：

1. **agents-radar**：標題是 2026-10，但「口径说明」寫實際窗口在 09-04～10-05，輸入只有 2 份週報，10 條要聞全落在 9 月上旬。作者有揭露，但期別與內容不符；文末還寫「本日报」。這個分支可能因上游資料少而如此，上游未核對。
2. **CoddyKit**：從 star 成長跳到「The winners are already clear」和「Five Repos That Will Still Matter in 2030」。「These aren't predictions」之後每節都有「Prediction for 2027」。「zero accuracy loss」未附來源。只抽 GitHub Trending，未見反例，文末導向課程。star 數本身查得到，問題在推論。
3. **ABMedia**：8-25 就發布「8 月月報」，所以不涵蓋月底；讀到的連結全部指向站內，看不到原始來源；開頭宣稱「一次掌握 8 月的產業全貌」，但沒有方法說明。
4. **2toLead**：名為 newsletter，但每節導向自家文章與活動，沒有當月事件清單。發布於 10-20，並非月結回顧。
5. **Concerned human**：內容本身保留得當，但讀到的正文沒有內文連結，讀者無法自行查核。
6. **Buteau**：「shifting entirely」這類全稱斷言建立在以 X 貼文為主的連結上；文末雖說明日報是閱讀紀錄、非原創報導，標題式結論的語氣仍強過證據。
7. **WEEL**：週報當誘因，月度 PDF 要填表單，文末導向諮詢，屬名單型內容。

## 讀不到或沒把握

- **Counterpoint**：內文付費，只看到目錄；更新的期別未找到。
- **WEEL**：月度 PDF 未讀，上述只反映週報與下載頁。
- **ABMedia**：9、10 月期未找到，是否停刊無法確認。
- **Air Street**：5 月後未比對到月刊，是否改名或停刊無法確認。
- **agents-radar**：只讀分支；上游月報的窗口與品質未驗證。
- **中段未全讀**：Scan、ECHO、ToolDirectory、Buteau、RapidCanvas、CoddyKit、Agno、BI Japan 的中段只讀了一部分，所以「未見」可能漏掉中段內容；節標題已全部核對。
- **競品內文的事實**：這裡只記錄做法，不核對各期所述新聞的真偽（CoddyKit star 數除外）。

## 主線覆核（2026-11-07，主 session 親自打開原文）

- ECHO：確認有「Since last month」「Did September's pattern hold?」「What I got wrong」三節。
- The Scan：確認 33/55 有實際影響、其中 20 筆留在開發或評測環境、64% 對 Q3 41%。
- ToolDirectory：確認「What we're watching in November」「How we source this roundup」，以及標註「reported but not confirmed」。
- agents-radar：確認窗口偏到 09-04～10-05，但它在開頭「口径说明」自行揭露，反面案例應寫成「母數不足仍以月報為題」，不是隱瞞。
- ABMedia：September／October 網址猜測皆 404，站內搜尋未見；只能說「未找到」，不能說停刊。
- Air Street：RSS 最新 14 篇未見月刊標題，但 2026 年度報告文仍請讀者訂閱「monthly State of AI newsletter」；只能說「RSS 近期未見」。
