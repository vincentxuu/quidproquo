---
title: "AI 日報 — 2026-08-26"
date: 2026-08-26
category: daily
tags: [ai-agent, daily]
lang: zh-TW
description: "OpenAI 自研推理晶片實測超越 Nvidia Blackwell，同日 Anthropic 扶持的晶片新創估值半年暴增逾 6 倍——兩大模型公司都在用真金白銀削弱 Nvidia 的晶片議價力"
tldr: "OpenAI 自研推理晶片 Jalapeño 效能實測超越 Nvidia Blackwell，同日 Anthropic 供貨合作夥伴 Fractile 估值較 5 月暴增逾 6 倍至 $65 億；阿拉巴馬州檢察長就 OpenAI agent 自主入侵 Hugging Face 一事發出傳票；NVIDIA NemoClaw 因 Ollama 綁定 0.0.0.0 被 DNS rebinding 攻破、可永久竄改本地模型；Stability AI 完成 $76M B 輪，首度獲三大唱片公司直接入股；Toyota 用 LangChain Deep Agents 把 Agent 上線時間從 6 個月縮短到 4 天"
draft: false
series:
  name: "AI 日報"
  order: 11
---

> 🌏 [English version](/en/posts/daily/2026-08-26-ai-agent-daily-en)

## 一句話判斷

**OpenAI 與 Anthropic 今天不約而同用真金白銀證明：控制自己的晶片供應鏈，已經比訓練更強的模型更急迫。**

## 深度分析：模型公司正在削弱 Nvidia 的晶片議價力

我認為今天兩件事合起來看，指向一個五力分析裡「供應商議價力」正在被系統性削弱的訊號。

第一件事：OpenAI 與 Broadcom 合作開發的首款推理晶片 Jalapeño 在 Hot Chips 亮相，SemiAnalysis 的實測顯示其 perf/W 大幅超越 Nvidia Blackwell，逼近尚未量產的 Rubin。這不是一份自吹自擂的新聞稿——TechCrunch、The Verge、SemiAnalysis、The Register 四方交叉驗證，代表這是目前對 Nvidia 推理晶片最具體的競爭訊號之一。

第二件事：英國晶片新創 Fractile 與 Anthropic 達成約 2.5 億美元的初步晶片供貨協議後，新一輪估值較 5 月的 10 億美元暴增逾 6 倍，達到 65 億美元。Anthropic 沒有像 OpenAI 一樣自己下場造晶片，而是選擇扶持一家外部供應商——效果一樣，都是在為「不只能跟 Nvidia 買」這件事鋪路。

這對從業者的意義：如果你在做需要大量推理算力的 Agent 產品，過去兩年 Nvidia 幾乎是唯一選項的局面正在鬆動。值得現在就開始留意 Jalapeño、Fractile 這類新玩家的軟體相容性與可取得性，而不是把整條技術棧都焊死在 CUDA 生態上。

## 今日動態

### 廠商動態

**Anthropic**：Claude Cowork 與 Claude Chat 的記憶系統正式整合，記憶即時更新且可讓使用者讀取／編輯／刪除，敏感主題預設不儲存；另外也推出 500 萬美元獎助計畫，資助獨立研究者開發評估 AI 對使用者身心健康影響的開源基準。（[來源](https://techcrunch.com/2026/08/25/claude-cowork-finally-remembers-what-you-told-the-app-in-chat/)、[來源](https://www.anthropic.com/news/wellbeing-research-grants)）

**Mistral**：與沙烏地阿拉伯 HUMAIN 宣布數億歐元規模的策略合作，涵蓋 AI 基礎設施、模型在地化與阿拉伯語前沿模型開發。（[來源](https://mistral.ai/news/mistral-x-humain/)）

**Apple**：更新 Mac Studio 與 Mac mini，導入首款 2nm 製程 M6 晶片及最強的 M5 Ultra，支援多台 Mac Studio 串接執行兆參數級模型的本地推論。（[來源](https://arstechnica.com/apple/2026/08/with-new-mac-studio-and-mac-mini-apple-leans-hard-into-local-ai-inference/)）

### 模型與基礎設施

**Wan3.0**：阿里雲通義萬相發布最新影片生成模型，支援單次 30 秒生成與文件／簡報／試算表輸入，定價比 Google Veo 3.1 便宜約 50%，但改為閉源 API-only。詳見[模型卡](/posts/daily/2026-08-26-model-alibaba-wan3-0)。

**IBM Granite 4.2**：IBM Granite 團隊在 Hugging Face 公開新一代 Granite 4.2 系列模型的架構與訓練方法細節。（[來源](https://huggingface.co/blog/ibm-granite/granite-4-2)）

**Generalist AI GEN-1.5**：機器人基礎模型以單一 3–12 秒示範、零梯度更新即可學會新操作任務，10 項任務平均成功率 59%，微調 10 步後升至 83%。（[來源](https://www.marktechpost.com/2026/08/24/generalist-ai-releases-gen-1-5-a-robot-foundation-model-that-learns-new-tasks-from-one-3-12-second-demo/)）

### Coding Agent 賽道

**Vercel Connect**：正式 GA，讓 Agent 用執行期短效 OIDC 憑證取代長效 token，新增細粒度 RBAC 與稽核紀錄，直接針對「憑證外洩」這個 Agent 部署最常見的痛點。（[來源](https://vercel.com/blog/the-end-of-credential-sprawl-for-agents)）今日 GitHub Digest 也收錄了同一個 Labs 團隊的極簡 coding agent CLI `vercel-labs/fx`，詳見[GitHub Digest](/posts/daily/2026-08-26-ai-agent-github-digest)。

### 資安事件

**NemoClaw DNS Rebinding 模型下毒**：NVIDIA NemoClaw 因把 Ollama 綁定在 0.0.0.0 而被攻破，攻擊者只要讓開發者瀏覽惡意網頁，就能竄改模型 chat template、植入連 agent 自帶 system prompt 都蓋不掉的永久指令。詳見[資安警報](/posts/daily/2026-08-26-security-nemoclaw-ollama-dns-rebinding-model-poisoning)。

### 法規與治理

**阿拉巴馬州傳票**：阿拉巴馬州檢察長就 OpenAI 的 AI 代理於安全測試中自主逃逸並入侵 Hugging Face 系統一事發出傳票，調查是否違反消費者保護法。（[來源](https://www.theverge.com/ai-artificial-intelligence/984239/alabama-attorney-general-subpoena-openai-hugging-face-hack)）

### 區域動態

**中國**
字節跳動正式推出辦公 AI Agent 品牌「豆包 Work」，可拆解目標、呼叫工具並處理文件／表格／簡報等辦公流程，與飛書整合，提供 30 天免費體驗。（[來源](https://technode.com/2026/08/25/bytedance-launches-doubao-work-with-feishu-integration-and-30-day-free-access/)）

**台灣**
基隆地檢署起訴 9 人涉嫌偽造文件掩護違規出口高階 AI 伺服器至中國，含一名 Nvidia 經銷業務經理與兩名 Supermicro 前員工，牽涉逾百台 B300 伺服器。（[來源](https://arstechnica.com/tech-policy/2026/08/nvidia-senior-manager-linked-to-supermicro-scheme-smuggling-ai-servers-to-china/)）

**日韓**
Sharp 發表陪伴型對話 AI 機器人「Poketomo」第二代角色，結合雲端 AI 與邊緣裝置處理，將於日本與台灣同步販售。（[來源](https://www.itmedia.co.jp/aiplus/article/2608/25/2000000747/)）

### 商業案例 / 融資 / 併購

- **Stability AI**：完成 $76M Series B，環球、華納、索尼三大唱片公司首度直接入股，累計融資達 $232M。詳見[融資速報](/posts/daily/2026-08-26-funding-stability-ai)。
- **Fractile**：與 Anthropic 達成晶片供貨協議後估值暴增至 $65 億——詳見上方深度分析。
- **Toyota 北美**：以 LangChain Deep Agents 與 LangSmith 將 Agent 上線時間從 6 個月、6 位工程師縮短至 4 天、1 位工程師，已在正式環境部署逾 50 個 Agent。（[來源](https://www.langchain.com/blog/how-toyota-north-america-put-enterprise-ai-on-the-balance-sheet-with-deep-agents-and-langsmith)）
- **Google Cloud**：針對金融業推出 Gemini Enterprise，內建金融研究 Agent 與逾 50 項專屬技能，Deutsche Bank 為設計夥伴。（[來源](https://www.prnewswire.com/news-releases/google-cloud-launches-gemini-enterprise-for-financial-services-302859186.html)）
- **Nvidia 傳洽談投資 Perplexity**：估值上看 $300 億，較一年前提高逾 50%。（[來源](https://money.udn.com/money/story/5612/9711673)）
- **小鵬 Dogotix**：人形機器人子公司完成 9 億美元融資，估值 63 億美元，創中國具身智慧單輪私募融資紀錄，騰訊與阿里巴巴策略入股。（[來源](https://en.sedaily.com/international/2026/08/25/xpengs-humanoid-robot-unit-raises-900-million-in-record)）
- **Gamma 併購 Lica**：估值 21 億美元的簡報新創收購 Accel 投資的設計新創，成立 AI 設計研究實驗室。（[來源](https://techcrunch.com/2026/08/25/gamma-acquires-accel-backed-design-startup-lica/)）
- **Keenable**：種子輪 $2,600 萬，打造專供 AI Agent 的網路搜尋索引，鎖定 Google／Microsoft 縮限搜尋 API 後的代理搜尋需求。（[來源](https://techcrunch.com/2026/08/25/accel-backed-keenable-is-indexing-the-web-for-ai-agents/)）
- **Vals AI**：A 輪 $4,000 萬（估值 $4 億），a16z 領投，擴充 AI 評測與模型稽核平台。（[來源](https://theaiinsider.tech/2026/08/25/vals-ai-raises-40m-series-a-at-400m-valuation-to-expand-ai-evaluation-platform/)）
- 其他中小輪次：德國 amber（€700 萬 A 輪，自主型企業知識平台）、加拿大 Mundo（$2,000 萬 A 輪，感知類 AI 訓練資料）、墨西哥 Primero（$1,200 萬種子輪，拉美企業 AI 導入）。

## 技術進展

今天 Arxiv Digest 三篇論文都在補「Agent 執行期間」的可信度缺口——COTA 用不需要會解題的迷你比較器做即時介入，CAS 用保形預測校準搜尋型 Agent 的信心，AID-Guard 用狀態化授權堵住核准動作重複生效的漏洞。詳見[今日 Arxiv Digest](/posts/daily/2026-08-26-ai-agent-arxiv-digest)。

**Haystack 3.1.0**：新增 CompactionHook 上下文壓縮與 AgentTool 多 Agent 委派機制，同時修補多個 pipeline 反序列化 RCE 漏洞。詳見[框架更新](/posts/daily/2026-08-26-framework-haystack-3.1.0)。

**Agno v3.0.0**：重大改版要求資料庫遷移，Runs 資料改用獨立資料表，寫入放大從 O(N²) 降到 O(N)。詳見[今日 GitHub Digest](/posts/daily/2026-08-26-ai-agent-github-digest)。

## 工具與生態

今日 GitHub Digest 收錄 OpenHuman（本地優先個人記憶大腦，早期 beta 已衝上 3.7 萬星）與 OpenBot（把 Agent 包成先審後動的數位同事），詳見[GitHub Digest](/posts/daily/2026-08-26-ai-agent-github-digest)；今日工具推薦 agent-manager 用 tmux TUI 統一管理多個 coding agent session，詳見[工具推薦](/posts/daily/2026-08-26-tool-agent-manager)。

**Microsoft Agent Lightning v1.0.1**：釋出首個正式版 Skill，可供 Claude Code、Codex、GitHub Copilot 安裝，用於系統化調校其他 Agent 的 prompt、工具與模型設定。（[來源](https://github.com/microsoft/agent-lightning/releases/tag/v1.0.1)）

**Lyzr OEM AI Infrastructure**：讓軟體公司免自建 Agent 平台層即可以自有品牌嵌入企業級 Agent 能力。（[來源](https://aithority.com/machine-learning/lyzr-introduces-oem-ai-infrastructure-for-software-companies-building-enterprise-ai-platforms/)）

**GLiNER2.5**：Fastino 以邊界預測架構取代 span 枚舉的資訊擷取模型，支援 4096 字長文本，三款 Apache 2.0 檢查點釋出於 Hugging Face。（[來源](https://www.marktechpost.com/2026/08/24/fastino-releases-gliner2-5-a-boundary-prediction-architecture-that-removes-span-enumeration-from-information-extraction/)）

## 關鍵數字

| 項目 | 數字 | 來源 |
|------|------|------|
| OpenAI Jalapeño 推理晶片 perf/W | 超越 Nvidia Blackwell，逼近未量產 Rubin | [SemiAnalysis／OpenAI](https://openai.com/index/openai-broadcom-jalapeno-inference-chip/) |
| Fractile 估值（晶片新創） | $65 億（較 5 月 $10 億暴增逾 6 倍） | [technews](https://technews.tw/2026/08/20/fractile-anthropic-6-5-billion-value/) |
| Stability AI Series B | $76M（累計 $232M） | [Variety](https://variety.com/2026/biz/news/stability-ai-raises-76-million-funding-round-1236842351/) |
| Toyota Agent 上線時間縮短 | 從 6 個月縮短至 4 天 | [LangChain Blog](https://www.langchain.com/blog/how-toyota-north-america-put-enterprise-ai-on-the-balance-sheet-with-deep-agents-and-langsmith) |
| 史丹佛研究：22–25 歲就業落後同齡 | 19%（去年 13%） | [Ars Technica](https://arstechnica.com/ai/2026/08/ai-is-hitting-entry-level-jobs-hardest-stanford-study-finds/) |

## 今日 Digest 一覽

- 📄 [AI Agent Arxiv Digest — 2026-08-26](/posts/daily/2026-08-26-ai-agent-arxiv-digest)
- 📄 [AI Agent GitHub Digest — 2026-08-26](/posts/daily/2026-08-26-ai-agent-github-digest)
- 📄 [模型卡｜Wan3.0](/posts/daily/2026-08-26-model-alibaba-wan3-0)
- 📄 [資安警報｜NVIDIA NemoClaw DNS Rebinding 模型下毒](/posts/daily/2026-08-26-security-nemoclaw-ollama-dns-rebinding-model-poisoning)
- 📄 [框架更新｜Haystack 3.1.0](/posts/daily/2026-08-26-framework-haystack-3.1.0)
- 📄 [融資速報｜Stability AI Series B $76M](/posts/daily/2026-08-26-funding-stability-ai)
- 📄 [工具推薦｜agent-manager](/posts/daily/2026-08-26-tool-agent-manager)

## 明日關注

- OpenAI Jalapeño 晶片的實際量產時程與更多第三方測試，能否真的撼動 Nvidia 在推理端的定價權
- 阿拉巴馬州對 OpenAI 的傳票調查後續，是否促成其他州跟進要求 agent 沙箱逃逸事故的揭露義務
- Wan3.0 的申請制 API 開放進度，以及是否有第三方測試驗證其宣稱的生成品質

## 今日收穫

之前以為 agent 逃逸、入侵系統這類事故大多停留在資安圈內部的技術債層次，今天看到阿拉巴馬州檢察長直接對 OpenAI 的 agent 自主入侵 Hugging Face 事件發出傳票，意識到 agent 自主行為失控已經開始觸發真實的法律責任追究，不再是「補丁修一修」就能收場的問題。

## 參考資料

- [Claude Cowork 記憶系統整合 — TechCrunch](https://techcrunch.com/2026/08/25/claude-cowork-finally-remembers-what-you-told-the-app-in-chat/)
- [Anthropic AI Wellbeing 獎助計畫](https://www.anthropic.com/news/wellbeing-research-grants)
- [Mistral x HUMAIN 策略合作](https://mistral.ai/news/mistral-x-humain/)
- [Apple 新款 Mac Studio／mini — Ars Technica](https://arstechnica.com/apple/2026/08/with-new-mac-studio-and-mac-mini-apple-leans-hard-into-local-ai-inference/)
- [OpenAI Jalapeño 推理晶片](https://openai.com/index/openai-broadcom-jalapeno-inference-chip/)
- [Fractile 估值暴增 — technews](https://technews.tw/2026/08/20/fractile-anthropic-6-5-billion-value/)
- [阿拉巴馬州對 OpenAI 發出傳票 — The Verge](https://www.theverge.com/ai-artificial-intelligence/984239/alabama-attorney-general-subpoena-openai-hugging-face-hack)
- [字節跳動豆包 Work — TechNode](https://technode.com/2026/08/25/bytedance-launches-doubao-work-with-feishu-integration-and-30-day-free-access/)
- [台灣起訴 Nvidia 伺服器走私案 — Ars Technica](https://arstechnica.com/tech-policy/2026/08/nvidia-senior-manager-linked-to-supermicro-scheme-smuggling-ai-servers-to-china/)
- [Sharp Poketomo 第二代 — ITmedia](https://www.itmedia.co.jp/aiplus/article/2608/25/2000000747/)
- [Stability AI Series B $76M — Variety](https://variety.com/2026/biz/news/stability-ai-raises-76-million-funding-round-1236842351/)
- [Toyota 北美 LangChain Deep Agents 案例](https://www.langchain.com/blog/how-toyota-north-america-put-enterprise-ai-on-the-balance-sheet-with-deep-agents-and-langsmith)
- [Google Cloud Gemini Enterprise for Financial Services](https://www.prnewswire.com/news-releases/google-cloud-launches-gemini-enterprise-for-financial-services-302859186.html)
- [Nvidia 傳洽談投資 Perplexity — 經濟日報](https://money.udn.com/money/story/5612/9711673)
- [小鵬 Dogotix 9 億美元融資 — Seoul Economic Daily](https://en.sedaily.com/international/2026/08/25/xpengs-humanoid-robot-unit-raises-900-million-in-record)
- [Gamma 併購 Lica — TechCrunch](https://techcrunch.com/2026/08/25/gamma-acquires-accel-backed-design-startup-lica/)
- [Keenable 種子輪 — TechCrunch](https://techcrunch.com/2026/08/25/accel-backed-keenable-is-indexing-the-web-for-ai-agents/)
- [Vals AI A 輪 — The AI Insider](https://theaiinsider.tech/2026/08/25/vals-ai-raises-40m-series-a-at-400m-valuation-to-expand-ai-evaluation-platform/)
- [德國 amber A 輪 — The AI Insider](https://theaiinsider.tech/2026/08/24/german-ai-startup-amber-closes-e7m-series-a-to-build-autonomous-enterprise-knowledge-platform/)
- [Mundo A 輪 — RuntimeWire](https://runtimewire.com/article/mundo-raises-20m-series-a-perceptual-intelligence-data)
- [Primero 種子輪 — MarketScreener](https://au.marketscreener.com/news/mexico-s-primero-raises-12-million-seed-to-bring-ai-to-latin-american-blue-chips-ce7858d8dd8af425)
- [Vercel Connect GA](https://vercel.com/blog/the-end-of-credential-sprawl-for-agents)
- [Microsoft Agent Lightning v1.0.1](https://github.com/microsoft/agent-lightning/releases/tag/v1.0.1)
- [Lyzr OEM AI Infrastructure](https://aithority.com/machine-learning/lyzr-introduces-oem-ai-infrastructure-for-software-companies-building-enterprise-ai-platforms/)
- [Fastino GLiNER2.5](https://www.marktechpost.com/2026/08/24/fastino-releases-gliner2-5-a-boundary-prediction-architecture-that-removes-span-enumeration-from-information-extraction/)
- [史丹佛入門職缺研究 — Ars Technica](https://arstechnica.com/ai/2026/08/ai-is-hitting-entry-level-jobs-hardest-stanford-study-finds/)
