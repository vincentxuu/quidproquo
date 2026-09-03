---
title: "區域焦點｜中國"
date: 2026-08-21
category: daily
type: digest
tags: [ai-agent, region, daily, china]
lang: zh-TW
description: "DeepSeek 開源 Agent 執行框架 DeepSeek Harness 同步大幅調漲 API 價格，阿里 Qwen 全面開源旗艦權重，智譜 GLM-5.3 因資安能力「意外湧現」暫緩開源，字節跳動與騰訊獲准進口 H200"
tldr: "DeepSeek 開源 MIT 授權的 Agent 執行框架 DeepSeek Harness，同週卻把 API 尖峰時段價格最高調漲 1,100%；阿里通義開源旗艦權重 Qwen3.8 Max（LongBench v2 奪冠）與可在筆電運行的 Qwen3.8-27B，並開源上下文基礎設施 MyContext；智譜 GLM-5.3 資安能力「意外湧現」，CyberGym 漏洞挖掘分數超越 Anthropic 對照模型，因而暫緩原定的開源計畫；字節跳動、騰訊近週各自獲准進口約 1 萬顆 NVIDIA H200，晶片管制出現邊際鬆動。"
series:
  name: "AI Region Focus"
  order: 1
---

> 🌏 [English version](/en/posts/daily/2026-08-21-region-china-en)

## 區域：中國

本週中國 AI Agent 生態的關鍵字是「開放與收緊同時發生」：DeepSeek 一邊開源 Agent 執行層基礎設施、一邊大幅調漲模型 API 價格；智譜的新模型因為太會挖漏洞，反而把原定的開源計畫往後延；北京則在晶片管制上鬆開一道小口子。三件事看似矛盾，其實都指向同一個訊號——中國 AI 產業正在從「拚模型分數」轉向「拚誰能把整條價值鏈的籌碼握在自己手上」。

## 本週重要動態

### DeepSeek 開源 Agent 執行框架 DeepSeek Harness，同週 API 大漲最高 1,100%

DeepSeek 於北京時間 8 月 13 日晚間開放 DeepSeek Harness（DSH）開發者預覽版，MIT 授權開源。這不是模型權重，而是模型之外的整套 Agent 運行基礎設施：模型、工具、技能、會話、沙箱、儲存、Agent 迴圈與使用者介面全部做成可替換的外掛，架構建立在自研的 Cordis 外掛系統上，並提供標準、極簡（PTC，Programmatic Tool Calling）、創造四種預設模式。DeepSeek 甚至為 Harness 另開一個微信公眾號「DeepSeek Harness 團隊」，用黑色鯨魚與 DeepSeek 模型慣用的藍色鯨魚做品牌區隔，顯示公司想把 Harness 經營成獨立的開發者生態。發布效果驚人：一小時內 GitHub star 破 2 萬（史上最快紀錄），本週累積約 15.8 萬星，社群兩天內湧入 2,000+ 外掛提案，短短內測期就有約 300 個外掛被開發出來。（[36氪 — Harness 架構解析](https://www.36kr.com/p/3938566998834308)、[36氪 — 產品實測](https://www.36kr.com/p/3938529497562503)、[MarkTechPost](https://www.marktechpost.com/2026/08/17/deepseek-ai-releases-deepseek-harness-in-developer-preview)）

幾乎同一時間，DeepSeek 宣布 V4-Pro／V4-Flash 的 API 價格從 8 月 17 日北京時間零時起全面調漲，並首度導入尖峰／離峰差別定價（北京時間 9:00–12:00、14:00–18:00 為尖峰，其餘為離峰，離峰價格為尖峰的一半）。以 V4-Pro 為例，尖峰時段快取命中輸入價格從每百萬 token 0.025 元人民幣漲到 0.3 元（漲幅 1,100%），輸出價格從 6 元漲到 27 元（漲幅 350%）。DeepSeek 官方說法是「更合理分配運算資源」，但多家中國媒體指出這與國內算力持續吃緊有關，且不是單一事件：智譜今年已三度調價，月之暗面隨 Kimi K3 上線 API 輸入價格漲超 3 倍、輸出漲近 4 倍。這場漲價潮標誌中國大模型的競爭邏輯正從「價格戰」轉回「價值戰」。（[PTT／商傳媒](https://www.ptt.cc/bbs/Stock/M.1786681404.A.770.html)、[財訊快報](https://tw.stock.yahoo.com/news/deepseek-v4-api%E4%B8%8B%E9%80%B1-%E5%85%A8%E9%9D%A2%E6%BC%B2%E5%83%B9-%E6%9C%80%E9%AB%98%E6%BC%B2%E5%B9%85%E9%81%941100-235102463.html)、[鉅亨網](https://hao.cnyes.com/post/263540)）

### 阿里通義全面開源旗艦權重，Qwen3.8 Max 登上長文本榜首

阿里雲本週密集發布：Qwen3.8 Max 在 LongBench v2 長文本推理排行榜以 66.3% 奪冠，超越 Claude Opus 4.5（64.4%）與自家上一代 Qwen3.5 397B（63.2%），同時開源這款旗艦模型的權重；另一款 Qwen3.8-27B 採 Apache 2.0 授權、支援視覺輸入，可在 17GB 顯存（即一般筆電等級硬體）運行，在 Artificial Analysis Intelligence Index 拿下 52 分，被視為中型開源模型的重要里程碑。阿里千問辦公團隊還開源了上下文基礎設施「MyContext」，可本地化運行於使用者自己的裝置，把 IM 對話、文件、協作紀錄等多源資料自動整理成可回溯、持續更新的工作檔案，目標是解決 Agent 執行長任務時常見的幻覺與矛盾資訊問題。（[CNBC](https://www.cnbc.com/2026/08/17/alibaba-meta-qwen-open-weight-ai-laptop-models.html)、[Artificial Analysis](https://artificialanalysis.ai/models/qwen3-8-27b)）

### 智譜 GLM-5.3 資安能力「意外湧現」，暫緩開源計畫

智譜於 8 月 14 日發布 GLM-5.3，與 GLM-5.2 共用同一基座模型，所有能力提升全部來自後訓練規模化。編碼能力較上一代提升約 50%，DeepSWE 從 46.2% 升至 66.9%、Terminal-Bench 3.0 從 4.6% 大幅提升至 28.3%。真正讓智譜緊急煞車的，是官方所稱「意外湧現」的資安能力：漏洞挖掘基準 CyberGym 拿下 84.5%（開源模型第一，較 5.2 的 77.2% 明顯提升），甚至超過智譜自己對照的 Anthropic 對照模型（83.8%）；漏洞利用基準 ExploitBench 更是從 5.2 的 24.4% 翻倍到 54.4%。官方揭露 GLM 系列已掃描 269 個開源專案、找出 2,436 個漏洞，其中 1,097 個為高危或嚴重等級。因此，智譜把原訂的開源權重時程延後約兩週，理由是需要先評估開放權重可能帶來的資安風險——這是中國頭部模型第一次因為「太會攻擊」而暫緩開源。（[36氪 — 實測](https://m.36kr.com/p/3939428375788680)、[36氪 — 延遲開源始末](https://www.36kr.com/p/3945790191179400)）

市場對此反應積極：高盛在 8 月 17 日的報告中稱 GLM-5.3 是「中國 AI 模型進展的又一重大躍升」，維持智譜「中性」評級，目標價 1,610 港元。⚠️ 需要澄清的是，本週流通的部分中文報導稱智譜「市值突破 1 兆人民幣」，但交叉查證後這其實是把兩件事混在一起：智譜市值站上 1 兆的門檻發生在 6 月（GLM-5.2 帶動），且單位是港元而非人民幣；高盛 8 月 17 日報告給出的最新市值是約 750 億美元，高於 DeepSeek 最新估值（500 億美元）與 MiniMax（140 億美元），但換算後低於「1 兆人民幣」的規模。（[Yahoo 財經香港](https://hk.finance.yahoo.com/news/%E5%A4%A7%E8%A1%8C-%E9%AB%98%E7%9B%9B-glm-5-3%E7%82%BA%E4%B8%AD%E5%9C%8Bai%E6%A8%A1%E5%9E%8B%E9%80%B2%E5%B1%95%E5%8F%88-022344289.html)、[財新網](https://m.caixin.com/m/2026-06-22/102456385.html)）

### 字節跳動、騰訊獲准進口 H200，晶片管制邊際鬆動

英國《金融時報》8 月 19 日報導，中國政府已批准少量 NVIDIA H200 晶片進口，字節跳動與騰訊近週各自收到約 1 萬顆，其他中國科技公司可能很快跟進。值得注意的是，美方原本已批准每家中國企業最多購買 10 萬顆 H200，但北京希望大部分晶片留在中國大陸以外（例如香港）以扶植華為等國產晶片廠商，因此字節、騰訊實際到貨的約 1 萬顆，只是美方核准上限的一成左右。採購仍須經過國家發改委審批。報導引述知情人士指出，中國實驗室在推論端已愈來愈依賴國產晶片，但訓練前沿模型仍高度仰賴 NVIDIA 架構——這也解釋了為何北京願意在此刻鬆手：Moonshot K3、阿里、DeepSeek、Z.ai（智譜）近期發布的模型能力差距持續縮小，北京不希望晶片供給成為拖累頭部實驗室追趕的瓶頸。（[香港01](https://global.hk01.com/%E5%8D%B3%E6%97%B6%E5%9B%BD%E9%99%85/60381478/%E8%8B%B1%E5%AA%92-%E4%B8%AD%E5%9B%BD%E5%85%81%E8%BF%9B%E5%8F%A3%E5%B0%91%E9%87%8Fnvidia-h200%E8%8A%AF%E7%89%87-%E8%85%BE%E8%AE%AF%E4%B8%8E%E5%AD%97%E8%8A%82%E8%B7%B3%E5%8A%A8%E5%90%84%E8%8E%B71%E4%B8%87%E5%9D%97)、[世界新聞網](https://www.worldjournal.com/wj/story/124277/9700740?zh-cn=)）

## 深度分析

我認為本週中國 AI Agent 生態最值得注意的訊號，是「開放」正在變成一種被精算過的策略籌碼，而不再是單純的技術理念。用五力分析（Porter's Five Forces）拆解本週的四則新聞，可以看到一致的邏輯：

**新進入者的威脅（進入壁壘）**：DeepSeek 開源 Harness 表面上降低了「做出一個能用 Agent 產品」的門檻，但真正的壁壘轉移到了外掛生態——兩天內湧入 2,000+ 外掛提案，先卡位生態的人會建立起後進者難以複製的網路效應，這和開放權重模型（誰下載都能用）的競爭邏輯完全不同。

**供應商議價能力**：H200 進口鬆綁不是「晶片自由化」，而是北京主動調節的議價槓桿——刻意把大部分核准晶片留在香港而非大陸，一邊維持對 NVIDIA 的採購依賴，一邊保護華為等國產供應鏈的議價空間，讓晶片成為北京手上可以隨時鬆緊的政策工具。

**替代品的威脅**：智譜暫緩 GLM-5.3 開源，本質上是在管理「開放權重模型」對「受控閉源服務」的替代速度——一旦權重公開，任何人都能拆掉安全限制並接上攻擊工具，替代速度會快到智譜來不及評估風險，所以選擇先減速。

**同業對抗強度**：DeepSeek 在開源 Harness 的同一週大漲 API 價格，看似矛盾，其實是把競爭場域一分為二——用免費開源的執行層鞏固開發者心佔率（不看重短期營收），同時用漲價的模型層開始收割議價權（模型能力已具備收費資格）。這種「兩層拆開打」的打法，比單純漲價或單純開源都更難被對手同時複製。

## 對台灣創業者的啟示

- 如果你在做 Agent 框架或開發者工具：DeepSeek Harness「用開源執行層換開發者心佔率」的打法值得研究，但要注意中國模式假設你同時擁有便宜的底層模型可以收費——台灣團隊若沒有自研模型，更適合把心力放在外掛生態或垂直整合層，而非重造一個 Harness。
- 如果你的產品依賴 DeepSeek、Qwen、GLM 等中國開源模型做成本優化：這波漲價潮（DeepSeek 尖峰時段最高漲 1,100%、智譜今年三度調價）代表「中國開源模型永遠比美系便宜」的假設已經不成立，成本模型需要加入尖峰／離峰、匯率與供應商集中度風險，不要把單一供應商的低價當作長期護城河。
- 如果你在做資安或漏洞掃描相關產品：智譜 GLM-5.3 的資安能力「意外湧現」是一個訊號——通用編碼模型的漏洞挖掘能力正在快速逼近甚至超越專用資安模型，台灣資安新創若還在用「AI 輔助」當差異化賣點，護城河可能比想像中更快被通用大模型吃掉，應該往「模型之上的判斷與修復流程」移動。

## 今日收穫

之前以為中國模型公司的「開源」策略就是單純的低價策略延伸——用免費换市占。這週看下來發現，開源已經被拆成更精細的槓桿：DeepSeek 用開源 Harness 换開發者心佔率、同時漲模型價格收割營收；智譜則反過來，用「暫緩開源」管理風險與品牌信任。開源與否，在中國已經不是意識形態選擇，而是每家公司依照自己在價值鏈的位置，算出來的定價與風控策略。

## 參考資料

- [36氪 — DeepSeek的Harness，為何是一頭黑色鯨魚？](https://www.36kr.com/p/3938566998834308)
- [36氪 — DeepSeek Harness 來了，它不想做下一個 Codex](https://www.36kr.com/p/3938529497562503)
- [MarkTechPost — DeepSeek releases DeepSeek Harness developer preview](https://www.marktechpost.com/2026/08/17/deepseek-ai-releases-deepseek-harness-in-developer-preview)
- [PTT／商傳媒 — DeepSeek 模型 API 最高漲幅破 1100%](https://www.ptt.cc/bbs/Stock/M.1786681404.A.770.html)
- [Yahoo 財訊快報 — DeepSeek V4 API 下週一全面漲價](https://tw.stock.yahoo.com/news/deepseek-v4-api%E4%B8%8B%E9%80%B1-%E5%85%A8%E9%9D%A2%E6%BC%B2%E5%83%B9-%E6%9C%80%E9%AB%98%E6%BC%B2%E5%B9%85%E9%81%941100-235102463.html)
- [鉅亨網 — DeepSeek 調價正式生效，漲幅最高達1100%](https://hao.cnyes.com/post/263540)
- [CNBC — Alibaba open-sources Qwen open-weight AI laptop models](https://www.cnbc.com/2026/08/17/alibaba-meta-qwen-open-weight-ai-laptop-models.html)
- [Artificial Analysis — Qwen3.8-27B](https://artificialanalysis.ai/models/qwen3-8-27b)
- [36氪 — 實測GLM-5.3：同一個模型，為什麼會像兩個AI](https://m.36kr.com/p/3939428375788680)
- [36氪 — 因為AI新版本太強，強到智譜暫時不敢開源了](https://www.36kr.com/p/3945790191179400)
- [Yahoo 財經香港 — 高盛：GLM-5.3為中國AI模型進展又一重大躍升](https://hk.finance.yahoo.com/news/%E5%A4%A7%E8%A1%8C-%E9%AB%98%E7%9B%9B-glm-5-3%E7%82%BA%E4%B8%AD%E5%9C%8Bai%E6%A8%A1%E5%9E%8B%E9%80%B2%E5%B1%95%E5%8F%88-022344289.html)
- [財新網 — 智譜市值破萬億「中國版Anthropic」估值成立麼](https://m.caixin.com/m/2026-06-22/102456385.html)
- [香港01 — 英媒：中國允進口少量Nvidia H200芯片，騰訊與字節跳動各獲1萬塊](https://global.hk01.com/%E5%8D%B3%E6%97%B6%E5%9B%BD%E9%99%85/60381478/%E8%8B%B1%E5%AA%92-%E4%B8%AD%E5%9B%BD%E5%85%81%E8%BF%9B%E5%8F%A3%E5%B0%91%E9%87%8Fnvidia-h200%E8%8A%AF%E7%89%87-%E8%85%BE%E8%AE%AF%E4%B8%8E%E5%AD%97%E8%8A%82%E8%B7%B3%E5%8A%A8%E5%90%84%E8%8E%B71%E4%B8%87%E5%9D%97)
- [世界新聞網 — 英媒：中國松綁Nvidia H200芯片管制 字節跳動、騰訊各獲1萬顆](https://www.worldjournal.com/wj/story/124277/9700740?zh-cn=)
