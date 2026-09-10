---
title: "區域焦點｜印度／南亞"
date: 2026-09-11
category: daily
tags: [ai-agent, region, daily, india-south-asia]
lang: zh-TW
type: deep-dive
description: "NPCI 為 UPI 打造 Unified Agent Protocol，讓 AI 代理直接刷卡付款；Gnani AI 把主權 AI 棧 Artha 推進 BFSI；印度用「國家級支付軌道」而非模型競賽定義 Agent 落地"
tldr: "印度國家支付公司 NPCI 正在打造 Unified Agent Protocol，計劃讓 AI 代理在 UPI 上代替使用者付款，可能在 9 月 8-11 日孟買 Global Fintech Fest 亮相；Bengaluru 新創 Gnani AI 在同場活動宣布主權 AI 棧 Gnani Artha 擴展到銀行、保險、金融（BFSI）企業；同期 Visa、Mastercard 與 Ant International 也在推動一套跨業者的 AI 代理身分驗證框架 KYA，顯示「誰能驗證 AI 代理的身分」正成為全球支付業的新戰場。"
series:
  name: "AI Region Focus"
  order: 6
---

## 區域：印度／南亞

本週印度 AI Agent 生態最重要的動態，不是哪家新創發了新模型，而是「國家級支付基礎設施」開始正面迎接 AI 代理。印度擁有全球最大的即時支付系統 UPI，這次它要決定的是：一個沒有手機、沒有指紋的 AI 代理，要怎麼被信任去花使用者的錢。

## 本週重要動態

### NPCI 打造 Unified Agent Protocol，讓 AI 代理直接用 UPI 付款

印度國家支付公司（NPCI，負責營運 UPI）正在打造 Unified Agent Protocol，目標是讓 AI 代理可以代表使用者在 UPI 上發起付款。Reuters 於 9 月 3 日引述三位知情人士報導此事，市場預期協議可能在 9 月 8 日至 11 日於孟買舉行的 Global Fintech Fest 上亮相。（[startupfeed.in](https://startupfeed.in/npci-unified-agent-protocol-ai-payments-upi) · [Forkast](https://forkast.news/india-eyes-ai-driven-upi-payments-as-npci-weighs-agent-protocol/)）

核心設計思路是加一層「代理註冊、驗證、授權」機制：今天 UPI 信任的是「一個人加上他的手機」，AI 代理兩者都不是，所以需要一個新的信任層。根據報導，NPCI 這層機制只驗證請求是否為使用者本人授權的真實請求，並不會看到代理實際購買的內容——這是刻意做的隱私邊界設計。NPCI 今年 2 月已與 NVIDIA 合作打造「支付原生的 AI 底座」，Pine Labs、Cashfree 等金融科技公司也已經在做代理支付工具，顯示這不是憑空冒出的計畫，而是印度支付生態系醞釀半年以上的方向。（[startupfeed.in](https://startupfeed.in/npci-unified-agent-protocol-ai-payments-upi)）

⚠️ 目前協議細節仍未正式公佈，NPCI 對此不予置評，本篇引用的規格描述來自 Reuters 消息來源轉述，待正式發表後需要再次核實。

### Gnani AI 把主權 AI 棧 Artha 推進 BFSI 企業

同樣在孟買 Global Fintech Fest，Bengaluru 新創 Gnani AI 宣布將其主權 AI 棧 Gnani Artha 擴展到銀行、保險與金融服務（BFSI）企業，協助這些機構建置並部署 AI 驅動的工作流程。Artha 建立在 Gnani 自家的 Evon v3.3 模型之上，主打「模型與資料都留在印度境內」的資料主權訴求，並支援 11 種以上印度本地語言的統一推理與工具呼叫，鎖定銀行、保險、醫療、電信等場景。（[Inc42](https://inc42.com/buzz/gff-2026-fintech-ai-partnerships-take-the-centre-stage-on-day-2/) · [Gnani.ai 官方](https://www.gnani.ai/artha-sovereign-ai)）

Gnani 本身是印度較老牌的語音 AI 公司，過去專注在 BFSI 場景的大量電話客服流量——這次把「主權 AI 棧」和「垂直產業擴展」綁在一起推出，本質上是在搶「NPCI 代理支付基礎設施」開放後，企業端需要的合規部署層生意。

### 全球支付業搶著定義「AI 代理身分」：KYA 框架浮現

9 月 10 日，Ant International、Mastercard 與 Visa 聯合宣布共同開發 Know-Your-Agent（KYA）互通框架，目標是建立業界共通標準來識別、驗證能代表使用者購物的 AI 代理。三方強調框架會基於共享原則設計，但各自網路仍保有自己的驗證與決策流程。（[Asian Banking & Finance](https://asianbankingandfinance.net/cards-payments/news/ant-mastercard-visa-build-common-ai-agent-identity-framework)）

這則消息和印度 NPCI 的計畫幾乎同時出現，但邏輯完全不同：NPCI 是「國家支付軌道由上而下強制一套代理協議」，KYA 是「跨國私營支付網路由下而上協調一套互通標準」。兩條路徑會不會互相相容，還是各走各的，是接下來幾個月值得追蹤的分岔點。

## 深度分析

我認為這週最值得注意的信號，是用五力分析框架看「誰在替 AI 代理的支付權定義規則」。

供應端角度：NPCI 直接掌控 UPI 這個印度最大的支付軌道，等於掌握了「代理支付」這個新市場的准入閘門——任何想在印度做代理商務的公司，最終都要通過 NPCI 的協議認證。這和美國、歐洲的情況完全不同：那邊沒有一個國家級支付公司可以單方面定義「AI 代理如何花錢」的規則，所以才需要 Visa/Mastercard/Ant 這種跨業者聯盟自己湊一套 KYA 框架。印度的「集中式國家基礎設施」路徑天生比「分散式業者聯盟」路徑快——不需要協調多方利益，一個機構拍板就能落地。

替代品威脅角度：Gnani Artha 這類「主權 AI 棧」新創,其實是在賭一個假設——印度企業（尤其金融業）會因為資料主權和監理要求，優先選擇本地建置的 AI 而非直接串接 OpenAI／Anthropic 的 API。如果 NPCI 的代理支付協議正式上線且要求資料留在境內處理，Gnani 這類公司會直接受惠，因為它們等於已經站在「合規預設選項」的位置上。

進入壁壘角度：一旦 NPCI 協議定案，任何想做印度代理商務的外國公司，都必須遵守印度的代理註冊與驗證規則——這本質上是把「監理合規」變成一道天然的本地廠商保護牆。

## 對台灣創業者的啟示

- 如果你在做跨境支付或電商 Agent：印度即將出現的是「國家強制的代理支付協議」，不是自由串接 API 就能做生意的市場。想切入印度市場的台灣團隊，現在就該開始追蹤 NPCI 協議的正式規格，而不是等它上線才反應——晚一步可能就要重做整套授權流程
- 如果你在做 AI 基礎設施或身分驗證：KYA 框架代表的「跨業者 AI 代理身分標準」是一個台灣中介服務可以卡位的縫隙——幫中小型商家或平台做「代理身分驗證即服務」，讓他們不用自己啃 Visa/Mastercard/Ant 三方各自的規格
- 如果你在做企業 AI 部署：Gnani Artha 的打法（主權 AI 棧 + 垂直產業客製）值得台灣 B2B AI 新創借鏡——台灣同樣有金融業資料在地化的監理壓力（金管會對雲端服務的規範），與其硬碰硬打模型能力戰，不如像 Gnani 一樣打「合規預設值」這張牌

## 今日收穫

之前以為印度 AI Agent 生態的重點會跟其他新興市場一樣，是「哪家新創模型能力最強」的競賽。這週看完 NPCI 的 Unified Agent Protocol 之後才意識到，印度走的是完全不同的路——它不靠模型能力決勝負，而是直接用「誰能碰 UPI 這條國家支付軌道」當作准入門檻。這解釋了為什麼印度的 AI 代理生意，最終會由支付基礎設施而不是模型排行榜決定誰贏。

## 參考資料

- [startupfeed.in — NPCI Builds Unified Agent Protocol for AI Payments on UPI](https://startupfeed.in/npci-unified-agent-protocol-ai-payments-upi)
- [Forkast — India Eyes AI-Driven UPI Payments as NPCI Weighs Agent Protocol](https://forkast.news/india-eyes-ai-driven-upi-payments-as-npci-weighs-agent-protocol/)
- [Inc42 — GFF 2026: Fintech-AI Partnerships Take The Centre Stage On Day 2](https://inc42.com/buzz/gff-2026-fintech-ai-partnerships-take-the-centre-stage-on-day-2/)
- [Gnani.ai — Gnani Artha Sovereign AI Stack for India](https://www.gnani.ai/artha-sovereign-ai)
- [Asian Banking & Finance — Ant, Mastercard, Visa build common AI agent identity framework](https://asianbankingandfinance.net/cards-payments/news/ant-mastercard-visa-build-common-ai-agent-identity-framework)
