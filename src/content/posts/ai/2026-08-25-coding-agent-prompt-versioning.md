---
title: "Prompt 版本控制：改一個字可能讓 eval 從 5/5 掉到 0/5"
date: 2026-08-30
category: ai
type: deep-dive
tags: [coding-agent, prompt-engineering, versioning, eval, ab-testing]
lang: zh-TW
series:
  name: "跟成熟 coding agent 學設計"
  order: 25
tldr: "Looplane 的 prompt 已到 `m3-exact-edit-v4`：版本寫進 artifact，core/tool/interaction/runtime/instructions/skills/workspace/memory 以 stable/dynamic section 組裝，並加入 replace_text、unified diff、direct reply 的正反例。unit tests 已釘住結構，live eval 覆蓋仍需擴大。"
description: "以五個成熟 coding agent 的原始碼為證，分析 prompt 版本控制的四種做法與取捨：per-model prompt 檔、feature flag A/B、模板渲染、版本號常數綁 eval，以及 looplane 的選擇。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-25-coding-agent-prompt-versioning-en)

## 設計問題：prompt 改動怎麼審？

Prompt 是 coding agent 裡最奇怪的一種程式碼：它沒有型別、沒有測試會直接抓它，但改一個詞就可能讓任務成功率翻車。學術上有實測數字——[FormatSpread](https://arxiv.org/abs/2310.11324) 量測了同一語義內容在不同 prompt 格式下的表現差異，最大可達 76 個 accuracy points。也就是說「只是換個寫法」的 prompt diff，風險等級其實接近改核心演算法。

但一般 code review 流程對它無能為力：reviewer 看不出把 "prefer X" 改成 "always use X" 會不會讓模型在某類任務上拒絕用 Y 工具。所以真正的問題是——**prompt 改動要怎麼被追蹤、被審查、被驗證？** 五個成熟專案給了四種不同的答案。

## 五家怎麼做

**codex** 把 prompt 當成跟模型一起發佈的資產。`openai/codex` 的 repo 根層放著一排按模型世代命名的 prompt 檔：`codex/codex-rs/core/gpt_5_1_prompt.md`（331 行）、`gpt_5_codex_prompt.md`、`gpt_5_2_prompt.md` 等——每個模型家族有自己的完整 system prompt，不是一套通用文字加條件分支。執行時的選擇鏈在 `codex/codex-rs/models-manager/src/model_info.rs#with_config_overrides`：使用者設定覆蓋 > 檔案載入 > 內建 fallback（fallback 常數 `BASE_INSTRUCTIONS` 用 `include_str!("../prompt.md")` 編進 binary）；而正式的 per-model prompt 文本則隨 model catalog（`codex-rs/models-manager/models.json`）發佈，每個模型的 `instructions_template` 有 1.7 萬字元上下。次要 prompt（壓縮摘要、審查、權限說明）則集中在 `codex/codex-rs/prompts/src/compact.rs#SUMMARIZATION_PROMPT` 這類模板模組，統一 `include_str!` 管理。

**opencode** 走檔案即版本的極簡版：`sst/opencode` 在 `opencode/packages/opencode/src/session/prompt/` 下放了 `anthropic.txt`、`gpt.txt`、`gemini.txt`、`kimi.txt`、`codex.txt` 等十幾份 per-model prompt，由 `opencode/packages/opencode/src/session/system.ts#provider` 按 model id 字串比對選擇。沒有複雜機制，但「哪個模型配哪版 prompt」在檔案系統上一目了然。

**claude-code** 是最精細的一套。`anthropics/claude-code` 反編譯源的 `claude-code-source/src/constants/prompts.ts#getSystemPrompt` 把 system prompt 組裝成段落陣列，而且有兩個關鍵設計。第一，feature flag 直接決定 prompt 內容：`feature('KAIROS')`、`feature('EXPERIMENTAL_SKILL_SEARCH')` 這些 gate 決定某段指示要不要出現；內部員工（`USER_TYPE === 'ant'`）還能看到標注著實驗目的的段落，註解直接寫著「un-gate once validated on external via A/B」和成效數字——這就是拿 prompt 做 A/B 實驗的現場。第二，靜態與動態段落之間有明確的邊界標記 `SYSTEM_PROMPT_DYNAMIC_BOUNDARY`，前段跨使用者可快取、後段含 session 資訊不可快取，直接服務 prompt cache 命中率。

**omp**（can1357/oh-my-pi）把組裝做成模板渲染：`oh-my-pi/packages/coding-agent/src/system-prompt.ts#buildSystemPrompt` 匯入十幾份 `.md` 模板（主模板、三種人格 preset、安全段落），收集環境資訊、工具清單、skills 後填入 template data 渲染，還做了段落級去重避免使用者的 AGENTS.md 和內建規則重複。

**pi**（badlogic/pi-mono）是最小對照組：`pi-mono/packages/coding-agent/src/core/system-prompt.ts#buildSystemPrompt` 就是字串串接——customPrompt 整個替換預設值，加上工具清單與 context files。沒有版本號，因為上游靠 git 本身版本控制。

共同點只有一個：**prompt 不是散落在程式碼裡的字面量，而是一等公民的資產**——獨立檔案、集中管理、有明確的選擇邏輯。

## looplane 的選擇與差異

looplane 走的是五家都沒有那麼極端的路：**prompt 字串帶語義版本號常數，且版本演進必須綁 eval 證據**。

`looplane/src/looplane/prompts.py#CODING_AGENT_PROMPT_VERSION` 目前是 `"m3-exact-edit-v4"`。版本號仍會持久化進 session 與 `run.created`，但 prompt 已不再只是單一裸字串：`#PromptSection`、`#render_prompt_sections`、`#build_coding_agent_system_prompt` 會依序組出 core policy、tool policy、interaction policy、runtime context、instructions、skills、workspace state、memory，並明標 stable / dynamic cache metadata。這是 assembly baseline，不表示所有 provider 都已用相同 cache protocol 或命中率通過 production trace 驗證。

v1→v3 的演進是教科書式的觀察驅動：

- **v1**（M3）：只講 replace_text vs apply_patch 的分工與 read-before-edit，為的是救 qwen3:4b 找到正確修改卻吐出 malformed unified diff 的失敗模式。帶著 v1 跑真實 Ollama eval，5/5 通過。
- **v2**：互動中發現 agent 對打招呼也會去探索 repo、跑檢查。診斷文件 `docs/diagnoses/conversational-turn-redesign.md` 明確記錄改法參考了 kimi.txt 的條件式規則與 codex 的 chit-chat 措辭——加上的不是空話，而是「trigger→action」分支：沒有變更就直接跳到答案、不要碰 repository。
- **v3**：再收緊——capability questions（「你能幫我寫程式嗎？」）也要直接回覆，且不得探索 repo 或枚舉各種解讀來消歧義。
- **v4**：把寫法從抽象規則補成小型 examples 區。正例示範 `read_file → replace_text` 的 byte-for-byte 流程與 unified diff 形狀；反例明講不要猜 old_text；direct-reply example 說清楚 greeting、small talk、capability question 不該叫工具。`tests/test_prompts.py` 同時釘版本、例句與 section ordering。

跟五家的差異很清楚：codex/claude-code 有 eval 基礎建設但不公開單一 prompt 改動對應的 eval 證據；opencode/pi 靠 git history；looplane 則把「版本號 → 觀察到的失敗 → eval 結果」三方綁死在一條 commit 鏈上。代價也很誠實：eval 只覆蓋一個小 Python 任務加一個本地 4B 模型，5/5 不代表全面可靠——stage doc 自己就先聲明了。

## 工程依據

[OpenAI 的 GPT-4.1 prompting guide](https://cookbook.openai.com/examples/gpt4-1_prompting_guide) 直接建議 agentic 場景的 prompt 要「迭代、評估、再迭代」，把 prompt 當需要測試的程式而非一次性的文案。[Anthropic 的 prompt engineering 文件](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview)同樣把「先建立 eval 再改 prompt」列為前置步驟。[SWE-agent](https://arxiv.org/abs/2405.15793) 的結論更根本：agent 表現對介面設計（含 prompt 中的工具指引）極度敏感，介面即介面工程。至於 claude-code 的快取邊界設計，對應的是 [Anthropic prompt caching](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching) 的實務——靜態前綴可快取，動態尾巴不能混進去。

## 改善路線

1. **eval manifest 多樣化**：examples 與 v4 已有 unit tests，但 live eval 仍主要是 tiny Python task；至少要加入「純問答不觸發工具」與「錯誤 old_text 應回頭讀檔」案例，才算驗證新例子是否真的改變模型行為。
2. **prompt diff 進 CI**：`tests/test_prompts.py` 釘子句是好的第一步，下一步是讓 prompt 版本跳號必須附 eval summary 路徑，仿 M3 stage doc 的 evidence 格式。
3. **用 trace 驗證 section/cache 策略**：named stable/dynamic sections 已落地；下一步不是再拆更多段，而是確認各 provider payload 真的保留穩定前綴、cache trace 能解釋 hit/miss，再決定是否更動預設排序。
4. **catalog 化還不用做**：codex 的 per-model prompt 目錄是為幾十個模型服務的，looplane 目前只需在 provider adapter 層記錄「哪版 prompt 配哪些模型跑過 eval」即可。

## 參考資料

- [openai/codex](https://github.com/openai/codex)
- [sst/opencode](https://github.com/sst/opencode)
- [badlogic/pi-mono](https://github.com/badlogic/pi-mono)
- [can1357/oh-my-pi](https://github.com/can1357/oh-my-pi)
- [anthropics/claude-code](https://github.com/anthropics/claude-code)
- [FormatSpread: Quantifying Language Models' Sensitivity to Spurious Features in Prompt Design（arXiv:2310.11324）](https://arxiv.org/abs/2310.11324)
- [SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering（arXiv:2405.15793）](https://arxiv.org/abs/2405.15793)
- [OpenAI GPT-4.1 Prompting Guide](https://cookbook.openai.com/examples/gpt4-1_prompting_guide)
- [Anthropic Prompt Engineering Overview](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview)
- [Anthropic Prompt Caching](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching)
- [Looplane prompts（固定 commit `2ed5efb`）](https://github.com/vincentxuu/looplane/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/looplane/prompts.py)
