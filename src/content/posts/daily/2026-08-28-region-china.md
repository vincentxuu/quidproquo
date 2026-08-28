---
title: "區域焦點｜中國"
date: 2026-08-28
category: daily
tags: [ai-agent, region, daily, china]
lang: zh-TW
description: "字節跳動推出「豆包 Work」整併飛書正面挑戰騰訊，阿里巴巴 QwenWork 國際版開放公測鎖定亞洲中東拉美，騰訊 WorkBuddy 的模型聚合打法搭配智譜開源的 GLM-5.3-Flash，揭示中國辦公 Agent 大戰的真正戰場已經從模型層移到平台層"
tldr: "上月底三巨頭結束內部「賽馬」整併品牌後，本週集中兌現：字節跳動 8/25 正式推出「豆包 Work」，深度整合飛書身份與權限系統，Bloomberg 稱其為「正面挑戰騰訊」；阿里巴巴 8/26 開放 QwenWork 國際版公測，鎖定亞洲、中東、拉美市場而非直接對打歐美龍頭；騰訊 WorkBuddy 靠「不管哪個模型贏都抽成」的聚合器打法，把 Hy3、DeepSeek、GLM、Kimi、MiniMax 全部接進同一個工作台；同一週智譜（Z.ai）開源 GLM-5.3-Flash（320B-A18B、MIT 授權、跑在國產晶片上、價格僅 GLM-5.2 的十分之一），讓模型層的價格戰更激烈，也讓平台層的聚合策略更划算。"
series:
  name: "AI Region Focus"
  order: 2
---

> 🌏 [English version](/en/posts/daily/2026-08-28-region-china-en)

## 區域：中國

中國辦公 Agent 大戰進入下半場。7 月底到 8 月初，騰訊、阿里巴巴、字節跳動、百度不約而同結束各自的內部「賽馬」（讓多個團隊做競品互打），把資源整併成單一旗艦產品。本週三巨頭集中兌現這場整併的成果：字節跳動正式推出「豆包 Work」、阿里巴巴的 QwenWork 開始出海，騰訊 WorkBuddy 則示範了一套更根本的打法——不追求自己的模型最強，而是讓所有模型都經過自己的工作台。同一週智譜開源的 GLM-5.3-Flash，正好是讓這套打法能夠成立的底層條件。

## 本週重要動態

### 字節跳動推出「豆包 Work」，整併飛書、TRAE、Coze，Bloomberg 稱其正面挑戰騰訊

字節跳動於 8 月 25 日正式推出全新品牌「豆包 Work」，定位為辦公場景的 Agent 產品，最關鍵的設計是與飛書帳號層級的深度整合：使用者用飛書帳號登入後，Agent 可直接繼承使用者在飛書內既有權限範圍內的聊天紀錄、文件、會議記錄與行程，不需要員工手動搬運資料；產出的文件（PPT、Word、Excel）也會直接存回飛書雲文檔，可設定分享權限並 @同事協作編輯。旗下 Coding Agent「TRAE」與 Agent 開發平台「Coze」的團隊將完全併入豆包生態。新使用者下載桌面客戶端或更新 App 可獲得 30 天免費使用，但官方未揭露後續定價。Bloomberg 將此舉框定為「字節跳動用豆包超級 App 品牌正面挑戰騰訊」；財新則指出，這是延續 7 月豆包與飛書團隊合併、飛書企業銷售併入火山引擎的組織調整。（[Bloomberg](https://www.bloomberg.com/news/articles/2026-08-24/bytedance-folds-ai-tools-into-doubao-super-app-to-fight-tencent)、[財新網](https://www.caixinglobal.com/2026-08-25/bytedance-consolidates-ai-office-tools-around-doubao-102477744.html)、[第一財經 Yicai](https://www.yicaiglobal.com/news/bytedance-launches-doubao-work-as-chinas-tech-giants-pivot-to-office-ai-after-costly-consumer-push)、[TechNode](https://technode.com/2026/08/25/bytedance-launches-doubao-work-with-feishu-integration-and-30-day-free-access/)）

### 阿里巴巴 QwenWork 國際版開放公測，刻意避開歐美龍頭密集的市場

阿里巴巴 8 月 26 日宣布 QwenWork 國際版開放公測，整合旗下三個 Agent 平台 QoderWork（軟體/網頁開發）、MuleRun（工作流編排）、Wukong（操作網站與本機電腦）為單一工作台，網頁版與桌面版同步上線。官方公告明確表示，這次出海鎖定「亞洲、中東、拉美等高成長市場」，而非直接切入被 Microsoft Copilot、Google Workspace 等巨頭盤據的歐美企業市場；介面初期提供英文與簡體中文，未來將加入繁體中文、西班牙文、葡萄牙文、日文、韓文。訂閱制搭配點數系統，提供標準與進階兩種模型層級，標準層可用新發布的 Qwen3.8 Flash 模型，官方宣稱單任務 token 消耗量降低 75%、生成速度提升約一倍。QwenWork 8 月 3 日才在中國以公測形式首發，8 月 17 日即被紐約投行 Jefferies 的實測評比列為 8 個全球主流辦公 Agent 中的第一名。（[Alizila 阿里官方媒體](https://www.alizila.com/alibaba-launches-qwenwork-international-edition-extending-its-all-in-one-workplace-ai-agent-to-global-markets/)、[TechNode Global](https://technode.global/2026/08/26/alibaba-qwenwork-international-public-beta/)、[The Reporter Asia](https://thereporter.asia/eng/2026/08/qwenwork-international-edition-public-beta/)、[PANews](https://www.panews.io/articles/01a03d0b-e9b0-761d-ae80-82867cc251ac)）

### 騰訊 WorkBuddy「模型無關」打法：不管誰的模型贏，錢收在平台這一層

騰訊 WorkBuddy 的核心策略與豆包 Work、QwenWork 不同：它不是要證明自己的模型最強，而是把 DeepSeek、智譜 GLM、月之暗面 Kimi、MiniMax，以及騰訊自家的混元 Hy3 全部接進同一個工作台，讓使用者自由選擇底層模型，並用點數＋會員的混合計費模式在每一次呼叫上抽成——換句話說，不管哪個模型贏，騰訊都收得到租金，唯一沒揭露的是抽成比例與是否已經打平。產業媒體 CIW News 的分析指出，Hy3 於 8 月 5 日透過 WorkBuddy 全面免費開放後，在使用者自選模型時的選用比例已衝上 6 成以上；WorkBuddy 單月訪問量從 3 月首發時的 885 萬成長到 6 月的 2,097 萬，加計 CodeBuddy、QClaw 在內的騰訊系產品，6 月總訪問量達 3,262 萬，超過該機構追蹤的辦公 Agent 市場總量（6,062 萬）的一半。⚠️ 上述訪問量與模型選用比例數字來自 Analysys 經 36 氪轉引，以及騰訊自身揭露，尚未見獨立審計來源交叉驗證。（[CIW News](https://www.ciw.news/p/workplace-ai-desktop-china)）

### 智譜（Z.ai）開源 GLM-5.3-Flash：MIT 授權、跑在國產晶片上，價格僅前代十分之一

智譜旗下 Z.ai 於 8 月 26 日發布 GLM-5.3-Flash，是 GLM-5 系列首個原生多模態模型，320B 總參數、僅啟用 18B，支援 100 萬 token 上下文。架構上首次採用稀疏注意力與線性注意力的混合設計（KDA 線性注意力＋NoPE 稀疏 MLA），並導入 IndexPool 壓縮索引向量，官方宣稱注意力運算量降低約 3 倍、KV 快取縮小 4.4 倍。定價為每百萬 token 輸入 0.15 美元、輸出 0.50 美元，約為 GLM-5.2 的十分之一，Terminal-Bench 2.1 拿下 84.3 分，逼近 Claude Opus 4.8；模型權重以 MIT 授權開源在 HuggingFace，且完全在國產晶片上完成訓練與推論。值得一提的是，這款模型上市前一週曾以匿名帳號「Ox Alpha」在 OpenCode 與 OpenRouter 的程式碼榜單短暫刷榜，直到鑑識線索指向智譜才曝光身份——與本站上週信號追蹤到的社群風向完全吻合。GLM-5.3-Flash 這類「更便宜、更強」的開源模型持續壓低模型層的價格，正是騰訊 WorkBuddy 這類聚合器打法能夠持續划算的底層條件。（[Z.ai 官方部落格](https://z.ai/blog/glm-5.3-flash)、[MarkTechPost](https://www.marktechpost.com/2026/08/26/z-ai-releases-glm-5-3-flash-a-320b-a18b-natively-multimodal-moe-with-a-1m-token-context/)、[Hugging Face](https://huggingface.co/zai-org/GLM-5.3-Flash)）

## 深度分析

我認為本週最值得注意的信號，是中國四家平台（騰訊、阿里巴巴、字節跳動、百度）幾乎在同一時間得出同一個策略結論：真正的護城河不在模型層，而在轉換成本與流量分發層。用護城河理論（Economic Moat：轉換成本、網路效應、成本優勢、無形資產四種類型）拆解本週的動態，脈絡相當一致：

**轉換成本護城河，是這波整併的真正目標**：豆包 Work 要求使用者用飛書帳號登入才能解鎖完整能力，一旦綁定，Agent 就能直接讀取整個組織的聊天紀錄、文件與權限體系，而生成的文件又存回飛書雲文檔——這意味著換掉豆包 Work，等於同時要換掉整個團隊的協作平台，遷移成本被刻意做高。阿里巴巴把 QoderWork、MuleRun、Wukong 三合一，也是同一邏輯：先讓使用者在單一入口累積工作流與資料，才能談長期留存。

**成本優勢護城河，正在模型層被自己人打掉**：GLM-5.3-Flash 用十分之一的價格逼近上一代旗艦效能，代表模型層的成本優勢週期已經短到以「週」為單位——今天的價格優勢，下週可能就被另一家開源模型追平。這正是為什麼騰訊 WorkBuddy 選擇不押注自家模型最強，而是把 DeepSeek、GLM、Kimi、MiniMax、Hy3 全部接進同一個工作台：與其在會被快速商品化的模型層裡跟人比便宜，不如退一層，靠聚合器角色收租。

**網路效應與無形資產，靠的是既有的社交／協作基礎設施，而非模型本身**：騰訊靠微信與企業微信的分發能力讓使用者能「手機下指令、電腦收成果」；字節跳動靠飛書既有的組織身份與文件圖譜；阿里巴巴則規劃將 QwenWork 與釘釘打通。三家公司的無形資產都不是模型能力，而是既有的協作網路——這也解釋了為什麼阿里巴巴的出海策略選擇亞洲、中東、拉美：這些市場還沒被 Microsoft 365、Google Workspace 的既有網路效應鎖死，比直接跟歐美龍頭正面對決更容易建立起自己的轉換成本。

## 對台灣創業者的啟示

- 不要把「用了最新最便宜的模型」當成護城河：GLM-5.3-Flash 這週用十分之一價格逼近前代旗艦的案例說明，模型層的成本優勢可能一週內就被追平。如果你的產品差異化主要來自模型選擇，應該假設這個優勢會被抹平，把資源投在轉換成本更高的地方（資料圖譜、工作流整合、既有帳號體系）。
- 沒有自研模型的企業 Agent 團隊，可以參考 WorkBuddy 的聚合器打法：把 Claude、GPT、Gemini、開源模型都接進同一個工作台，用「路由層 + 使用者資料鎖定」取代「押注單一模型最強」，讓自己不論哪家模型贏都能收到費用。
- 出海順序值得借鏡 QwenWork：與其直接挑戰被 Microsoft Copilot、Google Workspace 密集佔據的歐美市場，先攻進協作平台生態還沒被鎖死的市場（QwenWork 選了亞洲、中東、拉美），對資源有限的台灣新創更務實。

## 今日收穫

之前以為中國三巨頭做辦公 Agent 是各自為戰的軍備競賽——誰的模型分數更高、誰先推出新功能。這週看下來才發現，7 月底到 8 月初的「賽馬結束」整併（QClaw 併入 WorkBuddy、三合一變 QwenWork、飛書併入豆包）其實是同一套劇本的三個分身：三家公司幾乎同時得出結論——辦公桌面才是真正值錢的入口，模型本身反而該被當成隨時可以替換的零件。騰訊 WorkBuddy「不管哪個模型贏都收租」的打法，把這個邏輯講得最直白，而 GLM-5.3-Flash 這類持續壓低模型價格的開源競品，等於在幫這套平台層打法鋪路。

## 參考資料

- [Bloomberg — ByteDance Challenges Tencent With New Doubao Workplace AI Agent](https://www.bloomberg.com/news/articles/2026-08-24/bytedance-folds-ai-tools-into-doubao-super-app-to-fight-tencent)
- [財新網 Caixin Global — ByteDance Consolidates AI Office Tools Around Doubao](https://www.caixinglobal.com/2026-08-25/bytedance-consolidates-ai-office-tools-around-doubao-102477744.html)
- [第一財經 Yicai Global — ByteDance Launches Doubao Work as China's Tech Giants Pivot to Office AI](https://www.yicaiglobal.com/news/bytedance-launches-doubao-work-as-chinas-tech-giants-pivot-to-office-ai-after-costly-consumer-push)
- [TechNode — ByteDance launches Doubao Work with Feishu integration and 30-day free access](https://technode.com/2026/08/25/bytedance-launches-doubao-work-with-feishu-integration-and-30-day-free-access/)
- [Alizila — Alibaba Launches QwenWork International Edition](https://www.alizila.com/alibaba-launches-qwenwork-international-edition-extending-its-all-in-one-workplace-ai-agent-to-global-markets/)
- [TechNode Global — Alibaba opens QwenWork AI agent to global users](https://technode.global/2026/08/26/alibaba-qwenwork-international-public-beta/)
- [The Reporter Asia — QwenWork International Edition Launches in Public Beta](https://thereporter.asia/eng/2026/08/qwenwork-international-edition-public-beta/)
- [PANews — Alibaba's 'QwenWork' International Version Starts Public Beta](https://www.panews.io/articles/01a03d0b-e9b0-761d-ae80-82867cc251ac)
- [CIW News — Tencent's WorkBuddy shows where China's AI money is moving](https://www.ciw.news/p/workplace-ai-desktop-china)
- [Momenta Media — BAT's Big Push into AI Office Software](https://www.momenta.media/article/bat-push-into-ai-office-software)
- [Z.ai 官方部落格 — GLM-5.3-Flash: Frontier Intelligence, Flash Cost](https://z.ai/blog/glm-5.3-flash)
- [MarkTechPost — Z.ai Releases GLM-5.3-Flash](https://www.marktechpost.com/2026/08/26/z-ai-releases-glm-5-3-flash-a-320b-a18b-natively-multimodal-moe-with-a-1m-token-context/)
- [Hugging Face — zai-org/GLM-5.3-Flash](https://huggingface.co/zai-org/GLM-5.3-Flash)
