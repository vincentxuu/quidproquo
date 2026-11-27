# Arxiv Digest 完整範例

> Step 7 撰寫文章前讀，跟 `output-template.md` 一起看。模板定義每一節要放什麼，這份示範寫出來的深度。

## 完整範例

以下節錄自 2026-08-04 的 digest，展示預期的格式深度（僅含論文一，完整版含三篇）。**注意：此範例使用舊版編輯判斷表格（6 欄），新版應包含 14 欄（含 Venue、引用速度、機構、社群反應、為什麼選這篇、方向新意、今日重要性、實務連結）。**

```markdown
---
title: "AI Agent Arxiv Digest — 2026-08-04"
date: 2026-08-04
category: daily
tags: [ai-agent, arxiv, daily]
lang: zh-TW
description: "今天的主題是 Agent 的能力與極限——記憶管理可自動學習，但開放式研究還做不了，安全測試可能根本不夠"
tldr: "AutoMem 讓 32B 模型靠記憶優化達到 Claude Opus 4.5 水準；Shadow Evaluation 證明頂級 Agent 能工程但不能做研究；Adaptive Adversaries 揭示自適應攻擊讓 ASR 從 0-1% 跳到 14%"
series:
  name: "AI Agent Arxiv Digest"
  order: 81
---

## 今日總覽

今天三篇各從不同角度審視 AI Agent 的能力與極限：AutoMem 告訴你「記憶管理」是可以自動學習的獨立技能，光優化記憶就讓 32B 開源模型達到頂級商用模型水準；Shadow Evaluation 用真實 NeurIPS 投稿測試頂尖 Agent 能否做開放式 AI 研究——答案是否定的，Agent 能工程但不會研究；Adaptive Adversaries 揭示現有安全評測嚴重低估威脅：加上自適應多輪攻擊者，攻擊成功率從 0–1% 跳到 14%。三篇合起來是一堂清醒課：知道 Agent 能自動變強在哪、不能在哪、以及你的安全測試可能根本不夠。

## 讀這篇前該知道的詞

| 詞 | 白話解釋 |
|---|---|
| Agent（智能代理） | 可以自己規劃步驟、呼叫工具、迭代執行的 AI 系統，不是一問一答的聊天機器人 |
| 記憶管理（Memory Management） | Agent 決定「要記什麼、什麼時候調出來、怎麼整理記憶檔案」的能力，是長程任務最大瓶頸 |
| 鷹架（Scaffold） | 驅動 Agent 的程式框架——包含 system prompt、工具定義、執行迴圈，不含模型本身 |
| 攻擊成功率（ASR） | 對抗攻擊讓 Agent 做出有害行為的比例；ASR 10% 代表每十次測試有一次被攻破 |
| 影子評估（Shadow Evaluation） | 讓 Agent 獨立研究一篇未公開論文的核心問題，再由原作者打分的評測方法 |

---

## 論文一｜AutoMem：讓 Agent 自動學會管理記憶

**AutoMem: Automated Learning of Memory as a Cognitive Skill**
Shengguang Wu, Hao Zhu, Yuhui Zhang et al.（Stanford University）　·　arxiv: 2607.01224

連結: [arxiv](https://arxiv.org/abs/2607.01224) · [alphaxiv](https://www.alphaxiv.org/abs/2607.01224)

### TL;DR

把「記憶管理」當成獨立技能來訓練，完全不改模型的任務行為，光是優化記憶就讓 32B 開源模型在長程遊戲上達到 Claude Opus 4.5 的水準（Crafter 51.4% vs 49.5%）。

### 編輯判斷

| 面向 | 判斷 |
|---|---|
| Venue | arXiv preprint（未經同行審查） |
| 引用速度 | 發布 3 天，Semantic Scholar 尚無引用資料 |
| 機構 | Stanford University |
| 社群反應 | HF Daily Papers 未上榜 / Papers with Code 無復現 repo |
| 可信度 | 通過 — 正文提供跨 benchmark 實驗與對照組 |
| 證據成熟度 | 初步 — 核心結果完整，但任務仍限於遊戲環境 |
| 可復現性 | 部分產物 — 方法與設定可查，主要外部複現仍待補 |
| 為什麼選這篇 | 直接 — 記憶管理是 Agent 長程任務的核心瓶頸，本篇提出可自動學習的解法 |
| 方向新意 | 實質增量 — 首次把記憶管理從「工程手調規則」改為「LLM 自動學習的獨立技能」 |
| 今日重要性 | 高 — Agent 平台正在量產部署，記憶模組是最缺獨立投資的組件 |
| 實務連結 | 明確 — Loop 1 鷹架修訂流程可直接套用到 LangGraph / AutoGen 記憶層 |
| 編輯信心 | 高 — 足以支持「記憶可獨立優化」的限縮主張 |
| 閱讀建議 | 必讀 — 長程 Agent 平台可直接參考架構 |
| 主要限制 | 尚未驗證真實工作負載的遷移效果 |

### 領域背景

LLM Agent 做長程任務（long-horizon task，跑幾千步才完成）時，記憶管理是最大瓶頸。以前的做法是人工設計 system prompt 規則，或接入 RAG（向量檢索）。問題是規則難以涵蓋所有情況，而要 debug 的軌跡長達幾千步，人工幾乎看不完。

### 中階導讀

- **問題**：想像 Agent 在玩一款 roguelike 遊戲（地城探索），需要跑幾千步。途中遇到怪物 A、記下弱點；三百步後再次遇到，卻已忘記。記憶沒記對的代價要等很久才浮現——人工 debug 根本不切實際。
- **方法**：AutoMem 把記憶管理從「工程師手動設計規則」改成「讓 LLM 自動學」，透過兩個迭代迴圈：Loop 1（結構優化）讓「批改老師」LLM 讀完整集軌跡，找出記憶失敗的模式並修改記憶鷹架；Loop 2（熟練度訓練）從軌跡中挑出「記憶用得好的決策」做監督學習。整個系統以「檔案系統操作」作為記憶的一等公民。
- **為什麼重要**：記憶管理是可以獨立學習的技能。不需要訓練整個模型的任務推理，光是優化記憶這一塊就能讓效能倍增。對 Agent 平台而言，「記憶模組」是一個值得獨立投資和衡量的組件。

### 深入要點

- 基準測試：Crafter、MiniHack、NetHack 三款長程遊戲
- AutoMem 32B：Crafter 51.4%、MiniHack 30.0%、NetHack 1.9%
- Claude Opus 4.5：分別為 49.5%、27.5%、2.0%（Stanford 自測，需等外部複現）
- 僅優化記憶，效能提升約 2x–4x（對比無記憶優化基準）
- Loop 1 跑 5 輪鷹架修訂，每輪 meta-LLM 讀完整軌跡並重寫規則
- 落地門檻：需要大量 episode rollout，小型團隊若缺環境模擬基礎設施會有挑戰
- 與 LangGraph、AutoGen 相容——可作為插件層加入
- Limitation：目前只在遊戲環境測試，遷移到真實工作負載效果待驗證

### Reviewer 一句話評

方法紮實，兩個迴圈的設計清楚且可複現。但「32B 媲美 Claude Opus 4.5」的結論要謹慎對待——遊戲環境和實際 agent workload 差距很大，先別過度外推。

### 給你的 take-away

- 如果你的 Agent 平台有長程任務需求：AutoMem 的 Loop 1（鷹架修訂流程）是目前最具體的「記憶自動調優」設計藍圖，值得直接參考架構設計
- 如果你在評估 Agent 效能：把「記憶相關失敗」從「模型能力不足」獨立拆出來衡量，這篇提供了清楚的操作方法論

---

（論文二、三結構相同，完整版含三篇）

## 今日收穫

之前以為 Agent 記憶的問題是「怎麼存更多」，今天發現真正的問題是「怎麼讓 Agent 自己學會管記憶」。AutoMem 的思路讓我意識到，記憶系統不該是工程師手動調的規則，而是一個可以自動優化的獨立技能。
```
