---
title: "AI Agent GitHub Digest — 2026-11-15"
date: 2026-11-15
category: daily
tags: [ai-agent, github, open-source, daily, ci-cd, code-review, security]
lang: zh-TW
description: "GitHub、Alibaba、OpenAI、DeepSeek 同週把自己內部在用的 agent 工具開源出來,四個題目不同,但都在回答同一個問題：寫入權限要怎麼收窄才敢放進生產環境"
tldr: "GitHub gh-aw（CI 自動化）、Alibaba open-code-review(程式碼審查)、OpenAI codex-security(資安掃描修補)、DeepSeek dsh-superagent-prototype(自主 coding agent 原型)同週開源;共同主線是寫入範圍的收緊程度,不是能力強弱"
series:
  name: "AI Agent GitHub Digest"
  order: 92
---

> :globe: [English version](/posts/daily/2026-11-15-ai-agent-github-digest-en)

## 今日亮點

今天沒有新框架,四個題目分別來自 GitHub、Alibaba、OpenAI、DeepSeek,但串起來看是同一件事:這些大廠把自己真的在用的 agent 工具原封不動開源出來,而且都在回答「agent 要碰生產環境,寫入權限該收到多窄」,只有 DeepSeek 的原型反過來,示範的是往更自主的方向走會長什麼樣子。

## Trending Repos

### github/gh-aw ★ 5,636

[GitHub](https://github.com/github/gh-aw)　·　Go　·　MIT

- **是什麼**：GitHub 官方的專案,把 CI 自動化寫成會判斷的 Markdown——frontmatter 設定事件和權限,正文用自然語言描述任務,`gh-aw` 編譯成真正的 GitHub Actions workflow,由 Claude Code、Codex、Copilot 或 Gemini 等 agent 執行推理步驟。
- **為什麼值得看**：以前 CI 自動化只能寫死規則,碰到「這個 issue 該怎麼分類」「這次失敗是不是已知問題」這種要判斷的任務就沒辦法。gh-aw 把推理步驟交給 agent,但刻意把「讀」和「寫」拆成兩個 job：agent 本身唯讀、跑在沙箱裡,真正要寫 GitHub(開 issue、留言、開 PR)要經過另一個權限明確縮小過的 safe-outputs job,是目前對「給 agent 寫入權限」拆解得最仔細的設計之一。但設計精良不代表沒有實作漏洞——11 月初才修掉一個 critical 等級的洞(GHSA-8h78-hpm7-29gg):0.83.3–0.85.3 版本的 safe-outputs 產出物,會把帶認證資訊的 git 指令原始輸出存進 artifact,而且是在 Actions 的 secret 遮罩生效**之前**就寫進去,憑證沒被遮住就留在下載得到的 artifact 裡;0.85.4 已修。
- **tech stack**：Go CLI(`gh` extension)+ GitHub Actions + 可替換的 AI engine。
- **上手難度**：中——`gh extension install github/gh-aw` 很快,但要先讀懂權限模型才敢打開寫入功能。

---

### alibaba/open-code-review ★ 51,279

[GitHub](https://github.com/alibaba/open-code-review)　·　Go　·　Apache-2.0

- **是什麼**：阿里巴巴把內部用到自己規模的程式碼審查工具開源出來,架構是「規則引擎 + LLM」疊在一起:NPE、thread-safety、XSS、SQL injection 這類能用靜態規則抓到的問題先過一輪確定性規則,LLM agent 只負責規則抓不到、需要上下文判斷的部分,兩邊都支援 OpenAI 和 Anthropic 相容後端。
- **為什麼值得看**：這波「AI 做 code review」的工具大多是純 LLM,容易因為沒有確定性底盤而產生看起來像真問題、實際上是幻覺的留言。open-code-review 反過來,把規則引擎當主幹、LLM 當補強,是少數敢把「哪些判斷該用規則、哪些該用模型」攤開來設計的例子。目前只產生 line-level 留言,不會自己改程式碼或合併,寫入範圍很窄。
- **tech stack**：Go 核心 + npm 發佈的 CLI(`@alibaba-group/open-code-review`),拿到 OpenSSF Best Practices 徽章。
- **上手難度**：低——npm 裝完就能跑,README 直接寫了跟 Claude Code 搭配使用的方式。

---

### openai/codex-security ★ 13,503

[GitHub](https://github.com/openai/codex-security)　·　TypeScript　·　Apache-2.0

- **是什麼**：OpenAI 把自己的 Codex 資安掃描包裝成獨立的 CLI 和 TypeScript SDK——可以掃整個 repo、單一路徑或一次 git diff,找到問題後先驗證是不是真的,再產生修補 patch,也能生成 SECURITY.md、輸出 SARIF / JSON / CSV,串 Linear、Jira、GitHub。
- **為什麼值得看**：這是把「agent 找出並修掉漏洞」做成一個可以排進 pipeline 的獨立產品,而不是聊天視窗裡的一個功能,跟 Claude Code 的 `/security-review` 剛好可以互相對照:兩邊都是「掃描 → 驗證 → 修補」,差別在 codex-security 刻意往外部整合(issue tracker、CI、報表格式)的方向做。產生的 patch 需要人工套用,不會自動合併進主分支。這個 repo 今年 7 月才建立,比起前兩個已經靠產品大規模驗證過的工具,還在累積實戰案例。
- **tech stack**：TypeScript CLI/SDK,npm 發佈(`@openai/codex-security`),附 GitHub Action。
- **上手難度**：低——`npm install -g`、`cs login`、`cs scan .` 三步就能跑。

---

### deepseek-ai/dsh-superagent-prototype ★ 23,128

[GitHub](https://github.com/deepseek-ai/dsh-superagent-prototype)　·　TypeScript　·　MIT

- **是什麼**：DeepSeek 自己的研究原型,一個綁定單一 GitHub repo 的主動式程式碼 agent,建在「DeepSeek Harness」上。它會監聽 GitHub(也能接 Feishu/Lark),被允許的人提出需求後自己開工作項目、在自己的 session/目錄裡動工,完成再回報。
- **為什麼值得看**：這是大廠少見直接把「往更自主的 agent 系統邁進」的研究雛形公開出來——repo 說明上明寫這是 prototype,連 issue 和 wiki 都沒開,文件裡也承認「部分描述的行為在這個原型裡還沒做」。跟前三個「把生產工具開源」不同,這個更像是在示範 DeepSeek 下一步想往哪個自主程度走,還不是能直接拿來用的東西。
- **tech stack**：TypeScript,DeepSeek Harness 封裝格式。
- **上手難度**：高——這本質上是給 DeepSeek Harness 用的 prototype/bundle,不是通用安裝即用的工具。

今天這四個可以放在同一張圖上比:誰的「寫入範圍」收得最窄,誰在拿掉護欄換自主性。

```diagram
title: 四個大廠 agent 工具的寫入範圍收緊程度
desc: 比較 GitHub gh-aw、Alibaba open-code-review、OpenAI codex-security、DeepSeek dsh-superagent-prototype 在上手難度、寫入範圍可控、是否已大規模驗證三個面向的定性落差。
caption: 定性比較,依本文描述的設計與現況判斷,不是量化分數。
---
<svg viewBox="0 0 640 384">
  <rect class="dg-band dg-band--accent" x="347" y="16" width="136" height="304" rx="6"/>

  <text class="dg-label" x="278" y="40" text-anchor="middle" dominant-baseline="central">容易上手</text>
  <text class="dg-label dg-text--accent" x="415" y="40" text-anchor="middle" dominant-baseline="central">寫入範圍可控</text>
  <text class="dg-label" x="552" y="40" text-anchor="middle" dominant-baseline="central">已大規模驗證</text>
  <line class="dg-rule" x1="20" y1="64" x2="620" y2="64"/>
  <line class="dg-rule" x1="20" y1="128" x2="620" y2="128"/>
  <line class="dg-rule" x1="20" y1="192" x2="620" y2="192"/>
  <line class="dg-rule" x1="20" y1="256" x2="620" y2="256"/>
  <line class="dg-rule" x1="20" y1="320" x2="620" y2="320"/>

  <text class="dg-label" x="32" y="86" dominant-baseline="central">gh-aw</text>
  <text class="dg-sub" x="32" y="108" dominant-baseline="central">CI 自動化,GitHub 官方</text>
  <circle class="dg-dot dg-dot--hollow" cx="278" cy="96" r="9"/><path class="dg-dot" d="M278 87A9 9 0 0 0 278 105Z"/>
  <circle class="dg-dot dg-dot--hollow" cx="415" cy="96" r="9"/><path class="dg-dot" d="M415 87A9 9 0 0 0 415 105Z"/>
  <circle class="dg-dot" cx="552" cy="96" r="9"/>

  <text class="dg-label" x="32" y="150" dominant-baseline="central">open-code-review</text>
  <text class="dg-sub" x="32" y="172" dominant-baseline="central">規則引擎 + LLM 審查</text>
  <circle class="dg-dot" cx="278" cy="160" r="9"/>
  <circle class="dg-dot" cx="415" cy="160" r="9"/>
  <circle class="dg-dot" cx="552" cy="160" r="9"/>

  <text class="dg-label" x="32" y="214" dominant-baseline="central">codex-security</text>
  <text class="dg-sub" x="32" y="236" dominant-baseline="central">掃描 → 驗證 → 產 patch</text>
  <circle class="dg-dot" cx="278" cy="224" r="9"/>
  <circle class="dg-dot dg-dot--hollow" cx="415" cy="224" r="9"/><path class="dg-dot" d="M415 215A9 9 0 0 0 415 233Z"/>
  <circle class="dg-dot dg-dot--hollow" cx="552" cy="224" r="9"/><path class="dg-dot" d="M552 215A9 9 0 0 0 552 233Z"/>

  <text class="dg-label" x="32" y="278" dominant-baseline="central">dsh-superagent</text>
  <text class="dg-sub" x="32" y="300" dominant-baseline="central">DeepSeek 自主 agent 原型</text>
  <circle class="dg-dot dg-dot--hollow" cx="278" cy="288" r="9"/>
  <circle class="dg-dot dg-dot--hollow" cx="415" cy="288" r="9"/>
  <circle class="dg-dot dg-dot--hollow" cx="552" cy="288" r="9"/>

  <text class="dg-tag" x="20" y="344" dominant-baseline="central">圖例</text>
  <circle class="dg-dot" cx="84" cy="344" r="7"/>
  <text class="dg-small" x="98" y="344" dominant-baseline="central">做得好</text>
  <circle class="dg-dot dg-dot--hollow" cx="184" cy="344" r="7"/><path class="dg-dot" d="M184 337A7 7 0 0 0 184 351Z"/>
  <text class="dg-small" x="198" y="344" dominant-baseline="central">部分做到</text>
  <circle class="dg-dot dg-dot--hollow" cx="296" cy="344" r="7"/>
  <text class="dg-small" x="310" y="344" dominant-baseline="central">做不到／要另外補</text>
  <rect class="dg-band dg-band--accent" x="452" y="336" width="16" height="16" rx="3"/>
  <text class="dg-small" x="476" y="344" dominant-baseline="central">本段重點</text>
</svg>
```

## Notable Releases

今日無重要框架更新。LangGraph 1.2.22、CrewAI 1.15.41、Composio CLI 0.6.1、llama_index 0.14.26 都在過去 48 小時內發過版,但都是 patch 等級的依賴修補或小 bugfix;browser-use 1.0.5 加了一個自我評估的「judge」功能,但份量不足以單獨開一段。

## 今日收穫

之前以為「開源 agent 工具」這件事主要是框架或平台方在推銷新想法,但今天看到的是四間差異很大的公司幾乎同時把自己內部真的在用的工具原封不動開源出來,而且重點幾乎都不是「能力有多強」,是「寫入權限收得夠不夠窄」。這可能代表 agent 的推理能力已經夠用,接下來比的是誰能把自動化的寫入範圍收緊到人放心交出去,而 gh-aw 自己上個月才修的那個憑證外洩漏洞,正好說明「設計上收緊了權限」跟「實作上真的沒有洞」是兩件不同的事。

## 參考資料

- [github/gh-aw](https://github.com/github/gh-aw)
- [GHSA-8h78-hpm7-29gg：Safe-output artifacts may expose CI trigger tokens](https://github.com/github/gh-aw/security/advisories/GHSA-8h78-hpm7-29gg)
- [alibaba/open-code-review](https://github.com/alibaba/open-code-review)
- [openai/codex-security](https://github.com/openai/codex-security)
- [deepseek-ai/dsh-superagent-prototype](https://github.com/deepseek-ai/dsh-superagent-prototype)
