---
title: "模型卡｜Microsoft Mage-VL-Cowork"
date: 2026-11-02
category: daily
type: digest
tags: [ai-agent, model-release, daily, microsoft, model-family-mage]
lang: zh-TW
description: "Microsoft 發布 Mage-VL-Cowork——4B 參數的混合 GUI＋終端機 computer-use agent，OSWorld-Verified 66.0% 贏過 27B 開源模型與 Claude Sonnet 4.5，Apache-2.0 全開源"
tldr: "Microsoft Mage-VL-Cowork（HF ID `microsoft/Mage-VL-Cowork`）：2026-10-30 上架 HuggingFace，4B 參數、32,768 tokens context（架構支援到 262,144），Apache-2.0 開源、無官方付費 API；OSWorld-Verified 66.0%，是目前 4B 量級最高分，贏過 27B 的 Qwen3.6-27B（63.9%）、72B 的 OpenCUA-72B（44.9%），以及用兩倍 step budget 的 Claude Sonnet 4.5（62.9%）；單一策略同時用螢幕截圖 GUI 操作（`computer_use`）與 `bash` 終端機執行，不需外部 router 做通道決策；Online Hybrid RL（GRPO）比純 Hybrid SFT 再進步約 10pp，同時模型呼叫次數減少 13%、輸出 token 減少 25.4%；官方明講只能在隔離沙箱/VM 跑，不可掛載真實帳密或本機檔案系統。"
series:
  name: "AI Model Tracker"
  order: 66
glossary:
  - term: "Mage-VL-Cowork"
    def: "Microsoft Mage 團隊發布的 4B 參數混合 computer-use agent 模型，單一策略同時處理 GUI 截圖操作與終端機/程式碼執行，不需外部 orchestrator 做通道路由"
  - term: "Hybrid Computer-Use Agent"
    def: "同時具備螢幕截圖 GUI 操作與終端機/程式碼執行雙通道、由模型自己判斷何時用哪個通道的 agent 架構"
---

> 🌏 [English version](/posts/daily/2026-11-02-model-microsoft-mage-vl-cowork-en)

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | `microsoft/Mage-VL-Cowork` |
| 廠商 | Microsoft（Mage Team） |
| 參數量 | 4B（bfloat16 下 9.48GB，2 個 safetensors shard；backbone 為 Mage-ViT + `Qwen3-4B-Instruct-2507`） |
| Context Window | 32,768 tokens（實際訓練／推理視窗；架構上限支援到 262,144） |
| Input 定價 (USD/1M tokens) | 不適用（開放權重研究模型，無官方付費 API，須自行部署） |
| Output 定價 (USD/1M tokens) | 不適用（同上） |
| 開源 | 是（Apache-2.0） |
| 發布日 | 2026-10-30 |
| 官方公告 | [Mage-VL-Cowork 專案頁](https://microsoft.github.io/Mage/cowork/)／[microsoft/Mage GitHub](https://github.com/microsoft/Mage) |
| HuggingFace | [microsoft/Mage-VL-Cowork](https://huggingface.co/microsoft/Mage-VL-Cowork) |
| 家族 | Mage（Mage-ViT 視覺編碼器 → Mage-VL 4B 多模態基礎模型 → Mage-VL-Cowork 混合 computer-use agent；Cowork 是目前家族首個公開 agent 變體，無前代可比） |

## 能力亮點

- 4B 參數在 OSWorld-Verified 拿下 66.0%，是目前 4B 量級公開最高分，贏過 27B 的 Qwen3.6-27B（63.9%）、72B 的 OpenCUA-72B（44.9%），以及用兩倍 step budget（100 步 vs 本模型 50 步）的 Claude Sonnet 4.5（62.9%）
- 單一 vision-language 策略內建雙通道：螢幕截圖 GUI 操作（`computer_use`）＋持久化 shell／Python 終端機（`bash`），模型自己判斷「這一步該點滑鼠還是該寫程式」，不靠外部 router 或多 agent 拆分
- Online Hybrid RL（GRPO，可驗證任務獎勵）比純 Hybrid SFT 再進步約 10 個百分點，同時模型呼叫次數減少 13.0%、輸出 token 減少 25.4%——更準也更省
- 自建資料合成引擎 Mage-CUA-Forge，把單任務生成成本從 $0.906 壓到 $0.158（降 82.6%），用「技能工作流＋應用程式 preparer」取代逐任務 agent loop

訓練分五個階段、由淺入深疊加能力，OSWorld-Verified 分數的進步幅度在官方技術報告裡清楚拆解成三段累計：

```diagram
title: OSWorld-Verified 怎麼從 45.56% 爬到 66.0%
desc: Mage-VL-Cowork 在 GUI Agent SFT 後測得 45.56%，疊加 Hybrid CUA SFT 到 55.84%，再疊加 Online Hybrid RL 到 66.04%。
caption: 資料來源：Mage-VL-Cowork HuggingFace 模型卡 Stage-Wise Progression 表。45.56+10.28=55.84；官方另以文字敘述「Online RL 比 Hybrid SFT 提升 10.16pp」，與本圖兩個累計值四捨五入後反推的 10.20pp 有 0.04pp 落差，屬官方數字四捨五入所致。
---
<svg viewBox="0 0 640 360">
  <line class="dg-axis" x1="140" y1="123.32" x2="172" y2="123.32"/>
  <line class="dg-axis" x1="228" y1="92.48" x2="260" y2="92.48"/>
  <line class="dg-axis" x1="316" y1="92.48" x2="348" y2="92.48"/>
  <line class="dg-axis" x1="404" y1="61.88" x2="436" y2="61.88"/>

  <rect class="dg-bar dg-c-muted" x="84" y="123.32" width="56" height="136.68"/>
  <rect class="dg-bar dg-c-s1" x="172" y="92.48" width="56" height="30.84"/>
  <rect class="dg-bar dg-c-muted" x="260" y="92.48" width="56" height="167.52"/>
  <rect class="dg-bar dg-c-accent" x="348" y="61.88" width="56" height="30.6"/>
  <rect class="dg-bar dg-c-muted" x="436" y="61.88" width="56" height="198.12"/>
  <line class="dg-axis" x1="64" y1="260" x2="560" y2="260"/>

  <text class="dg-sub" x="112" y="111.32" text-anchor="middle" dominant-baseline="central">45.56%</text>
  <text class="dg-sub" x="200" y="80.48" text-anchor="middle" dominant-baseline="central">+10.28pp</text>
  <text class="dg-sub" x="288" y="80.48" text-anchor="middle" dominant-baseline="central">55.84%</text>
  <text class="dg-label dg-text--accent" x="376" y="49.88" text-anchor="middle" dominant-baseline="central">+10.20pp</text>
  <text class="dg-sub" x="464" y="49.88" text-anchor="middle" dominant-baseline="central">66.04%</text>

  <text class="dg-sub" x="112" y="280" text-anchor="middle" dominant-baseline="central">S2 GUI SFT</text>
  <text class="dg-sub" x="200" y="280" text-anchor="middle" dominant-baseline="central">+Hybrid</text>
  <text class="dg-sub" x="288" y="280" text-anchor="middle" dominant-baseline="central">S4 Hybrid</text>
  <text class="dg-label dg-text--accent" x="376" y="280" text-anchor="middle" dominant-baseline="central">+Online RL</text>
  <text class="dg-sub" x="464" y="280" text-anchor="middle" dominant-baseline="central">S5 Cowork</text>

  <line class="dg-rule" x1="20" y1="308" x2="620" y2="308"/>
  <text class="dg-tag" x="20" y="332" dominant-baseline="central">圖例</text>
  <rect class="dg-swatch dg-c-muted" x="76" y="324" width="16" height="16" rx="2"/>
  <text class="dg-small" x="100" y="332" dominant-baseline="central">累計分數</text>
  <rect class="dg-swatch dg-c-s1" x="188" y="324" width="16" height="16" rx="2"/>
  <text class="dg-small" x="212" y="332" dominant-baseline="central">疊加訓練</text>
  <rect class="dg-swatch dg-c-accent" x="300" y="324" width="16" height="16" rx="2"/>
  <text class="dg-small" x="324" y="332" dominant-baseline="central">Online RL 貢獻（本文重點）</text>
</svg>
```

## Benchmark 表現

| Benchmark | 分數 | 前代模型 | 競品最強 |
|---|---|---|---|
| OSWorld-Verified（50 步） | 66.0% | 首發（Mage 家族第一個 agent 變體，無前代） | 同為 4B：尚無更高分；跨量級：GPT-5.4-mini 69.6%、Qwen3.6-27B（27B）63.9%、Claude Sonnet 4.5（100 步）62.9% |
| OSWorld-G（視覺定位） | 56.9% | 首發 | Qwen3.5-4B：54.5%（同量級） |
| ScreenSpot-v2（視覺定位） | 87.2% | 首發 | Qwen3-VL-4B：85.3%（同量級） |
| WebVoyager-Static（瀏覽器，離線可重現） | 58.6% | 首發 | Fara1.5-4B（瀏覽器專精模型）：68.0% |

⚠️ 以上均為 Microsoft 官方技術報告／HuggingFace 模型卡自測結果，尚無外部單位獨立複現。OSWorld-Verified 的 66.0% 是扣除 Google Drive 相關任務的 361 個任務、兩次完整跑分的平均（65.33% 與 66.75%）。

## 與前代/競品比較

Mage-VL-Cowork 是 Mage 家族第一個公開的 agent 變體，沒有同系列前代可比，比較基準是「4B 量級的 computer-use agent」。在這個區間裡它的定位很清楚：用 4B 參數打贏所有列出的開源模型，包括體型大上數倍的 27B Qwen3.6-27B（63.9%）、32B 的 EvoCUA-32B（56.7%）與 72B 的 OpenCUA-72B（44.9%）；跟閉源旗艦比，也贏過只給 50 步 budget 的 OpenAI CUA（31.3%）與用兩倍 step budget 的 Claude Sonnet 4.5（62.9%），但輸給 GPT-5.4-mini（69.6%，同樣 50 步）與真正的旗艦模型（GPT-5.5 78.7%、Claude Opus 4.7 78.0%）。

真正的差異化不是分數，是架構：大多數 computer-use agent 只靠螢幕截圖操作 GUI，Mage-VL-Cowork 把 GUI 操作和終端機執行放進同一個策略，讓模型自己決定哪一步該點滑鼠、哪一步該寫三行 Python 搞定。官方演示影片顯示，在 LibreOffice Calc 合併表格並畫圖表這類任務上，靠終端機直接改檔案只要 39 秒、6 步，而純 GUI 操作的 27B 模型 Qwen3.6-27B 要 9 分 56 秒、39 步——快 15.3 倍。在瀏覽器限定任務上則不是它的主場：WebVoyager-Static 58.6% 輸給專精瀏覽器的 Fara1.5-4B（68.0%），因為後者就是只練瀏覽器，犧牲了 Mage-VL-Cowork 同時要兼顧桌面任務的泛用性。

## 對 Agent 開發的意義

MCP／多 agent 架構裡常見的做法，是用一個 supervisor 或 router 決定該呼叫 GUI agent 還是 coding agent。Mage-VL-Cowork 證明這個路由決策可以直接訓練進單一模型的策略裡，不需要額外的 orchestrator 層。

- 如果你在做 computer-use／RPA 類 agent：這個「GUI＋終端機雙通道、模型自己選」的設計值得抄——不要讓前端模型被迫全靠螢幕截圖做本來三行 shell 就能解決的結構化操作（改 Excel、編輯設定檔、查檔案狀態）
- 如果你要處理敏感畫面（內部系統、客戶資料、合規文件）：4B 模型可以在單張 16GB GPU 跑 bf16、8GB 跑 4-bit GGUF 本地部署，不用把螢幕截圖傳到雲端 API，對資料駐留有要求的場景是現成選項
- 不適合：直接接真實檔案系統、網路或帳密的場景——模型卡本身強調只能在隔離沙箱或可還原的 VM 裡跑，不可掛載真實 SSH key、雲端 token 或密碼庫，不可接未過濾的外部網頁內容（防 indirect prompt injection）
- 如果你在做純瀏覽器 agent：這不是它的強項，WebVoyager-Static 分數還是輸給專精瀏覽器的小模型，瀏覽器限定任務找專長模型比較划算

## 今日收穫

之前以為「螢幕截圖操作」和「寫程式操作」這兩種能力只能靠外部 router 或多 agent 架構拼起來——先讓一個模型判斷任務類型，再分派給對應的子 agent。Mage-VL-Cowork 的 Hybrid CUA 訓練證明這個路由決策本身可以變成模型策略的一部分：同一個 4B 模型，靠五階段課程先練好兩個獨立通道的基本功，再用 RL 把「何時該用哪個通道」訓練進去，結果比純 SFT 更準，還更省 token。這代表「要不要拆 agent」這個架構決策，有時候答案是先把兩種能力都練進同一個策略，而不是急著拆成多個專職 agent。

## 參考資料

- [microsoft/Mage-VL-Cowork · HuggingFace](https://huggingface.co/microsoft/Mage-VL-Cowork)
- [Mage-VL-Cowork 官方專案頁](https://microsoft.github.io/Mage/cowork/)
- [microsoft/Mage · GitHub](https://github.com/microsoft/Mage)
- [How to Run Mage-VL-Cowork Locally: Microsoft's 4B Agent Beats Sonnet 4.5（DEV Community）](https://dev.to/alanwest/how-to-run-mage-vl-cowork-locally-microsofts-4b-agent-beats-sonnet-45-3dh4)
- [Microsoft's Mage-VL-Cowork fits a desktop agent into 4B parameters（i-scoop.eu）](https://www.i-scoop.eu/mage-vl-cowork)
