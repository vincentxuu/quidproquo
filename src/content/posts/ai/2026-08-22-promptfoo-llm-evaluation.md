---
title: "Promptfoo 深入介紹：把 LLM Eval 與 Red Team 寫進本機測試迴圈"
date: 2026-08-22
category: ai
tags: [promptfoo, llm-evaluation, red-teaming, ai-security, ci-cd, llm]
lang: zh-TW
type: deep-dive
tldr: "Promptfoo 用 YAML 把 prompts、providers、test cases 與 assertions 組成可在本機與 CI 重跑的 LLM 評估矩陣，並共用同一套 target 做 red team；它降低測試門檻，但隨機輸出、LLM judge 偏差與 hosted data flow 仍要另外治理。"
description: "從 config、test cases、assertions、red team 到 CI，拆解 Promptfoo 的本機優先評估流程、安全邊界、judge 限制，以及與主要 eval／observability 平台的選型差異。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-promptfoo-llm-evaluation-en)

[Promptfoo](https://www.promptfoo.dev/docs/getting-started/) 是一套 MIT 授權的 LLM eval 與 red-team CLI／library。它把 prompt、model provider、測試資料與評分條件寫進 `promptfooconfig.yaml`，在開發者電腦產生測試矩陣，跑完可從 terminal 或本機 UI 比較結果，再把相同命令搬進 CI。這個設計比先建一套雲端 observability 平台更接近一般軟體測試：設定檔與測試案例可以跟程式碼一起 review。

2026 年 3 月，OpenAI 宣布同意收購 Promptfoo，交易完成仍待一般成交條件；雙方承諾繼續維護開放原始碼專案。採用數字來自公司自報：Promptfoo 稱累計超過 35 萬名開發者、每月 13 萬名活躍使用者，超過四分之一的 Fortune 500 企業使用其產品；[OpenAI 公告](https://openai.com/index/openai-to-acquire-promptfoo/)只直接重述最後一項，因此這些數字適合當規模訊號，不是獨立稽核結果。

## 第一步：Config 定義要比較什麼

Promptfoo 的核心不是一個「AI 品質分數」，而是笛卡兒積：每個 prompt 版本 × provider × test case 都會形成一次執行，再交給 assertions 評分。

```yaml
# promptfooconfig.yaml
prompts:
  - '只回答 JSON：{"answer": "{{question}}"}'

providers:
  - id: openai:gpt-5-mini
    config:
      temperature: 0

tests:
  - vars:
      question: '台灣的首都是哪裡？'
    assert:
      - type: is-json
      - type: contains
        value: '台北'
      - type: llm-rubric
        value: '答案正確、直接，而且沒有加入 JSON 以外文字'
```

```bash
npx promptfoo@latest eval -c promptfooconfig.yaml
npx promptfoo@latest view
```

Provider 可以是 OpenAI、Anthropic、Gemini、Bedrock 或 Ollama，也能指向 HTTP endpoint、JavaScript／Python provider、shell command 與 agent runtime。這讓 Promptfoo 不只比較 foundation model，也能從本機呼叫完整 RAG 或 Agent API。Provider 是「被測系統」；model-graded assertion 使用的 grader 則是另一個 provider，兩者應分開指定，否則環境裡有哪些 API key 可能改變預設 judge。

## 第二步：Test cases 要代表真實失敗

每個 case 可帶 `vars`、metadata、限定 prompt／provider 與自己的 assertions；資料也能從 YAML、JSON、CSV 或程式產生。好的起點不是大量合成題，而是三種小集合：正式需求的 golden cases、production 已發生的失敗、明確不能發生的 policy cases。

每次修 bug，就把輸入與最低可驗證條件加回資料集。若客服 Agent 曾答錯退款期限，case 應檢查期限與引用來源，而不是只寫「回答要有幫助」。Test suite 的價值來自失敗會累積成回歸案例，不是來自列數看起來很多。

## 第三步：先用確定性 Assertion，再用 Judge

Promptfoo 內建 exact match、contains、regex、JSON schema、cost、latency、JavaScript／Python 等確定性 assertion，也有 similarity、factuality、G-Eval 與 `llm-rubric` 等 model-graded metrics。合理順序是：格式、必填欄位、工具參數和硬規則先用程式判定；只有語氣、相關性與整體品質這種無法精確編碼的部分才交給 LLM judge。

LLM judge 本身也是非決定性模型，會受 rubric 措辭、輸出順序、模型版本與自身偏好影響。單次 pass rate 不能當精密量測。重要 case 應重跑多次、固定 judge 與 rubric、保存原始理由，並抽樣跟人工標註對照。若 judge 無法穩定重現人類判決，CI 應把它當趨勢訊號，不該用一個硬門檻阻擋所有部署。

Caching 也可能掩蓋變異。開發時 cache 能省錢；要量測 variance 或確認 provider 新版本時，使用 `--no-cache`，並在結果 metadata 留下 model ID、prompt 版本與 git SHA。

## 第四步：Red team 共用 Target，但不是同一種測試

[Promptfoo red team](https://www.promptfoo.dev/docs/red-team/quickstart/) 把 targets、plugins 與 strategies 組合成攻擊案例。Plugin 定義要測的風險，例如 prompt injection、PII、BOLA 或 SSRF；strategy 定義如何包裝與逐步傳遞攻擊，例如 jailbreak 或多輪對話。官方 2026 年 8 月文件列出 157 個 plugins，但一次全選只會增加成本與雜訊：foundation model 不需要 application-level access-control 測試，沒有工具的聊天機器人也不需要假裝測 SSRF。

```bash
npx promptfoo@latest redteam init --no-gui
npx promptfoo@latest redteam run
npx promptfoo@latest redteam report
```

真正做法是先畫出資料、tool 與角色邊界，挑對應 plugins 建 baseline；成功的攻擊則固定成 regression case。自動 red team 能擴大探索面，不能證明系統「安全」。它沒有替你檢查 API authorization、sandbox 邊界或人工社交工程，也不能在未獲授權的第三方目標上進行測試。

## 第五步：本機優先不等於資料不會離開

一般 eval runner 在本機運作，但模型 prompt 與 output 仍會送到你設定的 provider。Red-team data flow 更容易誤判：[官方資料處理文件](https://www.promptfoo.dev/docs/red-team/troubleshooting/data-handling/)指出，沒有自備可用 API key 時，生成與 grading 可能使用 `api.promptfoo.app` 的 hosted inference；某些 remote-only plugins、setup helpers、Cloud sync、分享功能與 `redteam poison` 也會傳送額外內容。

要維持嚴格本機控制，generation、grading、embedding 與 moderation 都要明確選本機或自備 key provider，關閉 remote generation 與 telemetry，並避開 Cloud sync／sharing。API key 用 CI secret 或環境變數注入，不要寫在 YAML。更容易漏掉的風險是 Promptfoo config 本身：custom assertion、provider、transform 與 hook 會以目前使用者權限執行，沒有 sandbox。外部 PR 帶來的 eval config 應像 build script 一樣，在隔離 runner 配最小權限憑證執行。

## 第六步：把小而穩定的集合放進 CI

Promptfoo 可輸出 JSON、HTML 與 JUnit XML；`--fail-on-error` 可在 assertion 失敗時讓 job 失敗。PR 階段應跑便宜、確定性高的核心案例，完整 red team 與高成本 judge 排程執行：

```bash
npx promptfoo@latest eval \
  -c promptfooconfig.yaml \
  --fail-on-error \
  --tag git.sha="$GIT_SHA" \
  -o results.junit.xml
```

CI gate 要避免「平均分數變好就通過」。一個 safety case 失敗不能被十個文案 case 抵銷；按 metric 分組，對不可違反的規則採 per-case hard fail，主觀品質才看 aggregate 與相對 baseline。模型 provider 暫時 rate limit 也要跟品質失敗分開，否則團隊最後只會把不穩定的 eval job關掉。

## 與其他 Eval 平台怎麼選

| 選項 | 優先考慮的情境 | 和 Promptfoo 的分水嶺 |
|---|---|---|
| [Promptfoo](https://www.promptfoo.dev/docs/) | 想把跨 provider 測試、assertion 與 red team 留在 repo／CLI | 本機開發與安全掃描直接；production trace 分析不是主軸 |
| [Patronus AI](https://docs.patronus.ai/docs/evaluators/patronus) | 需要託管 evaluators、企業治理與專門評分模型 | 較平台化；不只是提交 YAML 後本機跑完 |
| [Braintrust](https://www.braintrust.dev/docs/evaluate) | 想把 datasets、immutable experiments、playground 與 production scoring 串成回饋迴圈 | experiment management 與團隊分析更完整；需要 Braintrust project／API 流程 |
| [Arize Phoenix](https://arize.com/docs/phoenix/) | OpenTelemetry／OpenInference traces 是除錯與評估的共同資料層 | 以 observability 與 trace-driven eval 為中心 |
| [Galileo](https://v2docs.galileo.ai/) | 想採用託管的 AI observability、評估與 guardrail 工作流 | 平台營運能力優先於 config-as-code 的輕量迴圈 |
| [Langfuse](https://langfuse.com/docs/evaluation/overview) | 已用 Langfuse 收 production traces，希望從 trace 建 dataset、experiment 與 scores | production feedback 與 self-hosting 生態較完整；Promptfoo 的 red-team CLI 更直接 |

這不是單選題。常見組合是 Promptfoo 負責 PR 前的 deterministic regression 與 adversarial suite，Phoenix 或 Langfuse 負責 production trace，再把線上失敗匯回 Promptfoo cases。不要讓兩套系統各存一份沒有版本關係的 dataset；至少用 case ID、git SHA 與 prompt version 對齊。

## 結論

Promptfoo 最強的地方，是把「我覺得這個 prompt 比較好」改成可以 review、重跑與在 CI 失敗的設定檔。它不會讓非決定性消失，也不會把 LLM judge 變成 ground truth；它提供的是一個能逐步改善測試品質的迴圈。

今晚可以先做一個十題 suite：五題真實 golden cases、三題歷史失敗、兩題絕不能違反的 policy cases。硬規則用 deterministic assertions，最多挑一個主觀指標交給固定 judge，重跑三次看變異。若連這十題的判決都不穩，先修 rubric 與 cases，不要急著擴成一千題儀表板。

## 參考資料

- [Promptfoo getting started](https://www.promptfoo.dev/docs/getting-started/)
- [Promptfoo configuration guide](https://www.promptfoo.dev/docs/configuration/guide/)
- [Promptfoo assertions and metrics](https://www.promptfoo.dev/docs/configuration/expected-outputs/)
- [Promptfoo providers](https://www.promptfoo.dev/docs/providers/)
- [Promptfoo red-team quickstart](https://www.promptfoo.dev/docs/red-team/quickstart/)
- [Promptfoo red-team data handling and privacy](https://www.promptfoo.dev/docs/red-team/troubleshooting/data-handling/)
- [Promptfoo security policy](https://github.com/promptfoo/promptfoo/security)
- [Promptfoo CI/CD integration](https://www.promptfoo.dev/docs/integrations/ci-cd/)
- [OpenAI to acquire Promptfoo](https://openai.com/index/openai-to-acquire-promptfoo/)
- [Promptfoo is joining OpenAI](https://www.promptfoo.dev/blog/promptfoo-joining-openai/)
- [Patronus evaluators](https://docs.patronus.ai/docs/evaluators/patronus)
- [Braintrust evaluation workflow](https://www.braintrust.dev/docs/evaluate)
- [Arize Phoenix](https://arize.com/docs/phoenix/)
- [Galileo documentation](https://v2docs.galileo.ai/)
- [Langfuse evaluation overview](https://langfuse.com/docs/evaluation/overview)
