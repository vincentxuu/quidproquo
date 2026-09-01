---
title: "AI 日報 — 2026-09-01"
date: 2026-09-01
category: daily
tags: [ai-agent, daily]
lang: zh-TW
description: "Agent 的競爭力正在從『模型多聰明』轉向『分工協調成本壓得多低』——Uber 的技能註冊表與 Visa/Mastercard 主導的產業聯盟，今天從兩個完全不同的產業各自證明了這件事"
tldr: "Uber 揭露 agent 軟體工廠全貌：70% PR 出自 agent、3,600+ 技能收進共用註冊表、週請求量成長 9.4 倍但總支出持平；Visa/Mastercard/Fiserv 加入 25+ 會員的 Agentic Payments Alliance，搶在 agentic commerce 衝上 3-5 兆美元規模前把授權標準攤平；NVIDIA 砸 35 億美元認購聯發科可轉債，深化邊緣到雲端 AI 運算平台合作；台灣政府明年編列新台幣 400 億元衝 50 萬名 AI 人才目標；OpenClaw 2.0 以 933 位貢獻者、逾 1.6 萬個 PR 刷新開源 agent 專案最大單次改版紀錄"
draft: false
series:
  name: "AI 日報"
  order: 17
---

> 🌏 [English version](/posts/daily/2026-09-01-ai-agent-daily-en)

## 一句話判斷

**Agent 的競爭力正在從「模型多聰明」轉向「分工協調成本壓得多低」——Uber 的技能註冊表與 Visa/Mastercard 主導的產業聯盟，今天從兩個完全不同的產業各自證明了這件事；而台灣讀者更該留意的是，NVIDIA 深化與聯發科的晶片合作、加上政府新台幣 400 億元的人才計畫，顯示這場競爭正往上游供應鏈站位延伸，不只是選一套 agent 框架的技術問題。**

## 深度分析：Agent 群怎麼分工、怎麼被信任，正在變成比模型能力更決定 ROI 的變數

我認為今天兩則看似不相關的新聞，其實在回答同一個問題：agent 群要怎麼分工、彼此才信得過，而不是拚哪家模型比較聰明。（框架：交易成本）

Uber 公開了自家「軟體工廠」的完整成本方程式：目前超過 70% 的 pull request 出自本地或雲端 agent，員工建了 3,600 多個技能收進共用註冊表，每天執行超過 3 萬次；2 月到 8 月週活躍使用者成長 7 倍、週 agent 請求量成長 9.4 倍，但透過分層路由（窄任務丟給便宜模型、寬任務才用前沿模型）讓總支出大致持平，每千次請求成本從高點下滑 34%。這套「技能註冊表 + 分層路由」機制做的事，本質上是把「該由誰做、用什麼工具做」的協調成本外部化成基礎設施，不必每次都靠工程師重新判斷。

同一天，Visa、Mastercard、Fiserv 加入由穩定幣基礎設施商 Rain 號召的 Agentic Payments Alliance（APA），25 個以上創始會員要一起訂出 agent 身分驗證、授權與詐欺防範的共同標準。理由講得很白：McKinsey 預估 agentic commerce 規模到 2030 年上看 3 到 5 兆美元，但如果每個 agent 對每個商家都要重新談一次授權方式，規模根本衝不出來——碎片化才是這個賽道最大的敵人。APA 要做的，就是把授權協調成本從「每家自己談」攤平成「產業共用一套規則」。

這跟今天 Arxiv digest 裡 K-GAT 那篇論文問的其實是同一件事：多 agent 系統的協作結構該怎麼被決定，才不會靠語意亂猜出過度或不足的分工。差別只在於 Uber 和 APA 是在生產端用「註冊表」與「產業聯盟」把答案實際寫出來，而不是留在論文的消融實驗裡。

對從業者的意義：護城河不在你接了哪個最強模型，而在你有沒有一層機制把「找出正確分工」跟「彼此信不信任」的成本壓下來——沒有這層，agent 數量一多，協調成本只會線性甚至更快往上衝。

## 今日動態

### 廠商動態

**Uber**：公開「軟體工廠」全貌，超過 70% 的 pull request 已出自本地或雲端 agent，員工建置逾 3,600 個技能收進共用註冊表，每日執行超過 3 萬次技能呼叫；2 月至 8 月週活躍使用者成長 7 倍、週 agent 請求量成長 9.4 倍，但透過分層路由與快取策略讓總支出大致持平，每千次請求成本較高點下滑 34%。（[來源](https://www.uber.com/us/en/blog/efficient-software-factory/)）

### 模型與基礎設施

**NVIDIA×聯發科**：NVIDIA 宣布斥資 35 億美元認購聯發科可轉換債券，深化雙方合作，聯發科將加入 NVIDIA NVLink Fusion 生態系，共同打造涵蓋雲端 AI 工廠、PC（RTX Spark／DGX Spark）與車用（Dimensity Auto 對接 DRIVE AGX）的跨世代運算平台。（[來源](https://www.blocktempo.com/nvidia-mediatek-3-5-billion-investment-ai-platform/)）

### 技術進展

今天的 [AI Agent Arxiv Digest](/posts/daily/2026-09-01-ai-agent-arxiv-digest) 三篇論文合起來在問同一件事：多 agent 系統的協作結構該怎麼被決定，才不會靠語意亂猜出過度或不足的分工——K-GAT 讓實際檢索到的證據而非問題語意決定該叫幾個 agent、怎麼連接，在 GPQA 上比 LLM-Debate 基準高 15.7 個百分點且 token 消耗減半；DoCtOR 則主張出包時不該全員反省，只該讓真正決定性犯錯的那個 agent 反省，在三個資料集分別帶來 22%–27% 的成功率提升。這跟今天 Uber、APA 在生產端各自用「技能註冊表」「產業聯盟標準」回答的其實是同一道題：分工與信任的結構該由機制決定，不是靠感覺猜。

### 工具與生態

**OpenClaw 2.0（v2026.8.1）**：專案史上最大改版一次收進 933 位貢獻者、逾 1.6 萬個合併 PR（社群戲稱「不小心做出來的 2.0」），維持 MIT 授權、不綁定單一模型供應商，新增遮罩式私密憑證請求、外掛信任審查與多家模型供應商套件隨選安裝。（[來源](https://www.explainx.ai/blog/openclaw-2-0-release-august-2026)）

### 法規與治理

**EU AI Act 進入執法階段**：歐盟執委會 AI Office 於 8 月 29 日首度對多家通用型 AI 模型供應商發出正式資訊請求（RFI），是 8 月 2 日通用型 AI 義務生效後的第一個執法動作，鎖定在歐盟市場上架模型的供應商。（[來源](https://tokenstead.ai/guides/eu-ai-act-first-enforcement-security-rfis)）

**台灣 AI 人才 400 億元計畫**：總統賴清德政府規劃明年編列超過新台幣 400 億元（約 12.6 億美元）推動 10 大 AI 專案，目標 2040 年前培育至少 50 萬名 AI 人才；數位部另推 BOO 模式引導民間投資 AI 運算中心，盼一年內累積至少 1 萬顆 GPU 算力，強調運算中心須落地台灣以符合本地法規與主權 AI 需求。（[來源](https://news.ltn.com.tw/news/focus/breakingnews/5558662)）

### 區域動態

**中國**

路透報導，美國正考慮把晶片出口管制範圍從實體晶片流向擴大到「遠端算力存取」——據稱字節跳動與新加坡雲端服務商 Aolani 合作在馬來西亞取得 NVIDIA 晶片算力，阿里巴巴、騰訊也被指採取類似安排，凸顯現行管制對雲端遠距存取的漏洞。（[來源](https://news.cnyes.com/news/id/6591738)）

**台灣**

NVIDIA 與聯發科深化合作並非單純代工訂單，而是聯發科正式加入 NVLink Fusion 生態系、共同定義邊緣到雲端的運算平台規格——對台灣供應鏈而言，這是從「純代工」往「平台共同開發」位移的訊號（詳見上方「模型與基礎設施」）。

**日韓**

南韓政府指定 SK Telecom、KT、Kakao 打造全民免費 AI 服務「AI for All」，今年提供合計 512 顆 NVIDIA B200 GPU，2027 年起補貼營運成本。（[來源](https://www.kocpc.com.tw/archives/667258)）

KT 標得重建友利銀行（Woori Bank）AI 客服與諮詢機器人的專案，將透過新推出的 Agent Connect 方案把對話與任務處理交給能跨管道保留脈絡的「AI 銀行員」agent 處理。（[來源](https://aiagentstore.ai/ai-agent-news/this-week)）

**東南亞**

新加坡政府在企業運算倡議（ECI）下，由微軟與 Digital Industry Singapore 主導推出 Agentic AI Accelerator 計畫，協助本地企業導入 agentic AI。（[來源](https://fulcrum.sg/southeast-asia-and-ai-adoption-the-return-of-cold-war-strategies/)）

Huawei Cloud 在新加坡上線 CodeArts AI agent，一次提供 16 個專職 agent 分工支援程式撰寫、測試與軟體開發流程。（[來源](https://fintechnews.sg/136496/cloud/huawei-cloud-codearts-agent-singapore/)）

**印度／南亞**

Cashfree Payments 旗下 AI「超級 agent」Relay 從 5 月起的商家測試版正式全面開放，自動化中小企業的收付款作業。（[來源](https://aiagentstore.ai/ai-agent-news/this-week)）

**中東**

AWS 與沙烏地阿拉伯政府背景的 HUMAIN 深化合作，宣布逾 53 億美元投資打造沙國第一個 AI Zone 雲端基礎設施區域，預計 2028 年前提供最高 50MW 容量；Adobe 同時宣布以逾 40 億美元價值，讓 2,700 萬名沙國公民與居民免費使用 Adobe AI 工具 12 個月。（[來源](https://www.aboutamazon.com/news/aws/aws-cloud-region-saudi-arabia)）

**非洲**

Huawei 在奈及利亞拉哥斯的 AI 雲端高峰會上，正式推出在地的 Agentic AI Cloud，作為該國「國家主權雲倡議」的一環，主打資料落地與產業客製應用。（[來源](https://techafricanews.com/2026/08/31/huawei-launches-agentic-ai-cloud-nigeria/)）

**拉丁美洲**

墨西哥企業軟體與 AI 轉型公司 Primero 完成 1,200 萬美元融資，聚焦協助當地企業導入 AI 轉型服務。（[來源](https://www.finsmes.com/)）

**大洋洲**

澳洲聯邦公平工作委員會（Fair Work Commission）因 AI 生成的「明顯錯誤」法律文件案件暴增，即將要求當事人揭露申請文件是否使用 AI 撰寫。（[來源](https://www.abc.net.au/news/2026-08-29/fair-work-commission-condemns-ai-legal-advice/107089766)）

### 商業案例 / 融資

**Visa／Mastercard／Fiserv 加入 Agentic Payments Alliance**：由穩定幣基礎設施商 Rain 號召、8 月 18 日成立的 25 個以上創始會員聯盟，鎖定 agent 身分驗證、授權框架、詐欺防範、忠誠計畫整合與監理倡議五大領域，McKinsey 預估 agentic commerce 規模到 2030 年上看 3 到 5 兆美元。（[來源](https://cryptobriefing.com/visa-mastercard-agentic-payments-alliance/)）

## 關鍵數字

| 項目 | 數字 | 來源 |
|------|------|------|
| Uber PR 出自 agent 比例 | 70%+ | [Uber Engineering](https://www.uber.com/us/en/blog/efficient-software-factory/) |
| Uber agent 技能數／每日執行次數 | 3,600+／30,000+ | 同上 |
| NVIDIA 認購聯發科可轉債金額 | 35 億美元 | [動區動趨](https://www.blocktempo.com/nvidia-mediatek-3-5-billion-investment-ai-platform/) |
| APA 創始會員數 | 25+ | [CryptoBriefing](https://cryptobriefing.com/visa-mastercard-agentic-payments-alliance/) |
| 台灣 AI 人才計畫預算 | 新台幣 400 億元（約 12.6 億美元） | [Taipei Times](https://news.ltn.com.tw/news/focus/breakingnews/5558662) |
| OpenClaw 2.0 合併 PR 數 | 16,000+（933 位貢獻者） | [explainx.ai](https://www.explainx.ai/blog/openclaw-2-0-release-august-2026) |

## 今日 Digest 一覽

- 📄 [AI Agent Arxiv Digest — 2026-09-01](/posts/daily/2026-09-01-ai-agent-arxiv-digest)
- 📄 [AI Agent GitHub Digest — 2026-09-01](/posts/daily/2026-09-01-ai-agent-github-digest)
- 📄 [AI Engineer 面試日練 — 2026-09-01：Deep Learning & NLP](/posts/daily/2026-09-01-ai-interview-daily)
- 📄 [模型卡｜DeepSeek-V4-Flash-Vision-Exp](/posts/daily/2026-09-01-model-deepseek-deepseek-v4-flash-vision-exp)
- 📄 [Product Builder 面試日練 — 2026-09-01：Metrics & Analytics](/posts/daily/2026-09-01-product-builder-interview-daily)
- 📄 [資安警報｜TeamPCP 供應鏈攻擊集團主嫌落網](/posts/daily/2026-09-01-security-teampcp-supply-chain-arrest)
- 📄 [工具推薦｜read4all — 讓 Agent 把 PDF、Office、截圖都讀成 Markdown](/posts/daily/2026-09-01-tool-read4all)

## 明日關注

- OpenClaw 2.0 的外部 plugin 遷移期（SDK 路徑異動、OpenAI route 遷移）會不會在社群端引發相容性災情
- EU AI Act 首波 RFI 收到的回覆內容，會不會揭露各家 GPAI 廠商實際合規落差有多大
- NVIDIA NVLink Fusion 生態系第一個採用聯發科客製 XPU 的雲端服務商會是誰，有沒有台灣業者跟進

## 今日收穫

之前以為「agent 基礎設施競賽」主要在框架與模型層打（誰的 orchestration 好用、誰的模型便宜），今天看 NVIDIA-聯發科深化晶片合作、AWS-HUMAIN 沙國 AI Zone、Huawei 在奈及利亞落地 Agentic AI Cloud 才意識到，這場競賽已經往更上游的「晶片—雲端—在地資料主權」整條供應鏈延伸；對台灣來說，這不只是選哪套 agent 框架的技術題，而是台灣半導體供應鏈能不能從「純代工」站到「平台共同開發」位置的地緣站位題。

## 參考資料

- [Uber：Running a Software Factory Efficiently at Uber Scale](https://www.uber.com/us/en/blog/efficient-software-factory/)
- [NVIDIA 認購聯發科可轉債 35 億美元 — 動區動趨](https://www.blocktempo.com/nvidia-mediatek-3-5-billion-investment-ai-platform/)
- [Visa, Mastercard, and Fiserv join Agentic Payments Alliance — CryptoBriefing](https://cryptobriefing.com/visa-mastercard-agentic-payments-alliance/)
- [Taiwan aims to train 500,000 AI pros by 2040 — Taipei Times](https://news.ltn.com.tw/news/focus/breakingnews/5558662)
- [EU AI Act first enforcement RFIs — tokenstead.ai](https://tokenstead.ai/guides/eu-ai-act-first-enforcement-security-rfis)
- [美國擬管制 AI「算力」，中國透過海外數據中心取得晶片運力 — 鉅亨網](https://news.cnyes.com/news/id/6591738)
- [南韓 AI for All 全民免費 AI 服務 — 電腦王阿達](https://www.kocpc.com.tw/archives/667258)
- [AI Agents News — Week of August 31, 2026（KT／Woori Bank、Cashfree Relay）](https://aiagentstore.ai/ai-agent-news/this-week)
- [Southeast Asia and AI Adoption — Fulcrum.sg](https://fulcrum.sg/southeast-asia-and-ai-adoption-the-return-of-cold-war-strategies/)
- [Huawei Cloud Launches CodeArts AI Agent in Singapore — Fintech Singapore](https://fintechnews.sg/136496/cloud/huawei-cloud-codearts-agent-singapore/)
- [AWS to launch first cloud infrastructure region in Saudi Arabia](https://www.aboutamazon.com/news/aws/aws-cloud-region-saudi-arabia)
- [Huawei Launches Agentic AI Cloud in Nigeria — Tech Africa News](https://techafricanews.com/2026/08/31/huawei-launches-agentic-ai-cloud-nigeria/)
- [FinSMEs — Primero 融資快訊](https://www.finsmes.com/)
- [Fair Work Commission condemns 'plain wrong' AI legal advice — ABC News](https://www.abc.net.au/news/2026-08-29/fair-work-commission-condemns-ai-legal-advice/107089766)
- [OpenClaw 2.0 Release — explainx.ai](https://www.explainx.ai/blog/openclaw-2-0-release-august-2026)
