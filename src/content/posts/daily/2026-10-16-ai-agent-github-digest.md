---
title: "AI Agent GitHub Digest — 2026-10-16"
date: 2026-10-16
category: daily
tags: [ai-agent, github, open-source, daily]
lang: zh-TW
description: "今天 trending 和 release 都在講同一件事——怎麼讓 agent 少燒 token：caveman 4.0、xerj 用索引取代 grep，Haystack 和 DSPy 也各補了一招"
tldr: "caveman（112,360★，今日 +530）4.0 新增 Auto 與 Blocks，宣稱同分數省 54% 成本；VoiceStudio（68,575★，+3,027）是全本機跑的 ElevenLabs 替代品，支援 646 種語言；xerj（5,432★，+725）用 Rust 索引取代 grep，讓 agent「參考既有開源實作」輸出 token 降 2.7 倍；TokenSpeed（2,405★，+25）是非營利基金會維護的 agentic 推理引擎。Release：DSPy 3.4.1（GEPA 預設走結構化 proposer、RLM 能建 sub-agent）、Haystack v3.4.0（ToolResultOffloadCompactor 用外部 store 取代摘要）。"
series:
  name: "AI Agent GitHub Digest"
  order: 62
---

> 🌏 [English version](/posts/daily/2026-10-16-ai-agent-github-digest-en)

## 今日亮點

今天從 trending 到 release 都在講同一件事：怎麼讓 agent 少燒 token。caveman 靠「說話精簡、讀輸出精簡」省字數，xerj 直接用索引取代一行一行讀檔，Haystack 則是把舊的 tool 結果搬到外部 store 而不是摘要掉——殊途同歸，但解法一個比一個乾淨。

## Trending Repos

### JuliusBrussee/caveman ⭐ 112,360 (+530)
[GitHub](https://github.com/JuliusBrussee/caveman)　·　Go　·　Apache-2.0

- **是什麼**：讓 coding agent 用「山頂洞人語」說話、讀檔前先把 log／JSON／測試輸出壓縮過的 skill + proxy，程式碼本身不受影響。
- **為什麼值得看**：4.0 版把功能拆成六塊，新增 **Auto**（自動選模型與思考力度，54% 更便宜、分數不變）和 **Blocks**（agent 把寫過的腳本留著重跑，一次測試從 397 token 降到 76）。Adobe Research 的論文引用了這個repo，JetBrains 和 Elastic Labs 也各自做過獨立 A/B 測試，結果互相印證。
- **Tech stack**：Go CLI + npm 套件，支援 Claude Code、Codex、Gemini CLI、OpenCode 等 30 多種 agent
- **上手難度**：低——`npx @caveman-ai/cli@latest` 一行裝完，用你自己的 Claude Pro/Max 登入和金鑰

---

### debpalash/VoiceStudio ⭐ 68,575 (+3,027)
[GitHub](https://github.com/debpalash/VoiceStudio)　·　Python　·　開源

- **是什麼**：開源、可完全在本機跑的 ElevenLabs 替代品，涵蓋語音複製、語音設計、影片配音、聽寫、轉錄和有聲書製作，支援 646 種語言。
- **為什麼值得看**：今天單日 +3,027 顆星，是這批候選裡漲得最快的。全本機執行代表聲音資料不用送上雲端，對配音、客服錄音這類隱私敏感場景很有吸引力，也補上了語音 AI 開源生態裡「本機」這一塊長期缺口。
- **Tech stack**：Python
- **上手難度**：中——本機跑語音模型通常要吃 GPU，雲端代管方案目前沒看到公開資料

---

### xerj-org/xerj ⭐ 5,432 (+725)
[GitHub](https://github.com/xerj-org/xerj)　·　Rust　·　Apache-2.0

- **是什麼**：用 Rust 寫的本機 AI 搜尋索引，一個指令把整個資料夾（程式碼、文件、log、PDF）自動索引起來，讓 agent 改用搜尋取代一行一行讀檔，介面相容 Elasticsearch，舊 client 直接能接。
- **為什麼值得看**：主打場景是「Reference coding」——讓 agent 先找出跟手上任務最像的開源實作，索引起來參考它怎麼解過這個問題，再動手寫。作者的受控測試顯示這能把輸出 token 砍到 2.7 倍、解題率維持 16/16 不變；社群回報日常使用大約省到 5 倍。
- **Tech stack**：Rust、單一靜態執行檔，一鍵接 Claude Code/Cursor 的 MCP + skill
- **上手難度**：中——預設只綑 `127.0.0.1`，但 `--insecure` 模式會關掉 TLS 和 API key 驗證，只適合單人開發機，正式環境要照文件設信任邊界

---

### lightseekorg/tokenspeed ⭐ 2,405 (+25)
[GitHub](https://github.com/lightseekorg/tokenspeed)　·　Python　·　Apache-2.0

- **是什麼**：由非營利 LightSeek Foundation 維護、NVIDIA 和 AMD 掛名提供硬體與工程支援的 LLM 推理引擎，主打 agentic workload。
- **為什麼值得看**：架構上把控制平面（C++ 寫的有限狀態機，編譯期就能保證 KV cache 資源安全）跟執行平面（Python，方便研究者快速迭代）徹底分開，PyTorch Foundation 的生態網誌特別點名這個設計。不屬於任何一家商業公司，走「中立瑞士」路線，這在一堆廠商主導的推理引擎裡算是少見。
- **Tech stack**：C++ 控制平面 + Python 執行平面 + 自製 MLA kernel
- **上手難度**：中——面向生產推理叢集，不是單機玩具

## Notable Releases

### DSPy 3.4.1
[Release Notes](https://github.com/stanfordnlp/dspy/releases/tag/3.4.1)

- **重要變更**：`dspy.GEPA` 預設換成結構化的 `InstructionProposer`，透過 `JSONAdapter` 呼叫 reflection LM，讓 `dspy.History`、工具軌跡、`dspy.Image` 等輸入維持結構化而不是塞成一段文字；`dspy.RLM` 的 REPL 現在可以自己 `import dspy` 建 sub-agent（`Predict`／`ChainOfThought`／`ReActV2`／巢狀 `RLM`），跟主 agent 共用同一個 `max_llm_calls` 預算。
- **Breaking Changes**：GEPA 的 reflection LM 現在必須能回傳 JSON；`dspy.ReActV2` 的 signature 不能再用 `history` 或 `tools` 當輸入欄位名；3.4.0 存下來、`Score` 欄位是 null 的進度檔讀不回來了。
- **對你的影響**：用 GEPA 做過優化的專案，升級後即使 seed 一樣，結果也可能跟 3.4.0 不同，建議先重跑一次評估基準再比較。

---

### Haystack v3.4.0
[Release Notes](https://github.com/deepset-ai/haystack/releases/tag/v3.4.0)

- **重要變更**：新的 `ToolResultOffloadCompactor`——觸發 context 壓縮時不直接摘要或丟掉舊的 tool 結果，而是寫進外部 `ToolResultStore`,原地留一個參照，agent 需要時用一個 read tool 讀回完整內容;另外正式支援 Python 3.15,拿掉已經 EOL 的 Python 3.10。
- **Breaking Changes**：多個 splitter 的 `page_number` 算法改了——跨頁的 chunk 現在回報「開始」的那一頁，不是「結束」的那一頁，含分頁符的文件要重新索引才能拿到正確頁碼;`ChatMessage.from_openai_dict_format` 碰到用 URL 引用的圖片或 `file_id` 會直接丟 `ValueError`,不再悄悄吞掉。
- **對你的影響**：有把 `page_number` 顯示給使用者或存進向量庫的專案，升級後要重新索引含分頁符的文件;轉發 OpenAI 格式訊息時用 URL 引用圖片的地方要改成下載後用 base64 inline。

## 今日收穫

之前以為「省 token」的招數不外乎縮短輸出或換便宜模型，今天看到 xerj 用索引取代一行一行 grep、Haystack 用外部 store 取代摘要，才意識到更乾淨的做法是一開始就不讓不必要的東西進 context,而不是等它塞滿了再想辦法壓縮回去。

## 參考資料

- [JuliusBrussee/caveman — GitHub](https://github.com/JuliusBrussee/caveman)
- [debpalash/VoiceStudio — GitHub](https://github.com/debpalash/VoiceStudio)
- [xerj-org/xerj — GitHub](https://github.com/xerj-org/xerj)
- [lightseekorg/tokenspeed — GitHub](https://github.com/lightseekorg/tokenspeed)
- [GitHub Trending（daily）](https://github.com/trending?since=daily)
- [DSPy 3.4.1 — GitHub Releases](https://github.com/stanfordnlp/dspy/releases/tag/3.4.1)
- [Haystack v3.4.0 — GitHub Releases](https://github.com/deepset-ai/haystack/releases/tag/v3.4.0)
