# 新論文選案標準

## 編輯目標

替讀者找出今天最值得知道的 AI Agent 新方向。不是選出學術上最完整的論文，也不能因題目新奇就收錄證據撐不起主張的內容。

選案分成兩關，順序不可顛倒：

1. **可信度門檻**：判斷它是不是值得認真閱讀的研究。
2. **方向價值排序**：判斷通過門檻的研究為什麼值得讀者今天知道。

新穎性不能抵銷可信度缺陷。不要把兩關壓成一個總分。

## 第一關：可信度門檻

先讀摘要判斷主題，再對可能入選的論文讀取足以檢查主張的正文段落。至少查方法、實驗／分析、比較基準與限制；只讀摘要不能判定通過。

依論文主張採用相稱的證據形式：實證研究看實驗與資料，理論研究看定義、推導或證明，系統研究看設計、測試與比較。純 position paper 可以作為趨勢背景，但除非事件本身具有重大影響，不作為 daily 的主選論文。

逐篇確認：

- 問題、方法與核心主張可以清楚辨認。
- 有可檢查且與主張相稱的實驗、案例、形式分析或系統證據。
- 比較對象合理；若缺主要 baseline，作者有說明或文章會明確指出。
- 結論沒有明顯超出實驗族群、任務、資料或設定。
- 資料來源、評估方式與主要限制可辨認。
- 關鍵數字能回到表格、圖或正文，不靠新聞稿或二手摘要轉述。

判定只有三種：

| 判定 | 定義 | 後續 |
|---|---|---|
| 通過 | 方法與證據足以支持本文準備陳述的範圍 | 進入方向價值排序 |
| 有條件通過 | 證據初步或適用範圍窄，但沒有明顯失實，且方向值得注意 | 可入選，但必須揭露限制並降低語氣強度 |
| 排除 | 核心主張缺乏相稱證據、數字不可追溯、比較明顯失衡，或結論嚴重外推 | 不得靠新穎性補回 |

以下資訊可記錄為背景，但不得用來替代可信度判斷：引用數、作者／機構聲望、venue、社群熱度。

## 第二關：方向價值排序

只排序「通過」或「有條件通過」的論文。每篇使用文字標籤，不製造看似精確但沒有校準依據的百分制：

| 面向 | 標籤 | 判斷問題 |
|---|---|---|
| 本站相關性 | 直接／間接 | 是否直接影響 Agent 的建構、評估、部署或產品決策？ |
| 方向新意 | 實質增量／應用改寫／舊概念包裝 | 新的是方法、資料、問題設定、評估方式，還是只換名詞？ |
| 今日重要性 | 高／中／低 | 讀者今天知道後，是否會改變理解、觀察重點或近期決策？ |
| 實務連結 | 明確／推測／無 | 能否指出具體受影響的工程或產品情境？ |

優先選擇：

- 揭露既有 Agent 能力或評測的關鍵盲點。
- 提出可能改變架構、評估、部署或產品決策的新方法。
- 與同日其他研究形成可辨認的新趨勢，但不是為了聚類硬湊。
- 給出具體結果，讓讀者知道接下來該驗證或觀察什麼。

## 入選論文的判斷標註

入選論文除了方向價值，還要標註證據目前成熟到哪裡、讀者能否重做，以及編輯判斷的把握程度。這些標籤互相獨立，不合成總分：

| 面向 | 標籤 | 判斷問題 |
|---|---|---|
| 證據成熟度 | 較完整／初步／概念驗證 | 證據是否覆蓋核心主張、主要 baseline、消融與限制？「較完整」不等於通過同行審查或已外部複現 |
| 可復現性 | 完整產物／部分產物／未提供 | 是否公開程式碼、資料、設定、輸出或預註冊，足以重跑主要結果？ |
| 編輯信心 | 高／中／低 | 目前讀到的正文與產物，是否足以支持文章採用的敘述強度？ |

另外在內部紀錄保留 `presentation`，對應頂會常見的 Clarity／Presentation 面向：

| 標籤 | 定義 |
|---|---|
| 清楚 | 方法、實驗設定、主張邊界與限制足以被準確理解 |
| 混合 | 核心想法可理解，但關鍵設定、定義或限制有明顯缺口 |
| 不清楚 | 表達問題已妨礙核對主張或判斷如何重做 |

Presentation 不顯示在讀者文章，也不能代替可信度：寫得清楚的研究仍可能證據不足，寫得吃力也不等於結果錯誤。

「編輯信心」不是論文品質分數，也不是審稿人的 Overall score。高信心只代表文章中的有限主張可被現有證據支持；若主張範圍窄，仍可同時是「高信心、初步證據」。不要仿造頂會的 5／6／10 分制，也不要把 venue、作者聲望或接受率算進這些標籤。

## 選取數量與組合

- 每日可選 **0–3 篇**，品質優先於固定篇數。
- 先選最值得知道的方向，再看能否形成主題；不得先找最大聚類，再從中塞入較弱論文。
- 兩篇以上時盡量涵蓋不同角度，例如方法、能力邊界、應用或安全。
- 只有 1 篇合格就發布 1 篇；沒有合格論文就不產文章，回報「本時間窗無通過可信度門檻且具今日重要性的論文」。
- 不在讀者文章中列出為何某些國家、主題或候選沒有入選；沒有內容就不補說明句。

## 篩選紀錄

把完整候選決策保存到 `.research/daily-arxiv-screening/YYYY-MM-DD.json`，不要只留下入選論文。至少包含：

```json
{
  "date": "YYYY-MM-DD",
  "status": "published | no-publication",
  "selectedCount": 0,
  "announcementBatch": "YYYY-MM-DD",
  "announcementSources": ["https://arxiv.org/list/cs.AI/new"],
  "generatedAt": "ISO-8601",
  "candidates": [
    {
      "arxivId": "0000.00000",
      "title": "Paper title",
      "topicGate": "pass | reject",
      "credibility": "pass | conditional | reject | not-assessed",
      "credibilityEvidence": ["section/table/figure locator and what it supports"],
      "evidenceMaturity": "substantial | preliminary | proof-of-concept | not-assessed",
      "evidenceMaturityReason": "what the current evidence supports and does not support",
      "reproducibility": "full-artifacts | partial-artifacts | not-provided | not-assessed",
      "reproducibilityEvidence": ["public code/data/config/output/preregistration locator"],
      "editorialConfidence": "high | medium | low | not-assessed",
      "editorialConfidenceReason": "why the article's claim strength is supportable",
      "primaryLimitation": "the single limitation that most constrains interpretation",
      "presentation": "clear | mixed | unclear | not-assessed",
      "presentationReason": "whether method, experiments, claim boundaries, and limitations can be understood accurately",
      "relevance": "direct | indirect | not-assessed",
      "novelty": "substantive | adaptation | repackaging | not-assessed",
      "todayImportance": "high | medium | low | not-assessed",
      "practicalLink": "clear | speculative | none | not-assessed",
      "decision": "selected | watch | rejected",
      "reason": "short editorial reason"
    }
  ]
}
```

`announcementBatch` 是官方 `new` listing 顯示的公開批次日期；個別論文的 `submittedAt` 可另存，但不得拿來製造「過去 48 小時」的假精確時間窗。週末或無公告日時，使用最近一次尚未篩選的官方批次。

排除紀錄是後續建立 relevance model 的標註資料。不得讓模型自行學習後取代可信度門檻；它只能協助排列人工審查順序。

## 文章語氣與證據成熟度

| 證據狀態 | 建議寫法 |
|---|---|
| 通過，且結果直接支持主張 | 「研究在 X 設定下顯示……」 |
| 有條件通過 | 「作者在 X 設定下觀察到……；目前仍待 Y 驗證」 |
| 僅作者自測、未外部複現 | 明確標示 `⚠️ 作者自測，尚未外部複現` |

避免把預印本寫成已被學界確認的定論。`Reviewer 一句話評` 必須同時指出可取之處、證據邊界與下一個應驗證的問題。

讀者文章每篇在 TL;DR 後顯示一個「編輯判斷」表格，欄位固定為：可信度、證據成熟度、可復現性、編輯信心、閱讀建議、主要限制。標籤後必須補一句具體依據，不能只放形容詞。可復現性只描述公開 code、data、config、outputs 或預註冊是否足以重跑；缺少跨模型、多 seed 或外部複驗屬於證據成熟度／主要限制，不放進可復現性。
