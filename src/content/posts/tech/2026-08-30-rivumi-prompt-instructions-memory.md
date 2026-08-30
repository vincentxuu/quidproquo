---
title: "Rivumi 的 prompt、instruction precedence 與 explicit memory：模型最後看見了什麼"
date: 2026-08-30
category: tech
type: deep-dive
tags: [rivumi, coding-agent, prompt-engineering, memory, agents-md]
lang: zh-TW
tldr: "Rivumi 先在應用程式層解析 user 與 root-to-leaf 專案 instructions，再把 runtime、skills、workspace 與最近 20 筆 explicit memory 放進具名 prompt sections。這套流程可追蹤、可 reload，但不是 semantic memory，也不會把 repo 文字升格成 system authority。"
description: "追蹤 Rivumi 如何解析 AGENTS.md／RIVUMI.md、組裝具名 system prompt sections、載入 typed JSONL memory，並在檔案變動時重新注入 context。"
series:
  name: "Rivumi 架構拆解"
  order: 3
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-30-rivumi-prompt-instructions-memory-en)

[上一篇](/posts/tech/2026-08-23-rivumi-disposable-clone-run-bundle)把 source repo、執行 workspace 與 run artifacts 分開了。workspace 準備好以後，模型還不能直接開工：Rivumi 得先回答「這個任務有哪些規則、現在在哪個環境、哪些舊資訊可以帶進來」。Rivumi 沒有任意拼接一大段字串；它建立了一條有順序、有上限、可追蹤來源的 context pipeline。

## 從檔案到第一輪 messages

`AgentRunner._initial_messages()` 是入口。它依序取得 explicit memory、instruction documents、skills、tool schema、runtime 與 workspace 狀態，再交給 `build_coding_agent_system_prompt()`。產物先放一則 system message，使用者任務則是下一則 user message。

system prompt 內部使用具名 section，順序固定：核心角色、tool policy、互動規則等穩定內容在前；runtime、instructions、skills、workspace 與 memory 等動態內容在後。每段有版本與明確邊界，整體動態 context 也有長度限制。這個排列還能讓 provider cache strategy 辨識穩定 prefix，但 cache hint 的細節留到 [order 6](/posts/tech/2026-08-30-rivumi-model-routing-fallback-cost)。

```text
stable core / tool / interaction
            ↓
runtime → instructions → skills → workspace → memory
            ↓
        user task
```

段落名稱只是表面，provenance 才是重點。看到一條限制時，可以回頭判斷它來自 runtime contract、repo instruction，還是使用者先前明確記住的偏好。

## Instruction precedence 是應用程式解析結果

Rivumi 會讀設定的 user instruction，接著從專案 root 往目前工作目錄逐層尋找 `AGENTS.md` 或 `RIVUMI.md`。一般情況下，越深的目錄越接近手上檔案，因此後載入；若某層出現 override instruction，先前的 project layers 會被標成 suppressed，但 user layer 仍保留。

讀檔本身也有限制：必須是 regular file、不能是 symlink、大小有上限，而且必須是 UTF-8。diagnostics 會保留 active 與 suppressed 文件，讓「為什麼這份規則生效」可以被檢查，而不是只留下最後一坨文字。

不過，這裡的 precedence 不能解讀成模型 API 的權限升級。Rivumi 先在應用程式層決定哪些 repository instructions 要被渲染；進入 prompt 後，它們仍是 Rivumi 注入的專案 context，不會因為檔名叫 `AGENTS.md` 就取得高於真正 system/developer message 的 authority。機械性的 tool、permission 與 sandbox 限制也不靠這段文字執行。

## Explicit memory 只記使用者真的要求記住的事

Rivumi 的 memory baseline 很克制。`/remember` 解析三種型別：user preference、project fact、project preference，然後以 append-only JSONL 寫入。載入時，系統取 user preferences 加上完全相符的 project entries，最後只注入最近 20 筆，格式化成 `Known context`。

這表示它適合保存「這個專案使用 pnpm」或「回答請用台灣中文」一類明確資訊。它目前沒有 embedding search、語意排名、衰減、去重、更新、刪除，也不會從每輪對話自動猜哪些句子值得永久保存。損壞的 JSONL 行會被跳過，避免一筆壞資料讓整個 run 無法啟動，但這也提醒我們：memory store 是輸入資料，不是不可挑戰的真相。

## 執行中規則變了怎麼辦

初始 prompt 不是永遠凍結。Rivumi 會對 instructions 與 project context 算 fingerprint；執行途中若 fingerprint 改變，就重新解析並以 injected context 告訴模型新的 active/suppressed 狀態。無效 reload 會留下 event，但不會拿不完整內容覆蓋原本有效的 context。

這個 reload 解決的是長任務中的 drift，不代表每次 model request 都重建全部 system prompt。event journal 會記錄 reload，resume 時也能從既有 messages 判斷哪些提醒已經送過。

## 這層真正提供的保證

這套設計提供的是 bounded、versioned、source-aware 的 context 組裝：規則從哪來、哪些被蓋掉、memory 為何被選中，都有程式路徑可追。它沒有保證模型一定服從文字，也沒有把 explicit JSONL 包裝成完整長期記憶系統。

下一篇進入 [provider-neutral native loop](/posts/tech/2026-08-23-rivumi-provider-neutral-agent-loop)：這些 messages 送進模型後，tool call、verification 與 termination 如何推動狀態。

---

## 參考資料

- [Rivumi 官方 repo](https://github.com/vincentxuu/rivumi)
- [instruction resolution source](https://github.com/vincentxuu/rivumi/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/rivumi/instructions.py)
- [prompt builder source](https://github.com/vincentxuu/rivumi/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/rivumi/prompts.py)
- [explicit memory source](https://github.com/vincentxuu/rivumi/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/rivumi/memory.py)
- [instruction and prompt tests](https://github.com/vincentxuu/rivumi/tree/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/tests)
