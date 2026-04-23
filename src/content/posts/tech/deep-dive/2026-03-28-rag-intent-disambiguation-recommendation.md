---
title: "「推薦下一條」和「推薦類似的」不是同一件事 — RAG 推薦系統的意圖消歧"
date: 2026-03-28
type: guide
category: tech
tags: [rag, intent-classification, nlp, recommendation-system, slot-filling]
lang: zh-TW
tldr: "攀岩 RAG 系統中「推薦下一條路線」（progression）和「推薦類似路線」（similarity）被同一個 hasSimilarRouteIntent() 函式混為一談，導致推薦品質崩壞。解法是 Regex Fast Path + LLM Fallback 的兩階段意圖分類。"
description: "深入分析攀岩路線推薦系統中兩種語義相近但意圖截然不同的查詢如何被正確區分：從問題定義、學術佐證、業界解法，到 Cloudflare Workers 上的具體實作方案。"
draft: false
---

做攀岩路線推薦的 RAG 系統時踩了一個坑：使用者說「推薦下一條路線」和「推薦類似路線」，表面上都是在要推薦，但背後的意圖完全不同。系統卻用同一個 keyword matching 函式處理兩者，結果就是推薦品質很差。

這篇記錄問題的根因分析、學術界怎麼處理這類意圖消歧、以及最後選擇的實作方案。

## 問題：一個函式吃兩種意圖

系統裡有一個 `hasSimilarRouteIntent()` 函式，用關鍵字比對來偵測推薦意圖：

```typescript
// backend/src/services/query/nlp.ts
export function hasSimilarRouteIntent(query: string): boolean {
  return ['差不多', '類似', '相似', '爬完', '完攀', '爬過', '爬了', '攀了',
          '下一條', '下一個', 'rp', 'RP', 'redpoint', 'red point']
    .some((k) => query.includes(k));
}
```

問題在哪？「爬完天天天藍了，推薦我下一條路線」和「推薦類似天天天藍的路線」都會命中這個函式，但它們要的東西完全不一樣：

| 面向 | 進階推薦 (Progression) | 相似推薦 (Similarity) |
|------|----------------------|----------------------|
| **難度方向** | 向上偏移 0.5~1 個子等級 | 維持在 ±1 個子等級 |
| **技能面** | 互補或延伸（face → crack） | 同類型、同風格 |
| **地理偏好** | 不限，可跨岩場 | 優先同岩場或同區域 |
| **檢索策略** | 難度升序 + 技能多樣性 | 向量相似度 + 難度過濾 |
| **使用者心態** | 「我準備好挑戰了」 | 「我喜歡這種感覺，再來一條」 |

一個剛 redpoint 5.10d 的攀岩者說「推薦下一條」，期望的是 5.11a 左右的挑戰。系統回三條 5.10c~5.10d 的「類似路線」，使用者會覺得系統不懂他。反過來也一樣糟——想要類似風格的路線，卻收到難度明顯更高的推薦，只會產生挫折感。

在攀岩這個領域，錯誤的推薦不只是體驗差，還有安全隱患。推薦過高難度的路線可能導致受傷。

## 學術界怎麼看這件事

翻了一圈文獻，核心結論很一致：**意圖建模的精細程度直接決定推薦品質**。

Cai et al. (2024) 分析了 59 種不同的意圖模型，發現細粒度分類（區分 explore / exploit / compare / progress 等子意圖）相比粗粒度分類（僅區分 recommend / not-recommend）可提升 **15-25% 的推薦接受率**。

Zhang et al. (2025) 在 REIC 論文中展示：RAG 增強的意圖分類在處理語義相近但意圖不同的查詢時，透過檢索相似歷史查詢的標註結果作為 few-shot examples，能有效消歧。這跟我們的場景高度吻合。

## 五種解法的取捨

### 1. 細粒度意圖分類 (Fine-Grained Intent Classification)

把粗粒度的「推薦意圖」拆成子意圖樹：

```
recommend_intent
├── progression     # 「下一條」「更難的」「挑戰」
├── similar         # 「類似的」「差不多的」「同風格」
├── exploration     # 「有什麼好路線」「推薦看看」
└── training        # 「適合練習的」「暖身路線」
```

Wankmüller (2024) 的研究顯示 GPT-4 級別 LLM 在常見意圖識別準確率可達 85% 以上。優點是明確的標籤直接映射到檢索策略，缺點是邊界案例難處理（「類似但稍難一點的」同時包含 progression 和 similar）。

### 2. Slot-Filling（意圖 + 槽位）

不只分類意圖，還從查詢中提取結構化槽位：

```json
{
  "intent": "recommend_progression",
  "slots": {
    "reference_route": "天天天藍",
    "difficulty_direction": "harder",
    "style_preference": null,
    "location_preference": "same_crag",
    "grade_offset": 1
  }
}
```

Chen & Yu (2021) 的 ACM Computing Surveys 論文指出聯合意圖偵測與 slot filling 相比獨立模型可提升 2-5% 準確率。結構化的 slots 能精準控制檢索參數，但 schema 需要領域專家設計。

### 3. LLM 結構化輸出

用 prompt engineering + JSON mode 直接解析查詢。Arora et al. (2024) 在 EMNLP Industry Track 指出 LLM 在 zero-shot 意圖偵測上已接近或超越傳統微調模型，特別是低資源場景。Malkani (2024) 提出 Hybrid LLM + Intent Classification 架構，用 LLM 處理模糊查詢、輕量分類器處理明確查詢。零樣本即可工作，但每次都呼叫 LLM 的延遲和成本是問題。

### 4. 對話式澄清 (Conversational Clarification)

系統不確定時主動問使用者：

```
使用者：「爬完天天天藍了，推薦路線」
系統：「你想要：
  A. 挑戰更高難度的路線（目前你爬的是 5.10b）
  B. 找到類似風格和難度的其他路線
  C. 探索同岩場的其他路線」
```

準確率最高，但增加互動輪次，在行動端可能造成摩擦。適合作為 confidence 低於閾值時的 fallback。

### 5. 多意圖偵測 (Multi-Intent Detection)

Liu et al. (2024) 提出用對比學習分離一個查詢中的多個意圖。像「推薦類似但稍難一點的路線」可以拆成 `[progression(0.6), similar(0.4)]`，以 similar 為基礎但 grade 向上偏移。最貼近真實需求，但實作複雜度高。

## 攀岩領域的特殊挑戰

攀岩不是一般商品推薦，有幾個特殊性：

**YDS 難度階梯**。攀岩有明確的等級結構 `5.10a → 5.10b → 5.10c → 5.10d → 5.11a`，「進階」可以量化。但進階不只是數字提升，還包含技能類型切換（face → crack）、路線長度增加（單繩距 → 多繩距）、風格轉變（sport → trad）。

**theCrag 的 grAId 系統**。用 Whole-History Rating（WHR）演算法把攀岩者和路線都建模為動態 rating，能預測攀岩者在特定時間點成功完攀特定路線的機率。推薦成功機率 50-70% 的路線，既有挑戰性又不會太挫折。天然適合 progression intent。

**繁體中文的語言特殊性**。這是最麻煩的部分：

| 表達 | 意圖 | 難點 |
|------|------|------|
| 「爬完了，下一條」 | Progression | 明確 |
| 「推薦類似的」 | Similar | 明確 |
| 「完攀了想再挑戰」 | Progression | 「完攀」觸發 similar，但「挑戰」暗示 progression |
| 「RP 後推薦」 | 看上下文 | RP 是完攀，但「下一步」語義隱含 |
| 「還有什麼好爬的」 | Exploration | 模糊 |

## 實作方案：Regex Fast Path + LLM Fallback

最後選擇兩階段架構，結合細粒度分類和 LLM 結構化輸出：

```
查詢輸入
    │
    ▼
[Stage 1: Regex 快速路徑]
    │
    ├── 命中「下一條/更難/挑戰/進步」→ progression
    ├── 命中「類似/差不多/同風格/像」 → similar
    └── 未命中或衝突 → 進入 Stage 2
    │
    ▼
[Stage 2: LLM 結構化輸出]
    │
    ├── 解析 intent + slots + confidence
    └── confidence < 0.7 → 觸發澄清問題
    │
    ▼
[Stage 3: 對話式澄清（選用）]
    └── 回傳選項讓使用者確認意圖
```

核心分類函式：

```typescript
const PROGRESSION_KEYWORDS = ['下一條', '下一個', '更難', '挑戰', '進步', '提升', '突破'];
const SIMILAR_KEYWORDS = ['類似', '相似', '差不多', '同風格', '像'];
const COMPLETION_TRIGGERS = ['爬完', '完攀', '爬過', '爬了', '攀了', 'rp', 'RP', 'redpoint'];

export type RecommendIntent = 'progression' | 'similar' | 'exploration' | 'ambiguous';

export function classifyRecommendIntent(query: string): {
  intent: RecommendIntent;
  confidence: number;
} {
  const hasCompletion = COMPLETION_TRIGGERS.some(k => query.includes(k));
  const hasProgression = PROGRESSION_KEYWORDS.some(k => query.includes(k));
  const hasSimilar = SIMILAR_KEYWORDS.some(k => query.includes(k));

  // 明確的進階意圖
  if (hasProgression && !hasSimilar) {
    return { intent: 'progression', confidence: 0.95 };
  }
  // 明確的相似意圖
  if (hasSimilar && !hasProgression) {
    return { intent: 'similar', confidence: 0.95 };
  }
  // 衝突：同時有進階和相似關鍵字 → 丟給 LLM
  if (hasProgression && hasSimilar) {
    return { intent: 'ambiguous', confidence: 0.5 };
  }
  // 有完攀觸發詞但沒有明確方向 → 預設 progression
  // 「爬完了，推薦」隱含想往上走
  if (hasCompletion) {
    return { intent: 'progression', confidence: 0.7 };
  }

  return { intent: 'exploration', confidence: 0.6 };
}
```

不同意圖對應不同的檢索策略，差異集中在 grade range 和排序邏輯：

```typescript
function buildRetrievalStrategy(intent: RecommendIntent, routeRef: RouteReference) {
  switch (intent) {
    case 'progression':
      return {
        gradeRange: progressionGradeRange(routeRef.gradeNumeric, +1, +4),
        cragFilter: null,              // 不限岩場，鼓勵探索
        stylePreference: 'diverse',    // 優先不同風格，技能延伸
        rankingStrategy: 'challenge-appropriate',
      };
    case 'similar':
      return {
        gradeRange: similarGradeRange(routeRef.gradeNumeric, 2),
        cragFilter: routeRef.cragId,   // 優先同岩場
        stylePreference: 'same',       // 同風格
        rankingStrategy: 'similarity', // 向量相似度排序
      };
    case 'exploration':
      return {
        gradeRange: similarGradeRange(routeRef.gradeNumeric, 4),
        cragFilter: null,
        stylePreference: 'diverse',
        rankingStrategy: 'popularity',
      };
  }
}
```

Grade 偏移的計算也很直接：

```typescript
export function progressionGradeRange(
  gradeNumeric: number,
  minStepsUp: number = 1,
  maxStepsUp: number = 4
): { $gte: number; $lte: number } {
  const pos = gradeToPosition(gradeNumeric);
  return {
    $gte: positionToGrade(pos + minStepsUp),
    $lte: positionToGrade(pos + maxStepsUp),
  };
}
```

整合到 `toolSelectionNode` 時，取代原本的 `if (hasSimRouteIntent)` 判斷：

```typescript
const recommendResult = classifyRecommendIntent(query);
if (recommendResult.intent !== 'exploration' || hasCompletionTrigger(query)) {
  const routeRef = await state.queryService.extractRouteReference(query);
  const strategy = buildRetrievalStrategy(recommendResult.intent, routeRef);
  updates.recommendIntent = recommendResult.intent;
  updates.vectorFilter = buildVectorFilter(strategy, routeRef);
}
```

## 整體來說

核心取捨是 **延遲 vs 準確率**。Regex 快速路徑能在 < 1ms 內處理大部分明確查詢（估計 70-80%），只有模糊或衝突的查詢才需要呼叫 LLM（額外 200-500ms）。在 Cloudflare Workers 這種 edge runtime 上，能省的延遲都得省。

另一個取捨是**預設行為的選擇**。當使用者只說「爬完了，推薦」沒有明確方向時，預設 progression 而不是 similar。理由是攀岩者提到「完攀」時，心理暗示通常是「準備好往上走了」。這個假設可以透過 A/B 測試驗證，追蹤不同意圖的推薦接受率來持續調整。

未來可以整合使用者歷史紀錄（連續 RP 同級路線更可能是 progression）、WHR 機率模型（推薦成功機率 50-70% 的路線），以及 LLM 結構化輸出作為 regex 階段 confidence 不足時的 fallback。

---

## 參考資料

- [Cai et al. (2024) — Understanding User Intent Modeling for Conversational Recommender Systems](https://link.springer.com/article/10.1007/s11257-024-09398-x)
- [Zhang et al. (2025) — REIC: RAG-Enhanced Intent Classification at Scale](https://arxiv.org/pdf/2506.00210)
- [Wankmüller (2024) — User Intent Recognition and Satisfaction with Large Language Models](https://arxiv.org/html/2402.02136v2)
- [Weld et al. (2022) — A Survey of Intent Classification and Slot-Filling Datasets for Task-Oriented Dialog](https://arxiv.org/abs/2207.13211)
- [Chen & Yu (2021) — A Survey of Joint Intent Detection and Slot Filling Models in NLU](https://dl.acm.org/doi/10.1145/3547138)
- [Arora et al. (2024) — Intent Detection in the Age of LLMs (EMNLP Industry Track)](https://aclanthology.org/2024.emnlp-industry.114.pdf)
- [Malkani (2024) — Hybrid LLM + Intent Classification Approach](https://medium.com/data-science-collective/intent-driven-natural-language-interface-a-hybrid-llm-intent-classification-approach-e1d96ad6f35d)
- [Li et al. (2025) — A Survey on Recent Advances in LLM-Based Multi-turn Dialogue Systems](https://dl.acm.org/doi/10.1145/3771090)
- [Liu et al. (2024) — Multi-intent Aware Contrastive Learning for Sequential Recommendation](https://arxiv.org/html/2409.08733v1)
- [Wu et al. (2024) — C-LARA: Balancing Accuracy and Efficiency in Multi-Turn Intent Classification](https://arxiv.org/html/2411.12307v1)
- [theCrag — grAId Whole-History Rating System for Climbing](https://www.thecrag.com/en/article/graid)
- [Draper et al. (2022) — Content-Based Recommendations for Crags and Climbing Routes](https://link.springer.com/chapter/10.1007/978-3-030-94751-4_33)
- [Wen et al. (2025) — Beyond Item Dissimilarities: Diversifying by Intent in Recommender Systems (KDD)](https://arxiv.org/abs/2405.12327)
- [Yu et al. (2025) — MIND-RAG: Multimodal Context-Aware and Intent-Aware RAG](https://openaccess.thecvf.com/content/ICCV2025W/MRR%202025/papers/Yu_MIND-RAG_Multimodal_Context-Aware_and_Intent-Aware_Retrieval-Augmented_Generation_for_Educational_Publications_ICCVW_2025_paper.pdf)
- [IntentRec (2025) — Incorporating Latent User Intent via Contrastive Alignment for Sequential Recommendation](https://www.sciencedirect.com/science/article/abs/pii/S156742232500047X)
