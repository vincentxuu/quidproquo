---
title: "Product Builder 面試日練 — 2026-09-17：AI Product Design"
date: 2026-09-17
category: daily
type: digest
tags: [product-builder-interview, daily, ai-product]
lang: zh-TW
description: "今日練 AI Product Design：用 Trust Scaffolding 的自主性階梯拆解「企業要全面管控 AI agent 回覆、ML 團隊說限制太多會拖垮模型品質」這道 Sierra 面試真題，案例是 Gemini 用草稿卡片把『送出』留給人類的人機協作設計。"
tldr: "AI 產品設計面試最容易失分的地方，是把『human-in-the-loop』講成單一開關——要嘛全自動要嘛全人審。今天練一道 Sierra PM 面試真題：企業客戶要求全面管控 agent 回覆，ML 團隊說限制太多會傷害模型品質，怎麼解？答案框架是自主性階梯（suggest → confirm → execute）搭配依風險分級的granular consent，而不是一刀切的限制。案例是 Gemini Gmail 草稿卡片——AI 可以寫，但『送出』永遠是人類的按鈕。"
series:
  name: "Product Builder 面試日練"
  order: 29
---

> 🌏 [English version](/en/posts/daily/2026-09-17-product-builder-interview-daily-en)

## 今日主題

AI Product Design 這輪最常見的失分模式，是把「AI 要不要自動執行」講成一個全域開關——要嘛完全信任模型自己跑，要嘛每一步都要人審。2026 年的面試題已經不滿足於這種二分法，因為業界已經有大量真實產品（Gemini、ChatGPT、Perplexity）示範了更細緻的做法：依動作的風險與可逆性，決定要不要設關卡、關卡放在哪一步。

這個主題在面試中重要，是因為它同時考驗兩件事——你懂不懂 AI 系統本質上是機率性、會犯錯的（所以不能無腦自動化），以及你會不會把「信任」拆成可以落地的產品機制（分級、可預覽、可否決），而不是停留在「加一個確認按鈕」這種表面答案。

## 核心框架速記

### 自主性階梯（Suggest → Confirm → Execute）

把人機協作當成一個階梯，而不是二選一的開關：

| 階段 | AI 做什麼 | 人類做什麼 | 適用情境 |
|------|----------|----------|---------|
| Suggest（建議） | 只提出選項或草稿，不採取任何行動 | 決定要不要採用 | 高風險、不可逆（發送、付款、刪除） |
| Confirm（確認） | 準備好完整的行動內容並呈現 | 一鍵核准或編輯後核准 | 中風險、可預覽（寄信草稿、排程） |
| Execute（執行） | 直接完成動作 | 事後可撤銷或收到通知 | 低風險、可逆（草稿自動存檔、格式修正） |

**面試時的用法**：不要說「我會加一個 human-in-the-loop 機制」，要說「我會依照動作的風險與可逆性，把不同功能放進階梯的不同段落」，並舉一兩個具體例子說明哪些功能該放哪一段。

### Trust Scaffolding：關卡要能被檢查，不能是裝飾

光有確認按鈕不夠，關卡本身要能讓使用者「看得到要核准的內容」：

1. **可見證據**：核准卡片要顯示完整內容（收件人、金額、要執行的工具），不能是空白的「確定嗎？」對話框
2. **可逆優先**：能設計成可逆的動作（例如先存草稿、事後可撤回），就不要用不可逆的關卡卡住流程
3. **校準過的不確定性**：模型信心低的案例，自動升級成需要人審；信心高、歷史準確率高的案例，可以放寬到 Confirm 甚至 Execute 段

## 今日練習題

### 題目

「你是一家企業對話式 AI agent 公司的產品經理。企業客戶要求對 agent 的每一則回覆都有完整管控權，希望能設定嚴格的用詞與行為限制；但你的 ML 團隊回饋，過度限制會讓模型答非所問、品質下降，containment rate（無需轉人工就解決的比例）也會跟著掉。你要怎麼在下一次產品規劃會議上提出解法？」

（來源：Sierra PM 面試真題，收錄於 knok.work 面試準備指南）

### 拆解思路

1. **釐清問題**：先問——企業客戶說的「全面管控」具體指什麼？是要審核每一則回覆、限制關鍵詞範圍，還是要能設定哪些主題必須轉人工？現有的限制機制是全域套用，還是可以依主題分級？
2. **定義使用者**：至少分三群——企業客戶（在意品牌安全與合規，最怕出現失控回覆）、企業客戶的終端顧客（在意能不能被快速、正確解決問題）、內部 ML 團隊（在意限制會不會讓模型訓練與微調的空間被綁死）。
3. **結構化分析**：用自主性階梯拆解「管控」——不是「限制多 vs 限制少」的一條線，而是依主題風險分級：低風險的常見問答放在 Execute 段（模型自由回覆）、中風險主題放 Confirm 段（模型草擬、事後可稽核）、高風險主題（退款金額、法遵相關）放 Suggest 段（強制轉人工或需要人類核准後才送出）。
4. **提出方案**：給企業客戶的不是一個「限制強度」旋鈕，而是一套按主題分類的權限設定介面，讓他們自己決定哪些主題該卡在哪個階段；同時導入信心分數路由——模型對自己回覆信心低於門檻時，即使主題本身風險不高，也自動升級到需要人審，用這個機制取代「全面收緊」。
5. **定義成功**：追蹤 containment rate 是否維持（不因分級管控而整體下降）、高風險主題的人工覆核比例是否確實提高、企業客戶的品牌安全滿意度調查分數，三者要同時成立，不能犧牲其中一個換另一個。

### 範例回答（面試時可以這樣講）

> **問題釐清與定位**：「我會先確認企業說的『全面管控』是不是等於『每則回覆都要審』——這兩件事不一樣。多數企業真正在意的是高風險主題（退款、法遵、醫療相關）不能出錯，而不是希望連『營業時間是幾點』這種問答都要人工看過。所以我不會把這題當成『限制多還是限制少』的旋鈕問題，而是先把主題按風險分級。」
>
> **結構化分析與方案**：「我會用一個自主性階梯來設計：低風險的常見問答留在模型自由回覆的段落，維持 containment rate；中風險主題讓模型先草擬回覆、系統記錄下來供企業事後稽核；高風險主題直接要求轉人工或需要人類核准才能送出。除了主題分級，我還會加一層信心分數路由——就算主題本身風險不高，只要模型對這次回覆的信心低於門檻，一樣自動升級到需要人審。這樣企業拿到的不是『限制強度』這一個維度的控制權，是一套可以自己調整、按主題分級的權限設定。」
>
> **成功定義**：「我會同時看三個指標：整體 containment rate 有沒有維持住、高風險主題的人工覆核比例有沒有確實提高、企業的品牌安全滿意度有沒有上升。如果 containment rate 掉了，代表分級做得太保守；如果高風險主題的覆核比例沒提高，代表分級沒有真的抓到風險。這三個指標要同時成立，才代表這個方案真的解決了『管控 vs 品質』的張力，不是把問題換了個包裝。」

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 沒有把「管控」簡化成單一的限制強度旋鈕 | |
| 用自主性階梯（suggest/confirm/execute）依風險分級，而不是全域套用 | |
| 提到信心分數路由，讓低信心案例自動升級人審 | |
| 講清楚三方（企業客戶、終端顧客、ML 團隊）的立場差異 | |
| 成功指標同時涵蓋品質（containment rate）與安全（覆核比例、滿意度） | |
| 加分項：舉出具體的已上線產品案例佐證設計思路 | |

## 今日案例

**Gemini：Gmail 草稿卡片，把「送出」永遠留給人類**

Gemini 在 Gmail 裡的寫信助手，示範了一個很乾淨的 human-in-the-loop 設計：AI 可以草擬完整的郵件內容，呈現一張原生的草稿卡片，但「取消」跟「送出」是兩個對等、同樣顯眼的按鈕，旁邊還有「編輯」讓使用者能直接修改內容再送出。整張卡片不是把草稿藏起來只問「確定嗎？」，而是把要核准的完整內容攤開讓人看到，草稿完成後還會再出現一個精簡摘要，把「送出」當作最後、也是唯一由人類按下的關卡。

**面試連結**：這個案例是回答「怎麼設計一個 AI 產品讓使用者敢用又不失控」或「舉一個你觀察到的 human-in-the-loop 設計案例」這類問題的好素材——強答案不是說「Gemini 有確認按鈕」，是講清楚背後的設計邏輯：可逆的草擬動作留給 AI 自由發揮，不可逆的送出動作用「可見完整內容 + 對等按鈕」的關卡卡住，這正是自主性階梯與 Trust Scaffolding 兩個框架的具體落地。

## 延伸閱讀

- [What is Human-in-the-Loop UX? A 2026 Guide with ChatGPT, Gemini & Perplexity Examples](https://aiuxplayground.com/guides/how-to-design-human-in-the-loop/) — 拆解 Gemini、ChatGPT、Perplexity 三家如何在真實產品中實作 approval workflow、granular consent 與 human handoff
- [sierra Product Manager Interview: Questions & Prep (2026)](https://knok.work/blog/sierra-product-manager-interview.html) — Sierra AI agent 公司 PM 面試真題庫與 STAR 範例回答，涵蓋 AI 品質、信任與企業管控張力等題型
- [Agent UX: UI Design for AI Agents in 2026](https://fuselabcreative.com/ui-design-for-ai-agents/) — 說明為什麼「信任」在 2026 年成為 AI 產品體驗設計的核心挑戰，以及漸進式自主權釋放的設計趨勢

## 參考資料

- [sierra Product Manager Interview: Questions & Prep (2026)](https://knok.work/blog/sierra-product-manager-interview.html) — 對應「今日練習題」的原始面試題目與 STAR 範例回答結構
- [What is Human-in-the-Loop UX? A 2026 Guide with ChatGPT, Gemini & Perplexity Examples](https://aiuxplayground.com/guides/how-to-design-human-in-the-loop/) — 對應「核心框架速記」的自主性階梯定義與「今日案例」Gemini 草稿卡片的設計細節
- [Agent UX: UI Design for AI Agents in 2026](https://fuselabcreative.com/ui-design-for-ai-agents/) — 對應「今日主題」中 2026 年 AI 產品信任設計挑戰的產業脈絡
