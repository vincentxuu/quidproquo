# Research: Web Retrieval Benchmark

## 子問題

1. 如何建立同時覆蓋 known URL、search、dynamic、auth、blocking 的固定 corpus？
2. ground truth 如何處理會變動的網頁與 freshness window？
3. outcome、內容品質、引用正確性、延遲、成本與 escalation 應怎麼分開量？
4. deterministic fixture 與 live probe 如何分工，避免只測 mock 或只測網路雜訊？
5. 如何注入 timeout、reset、429、空 200、stale cache 與登入狀態失效？
6. regression gate 如何設定，才不會拿單次 live 波動當產品退步？

## 來源清單

- [RFC 9111: HTTP Caching](https://www.rfc-editor.org/rfc/rfc9111.html) — IETF 標準／一手；訪問日：2026-08-21
- [OpenTelemetry HTTP metrics semantic conventions](https://opentelemetry.io/docs/specs/semconv/http/http-metrics/) — 官方規格／一手；訪問日：2026-08-21
- [Playwright: Mock APIs](https://playwright.dev/docs/mock) — 官方文件／一手；訪問日：2026-08-21
- [Shopify Toxiproxy](https://github.com/Shopify/toxiproxy) — 官方 repository／一手；訪問日：2026-08-21
- [W3C PROV-O](https://www.w3.org/TR/prov-o/) — W3C Recommendation／一手；訪問日：2026-08-21

## 讀取完整度盤點

| 來源 | 讀到什麼程度 | 阻礙 |
|---|---|---|
| RFC 9111 | ✅ HTML 全文；深讀 freshness、validation、Age、authenticated cache | 無 |
| OpenTelemetry HTTP metrics | ✅ 官方規格全文；深讀 duration、status 與 error.type | 無 |
| Playwright Mock APIs | ✅ 官方頁全文；深讀 route mock、HAR record/replay 與 matching | 無 |
| Toxiproxy | ✅ 官方 README 全文；深讀 latency、timeout、reset_peer、packet_loss | 無 |
| W3C PROV-O | ✅ Recommendation 全文；深讀 Entity、Activity、Agent 與 interchange | 無 |

## 事實交叉表

| 事實 | 來源 1 | 來源 2 | 驗證狀態 |
|---|---|---|---|
| HTTP freshness 由 response age 與 freshness lifetime 判斷；stale representation 通常需 validation 才能重用 | RFC 9111 §4.2–4.3 | RFC 9110 validator semantics（前輪已讀） | ✅ |
| HTTP client duration 應以秒記錄；status 與低基數 error.type 應作為維度 | OpenTelemetry HTTP metrics | OpenTelemetry HTTP spans（官方規格索引） | ✅ |
| Playwright 可攔截 HTTP/HTTPS，HAR replay 會依 URL/method（POST 另含 payload）匹配 | Playwright Mock APIs | Playwright Network 文件（官方） | ✅ |
| Toxiproxy 可注入 latency、timeout、reset_peer、bandwidth 與 packet loss | Toxiproxy README | 官方 toxics 實作文件 | ✅ |
| PROV-O 用 Entity、Activity、Agent 表示並交換不同系統產生的 provenance | W3C PROV-O | W3C PROV overview | ✅ |

## 我的推論（與上表分開）

| 推論 | 依據 | 這個推論可能錯在哪 |
|---|---|---|
| Benchmark 要分成 deterministic lane 與 live lane，前者擋邏輯 regression，後者量真實漂移 | HAR/mock 可重播；live 網路會隨時間改變 | fixture 過度簡化時，deterministic pass 仍可能掩蓋實務失敗 |
| Ground truth 必須含 valid_at 與 freshness window，而不是永久答案 | RFC 9111 把 fresh/stale 明確分開 | 任務 freshness SLA 不必等同 origin cache semantics，仍需產品自行定義 |
| Outcome 應採單一 primary label 加多個 failure tags | 方便 gate 與 root-cause aggregation | 複合失敗可能被 primary label 過度簡化，raw trace 仍需保留 |
| Citation correctness 要拆成「URL 是否正確」與「來源內容是否支持 claim」 | provenance 與 content judgment 是不同層 | support 判定若用 LLM 仍需人工抽查與 adjudication |

## Corpus 與執行狀態

- 已設計 30 個固定 task：5 strata × 6。
- 預定 live channels：direct HTTP fetch、search API、browser automation，共 3 條。
- 目前本地 `TAVILY_API_KEY`、`EXA_API_KEY`、`FIRECRAWL_API_KEY`、`BRAVE_SEARCH_API_KEY`、`SEARXNG_URL` 均未設定。
- 無法執行三條 live channels，也沒有 raw run artifact；文章必須維持 `draft: true`。
- 本輪不產生成功率、延遲、成本或 provider 排名。

## 草稿骨架

### 核心概念

Benchmark 的測試單位是 task，不是單次 HTTP request；必須同時驗證答案、引用、freshness、policy、成本與 escalation trace。

### 關鍵設計決定

- 30-case corpus 固定版本、stratum 與 expected outcome。
- deterministic lane 每次 PR 跑；live lane 定期跑並保存 observed_at。
- fixture server 注入 HTTP/content failure；Toxiproxy 注入 transport failure。
- outcome label 與 failure tags 分離。
- gate 以 deterministic hard invariant 加 live rolling baseline 組成。

### 限制 / 已知問題

- 沒有三條 live channel 的憑證／endpoint，因此沒有結果。
- Auth 與 blocking probes 必須用專用測試帳號與允許自動化的站點。
- Citation support judge 仍需人工抽查。

## 待解問題

- 取得三條 live channel 的測試設定後，保存 raw JSONL、corpus version、region、timestamp 與成本資料。
- 先跑足 baseline window，再把文章中的示範 threshold 改成實際 gate。
