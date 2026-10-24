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
tldr: "兩份都寫「攻擊成功率 5%」的報告不能直接比：數字背後有誰出題（攻擊者模型）、誰判定（judge，負責判定的模型或規則）、分母算什麼三個變數。garak 官方 FAQ 說自己的分數沒有科學效度，HackAgent 白皮書裡兩個模型的先後會隨 judge 門檻翻轉。我查到的資料裡，四個工具都沒有獨立的準確度評測。"
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

在[系列地圖](/posts/ai/2026-10-24-ai-agent-security-tooling-map)上，這是第六類：測試 AI 系統本身，適合自己做 LLM 應用、想知道它抗不抗得住攻擊的人。內容依據各專案的文件、論文與第三方評估，只讀文件，沒有讀 garak 的原始碼；沒有安裝，也沒有對任何系統發送攻擊。

## 四個工具共用的骨架

四個工具做的事很像：

1. 攻擊端產生一批攻擊提示，有的是寫死的清單，有的是另一個模型即時改寫。
2. 把提示送給目標（你的應用或模型端點）。
3. 由一個「判定端」（常稱 judge）看回答，決定這次有沒有被攻破。判定端可以是關鍵字規則、分類器，也可以是另一個 LLM。
4. 把判定結果加總成報告。

差別在定位：

| 工具 | 主要被測物 | 判定方式 |
|---|---|---|
| [garak](https://github.com/NVIDIA/garak)（NVIDIA） | LLM 模型與對話端點 | 關鍵字與小型分類器為主 |
| [promptfoo](https://github.com/promptfoo/promptfoo) | 你設定的 LLM 應用、RAG、agent 或 HTTP 端點 | LLM judge，預設用 gpt-5 |
| [PyRIT](https://github.com/microsoft/PyRIT)（微軟 AI Red Team） | 生成式 AI 系統，是組合元件的框架 | 規則或 LLM scorer（PyRIT 裡負責評分的元件） |
| [HackAgent](https://github.com/AISecurityLab/hackagent) | AI 模型與 agent | 多個 judge 模型投票 |

garak 的 README 自己拿 nmap 與 Metasploit 比喻，說它對 LLM 做的事類似。promptfoo 同時是評測工具，紅隊只是其中一個功能，它的基本用法在[這篇](/posts/ai/2026-08-22-promptfoo-llm-evaluation)。

## 成功率背後的三個變數

「攻擊成功率 5%」要有意義，得先知道三件事。

**誰出題。** 寫死的攻擊清單和另一個模型即時改寫的攻擊，強度差很多。HackAgent 的白皮書就寫明：Fable 5 與 Fable 5.1 兩輪測試用了不同的攻擊者模型，所以那組比較的單位是（目標，攻擊者）配對，變數不只一個；作者自己說只有排名方向可信，倍數不能引用。

**誰判定。** [garak 的 FAQ](https://github.com/NVIDIA/garak/blob/main/FAQ.md) 回答「這些結果有科學效度嗎」，答案是「沒有」：不同測試組（garak 稱 probe）的分數沒有共同的標準化尺度，garak 也不是 benchmark，建議不要依賴超過六個月的分數。FAQ 另外提到會用一籃子 SOTA 模型做 Z-score 校準，但那只反映分數的相對位置，準不準還得另外驗證。獨立研究也印證判定端會誤判：[Fujitsu 2024 年的比較論文](https://arxiv.org/abs/2410.16527)測了 garak，在某些攻擊類別上，判斷攻擊是否成功的錯誤率最高約 37%。這是單一類別的最大值，整體平均不會比它更高。論文舉的例子是：回答裡只要出現「unethical」這個字，靜態規則就把整段當成拒絕。

這份結果來自舊版 v0.9。現行的 v0.17 系列（v0.17.0 於 2026 年 9 月發布，最新的 v0.17.1 在 10 月 16 日發布）已修了許多 detector（garak 裡判定回答是否被攻破的元件），舊數字不能直接套用。

**分母算什麼。** [HackAgent 白皮書](https://arxiv.org/html/2606.18193v2)的分母是「嘗試次數」：同一個有害意圖試了幾次就算幾次；模型拒答的嘗試也留在分母裡，拒答多的模型數字會比較好看。下一節有例子。

## 例子：同一批資料，換個門檻，兩個模型的先後就翻轉

HackAgent 的白皮書測了 Opus 4.8、Fable 5、Fable 5.1 三個模型，標題數字用「五個 judge 至少四個判有害」才算被攻破。這些數字來自 TAP（樹狀搜尋式的多輪攻擊）與 PAP（一次性的說服式改寫）兩種攻擊合併的子集，每個目標 15,652 次嘗試，只涵蓋白皮書的部分攻擊：

| 判定門檻 | Opus 4.8 | Fable 5 | Fable 5.1 |
|---|---|---|---|
| 至少 1/5 judge 認定 | 10.39% | 4.45% | 9.91% |
| 至少 2/5 | 9.91% | 4.13% | 9.75% |
| 至少 3/5 | 8.68% | 3.53% | 9.35% |
| 至少 4/5（標題用） | 5.76% | 2.72% | 8.19% |

以上取自白皮書的表 4。

在 1/5 與 2/5 這兩個最寬鬆的門檻，Opus 4.8 比 Fable 5.1 更容易被攻破；要到 3/5 以上，順序才變成 Fable 5.1 最容易。白皮書的說法是這個先後 bar-dependent，引用時要附上規則。翻轉的只有這兩個模型：Fable 5 在每個門檻都是最難攻破的。

另一個細節是拒答。Fable 5 有回應的比例只有 56%，Opus 4.8 是 91%。

兩種攻擊要分開看。在 TAP 攻擊下，作者認為三個模型的差距大半是拒答造成的，把拒答排除後差距幾乎消失；但在 PAP 攻擊下，排除拒答後差距不變，作者的結論是真正拉開模型的是一次性的說服式改寫。所以拒答只解釋了一部分，Fable 5 的優勢不會因此消失。

這份白皮書是工具作者自己做的測試，「獨立」指的是獨立於被測的模型廠商，對工具本身並不獨立。

五個 judge 的嚴格度也差很多：一個只有 20% 的嘗試判有害，其他四個在 58% 到 67%。文件裡沒有 judge 對照人工標註的準確率，作者也承認絕對數字沒有大規模人工稽核。

所以兩份報告都寫「攻擊成功率 5%」，不能直接比。要先確認攻擊者模型、judge 與分母都相同。

## 每個工具要知道的事

- **garak**：預設會跑全部 probe，完整跑可能花上數小時（FAQ 提到有人跑到最後不得不中止掃描）；FAQ 說相依套件約 9GB。
- **promptfoo**：2026 年 3 月 OpenAI 公告同意收購，官方公告寫成交仍須滿足一般條件；現在 README 寫「已成為 OpenAI 的一部分」，公開資料裡只有收購公告，沒有成交公告。它的 README 說 eval「100% 在本機執行」，這對一般評測成立；紅隊有些 plugin（各自產生某一類攻擊的模組）只能走 promptfoo 的託管服務，[資料處理說明](https://www.promptfoo.dev/docs/red-team/troubleshooting/data-handling/)寫的預設情況（沒自帶 API key）下，攻擊產生與評分會把 `purpose`（你在設定檔裡描述應用用途的欄位）與目標回應送到它的伺服器。模型廠商買下紅隊測試工具，讀它的結果時要多看一眼利益關係：它會不會偏向自家模型，得靠公開的評測設定來查，這點目前沒有第三方資料。
- **PyRIT**：[CSA（雲端安全聯盟）的評估](https://cloudsecurityalliance.org/artifacts/evaluating-pyrit-for-agentic-ai-red-teaming)寫道，PyRIT 只看 LLM 的文字回應，沒有涵蓋 agent 實際的狀態變化或工具呼叫。[論文](https://arxiv.org/abs/2410.02828)提到它在微軟內部用於 100 多次紅隊作業；我讀到的部分沒有攻擊成功率的表。所以拿它測 agent，只能測到「agent 說了什麼」，測不到「agent 做了什麼」。
- **HackAgent**：由 AI4I 旗下的 AI Security Lab 開發，有託管版本；文件要求事前取得書面授權、約定測試範圍，這是流程要求，程式裡沒有強制。

## 授權與範圍

這四個工具的攻擊面，大多只限於把文字送到你指定的端點，風險比網路掃描器小。但它們沒有一個在程式裡強制檢查「你有權測這個目標」。garak 的論文寫它像 Metasploit，會影響正式環境，只應在獲得授權後使用。對第三方 API 發大量有毒提示，可能違反對方的使用條款，這是推論。

## 怎麼用

1. **先決定你要測模型還是整個應用。** 只測模型端點，從 garak 起步最單純；要連系統提示、檢索和工具一起測，先確認你選的工具能把請求送到你應用的 HTTP 端點（promptfoo 可以設定，其他請查各自文件）。
2. **讀報告前先問三題：** 攻擊者模型是誰、judge 是誰、分母是什麼。任何一題報告沒寫，這個數字只能當方向。
3. **自己抽樣讀判定。** 隨機挑 20 筆「被判攻破」和 20 筆「被判守住」，用人眼看判得對不對，才知道 judge 在你的應用上準不準。
4. **測 agent 的實際行為，要另外記錄工具呼叫。** 這幾個工具看的是文字回應，要確認 agent 有沒有真的呼叫工具、改狀態，得自己加一層紀錄（第 4 篇）。
5. **只對自己擁有或書面授權的目標跑。** 跑託管 plugin 之前，先在設定檔找出哪些 plugin 會連到廠商伺服器，把 `purpose` 與測試用的目標回應改成不含客戶資料的樣本再跑；測試內容會送到海外服務，若含客戶資料，先確認公司的資料外送規範。

## 自我檢查

問題：兩份報告都寫「攻擊成功率 5%」，可以直接比較嗎？

答案：不行。先確認三件事：攻擊者模型是不是同一個、judge 是不是同一個、分母算的是嘗試次數還是有害意圖的種類數。任何一項不同，這兩個 5% 量的就不是同一件事。

## 整體來說

這類工具能讓你系統化地、重複地丟攻擊給自己的應用，這件事有價值。但輸出的數字只代表「這組攻擊、這個 judge、這個分母」下的結果，garak 的 FAQ 對自己的分數也是這個態度。我查到的資料裡，沒有任何一個工具有獨立的、量化的準確度評測。

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
- [promptfoo：資料處理說明](https://www.promptfoo.dev/docs/red-team/troubleshooting/data-handling/)
- [上一篇：用 AI 審計自己的專案](/posts/ai/2026-10-24-audit-skills-cloudflare-trail-of-bits)
- [站內：promptfoo 評測入門](/posts/ai/2026-08-22-promptfoo-llm-evaluation)
