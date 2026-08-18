---
title: "Hermes Agent 的研究面：批次跑幾千條 prompt 產訓練資料，以及把它嵌進別的系統"
date: 2026-08-18
type: guide
category: ai
tags: [hermes-agent, trajectory, training-data, batch-processing, api-server, nous-research]
lang: zh-TW
series:
  name: "Hermes Agent 文件導讀"
  order: 11
tldr: "`batch_runner.py` 把數千條 prompt 平行跑成 ShareGPT 格式的 tool-calling trajectory，每條 prompt 可指定自己的容器映像，中斷後靠內容比對而非索引續跑。它內建兩道品質過濾：完全沒有 reasoning 的樣本丟掉、含幻覺工具名的條目在合併時剔除。這解釋了為什麼一家研究機構要做個人 agent——agent 本身就是資料產線。"
description: "Hermes Agent 的批次 trajectory 生成、toolset 分布抽樣、續跑與品質過濾機制，以及把 Hermes 當成 OpenAI 相容 API server 或 Python library 嵌入既有系統的兩條路徑。"
draft: false
---

系列第 11 篇。[導讀在這裡](/posts/ai/2026-08-18-hermes-agent-intro)。

前十篇都在講怎麼用 Hermes。這篇講一個不同的問題：**為什麼 Nous Research 這樣一家做模型的機構，要花力氣做一個個人 agent？**

答案在 README 那一列只有一句話的表格欄位：

> **Research-ready** — Batch trajectory generation, trajectory compression for training the next generation of tool-calling models.

也就是說，這個 agent 不只是產品，它同時是**訓練資料的產線**。理解這件事之後，前面幾篇看到的一些設計選擇會突然變得合理——為什麼工具要分成可抽樣的 toolset、為什麼 session 全存進 SQLite、為什麼 reasoning 的有無會被統計。

## `batch_runner.py`：把 agent 當成資料生成器

```bash
python batch_runner.py \
    --dataset_file=data/prompts.jsonl \
    --batch_size=10 \
    --run_name=my_first_run \
    --model=anthropic/claude-sonnet-4.6 \
    --num_workers=4
```

輸入是 JSONL，每行至少要有 `prompt`。**每條 prompt 跑一個完整的 agent session、有完整工具權限、各自隔離的環境**——這跟「拿模型批次補完文字」是完全不同的東西，產出的是帶工具呼叫的多輪軌跡。

輸出落在 `data/<run_name>/`：`trajectories.jsonl`（合併後的最終產物）、逐批的 `batch_N.jsonl`、`checkpoint.json`、`statistics.json`。

單筆 trajectory 長這樣（節錄）：

```json
{
  "prompt_index": 42,
  "conversations": [
    {"from": "human", "value": "Write a function..."},
    {"from": "gpt", "value": "I'll create that function...", "tool_calls": []},
    {"from": "tool", "value": "..."}
  ],
  "completed": true,
  "api_calls": 3,
  "toolsets_used": ["terminal", "file"],
  "tool_stats": {"terminal": {"count": 2, "success": 2, "failure": 0}},
  "tool_error_counts": {"terminal": 0}
}
```

`conversations` 是 ShareGPT 式的 `from`／`value` 結構。一個細節值得學：**`tool_stats` 會正規化成「所有可能的工具都在，沒用到的補零」**，官方寫明理由是確保跨條目 schema 一致，方便直接餵進 HuggingFace datasets。這是資料工程的考量而不是 agent 的考量——很清楚地說明了這個檔案是給誰用的。

## Toolset 分布：資料多樣性是抽樣抽出來的

每條 prompt 拿到的工具集不是固定的，而是從一個 **distribution** 隨機抽樣（`--list_distributions` 看有哪些）。

官方特別澄清了實作方式，這點容易被誤解：

> distributions assign a probability to **each individual toolset**. The sampler flips each toolset independently, then guarantees that at least one toolset is enabled.

也就是每個 toolset 各自擲一次硬幣，而不是從一張手寫的「預設組合表」裡挑。目的是讓訓練資料涵蓋多樣的工具組合——如果每條資料的工具集都一樣，模型學到的就是那一組工具的用法。

## 續跑：用內容比對，不是用索引

批次跑幾千條會斷，所以續跑機制是這個工具好不好用的關鍵。Hermes 的做法是：

1. 掃所有 `batch_*.jsonl` 找出已完成的 prompt——**用實際文字內容比對，不是用索引**
2. 從資料集裡濾掉已完成的
3. 重新分批、只跑剩下的
4. 完成時把新舊批次檔全部合併成最終 `trajectories.jsonl`

用內容比對的好處是**資料集順序變了也能正確續跑**（你中途補了幾條 prompt 進去，不會導致整批錯位重跑）。另外只有成功完成的 prompt 才會被標記為完成，失敗的會在續跑時重試。

這是我在這份文件裡最欣賞的一段設計：它假設「你的資料集會變」，而不是假設「你不會改」。

## 兩道品質過濾，發生在你看到資料之前

- **無 reasoning 過濾**：所有 assistant 回合都沒有 reasoning（沒有 `<REASONING_SCRATCHPAD>` 也沒有原生 thinking token）的樣本會被丟掉。
- **幻覺工具名過濾**：呼叫了不在有效工具清單裡的工具名，該條目在最終合併時被剔除。

第二道特別重要：**模型幻想出來的工具呼叫如果進了訓練資料，等於教下一代模型繼續幻想。** 這是 tool-calling 資料集特有的污染，而且用一般的「看起來很合理」人工抽查很難抓。

跑完會印出工具使用統計（各工具的呼叫數與成功／失敗率）、reasoning 覆蓋率、被丟棄的樣本數與總耗時，並存進 `statistics.json`。

## 每條 prompt 可以指定自己的容器

benchmark 型的資料集常常需要不同環境，這在 JSONL 裡直接標：

```jsonl
{"prompt": "Install numpy and compute eigenvalues of a 3x3 matrix", "image": "python:3.11-slim"}
{"prompt": "Compile this Rust program and run it", "image": "rust:1.75"}
{"prompt": "Set up a Node.js Express server", "image": "node:20-alpine", "cwd": "/app"}
```

支援 Docker、Modal 與 Singularity 後端（呼應[終端後端那篇](/posts/ai/2026-08-18-hermes-agent-terminal-backends)），而且**跑之前會先確認映像抓得到**——比跑到第 800 條才發現映像名打錯好得多。

成本面官方也講白了：批次跑會同時開很多 agent session，每個都在打模型與工具。這正是[前面談過的訂閱制](/posts/ai/2026-08-18-hermes-agent-tool-gateway)在這裡最有價值的場景——想要穩定的「每條 trajectory 成本」，比在五家廠商的限流之間拼湊容易。

## RL：Atropos

再往上一層是強化學習。官方的學習路徑裡有一條「I want to train models」，指向 Nous 自己的 RL 環境框架 [Atropos](https://github.com/NousResearch/atropos)——用 Hermes 產生的軌跡與環境互動來微調模型行為。

這條線在官方文件裡只有指路，細節都在 Atropos 那邊，所以本文不展開；要知道的是**它跟 batch runner 是同一條產線的上下游**：batch runner 產資料，Atropos 拿去訓練，訓練出來的模型再回頭當 agent 的大腦。

## 把 Hermes 嵌進別的系統：兩條路

研究之外，另一類「非互動使用」是把 Hermes 當成元件。

**其一，OpenAI 相容 API server。** 在 `~/.hermes/.env` 設 `API_SERVER_ENABLED=true` 與 `API_SERVER_KEY`，起 gateway 之後監聽 `http://127.0.0.1:8642`，任何講 OpenAI 格式的前端（Open WebUI、LobeChat、LibreChat、NextChat…）都能接。

關鍵在於**它不是單純代理模型**：請求會由你的 agent 帶著完整工具集（終端、檔案、網頁搜尋、記憶、技能）處理，串流時工具進度會 inline 顯示，前端因此看得到 agent 在做什麼。`/v1/chat/completions` 本身是**無狀態**的——完整對話每次都要放在 `messages` 裡送。

要讓瀏覽器直接呼叫才需要設 `API_SERVER_CORS_ORIGINS`；不需要就別開，這是把一個能跑指令的 agent 暴露出去的門。

**其二，當 Python library 用。**

```python
from run_agent import AIAgent

agent = AIAgent(model="anthropic/claude-sonnet-4.6", quiet_mode=True)
print(agent.chat("What is the capital of France?"))
```

`chat()` 內部跑完整個對話迴圈（工具呼叫、重試都在裡面），只回最終文字；要拿完整訊息歷史與 metadata 就用 `run_conversation()`，回傳的 dict 有 `final_response` 與 `messages`。

三個實務要點：

- **一定要設 `quiet_mode=True`**，官方用 warning 標了——不設的話 CLI 的 spinner 與進度指示會噴進你的應用程式輸出。
- 用 `enabled_toolsets` 或 `disabled_toolsets` 控制權限。官方的判準很好用：**要打造最小權限的 agent（例如只給網頁搜尋的研究 bot）用 `enabled_toolsets`；要保留大部分能力但拿掉特定幾樣（例如共享環境裡不給終端）用 `disabled_toolsets`。**
- 安裝方式跟[安裝那篇](/posts/ai/2026-08-18-hermes-agent-install)講的一致：clone 之後 `uv sync`、用 `uv run python your_app.py` 跑。**Hermes 沒有發佈可用於 `requirements.txt` 的 wheel 或 sdist**，所以「pip 裝進我的專案」這條路不存在。

## 這一篇的判斷

如果你只是要一個聊天用的 agent，這一篇可以跳過。但它回答了系列開頭那個問題：**Hermes 的自我改進迴路、toolset 分組、session 全量落地，這些設計不是產品經理排出來的功能清單，而是一條資料產線的副產品。** 一個要訓練 tool-calling 模型的機構，需要一個真的會用工具的 agent 去產生真實軌跡——做出來的東西順便就是一個好用的個人 agent。

反過來說，這也是評估它的一個角度：**當產品需求與研究需求衝突時，這個專案會往哪邊倒？** 目前看起來兩邊還是對齊的（好用的 agent 產出好的資料），但值得放在心上。

回到[系列導讀](/posts/ai/2026-08-18-hermes-agent-intro)。

## 參考資料

- [Hermes Agent — Batch Processing](https://hermes-agent.nousresearch.com/docs/user-guide/features/batch-processing)
- [Hermes Agent — API Server](https://hermes-agent.nousresearch.com/docs/user-guide/features/api-server)
- [Hermes Agent — Using Hermes as a Python Library](https://hermes-agent.nousresearch.com/docs/guides/python-library)
- [Hermes Agent — Learning Path](https://hermes-agent.nousresearch.com/docs/getting-started/learning-path)
- [Atropos — Nous Research 的 RL 環境框架](https://github.com/NousResearch/atropos)
- [ShareGPT 格式（HuggingFace datasets）](https://huggingface.co/docs/datasets/index)
