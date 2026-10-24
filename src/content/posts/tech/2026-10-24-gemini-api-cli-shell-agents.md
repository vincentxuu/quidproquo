---
title: "Gemini API CLI 怎麼用：與 Antigravity CLI、Gen AI SDK 的分工、設定與限制"
date: 2026-10-24
category: tech
type: deep-dive
tags: [gemini-api-cli, gemini, google, cli, ai-tools, antigravity-cli]
lang: zh-TW
tldr: "Gemini API CLI（gemini-api）是 Google 2026/10/19 發布的實驗性預覽（v0.4.x），一顆 Go 單一執行檔，把 Gemini 模型、媒體生成與 managed agents 變成無狀態的 shell 指令。它不是 coding agent：下一步由你的程式決定就用它，要 agent 自己規劃用 Antigravity CLI，寫應用後端用 Gen AI SDK。"
description: "Gemini API CLI 在 Gemini 開發堆疊的位置、與 Antigravity CLI 和 Gen AI SDK 的分工、指令地圖、把它嵌進本機工具的做法，以及 beta 版本、資料保留與金鑰的限制。"
draft: false
---

> 🌏 [English version](/posts/tech/2026-10-24-gemini-api-cli-shell-agents-en)

Gemini API CLI（指令名稱 `gemini-api`）是 Google 在 2026 年 10 月 19 日發布的[實驗性預覽](https://aistudio.google.com/learn/introducing-the-gemini-api-cli)，目前是 v0.4.x。它是一顆用 Go 寫的單一執行檔，把 Gemini 的文字模型、圖片／語音／音樂／影片生成、檔案分析和 managed agents 都變成 shell 指令。

最容易搞混的一點：它**不是** coding agent，也不是 Gemini CLI 的接班人。Gemini CLI 的接班人是 [Antigravity CLI](/posts/tech/2026-05-21-antigravity-cli-google-terminal-agent)（`agy`），Google 在 2026 年 6 月 18 日讓 Gemini CLI 對 Google AI Pro、Ultra 和免費個人使用者停止服務。`gemini-api` 只做一件事：被你的程式、腳本或另一個 agent 呼叫一次，回傳結果。

要不要用它，看「下一步由誰決定」：

- 你的程式已經知道要問什麼、要拿什麼回來：用 `gemini-api`。
- 任務要先讀程式碼、跑指令、多步嘗試：用 Antigravity CLI 或其他 coding agent。
- 服務要上線，需要型別、並行與重試：用 Gen AI SDK。

## 它在 Gemini 開發堆疊的哪一層

官方把堆疊分成三層：底下是 [Gemini API](https://ai.google.dev/gemini-api/docs)（模型與 Managed Agents），上面有兩個並列的入口，一個是 [Google Gen AI SDK](https://ai.google.dev/gemini-api/docs/libraries)（Python、TypeScript、Go、Java），一個是 `gemini-api` CLI。

```diagram
title: Gemini 開發堆疊的三層
desc: 應用後端經 Gen AI SDK、本機工具與 coding agent 經 gemini-api CLI，都落到同一個 Gemini API。
caption: 簡化自官方的三層說法。Antigravity 也屬於「Coding agent」這一格，官方示範它直接呼叫 gemini-api。
---
<svg viewBox="0 0 440 376">
  <path class="dg-line" d="M80 80V148" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M220 80V148" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M360 80V148" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M80 216V284" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M290 216V284" marker-end="url(#arrow)"/>

  <rect class="dg-box" x="16" y="24" width="128" height="56" rx="6"/>
  <text class="dg-label" x="80" y="46" text-anchor="middle" dominant-baseline="central">應用後端</text>
  <text class="dg-sub" x="80" y="64" text-anchor="middle" dominant-baseline="central">網站、API 服務</text>

  <rect class="dg-box" x="156" y="24" width="128" height="56" rx="6"/>
  <text class="dg-label" x="220" y="46" text-anchor="middle" dominant-baseline="central">本機工具</text>
  <text class="dg-sub" x="220" y="64" text-anchor="middle" dominant-baseline="central">外掛、腳本、CI</text>

  <rect class="dg-box" x="296" y="24" width="128" height="56" rx="6"/>
  <text class="dg-label" x="360" y="46" text-anchor="middle" dominant-baseline="central">Coding agent</text>
  <text class="dg-sub" x="360" y="64" text-anchor="middle" dominant-baseline="central">Claude Code 等</text>

  <rect class="dg-box" x="16" y="152" width="128" height="64" rx="6"/>
  <text class="dg-label" x="80" y="176" text-anchor="middle" dominant-baseline="central">Gen AI SDK</text>
  <text class="dg-sub" x="80" y="198" text-anchor="middle" dominant-baseline="central">型別化程式庫</text>

  <rect class="dg-box dg-box--accent" x="156" y="152" width="268" height="64" rx="6"/>
  <text class="dg-label" x="290" y="176" text-anchor="middle" dominant-baseline="central">gemini-api CLI</text>
  <text class="dg-sub" x="290" y="198" text-anchor="middle" dominant-baseline="central">無狀態、自我描述的 shell 指令</text>

  <rect class="dg-box" x="16" y="288" width="408" height="64" rx="6"/>
  <text class="dg-label" x="220" y="312" text-anchor="middle" dominant-baseline="central">Gemini API</text>
  <text class="dg-sub" x="220" y="334" text-anchor="middle" dominant-baseline="central">文字、圖片、語音、音樂、影片與 Managed Agents</text>
</svg>
```

CLI 的設計有三個特點：

- **無狀態**：每次呼叫彼此獨立，CLI 不在本機留對話。要續聊，自己帶回上一次回傳的 interaction ID（`previous_interaction_id`）。
- **自我描述**：`--help`、`--usage`（機器可讀的 KDL）、`--schema`（請求本文的 JSON Schema）、`--dry-run`（離線預覽 HTTP 請求，金鑰已遮蔽）都內建在執行檔裡，agent 不必先讀文件。
- **輸出乾淨**：圖片、語音、音樂、影片直接寫到硬碟，標準輸出只印檔案路徑；文字可輸出 JSON 或 TOON，也能用 `--jq` 只取需要的欄位。

這些事沒有 CLI 也做得到，寫一支 SDK 腳本或直接打 REST 都行。官方自己的說法是，沒有專用 CLI 時 agent 會猜模型 ID、寫用完即丟的 SDK 腳本，還會把 base64 塞進 context。CLI 的增量是把這層摩擦拿掉，沒有新增模型能力。

## 跟 Antigravity CLI、Gen AI SDK 怎麼分

|  | gemini-api CLI | [Antigravity CLI](/posts/tech/2026-08-24-antigravity-cli-gemini-replacement-google) | Gen AI SDK |
|---|---|---|---|
| 角色 | 一次 API 呼叫 | 會自己規劃的 coding agent | 型別化程式庫 |
| 下一步誰決定 | 呼叫它的程式或 agent | agent 自己 | 你的程式碼 |
| 典型呼叫者 | 腳本、外掛、別的 agent | 人，在終端機裡 | 應用後端 |
| 適合 | 單次生成、分析、轉錄、背景研究 | 多步改程式、跑指令、子 agent | 上線服務、並行、重試 |

Antigravity CLI 的設計見站內[這篇](/posts/tech/2026-05-21-antigravity-cli-google-terminal-agent)；官方也示範了兩者的搭配：Antigravity 把 `gemini-api` 當工具，用它生圖、生影片，再拿檔案路徑繼續做事。

如果你原本把 Antigravity CLI 當成一次性的文字生成器來呼叫，這就是換過來的情境。你的程式只需要「送 prompt、收文字」，不需要工具、沙箱或子 agent，那個 agent 的啟動與迴圈就是多餘的。換成 `gemini-api` 後，一次呼叫就是一次 API 往返。

## 指令地圖

| 類別 | 指令 | 做什麼 |
|---|---|---|
| 建立 | `generate`、`image`、`tts`、`music`、`video` | 文字與多模態生成、圖片生成與編輯、語音、音樂、影片 |
| 理解 | `analyze`、`transcribe` | 問 PDF、圖片、音訊、影片或 YouTube 網址；轉錄成 md、text、json、srt |
| 管理 | `agent`、`files`、`models` | 啟動並輪詢 managed agent、上傳檔案、列出模型 |
| 設定 | `configure`、`auth`、`whoami` | 金鑰與偏好、查目前的憑證來源 |
| 進階 | `environments`、`credentials`、`webhooks`、`triggers` | 沙箱環境、伺服器端憑證、webhook、排程 trigger |

預設模型依 2026-10-24 的 [README](https://github.com/google-gemini/gemini-api-cli)：`generate`、`analyze`、`transcribe` 用 `gemini-3.8-flash`，`image` 用 `gemini-nano-banana-2.1`，`video` 用 `gemini-omni-1.1-flash`，`music` 用 `lyria-3.5`，`tts` 用 `gemini-3.8-flash-tts`。型號換得快，以 `gemini-api models` 列出的為準。

長任務是 CLI 最順手的場合。Managed agent（例如 Deep Research）可以丟到背景，只拿回 interaction ID，晚點再查：

```bash
ID=$(gemini-api agent run "Research battery recycling approaches and cite sources" \
  --agent deep-research-preview-04-2026 \
  --background --stream=false --jq '.id')

gemini-api agent status "$ID" --stream=false --output-format json
```

## 範例：本機工具把 AI 呼叫交給 CLI

假設你有一個 VS Code 外掛或客服工具，需要「把這段話改寫成正式語氣」。以前要在工具裡設計一個填 API Key 的地方，還要處理金鑰怎麼存、連線檢查。換成 CLI 後，分成兩步。

**第一步，金鑰設定一次，之後程式不碰它。** 金鑰可以放環境變數 `GEMINI_API_KEY`，也可以用 `gemini-api configure --api-key "..."` 存進作業系統的 keychain（macOS Keychain、Linux Secret Service、Windows Credential Manager）或 `~/.config/gemini-api/config.yaml`；`gemini-api configure` 不加參數會開互動設定介面。`gemini-api whoami` 會告訴你目前用的是哪一個來源。

**第二步，程式只負責組參數、呼叫、收結果：**

```ts
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const run = promisify(execFile);

export async function rewrite(text: string): Promise<string> {
  const prompt = `改寫成正式語氣，只回傳結果：\n\n${text}`;
  try {
    // execFile 不經過 shell，使用者文字不會被當成指令
    const { stdout } = await run("gemini-api", ["generate", prompt, "--no-interactive"]);
    return stdout.trim();
  } catch (err) {
    // 結束碼：1 是 API 失敗，2 是參數錯誤，3 是認證失敗
    if ((err as { code?: number }).code === 3) {
      throw new Error("尚未設定 Gemini API 金鑰，請先執行 gemini-api configure");
    }
    throw err;
  }
}
```

`--no-interactive` 關掉所有互動提示，結束碼把認證問題和其他錯誤分開，這兩件事讓子行程可以放心在背景跑。接進工具之前，先用 `--dry-run` 看一次實際會送出的請求：

```bash
gemini-api generate "Hello from my agent" --dry-run
```

`--dry-run` 不連網、也不讀 keychain，適合放進 CI 驗證指令組得對不對。

## 限制

- **還是 beta。** 官方標示它隨 [Interactions API](https://ai.google.dev/gemini-api/docs/interactions) 一起演進，版本之間可能有破壞性變更，建議在 CI 與自動化裡釘住 [release 版本](https://github.com/google-gemini/gemini-api-cli/releases)。安裝腳本是 `curl ... | bash`，要釘版本就改下載指定版本的預編譯檔。專案目前不接受外部 pull request，意見只能開 issue。
- **需要 API key。** 它用的是在 Google AI Studio 建立的 [API 金鑰](https://ai.google.dev/gemini-api/docs/api-key)，額度與計費到 AI Studio 查看。
- **資料會留在伺服器端。** CLI 本身不存對話，但伺服器端的 interaction 與上傳的檔案各有保留規則：Files API 的檔案保留 48 小時。README 的範例用請求本文裡的 `"store": false` 關掉 interaction 的伺服器端儲存。處理客戶資料的工具，用 `gemini-api generate --schema` 確認你的版本接受哪些欄位，再用 `--body` 帶這個設定。
- **沒有 agent 的能力。** 它不會讀你的專案、不會自己決定下一步，也不提供本機的沙箱（`environments` 管的是 managed agent 在伺服器端的環境）。需要這些，就回到上面的分工表。

## 開始用

```bash
# 安裝（macOS／Linux）
curl -fsSL https://raw.githubusercontent.com/google-gemini/gemini-api-cli/main/scripts/install.sh | bash

# 設定金鑰並驗證
gemini-api configure --api-key "YOUR_API_KEY"
gemini-api whoami
gemini-api generate "Hello from my agent" --dry-run
```

想讓 coding agent 用它，把 README 提供的那段說明貼進 `AGENTS.md` 或 `CLAUDE.md`：告訴 agent 用 `--help` 或 `--usage` 選指令、用 `--schema` 組 `--body`、先 `--dry-run`、要結構化輸出就加 `--stream=false --output-format json`。[Claude Code](/posts/tech/2026-03-31-claude-code-overview-anthropic-coding-agent) 這類 agent 讀到之後，就能自己查指令並呼叫。

## 整體來說

`gemini-api` 把「呼叫 Gemini」收成一個固定的 shell 介面，換來的是你的程式不必管金鑰與串流、agent 不必寫一次性腳本。代價是它只做一次呼叫，沒有判斷力，而且還在 v0.4.x。

已經有 agent 的人，把它當成 agent 的一個工具最自然；自己寫本機工具或腳本的人，它取代的是「為了一次呼叫去養一個 agent 或 SDK 專案」。要上線的服務，還是用 Gen AI SDK。

## 參考資料

- [Introducing the Gemini API CLI（Google AI Studio，2026-10-19）](https://aistudio.google.com/learn/introducing-the-gemini-api-cli)
- [google-gemini/gemini-api-cli（GitHub）](https://github.com/google-gemini/gemini-api-cli)
- [An important update: Transitioning Gemini CLI to Antigravity CLI（Google Developers Blog，2026-05-19）](https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli)
- [Antigravity CLI：Google 用一套 agent harness 收編 Gemini CLI 的終端機介面](/posts/tech/2026-05-21-antigravity-cli-google-terminal-agent)
- [Antigravity CLI：Google 用閉源 Go binary 取代十萬星開源 Gemini CLI](/posts/tech/2026-08-24-antigravity-cli-gemini-replacement-google)
