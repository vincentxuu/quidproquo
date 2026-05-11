---
title: "OpenAI 用 Codex 寫了 100 萬行程式碼：Harness Engineering 實戰"
date: 2026-04-21
type: guide
category: ai
tags: [harness-engineering, codex, openai, agent-first, agents-md, agentic-coding]
lang: zh-TW
tldr: "OpenAI 內部團隊 5 個月、3 人、0 行手寫程式碼，用 Codex 交付了一個完整產品。這篇整理他們在 AGENTS.md 設計、repo-local 知識庫、架構強制執行、entropy 管理上的核心心得。"
description: "OpenAI 第一手分享用 Codex 做 agent-first 開發的實戰心得：AGENTS.md 應該是 TOC 而非百科、所有知識必須在 repo 裡、架構 invariant 用 linter 強制、用 garbage collection agent 對抗 code entropy。"
draft: false
series:
  name: "AI Agent 實戰"
  order: 8
---

OpenAI 工程師 Ryan Lopopolo 在 2026 年初發表了一篇第一手報告，描述他們內部用 Codex 打造一個完整產品的過程：3 人團隊、5 個月、0 行手寫程式碼、約 100 萬行程式碼產出，平均每人每天合出 3.5 個 PR。這不是概念驗證，而是一個真正上線的產品。這篇文章整理他們在這段過程中對 agent-first 開發模式的核心理解。

## 工程師的角色不再是「寫程式碼」

傳統工程師的工作是寫程式碼解決問題。在 agent-first 的模式下，這個定義已經改變。

Lopopolo 的描述是：工程師的工作變成三件事——設計環境讓 agent 能夠成功執行、清楚表達意圖、建立 feedback loop 讓 agent 能夠自我修正。實際寫程式碼的是 Codex，而人的職責是確保 Codex 有足夠好的環境和資訊。

這個轉變帶來一個思維上的關鍵轉換：當 agent 卡住或產出不對的東西時，不應該問「我要怎麼更努力 prompt 才能讓它成功」，而應該問「這個任務需要哪種能力？它現在缺少的是什麼？」前者是繞過問題，後者才是真正解決問題。把缺少的能力補進環境裡（工具、文件、測試、linter），之後所有類似任務都會受益，而不是只解決了這一次。

## AGENTS.md：Table of Contents，不是百科全書

AGENTS.md 是 Codex 讀取的主要 context 文件，告訴 agent 這個 repo 是什麼、如何運作。很多團隊的直覺是把所有東西都塞進去，但 Harness 團隊的經驗是：這樣做反而讓它失效。

理由很直接：文件太長，重要資訊就會被稀釋。agent 讀一份 1000 行的 AGENTS.md，裡面真正關鍵的 10 行的權重就跟其他 990 行一樣低。而且長文件很快就會過時——每次 code 改動都要同步更新，沒有人做得到。

他們的解法是把 AGENTS.md 控制在約 100 行，讓它只扮演一個角色：Table of Contents。它指向真正的知識，而不是包含它。真正的技術細節、設計決策、架構說明，全部放在 `docs/` 目錄底下，以獨立的設計文件、執行計畫、product spec 等形式存在。AGENTS.md 只告訴 agent「如果你要處理 X，去看 `docs/X.md`」。

這樣的好處是每份文件的範圍是清楚的，更新也只需要動對應的那份文件。

## 知識必須住在 Repo 裡

這是這套方法最具體、也最有操作意義的原則：所有 agent 需要的知識都必須在 repo 裡。

Slack 訊息 agent 看不到。Google Docs agent 看不到。口耳相傳的慣例 agent 更看不到。如果一個設計決策只活在某次會議記錄或某個聊天串裡，對 agent 來說它就不存在。結果是 agent 會做出看起來合理但其實違反某個重要決策的實作，然後 review 的人才發現問題。

Harness 團隊的做法是把所有知識系統性地寫進 `docs/` 目錄，包括架構設計、技術債說明、已知限制、過去的決策理由。他們還進一步替這些文件建立了 CI linter，確保 cross-link 不會過時——如果一份文件提到另一份文件，CI 會驗證目標連結確實存在。

他們甚至有一個 doc-gardening agent，定期掃描文件、發現過時或不一致的地方，自動開 PR 修正。文件品質本身也被納入自動化流程。

## 架構約束靠 Linter，不靠文件

光靠文件說明「不要這樣做」是不夠的。Agent 讀到文件，可能遵守，也可能在複雜任務裡忽略。更根本的問題是：文件說的事情沒有任何強制力。

Harness 團隊的解法是把架構 invariant 轉成 CI 強制規則。他們的 codebase 有一條明確的依賴方向：types → config → repo → service → runtime → UI，每一層只能依賴比它更底層的模組，不能反向。這條規則以 custom linter 的形式存在，違反了就過不了 CI。

這個 linter 本身也是 Codex 寫的。這是一個很有說服力的示範：用 agent 建立限制 agent 行為的工具。規則一旦用 code 表達，就不會被遺忘、不需要靠人記住、也不需要在 code review 時靠人發現。

## Merge 哲學的改變：高吞吐量下的取捨

當每個人每天合出 3.5 個 PR 時，傳統的 CI 策略開始產生摩擦。Flaky test 在正常吞吐量下是個煩人但可忍受的問題；在高吞吐量下，它變成了一個實質的 blocker。

Harness 團隊的做法是：flaky test 用重跑處理，不 block PR。他們的判斷是，在這個模式下，修 bug 比因為 flaky test 卡住等待便宜。這不代表接受不穩定的測試，而是把處理優先序做了調整——讓 PR 先過，再另外追蹤和修復不穩定的測試。

這是一個意識到吞吐量改變後，對流程做出對應調整的例子。

## Agent 產生的 Code Entropy

Agent 很擅長複製現有 pattern。問題是，它複製的不只是好的 pattern，也包括壞的。一個被廢棄但還沒清理的 helper function，在 agent 眼裡跟一個現役的一樣。舊的 import 路徑、過時的 API 用法、不一致的命名，全部都是 agent 可能複製並擴散的 entropy 來源。

高吞吐量讓這個問題加速。100 萬行的 codebase 裡，entropy 積累的速度遠比 3 個人能手動清理的速度快。

他們的解法是用一個 garbage collection agent 定期掃描 codebase，識別出應該被清理的 pattern，自動開 refactor PR。人只需要花不到一分鐘 review 這些 PR，確認沒問題就 merge。清理工作本身也被自動化，不是靠工程師記得要做。

## 自動化的終點在哪裡

Lopopolo 描述了他們目前能達到的自動化程度：一個 prompt 進去，接下來的流程是——重現 bug、錄影記錄問題、實作修復、錄影確認修復、開 PR、回應 reviewer 的留言、merge。整個流程裡，只有在需要真正判斷的地方才會 escalate 給人工介入。

這不是「AI 幫我自動完成一些步驟」，而是「整個流程預設由 AI 跑完，人只在關鍵節點介入」。這兩者之間的差異很大，前者是輔助工具，後者是角色結構的重新設計。

## 整體來說

Harness Engineering 這套方法最核心的取捨是：把工程師的時間從「寫程式碼」移向「設計系統讓 agent 能夠寫好程式碼」。這需要前期投入——建立好的文件結構、寫 linter、設計可靠的 feedback loop。這些工作不會立刻看見產出，但它們是讓 agent 能夠長期維持品質的基礎設施。

它也揭示了一個限制：這套方法對 repo 的健康度和知識管理的要求比傳統開發高很多。如果 docs 不完整、架構規則沒有被 CI 強制、知識散落在 repo 外部，agent 的產出品質會快速下滑，而且問題很難被追蹤到根因。

對想採用這套方法的團隊來說，最重要的準備不是選哪個 agent 工具，而是問：「我們的 repo 是否有足夠清楚的知識讓 agent 讀懂它？」

---

## 參考資料

- [Harness engineering: leveraging Codex in an agent-first world](https://openai.com/de-DE/index/harness-engineering/) — Ryan Lopopolo, OpenAI (Feb 11, 2026)
- [OpenAI Codex CLI — Harness Engineering 與 AGENTS.md agent-first 開發基底](https://github.com/openai/codex)
- [OpenAI 介紹 Codex：Agentic Coding 與 agent-first 工程模式](https://openai.com/index/introducing-codex/)
- [Unrolling the Codex agent loop — Codex Harness Engineering 的 agent loop 技術細節](https://openai.com/index/unrolling-the-codex-agent-loop/)
