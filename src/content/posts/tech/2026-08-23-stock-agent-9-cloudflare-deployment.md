---
title: "台股研究 Agent 實戰系列（篇 9）：部署邊界——Docker 到 Cloudflare Containers 的公開 API"
date: 2026-08-23
category: tech
type: deep-dive
tags: [stock-research-agent, cloudflare, containers, docker, deployment, fastapi, observability]
lang: zh-TW
tldr: "一個 Python agent 從本機 uv run 到 Docker 到 Cloudflare Containers 公開 API 的完整部署鏈：Worker 擋認證、Container 跑 FastAPI、secret 永遠不進映像檔，10 分鐘沒人用就自動休眠——side project 的正確省錢姿勢。"
description: "stock-research-agent 的部署架構：Dockerfile 怎麼切、Worker 為什麼是認證邊界而不是容器、secret 管理的三層分離、Cloudflare Containers 的 sleep-after 與 scale-to-zero，以及為什麼公開服務刻意關掉 LLM。"
draft: false
glossary:
  - term: "timing-safe comparison"
    definition: "比對兩個字串時無論在哪個位元不同都花一樣的時間，防止攻擊者透過回應時間猜出正確 token 的長度或內容。"
  - term: "scale-to-zero"
    definition: "沒有請求時自動關閉運算資源、不產生費用，有請求進來再冷啟動的部署模式。"
  - term: "healthcheck"
    definition: "定期對服務發送探測請求，確認它還活著；不通過就重啟或標記不健康。"
  - term: "binding"
    definition: "Cloudflare Workers 裡把服務（KV、D1、Durable Objects、Containers）掛載到 Worker 執行環境的機制，不經網路、零延遲。"
---

> **台股研究 Agent 實戰系列（篇 9 / 9）**：[上一篇：研究到模擬單的邊界：content-addressed 執行合約](/posts/tech/2026-08-23-stock-agent-8-execution-contracts) ｜ [完整目錄在篇 1](/posts/tech/2026-08-23-stock-agent-1-why-taiwan)

前八篇拆的都是「agent 內部怎麼跑」——graph 拓樸、LLM 分層、回測問責、citation 護欄、copilot loop、執行合約。這篇回答最後一個問題：**這些東西怎麼讓別人用？** 從本機 `uv run` 到 Docker 到 Cloudflare Containers 的公開 API，三層部署各解決什麼問題、secret 住在哪裡、為什麼公開服務刻意關掉 LLM、以及一個 side project 怎麼做到「沒人用時不花錢」。

## 三層部署，同一份程式碼

整個專案有三種跑法，共用同一個 FastAPI app（`stock_agent.api:app`）：

| 層 | 進入點 | 適合誰 | 需要什麼 |
|---|---|---|---|
| 本機 uv | `uv run stock-agent research 2330` | 開發、評估、日常研究 | Python 3.12 + uv |
| Docker | `docker run -p 8000:8000 stock-research-agent` | 本機驗證生產映像 | Docker |
| Cloudflare Containers | `stock-research-agent.vincent-xu-work.workers.dev` | 公開 API / 面試 demo | Cloudflare 帳號 + wrangler |

關鍵：三層跑的是**同一份 Python 程式碼**，差別只在「誰持有 secret」和「誰擋認證」。

## Dockerfile：24 行做完的事

```dockerfile
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy \
    PATH="/app/.venv/bin:$PATH"

WORKDIR /app
RUN pip install --no-cache-dir uv==0.9.27

COPY pyproject.toml uv.lock README.md ./
COPY src ./src
RUN uv sync --frozen --no-dev --no-editable

RUN useradd --create-home --uid 10001 appuser && chown -R appuser:appuser /app
USER appuser

EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD python -c "import os, urllib.request; urllib.request.urlopen('http://127.0.0.1:' + os.getenv('PORT', '8000') + '/health', timeout=3)"

CMD ["sh", "-c", "exec uvicorn stock_agent.api:app --host 0.0.0.0 --port ${PORT:-8000}"]
```

幾個刻意的選擇：

**`uv sync --frozen --no-dev --no-editable`**：`--frozen` 保證 lock 檔跟開發環境一模一樣，不會因為 Docker build 時間點不同而裝到不同版本；`--no-dev` 不裝 pytest、ruff 等測試工具；`--no-editable` 把套件複製進 `.venv` 而不是 symlink 回 `src/`，這樣 `src/` 的改動不會意外影響已安裝的套件。

**非 root 使用者 `appuser`**：UID 10001，不是 0。容器裡跑的 Python process 沒有寫系統目錄的權限——不是因為 FastAPI 需要，而是因為如果有一天 prompt injection 突破了信任邊界，至少攻擊者拿不到 root。

**Healthcheck 用 Python stdlib**：不裝 curl 也不裝 wget，`python:3.12-slim` 自帶的 `urllib.request` 就夠了。少一個二進位，少一個攻擊面。`PORT` 環境變數讓 Cloudflare Containers 可以用不同 port 叫。

**沒有任何 secret 進映像檔**：Dockerfile 裡看不到 `ANTHROPIC_API_KEY`、`LANGFUSE_SECRET_KEY`、`RESEARCH_API_TOKEN`——它們全部由執行環境在 runtime 注入。映像檔本身推到任何 registry 都是安全的。

## Worker 是認證邊界，不是容器

這是整個部署設計最重要的一個決定：**認證不在容器裡做**。

```text
Internet ──▶ Cloudflare Worker (認證) ──▶ Container (FastAPI)
                  │
                  ├── /health, /docs → 直接放行
                  └── /research → Bearer token 驗證
```

Worker 的完整程式碼只有 60 行（`cloudflare/worker.ts`）。核心邏輯：

```typescript
export class StockResearchContainer extends Container<Env> {
  defaultPort = 8000;
  sleepAfter = "10m";
  enableInternet = true;
  pingEndpoint = "/health";

  constructor(ctx: DurableObjectState<{}>, env: Env) {
    super(ctx, env);
    this.envVars = {
      STOCK_AGENT_NO_LLM: env.STOCK_AGENT_NO_LLM,
      LANGFUSE_PUBLIC_KEY: env.LANGFUSE_PUBLIC_KEY,
      LANGFUSE_SECRET_KEY: env.LANGFUSE_SECRET_KEY,
      LANGFUSE_BASE_URL: env.LANGFUSE_BASE_URL,
    };
  }
}
```

注意 `envVars` 裡**沒有** `ANTHROPIC_API_KEY` 和 `RESEARCH_API_TOKEN`。前者是因為公開部署設定了 `STOCK_AGENT_NO_LLM=1`，不需要 LLM 憑證；後者是因為 token 驗證發生在 Worker 層，容器根本不需要知道正確的 token 是什麼。

Token 比對用 timing-safe comparison——不是直接 `===`，而是先 SHA-256 再 `crypto.subtle.timingSafeEqual`：

```typescript
async function tokenMatches(provided: string, expected: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const [providedHash, expectedHash] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(provided)),
    crypto.subtle.digest("SHA-256", encoder.encode(expected)),
  ]);
  return crypto.subtle.timingSafeEqual(providedHash, expectedHash);
}
```

為什麼要這樣？因為普通的字串比較在第一個不同的字元就返回 false，攻擊者可以靠量測回應時間逐字猜出正確的 token。先 hash 再比較，不管哪個位元不同都花一樣的時間。這是 60 行 Worker 裡最值得抄的 6 行。

## Secret 管理的三層分離

| Secret | 住在哪 | 容器看得到嗎 | 為什麼 |
|---|---|---|---|
| `RESEARCH_API_TOKEN` | Worker secret | 看不到 | 認證在 Worker 做完，容器不需要 |
| `ANTHROPIC_API_KEY` | 不存在於公開部署 | 看不到 | 公開服務用 no-LLM 路徑 |
| `LANGFUSE_PUBLIC_KEY` | Worker secret → 注入容器 | 看得到 | 容器要上傳 trace |
| `LANGFUSE_SECRET_KEY` | Worker secret → 注入容器 | 看得到 | 容器要上傳 trace |
| `LANGFUSE_BASE_URL` | wrangler.jsonc vars | 看得到 | 不是 secret，指向 `jp.cloud.langfuse.com` |

設定 secret 不進版控：

```bash
npx wrangler secret put RESEARCH_API_TOKEN
npx wrangler secret put LANGFUSE_PUBLIC_KEY
npx wrangler secret put LANGFUSE_SECRET_KEY
```

本機開發用 `.env`（已 gitignore），CLI 和 FastAPI 都會 auto-load，而且不覆蓋已存在的同名 shell 變數。Demo 用的 token 存在 macOS Keychain 裡，用完即 unset：

```bash
research_token="$(security find-generic-password \
  -s stock-research-agent-api -a cloudflare-demo -w)"
curl -X POST .../research \
  -H "authorization: Bearer ${research_token}" \
  -d '{"symbol":"2330","question":"現在適合波段進場嗎？"}'
unset research_token
```

## wrangler.jsonc：整個部署的宣告

```jsonc
{
  "name": "stock-research-agent",
  "main": "cloudflare/worker.ts",
  "containers": [{
    "name": "stock-research-api",
    "class_name": "StockResearchContainer",
    "image": "./Dockerfile",
    "instance_type": "basic",
    "max_instances": 1,
    "rollout_step_percentage": 100
  }],
  "durable_objects": {
    "bindings": [{
      "name": "STOCK_RESEARCH",
      "class_name": "StockResearchContainer"
    }]
  },
  "vars": {
    "STOCK_AGENT_NO_LLM": "1",
    "LANGFUSE_BASE_URL": "https://jp.cloud.langfuse.com"
  },
  "observability": {
    "enabled": true,
    "logs": { "head_sampling_rate": 1 },
    "traces": { "enabled": true, "head_sampling_rate": 0.1 }
  }
}
```

幾個數字值得解釋：

**`instance_type: "basic"`**：Cloudflare Containers 最小的實例規格。一個 Python research agent 不需要 GPU，也不需要大量 RAM——最重的操作是 pandas 算技術指標和跑回測，在 basic 實例上幾秒內完成。

**`max_instances: 1`**：side project 不需要水平擴展。一個實例夠了，而且多個實例之間不共享 `runs/` 目錄（容器不掛持久卷），所以擴展反而會讓行為不一致。

**`rollout_step_percentage: 100`**：一步到位，不做金絲雀。理由同上——side project，不是生產交易系統。

**`head_sampling_rate: 0.1`（traces）**：只抽樣 10% 的請求做 trace。公開 API 可能被掃描器掃，100% trace 會產生大量無意義的 trace 資料。但 logs 是 100%——出問題時我要看到每一筆。

## sleepAfter = "10m"：side project 的正確省錢姿勢

```typescript
sleepAfter = "10m";
```

這一行讓容器在 10 分鐘沒有請求後自動休眠。下一個請求進來時，Worker 呼叫 `container.startAndWaitForPorts()` 喚醒它，等 FastAPI 起來後再轉發。冷啟動大約幾秒——對一個研究 API 來說完全可以接受。

這就是我選 Cloudflare Containers 而不是自己租 VPS 的原因。一台最小的 VPS 一個月 5 美元起跳，不管有沒有人用都在燒。Containers 的 basic 實例只在跑的時候計費，睡著不算錢。對一個面試 demo 和個人研究用的 side project，「沒人用時不花錢」比「冷啟動快 3 秒」重要得多。

## 為什麼公開服務刻意關掉 LLM

`STOCK_AGENT_NO_LLM=1` 不是偷懶，是刻意的安全邊界：

1. **成本控制**：一次 synthesis call 大約 $0.03（篇 3 量測過）。公開 API 如果被人寫腳本灌，一天可以燒掉不少。在沒有 per-client rate limit 和 queue 的情況下，開 LLM 就是開一個沒有上限的帳單。

2. **降級路徑已經存在**：篇 3 講過，LLM 不可用時 synthesis 會降級到規則模板報告。公開 API 走的就是這條路——技術分析、回測、反思、基本面、籌碼全部照常跑，只有最後的報告用模板而不是 LLM 寫。你拿到的資料是一樣的，只是敘事沒那麼漂亮。

3. **示範邊界的正確性**：篇 8 講的執行合約說「Research Agent 永遠不持有交易憑證」。同樣的原則在部署層也成立——公開容器不持有 LLM 憑證，所以就算容器被打穿，攻擊者也拿不到 Anthropic API key。

什麼時候會開？等 `/research` 有了 per-client rate limit、request queue、和 LLM 預算上限之後。那是 `docs/deployment.md` 裡明確記載的前置條件。

## 容器不持久化——這是特徵，不是 bug

`docs/deployment.md` 寫得很白：

> The API does not persist decision artifacts. Container restarts therefore do not lose API-owned state, but they also do not provide the CLI's append-only research history.

CLI 版本的 `runs/` 目錄是 append-only 的研究歷史——每次研究的決策 JSON、回測結果、review 紀錄都留在磁碟上。容器版本不做這件事。為什麼？

因為 Cloudflare Containers 不掛持久卷（至少在 basic 實例上）。容器重啟後 `runs/` 就沒了。與其讓使用者以為資料會留著、結果發現不見了，不如一開始就不假裝有持久化。API 的每次研究是獨立的：你問、它算、它答、結束。想要完整的研究歷史，用 CLI。

這也跟篇 5 的 run card 設計呼應——run card 的 SHA-256 hash 保證的是「同一份資料跑出同一個結果」，不是「結果會永遠存在某個地方」。可重現性和持久化是兩回事。

## 部署流程：五步

```bash
# 1. 本機驗證
docker build -t stock-research-agent .
docker run --rm -p 8000:8000 -e STOCK_AGENT_NO_LLM=1 stock-research-agent
curl --fail http://127.0.0.1:8000/health

# 2. TypeScript 類型檢查
npm install
npm run cf:types
npx tsc --noEmit

# 3. Dry run
npx wrangler deploy --dry-run

# 4. 設定 secret（只需一次）
npx wrangler secret put RESEARCH_API_TOKEN
npx wrangler secret put LANGFUSE_PUBLIC_KEY
npx wrangler secret put LANGFUSE_SECRET_KEY

# 5. 部署
npx wrangler deploy
```

第 1 步是我自己加的習慣——先在本機 Docker 跑一次完整的 smoke test，確認 healthcheck 過了、`/research` 回得了結果，再推到 Cloudflare。這比「deploy 完才發現 uv.lock 沒更新」省事得多。

## 可觀測性：Langfuse 從容器裡打出去

容器內的 FastAPI 在每次研究結束後上傳 sanitized trace 到 Langfuse（篇 3 詳述）。Trace 只包含 symbol、direction、model、latency、token usage、cost——不包含 prompt、報告內容、或任何憑證。

公開部署指向 `jp.cloud.langfuse.com`（東京區域，延遲低），Langfuse 的 public/secret key 通過 Worker 注入容器。如果 Langfuse 憑證不存在或驗證失敗，trace 上傳會 gracefully skip，記一行 `credentials_missing`，不阻擋研究流程。

Worker 本身也開了 Cloudflare 原生的 observability：logs 100% 取樣（出問題時要看到每一筆認證失敗），traces 10% 取樣（減少掃描器產生的噪音）。兩層 observability 互補——Cloudflare traces 看 Worker 層的延遲和錯誤，Langfuse 看 agent 層的 LLM 行為和成本。

## 跟前八篇的對應

| 前面哪篇 | 部署層怎麼延續 |
|---|---|
| 篇 2（並行架構） | 容器裡跑的是同一個 LangGraph graph，五個分析師同一個 superstep 並行 |
| 篇 3（LLM 分層） | 公開部署走 no-LLM 路徑，就是 provider chain 的最底層降級 |
| 篇 5（run card） | API 回應包含回測結果和 SHA-256 hash，但不持久化到 `runs/` |
| 篇 6（citation 護欄） | evidence manifest 和 citation guard 照常運作，模板報告也用 `{{fact.id}}` |
| 篇 7（copilot loop） | API 的 plan approval 透過 `--approve-plan` 或 API 參數控制 |
| 篇 8（執行合約） | 公開部署**沒有接** execution dispatcher；容器不持有交易憑證 |

## 誠實的限制

寫到這裡，把目前部署架構的限制攤開：

- **`/research` 是同步的**：一個請求進來，整個 graph 跑完才回。沒有 queue、沒有 webhook callback、沒有 streaming。長研究（需要外部文件搜尋的）可能要等 30 秒以上。
- **沒有 per-client rate limit**：Bearer token 是「有或沒有」，不是「每分鐘幾次」。在 no-LLM 模式下問題不大（成本是 CPU 不是 API），開了 LLM 之後就需要了。
- **單實例、無持久化**：不是高可用設計。容器掛了 Worker 回 503，等下次請求喚醒新容器。`runs/` 歷史只在 CLI 模式有。
- **Healthcheck 只查 FastAPI**：不查 Yahoo Finance、FinMind、Anthropic、Langfuse 的可用性。一個 healthy 的容器不代表所有上游資料源都通。
- **冷啟動延遲**：`sleepAfter = "10m"` 意味著不常用的 API 每次都要等冷啟動。Python 映像 + uv 虛擬環境的冷啟動大約幾秒，不是毫秒。

這些限制是對一個 side project 的合理取捨。要解的話都有明確路徑（queue、rate limit middleware、持久卷或外部儲存、deep healthcheck endpoint），但在 `max_instances: 1` 的階段，工程複雜度的性價比不對。

## 九篇下來的一句話

這個系列從「為什麼做」講到「怎麼讓別人用」。九篇加起來，核心命題只有一個：**LLM 應該解釋已存在的證據，而不是產生證據**。graph 拓樸是為了讓回測排在 synthesis 前面（篇 2）、LLM 分層是為了只在必要時才叫（篇 3）、回測問責是為了讓歷史說話（篇 4）、walk-forward 是為了讓參數誠實（篇 5）、citation 護欄是為了讓數字可信（篇 6）、copilot loop 是為了讓人類留在迴圈裡（篇 7）、執行合約是為了讓 agent 永遠摸不到真錢（篇 8），而部署邊界是為了讓這些保證在公開 API 上也成立（本篇）。

專案還在演進中。golden eval 的 50% baseline 很難看，公開 API 還沒開 LLM，QuantConnect 的 paper 流程還在手動 walkthrough 階段。但這些都是可以量化、可以追蹤、可以改善的已知問題——不是藏在漂亮數字後面的未知風險。我寧可公開承認 5/10，也不想靠 cherry-picking 假裝 9/10。

程式碼在 [GitHub](https://github.com/vincentxuu/stock-research-agent)，issues 開放，歡迎指教。

---

## 參考資料

- [stock-research-agent（GitHub repo）](https://github.com/vincentxuu/stock-research-agent)
- [docs/deployment.md：Docker and Cloudflare boundaries](https://github.com/vincentxuu/stock-research-agent/blob/main/docs/deployment.md)
- [Cloudflare Containers 文件](https://developers.cloudflare.com/containers/)
- [Cloudflare Workers Observability](https://developers.cloudflare.com/workers/observability/)
- [Langfuse：LLM observability 平台](https://langfuse.com/)
