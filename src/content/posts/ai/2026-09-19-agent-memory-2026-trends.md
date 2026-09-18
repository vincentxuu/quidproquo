---
title: "2026 記憶系統往哪走：檔案贏了向量，遺忘才剛開始"
date: 2026-09-19
category: ai
type: deep-dive
tags: [agent-memory, trends, context-engineering, dreaming, benchmark, procedural-memory]
series:
  name: "AI Agent 記憶工程"
  order: 9
lang: zh-TW
tldr: "2026 上半年 OpenAI、Anthropic、Letta、LangChain 不約而同選了 Markdown 檔案 + 索引取代向量資料庫；寫入權從 agent 交還給人；遺忘機制終於出現但沒人做 Ebbinghaus；LoCoMo 被 Penfield Labs 抓出 6.4% 錯答；三家同時用「Dreaming」指離線記憶整併。五個趨勢，一個結論：記憶不是功能，是架構決策。"
description: "從設計哲學光譜、寫入權歸屬、遺忘機制、benchmark 失效到 Dreaming 合流，整理 2026 年 agent 記憶系統的五個走勢與一條實務建議。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-09-19-agent-memory-2026-trends-en)

這是[「AI Agent 記憶工程」系列](/posts/ai/2026-09-19-agent-memory-engineering-series-intro)的第十篇（order 9），也是收尾。前面九篇分別拆解了[短期 context 管理](/posts/ai/2026-08-21-context-full-seven-answers)、coding agent 和雲端平台的記憶設計、開源框架選型、[Mem0](/posts/ai/2026-08-22-mem0-agent-memory) 與 [OpenViking](/posts/ai/2026-08-22-openviking-agent-memory) 深潛、以及攻擊面。這篇不再介紹新系統，而是拉高一層看走勢：2026 年這個領域正在發生什麼，以及如果你現在要下注，該把籌碼放在哪裡。

## 趨勢一：往左走——檔案贏了向量

2024–2025 年的主流敘事是「向量資料庫 + 知識圖取代 context window」。到了 2026 上半年，產品端的選擇出乎意料地往反方向走。

OpenAI 的 Codex Memories 和 [Agents SDK sandbox memory](https://openai.github.io/openai-agents-python/sandbox/memory/) 把記憶存成 `memories/memory_summary.md`、`MEMORY.md` 索引、`rollout_summaries/` 目錄——全是 Markdown 檔案。Anthropic 的 [Claude Code auto memory](https://code.claude.com/docs/en/memory) 用 `~/.claude/projects/<project>/memory/` 加 `MEMORY.md` 索引。[Managed Agents memory store](https://platform.claude.com/docs/en/managed-agents/memory) 是文字文件集合，掛載到 `/mnt/memory/<slug>/`。Letta 從 memory tools 轉向 git-backed [Context Repositories / MemFS](https://www.letta.com/blog)。LangChain 的 Fleet（原 LangSmith Agent Builder）用 `memories/` 資料夾，每次更新須使用者核准。

四家不同公司，不約而同選了同一種儲存形態。理由一致：

1. **人可讀可審**——Markdown 檔案不需要特殊工具就能打開、理解、修改
2. **進得了 git**——可以版本控制、code review、diff、revert
3. **與 prompt cache 相容**——記憶放在 cache 前綴裡，session 中不變動就不會打破 cache；依 [Anthropic 官方文件](https://code.claude.com/docs/en/prompt-caching)，「每輪動態注入記憶會打破 cache」是刻意避免的
4. **不需要額外 infra**——不用跑向量資料庫、不用管 embedding 模型版本相容

向量和圖記憶並沒有消失，但退居「可插拔後端」的位置。Mem0 靠整合進 AWS AgentCore、Microsoft Agent Framework、LlamaIndex 存活。Zep / Graphiti 靠 bi-temporal 知識圖的獨特能力保有一席之地。但如果你今天從零開始建記憶系統，業界的預設選擇已經不是向量，而是檔案。

這條趨勢在研究筆記裡的[設計哲學光譜](/posts/ai/2026-09-19-agent-memory-engineering-series-intro)上看得最清楚——從最左（CLAUDE.md，人寫的 git 檔案）到最右（Cognee，全自動知識圖），2026 年的重心明顯偏左。

## 趨勢二：寫入權從 agent 交還給人

記憶系統最敏感的操作不是讀取，是寫入。寫入決定了 agent 下一次會「記得」什麼，而錯誤的記憶比沒有記憶更危險——它會持久化地影響後續每一次推理。

2026 年有五個獨立的產品決策指向同一個方向：把記憶寫入的最後一步交還給人。

- **Gemini CLI Auto Memory**（[官方文件](https://geminicli.com/docs/cli/auto-memory)）：agent 草擬記憶 patch 和 SKILL.md 候選，放進審核 inbox，使用者核准才生效
- **LangSmith Fleet**（2026-01-13 GA）：記憶就是 `memories/` 資料夾裡的檔案，每次更新須使用者核准
- **Devin Knowledge Suggestions**（[官方文件](https://docs.devin.ai/product-guides/knowledge)）：從對話回饋自動建議 Knowledge 條目，使用者核准才寫入
- **Cursor 1.2**（[changelog](https://cursor.com/changelog/1-2)）：對背景產生的記憶加入核准流程（後來 2.1.17 直接移除了 Memories 功能）
- **GitHub Copilot Memory**（[工程部落格](https://github.blog/ai-and-ml/github-copilot/building-an-agentic-memory-system-for-github-copilot)）：每條記憶附引用（citation），讀取時 JIT 驗證——引用的程式碼若已不存在，記憶就不用

驅動這些決策的原因是一樣的：記憶是持久化的 prompt injection 攻擊面。MINJA 論文（[2503.03704](https://arxiv.org/abs/2503.03704)，NeurIPS 2025）證明只靠對話就能注入記憶，注入成功率 >95%。Johann Rehberger 2024-09 示範的 SpAIware 攻擊讓 ChatGPT macOS app 的記憶被植入持久外洩指令。自動寫入如果沒有閘門，等於給攻擊者一個永久的後門。

目前業界的防線分成兩派：
- **核准派**：Gemini CLI inbox、LangSmith Fleet、Devin Knowledge Suggestions——agent 提案，人按按鈕
- **驗證派**：Copilot 的引用 + JIT 驗證——不攔寫入，但讀取時驗證來源是否仍然有效

兩派各有代價。核准派增加人的認知負擔（inbox 堆多了就沒人看），驗證派依賴引用的品質（引用不準確就無法驗證）。但兩派的共識是：**完全自動的寫入，在 2026 年已經不是可接受的預設值**。

## 趨勢三：遺忘機制出現了，但仍然粗糙

2025 年的記憶系統幾乎都是「只能手動刪」。2026 年終於有了自動遺忘：

| 系統 | 遺忘方式 | 粒度 |
|---|---|---|
| GitHub Copilot | 28 天未被 JIT 驗證即刪 | 逐條 |
| OpenAI Codex | `max_unused_days` 30 天（可設 0–365） | 逐條 |
| Zep / Graphiti | bi-temporal 時間失效（edge 有 `expired_at`） | 逐邊 |
| Mem0 | `expiration_date` + 排名 decay | 逐條 + 排序 |
| Anthropic Managed Agents | 版本保留 30 天 | 逐版本 |

進步是明顯的。但沒有任何系統實作了 MemoryBank 論文（[2305.10250](https://arxiv.org/abs/2305.10250)，AAAI 2024）提出的 Ebbinghaus 式衰減——根據記憶被存取的頻率和間隔動態調整強度。現有的遺忘都是「超過 N 天就砍」或「手動刪」，沒有一家做到「重要的記得久，不重要的自然淡化」。

這個缺口很可能是下一輪競爭的焦點。認知科學早就知道遺忘不是 bug 而是 feature——適度遺忘能減少干擾、提高檢索精度。但工程上要做到，需要記錄每條記憶的存取歷史，然後用某種衰減函數更新權重。在目前以檔案為主的儲存形態下（趨勢一），這不容易——檔案系統不原生支援存取頻率追蹤。

## 趨勢四：Benchmark 被玩壞了

LoCoMo（[2402.17753](https://arxiv.org/abs/2402.17753)，ACL 2024）和 LongMemEval（[2410.10813](https://arxiv.org/abs/2410.10813)，ICLR 2025）是記憶領域最常引用的兩個 benchmark。但到了 2026 年，廠商自報的數字已經沒有參考價值。

問題一：**分數通膨**。2025 年的 SOTA 在 LoCoMo 上是 60–70 分。到 2026 年，Mem0 自報 92.5、Zep 自報 94.7、EverMemOS 自報 93.05、Hindsight 自報 89.61。judge 模型、prompt、backbone 一換，分數能差 40 分。

問題二：**benchmark 本身有缺陷**。Penfield Labs 在 2026-04 的稽核（B 級來源）發現 LoCoMo 有 6.4% 的標準答案本身是錯的，而 LLM judge 接受了 63% 的錯答。LongMemEval-S 的整份評測資料可以塞進現代 1M context window，意味著它測的不是記憶能力，而是長 context 理解。

問題三：**現實任務更難**。ICLR 2026 的 MemoryAgentBench（[2507.05257](https://arxiv.org/abs/2507.05257)）評測四項記憶能力（事實回憶、偏好追蹤、事件推理、對話總結），最長 1.44M tokens——沒有任何系統能同時掌握全部四項。MemoryArena（[2602.16313](https://arxiv.org/abs/2602.16313)）進一步測試互相依賴的多 session 任務，LoCoMo 上飽和的系統在這個設定下掉到 40–60%。

結論：**看廠商自報的 LoCoMo / LongMemEval 數字，請一律打折**。如果你要評估記憶系統，用 MemoryAgentBench 或自己設計的端到端任務測，不要只跑單一 benchmark。

## 趨勢五：Dreaming 與 procedural memory 合流

2026 上半年，三家公司不約而同採用「Dreaming」這個詞來指稱同一件事：**離線背景整併記憶**。

- **OpenAI ChatGPT Dreaming**（[2026-06-04 公告](https://openai.com/index/chatgpt-memory-dreaming)）：背景跨對話整併，產出使用者可編輯的 memory summary 頁。官方內部評測：事實回憶 67.9% → 82.8%，偏好遵循 55.3% → 71.3%，時間一致性 52.2% → 75.1%
- **Anthropic Managed Agents Dreaming**（[2026-05-19 research preview](https://claude.com/blog/new-in-claude-managed-agents)）：排程回顧 session 與 memory store，產出整理過的新 store，可自動套用或人工審核
- **Letta Dreaming subagents**：sleep-time compute（[2504.13171](https://arxiv.org/abs/2504.13171)）的產品化，閒置時預先推理整理記憶

這不是新概念——Generative Agents（[2304.03442](https://arxiv.org/abs/2304.03442)，UIST 2023）的 reflection、Letta 的 sleep-time compute 早就做了類似的事。但「Dreaming」在 2026 年變成了產品功能，而不只是研究論文。

與此同時，**procedural memory（怎麼做事）正在與 Skills 合流**：

- Gemini CLI Auto Memory 直接產出 SKILL.md 候選
- OpenAI sandbox memory 的 `skills/` 目錄
- Letta 用 skills 取代部分記憶工具
- Microsoft Foundry 推出 `procedural_memory_enabled` 旗標

「學會怎麼做」被視為與「記得什麼」同等重要的記憶類型。而承載形式，又回到了趨勢一——可版本控制的檔案。

ACE 論文（[2510.04618](https://arxiv.org/abs/2510.04618)，ICLR 2026，Stanford / SambaNova / Berkeley）用 Generator–Reflector–Curator 三角色自動演化 playbook，宣稱能取代微調。這可能是 procedural memory 的下一步：不是人寫 skill 檔，也不是 agent 自行寫入，而是一個專門的演化流程持續改進。

## 附帶觀察：模型代際比記憶策略更重要

Anthropic [2026-04-02 公布](https://claude.com/blog/harnessing-claudes-intelligence)的 BrowseComp 數字值得單獨拿出來看：

| 模型 | BrowseComp（compaction 下） |
|---|---|
| Sonnet 4.5 | 43% |
| Opus 4.5 | 68% |
| Opus 4.6 | 84% |

同一套 compaction 策略，模型升一代，成績從 43% 跳到 84%。這意味著記憶 / compaction 策略的效果高度依賴模型本身對「context 焦慮」的耐受度。花三個月打磨記憶管線，可能不如等模型升級有效。

OpenAI [cookbook（2026-05-01）](https://developers.openai.com/cookbook/examples/agents_sdk/building_reliable_agents_memory_compaction)用一句話總結了分工：「compaction 幫這次 run 繼續，memory 幫下次 run 有起點，人審過的 memo 才是 source of truth。」

## 現在該押什麼，不該追什麼

根據以上五個趨勢，如果你現在要為自己的 agent 加記憶，我的建議是：

**該做的**：
1. **從 Markdown 檔案 + 索引開始**，不要從向量資料庫開始。檔案覆蓋 80% 的場景，而且永遠可以後加向量層
2. **寫入要有閘門**——至少讓管理者能看到和刪除記憶，最好有核准或驗證機制
3. **compaction 是標配**——如果你的 agent 跑超過 10 輪對話，沒有 compaction 就是在浪費錢和品質
4. **模型升級優先於記憶管線優化**——同一筆預算，升模型比精雕記憶策略的 ROI 更高

**不該追的**：
1. **不要追 LoCoMo / LongMemEval 分數**——這兩個 benchmark 已經無法區分好壞，用端到端任務測
2. **不要自建向量 / 圖記憶層**——除非你有 Zep 等級的時態需求，否則用現成的（Mem0 / AgentCore / Memory Bank）當可插拔後端就好
3. **不要追 Dreaming 當功能賣點**——離線整併有用，但目前三家的實作都還在 preview / research 階段，API 和行為都可能變
4. **不要忽略安全**——記憶注入不是理論攻擊，是已被驗證的實務風險；至少實作系列第九篇（攻擊面）裡提到的基本防護

記憶不是一個可以「加上去」的功能。它是架構決策——決定了你的 agent 跨 session 的行為一致性、使用者信任、安全邊界、以及維運複雜度。2026 年的好消息是，業界終於開始在這些維度上趨同。壞消息是，還沒有人做對所有的事。

## 參考資料

- [Anthropic — Claude Code Memory 官方文件](https://code.claude.com/docs/en/memory)
- [Anthropic — Claude Code Prompt caching 官方文件](https://code.claude.com/docs/en/prompt-caching)
- [Anthropic — Managed Agents Memory 官方文件](https://platform.claude.com/docs/en/managed-agents/memory)
- [Anthropic — Harnessing Claude's intelligence（2026-04-02）](https://claude.com/blog/harnessing-claudes-intelligence)
- [Anthropic — New in Claude Managed Agents（Dreaming，2026-05-19）](https://claude.com/blog/new-in-claude-managed-agents)
- [OpenAI — Agents SDK Sandbox Memory 官方文件](https://openai.github.io/openai-agents-python/sandbox/memory/)
- [OpenAI — Dreaming: Better memory for ChatGPT（2026-06-04）](https://openai.com/index/chatgpt-memory-dreaming)
- [OpenAI — Building reliable agents: memory & compaction（cookbook，2026-05-01）](https://developers.openai.com/cookbook/examples/agents_sdk/building_reliable_agents_memory_compaction)
- [Google — Gemini CLI Auto Memory 官方文件](https://geminicli.com/docs/cli/auto-memory)
- [GitHub Engineering — Building an agentic memory system for GitHub Copilot](https://github.blog/ai-and-ml/github-copilot/building-an-agentic-memory-system-for-github-copilot)
- [Cursor — 1.2 Changelog](https://cursor.com/changelog/1-2)
- [Cognition — Devin Knowledge 官方文件](https://docs.devin.ai/product-guides/knowledge)
- [Letta — Sleep-time Compute 論文（2504.13171）](https://arxiv.org/abs/2504.13171)
- [Letta — Context Repositories / Next Phase 部落格](https://www.letta.com/blog)
- [LoCoMo — ACL 2024（2402.17753）](https://arxiv.org/abs/2402.17753)
- [LongMemEval — ICLR 2025（2410.10813）](https://arxiv.org/abs/2410.10813)
- [MemoryAgentBench — ICLR 2026（2507.05257）](https://arxiv.org/abs/2507.05257)
- [MemoryArena（2602.16313）](https://arxiv.org/abs/2602.16313)
- [MemoryBank — AAAI 2024（2305.10250）](https://arxiv.org/abs/2305.10250)
- [MINJA — NeurIPS 2025（2503.03704）](https://arxiv.org/abs/2503.03704)
- [CoALA — TMLR 2024（2309.02427）](https://arxiv.org/abs/2309.02427)
- [Generative Agents — UIST 2023（2304.03442）](https://arxiv.org/abs/2304.03442)
- [ACE: Agentic Context Engineering — ICLR 2026（2510.04618）](https://arxiv.org/abs/2510.04618)
- [SpAIware — Johann Rehberger（2024-09）](https://embracethered.com/blog/posts/2024/chatgpt-macos-app-persistent-data-exfiltration/)
- [系列前篇：Context 滿了怎麼辦：七種答案](/posts/ai/2026-08-21-context-full-seven-answers)
- [系列前篇：Mem0 完整介紹](/posts/ai/2026-08-22-mem0-agent-memory)
- [系列前篇：OpenViking——Agent 記憶做成虛擬檔案系統](/posts/ai/2026-08-22-openviking-agent-memory)
