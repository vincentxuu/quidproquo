---
title: "模型卡｜GPT-6.2 Astra"
date: 2026-11-24
category: daily
type: digest
tags: [ai-agent, model-release, daily, openai, model-family-gpt]
lang: zh-TW
description: "OpenAI 發佈 GPT-6.2 Astra 與 Sol，Astra 降價 20% 追平 Claude Fable 5.2 同一個數字，九項官方 benchmark 全面超越前代，卻被多位資深開發者公開批評代理任務「幾乎不能用」"
tldr: "GPT-6.2 Astra（API ID：gpt-6.2-astra，2026-11-17 發布）：1,050,000 tokens context、128,000 max output、input $8.00／output $40.00 per 1M tokens（較前代降 20%，首次與 Claude Fable 5.2 同價）、閉源；Agents' Last Exam 78.3%（前代 73.1%）、BenchCAD 2.1 Core 82.5%（前代 62.6%）、Artificial Analysis Intelligence Index 62 分（全球第二，次於 Claude Fable 5.2 的 65 分）；同步發布的平價款 GPT-6.2 Sol 維持 $2／$10 定價；但多位長期測試 OpenAI 旗艦模型的資深開發者公開批評 Astra 在長流程代理任務上「幾乎不能用」，顯示 benchmark 進步與實際代理可用性之間出現落差。"
series:
  name: "AI Model Tracker"
  order: 81
glossary:
  - term: "Preparedness Framework"
    def: "OpenAI 用來評估與因應前沿模型高風險能力（網路安全、生物化學、AI 自我提升等）的內部風險分級框架，由低到高分 Low／Medium／High／Critical 四級"
  - term: "AI Self-improvement"
    def: "Preparedness Framework 裡衡量模型加速 AI 研發能力的風險類別，GPT-6.2 Astra 是第一個外部對外發布就被判定達到「High」等級的模型"
---

> :globe: [English version](/posts/daily/2026-11-24-model-openai-gpt-6-2-astra-en)

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | `gpt-6.2-astra`（同步發布平價款 `gpt-6.2-sol`） |
| 廠商 | OpenAI |
| 參數量 | 未公開 |
| Context Window | 1,050,000 tokens（max output 128,000 tokens；輸入支援 text + image，輸出僅 text） |
| Input 定價 (USD/1M tokens) | $8.00（cached input $0.40；超過 272K input 後 $16.00；Sol：$2.00，cached $0.10） |
| Output 定價 (USD/1M tokens) | $40.00（超過 272K input 後 $60.00；Sol：$10.00） |
| 開源 | 否 |
| 發布日 | 2026-11-17 |
| 官方公告 | [OpenAI：Introducing GPT-6.2 Astra and Sol](https://openai.com/index/introducing-gpt-6-2-astra-sol) |
| 家族 | GPT-6.x（前代為 GPT-6 Astra／GPT-6.1 Sol） |

## 能力亮點

- Agents' Last Exam v1.1（多步驟專業工作）從前代 GPT-6 Astra 的 73.1% 衝到 78.3%，而且是用不到三分之一的成本達成
- BenchCAD 2.1 Core（CAD 設計任務）從 62.6% 跳到 82.5%，漲幅 19.9 個百分點，是官方公佈九項對照 benchmark 裡進步最大的一項
- Harvey LAB-AA（法律工作，只有「完全符合所有要求且零幻覺」才算過）從 8.6% 升到 15.0%——分數看起來還是偏低，但相對漲幅接近翻倍
- 是第一個外部發布就被判定達到 Preparedness Framework「AI 自我提升」High 等級的模型，OpenAI 為此同步上線 Control Room 監控系統即時介入內部研究工作流

## Benchmark 表現

| Benchmark | GPT-6.2 Astra | 前代（GPT-6 Astra） | 競品 |
|---|---|---|---|
| Artificial Analysis Intelligence Index v5 | 62 | 57 | Claude Fable 5.2　65（第三方 AA 獨立測試，Astra 全球第二） |
| Agents' Last Exam v1.1（多步驟專業工作） | 78.3% | 73.1% | 未獨立揭露（OpenAI 稱領先 Claude Fable 5.2　5.5 分） |
| Terminal-Bench-Science 0.1（科研工作流） | 77.1%（OpenAI 自測） | 68.1% | Claude Fable 5.2　73.3%（AA 獨立測）／Anthropic 自測 74.6%，Mythos 5.2 自測 75.3% |
| Harvey LAB-AA（法律，嚴格通過率） | 15.0% | 8.6% | Claude Fable 5.2　約 7%（OpenAI 稱 Astra 通過率「超過兩倍」，Fable 原始分數未獨立揭露） |
| BenchCAD 2.1 Core（CAD 任務） | 82.5% | 62.6% | 未公開 |

:warning: Agents' Last Exam、Harvey LAB-AA、BenchCAD 與前代對照分數出自 OpenAI 官方發佈頁，用的是各自模型的最佳推理設定，獨立機構尚未全部重現；Artificial Analysis Intelligence Index 與 Terminal-Bench-Science（AA 測法）是第三方 Artificial Analysis 的獨立測試，可以跨廠商互相比較。另有獨立測試顯示：Codex 場景下 Astra 的 Coding Agent Index 打平前代、Sol 反而倒退 3 個指數點（主因是 SWE-Atlas-QnA-AA 子測驗掉了 14 點，Sol 更常漏掉程式庫問答裡的關鍵事實）。

```diagram
title: GPT-6.2 Astra 對前代 GPT-6 Astra 的四項官方 benchmark 進步
desc: 四項官方對照 benchmark 裡，GPT-6.2 Astra 都比前代 GPT-6 Astra 高，但絕對分數落在差異很大的區間——Harvey LAB-AA 的嚴格通過率仍停在個位數到十位數，其他三項已經在六到八成。
caption: 數值來自 OpenAI 官方發佈頁與第三方 Artificial Analysis 報導整理的對照表。x 座標 = 200 + 分數(%) × 4，0% 對應 x=200、100% 對應 x=600。依進步幅度（百分點）由大到小排列：BenchCAD +19.9pp、Terminal-Bench-Science +9.0pp、Harvey LAB-AA +6.4pp、Agents' Last Exam +5.2pp。
---
<svg viewBox="0 0 640 410">
  <text class="dg-small" x="200" y="36" text-anchor="middle" dominant-baseline="central">0%</text>
  <text class="dg-small" x="400" y="36" text-anchor="middle" dominant-baseline="central">50%</text>
  <text class="dg-small" x="600" y="36" text-anchor="middle" dominant-baseline="central">100%</text>
  <line class="dg-grid" x1="400" y1="50" x2="400" y2="356"/>

  <text class="dg-label" x="160" y="90" text-anchor="end" dominant-baseline="central">BenchCAD 2.1</text>
  <line class="dg-axis" x1="450" y1="90" x2="530" y2="90"/>
  <circle class="dg-point dg-point--hollow dg-c-muted" cx="450" cy="90" r="6"/>
  <circle class="dg-point dg-c-accent" cx="530" cy="90" r="6"/>
  <text class="dg-sub" x="438" y="90" text-anchor="end" dominant-baseline="central">62.6%</text>
  <text class="dg-label dg-text--accent" x="542" y="90" text-anchor="start" dominant-baseline="central">82.5%</text>

  <text class="dg-label" x="160" y="170" text-anchor="end" dominant-baseline="central">TB-Science 0.1</text>
  <line class="dg-axis" x1="472" y1="170" x2="508" y2="170"/>
  <circle class="dg-point dg-point--hollow dg-c-muted" cx="472" cy="170" r="6"/>
  <circle class="dg-point dg-c-accent" cx="508" cy="170" r="6"/>
  <text class="dg-sub" x="460" y="170" text-anchor="end" dominant-baseline="central">68.1%</text>
  <text class="dg-label dg-text--accent" x="520" y="170" text-anchor="start" dominant-baseline="central">77.1%</text>

  <text class="dg-label" x="160" y="250" text-anchor="end" dominant-baseline="central">Harvey LAB-AA</text>
  <line class="dg-axis" x1="234" y1="250" x2="260" y2="250"/>
  <circle class="dg-point dg-point--hollow dg-c-muted" cx="234" cy="250" r="6"/>
  <circle class="dg-point dg-c-accent" cx="260" cy="250" r="6"/>
  <text class="dg-sub" x="222" y="250" text-anchor="end" dominant-baseline="central">8.6%</text>
  <text class="dg-label dg-text--accent" x="272" y="250" text-anchor="start" dominant-baseline="central">15.0%</text>

  <text class="dg-label" x="160" y="330" text-anchor="end" dominant-baseline="central">Agents' Last Exam</text>
  <line class="dg-axis" x1="492" y1="330" x2="513" y2="330"/>
  <circle class="dg-point dg-point--hollow dg-c-muted" cx="492" cy="330" r="6"/>
  <circle class="dg-point dg-c-accent" cx="513" cy="330" r="6"/>
  <text class="dg-sub" x="480" y="330" text-anchor="end" dominant-baseline="central">73.1%</text>
  <text class="dg-label dg-text--accent" x="525" y="330" text-anchor="start" dominant-baseline="central">78.3%</text>

  <line class="dg-rule" x1="20" y1="356" x2="620" y2="356"/>
  <text class="dg-tag" x="20" y="382" dominant-baseline="central">圖例</text>
  <circle class="dg-point dg-point--hollow dg-c-muted" cx="130" cy="382" r="6"/>
  <text class="dg-small" x="146" y="382" dominant-baseline="central">GPT-6 Astra（前代）</text>
  <circle class="dg-point dg-c-accent" cx="360" cy="382" r="6"/>
  <text class="dg-small" x="376" y="382" dominant-baseline="central">GPT-6.2 Astra（本代）</text>
</svg>
```

## 與前代/競品比較

OpenAI 官方發佈頁一共放了九張對照圖，GPT-6.2 Astra 在全部九項都超越前代 GPT-6 Astra，GPT-6.2 Sol 在八項贏過前代 GPT-6.1 Sol，唯一例外是 Vals Science Index 略輸（58.5% vs 59.6%）。但獨立測試呈現比較保守的畫面：Artificial Analysis 在 Codex 場景下測出 Astra 的 Coding Agent Index 只是打平，Sol 反而退步 3 個指數點，追下去發現主因是 SWE-Atlas-QnA-AA 子測驗掉了 14 點——Sol 回答程式庫相關問題時更常漏掉關鍵事實，這點官方發佈頁沒有提到。

跟最直接的對手 Claude Fable 5.2 比，兩者的 API 牌價在這次降價後完全重疊，都是 $8/$40——這是兩間公司旗艦模型第一次把定價卡在同一個數字上，而且剛好發生在 Anthropic 準備掛牌 Nasdaq 的同一週。但中立的 Artificial Analysis Intelligence Index 上，Fable 5.2 仍以 65 分領先 Astra 的 62 分，Astra 只排全球第二；OpenAI 強調的 Harvey LAB-AA（法律）領先幅度和 Agents' Last Exam 的分數差距，都只出自官方自己的發佈頁，Fable 的對應原始分數沒有被獨立揭露，兩邊測試用的 agent 框架（mini-swe-agent 對 Claude Code）也不同，差距有多少是模型本身、多少是測試環境造成，仍無法完全拆開。

真正值得記的反而是上線後的風評：儘管九項官方 benchmark 全面進步，投資人、前 HyperWrite CEO Matt Shumer 和開發者 YouTuber Theo Browne 公開說 Astra「幾乎不能用」「是 OpenAI 發過最差的模型」，點名問題集中在長流程代理任務與創意工作的穩定性；Browne 讓 Astra 重寫一個 TypeScript 編譯器成 Rust，花七天沒有實質進展，轉向後又卡了四天。Wharton 教授 Ethan Mollick 的經驗比較中間：Astra 做出能玩的太空電梯模擬，但他形容模型「很不穩定、難駕馴」，仍傾向用其他模型。同時也有像 Raindrop.ai CTO Ben Hylak 這樣稱讚 Astra 在動態視覺特效與代理式影片剪輯上的表現——評價明顯分裂，而且分裂的軸線剛好是「單次任務 benchmark」vs「需要人持續盯著的長流程代理工作」。

## 對 Agent 開發的意義

這次發佈對 Agent 架構設計最直接的提醒：benchmark 分數（尤其是 Agents' Last Exam、GDPval v2 這類號稱「多步驟專業工作」的測驗）不等於長流程自主運作的穩定性。Browne 那個七天沒進展、改方向又卡四天的案例說明，現有的多步驟 benchmark 多半測的是幾十分鐘到幾小時的任務，不會暴露模型在真正跑上好幾天的自主迴圈裡會不會迷失方向、原地打轉。

- 如果你在做需要嚴格零容錯的法律或合規 Agent：Harvey LAB-AA 的嚴格通過率（完全符合要求、零幻覺）即便用上最新最強的模型也只有 15.0%，代表現階段任何法律文件產出都不該省掉人工覆核這一關，無論官方怎麼宣傳領先幅度
- 如果你在做 CAD／工程設計或需要電腦操作、3D 視覺推理的 Agent：BenchCAD 2.1 Core 進步 19.9 個百分點、AA-3D 盲測對決裡 Astra 的 Elo（1,318）也領先 Fable 5.2（1,271），這塊是 Astra 相對同代模型比較紮實的差異化能力，值得單獨拿你的工作流程試
- 不適合：需要模型連續自主跑多天、很少人工介入的長流程編碼或研究任務（早期測試者反覆回報卡住、原地重複的狀況）；把 Astra 當成被另一個模型（例如 Claude）指揮的子代理——Shumer 回報他的 Claude 監督模型最後把 Astra 的子代理輸出整段重做，代表現在拿 6.2 Astra 直接取代 6 Astra 當子代理之前，值得先在自己的 harness 上重新驗一次，不要只看 benchmark 分數就換版本

## 今日收穫

過去習慣把 benchmark 分數當成模型能力的代理指標，但這次 GPT-6.2 Astra 九項官方 benchmark 全面超越前代、Artificial Analysis Intelligence Index 也拿下 OpenAI 自家最高分，卻同時被多位長期測試 OpenAI 旗艦模型的資深開發者公開評為「這代最差」——這提醒我們標準化 benchmark 測的多半是「單次任務」的峰值表現，而真正決定一個 Agent 能不能用的，往往是沒有任何 benchmark 在測的「長流程裡要不要頻繁回頭盯著」這件事，兩者不是同一回事,也不會同步進步。

## 參考資料

- [OpenAI：Introducing GPT-6.2 Astra and Sol（官方發布文）](https://openai.com/index/introducing-gpt-6-2-astra-sol)
- [OpenAI：GPT-6.2 Astra Model（API 規格頁）](https://developers.openai.com/api/docs/models/gpt-6.2-astra)
- [OpenAI：GPT-6.2 Astra & Sol System Card](https://deploymentsafety.openai.com/gpt-6-2-astra-sol)
- [VentureBeat：'Essentially unusable': OpenAI launches GPT-6.2 Astra and Sol to negative reception from AI power users](https://venturebeat.com/technology/essentially-unusable-openai-launches-gpt-6-2-astra-and-sol-to-negative-reception-from-ai-power-users)
- [Anthropic：Claude Fable 5.2 and Mythos 5.2](https://www.anthropic.com/claude-fable-and-mythos-5-2)
- [quidproquo：定價追蹤｜GPT-6.2 Astra 降價 20%，旗艦價正好卡在 Claude Fable 5.2 同一個數字（2026-11-20）](/posts/daily/2026-11-20-pricing-openai-gpt-6-2-astra-sol-cut)
