---
title: "Prompt Engineering 實戰：迭代方法論、常見錯誤與 Few-shot 最佳化"
date: 2026-03-13
category: ai
tags: [prompt-engineering, few-shot, chain-of-thought, iteration, llm]
lang: zh-TW
tldr: "好的 Prompt 不是一次寫出來的，而是迭代出來的。從最簡單的 prompt 開始，用真實 case 測試，分類錯誤類型，針對性修改。本文涵蓋 System Prompt 三段式結構、推理框架選擇、Few-shot 最佳化、Token 預算管理和六個常見錯誤。"
description: "Prompt Engineering 的系統化迭代方法：System Prompt 三段式結構（Role/Guidelines/Format）、CoT/Few-shot/ReAct 推理框架選擇、Few-shot 範例最佳化策略、Token 預算管理、六步迭代法，以及常見錯誤與修復。"
draft: false
---

大部分人寫 prompt 的方式是：想一段指令 → 丟給模型 → 結果不對 → 再改一次措辭 → 反覆猜測。

這不是工程，這是碰運氣。

Prompt engineering 的核心不是「怎麼寫出完美的一句話」，而是**怎麼建立一個可預測、可迭代、可維護的 prompt 系統**。這篇文章把實戰中最重要的幾件事整理成可操作的方法論。

---

## 一、System Prompt 三段式結構

一個結構清晰的 system prompt 應該包含三個區塊：**Role（角色）**、**Guidelines（準則）**、**Format（格式）**。

```
┌─────────────────────────────────────┐
│           System Prompt             │
│                                     │
│  ┌───────────────────────────────┐  │
│  │  Role                         │  │
│  │  你是誰、擅長什麼、語氣風格    │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │  Guidelines                   │  │
│  │  行為準則、邊界、決策規則      │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │  Format                       │  │
│  │  輸出結構、範例、約束          │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

### 1. Role — 具體 > 抽象

Role 的核心原則：**越具體越好**。模型對角色的理解直接影響它生成內容的品質和一致性。

**不好的寫法：**

```
你是一個 AI 助手。
```

這等於什麼都沒說。「AI 助手」是全世界最模糊的角色描述——模型不知道該用什麼專業度、什麼語氣、什麼深度來回答。

**好的寫法：**

```
你是一位有 10 年經驗的 PostgreSQL DBA，專精效能調校和查詢最佳化。
你習慣用具體的數據和 EXPLAIN ANALYZE 輸出來解釋問題，
而不是泛泛而談。當用戶的問題涉及架構決策時，你會先問清楚
資料量級和讀寫比例再給建議。
```

差異在哪？第二個版本暗示了：

- **專業領域**：PostgreSQL，不是 MySQL、不是 MongoDB
- **工作方式**：用數據說話，不是空談理論
- **互動模式**：會追問，不會直接給答案
- **經驗水平**：資深，所以回答有深度

**更多對比：**

| 不好 | 好 |
|------|------|
| 你是客服人員 | 你是 SaaS 產品的 Tier-2 技術支援工程師，處理計費和 API 整合問題 |
| 你是寫作助手 | 你是科技媒體編輯，風格參考 Ben Thompson 的 Stratechery，偏分析而非新聞報導 |
| 你是程式專家 | 你是 Rust 資深工程師，偏好零成本抽象，會主動指出記憶體安全問題 |

### 2. Guidelines — 正面 > 負面，用清單

Guidelines 定義模型的行為邊界。兩個原則：

**原則一：告訴模型「要做什麼」，而不是「不要做什麼」。**

人腦和 LLM 都一樣——否定指令的效果遠不如正面指令。

**不好的寫法：**

```
不要使用太專業的術語。
不要回答超出範圍的問題。
不要編造不確定的資訊。
```

**好的寫法：**

```
- 用國中生能理解的語言解釋技術概念
- 當問題超出 PostgreSQL 範圍時，說明這不在你的專業範圍內，並建議用戶諮詢相關專家
- 對不確定的資訊，明確標註「我不確定，建議查閱官方文件」
```

第一種寫法告訴模型三件「不能做的事」，但模型不知道該做什麼。第二種寫法每一條都給出了**具體的替代行為**。

**原則二：用條列式清單，不要寫長段落。**

```
# 不好：一大段文字
你在回答問題時應該注意使用繁體中文，並且保持專業但友善的語氣，
如果用戶問的問題你不確定答案就要說明你不確定，另外每次回答
都要先確認你理解了用戶的問題再開始回答...

# 好：清單
## 準則
- 使用繁體中文回答
- 語氣：專業但友善
- 不確定時明確標註
- 回答前先用一句話確認你對問題的理解
- 每個建議附上理由
```

LLM 對結構化格式的遵循度明顯高於自由文本。清單還有一個好處：你可以逐條新增、刪除、調整，不用重寫整段。

### 3. Format — 結構 + 範例

Format 區塊定義輸出的結構。如果你不定義格式，模型會自己決定，而且每次可能不一樣。

**不好的寫法：**

```
用 JSON 格式回答。
```

**好的寫法：**

```
用以下 JSON 格式回答，不要包含任何其他文字：

{
  "diagnosis": "一句話描述問題根因",
  "severity": "low | medium | high | critical",
  "suggestion": "具體的修復步驟",
  "sql_example": "修復後的 SQL 範例（如適用，否則填 null）"
}
```

給出完整的 schema 和每個欄位的說明，模型的輸出一致性會大幅提升。如果你的下游系統需要 parse 這個 JSON，格式不一致會直接 break pipeline。

**進階技巧：用 XML tag 分隔區塊**

```
請按照以下結構輸出：

<analysis>
問題分析，2-3 句話
</analysis>

<recommendation>
建議的行動方案，用編號列表
</recommendation>

<code>
相關的程式碼範例
</code>
```

XML tag 的好處是語義明確——模型（和你的程式）都能清楚區分不同區塊。Anthropic 官方文件也推薦在 Claude 中使用 XML tag 來組織 prompt。

---

## 二、Context 格式化原則

System prompt 定義了模型的行為，但 context（上下文）才是模型做決策的依據。Context 的品質直接決定回答品質。

### 語義清晰 > 原始拼接

**不好的做法：直接把一堆文字拼在一起**

```
以下是相關資料：
PostgreSQL 的 VACUUM 機制用於回收被刪除或更新的行所佔用的空間。
在高寫入場景下，autovacuum 的預設設定通常不夠用。建議調整
autovacuum_vacuum_cost_delay 和 autovacuum_vacuum_cost_limit。
另外，pg_stat_user_tables 的 n_dead_tup 欄位可以監控死行數量。
根據 2024 年的一篇 Percona 文章，大型表建議設定
autovacuum_vacuum_scale_factor 為 0.01 而非預設的 0.2。
```

模型收到這段文字，不知道：這些資訊從哪來？哪些比較可靠？有多新？

**好的做法：標記來源和相關性**

```
<context>
  <source name="PostgreSQL 16 官方文件" relevance="high" date="2024-09">
    VACUUM 回收被刪除/更新的行佔用的空間。
    autovacuum 相關參數：
    - autovacuum_vacuum_cost_delay（預設 2ms）
    - autovacuum_vacuum_cost_limit（預設 200）
    - autovacuum_vacuum_scale_factor（預設 0.2）
  </source>

  <source name="Percona Blog" relevance="medium" date="2024-03">
    大型表（>10GB）建議將 autovacuum_vacuum_scale_factor
    設為 0.01，避免死行累積過多才觸發 vacuum。
  </source>

  <source name="pg_stat_user_tables" relevance="high" type="live_data">
    目標表 orders 的 n_dead_tup：1,284,567
    last_autovacuum：2024-09-12 03:22:15
  </source>
</context>
```

每個資料來源都標記了名稱、可靠度、時間。模型可以：
- 優先參考 `relevance="high"` 的來源
- 知道 live data 是即時的，blog 文章可能過時
- 在回答中引用具體來源

### Token 預算：保留 30% 給生成

一個常見錯誤是把 context window 塞滿，然後抱怨模型的回答太短或品質下降。

```
Context Window 配置原則：

┌─────────────────────────────────────┐
│  System Prompt      ~5-10%          │
│  Context/RAG        ~50-60%         │
│  對話歷史           ~5-10%          │
│  ────────────────────────────       │
│  預留給生成          ~30%            │
└─────────────────────────────────────┘
```

如果你的 context window 是 128K tokens，你最多用 ~90K 來放 context，剩下 ~38K 給模型生成。如果你塞了 120K 的 context，模型只有 8K 的空間回答——它要嘛截斷，要嘛品質大幅下降。

### Primacy Effect：最重要的放最前面

LLM 對 context 中不同位置的資訊，注意力分佈不均勻。研究顯示 LLM 有明顯的 **primacy bias**——對開頭的資訊記得最清楚。（也有 recency effect，但不如 primacy 穩定。）

**實務建議：**

1. 最重要的 context 放最前面
2. 最新的對話放最後面（利用 recency effect）
3. 中間放相對不那麼關鍵的資料

```
排序策略：

[最重要的文件]     ← 模型最容易注意到
[次重要的文件]
[背景資料]
[歷史脈絡]
...
[最新的用戶訊息]   ← 模型也容易注意到
```

這就是所謂的 **Lost in the Middle** 問題——中間的資訊最容易被忽略。如果你的 RAG pipeline 把最相關的結果放在中間，效果會比放在開頭差很多。

---

## 三、信心機制：教 LLM 說「我不知道」

LLM 最危險的行為之一是**自信地胡說八道**。它不會說「我不知道」——除非你明確教它這樣做。

### 為什麼 LLM 會幻覺？

LLM 是一個 next-token predictor。它的目標是生成「最可能的下一個 token」，而不是「最正確的下一個 token」。當它不知道答案時，它仍然會生成看起來很合理的文字——因為那是統計上最可能的 continuation。

### 信心機制 Prompt 模板

```
## 回答準則

在回答每個問題時，先內部評估你的信心程度：

1. **高信心**：你確定答案正確，且能引用具體來源或原理
   → 直接回答

2. **中信心**：你大致知道方向，但細節可能不精確
   → 回答時加上「根據我的理解，[答案]。建議查閱 [具體來源] 確認細節。」

3. **低信心**：你不確定，或這超出你的訓練資料範圍
   → 回答「我不確定這個問題的答案。以下是我知道的相關資訊：[相關但確定的資訊]。建議查閱 [建議的資源]。」

4. **零信心**：你完全不知道
   → 回答「我不知道這個問題的答案，無法提供可靠的資訊。建議諮詢 [領域專家/官方文件]。」

絕對不要編造具體的數字、日期、版本號或 API 名稱。
如果你不記得確切的值，說「具體的值我不確定」。
```

### 進階：結構化信心輸出

如果你的系統需要程式化處理信心程度，可以要求模型輸出結構化的信心標記：

```
每次回答時，在最後附上：

<confidence>
  <level>high | medium | low | none</level>
  <reasoning>為什麼你給出這個信心程度</reasoning>
  <sources>你參考的資料來源（如有）</sources>
</confidence>
```

這讓你的下游系統可以根據信心程度決定是否需要人工審核、是否要加上 disclaimer、或是否要觸發額外的 RAG 檢索。

### 實際效果

沒有信心機制時：

```
用戶：PostgreSQL 17 的新 VACUUM 改進有哪些？
模型：PostgreSQL 17 引入了增量 VACUUM、平行索引清理、
     以及新的 vacuum_buffer_usage_limit 參數...
     （可能包含編造的功能）
```

有信心機制時：

```
用戶：PostgreSQL 17 的新 VACUUM 改進有哪些？
模型：我對 PostgreSQL 17 的具體 VACUUM 改進不太確定，
     因為我的訓練資料可能不包含最新的 release notes。

     我確定知道的是：PostgreSQL 16 引入了一些 VACUUM
     的效能改進。建議查閱 PostgreSQL 17 Release Notes
     （postgresql.org/docs/17/release-17.html）
     獲取最新資訊。
```

第二個回答更長，但**不會害到用戶**。

---

## 四、推理框架選擇指南

不同的任務需要不同的推理方式。以下是三個主要框架和它們的適用場景。

### Chain-of-Thought (CoT)

**核心概念：** 讓模型「先想再答」。把推理過程展開，而不是直接跳到結論。

**適用場景：**
- 數學計算和邏輯推理
- 需要多步驟分析的問題
- 複雜的條件判斷

**模板：**

```
請逐步思考：

1. 先理解問題：問題在問什麼？
2. 分解子問題：這個問題可以拆成哪幾個步驟？
3. 逐步推理：每一步的推理過程是什麼？
4. 驗證：回頭檢查推理中有沒有漏洞
5. 給出最終答案
```

**範例 — 沒有 CoT：**

```
問：一個 API 每秒處理 500 個請求，每個請求平均耗時 200ms。
   至少需要多少個 worker thread？

答：100 個。
```

**有 CoT：**

```
問：（同上）

答：讓我逐步計算：

1. 每個請求耗時 200ms = 0.2 秒
2. 一個 worker 在 1 秒內能處理 1/0.2 = 5 個請求
3. 需要處理 500 個請求/秒
4. 所需 worker 數 = 500 / 5 = 100 個
5. 考慮到實際場景中 worker 不會 100% 利用，建議配置 120-150 個

至少需要 100 個 worker thread，建議配置 120-150 個以應對流量波動。
```

### Few-shot Learning

**核心概念：** 用範例教模型「我要什麼樣的輸出」。

**適用場景：**
- 格式化輸出（分類、提取、轉換）
- 風格模仿
- 邊界 case 定義

**模板：**

```
你是一個客服工單分類器。根據用戶描述，分類為以下類別之一：
billing, technical, feature_request, bug_report

## 範例

輸入：「我的信用卡被扣了兩次」
輸出：{"category": "billing", "urgency": "high", "reason": "重複扣款"}

輸入：「API 回傳 500 錯誤」
輸出：{"category": "bug_report", "urgency": "high", "reason": "伺服器錯誤"}

輸入：「希望能支援深色模式」
輸出：{"category": "feature_request", "urgency": "low", "reason": "UI 功能請求"}

輸入：「怎麼設定 webhook？」
輸出：{"category": "technical", "urgency": "medium", "reason": "功能使用諮詢"}

## 現在分類以下輸入：
```

### ReAct (Reasoning + Acting)

**核心概念：** 模型交替進行「思考」和「行動」，每一步都先推理再執行。

**適用場景：**
- 需要使用工具（搜尋、API 呼叫、資料庫查詢）的任務
- 多步驟的資訊檢索
- 需要根據中間結果調整策略的任務

**模板：**

```
你可以使用以下工具：
- search(query): 搜尋知識庫
- sql(query): 執行 SQL 查詢
- calculate(expression): 數學計算

每一步請按以下格式：

Thought: 我需要做什麼？為什麼？
Action: 工具名稱(參數)
Observation: 工具回傳的結果
... （重複直到有足夠資訊）
Answer: 最終回答
```

**範例：**

```
問題：上個月花費最高的前 3 個客戶各花了多少錢？

Thought: 我需要查詢上個月的訂單資料，按客戶分組並排序
Action: sql(SELECT customer_id, SUM(amount) as total
         FROM orders
         WHERE created_at >= '2024-08-01'
         AND created_at < '2024-09-01'
         GROUP BY customer_id
         ORDER BY total DESC LIMIT 3)
Observation:
| customer_id | total    |
|-------------|----------|
| C-1042      | $45,230  |
| C-0891      | $38,100  |
| C-1205      | $29,870  |

Thought: 我有了金額資料，但客戶 ID 不夠直觀，讓我查客戶名稱
Action: sql(SELECT id, name FROM customers
         WHERE id IN ('C-1042', 'C-0891', 'C-1205'))
Observation:
| id     | name           |
|--------|----------------|
| C-1042 | Acme Corp      |
| C-0891 | TechStart Inc  |
| C-1205 | Global Systems |

Answer: 上個月花費最高的前 3 個客戶：
1. Acme Corp — $45,230
2. TechStart Inc — $38,100
3. Global Systems — $29,870
```

### 框架比較表

| 特性 | Chain-of-Thought | Few-shot | ReAct |
|------|-----------------|----------|-------|
| **最佳場景** | 數學/邏輯推理 | 格式化/分類 | 多步驟工具使用 |
| **Token 成本** | 中（推理步驟） | 中（範例佔空間） | 高（多輪交互） |
| **準確度提升** | 數學 +40-60% | 格式遵循 +70% | 複雜查詢 +50% |
| **延遲** | 稍高 | 與 baseline 相近 | 顯著增加 |
| **實作難度** | 低 | 低 | 中（需要工具整合） |
| **可解釋性** | 高（推理過程可見） | 中 | 高（每步有解釋） |
| **適合的任務複雜度** | 中-高 | 低-中 | 高 |

**選擇決策樹：**

```
你的任務需要外部工具嗎？
├── 是 → ReAct
└── 否 → 任務需要多步推理嗎？
    ├── 是 → Chain-of-Thought
    └── 否 → 輸出格式重要嗎？
        ├── 是 → Few-shot
        └── 否 → Zero-shot（直接問）
```

**可以混搭：** 實務上最有效的 prompt 經常混合使用。例如 **Few-shot + CoT** —— 在範例中展示推理過程，讓模型同時學會格式和推理方式。

---

## 五、Few-shot 最佳化策略

Few-shot 看起來簡單——不就是放幾個範例嗎？但範例的品質和策略會大幅影響效果。

### 1. 範例選擇：多樣性、代表性、邊界

**多樣性**：範例要涵蓋不同的 case。

```
# 不好：所有範例都是同一類
範例 1：「系統很慢」→ bug_report
範例 2：「頁面載入很久」→ bug_report
範例 3：「API 回應時間太長」→ bug_report

# 好：涵蓋各種類別
範例 1：「系統很慢」→ bug_report
範例 2：「我的帳單有問題」→ billing
範例 3：「希望能匯出 PDF」→ feature_request
範例 4：「怎麼設定 SSO？」→ technical
```

如果所有範例都是同一類，模型會產生偏差——傾向把所有輸入都分成那一類。

**代表性**：範例要反映真實的資料分佈。

如果你的實際 case 中 60% 是 technical、20% 是 billing、15% 是 bug_report、5% 是 feature_request，你的範例比例應該大致反映這個分佈——或至少不要嚴重偏離。

**邊界 case**：加入模糊的、容易分錯的範例。

```
# 邊界 case 範例
輸入：「為什麼要收我這筆 API 用量費？我覺得數字不對」
輸出：{"category": "billing", "urgency": "medium",
       "reason": "雖然提到了 API，但核心問題是費用爭議"}

輸入：「登入頁面跑很久，我趕著要付款」
輸出：{"category": "bug_report", "urgency": "high",
       "reason": "雖然提到付款，但根本問題是效能問題"}
```

邊界 case 的範例等於在告訴模型：「遇到模糊情況時，用這個邏輯判斷。」

### 2. 範例排序：易 → 難

把簡單直覺的範例放前面，複雜的放後面。

```
範例 1：（非常明確的 billing case）        ← 簡單
範例 2：（非常明確的 bug_report case）     ← 簡單
範例 3：（需要一點判斷的 technical case）   ← 中等
範例 4：（模糊的邊界 case）                ← 困難
範例 5：（反直覺的 case + 解釋）           ← 最難
```

這個排序模式讓模型先建立基本的分類理解，再學會處理複雜情況。跟教學一樣——先教基礎再教進階。

### 3. 範例數量：3-5 通常最佳

研究和實務經驗顯示：

- **0 examples (zero-shot)**：適合模型已經很擅長的簡單任務
- **1-2 examples**：幫助模型理解格式，但可能不夠多樣
- **3-5 examples**：通常是最佳區間——足夠多樣，又不會佔太多 token
- **6-10 examples**：只有在任務非常複雜或分類數很多時才需要
- **10+ examples**：通常 token 成本不划算，考慮 fine-tuning

```
準確度
  ↑
  │        ┌─── 邊際效益遞減
  │       ╱
  │      ╱
  │     ╱
  │    ╱
  │   ╱
  │  ╱
  │ ╱
  │╱
  └──────────────────→ 範例數量
  0  1  2  3  4  5  6  7  8  9  10
```

從 0 到 3 的提升通常最顯著。超過 5 個之後，每增加一個範例的邊際效益快速遞減。

### 4. 動態 Few-shot：根據輸入選範例

靜態 few-shot 的問題是：不管用戶問什麼，都看到同一組範例。

**動態 few-shot** 的做法是：根據用戶的輸入，從範例庫中檢索最相似的範例。

```
流程：

用戶輸入 → embedding → 相似度搜尋範例庫 → 取 top-3 → 組裝 prompt

┌──────────────────┐     ┌─────────────────┐
│  用戶：「信用卡    │     │   範例庫         │
│  被扣了三次」     │────→│   (500+ 範例)    │
│                  │     │   向量化儲存      │
└──────────────────┘     └────────┬────────┘
                                  │
                         取出最相似的 3 個
                                  │
                    ┌─────────────┴──────────────┐
                    │  範例 A：重複扣款 case       │
                    │  範例 B：退款爭議 case       │
                    │  範例 C：帳單週期誤解 case   │
                    └────────────────────────────┘
```

動態 few-shot 的效果通常比靜態 few-shot 好 15-30%，因為範例跟用戶的問題更相關。缺點是需要維護一個範例庫和向量搜尋的基礎設施。

---

## 六、Token 預算管理

Token 不是免費的。每一個 token 都有金錢成本和注意力成本。

### 怎麼計算預算

```
總預算 = context window size

分配公式（建議）：
┌────────────────────────────────────────────┐
│  System prompt          5-10%              │
│  Few-shot examples      10-15%             │
│  Context/RAG results    30-40%             │
│  對話歷史               10-15%             │
│  ─────────────────────────────             │
│  預留給生成             30-35%              │
│  （如果任務需要長輸出，預留更多）            │
└────────────────────────────────────────────┘
```

**具體數字範例（128K window）：**

| 區塊 | 比例 | Token 數 |
|------|------|----------|
| System prompt | 8% | ~10K |
| Few-shot | 12% | ~15K |
| Context | 35% | ~45K |
| 對話歷史 | 15% | ~19K |
| **生成預留** | **30%** | **~39K** |

### 壓縮策略

當 context 超出預算時，你需要壓縮。以下是幾種策略：

**策略一：摘要（Summarization）**

把長文件摘要成短版本。適合保留整體脈絡但不需要細節的場景。

```
# 壓縮前（800 tokens）
完整的 10 輪對話歷史，包含每一步的工具呼叫和回傳結果...

# 壓縮後（150 tokens）
<summary>
用戶在排查 orders 表的查詢效能問題。
已嘗試：加了 idx_orders_date 索引（改善 30%），
        調整了 work_mem 到 256MB（無明顯改善）。
目前卡在 JOIN 的效能瓶頸。
</summary>
```

**策略二：截斷（Truncation）**

直接砍掉不重要的部分。適合資訊有明確優先級的場景。

```
# 截斷策略
1. 砍掉最舊的對話（保留最近 5 輪）
2. 砍掉工具呼叫的完整輸出（只留摘要）
3. 砍掉低相關度的 RAG 結果（只留 top-3）
```

**策略三：分層壓縮**

對不同類型的內容用不同的壓縮策略：

```
System prompt      → 不壓縮（核心指令）
Few-shot examples  → 減少數量（5 → 3）
RAG results        → 只保留最相關的段落
對話歷史           → 舊的摘要，近的完整保留
工具輸出           → 只保留關鍵數據，移除格式
```

### 何時摘要 vs 截斷？

| 情境 | 建議策略 |
|------|---------|
| 對話歷史超過 10 輪 | 舊對話摘要，保留近 3-5 輪完整 |
| RAG 結果太多 | 先截斷低相關度結果，再摘要剩下的 |
| 單篇文件太長 | 摘要，或只提取相關章節 |
| 工具輸出太大 | 截斷，只保留關鍵欄位 |
| 需要保留推理脈絡 | 摘要（保留邏輯），不要截斷 |

---

## 七、六步迭代法

Prompt engineering 不是一次性的工作——它是一個迭代過程。以下是系統化的迭代方法。

```
六步迭代流程：

  ┌──────────────┐
  │ 1. Start     │
  │    Simple    │ ──── 用最簡單的 prompt 開始
  └──────┬───────┘
         │
  ┌──────┴───────┐
  │ 2. Test with │
  │  Real Cases  │ ──── 用 20-50 個真實 case 測試
  └──────┬───────┘
         │
  ┌──────┴───────┐
  │ 3. Classify  │
  │    Errors    │ ──── 分類錯誤類型
  └──────┬───────┘
         │
  ┌──────┴───────┐
  │ 4. Targeted  │
  │    Fix       │ ──── 針對性修改 prompt
  └──────┬───────┘
         │
  ┌──────┴───────┐
  │ 5. Record    │
  │   Changes    │ ──── 記錄修改和原因
  └──────┬───────┘
         │
  ┌──────┴───────┐
  │ 6. Evaluate  │
  │  with Judge  │ ──── LLM-as-Judge 評估
  └──────┬───────┘
         │
         ▼
    迴圈直到達標
```

### Step 1：Start Simple

從最簡單的 prompt 開始，不要一開始就堆疊各種技巧。

```
# 第一版 prompt（簡單）
你是客服分類器。根據用戶訊息，分類為 billing、technical、
bug_report 或 feature_request。用 JSON 格式回答。
```

為什麼不直接寫一個「完美」的 prompt？因為你不知道模型會在哪裡犯錯。先跑一輪，看到真實的錯誤模式，再有針對性地修改。

### Step 2：Test with Real Cases

準備 20-50 個有標準答案的真實 case，跑一輪測試。

```
測試集結構：

| input                        | expected_output       | actual_output         | correct? |
|------------------------------|-----------------------|-----------------------|----------|
| "信用卡被扣兩次"              | billing / high        | billing / high        | ✓        |
| "API 回傳 500"               | bug_report / high     | technical / medium    | ✗        |
| "能不能加深色模式"             | feature_request / low | feature_request / low | ✓        |
| "怎麼設定 webhook 加上我被多收費" | billing / medium  | technical / medium    | ✗        |
```

不要只測「正常 case」。刻意加入：
- 模糊的 case（可能屬於多個類別）
- 對抗性的 case（刻意誤導的描述）
- 邊界 case（同時包含多個議題）

### Step 3：Classify Errors

把錯誤分成三類，每一類的修復策略不同：

**理解錯誤（Understanding Error）**
模型理解錯了問題的意思。

```
問題：用戶說「API 回傳 500」
預期：bug_report
實際：technical
分析：模型把「API 使用」歸類為 technical，沒有理解 500 是錯誤碼
修復：在 guidelines 加上「HTTP 4xx/5xx 錯誤碼歸類為 bug_report」
```

**格式錯誤（Format Error）**
模型理解對了，但輸出格式不對。

```
預期：{"category": "billing", "urgency": "high"}
實際：分類是 billing，緊急程度高。
分析：模型用自然語言回答而非 JSON
修復：在 format 區塊加範例，或加上「只輸出 JSON，不要包含其他文字」
```

**知識錯誤（Knowledge Error）**
模型缺乏回答所需的知識。

```
問題：我們的 Enterprise 方案有什麼折扣？
預期：根據內部定價表回答
實際：模型編造了一個折扣比例
分析：模型沒有內部定價資訊
修復：在 context 中注入定價表，或啟用信心機制讓模型說「我不知道」
```

### Step 4：Targeted Fix

根據錯誤類型，對 prompt 做最小幅度的修改。

**關鍵原則：一次只改一個東西。**

如果你同時改了 role、加了範例、修了格式定義——效果變好了，你不知道是哪個改動起作用的。效果變差了，你更不知道問題出在哪。

```
# v1 → v2 的修改

## 改動：加入 HTTP 錯誤碼分類規則
## 原因：step 3 發現 5 個 case 把 HTTP 錯誤歸類為 technical

在 Guidelines 加入：
+ - HTTP 4xx/5xx 錯誤碼、伺服器錯誤、服務中斷 → 歸類為 bug_report
+ - API 使用方法、設定教學、整合問題 → 歸類為 technical
```

### Step 5：Record Changes

每次修改都記錄下來。這是你的 prompt changelog。

```
# Prompt Changelog

## v1 (2024-09-01)
- 初版，基本分類功能
- 測試結果：42/50 正確 (84%)

## v2 (2024-09-02)
- 加入 HTTP 錯誤碼分類規則
- 修復：5 個 bug_report 被誤分為 technical
- 測試結果：47/50 正確 (94%)

## v3 (2024-09-03)
- 加入 2 個邊界 case 範例
- 修復：混合議題的分類錯誤
- 測試結果：49/50 正確 (98%)

## v4 (2024-09-05)
- 嘗試加入 CoT 推理
- 結果：準確度持平 (98%)，但延遲增加 40%
- 決定：回退到 v3，CoT 對此任務不划算
```

有了 changelog，你可以：
- 看到進步的軌跡
- 回退到之前的版本
- 理解每個改動的原因

### Step 6：LLM-as-Judge 評估

手動評估 50 個 case 已經很累了。當測試集擴大到 200-500 個 case 時，用另一個 LLM 來當評分者。

```
## Judge Prompt

你是一個分類品質評估者。你會收到：
- 用戶的原始輸入
- 預期的分類結果
- 模型的實際分類結果

請評估模型的回答：

1. **正確性** (0-3)：分類是否正確？0=完全錯誤，3=完全正確
2. **合理性** (0-3)：即使分類不同，模型的判斷是否有道理？
3. **格式** (0-1)：輸出格式是否正確？

用以下格式回答：
{
  "correctness": 0-3,
  "reasonableness": 0-3,
  "format": 0-1,
  "explanation": "一句話說明"
}
```

**LLM-as-Judge 的注意事項：**

- 用比被評估模型更強的模型當 judge（例如用 Claude Opus 評估 Haiku 的輸出）
- Judge 也需要校準——先用 50 個人工標註的 case 驗證 judge 的一致性
- 不要完全取代人工評估，定期抽查 judge 的判斷

---

## 八、六個常見錯誤

### 錯誤 1：規則太多

**問題：** 寫了 30 條規則，模型反而什麼都做不好。

LLM 的注意力是有限的。規則越多，每一條分到的注意力就越少。超過 10-15 條，模型開始會選擇性忽略。

**Before：**

```
## 規則
1. 用繁體中文回答
2. 保持專業語氣
3. 不要使用 emoji
4. 每段不超過 3 句話
5. 技術名詞保留英文
6. 先確認問題再回答
7. 不確定時要說明
8. 回答要有結構
9. 用條列式整理
10. 每個建議附上理由
11. 引用來源
12. 不要重複用戶的問題
13. 避免使用被動語態
14. 控制在 500 字以內
15. 最後要有總結
... (還有 15 條)
```

**After：**

```
## 核心規則（務必遵守）
1. 繁體中文回答，技術名詞保留英文
2. 先一句話確認你的理解，再回答
3. 用條列式結構，每個建議附上理由
4. 不確定的資訊標註「不確定，建議查閱 [來源]」

## 風格偏好（盡量遵守）
- 專業但友善的語氣
- 控制在 500 字以內
- 最後附上一句話總結
```

把規則分成「必須遵守」和「盡量遵守」兩層。核心規則控制在 5 條以內。

### 錯誤 2：負面指令

**問題：** 全是「不要做什麼」，模型不知道「要做什麼」。

**Before：**

```
不要使用專業術語。
不要回答太長。
不要編造數據。
不要忽略用戶的問題。
不要使用口語化表達。
```

**After：**

```
- 用國中生能理解的語言解釋（遇到必要的術語時，附上簡短解釋）
- 回答控制在 200-300 字
- 引用具體數據時標明來源；不確定的數據直接說「我不確定」
- 回答的第一句話必須直接回應用戶的核心問題
- 使用書面語，語氣專業但不生硬
```

每一條否定指令都轉換成了具體的正面行為。

### 錯誤 3：沒有範例

**問題：** 只給了文字描述，沒有示範「好的輸出長什麼樣」。

**Before：**

```
請將用戶回饋分類並提取關鍵資訊，用結構化格式輸出。
```

「結構化格式」可以是 JSON、Markdown table、XML、YAML⋯⋯模型每次可能選不同的。

**After：**

```
請將用戶回饋分類並提取關鍵資訊。

## 範例

輸入：「你們的 app 很好用，但搜尋功能太慢了，尤其是在搜產品名稱的時候。」

輸出：
{
  "sentiment": "mixed",
  "positive": ["整體使用體驗好"],
  "negative": ["搜尋功能效能差"],
  "feature_mentioned": "搜尋",
  "specific_scenario": "搜尋產品名稱時",
  "priority": "medium"
}

## 現在處理以下回饋：
```

一個範例抵得上十句描述。

### 錯誤 4：Prompt 太長

**問題：** 把所有可能的情境都寫進 system prompt，結果 prompt 本身就佔了 30% 的 context window。

**Before：**

```
(3000 字的 system prompt，涵蓋了 15 種情境的處理方式、
 20 個範例、完整的 FAQ、公司歷史...)
```

**After：**

```
# 核心 System Prompt（~500 字）
角色 + 核心規則 + 輸出格式 + 2-3 個關鍵範例

# 動態注入（根據需要）
- 用戶問到定價 → 注入定價表
- 用戶問到技術問題 → 注入相關文件
- 用戶問到退款 → 注入退款政策
```

System prompt 保持精簡。把場景相關的資訊放到動態注入的 context 中，只在需要時才載入。

### 錯誤 5：過度工程

**問題：** 任務很簡單，但 prompt 設計得很複雜。

**Before：**

```
你是一位具有豐富經驗的多語言翻譯專家。請使用 Chain-of-Thought
推理，先分析原文的語義結構、文化背景和語境，然後考慮目標語言的
表達習慣和文化差異，接著生成初步翻譯，最後進行自我審查和修正。
請在 <analysis>、<draft>、<review>、<final> 四個標籤中
分別輸出你的分析、草稿、審查和最終翻譯。

[500 字的翻譯準則...]
[10 個不同領域的翻譯範例...]
```

這只是翻譯一句話而已。

**After：**

```
將以下文字翻譯成繁體中文。保持原文的語氣和專業度。
如果有無法精確翻譯的術語，保留英文並在括號中附上中文說明。
```

**判斷準則：** 如果 zero-shot 能達到 90% 的效果，不需要 few-shot。如果 few-shot 能達到 95%，不需要 CoT。**用最低成本的方案達到目標準確度。**

### 錯誤 6：沒有版本控制

**問題：** Prompt 改來改去，不知道哪個版本效果最好，也不知道為什麼。

**Before：**

```
# 腦中的模糊記憶
「好像上次加了那條規則之後變好了⋯⋯還是變差了？」
「這個範例是什麼時候加的？為什麼加的？」
```

**After：**

```
prompts/
├── customer_classifier/
│   ├── v1.txt          # 初版
│   ├── v2.txt          # 加入錯誤碼規則
│   ├── v3.txt          # 加入邊界 case 範例
│   ├── v4.txt          # 嘗試 CoT（已回退）
│   ├── current.txt     # → symlink to v3.txt
│   ├── CHANGELOG.md    # 每版的改動和測試結果
│   └── test_results/
│       ├── v1_results.json
│       ├── v2_results.json
│       └── v3_results.json
```

把 prompt 當程式碼管理：

- 每個版本獨立保存
- 記錄每次修改的原因和效果
- 保留測試結果
- 可以隨時回退

更好的做法是直接用 git 管理 prompt 檔案——每次修改都有 commit message、diff、和完整歷史。

---

## 結語

Prompt engineering 的本質不是文學創作，而是**工程迭代**。

核心原則回顧：

1. **結構化 system prompt**：Role / Guidelines / Format 三段式，每段都要具體
2. **格式化 context**：標記來源和相關性，最重要的放最前面
3. **內建信心機制**：教模型說「我不知道」，比讓它亂猜好一百倍
4. **選對推理框架**：CoT、Few-shot、ReAct 各有適用場景，不要無腦套用
5. **最佳化 few-shot**：多樣性、代表性、邊界 case，3-5 個通常夠
6. **管理 token 預算**：永遠預留 30% 給生成
7. **系統化迭代**：Start simple → test → classify errors → fix → record → evaluate
8. **避免常見錯誤**：規則太多、負面指令、沒範例、過長、過度工程、沒版本控制

最重要的一句話：**好的 prompt 不是一次寫出來的，是迭代出來的。**

從最簡單的版本開始。用真實 case 打臉自己。分類錯誤。針對性修復。記錄每一步。用 LLM-as-Judge 規模化評估。重複這個循環，直到達標。

這才是 prompt engineering。

---

## 參考資料

- [Anthropic Prompt Engineering Guide](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview) — Anthropic 官方 prompt 設計指南，涵蓋 system prompt 結構與最佳實踐
- [OpenAI Prompt Engineering Best Practices](https://platform.openai.com/docs/guides/prompt-engineering) — OpenAI 的 prompt 策略指南，包含 few-shot、CoT 等技巧
- [Chain-of-Thought Prompting Elicits Reasoning in Large Language Models (2022)](https://arxiv.org/abs/2201.11903) — CoT 原始論文，展示逐步推理如何提升 LLM 數學和邏輯能力
- [ReAct: Synergizing Reasoning and Acting in Language Models (2022)](https://arxiv.org/abs/2210.03629) — ReAct 框架論文，結合推理與工具使用的 prompting 方法
- [Large Language Models Are Human-Level Prompt Engineers (2022)](https://arxiv.org/abs/2211.01910) — APE 自動化 prompt 最佳化研究
- [Judging LLM-as-a-Judge (2023)](https://arxiv.org/abs/2306.05685) — LLM-as-Judge 評估方法論，探討用 LLM 評估 LLM 輸出的可靠性
- [DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines (2023)](https://arxiv.org/abs/2310.03714) — 系統化的 prompt 迭代與最佳化框架
