# Review record — Cloudflare Agents SDK 怎麼選起點（中英）

- 日期：2026-10-28
- 檔案：
  - `src/content/posts/ai/2026-10-28-cloudflare-agents-sdk-entry-points.md`
  - `src/content/posts/ai/2026-10-28-cloudflare-agents-sdk-entry-points-en.md`
- 查證底稿：`.work/cloudflare-agents-sdk-entry-points/evidence.md`

## post-verify

逐項對來源（GitHub raw docs、官方文件站、npm registry、GitHub API）核對，結論：**修正 5 處，其餘成立**。

| # | 句子 | 核對結果 | 處理 |
|---|---|---|---|
| 1 | 「Get started 卻寫著 "Start with the Pi harness"」 | 該句其實是文件首頁最上方的 description；Get started 段寫的是 "Build your agent with the Pi harness." | 改成「第一句卻是…，Get started 段也寫…」，兩個位置分開講（中英） |
| 2 | 引用 "Start with the Pi harness … in a Durable Object." | 原文句子還沒結束，後面接 ", and add state, real-time connections, and scheduled tasks with the Agents SDK." | 補成完整句子，避免截斷引文（中英） |
| 3 | 「30 多個範例、四組文件（agents、think、codemode、voice）」 | `examples/` 有 56 個目錄；`docs/` 有 agents、codemode、shell、think、voice 五組 | 改成「50 多個範例、五組文件（…shell）」／"50-plus examples, five sets of docs" |
| 4 | 「打開 `src/server.ts`，數一下裡面有幾個 class。每一個 class 對應這篇的一個起點」 | `examples/playground/src/server.ts` 是 re-export hub，匯出 20 多個 demo class，不是一個起點一個 class | 改成從 re-export 的 demo 挑：`demos/ai/chat-agent.ts` 是 `AIChatAgent`、`demos/multi-agent/supervisor-agent.ts` 是 `Agent` + dynamic agents（中英） |
| 5 | Code Mode 範例 `codemode.github.list_pull_requests(...)` | 官方文件是 `github.list_pull_requests(...)`；`codemode` 是 search/describe 的 platform SDK，connector 以 global 形式出現 | 改成 `github.list_pull_requests`，加一行註解說明 `github` 是 connector global（中英） |

其餘核對成立的重點：

- 版本：`agents` 0.31.0、`@cloudflare/ai-chat` 0.12.2、`@cloudflare/think` 0.22.0、`@cloudflare/codemode` 0.5.5（npm registry，2026-10-28 重查）。
- repo：5,901 stars、1,808 commits、MIT、2025-01-29 建立、Node 24+、不收 external PR。
- 文件立場：首頁 description 主推 Pi harness；Agent class 頁仍以 `Agent` 為預設 API；兩者不矛盾但入口不同。
- `PiHarness` 是 Lifecycle capability、Beta；Pi Durable experimental；限制（無工具核准、event stream 無 cursor、15 分鐘 alarm 邊界、session 不能刪）與文件一致。
- `@callable()`  decorator 設定：`agents/tsconfig` + `agents/vite`；`experimentalDecorators: true` 會靜默壞掉；缺設定出現 `SyntaxError: Invalid or unexpected token`。
- `AIChatAgent` 範例（`onChatMessage`、`this.messages`、`convertToModelMessages`、`toUIMessageStreamResponse`）與 `docs/agents/chat-agents.md` 一致。
- `Think` 範例（`getModel` 回 `@cf/…` 字串、`getSystemPrompt`）與 `docs/think/index.md` 一致；sessions 樹、FTS5、非破壞性 regeneration、messengers、workflows、HITL 都在文件裡。
- Dynamic agents 是 facet-backed child DO、沒有獨立 alarm、官方明說不是 scale-out 單位；agent tools 有 run registry、event replay、cancel、drill-in，AIChatAgent child 是 headless。
- 站內連結（Pi Durable、Agents runtime）與中英互連都存在。

## post-review

結論：**通過，修正 2 項**。

- Frontmatter 完整：title／date／type／category／tags／lang／tldr／description／glossary／draft。glossary 只放這篇需要的 `Agent harness` 與 `Facet`，沒有為了欄位硬塞。
- Tag 從 6 個減成 5 個：移除 `agents`，保留 `cloudflare-agents`。兩個同時存在是同一概念的拆分，`agents` 也太泛；`ai-agent` 是站上主用標籤（466 篇）。
- 結構：hook（README vs 文件首頁）→ 這是什麼 → runtime/harness 分層 → 五列對照表 → 四個起點各一節 → delegation 三選一 → 決策順序 → 限制 → 結論。標題清單可以只看標題就抓到論證順序；中英段落一一對應。
- 表格：五列入口表與三列 delegation 表都在 5 欄內；欄位是「你得到什麼／你要自己做什麼」，不是功能清單。
- 圖：一張五層圖，440 寬（手機不用左右捲），只有 L2 Lifecycle 用 accent；L4 加高放第二行。中英各一張，文字與正文一致。
- 內部連結：中英互連、兩篇既有站內文章（Pi Durable、Agents runtime）都存在。
- 刪掉開頭重複的 `0.31.0`（下一段版本列表已寫），避免同一數字出現兩次。
- TL;DR 依回饋重寫兩次：拿掉描述文章結構的講法，也不再用「文件 vs README」當開頭，直接寫判準——四個起點是四種 loop 歸屬，選 class 等於選要自己除錯哪一層。

## post-polish

`register-scan.sh`（zh，55 個正文段落）：

| 指標 | 結果 | 判斷 |
|---|---|---|
| 長句（兩個句號間 > 60 字） | 7 句 | 修 1 句；其餘是列舉句或直接引文 |
| 但書密度 | 7 / 55 段（12%） | 正常 |
| 引述區塊 | 0 | — |
| 數字密度（單段 ≥ 4 個數字） | 2 段 | 移除開頭重複的版本號；版本列表本身保留 |
| 研究者姓名當主詞 | 0 | — |
| 模板化轉折 | 2 處 | 保留：一處是全文論點（不是 Agent 比較方便，而是 loop 可外包），一處是產品定位對比 |
| 一般英文術語密度 | 2 處 | 保留：`@callable` 段落與 external PR 條款，都是 API／制度原名 |

修的句子：

- 「`agentTool(...)` 會把…parent 另外維護一份 run registry，client 可以看…」92 字 → 拆成兩句，所有權與 client 行為分開講。
- 開頭「這個 repo 在 2026-10-28 是 `agents` 0.31.0、5.9k stars…」→ 移除版本號，只留 stars／commits，版本集中到下一段。

保留的長句與理由：Harness 職責那句是六項列舉（模型呼叫、工具選擇、context、重試、壓縮、resume），拆開會失去「同一個 loop 要回答這些問題」的並列感；74 字那句是官方原文引用，不改寫。

## 驗證

| 指令 | 結果 |
|---|---|
| `node scripts/check-tw-terms.mjs <zh>` | 0 blocking，0 待確認 |
| `node scripts/check-post-references.mjs <zh> <en>` | OK，2 篇無問題 |
| `pnpm lint` | 0 warnings，0 errors |
| `npx astro check` | 0 errors（995 files） |
| `node scripts/check-lang-parity.mjs` | OK，3,233 對 |
| `node scripts/check-process-leak.mjs <zh> <en>` | 通過（無輸出） |
| `diagram-preview.ts <zh>` / `<en>` | 兩篇都 ✓；淺色、深色、手機截圖都看過 |
| `pnpm verify:staged`（只暫存這兩篇） | 14/16 綠；2 項紅燈與本文無關，見下 |

`verify:staged` 的兩個紅燈是工作區既有的問題，不在這兩篇：

- `check:series-order`：`daily/2026-09-06-security-openai-agent-wiki-coordination-sandbox-bypass*` 與 `daily/2026-09-21-security-google-gemini-evaluation-sandbox-escape*` 的 Sandbox Series order 25 重複。
- `check:course-videos`：5 篇課程文章的「尚無錄影」查核超過 7 天（CMU 11768、CS2680）。

這兩項沒有動，留給原本就在處理那些檔案的人。
- TL;DR 第三次改寫（2026-10-28，使用者確認）：前三版分別是指示型、鉤子、否定式對比，改成直接寫「我會怎麼選」的答案；與「AI 通病」總覽表格最後一列一致，中英同步。
