---
title: "用 AI 審計自己的專案：Cloudflare security-audit 與 Trail of Bits skills 的做法差在哪"
date: 2026-10-24
category: ai
type: deep-dive
tags: [security, ai-agent, agent-skills, code-review, cloudflare]
lang: zh-TW
series:
  name: "AI Agent 資安工具地圖"
  order: 5
tldr: "兩個代表的做法相反：Cloudflare 的 security-audit skill 是純 LLM 的多階段流程，Cloudflare 說他們內部的 harness 接了 Semgrep 之後，獵捕用的 agent 一個月都沒呼叫；Trail of Bits 則是 Semgrep、CodeQL 腳本加 LLM 判斷。我在兩者的規則與附檔裡都找不到 Workers、D1、KV 或 Astro 的專屬檢查，兩者也都沒有公開在真實專案上的準確率。這篇只讀了文件，沒有對任何專案試跑。"
description: "比較 Cloudflare security-audit skill 與 Trail of Bits skills 的審計做法、驗證設計、成本與授權，並以 Astro 加 Cloudflare Workers 專案為例，說明它們缺什麼、審計前要先準備什麼。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-10-24-audit-skills-cloudflare-trail-of-bits-en)

從這一篇開始，你的目標換了。前四篇講怎麼保護你的開發環境；這一篇起講怎麼測試你自己做的東西。如果你只用 agent、不做產品，讀完[第 4 篇](/posts/ai/2026-10-24-agent-detection-audit)可以停。

在[系列地圖](/posts/ai/2026-10-24-ai-agent-security-tooling-map)上，這是第五類：用 AI 讀你的原始碼找漏洞。兩個代表是 Cloudflare 的 [security-audit-skill](https://github.com/cloudflare/security-audit-skill)，以及 Trail of Bits 的 [skills](https://github.com/trailofbits/skills) 中和審計有關的 plugin。Cloudflare 是 Workers 的供應商，Trail of Bits 是資安顧問公司，兩者的 skill 都是各自公開的 repo。這一篇只依據它們的文件與原始檔，沒有對任何專案實際執行過，所以「準不準」沒有答案，只能比較做法。

先講結論：這兩個 skill 沒有給 Claude 新能力，給的是現成的審計流程與工具串接；我在兩者裡都找不到認得 Workers、D1 或 Astro 的檢查，兩者也都沒有公布在真實專案上的準確率。

## 兩種相反的做法

**Cloudflare：純 LLM 的多階段流程。** 這個 skill 把審計拆成六步：先偵察，再依覆蓋台帳（入口、信任邊界、攻擊類別）分派獵捕，並由覆蓋審查補漏；接著另開一個獨立的驗證者（verifier）試著推翻每個候選，檢查輸出格式，再換一個新的 agent 複驗一次，最後才出報告。驗證者是沒參與獵捕的新 agent，只憑儲存庫原始碼和沙箱內有限的本機重現去反駁候選，不碰已部署的端點；它若發現另一個根因，不能直接收進報告，要另編指紋、交給新的獨立驗證者重驗（見[流程原文](https://github.com/cloudflare/security-audit-skill/blob/HEAD/skills/security-audit/VALIDATION-AND-REPORTING.md)）。它不呼叫 Semgrep 或 CodeQL。

Cloudflare 在[介紹內部 harness（內部的執行框架）的文章](https://blog.cloudflare.com/build-your-own-vulnerability-harness)裡寫，他們把 Semgrep 接進整條流程，獵捕用的 agent 一個月內一次都沒呼叫過，因為它們寧可自己讀程式碼、跑程式碼。官方也說，單次執行只找得到多次執行總和的約一半，找到的又偏向較簡單、不細緻的漏洞，並且不宣稱假陰性率。

repo 裡有兩支腳本，只檢查輸出的 JSON 結構與台帳是否一致，不判斷漏洞是不是真的。另外一個設計值得注意：沒有作業系統層級的沙箱，skill 就不執行目標程式碼，相關線索降級成 `needs_validation`，沒有嚴重度。

**Trail of Bits：工具加 LLM 的混合。** 它是 46 個 plugin 的集合（2026 年 10 月 23 日查詢），和審計有關的有幾種做法：

| plugin | 做什麼 | 靠什麼 |
|---|---|---|
| `static-analysis` | 呼叫 Semgrep 與 CodeQL 的腳本，把結果合併成 SARIF | 確定性工具為主 |
| `insecure-defaults` | 找預設值不安全的設定 | 多個 LLM agent，先偵察、再平行探索、最後由專門推翻的 agent 驗證 |
| `fp-check` | 專門降誤報；它的說明寫 “LLMs are biased toward seeing bugs and overrating severity”（LLM 傾向把東西看成漏洞，也傾向高估嚴重度） | LLM |
| `differential-review` | 審 PR 或 commit 的差異 | LLM |
| `supply-chain-risk-auditor` | 用腳本去量維護者數量、下載量這類數字，不讓 LLM 憑印象估 | 腳本收集資料 |

兩者的做法不同：Cloudflare 讓 LLM 自己讀碼，再用另一個 agent 驗證；Trail of Bits 先用 Semgrep、CodeQL 這類確定性的工具跑一遍，再讓 LLM 判斷哪些是真的。兩邊都沒有公布準確率，所以這篇只比做法，不排名。

## 以 Astro 加 Cloudflare Workers 為例：工具沒涵蓋你的堆疊時

兩個 repo 裡，我都找不到 Workers、D1、KV、Astro 或 Vectorize 的專屬檢查。Cloudflare 的 skill 雖是 Cloudflare 出品，內容卻是通用的審計流程，沒有 Workers 產品的專屬規則。最接近的是通用條目。Cloudflare 的雲端與部署附檔有一條 “Edge/runtime boundary mismatch”（edge 或 serverless 執行環境的假設與來源環境不同）。核心的攻擊類別裡有預覽、草稿、暫存洩漏，會問草稿內容能不能從搜尋、RSS、sitemap 被找到；資料隔離附檔則檢查搜尋、快取、嵌入、RSS 等衍生副本，在原記錄的權限改變後有沒有失效。這幾條對有草稿文章和搜尋索引的內容站有參考價值。

具體來說：

- Trail of Bits 的 Semgrep 規則集是依副檔名對應的：`.js`、`.jsx`、`.ts`、`.tsx` 對到 JavaScript、TypeScript、React、Node.js、Express、Next.js、Angular，`.astro` 不在表內。
- Cloudflare 的 skill 要求不能假設原始碼以外的部署控制存在或不存在，沒有證據的線索標成 `needs_validation`。Secrets 的實際值，以及帳號端的實際資源設定（Vectorize 索引、D1 資料與存取權、Workers AI 開關），都不在原始碼裡，所以這類線索會停在 `needs_validation`。binding 的宣告寫在 `wrangler.jsonc`，那是看得到的。
- Cloudflare 的 AI 與 LLM 附檔有 RAG 間接注入、embedding 跨租戶、記憶污染這些檢查，也寫明 “Prompt injection alone is not a finding”（單獨的 prompt injection 不算一個發現）。它沒有針對 Vectorize 這類特定向量資料庫產品的條目，只有通用的 embedding 與檢索租戶隔離檢查。
- Trail of Bits 的 supply-chain 審計器能讀的鎖檔有限：npm 只讀 `package-lock.json` 和 `npm-shrinkwrap.json`，另外讀 Python 的 `uv.lock` 與 Go 1.17 以上的 `go.mod`；[說明](https://github.com/trailofbits/skills/blob/HEAD/plugins/supply-chain-risk-auditor/skills/supply-chain-risk-auditor/SKILL.md)明寫不讀 `pnpm-lock.yaml`、`yarn.lock`、`poetry.lock`。偵測到時，報告會註明 present but not read，直接依賴的版本退回 manifest 的釘選或最新版，間接依賴的漏洞掃描也因為沒有鎖檔而做不了。所以只有 `pnpm-lock.yaml` 的專案，比對的不是你實際安裝的版本。兩份鎖檔並存時，[collect.py](https://github.com/trailofbits/skills/blob/HEAD/plugins/supply-chain-risk-auditor/skills/supply-chain-risk-auditor/scripts/collect.py) 依序找 `package-lock.json`、`npm-shrinkwrap.json`，用第一個存在的，程式裡沒有比較檔案新舊的地方，所以過期的 `package-lock.json` 會照樣被採用。這是我讀程式碼的結論，沒有實跑。

檢查自己的堆疊有沒有被涵蓋：clone 兩個 repo，在規則與附檔目錄搜尋你的框架與平台名稱，例如 `grep -rilw --exclude-dir=.git -e astro -e vectorize -e wrangler .`（`-w` 只比對整個單字，`-l` 只列檔名）。零命中，就表示只有通用規則。

## 用起來花多少、準不準

兩個專案都沒有公開在真實專案上的漏洞偵測準確率或誤報率（Trail of Bits 的部分 plugin 附有自建的 evals，那是 skill 本身的回歸測試）。使用者的回報零散：Hacker News 上有人說在小型 FastAPI 專案上至少用掉 15 萬 token 就撞到 session 上限；另一人說在中型程式庫丟了 100 萬 token 什麼都沒得到。這只是零星的個人經驗，不能當統計。

成本方面，Cloudflare 公開的 skill 有 `quick`、`standard`、`deep` 三種 profile，以及以 agent 呼叫次數計的 budget 上限。Cloudflare 內部的 harness 則把大範圍掃描當成定期的批次作業，最長一次跑了十四個小時以上。這是內部 harness 的數字，不是公開 skill 的。

## 授權

Cloudflare 的 skill 是 MIT。Trail of Bits 的 skills 是 CC-BY-SA-4.0（非法律意見）：只在自己的專案上跑審計，通常不受影響；要把內容改寫進自己的 skill 或產品，依條款得署名，並以相同授權散布。它的 Semgrep 規則放在另一個 repo（trailofbits/semgrep-rules），授權是 AGPLv3，不在 skills repo 的 CC-BY-SA 範圍內。

## 怎麼用

以下順序是依文件推的，我沒有跑過。

1. **先決定審什麼範圍。** 全專案做一次基準審計，用 Cloudflare 的流程；每次 PR 的差異審查，用 Trail of Bits 的 `differential-review`。範圍越小，花費越可控，別拿大範圍掃描當每次提交的檢查。Cloudflare 的 skill 預設是指引模式，只有你明確要求整份審計，才會跑完整六步。
2. **第一次只跑最小範圍，並設預算上限。** 我建議選一支你熟悉的 SSR 路由或一個已合併的 PR，用 `quick` profile 並設 budget 跑一次。記下花了多少 token、報出幾項、你打開程式碼確認後真的成立的有幾項。成立的比例太低，或花費超出你願意為每個 PR 付的數目，就不要擴大。想知道它們在你的專案上有沒有用，只能這樣自己跑一次。
3. **先備好沙箱，或接受降級。** 沒有作業系統層級的隔離時，需要執行目標程式碼才能確認的線索會停在 `needs_validation`；光靠原始碼就能追完的，仍可能判為已確認。沙箱怎麼選見[第 2 篇](/posts/ai/2026-10-24-agent-sandboxes)。
4. **先確認審計器讀得到你的鎖檔。** 執行 `ls package-lock.json pnpm-lock.yaml yarn.lock 2>/dev/null`，列出來的就是存在的。只有 `pnpm-lock.yaml` 時，Trail of Bits 的 supply-chain 審計拿不到你實際安裝的版本，也掃不了間接依賴（直接依賴的廢棄、維護者集中、安裝腳本等準則仍照 `package.json` 跑），所以依賴弱點改用 `pnpm audit`；它是 pnpm 自己的指令，和審計器各做各的，不會衝突。兩份並存時，對兩個檔各跑一次 `git log -1 --format=%cs -- <檔名>` 看最後修改日，審計器只會讀 `package-lock.json`，它若比 `pnpm-lock.yaml` 舊，就先把它移出專案。
5. **自己補專案背景。** 工具不認得 Workers 與 Astro，所以在你下給 agent 的審計指令開頭，直接貼一段背景。以本站為例：

   > 專案背景：Astro SSR，部署在 Cloudflare Workers。D1 用 binding `DB`，查詢集中在 `src/lib/db.ts`，請檢查是否都用參數綁定。Vectorize 與 KV 的 binding 宣告在 `wrangler.jsonc`。`draft: true` 的文章不應出現在 RSS、搜尋索引或 sitemap。

   換成你自己的堆疊即可。兩個專案的文件都沒有談這個做法。
6. **結果當線索，不當結論。** 每一項發現都自己打開對應的程式碼，確認攻擊者怎麼走到那一行；Trail of Bits 的 `fp-check` 就是為這一步設計的。

## 整體來說

這些 skill 沒有給 Claude 新的能力，Claude 本來就能讀程式碼找漏洞。它們給的是現成的東西：Cloudflare 把分階段與驗證的流程寫好，Trail of Bits 把 Semgrep、CodeQL 的串接與腳本備好。兩個專案都沒有你堆疊的專屬規則，也都沒有公布準確率，所以它們有沒有讓結果變好，要你自己在一個小範圍試過才知道，做法見上面第 2 點。這篇沒有試跑。

下一篇換一個目標：不審自己的原始碼，而是對運行中的 LLM 應用發出攻擊提示。

## 參考資料

- [cloudflare/security-audit-skill](https://github.com/cloudflare/security-audit-skill)
- [Cloudflare：Build your own vulnerability harness](https://blog.cloudflare.com/build-your-own-vulnerability-harness)
- [trailofbits/skills](https://github.com/trailofbits/skills)
- [Trail of Bits：supply-chain-risk-auditor 的 SKILL.md](https://github.com/trailofbits/skills/blob/HEAD/plugins/supply-chain-risk-auditor/skills/supply-chain-risk-auditor/SKILL.md)
- [Cloudflare：驗證與報告階段原文](https://github.com/cloudflare/security-audit-skill/blob/HEAD/skills/security-audit/VALIDATION-AND-REPORTING.md)
- [Hacker News 討論：Cloudflare security-audit skill](https://news.ycombinator.com/item?id=49736466)
- [上一篇：事後怎麼看見 agent 做過什麼](/posts/ai/2026-10-24-agent-detection-audit)
- [第 2 篇：沙箱怎麼選](/posts/ai/2026-10-24-agent-sandboxes)
