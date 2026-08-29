---
title: "Agent 搜尋品質怎麼驗收：Web Retrieval Benchmark 實作"
date: 2026-08-21
category: ai
type: deep-dive
tags: [web-search, web-scraping, ai-agent, retrieval, benchmark]
lang: zh-TW
series:
  name: "搜尋與爬取實戰"
  order: 8
tldr: "Web retrieval 要測的是完整 task，不是 HTTP 200：固定 30 題、五種失敗層、三條 live channel，同時量答案、引用、freshness、延遲、成本與不必要升級。本文交付可執行 harness 與 gate，但因目前沒有三條 live channel 設定，不提供虛構排名。"
description: "用 30-case corpus 建立 Web Retrieval Benchmark：ground truth、freshness window、outcome labels、內容與引用評分、latency/cost/escalation metrics、deterministic fixtures、live probes、failure injection 與 regression gates。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-21-web-retrieval-benchmark-en)

> **已發布的 benchmark 規格。** 30 個固定案例與 harness 已定義，但目前環境沒有三條 live channel 所需的 endpoint／credential，因此本文沒有成功率、延遲、成本或供應商排名。第一份結果要等 raw results 跑完並保存後再補。

[系列上一篇](/posts/ai/2026-08-21-web-retrieval-fallback-routing)已經定義 Search、Fetch、Crawler、Browser 與受控 stealth 路徑怎麼切換。接下來的問題不是再畫一次流程圖，而是：**怎麼證明這套路由真的找得到、讀得對、引得準，而且不會為了一頁資料花掉整份預算？**

Web retrieval 的測試單位應該是完整 task。HTTP `200` 只能證明某次 request 收到回應，不能證明正文可用、答案符合題目、引用支持主張、內容仍在 freshness window 內，或 router 沒有做多餘升級。

## 先定義什麼叫通過

每個 task 都要同時回答五件事：

1. **Outcome**：完成、部分完成、正確拒絕，還是錯誤／逾時？
2. **Content**：應找到的 key facts 找到了多少？
3. **Citation**：引用 URL 是否可追，引用內容是否真的支持 claim？
4. **Freshness**：使用的 representation 在該 task 的有效期限內嗎？
5. **Efficiency**：花了多少時間、金額、request 與 escalation？

不要把五項壓成一個總分。總分會讓「引用完全錯，但速度很快」和「答案正確，只慢一些」互相抵銷。CI gate 應先擋 hard failure，再用 metrics 比較可接受的取捨。

## 30 題 corpus：五層各六題

Corpus 不能全是容易抓的公開靜態頁。最低配置是五個 strata：已知 URL、搜尋發現、動態頁面、登入狀態、封鎖與網路失敗。每層六題，共 30 題。題目文字固定；live run 只更新觀測時間與允許變動的 ground truth。

下面這份 YAML 就是 fixture spec。`fixture://` 由本地測試 server 解析；同一個 case 在 live lane 會依 `live_channel` 換成允許探測的公開 URL 或專用測試站。Auth 與 blocking 題不得指向未授權的第三方帳號或站點。

```yaml
version: web-retrieval-v1
live_channels:
  - { id: direct-fetch, adapter: fetch, required: true }
  - { id: search-api, adapter: search, required: true }
  - { id: browser, adapter: browser, required: true }
cases:
  - { id: K01, stratum: known-url, query: "Extract the published date", fixture: "fixture://known/static", live_channel: direct-fetch, expect: success }
  - { id: K02, stratum: known-url, query: "Follow the permanent redirect and cite the canonical page", fixture: "fixture://known/redirect", live_channel: direct-fetch, expect: success }
  - { id: K03, stratum: known-url, query: "Read the linked PDF and identify its title", fixture: "fixture://known/document.pdf", live_channel: direct-fetch, expect: success }
  - { id: K04, stratum: known-url, query: "Return the current version using cache validation", fixture: "fixture://known/etag", live_channel: direct-fetch, expect: success }
  - { id: K05, stratum: known-url, query: "Find the replacement for this removed page", fixture: "fixture://known/gone", live_channel: search-api, expect: success }
  - { id: K06, stratum: known-url, query: "Explain why this unsupported media cannot be read", fixture: "fixture://known/binary", live_channel: direct-fetch, expect: correct-refusal }
  - { id: S01, stratum: search, query: "Find the official HTTP caching specification", fixture: "fixture://search/exact", live_channel: search-api, expect: success }
  - { id: S02, stratum: search, query: "找出台灣官方的颱風警報來源", fixture: "fixture://search/zh-tw", live_channel: search-api, expect: success }
  - { id: S03, stratum: search, query: "Find today's release note for the fixture product", fixture: "fixture://search/fresh", live_channel: search-api, expect: success }
  - { id: S04, stratum: search, query: "Find two independent primary sources for the fixture claim", fixture: "fixture://search/diverse", live_channel: search-api, expect: success }
  - { id: S05, stratum: search, query: "Find the nonexistent RFC 99999", fixture: "fixture://search/no-result", live_channel: search-api, expect: correct-refusal }
  - { id: S06, stratum: search, query: "Deduplicate the syndicated copies and cite the origin", fixture: "fixture://search/duplicates", live_channel: search-api, expect: success }
  - { id: D01, stratum: dynamic, query: "Read content rendered after JavaScript starts", fixture: "fixture://dynamic/js-shell", live_channel: browser, expect: success }
  - { id: D02, stratum: dynamic, query: "Wait for the delayed API result", fixture: "fixture://dynamic/delayed", live_channel: browser, expect: success }
  - { id: D03, stratum: dynamic, query: "Collect all six items from infinite scroll", fixture: "fixture://dynamic/scroll", live_channel: browser, expect: success }
  - { id: D04, stratum: dynamic, query: "Dismiss consent and read the visible article", fixture: "fixture://dynamic/consent", live_channel: browser, expect: success }
  - { id: D05, stratum: dynamic, query: "Reject the 200 response that renders a soft 404", fixture: "fixture://dynamic/soft-404", live_channel: browser, expect: correct-refusal }
  - { id: D06, stratum: dynamic, query: "Extract the price despite randomized DOM ids", fixture: "fixture://dynamic/unstable-dom", live_channel: browser, expect: success }
  - { id: A01, stratum: auth, query: "Read the authorized account fixture", fixture: "fixture://auth/valid", live_channel: browser, expect: success }
  - { id: A02, stratum: auth, query: "Detect the expired session without looping", fixture: "fixture://auth/expired", live_channel: browser, expect: correct-refusal }
  - { id: A03, stratum: auth, query: "Report that the current role lacks access", fixture: "fixture://auth/forbidden", live_channel: browser, expect: correct-refusal }
  - { id: A04, stratum: auth, query: "Detect a login form returned with HTTP 200", fixture: "fixture://auth/login-200", live_channel: browser, expect: correct-refusal }
  - { id: A05, stratum: auth, query: "Keep user A content out of user B cache", fixture: "fixture://auth/cache-isolation", live_channel: browser, expect: success }
  - { id: A06, stratum: auth, query: "Read the form but do not submit the destructive action", fixture: "fixture://auth/no-write", live_channel: browser, expect: success }
  - { id: B01, stratum: blocking, query: "Respect Retry-After and retrieve the page", fixture: "fixture://blocking/429", live_channel: direct-fetch, expect: success }
  - { id: B02, stratum: blocking, query: "Recover from one temporary 503", fixture: "fixture://blocking/503", live_channel: direct-fetch, expect: success }
  - { id: B03, stratum: blocking, query: "Identify the challenge page without citing it", fixture: "fixture://blocking/challenge", live_channel: browser, expect: correct-refusal }
  - { id: B04, stratum: blocking, query: "Stop after a policy-denied 403", fixture: "fixture://blocking/403", live_channel: direct-fetch, expect: correct-refusal }
  - { id: B05, stratum: blocking, query: "Recover after a connection reset", fixture: "fixture://blocking/reset", live_channel: direct-fetch, expect: success }
  - { id: B06, stratum: blocking, query: "Report the legal restriction without bypassing it", fixture: "fixture://blocking/451", live_channel: direct-fetch, expect: correct-refusal }
```

真正的 fixture 還要為每題補 `expected_facts`、`allowed_sources`、`forbidden_actions`、`freshness_window_s` 與 `max_budget`。上面先把 30 個 task identity 鎖住，避免不同版本換題後還拿分數硬比。

## Ground truth 不是一份永遠不變的答案

靜態 fixture 的 ground truth 可以鎖 content hash；live page 不行。每筆 truth 應該帶：

```yaml
case_id: S03
valid_at: 2026-08-21T00:00:00Z
freshness_window_s: 86400
expected_facts:
  - { id: release-version, value: "v3.2", match: exact }
allowed_sources:
  - "https://vendor.example/releases/*"
forbidden_actions: [use-stale-cache, cite-search-snippet]
adjudicated_by: human
```

`valid_at` 表示人工確認 ground truth 的時間；`freshness_window_s` 是這道題允許多舊，不是所有網頁共用的 TTL。版本文件可以容忍幾天，今日公告不能。

[RFC 9111](https://www.rfc-editor.org/rfc/rfc9111.html)把 fresh、stale 與 validation 分開：response 的 age 超過 freshness lifetime 後，通常要經過 validation 才能再用。Benchmark 可以借用這個模型，但 task 的 freshness SLA 仍由產品定義。若來源提供 `ETag` 或 `Last-Modified`，raw trace 要保存 conditional request 與 `304`；否則無法分辨「真的重驗證」和「直接拿舊 cache」。

Ground truth 更新要走 review。更新 facts 時保留前一版、變更理由與 evidence URL；不能因為 system 答錯，就把 truth 改成它的答案。

## Outcome label 要互斥，failure tag 可以複數

每次 task 只有一個 `primary_label`：

| Label | 意義 |
|---|---|
| `success` | 必要 facts、citation、freshness 與 policy 全部通過 |
| `partial` | 有可用內容，但漏掉必要 fact 或引用 |
| `correct_refusal` | 因權限、政策、找不到或不支援而正確停止 |
| `incorrect` | 內容與 truth 衝突，或把錯誤頁當答案 |
| `stale` | 答案曾正確，但超出 freshness window 且未重驗證 |
| `policy_violation` | 做了 forbidden action、跨 auth scope 或不當繞過 |
| `timeout` | 超過 task deadline |
| `budget_exhausted` | 在 deadline 前用完 cost/request/escalation 預算 |
| `infra_error` | Benchmark 自己壞掉，不能算被測系統失敗 |

另外附多個 `failure_tags`，例如 `empty-body`、`citation-mismatch`、`unnecessary-browser`、`auth-loop`、`cache-leak`。Primary label 給 gate，tags 給 root-cause 分析；不要用 exception message 當 label，否則同一錯誤會產生幾百種字串。

## 分數：答案與引用分開算

內容品質至少拆成三個值：

- `fact_coverage = matched_required_facts / required_facts`
- `citation_coverage = facts_with_a_citation / matched_facts`
- `citation_support = supported_cited_claims / checked_cited_claims`

Citation checker 要先抓 citation URL 在 `retrieved_at` 時的 representation，再判斷它是否支持鄰近 claim。只檢查 URL 能不能開，會把「連到官方首頁但沒有那句話」算成正確引用。反過來，內容支持 claim 但 URL 來自未允許的鏡像，也應在 provenance gate 失敗。

W3C 的 [PROV-O](https://www.w3.org/TR/prov-o/)以 Entity、Activity、Agent 表示不同系統產生的 provenance。Harness 不必真的存成 RDF，但資料模型至少要保留：哪個 retrieval run（Activity）、哪個 adapter/provider（Agent）、產生了哪份 representation 與 claim（Entity），以及兩者的 derivation 關係。

Citation support 若由 LLM 判定，先固定 prompt 與 model version，再對每次變更抽樣人工 adjudication。模型判分不能成為不留原文的理由；raw representation、claim span 與判定理由都要保存。

## Metrics：不要只報平均延遲

每個 task 保存完整 attempt trace，再聚合：

| 面向 | Metrics |
|---|---|
| 結果 | success／correct-refusal rate，依 stratum 分組 |
| 品質 | fact coverage、citation coverage、citation support、freshness pass rate |
| 延遲 | end-to-end p50／p95、各 adapter duration、time to first usable source |
| 成本 | provider 金額、request 數、browser seconds、cost per successful task |
| 路由 | escalation rate、escalation depth、unnecessary escalation rate、cache hit/revalidate rate |

OpenTelemetry 的 [HTTP metrics semantic conventions](https://opentelemetry.io/docs/specs/semconv/http/http-metrics/)把 `http.client.request.duration` 定義成秒，並要求收到回應時記 status、失敗時記可預測且低基數的 `error.type`。沿用這些名稱，能避免 fetch、search SDK 與 browser network log 各發明一套欄位。

`unnecessary_escalation` 的判定必須靠 fixture：如果便宜 adapter 已經產生符合 truth 的 representation，之後又啟動 browser，就記一次。Live lane 無法永遠知道「不升級是否也會成功」，所以只報 observed escalation，不把它自動定罪。

## Deterministic lane 與 live lane 都要有

**Deterministic lane** 每次 PR 跑完整 30 題。本地 fixture server 固定 status、headers、body、redirect、cookie 與 clock；browser 題用 network interception 或 HAR replay。Playwright 的 [Mock APIs 文件](https://playwright.dev/docs/mock)說明 HAR 可以記錄 request/response、cookies、content 與 timings，再由 `routeFromHAR()` 重播；matching 會看 URL 與 method，POST 也會比 payload。

它適合抓 routing regression，但不能證明今天的搜尋索引、網站 DOM 或封鎖策略仍然相同。

**Live lane** 至少啟用三條 channel：direct HTTP fetch、search API、browser automation。固定 region、user agent、provider config 與 corpus version，在排程中重複執行；每次保存 `observed_at`，不覆寫上一輪。Auth lane 只用專用測試帳號，blocking lane 只打明確允許 automation 的測試 origin。

Live failure 要先分 `system_failure` 和 `probe_invalid`。例如目標頁已刪除但 ground truth 沒更新，屬於 probe invalid，不應直接算 router regression；先重新 adjudicate case。

## Failure injection 要涵蓋 transport 與內容層

只 mock status 不夠。Fixture server 負責語意層失敗：

- `200` + 空正文、soft 404、登入表單、challenge body
- redirect loop、跨 origin redirect、stale `ETag`
- `401`、`403`、`404`、`429` + `Retry-After`、`503`、`451`
- session 到期、role 不足、auth cache isolation

Transport failure 交給 [Toxiproxy](https://github.com/Shopify/toxiproxy)。它的官方 repository 提供 latency、timeout、`reset_peer`、bandwidth 與 packet loss，可從 CI 明確重現「慢」「斷線」與「連線被重設」，不必等真實網路剛好出錯。

每個 injected failure 都要驗兩件事：最後 outcome 對不對，以及 attempt trace 有沒有違反上限。只看最後成功，可能漏掉前面已經打了二十次 request。

## Harness pseudocode

這段 control flow 可以直接改成 TypeScript runner。被測系統只接收 task 與 channel config；grader 不讀它的內部 verdict，避免 system 自己說成功就算成功。

```ts
for (const lane of ["fixture", "live"] as const) {
  assert(lane !== "live" || configuredLiveChannels().length >= 3);

  for (const task of corpus.cases) {
    const truth = truthStore.resolve(task.id, clock.now());
    const trace = await recorder.capture(() =>
      system.retrieve({ task, lane, deadline: task.max_deadline_ms })
    );

    const representation = await archive.finalRepresentation(trace);
    const facts = gradeFacts(representation, truth.expected_facts);
    const citations = await gradeCitations({
      answer: trace.answer,
      archivedSources: trace.sources,
      allowedSources: truth.allowed_sources,
    });
    const freshness = gradeFreshness(trace, truth.valid_at, truth.freshness_window_s);
    const policy = gradeForbiddenActions(trace, truth.forbidden_actions);

    const result = classifyPrimaryOutcome({ trace, facts, citations, freshness, policy });
    await writeJsonl("raw/results.jsonl", {
      corpus_version: corpus.version,
      lane,
      task_id: task.id,
      observed_at: clock.now().toISOString(),
      result,
      metrics: aggregateTrace(trace),
      provenance: archive.manifest(trace),
    });
  }
}

const report = aggregateByStratum(readJsonl("raw/results.jsonl"));
applyRegressionGates(report, loadBaseline("baseline.json"));
```

輸出目錄至少保存 `results.jsonl`、逐頁 representation hash、citation snapshots、attempt spans、corpus version、runner commit、region 與 provider config fingerprint。秘密金鑰只存 reference，不能進 artifact。

## Regression gate：hard invariant 加 rolling baseline

在第一次 live run 前，門檻只能是示範值，不能假裝已經校準。建議先把 gate 分兩層：

**Deterministic hard gate：**

- `policy_violation`、auth cache leak、destructive action 必須是 0。
- 30 題 fixture 不得出現 `infra_error`。
- 每個 case 的 primary label 必須等於 manifest 的 `expect`。
- retry、deadline、crawl depth 與 escalation cap 不得超標。

**Live rolling gate：**

- 先累積多輪 baseline，再比較相同 corpus、region 與 config。
- success、citation support、p95 latency 與 cost 分開設門檻。
- 單一 probe invalid 先隔離，不直接改 baseline。
- 品質下降不能用成本下降抵銷；policy violation 也不能用成功率抵銷。

示範 policy 可以把 success rate 下降 5 個百分點、p95 增加 20%、cost per success 增加 15% 設成 review gate，但這些數字不是本文的實測結論。正式值要等 live raw results 累積後，依產品 SLA 與波動重新設定。

## 怎麼讀取捨，而不是硬排第一名

報告先按 stratum 切開。某套配置可能在 known URL 最快，卻在 dynamic lane 大量逾時；另一套 success 較高，但每題都啟動 browser。只看全體平均會把這些差異沖掉。

比較時先畫三組 Pareto 關係：品質對 latency、品質對 cost、success 對 escalation。若配置 A 在所有軸都不比 B 好，A 才算被支配；其餘情況是產品取捨，不是通用冠軍。

最後逐筆看 failure tags。Benchmark 的價值不是產生一個漂亮分數，而是讓 regression 能回答「哪一層、哪一種頁面、哪個失敗訊號開始退步」。目前這份文章先把 30 題與 harness 鎖定；等三條 live channel 可用、raw artifacts 保存完成後，再發布第一份結果。

## 參考資料

- [RFC 9111: HTTP Caching](https://www.rfc-editor.org/rfc/rfc9111.html)
- [OpenTelemetry：HTTP metrics semantic conventions](https://opentelemetry.io/docs/specs/semconv/http/http-metrics/)
- [Playwright：Mock APIs and HAR replay](https://playwright.dev/docs/mock)
- [Shopify Toxiproxy](https://github.com/Shopify/toxiproxy)
- [W3C PROV-O](https://www.w3.org/TR/prov-o/)
- [站內：AI Agent 上網取資料的 fallback 路由](/posts/ai/2026-08-21-web-retrieval-fallback-routing)
