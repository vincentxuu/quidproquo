# Daily Arxiv retrospective design

Status: agreed design, not implemented

Recorded: 2026-08-30

## Purpose

校準 AI Agent Arxiv Digest 的選案判斷，回答四個問題：

1. 入選論文後來有沒有新增公開產物、外部實作、複現、反證或正式審稿結果？
2. 當時列為 `watch` 的論文，後來是否比入選者更值得讀者知道？
3. 哪些高編輯信心判斷後來需要降低語氣、更正或撤回？
4. 選案是否長期偏向特定主題、benchmark、機構類型、地區或容易取得產物的研究？

這套流程用來校準編輯判斷，不用後見之明把「當時合理」誤判成「後來沒有成為主流」。

## Cohort 與觀察時間

回看以論文的 arXiv 官方 `announcementBatch` 為起點，不以月底切齊，也不使用作者 submission timestamp。

- **30 天回看**：檢查產物、論文修訂、第三方實作、早期外部測試與限制變化。
- **90 天複查**：檢查外部複現、反證、正式 venue、後續採用與方向影響。
- 月度 routine 只處理「在本月到期」的 30／90 天 cohort，避免月初論文有 30 天、月底論文只有 1 天的比較偏誤。

第一個預定 cohort：

- 2026-09-30 月度執行納入 2026-08-28 公告批次的 30 天回看。
- 同一批次的 90 天複查約在 2026-11-26 到期，收進 2026-11 月度執行。

## 母群與抽查範圍

偏誤分析的母群是該 cohort 所有 daily screening candidates，不只看入選論文。

需要深入回看的項目：

1. 所有 `selected` 論文。
2. 所有 `watch` 且 `todayImportance: high` 的論文。
3. 所有 `watch` 且 `novelty: substantive` 的論文。
4. 從其餘 `watch`／`rejected` 中做固定規則的分層抽查，補足主題、論文類型、機構類型與地區缺口。

未被深入回看的候選仍計入覆蓋矩陣，否則無法比較母群與入選分布。

## Daily screening 需要補的 metadata

以下欄位必須盡量涵蓋候選母群，不能只替入選論文填：

```json
{
  "topics": ["agent-safety", "runtime-governance"],
  "paperType": "system | empirical | theoretical | benchmark | position",
  "organizationType": "academic | industry | mixed | independent | unknown",
  "regions": ["north-america"],
  "benchmarkFamilies": ["AgentDojo", "AgentDyn"],
  "modelVendorsEvaluated": ["OpenAI", "Google"],
  "artifactAvailableAtSelection": true
}
```

機構與地區只是用來檢查選案偏誤，不得進入可信度門檻或方向價值排序。

## Follow-up record schema

```json
{
  "arxivId": "2608.27141",
  "announcementBatch": "2026-08-28",
  "originalDecision": "selected",
  "originalConfidence": "medium",
  "reviewHorizon": "30d | 90d",
  "reviewedAt": "ISO-8601",
  "artifactChange": "added | unchanged | removed | unknown",
  "externalEvidence": [
    {
      "type": "replication | implementation | critique | benchmark | venue | correction",
      "source": "https://example.com/source",
      "assessment": "supports | mixed | challenges",
      "note": "What the source actually establishes"
    }
  ],
  "evidenceUpdate": "strengthened | unchanged | weakened | corrected | unresolved",
  "wouldSelectToday": "yes | watch | no | unresolved",
  "originalJudgment": "held | partially-held | missed | too-strong | unresolved",
  "editorialAction": "none | update-article | add-note | change-standard",
  "reason": "Concrete reason tied to current evidence"
}
```

`externalEvidence: []` 只代表目前沒有找到相稱的外部證據，不代表研究失敗。30 天內沒有複現通常應維持 `unresolved`，不得當成負面訊號。

## 判斷問題

每篇深入回看固定回答：

1. 如果今天第一次看到這篇，依目前證據還會入選嗎？
2. 原文章採用的敘述強度是否仍合理？
3. 當時的主要限制是否解除、維持或惡化？
4. 同批次的高重要性 `watch` 論文，是否已有一篇比原入選者更值得讀者知道？

判斷標籤：

| 標籤 | 定義 |
|---|---|
| `held` | 原始選擇與敘述強度仍合理 |
| `partially-held` | 方向選對，但原始語氣或信心偏高 |
| `missed` | `watch` 論文後來明顯比入選者更重要 |
| `too-strong` | 後續證據削弱原始主張 |
| `unresolved` | 尚無足夠時間或外部證據判斷 |

## 覆蓋與偏誤矩陣

每月比較候選母群與入選論文，而不是只描述入選者：

| 維度 | 要觀察的問題 |
|---|---|
| 主題 | 是否長期偏好安全、記憶或 coding agent？ |
| 論文類型 | 是否低估 benchmark、理論或負結果？ |
| 機構類型 | 是否偏向企業研究院或知名學校？ |
| 地區 | 搜尋與閱讀來源是否過度集中在北美／英語圈？ |
| Benchmark family | 是否反覆依賴少數 benchmark？ |
| Model vendor | 結論是否主要來自少數模型供應商？ |
| 產物狀態 | 是否因容易驗證而過度偏好已有公開程式碼的論文？ |

覆蓋不要求配額平衡。矩陣的用途是辨認穩定偏向，然後判斷它來自讀者需求、資料可得性、研究母群本身，還是篩選盲點。

## 月度輸出

```text
.research/daily-arxiv-retrospectives/
├── 2026-09-30.json
└── 2026-09-30.md
```

Markdown 報告固定包含：

1. 本月到期的 30／90 天 cohort。
2. 原始判斷維持、削弱、更正或尚未確定的案例。
3. 入選與高重要性 `watch` 論文的反事實比較。
4. 母群對入選的覆蓋矩陣與偏誤觀察。
5. 需要執行的文章更新或 selection-standard 調整。

## 發布與自動化邊界

- 第一階段只產內部 `.research` 報告，不自動發布文章。
- 只有出現實質更正、重要外部複現或明顯漏選時，才更新公開文章並加更新紀錄。
- 不因「沒有新變化」而修改舊文。
- 自動化可以搜尋候選來源、整理 metadata 與產生比較表；`supports／mixed／challenges`、`wouldSelectToday` 與 `editorialAction` 仍需人工判斷。
- 引用數、社群熱度、作者或 venue 聲望只能作背景，不能單獨決定回看結果。

## 實作順序

1. 擴充 daily screening candidate metadata。
2. 定義 retrospective JSON schema 與驗證器。
3. 建立月度回看 skill，重用 Groundlane 與既有 source-evidence 規則。
4. 建立 2026-09-30 的待辦 cohort。
5. 先跑三個月，再決定是否建立公開的研究方向回顧系列。
