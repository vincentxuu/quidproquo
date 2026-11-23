---
title: "Dots Studio Dots 家族：dots3-note Preview 的長上下文 MoE、多模態與自架"
date: 2026-10-10
category: tech
type: deep-dive
tags: [dots-studio, dots3, moe, long-context, reasoning, open-weight]
lang: zh-TW
tldr: "dots3-note Preview 是小紅書 Dots Studio 的 280B 總參數／16B 啟用 MoE，512K context，權重與建模程式碼以 Apache 2.0 放在 Hugging Face 與 GitHub，FP8 版單台 8 卡可自架；OpenRouter 免費端點只收文字與圖片，2026-12-31 到期。官方評測與同尺寸的 Hy3、DeepSeek-v4-flash 互有勝負，技術報告尚未發布。"
description: "dots3-note Preview 的版本矩陣、架構、官方自報評測、Apache 2.0 權重與自架方式，以及 OpenRouter 免費端點的限制，和 Dots 家族從 dots.llm1 到 dots3 的演化。"
series:
  name: "AI 模型家族"
  order: 28
draft: false
---

> :globe: [English version](/posts/tech/2026-10-10-ai-model-family-dots-studio-en)

Dots Studio 是小紅書（RedNote）的模型團隊，目前的主力是 dots3-note Preview：280B 總參數、16B 啟用的多模態 MoE，支援 512K context，權重以 Apache 2.0 開放。它適合想找一顆可自架、長上下文、能吃圖片與音訊的 agent 模型，又不想上到兆級參數的團隊。讀完這篇，你可以決定要先用 OpenRouter 免費端點試、還是直接在自己的 8 卡節點上部署，以及上線前要驗哪些事。

## 家族定位與版本矩陣

| 模型／產品線 | 定位 | 關鍵差異 | 存取方式 |
|---|---|---|---|
| dots3-note Preview（`dots-studio/dots3-note-prev`） | dots3 系列最輕量的成員，推理與長程 agent | 280B total／16B active；512K context；輸入文字、圖片、影片、音訊，輸出文字 | Hugging Face、ModelScope、GitHub；Apache 2.0；BF16 |
| dots3-note Preview FP8（`dots-studio/dots3-note-prev-fp8`） | 同一模型的 FP8 量化版 | 官方建議單台 8 GPU 節點部署 | 同上 |
| OpenRouter `dots-studio/dots-3-note-preview:free` | 免費託管試用 | 只有 AtlasCloud 一家、FP8；只收文字與圖片；2026-12-31 到期 | OpenRouter API |
| dots.ocr／dots.mocr、dots.tts | 文件解析與語音合成專線 | 小模型，各自獨立迭代 | Hugging Face；授權各自不同，見〈家族演化〉 |

官方部落格說完整的 dots3 系列會有 note、jazz、aria 三個成員，依任務複雜度、回應速度與計算成本區分。jazz 與 aria 目前沒有權重，也沒有公布規格或日期。

有兩個容易混淆的地方。第一，權重支援的模態（文字、圖片、影片、音訊）比 OpenRouter 免費端點（文字、圖片）多；要測音訊或影片，得自架。第二，名稱裡的 Preview 是官方自己的定位：強化學習還沒做完，見〈限制與取捨〉。

## 家族演化

| 模型 | 時間 | 關鍵事實 | 改變了什麼選型 |
|---|---|---|---|
| dots.llm1 | 2025-05 | 142B total／14B active 文字 MoE，中英雙語，MIT | Dots 第一顆開放權重的通用模型，也公開了中間訓練檢查點 |
| dots.ocr | 2025-07 | 以 1.7B LLM 為底的多語文件解析，版面偵測與內容辨識合一，MIT | 文件解析有了可自架的小模型，不必拿通用模型做 OCR |
| dots.vlm1 | 2025-08 | 自訓 1.2B NaViT 視覺編碼器接 DeepSeek V3，MIT | 第一顆視覺語言模型，但底座是別家的 |
| dots.mocr | 2026-03 | 文件解析之外，能把圖表、UI 版面、科學圖等結構化圖形直接轉成 SVG 程式碼，MIT | OCR 專線往「圖轉結構」延伸 |
| dots.tts | 2026-06～08 | 2B 連續自回歸 TTS（48 kHz），base 版 Apache 2.0；編輯版 dots.tts.edit 另有授權 | 語音輸出有了自家模型，與 dots3 的語音理解分開 |
| dots3-note Preview | 2026-08 中旬 | 280B／16B 多模態 MoE、512K、Apache 2.0，架構自研並提交 Transformers | 主線從「文字 MoE＋外接視覺」換成單一模型吃文字、圖片、影片與音訊，本篇其餘各節都以它為準 |

這條線的轉折是：2025 年各模態各做一顆模型、借用外部底座；dots3 開始把感知與推理放進同一顆自研 MoE，授權也從 MIT 換成 Apache 2.0。OCR 與 TTS 仍是獨立的小模型線。

## 架構與訓練取捨

### 架構：稀疏 MoE 加混合注意力

Hugging Face 模型卡公開的架構如下：

| 項目 | 數值 |
|---|---|
| 層數 | 1 層 dense＋45 層 MoE |
| 專家 | 256 個 routed＋1 個 shared，每 token 取 top-8 |
| 注意力 | 13 層 DSA（top-2048）＋33 層滑動視窗注意力，約 1:3 |
| MTP | 1 層共用，1.13B，可做 speculative decoding |
| 視覺編碼器 | MoE ViT，7B total／1.2B active |
| 音訊編碼器 | dense，800M |
| 詞表 | 152K |
| 精度 | BF16、FP8 |

取捨有兩個。

- **啟用參數不等於部署記憶體。** 16B active 決定每個 token 的計算量，但 280B 權重仍要全部載入。官方建議的最小部署是 FP8 版放在一台 8 GPU 的節點上；BF16 需要更多記憶體。
- **長 context 靠稀疏注意力撐。** 四分之三的層只看滑動視窗，其餘層用 DSA 從長序列裡挑 2,048 個 token。這讓 512K 可行，但長距離資訊只能經由少數全域層傳遞；長文件找細節的能力要自己測，不能只看窗口大小。

### 訓練：長程任務的強化學習

官方部落格描述的訓練重點是長程 agent。他們提出 TEMPO（Test-time-scaled Value Estimation with Macro-step Policy Optimization）：把一次動輒十幾小時的 rollout 切成多個 macro-step，每段結束時由同一個 agent 切換成 critic，用推理與工具估計目前狀態的剩餘回報，不必等整個任務結束才更新策略。官方在 ARC-AGI-3 上的對照是 TEMPO 的平均分數比 baseline 檢查點高 31.5%、比 GRPO 高 20.6%。

另外他們建了數千個不需要先驗知識的超長程環境，訓練模型在陌生環境裡探索、自己寫記憶檔並在之後的決策裡使用。部落格也提到 IMO 2026 用的是 dots3-note Preview 的一個分支版本加內部 harness，不是公開發布的這顆權重本身。

詳細的訓練資料、token 預算與架構細節，官方說會放在技術報告，目前模型卡上仍標示「coming soon」。

## 評測與競品比較

以下全部是 Dots Studio 在官方部落格附錄自報的數字，標 * 的是 Dots 自己替其他模型跑的分數，其餘是各家公開數字。挑和 dots3-note 尺寸相近的兩個開放權重 MoE 來對照，並列出 Claude Opus 4.8 當上限參考：

| Benchmark | dots3-note Preview（280B／16B） | Hy3（295B／21B） | DeepSeek-v4-flash-0731（284B／13B） | Claude Opus 4.8 |
|---|---|---|---|---|
| SWE-bench Verified | 78.4 | 78.0 | － | 88.6 |
| SWE-bench Pro | 61.0 | 57.9 | － | 69.2 |
| Terminal-Bench 2.1 | 75.1 | 71.7 | 82.7 | 84.6 |
| BrowseComp（context management） | 83.3 | 84.2 | 74.5* | 84.3 |
| WildClawBench | 61.7 | 53.6 | 66.0* | 68.0 |
| Toolathlon-Verified | 55.6 | 56.8 | 70.7 | 76.2 |
| IFBench | 80.4 | 74.6* | 78.7* | 62.2 |

讀這張表要注意三件事。

- **同尺寸互有勝負。** 對 Hy3 大致持平略優；對 DeepSeek-v4-flash-0731，coding agent（Terminal-Bench、Toolathlon）明顯落後，指令遵循與部分搜尋任務較好。
- **harness 各不相同。** SWE 系列用 live-swe-agent、Terminal-Bench 用 Terminus-2、WildClawBench 用 OpenClaw，溫度與 context 上限也逐項不同，不能跨列加總。
- **ARC-AGI-2 的 81.4 不能直接比。** 那是 Dots 在公開評測集上自己跑的分數，其他模型多半是官方私有集排行榜的成績，所以沒有放進上表。

多模態部分，官方自報 MMMU-Pro 79.1、CharXiv Reasoning 83.1、VideoMMMU 86.8、VoiceBench 92.4、MMAU-Pro 69.8。同表的 Kimi K3、Gemini-3.5-flash 多數列較高，dots3-note 在這組裡屬於中段，不是領先者。

沒有第三方的獨立覆現。上線前請用自己的任務重測。

## 授權、價格與部署

### 授權

權重與建模程式碼都以 **Apache 2.0** 授權，Hugging Face 倉庫附有 LICENSE 全文，著作權人是小紅書，由 Dots Studio 開發與發布。GitHub 倉庫 `studio-dots-ai/dots3-note-prev` 也是 Apache 2.0。Apache 2.0 允許商用、修改與再散布，需保留授權與著作權聲明；Transformers、SGLang、vLLM 等第三方軟體各自適用自己的授權。

### 價格

| 通路 | 價格 | 限制 |
|---|---|---|
| OpenRouter `dots-studio/dots-3-note-preview:free` | 免費 | 只有 AtlasCloud（FP8）一家；文字與圖片輸入；最大輸出 460,800 tokens；2026-12-31 到期；免費層有速率限制 |
| 自架 | 硬體成本 | 見下節 |

官方部落格的 API 申請入口連到的就是這個 OpenRouter 免費端點，沒有另外公開的付費價目。它適合評估，不適合當長期依賴：只有一家 provider、有明確到期日。

### 自架

- **vLLM**：`main` 分支已原生支援，穩定版收錄前用 nightly。官方範例是 FP8 版在 8 張 H100 上以 TP=8、EP=8 部署，`--max-model-len 262144`。
- **SGLang**：官方提供 `lmsysorg/sglang:dev-dots3-note` 映像檔與 cookbook，可吃滿 524,288 context；原始碼支援仍在 PR #33829 審查。
- **Transformers**：官方文件已收錄 `dots3_note`（2026-11-12 併入），適合小量推論與除錯，多卡服務仍建議用 SGLang 或 vLLM。
- **常用參數**：`enable_thinking` 開關推理模式；工具呼叫用 `--tool-call-parser dots`；只要文字時可加 `--language-only`（SGLang）或 `--language-model-only`（vLLM）少載視覺與音訊編碼器；MTP speculative decoding 官方說可降低 TPOT 一半以上。

### API 範例

自架後是 OpenAI 相容介面，下面是模型卡的最小請求；改成 OpenRouter 時把 `base_url` 換成 `https://openrouter.ai/api/v1`、`model` 換成 `dots-studio/dots-3-note-preview:free`。本文沒有執行這段程式：

```python
from openai import OpenAI

client = OpenAI(base_url="http://127.0.0.1:8000/v1", api_key="EMPTY")
response = client.chat.completions.create(
    model="dots3-note-prev",
    messages=[{"role": "user", "content": "請把以下文字整理成摘要，並標明每個結論的原文依據：..."}],
    temperature=1.0,
    top_p=0.95,
    max_tokens=1024,
    extra_body={"chat_template_kwargs": {"enable_thinking": False}},
)
print(response.choices[0].message.content)
```

## Agent 使用與選型

### 長上下文與 RAG 怎麼搭配

512K 適合先試跨章節摘要、多份文件放進同一個問題比較，或要求模型回到指定段落找證據。窗口大小不保證模型能找出每個細節，也不保證引用正確；前面提到大部分層只看滑動視窗，這點更需要實測。

和 RAG 相比，直接塞完整文件省去檢索設計，但每次請求都要處理全部輸入。可以用同一批問題比較兩條路徑：答案有沒有出處、漏掉哪些條件、等多久，再決定要不要整份塞進去。

### 工具呼叫與文件工作流

模型提出工具呼叫，真正執行搜尋、SQL、檔案讀寫的是主程式。做案件資料整理時，可以先建這樣的流程：

1. 主程式解析文件，保留頁碼與文件 ID。
2. 把文字、圖片或音訊交給模型，要求提取指定欄位。
3. 需要找相似案件時，由主程式執行檢索，再把結果傳回。
4. 模型整理比較表，主程式驗證欄位與引用是否對得上原文。

這是應用設計範例，本文沒有執行。上線前用已知答案的文件測試，並保留人工覆核。

### 選型時怎麼比較

| 需求 | 建議 |
|---|---|
| 先評估能力、不想管硬體 | OpenRouter 免費端點；記得它 12 月底到期、只吃文字與圖片 |
| 音訊、影片理解 | 自架；免費端點不支援這兩種輸入 |
| 長程 agent、多步工具 | 列入候選，和 Hy3、DeepSeek-v4-flash 用自己的 harness 對測 |
| coding agent 為主 | 官方自報在 Terminal-Bench、Toolathlon 落後同尺寸的 DeepSeek-v4-flash-0731，先測再決定 |
| 低延遲短問答 | 同時測更小的 dense 模型，量端到端時間 |
| 商用自架 | Apache 2.0 可以；硬體門檻是 8 卡節點 |

## 限制與取捨

- **這是 Preview。** 官方自己列的限制是強化學習還沒做完，幻覺控制、文字與多模態能力的平衡、整體穩定性都還不足。
- **評測全是官方自報。** 技術報告尚未發布，訓練資料與細節無法核對；部分競品分數是 Dots 自己跑的。
- **免費端點會到期。** OpenRouter 免費版 2026-12-31 到期、只有一家 provider，沒有公開的付費替代端點；長期服務要自架。
- **硬體門檻高。** 16B 啟用聽起來小，但 280B 權重要整份載入；FP8 也要一台 8 卡節點。
- **模擬環境不等於真實場景。** 部落格裡的婚禮籌備、旅遊規劃等長程案例都跑在模擬環境，官方也說真實體驗還需要 harness、connector、資料源與權限機制配合。
- **圖片輸入不等於完整 PDF 處理。** 應用程式仍要決定先抽文字、把掃描頁轉成圖片，還是用 dots.ocr 這類專用模型先解析。

## 更新紀錄

- 2026-11-23：修正錯誤：舊版寫「權重授權未確認、沒有官方權重倉庫」，實際上官方在 2026 年 8 月中旬就以 Apache 2.0 在 Hugging Face 與 GitHub 釋出權重與建模程式碼。依官方部落格與 Hugging Face 模型卡重寫矩陣、架構、評測、授權與部署各節；補上 dots3 系列規劃（note／jazz／aria）、FP8 版、自架方式、OpenRouter 免費端點的模態限制與到期日，以及從 dots.llm1、dots.ocr、dots.vlm1、dots.mocr 到 dots.tts 的家族演化。
- 2026-10-11：依共同家族格式重排章節，使用既有資料補版本矩陣；事實核對日期沿用既有紀錄。
- 2026-10-11：核對平台全文，修正文字限定的錯誤，移除未確認的官網、倉庫、訓練與部署宣稱，補上模型與應用程式的分工後發布。

## 參考資料

- [Dots Studio 官方技術部落格：dots3-note Preview（英文）](https://studio.dots.ai/dots/dots3-en.html)
- [Dots Studio 官方技術部落格：dots3-note Preview（中文）](https://studio.dots.ai/dots/dots3-zh.html)
- [Hugging Face：dots-studio/dots3-note-prev 模型卡與 LICENSE](https://huggingface.co/dots-studio/dots3-note-prev)
- [Hugging Face：dots-studio/dots3-note-prev-fp8](https://huggingface.co/dots-studio/dots3-note-prev-fp8)
- [GitHub：studio-dots-ai/dots3-note-prev](https://github.com/studio-dots-ai/dots3-note-prev)
- [Hugging Face Transformers 文件：Dots 3 Note Preview](https://huggingface.co/docs/transformers/en/model_doc/dots3_note)
- [vLLM Recipes：dots3-note-prev](https://recipes.vllm.ai/dots-studio/dots3-note-prev)
- [TEMPO 技術部落格](https://studio.dots.ai/dots/tempo-blog.html)
- [OpenRouter：Dots3-Note Preview（free）](https://openrouter.ai/dots-studio/dots-3-note-preview:free)
- [OpenRouter 免費模型與速率限制](https://openrouter.ai/docs/api-reference/limits)
- [Hugging Face：dots-studio 組織頁（dots.llm1、dots.ocr、dots.vlm1、dots.mocr、dots.tts）](https://huggingface.co/dots-studio)
- [AI 模型評測來源指南：如何解讀評測證據](/posts/tech/2026-08-24-ai-model-evaluation-sources)
