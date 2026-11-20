---
title: "融資速報｜Model ML Series B $250M（估值衝上 $1.5B，General Atlantic／QED 領投）"
date: 2026-11-18
category: daily
type: digest
tags: [ai-agent, funding, daily, model-ml, fintech-ai]
lang: zh-TW
description: "做銀行家／顧問／投資人個人 AI agent 的 Model ML 完成 $250M Series B，估值 $1.5B，General Atlantic 與 QED Investors 共同領投，ARR 年增 12 倍"
tldr: "Model ML 完成 $250M Series B，由 General Atlantic 與 QED Investors 共同領投，估值衝上 $1.5B,ARR 在 2026 年 Q3 年增 12 倍。這筆錢代表的訊號：金融業的 AI agent 戰場已經從「聊天機器人回答問題」轉向「主動幫個人員工把工作做完」。"
series:
  name: "AI Agent Funding"
  order: 142
---

> :globe: [English version](/posts/daily/2026-11-18-funding-model-ml-en)

## 融資資訊

| 項目 | 值 |
|---|---|
| 公司 | Model ML（英國，倫敦；另設紐約據點） |
| 輪次 | Series B |
| 金額 | $250M |
| 領投 | General Atlantic、QED Investors |
| 跟投 | Evolution Equity Partners、Airtree、Forestay Capital、Y Combinator、FT Partners、Latitude、Inception Fund、13Books Capital |
| 估值 | $1.5B |
| 累計融資 | $350M（2025 年 2 月 Seed $12M → 2025 年 11 月 Series A $75M → 本輪 Series B $250M） |
| 成立年份 | 2023 年 |
| 員工數 | 180 人（Y Combinator 公司檔案） |

## 這家公司做什麼

Model ML 是做銀行家、顧問與投資人專屬個人 AI agent 的公司——主張一般的聊天機器人只會「回答問題」,它要做的是「直接把工作做完」。

產品運作在客戶自己的系統與資料裡,了解使用者的客戶關係、進行中的交易與偏好的工作方式,持續運行、隨互動次數增加變得更個人化。舉例來說,當有新聞提到銀行家追蹤的某家公司,agent 會主動判斷相關性、分析可能影響,並按該公司偏好的格式準備好報告——目標是在專業人士開口之前就把分析做完,而不是單純發一則通知。平台採模型無關(model-agnostic)設計,會依速度、成本與準確度在不同模型間評測並路由任務,其中一部分工作已經轉由自家微調的開源模型處理,公司宣稱成本可壓到前沿模型的 2%、速度快 5 倍,準確度維持相當或更高。資料安全上,平台支援在客戶自有環境內部署,客戶資料不會被用來訓練模型,並已取得 ISO/IEC 27001:2022 與 SOC 2 Type II 認證。

目前客戶遍及倫敦、紐約、巴黎、馬德里、東京、新加坡、杜拜等市場的金融與專業服務機構,2026 年第三季 ARR 年增 12 倍、日活躍使用者年增 26 倍。在金融 AI agent 這個子領域,Model ML 與紐約的 Rogo(2026 年 4 月 Kleiner Perkins 領投 $160M Series D)、Hebbia(2024 年 7 月 a16z 領投 $130M Series B)同場競爭,差異是 Model ML 主打「個人專屬 agent」而非針對單一任務的研究工具。

## 這筆融資的信號

### 對 Agent 生態的意義

這是垂直金融 AI agent 從「輔助研究」走向「主動完成工作」的又一個樣本。資金主要用於擴編倫敦與紐約的研發團隊、加速產品開發,並支援更廣泛的客戶部署——意味著接下來這個子領域的競爭重點,會從「模型回答得準不準」轉移到「agent 敢不敢在使用者開口前就先把事情做完」,而這需要更深的企業系統整合與更高的信任門檻。

### 投資人在賭什麼

General Atlantic 全球金融服務負責人 Paul Stamas 的邏輯是金融機構正在從「AI 試驗」快速轉向「日常使用」,看中的是 Model ML 已經讓客戶把愈來愈複雜的工作交給它處理這個採用深度。QED Investors 合夥人 Nigel Morris 的角度更直接——18 個月前公司才剛走出 stealth,現在產品已經深度嵌入多家全球大型機構的系統裡,他押注的是這個團隊「建得比誰都快」的執行力,而不是單一產品功能的領先。

### 值得觀察的數字

```diagram
title: Model ML 三輪募資規模的跳躍
desc: Seed 到 Series B 不到兩年，單輪金額一路放大，Series B 是 Seed 的 20 倍以上。
caption: 數字來自 techfundingnews（2026-11-17）彙整官方公告。
---
<svg viewBox="0 0 640 260">
  <text class="dg-small" x="40" y="24" dominant-baseline="central">單輪募資金額（$M）</text>
  <line class="dg-grid" x1="40" y1="40" x2="40" y2="216"/>

  <g>
    <rect class="dg-bar dg-c-muted" x="40" y="52" width="16" height="36"/>
    <text class="dg-sub" x="64" y="70" dominant-baseline="central">Seed $12M（2025-02）</text>
  </g>
  <g>
    <rect class="dg-bar dg-c-muted" x="40" y="108" width="100" height="36"/>
    <text class="dg-sub" x="148" y="126" dominant-baseline="central">Series A $75M（2025-11）</text>
  </g>
  <g>
    <rect class="dg-bar dg-c-accent" x="40" y="164" width="333" height="36"/>
    <text class="dg-label dg-text--accent" x="381" y="182" dominant-baseline="central">Series B $250M（2026-11）</text>
  </g>

  <line class="dg-axis" x1="40" y1="40" x2="40" y2="216"/>
</svg>
```

- 單輪募資金額從 $12M 到 $250M,不到兩年放大超過 20 倍,是這篇整理到的所有融資案例裡,輪次間跳躍幅度最大的一個。
- ARR 年增 12 倍、日活躍使用者年增 26 倍,是公司自報數字,沒有第三方審計,但兩個成長率數字彼此方向一致(用量先行、營收跟上),比單一數字更可信。
- 累計融資 $350M 略高於三輪帳面加總($12M+$75M+$250M=$337M),代表中間可能還有未揭露的過渡輪或增資,公司與報導均未說明差額來源。

## Watchlist 狀態

Model ML 尚未在 watchlist 中。建議加入 section B3(Agent 平台 / Builder)或新增金融垂直子類,追蹤重點:銀行家 / 顧問 / 投資人個人 AI agent、$250M Series B、估值 $1.5B,與 Rogo、Hebbia 同場競爭金融 AI agent 市場。

## 今日收穫

Model ML 這輪刻意不強調「我們是另一個聊天機器人」,而是用「主動在你開口前把工作做完」這句話定義自己——這代表金融業對 AI agent 的期待門檻正在往上修正:光是「回答問題準」已經不夠,能不能在沒人盯著的情況下主動判斷優先順序、動手把事情做完,才是下一階段真正被定價的能力。

## 參考資料

- [Model ML hits $1.5B valuation with $250M raise, just 18 months after emerging from stealth - Tech.eu](https://tech.eu/2026/11/17/model-ml-hits-15b-valuation-with-250m-raise-just-18-months-after-emerging-from-stealth/)
- [London's Model ML raises $250M from General Atlantic and QED to put AI agents inside banks - Tech Funding News](https://techfundingnews.com/londons-model-ml-raises-250m-from-general-atlantic-and-qed-to-put-ai-agents-inside-banks/)
- [Model ML is Europe's newest Unicorn with €227 million raise to put AI agents to work in finance - EU-Startups](https://www.eu-startups.com/2026/11/model-ml-is-europes-newest-unicorn-with-e227-million-raise-to-put-ai-agents-to-work-in-finance-makes/)
