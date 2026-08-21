---
title: "從搜尋結果到可靠引用：URL 去重、來源分級與 Claim-Source Mapping"
date: 2026-08-22
category: ai
type: deep-dive
tags: [web-search, citations, retrieval, ai-agent, data-provenance, reproducibility]
lang: zh-TW
tldr: "可靠引用不是在答案後面塞 URL：先把 URL、內容副本與來源獨立性拆開，再用 atomic claim、quote span、snapshot 與可重跑檢查建立 claim-source matrix。"
description: "一套把搜尋結果轉成可稽核引用的資料管線：URL normalization、canonical URL、內容 fingerprint、來源分級、claim-source mapping、網頁快照與 CI 檢查。"
draft: false
series:
  name: "搜尋與爬取實戰"
  order: 11
---

> 🌏 [English version](/posts/ai/2026-08-22-search-results-reliable-citations-en)

搜尋 API 回傳十條 URL，不代表你有十個來源。同一篇新聞可能帶著不同追蹤參數出現三次，又被入口網站與內容農場轉載四次；最後七個網址都在重複同一份稿。更麻煩的是，網址即使真的不同，也不表示它支持答案旁邊那句話。

可靠引用管線要保存的不是「答案 → URL」，而是「**最小可查核主張 → 當時抓到的來源版本 → 支持它的原文範圍**」。這篇只處理這段工程：URL 與內容去重、來源分級、claim-source mapping、快照保存，以及每次生成後都能重跑的檢查。多輪搜尋怎麼規劃、來源衝突如何仲裁，留給站內的 [Deep Research Agent 架構文](/posts/ai/2026-06-04-autonomous-deep-research-agent)。

## 先定義資料 contract：URL、文件、主張、證據是四種東西

最常見的資料模型只有 `url`、`title`、`snippet`。它適合顯示搜尋結果，不足以支撐引用。至少拆成四張表：

```text
SearchHit --many-to-one--> SourceDocument --one-to-many--> Snapshot
                                                |
Claim --many-to-many------------------------- EvidenceLink
```

- `SearchHit`：哪個 query、provider、名次把 URL 找回來。它是檢索紀錄，不是證據。
- `SourceDocument`：正規化 URL、作者或發布者、來源類別與副本群組。
- `Snapshot`：某個時間點實際抓到的 bytes、抽取文字、HTTP metadata 與雜湊。
- `Claim`：報告裡一條不可再拆的主張。
- `EvidenceLink`：哪份 snapshot 的哪段原文，以何種強度支持或反駁哪個 claim。

一個夠用的 JSON 形狀如下。`quote_start` 與 `quote_end` 指向**已保存的 normalized text**，不能指向日後會變動的線上頁面：

```json
{
  "claim": {
    "id": "c-017",
    "text": "Service X is available in Taiwan.",
    "importance": "critical",
    "status": "supported"
  },
  "evidence": [{
    "source_id": "src-004",
    "snapshot_id": "snap-004-20260822T031500Z",
    "support": "full",
    "quote": "Service X is available in Taiwan.",
    "quote_start": 8134,
    "quote_end": 8167,
    "locator": "regions#taiwan",
    "independence_group": "service-x-status",
    "checked_at": "2026-08-22T03:19:00Z",
    "checker_version": "citation-check-v1"
  }]
}
```

這個拆法有一個直接好處：同一頁更新時新增 snapshot，不覆寫舊證據；同一來源支持三個主張時新增三條 `EvidenceLink`，不複製整份文件。

## 第一層去重：正規化 URL，但不要猜網站語意

[RFC 3986 的 URI 比較章節](https://www.rfc-editor.org/rfc/rfc3986.html#section-6)描述的 syntax-based normalization 包含 scheme／host 大小寫、百分比編碼與 dot segment 正規化。跨網域使用時應從保守規則開始：

1. scheme 與 hostname 轉小寫。
2. 移除預設 port、帳號密碼與 fragment；fragment 另存成 citation locator。
3. 只刪明確列入政策的追蹤參數，例如 `utm_*`、`gclid`、`fbclid`。
4. 保留 path 與其他 query parameter；`page=2`、`lang=en`、`id=123` 很可能改變內容。

下面的版本刻意不改寫 path。若要正規化百分比編碼或 `.`、`..`，應採完整 RFC 實作，並為各網域加等價測試，而不是再塞幾行字串替換：

```python
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

DROP_KEYS = {"gclid", "fbclid", "mc_cid", "mc_eid"}

def normalize_url(raw: str) -> tuple[str, str]:
    u = urlsplit(raw.strip())
    scheme = u.scheme.lower()
    host = (u.hostname or "").lower()
    port = u.port
    if port and not ((scheme == "http" and port == 80) or
                     (scheme == "https" and port == 443)):
        host = f"{host}:{port}"

    kept = []
    for key, value in parse_qsl(u.query, keep_blank_values=True):
        if key.lower().startswith("utm_") or key.lower() in DROP_KEYS:
            continue
        kept.append((key, value))

    path = u.path or "/"
    normalized = urlunsplit((scheme, host, path, urlencode(kept), ""))
    return normalized, u.fragment
```

不要全域刪 query string、強迫移除尾端斜線，或把所有參數排序後便宣告等價。這些規則必須是 domain-specific policy，而且要以測試案例證明改寫前後回傳同一份資源。

### `rel=canonical` 是線索，不是去重裁決

[HTML Living Standard](https://html.spec.whatwg.org/multipage/links.html#link-type-canonical)將 `rel="canonical"` 定義為目前文件的 preferred URL。抓取器應保存 `requested_url`、redirect 後的 `final_url`、`declared_canonical` 與自己的 `normalized_url`，不要只留最後一個。

將 canonical 合併進既有文件前，至少確認目標可抓取、不是跨到無關網域，且正文 fingerprint 相同或高度近似。錯誤設定、模板共用 canonical，甚至惡意頁面都可能把你導向不相干的內容。

## 第二層去重：用內容 fingerprint 找出轉載與鏡像

URL 相同只能抓到 URL duplicate。對轉載稿與鏡像站，要同時保留三種 fingerprint：

| 欄位 | 輸入 | 用途 |
|---|---|---|
| `raw_sha256` | 原始 response bytes | 證明保存的 payload 沒被改 |
| `text_sha256` | 固定 extractor 產出的 normalized text | 找出正文完全相同的副本 |
| `near_dup_hash` | 分詞後的 SimHash／MinHash | 找出只改標題、廣告或少量字句的轉載 |

[RFC 9530](https://www.rfc-editor.org/rfc/rfc9530.html)區分 message content 的 `Content-Digest` 與 selected representation 的 `Repr-Digest`；你的資料庫也應明確寫出雜湊對象。只存一個叫 `hash` 的欄位，日後無法判斷它算的是壓縮 bytes、解碼 HTML，還是抽取後正文。

文字正規化也要版本化，例如 `extractor=crawl4ai@x.y`、`normalizer=text-v3`。升級 extractor 後應新增 fingerprint，不要靜默覆寫舊值。近似雜湊只負責產生「疑似同稿」候選；最終合併仍應檢查標題、發布時間、作者、正文重疊與 outbound links。

每個副本群組選一個 `representative_source_id`，其他 URL 照樣保留。引用官方原文時代表來源通常是官方頁；追查資訊如何擴散時，最早發布時間可能更重要。不要因為去重而刪掉 provenance。

## 來源分級要分開「權威性」與「獨立性」

來源分級不是一個萬用可信度分數。建議先用可說明的類別：

| Tier | 定義 | 適合支持的主張 |
|---|---|---|
| `official` | 標準組織、政府、產品官方文件 | 規格、政策、功能、價格 |
| `primary` | 原始論文、作者資料、法規原文、事件當事者紀錄 | 方法、結果、第一手陳述 |
| `secondary` | 有署名與編輯責任的分析或報導 | 背景、脈絡、交叉查核 |
| `aggregator` | 搜尋摘要、內容彙整、無清楚作者的轉載 | 找線索，不直接支持關鍵主張 |

類別要跟 claim type 一起看。廠商官方頁適合證明「它宣稱提供什麼」，不適合單獨證明「它比競品好」；第三方評論也不能取代 API 參數的官方文件。

另一個欄位 `independence_group` 用來避免把同稿轉載算成多源。它可以先取內容副本群組，再由人工把通訊社原稿與各家轉載、同一官方新聞稿的翻寫、同研究團隊的多個頁面合併。兩個不同網域不一定是兩個獨立來源。

## 把句子拆成 atomic claim，再建立 claim-source matrix

「工具 A 在 2026 年推出，免費、速度最快，而且符合某標準」至少包含四個可分別真假的主張。整句掛一個 URL 時，你無法知道來源支持哪一半。先拆成 atomic claims：一次只包含一個主詞關係、一個可判定結果，以及必要的時間與比較條件。

接著建立 claim-source matrix：

| Claim | Source A | Source B | 判定 |
|---|---|---|---|
| `c-01` 規格定義了欄位 X | `full`（官方規格 §3） | `partial`（實作文件） | supported |
| `c-02` 服務在台灣可用 | `no_support` | `full`（區域清單） | single-source |
| `c-03` p95 latency 較低 | `contradicts` | `full`（同批 benchmark） | conflicted |

`support` 至少分成 `full`、`partial`、`no_support`、`contradicts`。`partial` 不能在輸出時被當成完整支持；`contradicts` 也不能被檢索排序吃掉。關鍵 claim 若要求雙來源，檢查的是兩個不同 `independence_group`，不是兩條 URL。

### Quote span 是引用的最小稽核單位

每條 evidence 保存短引文、在 snapshot normalized text 中的 start／end offset，以及人類可讀的 `locator`（章節、頁碼或段落 ID）。offset 讓程式重跑，locator 讓讀者與 reviewer 找得到。

不要只存搜尋 snippet。Snippet 可能截斷否定詞、混合頁面不同段落，也可能在下一次查詢時改變。引用檢查必須回到抓取後保存的全文；若版權或資料政策不允許保存全文，至少保存允許範圍內的短引文、雜湊、擷取時間與可重新取得的定位資訊。

## 網頁會改：保存 snapshot，而不是假設 URL 永遠代表同一段文字

每次用來源支持 claim 時，snapshot 至少保存：

```yaml
snapshot_id: snap-004-20260822T031500Z
requested_url: https://example.org/doc?utm_source=x
final_url: https://example.org/doc
retrieved_at: 2026-08-22T03:15:00Z
http_status: 200
content_type: text/html; charset=utf-8
etag: '"abc123"'
last_modified: Thu, 20 Aug 2026 09:00:00 GMT
raw_sha256: 8d969eef6ecad3c29a3a629280e686cff8ca...
text_sha256: 2bb80d537b1da3e38bd30361aa855686bde0...
extractor: readability@0.6.0
normalizer: text-v3
text_path: snapshots/snap-004-20260822T031500Z.txt
archive_url: https://archive.example/snap-004
```

大規模保存可採 [WARC 1.1](https://iipc.github.io/warc-specifications/specifications/warc-format/warc-1.1/)；它把 request、response、metadata、conversion 與 revisit 定義成不同 record type，並提供 payload digest 欄位。[RFC 7089 Memento](https://www.rfc-editor.org/rfc/rfc7089.html)則定義 `Memento-Datetime` 與 `original` link relation，讓 archived state 與原始資源、封存時間能一起被識別。

第三方 archive URL 是額外副本，不是本地 snapshot 的替代品。封存可能失敗、受 robots 或下架政策影響，也可能漏掉需要 JavaScript 才出現的內容。高風險資料還要處理授權、個資、存取控制與保存期限；「可重現」不代表可以無限制複製。

## 把引用檢查做成每次都能重跑的 gate

生成答案後不要只問 LLM「引用對不對」。先做 deterministic checks，再把語意支持交給人工或固定版本的判定器。以下最小檢查假設 `bundle.json` 內有 `claims`、`evidence`、`snapshots`：

```python
import hashlib
import json
import sys
from pathlib import Path

bundle = json.loads(Path(sys.argv[1]).read_text())
snapshots = {x["id"]: x for x in bundle["snapshots"]}
evidence_by_claim = {}
errors = []

for edge in bundle["evidence"]:
    evidence_by_claim.setdefault(edge["claim_id"], []).append(edge)
    snap = snapshots.get(edge["snapshot_id"])
    if not snap:
        errors.append(f'{edge["claim_id"]}: missing snapshot')
        continue
    text = Path(snap["text_path"]).read_text()
    start, end = edge["quote_start"], edge["quote_end"]
    if text[start:end] != edge["quote"]:
        errors.append(f'{edge["claim_id"]}: quote span drifted')
    digest = hashlib.sha256(text.encode()).hexdigest()
    if digest != snap["text_sha256"]:
        errors.append(f'{edge["claim_id"]}: snapshot digest mismatch')

for claim in bundle["claims"]:
    full = [e for e in evidence_by_claim.get(claim["id"], [])
            if e["support"] == "full"]
    groups = {e["independence_group"] for e in full}
    required = 2 if claim["importance"] == "critical" else 1
    if len(groups) < required:
        errors.append(f'{claim["id"]}: {len(groups)}/{required} independent sources')

if errors:
    raise SystemExit("\n".join(errors))
print("citation bundle: ok")
```

語意檢查另外輸出 `checker_version`、判定理由與 `full/partial/no_support/contradicts`，不要只覆寫一個 boolean。若使用 LLM 判定，固定 model、prompt 與溫度，並保留人工抽查樣本。模型升級時對同一份 bundle 重跑，才能看出是證據變了，還是判定器變了。

CI 的 gate 可以很明確：所有 critical claims 都有 snapshot、quote span 可重放、內容雜湊一致，且至少有兩個獨立來源完整支持；一般 claims 至少一個。另行報告 citation coverage，但不要讓「平均覆蓋率 95%」掩蓋那個沒有來源的核心結論。

## 一條可落地的處理順序

```text
search hits
  -> URL normalization（保留 raw / final / canonical）
  -> fetch + snapshot（bytes、text、headers、timestamp、hash）
  -> exact / near-duplicate clustering
  -> source tier + independence group
  -> draft 拆成 atomic claims
  -> evidence retrieval + quote spans
  -> claim-source matrix
  -> deterministic gate
  -> semantic / human review
  -> render citations
```

這條管線刻意把「找到」、「抓到」、「相信」與「支持某句話」拆開。搜尋 provider 的分數只能幫你決定先讀哪個結果；它不能替 canonical、來源獨立性、quote span 或 snapshot 做決定。

整體取捨也很清楚：多存 metadata 與快照會增加儲存、授權管理和實作成本，但換來的不是漂亮的參考資料清單，而是能回答四個問題——這句話是什麼主張、哪個來源支持、當時原文寫了什麼、今天重跑是否仍成立。回答不了其中一個，就還只是有連結，不是可靠引用。

## 參考資料

- [RFC 3986 — URL normalization 與 URI 比較](https://www.rfc-editor.org/rfc/rfc3986.html)
- [WHATWG HTML — Canonical URL link type](https://html.spec.whatwg.org/multipage/links.html#link-type-canonical)
- [RFC 9530 — 內容 fingerprint 與 HTTP Digest Fields](https://www.rfc-editor.org/rfc/rfc9530.html)
- [WARC Format 1.1 — 網頁 snapshot 格式（IIPC）](https://iipc.github.io/warc-specifications/specifications/warc-format/warc-1.1/)
- [RFC 7089 — 網頁 archive snapshot 的時間與原始來源](https://www.rfc-editor.org/rfc/rfc7089.html)
- [Deep Research Agent 怎麼蓋](/posts/ai/2026-06-04-autonomous-deep-research-agent)
