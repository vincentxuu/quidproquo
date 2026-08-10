---
title: "引用之前：把 19 份一手來源查了一遍"
date: 2026-08-10
category: ai
type: deep-dive
tags: [ai-agent, research, llm, multi-agent, evaluation]
lang: zh-TW
series:
  name: "Agent 生產線"
  order: 6
tldr: "查了 19 份一手來源、約 40 項宣稱，命中率約七成。但失誤的形狀非常一致：但書會掉、機制被壓成結論、自行補上因果、故事停在對論點有利的地方。附五個不要引用的數字。"
description: "對 agent 技術寫作中常見數字的一手來源查證：15× token、Klarna 230 萬次對話、Google 75%、Chroma 95%→60%、METR 19% 的實際情況，以及技術轉述失真的四種固定形狀。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-10-verifying-agent-numbers-en)

前面五篇引用了大量數字。這一篇說明那些數字是怎麼被檢查的——以及有哪幾個沒通過。

做法很單純：把導讀文章引用的外部來源逐一打開原文，比對措辭。十九份一手來源、約四十項可查證的宣稱。命中率約七成明確正確，聽起來不差，但**失誤的形狀比命中率更值得注意**，因為它是可預測的。

## 五個不要引用的數字：Anthropic、Klarna、Google、Chroma、METR

| 宣稱 | 查證結果 |
|---|---|
| 多 agent 用掉「單 agent 的 15 倍 token」 | ❌ [Anthropic 原文](https://www.anthropic.com/engineering/multi-agent-research-system)是「agents 約 4× **一般聊天**，multi-agent 約 15× **一般聊天**」。相對單 agent 是 15 ÷ 4 ≈ **3.75 倍**，被誇大了約四倍。而且這句話正好出現在論證「多 agent 昂貴要謹慎」的段落裡——誤述的方向剛好強化了作者自己的論點 |
| Klarna 的 AI 客服首月處理 230 萬次對話 | ⚠️ 數字正確（2024-02 官方新聞稿），但 **2025-05 Klarna CEO 已公開反轉**，開始重新招聘人類客服：「成本似乎在規劃時被當成過於主導的評估因素，結果你得到的就是比較低的品質。」2026 年的文章仍把它當成功案例，且完全沒提反轉 |
| 「AI 產生 Google 超過 75% 的新程式碼」 | 🔴 **查不到出處。** 公開可查的官方數字是 2024-10 的「超過 25%」與 2025-04 的「超過 30%」。75% 比已知最高的公開數字高出一倍以上 |
| Chroma：「有些模型維持 95% 準確率，越過某個長度後直墜 60%」 | 🔴 全文六萬多字元裡「95%」與「60%」**都不存在**。該研究的結果是以圖表呈現的，正文沒有這組數字，最可能是從圖上目測後寫成文字 |
| 「METR/Anthropic 的 RCT 顯示資深開發者慢 19%」 | ⚠️ 19% 正確，但兩處錯：[METR](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study) 是**獨立非營利研究機構，不是與 Anthropic 合著**（Anthropic 只是受試工具之一）；而且原文明列多個競爭假說並明說不確定原因，「元凶是缺乏驗證的過度依賴」是轉述者自己加的 |

Klarna 那一條是最值得停下來看的。它跟其他四條性質不同——數字沒錯，來源也對，錯的是**故事停在哪裡**。230 萬次對話是 2024 年 2 月的月報數字；一篇 2026 年的文章用它論證架構選擇有效，卻略過當事人自己在 2025 年 5 月說「品質變差、我們砍太多了」。讀者會得到相反的印象，而且完全查不出問題，因為每個字都是真的。

順帶一提，那個段落還引用了兩個**失敗**案例。三個案例裡兩敗一成，而唯一被略過後續的就是那個「成功」的。

## 四種固定的失真形狀

這四種不是這一個來源獨有的，是技術轉述的通病：

**一、但書會掉。** 「這是內部評測」「95% CI 是 [-40%, -2%]」「這是 early-2025 的快照」「single agent ≈ 4× chats」——這些全部消失了。少了對照錨點的數字最容易被誤讀，而 15× 就是真的被誤讀了。

**二、機制被壓成結論。** Anthropic 原文寫「三個因素解釋了 BrowseComp 上 95% 的表現變異，其中光是 token 用量就解釋 80%」。轉述變成「改善與 token 用量高度相關」。差別很大：原句告訴你**多 agent 為什麼有效**（本質是花更多 token，不是協作本身有魔法），壓縮後的版本只給你一個結論，卻拿不到判斷它適不適用於自己情境的依據。

**三、會自行補上因果。** METR 明說不知道原因，轉述變成「元凶是缺乏驗證的過度依賴」。這不是轉述，是加料。

**四、故事停在對論點有利的地方。** Klarna。

## 兩次平反

查證不是只會抓錯。有兩項我原本列為疑點，查完發現冤枉了：

- **Pinterest 的「As of January 2025」出現在 2026 年的文章裡**——看起來像日期抄錯。但那句話在 **Pinterest 自己的 Medium 原文裡就是這樣寫的**，逐字轉述無誤，連「這是擁有者自評估計值」的但書都保留了。日期可疑是 Pinterest 的問題
- **Codex 的狀態管理前後反轉**——2026-03 的文章說 OpenAI 刻意不用 server-side 狀態參數，2026-07 的文章說它開了持久 WebSocket 並送 `previous_response_id`。查了 OpenAI 官方文件，2026-03 那篇是**逐句忠實**的：官方原文就寫「Codex 今天並沒有用 `previous_response_id`，主要是為了保持完全無狀態並支援 Zero Data Retention」。而且這個限制在 API 層是強制的——開了 ZDR 再傳那個參數會直接回錯。**兩篇各自對應寫作當下的產品狀態，都沒錯**

第二項留下一條有用的通則：**看任何 agent 架構描述，都要連發表日一起看。** 四個月就足以讓一段架構描述失效，而失效不等於作者出錯。

## 引用鏈往上游走通常更值錢

查證過程有個意外收穫：**三次順著引用鏈往上游走，都找到比轉述本身更好的東西。**

1. Anthropic 的「token 用量單獨解釋 80% 變異」——比「多 agent 效果高 90.2%」有用得多
2. [Cognition](https://cognition.com/blog/dont-build-multi-agents) 在 2026-04 對自己 2025-06 立場的修正：「多 agent 系統今天最有效的用法是——**寫入保持單線程，額外的 agent 貢獻的是智能而不是動作**」。引用它的文章比這份更新晚了三個月，卻只引用原始立場
3. UC Berkeley 的 [MAST 論文](https://arxiv.org/abs/2503.13657)——1,642 份標註過的執行軌跡、七個開源多 agent 框架、14 種失敗模式、標註者一致性 κ = 0.88，回報失敗率介於 **41% 到 86.7%**。這是我在整批材料裡撞到最紮實的一份多 agent 數據，**而它從未被引用過**

## 三條方法論教訓

最後三條是查證過程本身教我的，跟 agent 無關但通用：

**抽取工具會靜默截斷。** 第一次抓 Anthropic 那篇只拿回兩萬字元，三個關鍵數字全部搜不到，我差點下結論說「原文根本沒有這些數字」。換工具重抓才發現是抽取殘缺，原文全都有。**任何「原文沒有 X」的結論，都必須先證明抽取是完整的。**

**錯誤不是均勻分布的。** 我曾用「同一篇的其他數字錯過」推斷剩下的也不可信、不值得查。被要求查完之後，六項裡四項完全正確。這種歸納不成立。

**清單能窮舉的時候不要用抽樣。** 我曾以「模式已經重複」為由停止閱讀剩下的文章。讀完發現大部分都有新東西，還推翻了三處既有記載。**當清單已經列好、每一項的成本只是打開一次，抽樣推斷就沒有正當理由——想省成本就直接說想省成本，不要包裝成品質判斷。**

## 所以這類材料怎麼用

拿它當**索引**，不要拿它當**引用來源**。

它的價值在於幫你找到該讀哪篇一手材料，以及提供一個能掛東西的心智架構——這也是這個系列前五篇在做的事。但一旦要引用具體數字，回原文的成本遠低於引用錯誤的代價。

## 本系列

1. [概念界線：agent、workflow、RAG、MCP 到底差在哪](/posts/ai/2026-08-10-agent-workflow-rag-mcp-boundaries)
2. [模型只是元件，harness 才是系統](/posts/ai/2026-08-10-model-component-harness-system)
3. [context 與記憶：agent 失敗的真正位置](/posts/ai/2026-08-10-agent-context-memory-failure)
4. [上線才是工作的開始：企業案例橫向讀](/posts/ai/2026-08-10-enterprise-agent-case-studies)
5. [安全：prompt injection 只能在 harness 層做損害控制](/posts/ai/2026-08-10-agent-security-harness-layer)
6. **引用之前：把 19 份一手來源查一遍**（本篇）
7. [協定層：MCP、A2A、ACP、Skills 各解什麼問題](/posts/ai/2026-08-10-mcp-a2a-skills-protocol-layer)
8. [RAG 的三種形態與 evaluator paradox](/posts/ai/2026-08-10-rag-graph-agentic-variants)

## 參考資料

- [Anthropic — How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system)
- [Anthropic — Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents)
- [Chroma Research — Context Rot](https://research.trychroma.com/context-rot)
- [METR — Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study)
- [Why Do Multi-Agent LLM Systems Fail?（arXiv:2503.13657，UC Berkeley，NeurIPS 2025）](https://arxiv.org/abs/2503.13657)
- [Cognition — Don't Build Multi-Agents](https://cognition.com/blog/dont-build-multi-agents)
- [Pinterest Engineering — Building an MCP Ecosystem at Pinterest](https://medium.com/pinterest-engineering/building-an-mcp-ecosystem-at-pinterest-d881eb4c16f1)
- [ByteByteGo — Best Practices for Building AI Agents That Work in Production](https://blog.bytebytego.com/p/best-practices-for-building-ai-agents)
- [ByteByteGo — A Practical Guide to Becoming an AI-Native Engineer](https://blog.bytebytego.com/p/a-practical-guide-to-becoming-an)
