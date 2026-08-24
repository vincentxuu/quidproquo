---
title: "資安警報｜Xinference 用 eval() 解析 LLM 工具呼叫——CVSS 10.0 未認證 RCE（CVE-2026-61539）"
date: 2026-08-24
category: daily
tags: [ai-agent, security, daily, prompt-injection]
lang: zh-TW
description: "開源推論伺服器 Xinference 在解析 Llama3 工具呼叫輸出時直接對模型產生的字串呼叫 Python eval()，攻擊者只要能影響模型輸出（一句 prompt 就夠），就能在預設不開驗證的部署上取得伺服器層級任意指令執行"
tldr: "Xinference（Xorbits Inference）2.5.0 及以前版本，在解析 Llama3 工具呼叫輸出時對模型產生的字串直接呼叫 eval(model_output, {}, {})，官方一度以為傳空字典就是安全沙箱，但空 globals/locals 仍能透過 `().__class__.__bases__` 這類物件反射鏈拿到內建函式，等於完全沒有隔離。攻擊者只要透過 prompt injection 讓模型吐出一段 Python 表達式，打向預設不開驗證的 `/v1/chat/completions` 端點就能取得伺服器行程層級的任意指令執行，CVSS v3.1 滿分 10.0，已在 2.7.0 修補（CVE-2026-61539）。防禦：立即升級、若無法升級則開啟驗證並停用 Llama3 工具呼叫，長期則是把「模型輸出」永遠當成不可信輸入，用 json.loads／ast.literal_eval 取代任何形式的 eval。"
series:
  name: "AI Security Alert"
  order: 10
---

## 事件概述

開源推論伺服器 Xinference（Xorbits Inference，用來自架部署 LLM、語音與多模態模型的 OpenAI 相容 API 伺服器）被揭露一個嚴重程度滿分的遠端程式碼執行漏洞，追蹤編號 **CVE-2026-61539**。問題出在解析 Llama3 模型工具呼叫（tool call）輸出的程式碼裡：模型產生的字串被直接丟進 Python 的 `eval()`。由於模型輸出可以被攻擊者透過 prompt 影響，而 Xinference 的測試部署預設不開身份驗證，這代表任何打得到 `/v1/chat/completions` 端點的人，理論上都能在伺服器行程裡執行任意指令。漏洞已在 2.7.0 版修補。

**基本資訊**

| 項目 | 值 |
|---|---|
| 事件類型 | Eval Injection（CWE-95），經 prompt injection 觸發的未認證 RCE |
| 影響範圍 | Xinference（xorbitsai/inference）<= 2.5.0，使用 Transformers 後端且請求帶 `tools` 欄位（Llama3 工具呼叫解析路徑） |
| 嚴重程度 | Critical（CVSS v3.1 10.0，AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H） |
| CVE | CVE-2026-61539 |
| 來源 | [GitHub Security Advisory GHSA-x2rj-828p-hx9m](https://github.com/xorbitsai/inference/security/advisories/GHSA-x2rj-828p-hx9m)、[CVE Record — CVE.org](https://www.cve.org/CVERecord?id=CVE-2026-61539)、[OSV.dev 漏洞資料庫](https://osv.dev/vulnerability/CVE-2026-61539) |

## 攻擊面分析

Xinference 提供與 OpenAI 相容的 `/v1/chat/completions` API。當請求帶有 `tools` 欄位、且模型後端是 Transformers 時，回應會經過 `xinference/model/llm/transformers/core.py` 的 `handle_chat_result_non_streaming()`，再交給 `_post_process_completion()` 做工具呼叫解析。Llama3 的解析器 `llama3_tool_parser.py` 裡，`extract_tool_calls()` 用這一行把模型輸出的字串轉成 Python 物件：

```python
data = eval(model_output, {}, {})
```

意圖是把模型吐出的「看起來像字典」的字串轉成真的 dict，但 `eval()` 執行的是任意 Python 表達式，傳空的 `{}`、`{}` 當 globals／locals 並不構成沙箱——透過 `().__class__.__bases__[0].__subclasses__()` 這類物件反射鏈，仍然能摸到內建函式，等於完全沒有隔離。也就是說，只要能讓模型輸出變成類似 `__import__('os').system('...')` 的字串，這段程式碼就會在伺服器行程裡把它當指令執行。而「讓模型輸出變成攻擊者想要的字串」正是 prompt injection 的定義：攻擊者不需要碰到伺服器本身，只需要送一段能誘導模型吐出惡意表達式的 prompt。疊加 Xinference 測試部署預設不開身份驗證，`/v1/chat/completions` 對外可達時，整條攻擊鏈就收斂成「送一個 HTTP 請求」。

同一套 `eval(text, {}, {})` 模式其實不只出現在這一處——同一份程式碼庫的 `utils.py`（`_eval_llama3_chat_arguments()`）與部分 OCR／多模態座標解析路徑（如 `deepseek_ocr.py`）也用了一樣的手法，社群在今年 2 月就有人在 issue 中指出「傳空字典不是安全防護」，但直到這次正式的資安公告才收斂成 CVE 並修補。

對照 OWASP LLM Top 10，這是 **LLM01 Prompt Injection** 作為攻擊入口，撞上 **LLM02 Insecure Output Handling**（把模型輸出未經驗證直接送進危險的下游 sink）——這正是 OWASP 對 LLM02 給出的教科書案例：模型輸出被當成可信任的程式碼或指令，而不是不可信任的字串。

## 防禦做法

**立即動作**
- 確認 Xinference 版本：`pip show xinference` 或檢查部署所用的 image tag，< 2.7.0 者立即升級
- 若暫時無法升級：在對外或跨網段可達的部署上開啟 Xinference 的身份驗證，讓 `/v1/chat/completions` 不再是完全未認證可打；並暫時避免對 Llama3 系列模型送出帶 `tools` 欄位的請求，因為漏洞只在工具呼叫後處理路徑觸發
- 盤點所有自架的 Xinference 實例，尤其是網際網路或內部網路廣泛可達、且開放 Llama3 工具呼叫功能的部署，優先處理

**長期架構**
- 把「模型輸出」在你自己的程式碼裡永遠當成不可信輸入，任何要把模型輸出的字串轉成結構化資料的地方，用 `json.loads()` 或 `ast.literal_eval()`（只能解析字面量，遇到函式呼叫、屬性存取一律拋錯）取代 `eval()`——這也是官方修補 PR 實際採用的做法
- 讓推論伺服器行程以低權限、沙箱化或容器化身份執行，即使某條解析路徑再出包，也把 RCE 的影響半徑限制在容器內
- 導入 watchlist B7 中做模型與 Agent 執行期防護的工具（如 **HiddenLayer**、**Protect AI** 的模型／推論安全掃描，或 **Lakera** 的 prompt injection 偵測）為「模型輸出可能已被污染」這件事補上執行期防線，而不是只依賴程式碼審查抓出下一個 eval

## 影響範圍

Xinference 是相當常見的自架開源推論伺服器，用來統一部署與管理開源 LLM、語音與多模態模型並提供 OpenAI 相容 API，常見於企業內部或個人自架的模型服務環境。由於漏洞觸發條件只需要「送一個帶 `tools` 欄位的請求給 Llama3 模型」，且測試部署預設未開驗證，公開資料顯示尚未列入 CISA KEV、也沒有已知在野利用的公開 PoC，但漏洞細節（包含具體的繞過表達式與程式碼路徑）已隨公告完整公開，攻擊門檻不高。如果你的 Agent 系統或內部工具串接了自架的 Xinference 服務並使用工具呼叫功能，應優先確認版本與網路可達範圍；即使你用的不是 Xinference，這次事件也值得拿來檢查自己的程式碼裡有沒有類似「模型輸出字串直接丟進 eval／exec」的模式。

## 今日收穫

這起事件把「prompt injection」和「不安全的程式碼執行」兩個原本分開討論的風險直接串成一條攻擊鏈：過去我們常把 prompt injection 的危害框在「讓模型說錯話」或「洩漏資訊」，但只要下游有一行 `eval(model_output)`，prompt injection 就能一步到位變成伺服器層級 RCE，而且攻擊者完全不需要碰到任何傳統意義上的「漏洞」——程式碼邏輯本身就是漏洞。評估任何把模型輸出進一步程式化處理的系統時，「模型輸出最終流向哪個 sink」和「輸入驗證做得夠不夠」一樣重要。

## 參考資料

- [Remote code execution via unsafe eval() in Llama3 tool-call parsing — GitHub Security Advisory GHSA-x2rj-828p-hx9m](https://github.com/xorbitsai/inference/security/advisories/GHSA-x2rj-828p-hx9m)
- [CVE Record: CVE-2026-61539 — CVE.org](https://www.cve.org/CVERecord?id=CVE-2026-61539)
- [CVE-2026-61539 — OSV.dev](https://osv.dev/vulnerability/CVE-2026-61539)
- [fix: replace eval() with safe alternatives to prevent RCE in tool parsers — GitHub PR #4786](https://github.com/xorbitsai/inference/pull/4786)
- [Xinference CVE-2026-61539 分析 — vuln.today](https://vuln.today/cve/CVE-2026-61539)
