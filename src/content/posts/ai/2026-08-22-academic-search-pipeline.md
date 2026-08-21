---
title: "學術搜尋怎麼組：arXiv、OpenAlex、Crossref、Semantic Scholar 與 PubMed 的分工"
date: 2026-08-22
category: ai
type: deep-dive
tags: [academic-search, literature-review, arxiv, openalex, crossref, semantic-scholar, pubmed]
lang: zh-TW
series:
  name: "搜尋與爬取實戰"
  order: 12
tldr: "學術搜尋不能把五個 API 的結果直接串起來：先用 arXiv／PubMed 做領域發現，再用 DOI、PMID、arXiv ID 對齊 OpenAlex／Semantic Scholar，最後由 Crossref 與 PubMed 關係資料檢查正式版本、勘誤與撤稿。"
description: "一套可維護的學術搜尋管線：五個資料源的責任邊界、DOI／PMID／arXiv ID entity resolution、preprint 與 version of record 關係、作者機構識別、引用數差異、去重與增量更新。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-academic-search-pipeline-en)

一般網頁搜尋只要回答「哪個 URL 值得讀」，學術搜尋還要回答另一個更麻煩的問題：**眼前這五筆紀錄，究竟是五篇論文、同一篇論文的五個版本，還是一篇原文加上勘誤與撤稿通知？**

[arXiv](https://info.arxiv.org/help/api/)、[OpenAlex](https://help.openalex.org/api/)、[Crossref](https://www.crossref.org/documentation/retrieve-metadata/rest-api/)、[Semantic Scholar](https://api.semanticscholar.org/api-docs/) 與 [PubMed](https://www.ncbi.nlm.nih.gov/books/NBK25501/) 不是五個可互換的搜尋引擎。它們分別擅長預印本、跨領域知識圖譜、出版者登錄 metadata、引用與語意探索，以及生醫索引。可靠的 Agent 應把它們組成一條有責任邊界的管線，而不是把五份 JSON append 後交給模型猜。

本文交付的是資料模型、合併規則與 **14 個可重跑的 entity-resolution fixture**。它不是 live API benchmark：本文沒有保存五個服務在同一時間點的完整 raw responses，因此不提供命中率、引用數排名或延遲比較，也不宣稱 fixture 已經過線上端點驗證。

## 五個資料源各自負責什麼

| 資料源 | 最適合的工作 | 穩定識別碼／欄位 | 不要把它當成 |
|---|---|---|---|
| [arXiv API](https://github.com/arXiv/arxiv-docs/blob/develop/source/help/api/user-manual.md) | 找最新預印本、學科分類、版本歷史、journal reference | arXiv ID、`v1`／`v2`、`updated` | 同儕審查或正式出版狀態資料庫 |
| [OpenAlex](https://help.openalex.org/data/works/) | 跨領域候選發現、作品—作者—機構—引用圖譜 | OpenAlex Work ID、DOI、PMID、PMCID、ORCID、ROR | 出版者的權威版本狀態 |
| [Crossref REST API](https://www.crossref.org/documentation/retrieve-metadata/rest-api/) | 以 DOI 取出版者登錄 metadata、作品關係、出版後更新 | DOI、`relation`、`update-to`、indexed date | 完整全文或所有學術作品的總目錄 |
| [Semantic Scholar Graph API](https://api.semanticscholar.org/api-docs/) | 語意探索、相似論文、引用／被引用展開 | S2 Paper ID，也接受 DOI、arXiv ID、PMID、PMCID | DOI 或撤稿狀態的唯一真相來源 |
| [PubMed／E-utilities](https://www.ncbi.nlm.nih.gov/books/NBK25501/) | 生醫查詢、MeSH、PMID、勘誤／撤稿等 linked citations | PMID、PMCID、DOI、publication type、CommentsCorrections | 全領域引用圖譜 |

起手式可依問題分兩路。電腦科學、數學與物理的新研究，先查 arXiv，再用 OpenAlex 與 Semantic Scholar 補引用網路；生醫問題先由 PubMed 的 field／MeSH 查詢收斂，再補其他圖譜。已知 DOI 時，不必重新做文字搜尋：直接查 Crossref，並用 DOI 到 OpenAlex 與 Semantic Scholar 取交叉資料。

```text
query
  ├─ CS / math / physics ──> arXiv discovery
  ├─ biomedical ───────────> PubMed discovery
  └─ broad / citation ─────> OpenAlex + Semantic Scholar discovery
                                  │
                                  v
                         identifier resolution
                    DOI / PMID / PMCID / arXiv ID
                                  │
                    ┌─────────────┴─────────────┐
                    v                           v
             Crossref relations        PubMed linked citations
           version / update status    erratum / retraction / EoC
```

## 先建「作品圖」，不要先建一張扁平表

一張 `papers` 表很容易把 preprint 與正式版硬壓成同一列，接著又把撤稿通知覆蓋掉原文。更安全的最小模型有四種物件：

```yaml
work:
  local_id: work_...
  identifiers: {doi: null, pmid: null, pmcid: null, arxiv: null, s2: null, openalex: null}
  title: "..."
  authorships: []
  source_records: []
  status: active

version:
  work_id: work_...
  kind: preprint | accepted | version_of_record
  identifier: "..."
  version_label: null

relation:
  from_work: work_...
  type: is_preprint_of | is_version_of | corrects | retracts | expression_of_concern_for
  to_work: work_...
  asserted_by: crossref | pubmed | retraction_watch | local_rule

metric_observation:
  work_id: work_...
  metric: citation_count
  source: openalex | semantic_scholar | crossref
  value: 0
  observed_at: "..."
```

關鍵差別是：**identifier 用來認同一個實體，relation 用來保留不同實體之間的關係，metric 則永遠帶來源與時間。** DOI 相同通常可以合併；preprint DOI 與 version of record DOI 不同時應建立關係，而不是挑一個刪掉；勘誤或撤稿通知本身也是可引用的獨立作品。

## 識別碼先正規化，再談模糊比對

DOI 應移除 `https://doi.org/`、`doi:` 與前後空白後轉成小寫；PMID 保留純數字；arXiv ID 則要同時保存 base ID 與版本。arXiv 官方手冊明確區分「查最新版本的 base ID」和附上 `vN` 的特定版本，因此不能在 ingest 時直接丟掉版本尾碼。

```python
import re
from urllib.parse import unquote

def normalize_doi(value: str | None) -> str | None:
    if not value:
        return None
    value = unquote(value).strip().lower()
    value = re.sub(r"^(https?://(dx\.)?doi\.org/|doi:\s*)", "", value)
    return value.rstrip(" .") or None

def normalize_pmid(value: str | None) -> str | None:
    if not value:
        return None
    match = re.fullmatch(r"(?:pmid:\s*)?(\d+)", value.strip(), re.I)
    return match.group(1) if match else None

def normalize_arxiv(value: str | None) -> tuple[str | None, int | None]:
    if not value:
        return None, None
    value = re.sub(r"^https?://arxiv\.org/(abs|pdf)/", "", value.strip(), flags=re.I)
    value = value.removesuffix(".pdf")
    match = re.fullmatch(r"(.+?)(?:v(\d+))?", value, re.I)
    return (match.group(1).lower(), int(match.group(2)) if match.group(2) else None)
```

合併的信心順序應固定：

1. 相同的正規化 DOI。
2. 相同 PMID／PMCID，或資料源明示的外部 ID crosswalk。
3. 相同 arXiv base ID；各版本留在 `version`，不互相覆寫。
4. Crossref、PubMed 或可信資料源明示的作品關係。
5. 標題、第一作者、年份、期刊等 metadata 只能產生候選；缺少第二個獨立訊號時送人工檢查。

不要用「標題相似度超過某個分數就自動合併」當規則。標題會被翻譯、縮短、補副標，也可能真的有兩篇同名文章。模糊比對的正確輸出是 `candidate_match`，不是 `same_work=true`。

## 14 個 entity-resolution fixture

下面是規則測試集，不是 live API 結果。`<doi-a>`、`<pmid-a>` 等 token 要由測試 runner 換成固定、可公開的真實紀錄，再把各次 response、查詢時間與 schema version 存進 fixture 目錄，才可稱為整合測試。

| ID | 跨來源輸入 | 預期判定 | 防止的錯誤 |
|---|---|---|---|
| F01 | Crossref `https://doi.org/<DOI-A>`；OpenAlex `doi:<doi-a>` | 合併為同一 work | DOI 大小寫／URL 形式造成重複 |
| F02 | PubMed `<pmid-a>` 帶 DOI；Semantic Scholar 以 `PMID:<pmid-a>` 回傳同一 DOI | 合併，保留 PMID、DOI、S2 ID | 生醫紀錄被拆成兩篇 |
| F03 | arXiv `<arxiv-a>v1` 與 `<arxiv-a>v3` | 同一 preprint work、兩個 version | 最新版覆蓋可追溯的 v1 |
| F04 | arXiv ID 無 DOI；Semantic Scholar 以 `ARXIV:<arxiv-a>` 找到 S2 ID | 依明示 ID crosswalk 合併 | 無 DOI 論文只能靠標題猜 |
| F05 | arXiv／preprint DOI A；Crossref 顯示 VoR DOI B `hasPreprint` A | A、B 分開，建立 `is_preprint_of` | 把未審查版與正式版當同一檔案 |
| F06 | OpenAlex 與 Crossref 標題相同，但年份與第一作者不同 | 不合併 | 同名論文誤併 |
| F07 | 標點不同的標題、同一年、同第一作者，沒有共同 ID | 只建 candidate，等待第二訊號 | 模糊比對過度自信 |
| F08 | Crossref correction DOI C `updates` DOI B | C 是獨立 notice，B 加 `corrected` 狀態邊 | 勘誤文覆蓋原始 metadata |
| F09 | PubMed retraction PMID R 指向原文 PMID P；Crossref／Retraction Watch 也有 DOI 關係 | notice 與原文分開；P 標為 retracted；保留兩方 provenance | 只刪原文、看不到撤稿依據 |
| F10 | 同姓名、不同 ORCID，研究領域相近 | 不合併作者 | 姓名碰撞 |
| F11 | 同 ORCID、作者名縮寫不同；OpenAlex affiliations 指向同一 ROR | 合併作者，保留 raw names | 改名／縮寫造成作者分裂 |
| F12 | 「某大學醫學院」與「某大學」各有 ROR，且存在 lineage | 保留子機構與母機構，再建立階層 | 統計時重複或失去粒度 |
| F13 | OpenAlex、Semantic Scholar、Crossref 對同一 DOI 回傳不同引用數 | 不改 identity；存三筆帶時間的 metric | 把數字差異誤判成不同作品 |
| F14 | Crossref 同一 DOI 的 title／relation 後來更新 | 同一 work 新增 source revision；重新跑狀態規則 | metadata 更新被當成新論文 |

實作時把這張表改成 YAML／JSON fixture，讓 resolver 回傳 `merge`、`link`、`candidate` 或 `reject`。每個案例還要驗證 provenance 沒有遺失；光測 work 數量不夠。

## Preprint 到 version of record：要連，不要硬併

Crossref 的版本建議把 preprint 與 accepted／version of record 配成不同 DOI，並以 `hasPreprint`／`isPreprintOf` 等關係連接。這直接決定資料模型：搜尋結果可以在畫面上折疊成一個「作品群組」，引用時仍要選定具體版本。

推薦策略是：

- 做新穎性追蹤時顯示 arXiv 最新版本，也保留首次上傳日期。
- 做證據引用時，若已有 version of record，預設導向正式版 DOI。
- preprint 有正文而正式版付費時，可以連到可讀版本，但 citation metadata 仍標明實際引用哪一版。
- 沒有明示關係時，標題／作者相似只能建立候選，不自動宣告 preprint 已正式出版。

OpenAlex 的 work metadata 會提供多種 location，且 `best_oa_location` 會考量 published、accepted、submitted version；這可用來找可讀副本，不等於出版者對版本關係的權威宣告。兩種資訊應並存。

## 勘誤、撤稿與關切聲明是狀態邊，不是刪除指令

Crossref 建議把具編輯意義的更新發成獨立 notice，使用不同 DOI 並連回被更新作品。Crossref REST API 的 `update-to` 也整合了出版者與 [Retraction Watch](https://www.crossref.org/documentation/retrieve-metadata/retraction-watch/) 的資料；後者可區分 `publisher` 與 `retraction-watch` provenance。

PubMed 另一邊會用 linked citations 表示 Erratum、Retraction、Update、Expression of Concern 等關係。這兩條訊號應取聯集，不是互相覆蓋：

```text
active -> expression_of_concern -> corrected
   └────────────────────────────> retracted
retracted -> reinstated
```

狀態不是單純 boolean。至少保存 `status`、`effective_date`、`notice_id`、`asserted_by` 與 `observed_at`。若 Crossref 與 PubMed 暫時不一致，顯示「來源狀態不同」並保留兩筆 observation；不要讓模型自行裁決哪一家「一定正確」。

## 作者與機構 identity：ORCID、ROR 是錨點，不是萬靈丹

OpenAlex 會把 raw author names 聚成 Author ID，作者紀錄可帶 ORCID 與 affiliation history；機構則以 ROR 為外部錨點，並保存 lineage。不過官方文件也明示 affiliation parser 可能漏配或誤配，子機構的細緻度又受 ROR coverage 影響。

因此作者合併至少分三層：

- **可自動合併**：相同 ORCID，且沒有相衝突的明確資料。
- **候選合併**：姓名變體，加上共同作者、研究主題與歷年機構軌跡一致。
- **禁止自動合併**：只有姓名相同，或 ORCID 不同。

機構也不要只存 display name。保存 raw affiliation、matched ROR、match method、confidence 與 lineage。統計「整間大學」時沿 lineage roll up；列作者署名時顯示當篇作品的原始 affiliation。這樣才不會為了統計方便改寫歷史署名。

## 為什麼 citation count 一定不同

引用數不是作品的固有欄位，而是「某資料庫在某時間點成功建立的 citation edge 數量」。OpenAlex 說明其 reference 先以 DOI 配對，無 DOI 時才用 bibliographic metadata；來源缺 reference、作品尚未收錄或配對失敗，都會讓 `cited_by_count` 變少。Crossref 的 Cited-by 只計能在 Crossref 登錄作品間建立的連結，而且 reference deposit 並非強制。Semantic Scholar 也依自己的 corpus 與 PDF／publisher 資料辨識 citing papers。

所以不要選最大值，也不要平均：

```json
{
  "metric": "citation_count",
  "observations": [
    {"source": "openalex", "value": null, "observed_at": "<timestamp>"},
    {"source": "semantic_scholar", "value": null, "observed_at": "<timestamp>"},
    {"source": "crossref", "value": null, "observed_at": "<timestamp>"}
  ]
}
```

排序時只能明講「依 OpenAlex citation count」或「依 Semantic Scholar citation count」。跨時間比較要固定資料源與擷取日期；研究評估更不能把不同來源的數字混成一條趨勢。

## 去重與更新：每次同步都要能重播

完整流程可拆成六個可稽核階段：

1. `discover`：保存 query、資料源、cursor 與 raw response hash。
2. `normalize`：只做確定性的 ID／日期／字串正規化。
3. `resolve`：依 F01–F14 規則輸出 merge、link、candidate、reject。
4. `enrich`：按 DOI／PMID／arXiv ID 補其他來源，不能再用搜尋排名當 identity 證據。
5. `status`：重查 Crossref updates、Retraction Watch 與 PubMed linked citations。
6. `publish`：答案引用具體 version，連同 provenance 與查詢時間輸出。

增量更新不要依 publication date，因為舊作品的 metadata、引用數與狀態都會改。Crossref 官方建議依用途使用 created、updated 或 indexed date；其中 indexed date 還會涵蓋 Crossref 或第三方加入的引用數與關係變動。PubMed 提供年度 baseline 與每日 update files。每個 connector 都要保存自己的 high-water mark，加上重疊時間窗後再去重，避免 timestamp 邊界漏資料。

最重要的停止條件不是「五個 API 都查過」，而是：高信心 ID 已對齊、版本關係沒有被壓扁、狀態來源已檢查、引用數標明資料源、低信心候選沒有自動合併。做到這裡，Agent 才拿到一組能引用的學術實體，而不只是看起來很像 bibliography 的字串。

## 驗證邊界

本文的 API 欄位與關係語意依寫作當日可取得的官方文件整理；十四個案例是待 runner 代入固定真實紀錄的規則 fixture。本文沒有保存 live API raw results，未驗證各服務當下的 schema 細節、rate limit、資料延遲或特定作品的 crosswalk。要把它升級成 production connector，下一步是為每個 fixture 鎖定公開識別碼、保存原始回應，並在每日 CI 中區分「服務資料改變」與「resolver regression」。

## 參考資料

- [arXiv API User's Manual](https://github.com/arXiv/arxiv-docs/blob/develop/source/help/api/user-manual.md)
- [OpenAlex API reference](https://help.openalex.org/api/)
- [OpenAlex Works attributes](https://help.openalex.org/data/works/attributes/)
- [OpenAlex citations and references](https://help.openalex.org/data/works/citations/)
- [OpenAlex Authors](https://help.openalex.org/data/authors/)
- [OpenAlex Institutions](https://help.openalex.org/data/institutions/)
- [Crossref REST API](https://www.crossref.org/documentation/retrieve-metadata/rest-api/)
- [Crossref version control, corrections, and retractions](https://www.crossref.org/documentation/principles-practices/best-practices/versioning/)
- [Crossref relationships](https://www.production.crossref.org/documentation/schema-library/markup-guide-metadata-segments/relationships/)
- [Crossref Retraction Watch data](https://www.crossref.org/documentation/retrieve-metadata/retraction-watch/)
- [Crossref REST API sync tips](https://www.crossref.org/documentation/retrieve-metadata/rest-api/tips-for-using-the-crossref-rest-api/)
- [Crossref Cited-by](https://www.crossref.org/documentation/cited-by/)
- [Semantic Scholar Academic Graph API](https://api.semanticscholar.org/api-docs/)
- [Semantic Scholar citation-count FAQ](https://www.semanticscholar.org/faq/estimated-citations)
- [NCBI Entrez Programming Utilities Help](https://www.ncbi.nlm.nih.gov/books/NBK25501/)
- [PubMed Help and Citation Matcher API](https://pubmed.ncbi.nlm.nih.gov/help/)
- [PubMed XML Help: errata, retractions, and linked citations](https://www.ncbi.nlm.nih.gov/books/NBK3828/)
