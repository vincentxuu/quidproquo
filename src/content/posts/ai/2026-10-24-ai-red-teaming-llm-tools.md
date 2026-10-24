---
title: "測試你的 LLM 應用抗不抗攻擊：garak、promptfoo、PyRIT、HackAgent 的成功率怎麼讀"
date: 2026-10-24
category: ai
type: deep-dive
tags: [security, ai-agent, red-teaming, llm-evaluation, promptfoo]
lang: zh-TW
series:
  name: "AI Agent 資安工具地圖"
  order: 6
tldr: "這類工具的共同結構是「攻擊者（腳本或模型）出題、目標回答、judge 判定」。一份報告的『攻擊成功率』至少牽涉三個變數：誰出題、誰判定、分母算什麼，所以兩份都寫 5% 的報告不能直接比。garak 的官方 FAQ 自己說分數沒有科學效度；PyRIT 測的是模型的文字回應，不是 agent 實際做了什麼；HackAgent 白皮書的排名會隨 judge 門檻反轉。沒有任何一個工具有獨立的準確度評測。"
description: "比較 garak、promptfoo、PyRIT、HackAgent 四種 LLM 紅隊工具的定位、資料流與授權邊界，說明攻擊成功率背後的攻擊者模型、judge 與分母，以及讀紅隊報告時該問的三個問題。"
draft: true
---

> 🌏 [English version](/posts/ai/2026-10-24-ai-red-teaming-llm-tools-en)

上一篇審計的是原始碼：把程式碼交給 AI 讀。這一篇換成對運行中的系統發請求。

| | 審計（第 5 篇） | 紅隊（這一篇） |
|---|---|---|
| 看什麼 | 原始碼 | 運行中的 LLM 應用或模型端點 |
| 怎麼看 | 讀程式碼、找路徑 | 送攻擊提示、看回答 |
| 結果是 | 一份有位置的發現清單 | 一個「被攻破的比例」 |

在[系列地圖](/posts/ai/2026-10-24-ai-agent-security-tooling-map)上，這是第六類：測試 AI 系統本身，適合自己做 LLM 應用、想知道它抗不抗得住攻擊的人。內容依據各專案的文件、論文與第三方評估；沒有安裝，也沒有對任何系統發送攻擊。

## 四個工具共用的骨架

四個工具做的事很像：

1. 攻擊端產生一批攻擊提示，有的是寫死的清單，有的是另一個模型即時改寫。
2. 把提示送給目標（你的應用或模型端點）。
3. 由判定端看回答，決定「這次有沒有被攻破」，判定端可以是關鍵字規則、分類器，也可以是另一個 LLM，後者通稱 judge。
4. 把判定結果加總成報告。

差別在定位：

| 工具 | 主要被測物 | 判定方式 |
|---|---|---|
| [garak](https://github.com/NVIDIA/garak)（NVIDIA） | LLM 模型與對話端點 | 關鍵字與小型分類器為主 |
| [promptfoo](https://github.com/promptfoo/promptfoo) | 你設定的 LLM 應用、RAG、agent 或 HTTP 端點 | LLM judge，預設用 gpt-5 |
| [PyRIT](https://github.com/microsoft/PyRIT)（微軟 AI Red Team） | 生成式 AI 系統，是組合元件的框架 | 規則或 LLM scorer |
| [HackAgent](https://github.com/AISecurityLab/hackagent) | AI 模型與 agent | 多個 judge 模型投票 |

garak 的 README 自己拿 nmap 與 Metasploit 比喻，說它對 LLM 做的事類似。promptfoo 同時是評測工具，紅隊只是其中一個功能，它的基本用法在[這篇](/posts/ai/2026-08-22-promptfoo-llm-evaluation)。

## 成功率背後的三個變數

「攻擊成功率 5%」要有意義，得先知道三件事。

**誰出題。** 寫死的攻擊清單和另一個模型即時改寫的攻擊，強度差很多。HackAgent 的白皮書就寫明：Fable 5 與 Fable 5.1 兩輪測試用了不同的攻擊者模型，所以那組比較是「（目標，攻擊者）配對」的比較，不是單一變數的對照，作者自己說可靠的只有方向，不是倍數。

**誰判定。** garak 的 FAQ 回答「這些結果有科學效度嗎」，答案是「沒有」，說各 probe 的分數沒有共同的標準化尺度，並說 garak 不是 benchmark，建議不要依賴超過六個月的分數。獨立研究也印證 detector 會誤判：Fujitsu 2024 年的比較論文測了當時的 garak v0.9，估計在判斷攻擊是否成功上有約 37% 的錯誤率，例如回答裡出現「unethical」這個字就被判成攻擊成功。但這是兩年前的版本，現行 v0.17 已修了許多 detector，舊數字不能直接套到現在。

**分母算什麼。** HackAgent 白皮書把分母定義為「嘗試次數」，不是「有害意圖的種類數」；模型拒答的嘗試也算在分母裡，所以拒答多的模型數字會比較好看。下一節有例子。

## 例子：同一批資料，換個門檻排名就反轉

HackAgent 的白皮書測了 Opus 4.8、Fable 5、Fable 5.1 三個模型，標題數字用「五個 judge 至少四個判有害」才算被攻破：

| 判定門檻 | Opus 4.8 | Fable 5 | Fable 5.1 |
|---|---|---|---|
| 至少 1/5 judge 認定 | 10.39% | 4.45% | 9.91% |
| 至少 4/5（標題用） | 5.76% | 2.72% | 8.19% |

在最寬鬆的門檻下，Opus 4.8 比 Fable 5.1 更容易被攻破；要到 3/5 以上，順序才變成 Fable 5.1 最容易。作者自己寫，這個比較「取決於門檻，引用時要附上規則」。另一個細節：Fable 5 看起來比較強，作者說主要是因為它拒答的比例高（有回應的比例只有 56%，Opus 4.8 是 91%）。

要注意這份白皮書是工具作者自己做的測試，它的「獨立」是相對於被測的模型廠商，不是相對於工具；五個 judge 的嚴格度也不一致：其中一個判有害的比例只有 20%，其他四個在 58% 到 67% 之間。文件裡沒有 judge 對人工標註的準確率，作者也承認絕對數字沒有大規模人工稽核。

所以兩份報告都寫「攻擊成功率 5%」，不能直接比。要先確認攻擊者模型、judge 與分母都相同。

## 每個工具要知道的事

- **garak**：預設會跑全部 probe，完整跑可能花上數小時到數天；FAQ 說相依套件約 9GB。我沒有讀它的原始碼。
- **promptfoo**：2026 年 3 月 OpenAI 公告同意收購，官方公告寫成交仍須滿足一般條件；現在 README 寫「已成為 OpenAI 的一部分」，我沒有找到說明交易已成交的獨立公告。它的 README 說 eval「100% 在本機執行」，這對一般評測成立；紅隊有些 plugin 只能走 promptfoo 的託管服務，攻擊產生與評分會把你的 `purpose` 與目標回應送到它的伺服器。被測的模型廠商同時擁有測試工具，也有社群提出利益衝突的疑慮，這是意見不是定論。
- **PyRIT**：CSA（雲端安全聯盟）對它的評估寫道，PyRIT 評估的是 LLM 的文字回應，不是 agent 實際的狀態變化或工具呼叫。論文提到它在微軟內部用於 100 多次紅隊作業，論文沒有給攻擊成功率的表。所以拿它測 agent，只能測到「agent 說了什麼」，測不到「agent 做了什麼」。
- **HackAgent**：由義大利 AI4I 的實驗室開發，有託管版本；文件要求事前約定測試範圍，這是流程要求，不是程式強制。

## 授權與範圍

這四個工具的攻擊面，大多只限於把文字送到你指定的端點，風險比網路掃描器小。但它們沒有一個在程式裡強制檢查「你有權測這個目標」。garak 的論文寫它像 Metasploit，會影響正式環境，只應在獲得授權後使用；promptfoo 的授權聲明只涵蓋測試 promptfoo 自己。對第三方 API 發大量有毒提示，可能違反對方的使用條款，這是我的推論。

## 怎麼用

1. **先決定你要測的是模型還是整個應用。** 單測模型端點用 garak 或 PyRIT 就夠；你的應用有系統提示、檢索、工具，就要用能指到你應用端點的 promptfoo 或 HackAgent。
2. **讀報告前先問三題：** 攻擊者模型是誰、judge 是誰、分母是什麼。任何一題報告沒寫，這個數字只能當方向。
3. **自己抽樣讀判定。** 隨機挑 20 筆「被判攻破」和 20 筆「被判守住」，用人眼看判得對不對，才知道 judge 在你的應用上準不準。
4. **測 agent 的實際行為，要另外接遙測。** 這幾個工具看的是文字回應，要確認 agent 有沒有真的呼叫工具、改狀態，得另外記錄工具呼叫（第 4 篇）。
5. **只對自己擁有或書面授權的目標跑，並先看資料送去哪裡。** 尤其是用託管 plugin 的時候。

## 整體來說

這類工具能讓你系統化地、重複地丟攻擊給自己的應用，這件事有價值。但輸出的數字不是衡量「安全程度」的尺，而是「這組攻擊、這個 judge、這個分母」下的結果；garak 的 FAQ 對自己的分數就是這個態度。目前沒有找到任何一個獨立的、量化的準確度評測。

下一篇換個方向：AI 不再是被測物，而是拿來攻擊別人的人。那會碰到一個新問題：工具本身也會被反過來利用。

## 參考資料

- [NVIDIA/garak](https://github.com/NVIDIA/garak)；[FAQ](https://github.com/NVIDIA/garak/blob/main/FAQ.md)
- [garak 論文（arXiv:2406.11036）](https://arxiv.org/abs/2406.11036)
- [Fujitsu Research 比較論文（arXiv:2410.16527）](https://arxiv.org/abs/2410.16527)
- [promptfoo/promptfoo](https://github.com/promptfoo/promptfoo)
- [OpenAI：收購 Promptfoo 公告](https://openai.com/index/openai-to-acquire-promptfoo/)
- [microsoft/PyRIT](https://github.com/microsoft/PyRIT)；[PyRIT 論文（arXiv:2410.02828）](https://arxiv.org/abs/2410.02828)
- [CSA：Evaluating PyRIT for Agentic AI Red Teaming](https://cloudsecurityalliance.org/artifacts/evaluating-pyrit-for-agentic-ai-red-teaming)
- [AISecurityLab/hackagent](https://github.com/AISecurityLab/hackagent)；[HackAgent 白皮書（arXiv:2606.18193）](https://arxiv.org/abs/2606.18193)
- [上一篇：用 AI 審計自己的專案](/posts/ai/2026-10-24-audit-skills-cloudflare-trail-of-bits)
- [站內：promptfoo 評測入門](/posts/ai/2026-08-22-promptfoo-llm-evaluation)
