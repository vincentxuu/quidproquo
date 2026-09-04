---
title: "Product Builder 面試日練 — 2026-09-05：Technical PM"
date: 2026-09-05
category: daily
type: digest
tags: [product-builder-interview, daily, technical-pm]
lang: zh-TW
description: "今日練 Technical PM 面試：用 RFC 流程和 Architecture Decision Record 兩個工程協作框架，拆解 Stripe 真實面試題『設計一個 Ledger Service』，並看 Figma 怎麼在多人協作架構上選擇『類 CRDT 混合模型』而不是抄 Google Docs 的 OT 或硬上純 CRDT。"
tldr: "Technical PM 面試不是要你會設計系統，是要你能跟工程師用同一套語言討論取捨。今天用 RFC 流程（Draft-Review-Decision-Implementation）練『怎麼收斂技術討論的範圍』，用 Architecture Decision Record（Context-Decision-Consequences-Alternatives）練『怎麼把一個技術取捨寫清楚、留下可追溯的紀錄』，練一道 Exponent 收錄的 Stripe 技術輪真實題：設計一個 Ledger Service。"
series:
  name: "Product Builder 面試日練"
  order: 17
---

> 🌏 [English version](/en/posts/daily/2026-09-05-product-builder-interview-daily-en)

## 今日主題

MentorCruise 在 2026 年的一篇分析裡點出一個轉變：PM 面試的「技術輪」已經從「加分項」變成「基本門檻」。IPL 的 2025 Product Management Hiring Trends 報告（涵蓋 Google、Microsoft、Salesforce 等 110 多場面試）把技術素養列為「基本要求」，資料分析能力則是「一般前提」——這跟過去「懂一點技術會加分」的說法完全不同。

但這不代表 PM 要會設計系統或寫程式碼。Best PM Jobs 的技術面試指南講得很清楚：目標不是讓你像工程師一樣畫架構圖，而是證明你能進行「有根據的技術討論」、理解取捨、問出好問題——換句話說，考的是「你能不能跟工程師站在同一個決策桌上」，而不是「你能不能取代工程師」。今天用兩個工程團隊實際在用的協作工具練這個能力。

## 核心框架速記

### RFC 流程：把技術討論收斂成一個決策

RFC（Request for Comments）是工程團隊在做架構或介面變更前，先寫一份文件廣邀評論、再收斂成決策的流程。PM 通常不是 RFC 的作者，但常常是「讓 RFC 討論不失焦」的關鍵角色：

| 階段 | 在做的事 | PM 的角色 |
|------|--------|------|
| **Draft** | 工程師寫出問題、目標、限制與初步方案 | 提供業務目標與限制（時程、預算、法規），避免方案偏離使用者需求 |
| **Review** | 團隊成員留言、提出替代方案、質疑假設 | 幫忙釐清「這個決定影響哪些使用者、哪些場景」，把發散的技術辯論拉回產品目標 |
| **Decision** | 收斂到一個方案，記錄被否決的替代方案與理由 | 確認取捨符合優先序，必要時仲裁「工程理想解」跟「上市時間」的衝突 |
| **Implementation** | 依決策動工，過程中如遇新資訊可能回頭修正 RFC | 追蹤範圍是否悄悄擴大（scope creep），確保交付物對得上原始決策 |

### Architecture Decision Record：把一個技術取捨寫成看得懂的紀錄

ADR 是一份簡短文件，專門記錄「我們為什麼做了這個技術決定」，通常只有四個區塊：

1. **Context（背景）**：當時面對的限制與壓力是什麼（例如：現有系統的延遲已經影響轉換率）。
2. **Decision（決定）**：具體做了什麼選擇（例如：改用非同步佇列處理寫入，而不是同步呼叫）。
3. **Alternatives Considered（考慮過的替代方案）**：列出被放棄的選項與放棄理由，避免半年後有人重新提出同一個已經討論過的方案。
4. **Consequences（後果）**：這個決定帶來的好處與代價，包含未來可能要付出的技術債。

RFC 回答的是「我們該怎麼決定」，ADR 回答的是「我們決定了什麼、為什麼」——面試時如果被問到「說一個你影響過的技術決策」，用 ADR 的四個區塊組織答案，會比隨口敘述更有結構、更讓面試官相信你真的參與過決策，而不是事後轉述工程師的結論。

## 今日練習題

### 題目

設計一個 Ledger Service（帳本服務）。面試官會依團隊不同，追問你如何處理可擴展性（scalability）或 API 設計。

（來源：Exponent《Stripe Product Manager (PM) Interview Guide》收錄的 Stripe 技術輪真實面試題）

### 拆解思路

1. **釐清問題**：先問清楚這個 Ledger 服務給誰用——是 Stripe 內部核算餘額用，還是要開放給外部商家串接的公開 API？交易量級是多少（每秒幾筆、尖峰是平時的幾倍）？這決定後面該優先談一致性還是談吞吐量。
2. **定義使用者**：至少有兩種角色要分開想——直接呼叫 API 的開發者（在意文件清不清楚、錯誤訊息好不好除錯）、以及依賴帳本正確性做對帳的財務／風控團隊（在意資料絕對不能算錯或漏記）。
3. **結構化分析**：Ledger 最核心的取捨是「正確性優先還是延遲優先」。金流帳本通常選擇不可竄改的追加式（append-only）紀錄、每筆交易都用雙分錄記帳法（double-entry）確保借貸平衡，這樣即使系統當機重播事件也能對回正確餘額；但這代價是寫入路徑會比直接改一個餘額欄位慢。
4. **提出方案**：API 設計上要求呼叫方帶入冪等鍵（idempotency key），避免網路重試造成重複入帳——這是所有金流 API 的標準防線。同時把「查詢當前餘額」跟「寫入新交易」拆成不同的讀寫路徑，讓兩者可以分別擴展。
5. **定義成功**：不是看 QPS 多高，是看「帳本永遠可以重新計算出一致的結果」、對帳差異率趨近於零、以及開發者串接失敗率夠低。技術正確性跟開發者體驗要同時達標，這才是 Ledger 服務的成功。

### 範例回答（面試時可以這樣講）

> **先框問題**：在設計之前，我會先確認這個帳本是給內部對帳用，還是要開放給外部商家直接呼叫——因為這決定我要優先設計 API 的易用性，還是優先設計內部的一致性保證。假設這是給商家用的公開 API，我會假設交易量會隨商家成長快速上升，設計時要為擴展留餘地。
>
> **用框架拆解**：帳本系統最重要的原則是「正確性不能妥協」，所以我會選擇追加式（append-only）的紀錄方式，每筆交易都是一條不可修改的記錄，餘額是由這些記錄加總出來的，而不是一個可以被直接覆寫的數字——這樣即使某個環節重試或當機，都能靠重播交易記錄算回正確結果。API 設計上會要求每個寫入請求帶一個冪等鍵，網路超時重試不會造成重複扣款或重複入帳，這是所有金流系統的基本防線。
>
> **講清楚取捨**：這個設計犧牲的是寫入延遲——每筆交易都要先確認雙分錄借貸平衡才能落地，比直接更新一個餘額欄位慢。但我認為這個取捨值得,因為帳本系統一旦算錯,付出的是信任成本和法遵風險,不是使用者體驗上的幾百毫秒。成功的定義是對帳零差異、開發者串接的失敗率夠低,而不是單純追求最高 QPS。

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 先釐清帳本的使用情境（內部對帳／外部 API）與交易量級 | |
| 區分開發者（API 使用者）與財務／風控（資料正確性）兩種利害關係人 | |
| 有講出「正確性 vs 延遲」的核心取捨,並說明為什麼選這一邊 | |
| 提出具體的技術防線（冪等鍵、追加式紀錄、雙分錄） | |
| 成功指標包含正確性（對帳差異率）而不是只看效能（QPS） | |
| 加分項：能解釋這個決定會如何影響未來的維護成本或技術債 | |

## 今日案例

**Figma：多人協作沒有照抄 Google Docs，也沒有硬上純 CRDT**

Figma 工程師 Evan Wallace 在官方工程部落格公開說明,Figma 的多人協作系統並不是單一種現成技術的直接套用。他們沒有沿用 Google Docs 那種以「操作轉換」（Operational Transformation）為核心的做法,也沒有採用學術上標準的純 CRDT（Conflict-free Replicated Data Type，允許多個節點在沒有中央伺服器的情況下各自合併,結果仍然一致）。Figma 的做法是把多個 CRDT 概念組合成一套自訂的資料結構：物件的每個屬性都採用「最後寫入者獲勝」（last-writer-wins）規則,圖層的排序則用介於 0 到 1 之間的浮點數當作位置值,插入新圖層只需要在兩個既有值之間取平均,不需要重新編號整條圖層清單。更關鍵的架構決定是,所有編輯同一個檔案的使用者會被導到同一台伺服器,讓伺服器扮演「順序的仲裁者」——真正意義上的分散式 CRDT 合併邏輯,只在伺服器當機需要復原時才會用到,平常運作時反而完全不需要處理跨節點合併的複雜度。

**面試連結**：這個案例是「build vs buy」跟「為什麼不用現成方案」這類問題的絕佳素材——Figma 明確評估過 OT 跟純 CRDT 兩種現成選項,最後選擇為自己的產品需求（大量圖層、頻繁的位置調整、需要低延遲的視覺回饋）打造混合架構。回答時可以套用今天的 ADR 框架：Context 是視覺設計工具的協作需求跟文字編輯器不同,Decision 是自訂的類 CRDT 混合模型,Alternatives Considered 是 OT 與純 CRDT,Consequences 是換來更適合圖層操作的效能,但要自行維護一套非標準的資料結構。

## 延伸閱讀

- [MentorCruise：The PM Interview Has Become a Technical One](https://mentorcruise.com/blog/the-pm-interview-has-become-a-technical-one-eaba2) — 分析 PM 面試技術門檻上升的趨勢,引用 IPL 2025 Hiring Trends 報告與多家公司的實際面試變化。
- [Best PM Jobs：Technical Interview for Product Managers 2026](https://www.bestpmjobs.com/resources/technical-interview-pm) — 完整說明 PM 該懂到什麼程度的 SQL、API、系統設計基礎,附大量具體例子。
- [Figma Blog：How Figma's multiplayer technology works](https://www.figma.com/blog/how-figmas-multiplayer-technology-works) — 今日案例的原始出處,Evan Wallace 詳細拆解 Figma 多人協作的資料結構設計。

## 參考資料

- [Exponent：Stripe Product Manager (PM) Interview Guide](https://www.tryexponent.com/guides/stripe-product-manager-interview) — 對應「今日練習題」的題目出處。
- [MentorCruise：The PM Interview Has Become a Technical One](https://mentorcruise.com/blog/the-pm-interview-has-become-a-technical-one-eaba2) — 對應「今日主題」的趨勢背景。
- [Figma Blog：How Figma's multiplayer technology works](https://www.figma.com/blog/how-figmas-multiplayer-technology-works) — 對應「今日案例」的技術細節。
