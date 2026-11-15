---
title: "工具推薦｜Verdict — 197 KB 的本地分類器，戳破「exit code 0 就是成功」"
date: 2026-11-04
category: daily
type: digest
tags: [ai-agent, tool, daily, cli-tool]
lang: zh-TW
description: "開源的 197 KB 本地分類器，讀 command、exit code、stdout、stderr 四樣東西，判斷一次 CLI 工具呼叫到底是 success、failure、blocked 還是 unknown"
tldr: "Verdict 是一個 Apache-2.0 授權、197 KB 的本地分類器，讀指令、exit code、stdout、stderr 四項輸入，判斷一次 CLI 工具呼叫到底是 success、failure、blocked 還是 unknown。安裝：git clone 後在專案目錄跑 pip install .。解決了「exit code 0 不代表任務真的完成」的問題——在 48 個訓練時沒見過的 CLI 家族上測試，準確率 93.2%，純靠 exit code 判斷只有 47.9%。"
series:
  name: "AI Tool of the Day"
  order: 73
---

> 🌏 [English version](/posts/daily/2026-11-04-tool-verdict-en)

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | Verdict |
| 類型 | CLI／Python SDK（本地分類器） |
| GitHub | [Balanov/verdict](https://github.com/Balanov/verdict) |
| Stars | 223（撰文時） |
| 語言 | Python（純標準庫，無執行期相依） |
| 授權 | Apache-2.0（程式碼與模型權重）；訓練用合成資料另為 CC0-1.0 |
| 安裝 | `pip install .`（`git clone` 後在專案目錄下執行） |

## 解決什麼問題

你的 coding agent 跑完一個指令，接下來要不要重試、要不要停下來、能不能跟你說「完成了」，多半只看一個 bit：exit code 是不是 0。但 exit code 0 可能只是沒有任何測試被收集（`pytest` 找不到測試檔也會正常退出）、等著某個背景 worker、或是 API 回了 500 但 CLI 本身沒有把這個情況反映到退出碼上；反過來，非 0 退出碼也可能只是權限、依賴、網路這些環境問題擋住了執行，不是程式邏輯真的錯了。Agent 要先分清楚這兩種情況，才知道該重試、該停下來問人，還是真的可以往下走——但大多數 agent harness 目前判斷完成與否，用的就只有這一個 bit。

Verdict 把 command、exit_code、stdout、stderr 四項輸入一起餵進一個 197 KB 的 int8 量化邏輯回歸模型（特徵是雜湊過的字元 3–5-gram 與詞 1–3-gram），純 Python 標準庫推論，CPU 上中位數 0.54 毫秒，沒有網路呼叫，也沒有遙測。輸出四個類別之一：`success`、`failure`、`blocked`、`unknown`，附機率分布。作者在 README 和 Hugging Face model card 裡反覆強調這是「顧問式分類」（advisory），不是任務完成的權威證明，也不該單獨拿來授權破壞性動作或宣告關鍵工作完成——exit code、確定性驗證器、權威的環境狀態檢查，仍然要留著當最終依據。

```diagram
title: Verdict 怎麼把一次工具呼叫分類成 4 種結果
desc: 指令、exit code、stdout、stderr 四個輸入一起餵進 197 KB 的本地分類器，吐出 success、failure、blocked、unknown 四個標籤之一；這裡示範的 pytest 範例因為沒有測試被收集，分類器判定為 unknown，不是 success。
caption: 簡化示意：省略雜湊特徵抽取與機率輸出細節。
---
<svg viewBox="0 0 560 280">
  <path class="dg-line" d="M170 44H190" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M170 108H190" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M170 172H190" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M170 236H190" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M350 44H370" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M350 108H370" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M350 172H370" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M350 236H370" marker-end="url(#arrow)"/>

  <rect class="dg-box" x="20" y="20" width="150" height="48" rx="6"/>
  <text class="dg-label" x="95" y="38" text-anchor="middle" dominant-baseline="central">指令</text>
  <text class="dg-sub" x="95" y="56" text-anchor="middle" dominant-baseline="central">pytest tests/</text>

  <rect class="dg-box" x="20" y="84" width="150" height="48" rx="6"/>
  <text class="dg-label" x="95" y="102" text-anchor="middle" dominant-baseline="central">Exit code</text>
  <text class="dg-sub" x="95" y="120" text-anchor="middle" dominant-baseline="central">0</text>

  <rect class="dg-box" x="20" y="148" width="150" height="48" rx="6"/>
  <text class="dg-label" x="95" y="166" text-anchor="middle" dominant-baseline="central">stdout</text>
  <text class="dg-sub" x="95" y="184" text-anchor="middle" dominant-baseline="central">no tests ran</text>

  <rect class="dg-box" x="20" y="212" width="150" height="48" rx="6"/>
  <text class="dg-label" x="95" y="230" text-anchor="middle" dominant-baseline="central">stderr</text>
  <text class="dg-sub" x="95" y="248" text-anchor="middle" dominant-baseline="central">（空）</text>

  <rect class="dg-box dg-box--accent" x="190" y="20" width="160" height="240" rx="6"/>
  <text class="dg-label" x="270" y="131" text-anchor="middle" dominant-baseline="central">Verdict 分類器</text>
  <text class="dg-sub" x="270" y="151" text-anchor="middle" dominant-baseline="central">197 KB・CPU・&lt;1ms</text>

  <rect class="dg-box" x="370" y="20" width="150" height="48" rx="6"/>
  <text class="dg-label" x="445" y="38" text-anchor="middle" dominant-baseline="central">success</text>
  <text class="dg-sub" x="445" y="56" text-anchor="middle" dominant-baseline="central">有正面完成證據</text>

  <rect class="dg-box" x="370" y="84" width="150" height="48" rx="6"/>
  <text class="dg-label" x="445" y="102" text-anchor="middle" dominant-baseline="central">failure</text>
  <text class="dg-sub" x="445" y="120" text-anchor="middle" dominant-baseline="central">回報具體失敗</text>

  <rect class="dg-box" x="370" y="148" width="150" height="48" rx="6"/>
  <text class="dg-label" x="445" y="166" text-anchor="middle" dominant-baseline="central">blocked</text>
  <text class="dg-sub" x="445" y="184" text-anchor="middle" dominant-baseline="central">被環境擋住</text>

  <rect class="dg-box dg-box--accent" x="370" y="212" width="150" height="48" rx="6"/>
  <text class="dg-label" x="445" y="230" text-anchor="middle" dominant-baseline="central">unknown</text>
  <text class="dg-sub" x="445" y="248" text-anchor="middle" dominant-baseline="central">證據不足</text>
</svg>
```

適合的場景：裝進 coding agent 的 harness，在 agent 準備重試、停下，或是跟你回報「完成了」之前，多加一層語意檢查；或是裝進 CI 的 observability 層，抓出「測試套件其實一條都沒跑」卻顯示 exit 0 綠燈這種情況。不適合單獨拿來做安全或正確性判斷——它只分類「這次呼叫的證據長什麼樣」，不判斷程式碼對不對、安不安全。

## 快速上手

### 安裝

```bash
git clone https://github.com/Balanov/verdict.git
cd verdict
python -m pip install .
```

### 基本用法

```python
from verdict_tiny import Verdict

model = Verdict()
result = model.predict(
    command="pytest tests/",
    exit_code=0,
    stdout="collected 0 items\nno tests ran in 0.01s",
)
print(result)
```

```json
{
  "label": "unknown",
  "confidence": 0.999981,
  "probabilities": {
    "success": 0.000019,
    "failure": 0.0,
    "blocked": 0.0,
    "unknown": 0.999981
  },
  "advisory": true
}
```

也有現成的 CLI，從 stdin 讀輸出：

```bash
printf 'collected 0 items\nno tests ran\n' | verdict \
  --command 'pytest tests/' --exit-code 0
```

### 進階用法

模型、訓練語料和訓練腳本全部公開（合成資料用 CC0 授權），可以整套重跑一遍，自己驗證 93.2% 這個數字，或換自己的語料重新訓練：

```bash
python -m pip install -e '.[train,dev]'
python training/train.py
pytest -q
```

`training/train.py` 會重新產生公開語料、從零訓練、輸出 int8 權重，並重跑一次 benchmark 寫進 `bench/results.json`。

## 與現有工具的比較

| | Verdict | 純 exit code | LLM-as-judge（另外打一次大模型判斷輸出） |
|---|---|---|---|
| 推論成本 | 197 KB、CPU、中位數 0.54ms，零 API 呼叫 | 幾乎零成本，但資訊量只有一個 bit | 每次判斷都要多打一次 LLM API，有延遲也有費用 |
| 準確率（48 個訓練時沒見過的 CLI 家族） | 93.2% | 47.9% | 沒有在同一個 benchmark 上比較過，依所用模型與 prompt 而定 |
| 離線、零遙測 | ✅ 不打網路 | ✅ | ❌ 依賴外部 API |
| 訓練語料與腳本可重現 | ✅ 公開（CC0），`python training/train.py` 重跑一遍 | — | 多數為黑箱，無法自行重現 |
| 輸出標籤 | 4 類：success／failure／blocked／unknown，附機率 | 2 類：0／非 0 | 依 prompt 自訂，沒有標準化的輸出契約 |

## 注意事項

- **目前是 research preview，不是正式版**：pyproject 裡標示 `Development Status :: 3 - Alpha`，訓練與測試語料都是程式生成的合成資料（訓練 1,440 筆、測試 192 筆，各來自 60／48 個 CLI 家族），且偏英文。作者在 README 明寫「尚未在真實的 production agent trace 上驗證」，93.2% 是「跨模板泛化」的量測，不是「生產環境可靠度」的保證——真的要用在自己的 harness 裡，最好先拿自己的真實 log 跑一輪再決定門檻。
- **機率沒有校準過**：README 明寫這些機率「不是安全關鍵場景下該信任的校準信心值」。不要只因為某個標籤的機率數字看起來高，就自動觸發重試、回滾或其他有副作用的動作。
- **它只分類證據長什麼樣，不判斷對不對、安不安全**：model card 的 out-of-scope 清單列得很清楚——不涉及一般任務完成度判斷、不涉及程式碼正確性、不涉及安全或政策執行，也不是給非 CLI 的一般自然語言文本分類用的。

## 今日收穫

Exit code 本質上只編碼了一個 bit（0／非 0），但 agent 真正要分辨的是至少四種情境——這中間的語意落差，原來不需要另外接一次雲端 LLM 才能補。一個 197 KB、純標準庫、CPU 上跑不到 1 毫秒的小模型，就把準確率從 47.9% 拉到 93.2%。這提醒我們：很多 agent harness 的「完成判斷層」目前粗糙到只剩一個 bit，而補齊這一層不一定要往更重的方向加依賴（再打一次 LLM、接一個觀測平台），反而可以往更輕量的方向做，換來的是零延遲、零費用、可以離線稽核。

## 參考資料

- [Balanov/verdict — GitHub](https://github.com/Balanov/verdict)
- [Verdict README](https://github.com/Balanov/verdict/blob/main/README.md)
- [Verdict — Hugging Face model card](https://huggingface.co/BalanovAN/verdict)
- [bench/results.json（benchmark 原始數據）](https://github.com/Balanov/verdict/blob/main/bench/results.json)
- [LICENSE（Apache-2.0，程式碼與權重）](https://github.com/Balanov/verdict/blob/main/LICENSE)
- [data/LICENSE（CC0-1.0，合成訓練資料）](https://github.com/Balanov/verdict/blob/main/data/LICENSE)
- [Verdict 研究頁與瀏覽器 demo](https://balanov.pro/research/verdict/)
