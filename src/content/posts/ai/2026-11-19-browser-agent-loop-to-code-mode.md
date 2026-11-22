---
title: "AI 瀏覽器的 agent 迴圈怎麼了：Stagehand、Notte、Browser Use 拿掉的是什麼，推論被搬到哪裡"
date: 2026-11-19
category: ai
type: deep-dive
tags: [browser-agent, browser-use, stagehand, code-mode, browser-automation]
lang: zh-TW
tldr: "2026 年下半年，Stagehand v4 移除 agent()、Notte 1.10 移除整個 agent 迴圈、Browser Use 1.0 換掉引擎。三家拿掉的是「框架自己定一份動作選單、每一步讓模型挑一個」的迴圈，推論本身被搬到兩個地方：撰寫期，由 AI 寫一次腳本、之後照跑（Stagehand code mode、Skyvern 的程式碼重播、Playwright Test Agents）；或交給 coding agent 的迴圈，每一步改成模型寫一段程式碼（Browser Use 1.0、Stagehand 的 MCP run 工具）。重複、路徑已知的任務適合前者；開放式搜尋和沒見過的網站還是需要每次推論。"
description: "AI 瀏覽器自動化的 agent 迴圈為什麼退場：舊的「固定動作選單＋框架迴圈」為什麼在 2024 年合理、後來為什麼成了瓶頸；Stagehand v4、Notte 1.10、Browser Use 1.0 各拿掉了什麼；推論搬到撰寫期與交給 coding agent 兩條路的證據與成本；以及什麼任務仍需要執行期推論。"
draft: false
series:
  name: "AI 瀏覽器自動化"
  order: 15
---

> :globe: [English version](/posts/ai/2026-11-19-browser-agent-loop-to-code-mode-en)

[上一篇 Browser Use](/posts/ai/2026-08-21-browser-use-complete-guide) 介紹的是典型的 agent 迴圈：讀頁面狀態、模型挑一個動作（click、type、scroll）、執行、再讀一次。那篇寫於 0.x 時代。2026 年 11 月 10 日發布的 Browser Use 1.0 把這個引擎整個換掉了。前後四個月內，Stagehand v4 移除了 `agent()`，Notte 1.10 移除了整個 agent 迴圈。

這篇回答：**這些工具拿掉的到底是什麼，推論被搬到哪裡去了；你的任務該讓 AI 寫一次腳本，還是每次都讓它在迴圈裡決定。**

## 四個月內的三個改變

| 工具 | 時間 | 拿掉什麼 | 改成什麼 |
|---|---|---|---|
| [Stagehand v4](https://docs.stagehand.dev/v4/migrations/v3) | 2026-08 | `agent()`：每一步讓模型從 act、extract、observe 挑一個 | 官方推薦 code mode（AI 寫一次腳本）；也保留讓模型在執行時呼叫工具的路線 |
| [Notte 1.10](https://github.com/nottelabs/notte) | 2026-10 | `notte.Agent`、workflows 和整個 agent 迴圈 | 用 SDK、CLI 或 MCP 讓外部 agent 驅動瀏覽器，寫好的自動化部署成 Functions |
| [Browser Use 1.0](https://github.com/browser-use/browser-use/blob/main/MIGRATING.md) | 2026-11 | 「每一步從 DOM 清單挑一個動作」的引擎，以及錄製重播 | 每一步讓模型在常駐的 Python REPL 裡寫一段程式碼，直接打 CDP |

三家的動作不完全一樣。Browser Use 1.0 的 `Agent` 在執行時仍然是一個迴圈，只是每一步的內容變了。所以共同點不是「不再推論」，而是：**框架不再自己定一份動作選單、自己寫迴圈。**

## 舊迴圈為什麼當時合理，後來為什麼成了瓶頸

舊做法是框架先決定兩件事：模型看到什麼（頁面上有哪些可點的元素），以及模型能做什麼（click、type、scroll 這幾個動作）。模型每一步只要挑一個。

在 2024 年這是對的。Browser Use 在〈[The Bitter Lesson of Browser Agents](https://browser-use.com/posts/bitter-lesson-browser-agents)〉裡回顧：「When we launched Browser Use in November 2024, GPT-4o wasn't trained for computer use.」Stagehand 的[遷移文件](https://docs.stagehand.dev/v4/migrations/v3)也說 `agent()`「was built for models that couldn't reliably drive a browser on their own」，每步挑一個工具「was the right shape for the models available at the time」。

模型變強之後，這兩份預先定義的清單反而變成限制：

- **框架給的頁面狀態會漏東西。** Browser Use 的原話：「A cookie button can be right there on the screen and missing from the state we send.」按鈕在畫面上，卻不在框架整理出來的清單裡，模型再聰明也點不到。他們用一個簡化的醫療系統例子說明：按鈕藏在 open shadow root 裡的跨網域 iframe 裡的 closed shadow root 裡。
- **每一步都是一次推論。** Stagehand 的遷移文件點出問題：好的腳本應該在 selector 穩定的地方直接用 `page.locator()`，只在需要判斷的地方花一次模型呼叫，「`agent()` couldn't make that split, because every step it ran was an inference call」。
- **固定的工具組跟不上模型。** Browserbase 在〈[Evolving computer use with code](https://www.browserbase.com/blog/evolving-computer-use-with-code)〉裡寫得更直接：act、extract、observe 這套工具是假設模型不可靠而設計的，「But we were so wrong」，這些抽象「ended up becoming hurtful limitations with every new generation of frontier model」。

```diagram
title: 推論在哪裡發生
desc: 三排。第一排「舊迴圈」：模型每一步從固定選單挑一個動作，交給框架執行，每一步都推論。第二排「撰寫期」：模型寫一次腳本，之後每次執行都直接跑腳本，不推論。第三排「交給 coding agent」：coding agent 的迴圈裡，模型每一步寫一段程式碼，直接操作瀏覽器。
caption: 第二排把推論移到執行之前，只在腳本壞掉時才再問模型；第三排的迴圈還在，但動作單位從「一個工具」變成「一段程式碼」，迴圈本身也不再由瀏覽器框架維護。
---
<svg viewBox="0 0 640 336">
  <text class="dg-tag" x="24" y="32" dominant-baseline="central">舊迴圈（STAGEHAND V3 AGENT()、BROWSER USE 0.X）</text>
  <rect class="dg-box" x="24" y="48" width="180" height="56" rx="6"/>
  <text class="dg-label" x="114" y="68" text-anchor="middle" dominant-baseline="central">模型挑一個動作</text>
  <text class="dg-sub" x="114" y="88" text-anchor="middle" dominant-baseline="central">每一步都推論</text>
  <rect class="dg-box" x="436" y="48" width="180" height="56" rx="6"/>
  <text class="dg-label" x="526" y="68" text-anchor="middle" dominant-baseline="central">框架執行</text>
  <text class="dg-sub" x="526" y="88" text-anchor="middle" dominant-baseline="central">click、type、scroll</text>
  <path class="dg-line" d="M204 76H432" marker-end="url(#arrow)"/>
  <text class="dg-edge" x="320" y="62" text-anchor="middle" dominant-baseline="central">固定選單</text>

  <text class="dg-tag" x="24" y="144" dominant-baseline="central">撰寫期（CODE MODE、程式碼重播、TEST AGENTS）</text>
  <rect class="dg-box dg-box--accent" x="24" y="160" width="180" height="56" rx="6"/>
  <text class="dg-label" x="114" y="180" text-anchor="middle" dominant-baseline="central">模型寫一次腳本</text>
  <text class="dg-sub" x="114" y="200" text-anchor="middle" dominant-baseline="central">壞掉時才再問</text>
  <rect class="dg-box" x="436" y="160" width="180" height="56" rx="6"/>
  <text class="dg-label" x="526" y="180" text-anchor="middle" dominant-baseline="central">每次照跑腳本</text>
  <text class="dg-sub" x="526" y="200" text-anchor="middle" dominant-baseline="central">執行時不推論</text>
  <path class="dg-line dg-line--accent" d="M204 188H432" marker-end="url(#arrow-accent)"/>
  <text class="dg-edge" x="320" y="174" text-anchor="middle" dominant-baseline="central">一般程式碼</text>

  <text class="dg-tag" x="24" y="256" dominant-baseline="central">交給 CODING AGENT（BROWSER USE 1.0、STAGEHAND MCP）</text>
  <rect class="dg-box" x="24" y="272" width="180" height="56" rx="6"/>
  <text class="dg-label" x="114" y="292" text-anchor="middle" dominant-baseline="central">模型寫一段程式碼</text>
  <text class="dg-sub" x="114" y="312" text-anchor="middle" dominant-baseline="central">迴圈由 harness 管</text>
  <rect class="dg-box" x="436" y="272" width="180" height="56" rx="6"/>
  <text class="dg-label" x="526" y="300" text-anchor="middle" dominant-baseline="central">瀏覽器</text>
  <path class="dg-line" d="M204 300H432" marker-end="url(#arrow)"/>
  <text class="dg-edge" x="320" y="286" text-anchor="middle" dominant-baseline="central">CDP 或 Playwright 碼</text>
</svg>
```

## 第一條路：把推論搬到撰寫期

讓 AI 在開發時寫一次腳本，之後每次執行都是一般程式碼。

- **Stagehand code mode。** 遷移文件的說法：「The model writes the code once instead of driving the browser on every run.」產出的是「ordinary code: reviewable, diffable, and free of per-step inference」，網站改版時，「re-run the assistant on the step that broke」。這是 Browserbase 推薦的起點。
- **Playwright Test Agents。** generator 把測試計畫寫成一般的 Playwright 測試，healer 在測試壞掉時找出替代的元素並提出修補。執行測試時沒有模型，見 [Stagehand vs Playwright](/posts/ai/2026-11-18-stagehand-vs-playwright)。
- **Skyvern 的程式碼重播。** agent 成功跑完一次後產生程式碼，之後直接跑；程式碼失敗時預設退回 agent、重新產生，見 [Skyvern 篇](/posts/ai/2026-11-19-skyvern)。

實際上線的團隊也走到同一個結論。[混合式 SDK 比較](/posts/ai/2026-11-19-ai-browser-sdk-comparison)提過的醫療系統團隊與 Forus，都是讓 AI 寫 Playwright 腳本、執行時不讓 AI 做決定。[Forus](https://build.forus.com/ehr-browser-automation-ai-agents) 文章裡的一節標題就是「Agents for authoring, but not for execution」。

## 第二條路：迴圈交給 coding agent，動作變成程式碼

另一條路沒有拿掉執行期的推論，而是改了兩件事：動作單位從「挑一個工具」變成「寫一段程式碼」，迴圈本身交給已經有大量使用者的 coding agent。

**Browser Use 1.0** 是最徹底的例子。[MIGRATING.md](https://github.com/browser-use/browser-use/blob/main/MIGRATING.md) 第一句：「The agent no longer picks one action per step from a DOM dump. It writes Python in a persistent REPL with browser-harness helpers and raw CDP, on Pydantic AI.」一步就是一次模型請求、一段 Python。Bitter Lesson 那篇把演進分成幾個階段：先讓模型寫程式碼取代挑動作，再讓模型直接打 CDP、自己決定要看什麼（「No mandatory list of clickable elements」），最後把迴圈交給現成的 harness：「Pi, Codex and OpenCode already handle the agent loop. Coding agents have millions of users trying all sorts of work.」它的 CLI 也是給 Claude Code、Codex 裝成 skill 用的。

要注意，Browser Use 1.0 同時[移除了錄製重播](https://github.com/browser-use/browser-use/blob/main/MIGRATING.md)（`rerun_history()`、`save_as_playwright_script()`），文件的建議是「run the task again」。它押的是第二條路，跟第一條路的方向相反。

**Stagehand 給 agent 的工具。** Browserbase 提供 MCP 的 `run`（執行一段程式碼）、`snapshot`、`screenshot` 三個工具，讓你自己的 agent 寫碼操作瀏覽器。他們在〈[Evolving computer use with code](https://www.browserbase.com/blog/evolving-computer-use-with-code)〉裡提到踩過一個坑：模型寫不好 Stagehand 的語法，「Stagehand was simply not in the weights」，最後改成讓模型寫 Playwright 程式碼，再即時轉譯成 Stagehand。

**Notte 1.10** 移除 agent 後，改成用 SDK、CLI、MCP 讓外部 agent 驅動瀏覽器。它的 README 與 [PR](https://github.com/nottelabs/notte/pull/1202) 沒有寫理由，只寫了移除什麼、改用什麼；[同一個版本](https://github.com/nottelabs/notte/releases/tag/v1.10.0)加入了 OpenAI Agents SDK、Claude Agent SDK 等一長串外部 agent 框架的整合。

模型廠商自己也這樣做。OpenAI 的 [computer use 指南](https://developers.openai.com/api/docs/guides/tools-computer-use)範例是一個逐輪的迴圈，工具 `exec_js` 讓模型每一輪寫一段操作 Playwright 物件的 JavaScript。

這條路省在哪裡？[混合式 SDK 比較](/posts/ai/2026-11-19-ai-browser-sdk-comparison)提過 LangChain 的[七組工具比較](https://www.langchain.com/blog/how-we-optimized-browser-use-for-deep-agents)（他們選定 Stagehand 之後寫的）。這裡要看的是步數：一次呼叫只做一個動作的 Playwright MCP 平均每題 26 步，讓 agent 寫程式碼的 Stagehand 工具組平均 10 步，成本因此差了約 13 倍。兩者都是執行期推論，省下的是「每個動作一次推論」變成「一段程式碼一次推論」。

## 推論還是少不了的地方

撰寫期腳本有一個前提：路徑事先知道。以下情況做不到：

- **開放式的搜尋。** [BrowseComp](https://arxiv.org/abs/2504.12516) 測的是在網路上持續找難找的資訊，論文的結果是準確率隨推論量平滑上升（「Accuracy scales smoothly with test-time compute」）。這類任務沒有能事先寫好的路徑。
- **沒見過的網站。** 第一次跑的流程沒有腳本可以重播，Skyvern、Stagehand 的程式碼重播也都要先跑過一次 agent。
- **頁面會漂移。** 版面調整、文案改動、A/B 測試都會讓生成的腳本壞掉。所以各家都保留了退路：Skyvern 的 AI fallback 預設開啟，Stagehand 保留在執行時呼叫工具的路線，Playwright 有 healer。

執行期推論的成本量級可以參考 Browserbase 的 [HardBench](https://www.stagehand.dev/evals) 排行（廠商自報）：102 個較難的瀏覽器任務，排行前段的模型加 coding agent 組合，每題要 $0.12 到 $3.07、好幾分鐘。這份排行比的是不同模型和 harness，沒有測腳本重播，不能直接拿來跟腳本比。

## 怎麼選：AI 寫一次，還是每次都在迴圈裡

- **同一個流程要跑上百次、路徑大致固定：寫一次腳本。** 把模型用在撰寫和修補，執行時只在真的需要判斷的步驟用 `act()` 這類單步呼叫。
- **一次性或探索性的任務、沒見過的網站：讓 agent 在迴圈裡做。** 選動作單位是程式碼的工具（Browser Use 1.0、Stagehand 的 `run`），步數和成本都比一次一個動作的工具少。
- **做錯的代價高：不要讓 AI 在執行時做決定。** 醫療系統團隊的結論是「Runtime AI is fine when the worst case is a retry, but not when the agent is making decisions you can't anticipate or review」（[Libretto](https://libretto.sh/blog/what-we-learned-building-healthcare-integrations)）。
- **讓 AI 寫程式碼來操作瀏覽器：把它當成在你的電腦上跑陌生程式。** Browser Use 1.0 的 REPL 以你的使用者身分執行模型寫的 Python，[官方文件](https://github.com/browser-use/browser-use/blob/main/MIGRATING.md)明說「This is not a sandbox」，不受信任的任務要放進容器或 VM。

## 想深入

Bitter Lesson 那篇說他們讓模型直接打 CDP、不用 Playwright，理由之一是「Playwright adds assumptions, such as locators that cannot see closed shadow roots」。為什麼做 agent 工具的團隊要拆掉 Playwright、自己寫 driver，以及要付出什麼代價，是下一篇 [driver 篇](/posts/ai/2026-11-18-cdp-vs-playwright-driver)的題目。

## 參考資料

- [Browser Use：MIGRATING.md（0.x → 1.0）](https://github.com/browser-use/browser-use/blob/main/MIGRATING.md)
- [Browser Use：The Bitter Lesson of Browser Agents](https://browser-use.com/posts/bitter-lesson-browser-agents)
- [Stagehand：Migrate v3 to v4](https://docs.stagehand.dev/v4/migrations/v3)
- [Browserbase：Evolving computer use with code](https://www.browserbase.com/blog/evolving-computer-use-with-code)
- [nottelabs/notte README](https://github.com/nottelabs/notte)
- [nottelabs/notte PR #1202：notte 1.10](https://github.com/nottelabs/notte/pull/1202)
- [Playwright：Test Agents](https://playwright.dev/docs/test-agents)
- [Skyvern：Browser automation（cached code）](https://github.com/Skyvern-AI/skyvern/blob/main/docs/developers/browser-automation.mdx)
- [Forus：EHR browser automation with AI agents](https://build.forus.com/ehr-browser-automation-ai-agents)
- [Libretto：What we learned building healthcare integrations](https://libretto.sh/blog/what-we-learned-building-healthcare-integrations)
- [LangChain：How we optimized browser use for Deep Agents](https://www.langchain.com/blog/how-we-optimized-browser-use-for-deep-agents)
- [OpenAI：Computer use](https://developers.openai.com/api/docs/guides/tools-computer-use)
- [Wei et al., BrowseComp（arXiv 2504.12516）](https://arxiv.org/abs/2504.12516)
- [Stagehand：Evals（HardBench）](https://www.stagehand.dev/evals)
