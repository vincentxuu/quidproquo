---
title: "Deep Research Agent 怎麼蓋：多輪搜尋規劃、衝突調和、可驗證結論"
date: 2026-06-04
category: ai
type: deep-dive
tags: [deep-research, ai-agent, multi-agent, retrieval, llm]
lang: zh-TW
tldr: "自主研究 agent = 四個可控環節：規劃（拆子問題）、檢索迴圈（search→read→反思 gap→再 search）、證據仲裁（≥2 獨立來源、衝突分型處理）、可驗證輸出（句級引用 + 獨立查核 pass）。兩條路線：訓練派用 RL 端到端學會何時搜（Search-R1 +41%），編排派用 orchestrator-worker 分工（Anthropic 內部評測 +90.2%，代價 ~15× token）。"
description: "拆解 OpenAI Deep Research、Anthropic Research、GPT Researcher、NVIDIA AI-Q 的架構差異：多輪搜尋的自主規劃機制、停止條件設計、異質來源衝突調和（RA-RAG）、citation grounding 與 attribution 評估，附一個可落地的參考架構。"
draft: false
---

「Deep research」類產品在 2025 年集體爆發：OpenAI Deep Research、Anthropic 的 Research 功能、Perplexity Deep Research，加上開源的 GPT Researcher 與 NVIDIA AI-Q。它們要解的是同一個問題：**讓 agent 自主規劃多輪搜尋、綜合異質且可能矛盾的來源、產出每句話都能查證的結論**。這篇把這件事拆成四個可控環節，對照業界兩條路線，最後給一個可落地的參考架構。

四個環節：**規劃**（把模糊大題拆成可獨立查證的子問題）、**檢索迴圈**（search → read → 反思 gap → 再 search，直到夠了）、**證據仲裁**（去重、可信度加權、衝突調和）、**可驗證輸出**（句級 citation + 獨立查核 pass）。

## 兩條路線：訓練派 vs 編排派

**訓練派**用 RL 端到端訓練模型「自己學會」何時搜、搜什麼、何時停。OpenAI Deep Research 是 o3 變體，對瀏覽 + 推理任務做 end-to-end RL，單次 query 可跑數十次搜尋、28 分鐘；但 OpenAI 自己公布的 pass rate 僅 15–25%——能用，未取代專家。開源代表 Search-R1（arXiv:2503.09516）把搜尋引擎當成 RL 環境的一部分，用 retrieved-token masking 穩定訓練、outcome-based reward，讓 Qwen2.5-7B 對 RAG baseline **+41%**——證明小模型也學得會多輪搜尋。

**編排派**不動模型，用 orchestrator-worker 架構把規劃、檢索、綜合、查核分工。Anthropic 在 [multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system) 公開的數字最具代表性：lead agent 規劃後開 3–5 個平行 subagent（各自獨立 context window），內部評測比單 agent **+90.2%**——但代價是約 **15 倍 token 消耗**（token 用量解釋了 80% 的效能變異）。

取捨判準：多 agent 並行只在「任務能拆成獨立平行支線」的廣度型研究划算；緊耦合任務（如寫程式）反而適合單 agent 序列。Cognition 的反向觀點值得並列：多 agent 容易 lost context、subagent 資料難管——實務多走混合，能獨立就平行，緊耦合就序列。

## 環節一：多輪搜尋的自主規劃

| 機制 | 做法 | 代表 |
|---|---|---|
| Plan-and-Execute | planner 先產出子問題 / 大綱，executor 平行檢索 | GPT Researcher、NVIDIA AI-Q（4–6 條 query 對映報告各節） |
| Iterative retrieval | search → 讀結果 → 依新發現改下一個 query | OpenAI / Perplexity Deep Research |
| Interleaved RL | 推理中自主產生 query，搜尋是 RL 環境的一部分 | Search-R1 |
| Adaptive retrieval | 模型自己判斷「這段需不需要查」 | Self-RAG |

重點觀念：**規劃不是一次性的**。OpenAI DR 遇到付費牆會內部推理「換個非官方網站可能比較好」然後改搜政府公開摘要——這種對即時資訊反應、回溯、改寫 query 的能力是 RL 訓練出來的，不是寫死的流程。「要不要查、查什麼」這層決策的完整方法地圖，站內另一篇 [Agentic RAG 的三個決策層](/posts/ai/2026-06-04-agentic-retrieval-decisions)有展開。

## 環節二：何時停止搜尋

最被低估、但直接決定成本與品質的一環。四種做法：Self-RAG 用 critique token（`ISSUP` 是否被證據支持、`ISUSE` 有用性）當續搜 / 停手訊號；NVIDIA AI-Q 用固定迴圈上限（預設 research loop = 2，務實但鈍）；Search-R1 只看最終答對與否，讓模型自己學到「夠了就停」——但社群實測指出這常導致**過度搜尋**（不需要時也搜三次），建議在 reward 加搜尋懲罰；編排派則派一個 completeness critic 問「還缺什麼」，把缺口變成下一輪工作。

設計準則：**停止條件要顯式 log 出來**（搜了幾輪、為何停）——靜默截斷會讓使用者誤以為覆蓋完整。

## 環節三：異質來源的衝突調和

當來源彼此矛盾，不能讓 generation 階段「隱性」決定信誰——主流做法是把衝突處理**前移到證據層**。RA-RAG（arXiv:2410.22954）先用跨源交叉查核自動估計來源可信度，再做加權多數投票、只諮詢少數可靠來源。更關鍵的是**衝突分型**（DRAGged into Conflicts，arXiv:2506.08500 等多篇）：query 歧義型衝突應該**呈現多個有效答案**，來源錯誤型才該過濾——不能一律硬選一個。

可直接抄的證據紀律：每個事實至少 **2 個獨立來源**才寫進結論，單源標 unverified；來源品質排序「官方 > 一手作者 > 高品質二手 > 內容農場」；衝突的事實列出來、不選邊，讓讀者拍板。一個反直覺的提醒：把「多數一致」當可信度準則會**偏向錯誤的多數**——消息源彼此抄襲時，一致性不等於正確。

## 環節四：可驗證結論

「可驗證」= 每句論斷能追溯到具體來源，且有獨立 pass 確認引用真的支持該句。

生成端：OpenAI DR 為每個事實掛句級可點擊引用，指向來源的確切段落；Anthropic Research 用**獨立的 citation 階段**在綜合後補引用——writer 和 citation 分離，避免自己給自己背書；GPT Researcher 的多 agent 版（LangGraph）有 Reviewer 驗證草稿、Reviser 依回饋修訂的迴圈。

評估端：attribution 不是 binary，分 **full / partial / no support** 三級；常用 NLI 模型自動判斷（AutoAIS），但 CiteEval（arXiv:2506.01829）批評 NLI-only 是次佳 proxy。更要緊的警訊來自 INLG 2024 與 ACL 2025 Findings 兩篇獨立研究的一致結論：**沒有單一 faithfulness metric 在所有情境都最好**，自動查核器本身有偏誤——自動化可降本，高風險結論仍需人工複核。更強的做法是對抗式查核：對每個關鍵論斷派 N 個獨立 skeptic、預設傾向反駁，多數反駁才砍掉。

## Anthropic 的四件實戰教訓

編排派最值得抄的工程細節，全部來自 Anthropic 的官方覆盤：

1. **委派契約四要素**：每個 subagent 要有目標、輸出格式、用哪些工具與來源、任務邊界——缺一個就 drift、重工。
2. **隔離邊界**：subagent 之間互不知情、各自獨立 context，才能真正平行且不淹沒 lead 的 context window。
3. **產出寫檔、回傳引用**：subagent 把成果存到 filesystem，只回傳輕量 reference——避免多階段傳話遊戲的資訊流失。
4. **Extended thinking 當 scratchpad**：lead 用思考過程規劃 subagent 數量；subagent 在工具結果後評估品質、找 gap、改寫下一個 query。

## 參考架構

```
使用者大題
  ├─[澄清] 互動式追問縮小範圍（可選）
  ├─[規劃] 拆 3–6 個可獨立查證子問題 → 寫進 plan 檔
  │        委派契約 = 目標 + 輸出格式 + 來源/工具 + 邊界
  ├─[檢索迴圈] 每子問題（可平行，各自 context）：
  │        search → read → 反思 gap → 改寫 query → 再 search
  │        停止：充分性 critic / 迴圈上限 / 搜尋懲罰（都要 log）
  │        每個事實 ≥2 獨立來源
  ├─[證據仲裁] 拆 atomic claims → 偵測衝突 → 可信度加權
  │        歧義型：呈現多答案；錯誤型：過濾 → 產出事實交叉表
  ├─[綜合] 依大綱寫報告（成果寫檔、回傳 reference）
  └─[查核] 獨立 citation pass + N 個 skeptic 對抗式驗證
           完整性 critic：還缺什麼？→ 觸發下一輪
```

## 整體來說

訓練派的上限更高（會學出寫不出來的策略），但你拿不到 o3 的訓練管線；編排派今天就能落地，而且每個環節可以獨立替換、獨立評估。對多數團隊，務實路徑是編排派起步：先把「規劃—檢索—仲裁—查核」四個 pass 拆開，讓停止條件和引用驗證顯式化，再視預算決定要不要上多 agent 並行——記住那個數字：+90.2% 的代價是 15 倍 token，只有真正可平行的廣度型題目才值得。

## 參考資料

- [Anthropic — How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system)
- [OpenAI — Introducing deep research](https://openai.com/index/introducing-deep-research/)
- [Search-R1（arXiv:2503.09516）](https://arxiv.org/abs/2503.09516)
- [Self-RAG（官方站）](https://selfrag.github.io/)
- [GPT Researcher（GitHub）](https://github.com/assafelovic/gpt-researcher)
- [NVIDIA AI-Q Blueprint](https://build.nvidia.com/nvidia/aiq)
- [NVIDIA AI-Q — Deep Researcher Agent 架構文件](https://docs.nvidia.com/aiq-blueprint/2.0.0/architecture/agents/deep-researcher.html)
- [RA-RAG: Reliability-Aware RAG（arXiv:2410.22954）](https://arxiv.org/abs/2410.22954)
- [DRAGged into Conflicts（arXiv:2506.08500）](https://arxiv.org/abs/2506.08500)
- [CiteEval（arXiv:2506.01829）](https://arxiv.org/abs/2506.01829)
- [Deep Research Agents: A Systematic Examination And Roadmap（arXiv:2506.18096）](https://arxiv.org/abs/2506.18096)
- [Cognition — Don't Build Multi-Agents](https://cognition.ai/blog/dont-build-multi-agents)
