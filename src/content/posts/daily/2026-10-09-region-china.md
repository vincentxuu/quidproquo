---
title: "區域焦點｜中國"
date: 2026-10-09
category: daily
tags: [ai-agent, region, daily, china]
lang: zh-TW
type: deep-dive
description: "北京網信辦調查 DeepSeek、月之暗面把使用者資料透過 Claude 外送；研究者發現一支「代理機隊」在騰訊基礎設施上繞過阿里地圖 API 規則；中國一個月內衝出 16 個新模型，Anthropic 喊話暫停沒人理"
tldr: "中國國家網信辦開案調查 DeepSeek 與月之暗面，原因是兩家公司疑似把使用者請求透過 Anthropic Claude 轉發到美國伺服器——這是 Anthropic 今年 2 月指控七家中國實驗室「非法蒸餾」(illicit distillation) 報告的鏡像反轉：Anthropic 告的是技術被偷，北京查的是資料外流；獨立研究者透過 urlquery 監測，發現一支「代理機隊」(agent fleet，非 swarm) 跑在騰訊基礎設施上、繞過阿里地圖 Amap 的 API 存取規則查詢公共場所路線；Nikkei／SCMP 報導中國 9 月單月衝出至少 16 個新模型，Anthropic CEO Dario Amodei 喊話業界放慢腳步完全沒人理。"
series:
  name: "AI Region Focus"
  order: 14
---

## 區域：中國

這週中國 AI 生態最值得注意的不是哪個模型刷新了榜單，而是三件事同時指向同一個現象：中國的 AI 競速已經快到連自己的監理機關、自己的大廠之間都開始互相「踩線」——網信辦查自己家公司把資料送出境，騰訊的代理在繞阿里的規則，而整個產業一個月衝出 16 個新模型讓國際上喊「暫停」的聲音完全被淹沒。

## 本週重要動態

### 網信辦開案調查 DeepSeek、月之暗面：Anthropic 的「蒸餾」指控出現鏡像反轉

中國國家互聯網信息辦公室（CAC）10/5 被證實已開案調查 DeepSeek 與月之暗面（Moonshot AI），官員已前往兩家公司約談高層與員工。調查核心是：這兩家公司是否把中國使用者的請求悄悄透過 Anthropic 的 Claude 模型轉發到美國伺服器，使用者完全不知情。若屬實，可能違反中國的資料安全法規。目前調查仍在進行，尚未有任何處罰結果。（[Yahoo News 轉載](https://www.yahoo.com/news/world/articles/china-probes-deepseek-moonshot-over-114601296.html)）

這起調查的源頭，是 Anthropic 9/10 發布的一份 154 頁威脅情報報告，指控七家中國實驗室——阿里巴巴、月之暗面、DeepSeek、智譜、MiniMax、小米、商湯——透過 Claude「非法蒸餾」(illicit distillation)：用自己的帳號大量呼叫 Claude、收集回覆當作訓練資料。報告估計七家公司加總約 1.9 億次交互，其中阿里巴巴一家就佔 1.51 億次，月之暗面 5 至 7 月間推送超過 2,300 萬次，DeepSeek 曾在 7 月單一 14 天內產生 1,210 萬次。有意思的落差是：阿里巴巴的交互量遠高於月之暗面與 DeepSeek，但目前網信辦調查的對象裡沒有阿里巴巴。同一組事實，Anthropic 的敘事是「技術被偷」，北京的敘事恰好相反——是「資料外流到境外」，兩邊看的是同一條資料流，解讀方向完全相反。

### 獨立研究者發現「代理機隊」跑在騰訊基礎設施上，目標是阿里的地圖服務

獨立研究團隊 10/5 發布初步報告，透過監測網域掃描服務 urlquery 的流量，發現一組 AI 代理活動似乎運行在騰訊的基礎設施上，查詢目標集中在阿里巴巴的地圖服務 Amap（高德地圖），內容是公園、動物園、醫院等公共場所的不同入口路線。研究者特別指出這批代理「沒有彼此協調的跡象」，因此刻意不用「蜂群」(swarm) 這個詞，改稱「代理機隊」(agent fleet)：大量平行代理在做同一類任務，但彼此不通訊。這個監測手法此前也曾揭露 OpenAI 代理長期攻擊線上資料庫的行為，屬於「代理機器在網路上留下可被追蹤的足跡」這個更大趨勢的一部分。研究者判斷，這批代理目前看起來只是在繞過阿里的 API 存取限制，還沒有發現更惡意的行為——但這個案例本身就足以說明，中國互聯網巨頭之間的 AI 代理活動，已經在彼此的地盤上留下痕跡。（[TechCrunch](https://techcrunch.com/2026/10/05/researchers-are-tracking-a-chinese-ai-agent-fleet/)）

### 一個月衝出 16 個新模型：Anthropic 喊「暫停」，中國業界聽不到

日經亞洲（Nikkei Asia）10/7 報導，中國 AI 產業 9 月單月至少推出 16 個新模型，涵蓋 DeepSeek、小米等公司，完全沒有理會 Anthropic CEO Dario Amodei 近期多次呼籲業界放慢前沿模型開發速度、正視安全風險的喊話。南華早報（SCMP）同日的分析進一步描繪了這種「模型疲勞」(model fatigue) 現象的強度：9/22 當天，小米直播了 MiMo-V2.6 的訓練過程，Anthropic 同時發布 Opus 5.5，一小時後 OpenAI 又突襲發布 GPT-6 Sol 與 Luna——而這波衝擊之前，智譜、DeepSeek、騰訊、阿里巴巴、月之暗面已經接連發布過大型更新。SCMP 引用分析師觀點：矽谷開始有人討論「模型疲勞」，中國的超競爭環境則是這個現象的加強版——發布頻率快到連個別突破都很難再搶到關注。（[Nikkei Asia](https://asia.nikkei.com/business/technology/artificial-intelligence/china-s-deepseek-peers-launch-16-ai-models-in-month-despite-anthropic-warning) · [SCMP](https://www.scmp.com/tech/big-tech/article/3369757/chinas-ai-race-accelerates-model-fatigue-becomes-next-challenge)）

## 深度分析

我認為這三件事適合放進五力分析的「同業競爭」與「替代品威脅」兩個角一起看，因為它們共同指向一個反直覺的結論：中國 AI 產業內部的競爭強度，已經高到開始反噬產業自己的監理秩序與資源效率。

**同業競爭構面的「監理追不上競速」**：網信辦查自己國家的企業把資料送到境外的 Claude，說明了即使是威權色彩較強、理論上監理能力較強的體制，面對「企業為了追上模型能力不惜繞道用對手技術」這種競爭壓力時，監理機關一樣是事後才發現、事後才調查。這不是中國特有的問題，而是全球 AI 競速的共同症狀——只是中國的案例特別諷刺：被繞道使用的對手技術，剛好就是指控它們蒸餾的那家公司。

**同業競爭構面的「地盤內鬥」**：騰訊的代理在阿里的地圖服務上留下足跡，這個案例的重要性不在於行為本身有多惡意（研究者自己也說還沒發現惡意跡象），而在於它揭示了一個新的競爭面向——中國幾大平台過去的競爭主要在使用者流量、生態系鎖定，現在則延伸到「代理會不會去碰對手的 API」這個新戰場。當每家公司都在加速部署 AI 代理做各種自動化任務，代理之間互相踩線的機率只會增加，而且很難靠傳統的競業協議或資料保護條款處理——代理不是員工，它只是在執行一個被賦予的任務。

**替代品威脅構面的資源錯置**：一個月 16 個新模型、同一天三家公司同時發布，這種發布節奏的本質是「害怕被認為落後」比「真的有重大技術突破要發布」更強的驅動力。Amodei 喊暫停沒人理，不是因為中國業界不理解風險，而是因為在五力框架裡，「暫停」在同業競爭白熱化的市場裡等同於主動讓出市占——這是典型的囚徒困境：所有人都知道一起放慢比較好，但沒有人敢先停下來。

## 對台灣創業者的啟示

- 如果你的產品依賴中國模型 API（DeepSeek、Qwen、智譜等）：網信辦這次調查的對象是「資料是否外流境外」，不是模型能力本身——但這提醒你，若你的架構把使用者資料經過第三方模型代理轉發（不管是出於成本或能力考量），需要重新檢視資料流向是否符合你服務對象所在地的資料保護法規，這不只是中國公司的問題
- 如果你在做 AI 代理相關的資安或監測工具：urlquery 這類「透過第三方掃描服務的流量側錄」監測手法，證明代理活動的足跡比想像中更容易被追蹤——台灣團隊若在做企業內部的 agent 治理或異常行為偵測，這類「代理會不經意留下可觀測痕跡」的特性值得納入產品設計
- 如果你在做模型評測或選型服務：一個月 16 個新模型的發布節奏，意味著「哪個模型現在最強」這個問題的保鮮期可能只有幾週——幫企業做「持續性模型評測與切換建議」而不是「一次性選型報告」，在這種發布節奏下會比靜態的比較文章更有價值

## 今日收穫

之前以為中國 AI 產業的監理敘事主要是「國家隊統一步調、對外一致喊話」。這週看完網信辦調查自己家的 DeepSeek 跟月之暗面，才發現監理機關和企業之間的落差，跟其他國家其實沒有本質差異——只是中國的落差被放大成一個特別諷刺的版本：企業為了追上競爭對手的能力，繞道用了被指控剽竊對象的技術，而監理機關是從外部報告才知道這件事。原來「競速壓力大到企業自己會踩線、監理機關事後才知道」這個模式，在任何體制下都一樣會發生,差別只在踩線的方式不同。

## 參考資料

- [AI Insider／Dapta — Did DeepSeek just get caught sending your data to Claude?](https://dapta.ai/blog-posts/ai-news-deepseek-claude)
- [Yahoo News — China probes DeepSeek, Moonshot over data routed through Claude](https://www.yahoo.com/news/world/articles/china-probes-deepseek-moonshot-over-114601296.html)
- [TechCrunch — Researchers are tracking a Chinese AI 'agent fleet'](https://techcrunch.com/2026/10/05/researchers-are-tracking-a-chinese-ai-agent-fleet/)
- [Nikkei Asia — China's DeepSeek, peers launch 16 AI models in month despite Anthropic warning](https://asia.nikkei.com/business/technology/artificial-intelligence/china-s-deepseek-peers-launch-16-ai-models-in-month-despite-anthropic-warning)
- [SCMP — AI overload? Why China's developers cannot stop launching model upgrades](https://www.scmp.com/tech/big-tech/article/3369757/chinas-ai-race-accelerates-model-fatigue-becomes-next-challenge)
- [Wikipedia — Anthropic（蒸餾指控背景時間線）](https://en.wikipedia.org/wiki/Anthropic)
