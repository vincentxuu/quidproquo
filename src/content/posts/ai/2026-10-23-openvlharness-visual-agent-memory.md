---
title: "不重訓模型怎麼讓它看得更準：OpenVLHarness 的九種工具、每題記憶與部署成本"
date: 2026-10-23
type: deep-dive
category: ai
tags: [harness-engineering, ai-agent, multimodal, open-source]
lang: zh-TW
tldr: "OpenVLHarness 是 UCLA 與 Apple 研究者開源的視覺代理框架：不改模型權重，替多模態模型接上九種工具與每題記憶，22 項基準平均提升 9.7 到 12.6 分，但完整部署要自己準備模型端點、GPU 感知服務與付費搜尋。"
description: "整理 OpenVLHarness 的論文與官方程式庫：九種視覺工具、每題多模態記憶怎麼運作，22 項基準與成本怎麼讀，以及部署時的服務、資料外送與程式執行風險。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-10-23-openvlharness-visual-agent-memory-en)

多模態模型看圖常見三種錯：擁擠的畫面數錯數量，角落的小字沒讀到，需要查外部資料才認得的物件答不出來。[OpenVLHarness](https://arxiv.org/abs/2610.26860)（arXiv:2610.26860）處理這三種錯的方式一致：不改模型權重，在模型外面接上工具，讓它先裁切、定位、查詢、計算，再回答。

這是 UCLA 與 Apple 研究者的論文，2026 年 10 月 19 日上傳 arXiv，[程式碼](https://github.com/uclanlp/OpenVLHarness)以 MIT 授權釋出，作者也提供可以接自己模型的[線上示範](https://openvlharness.github.io/)。它是研究框架，不是 Apple 的產品發表。

這篇回答三件事：模型被給了哪些工具；「多模態記憶」到底存什麼；把成績和部署成本放在一起看，值不值得拿自己的看圖任務試一次。

## 九種工具：模型能叫什麼

模型每一步自己決定要呼叫哪個工具，不是每題把所有工具跑一遍。預設的九種能力如下，後端都可以換。

| 能力 | 做什麼 | 預設後端 |
|---|---|---|
| 視覺定位 | 依文字找物件，回傳框、遮罩與標註圖 | [SAM 3](https://github.com/facebookresearch/sam3) |
| OCR | 讀圖中文字 | [PaddleOCR-VL](https://github.com/PaddlePaddle/PaddleOCR) |
| 深度估計 | 逐像素深度，保留數值陣列 | [Depth Anything 3](https://github.com/ByteDance-Seed/Depth-Anything-3) |
| 相機軌跡 | 從有順序的多張圖估相機位姿 | Depth Anything 3 |
| 縮放 | 裁出區域細看 | 內建影像處理 |
| 文字搜尋 | 網頁、圖片、新聞搜尋並摘要 | [Serper](https://serper.dev/) + [Qwen3-VL](https://github.com/QwenLM/Qwen3-VL) |
| 圖片搜尋 | 反向圖片搜尋 | Serper Lens + Qwen3-VL |
| 網頁瀏覽 | 針對目標擷取網頁證據 | Serper + Qwen3-VL |
| Python 程式工具 | 對儲存的結果寫程式計算 | 主模型本身 + 本機 Python |

兩個設計細節值得先知道。第一，每個工具都包成「做什麼」層級的介面，所以「定位」可以換成 [Grounding DINO](https://arxiv.org/abs/2303.05499)，「OCR」可以換成 [DeepSeek-OCR](https://arxiv.org/abs/2510.18234)，模型的呼叫方式不變。第二，工具的輸出會先轉成模型讀得懂的觀察：遮罩不會把一長串 RLE 編碼塞進對話，而是回一張標好編號的疊圖、一句描述和正規化後的框；深度估計回一張上色的圖，原始陣列另外留著。論文的說法是，模型看到的是證據，原始數值留給後面的計算用。

## 記憶存的是控制代碼，不是摘要

每個問題開始時，框架會建一份登錄表，工具產生的東西都會註冊進去，分三類：

- **圖片**：輸入圖、工具產生的圖、搜尋到的圖，控制代碼（handle）像 `input_image_3`、`tool_generated_image_6`。重複的圖共用一筆。
- **結構化資料**：框、分數、遮罩、深度陣列、相機參數、OCR 結果，每筆附欄位與形狀的描述。
- **網頁**：搜尋到的網址，控制代碼像 `webpage_url_1`，之後要開頁面不用模型重抄一次網址。

每個工具回合結束，框架會用一則 Environment Update 告訴模型現在有哪些控制代碼。模型之後的呼叫只要寫控制代碼，框架負責換回實際內容。

看一個論文裡的例子：問「每個櫃子離鏡頭多遠」。

1. 模型呼叫視覺定位找「cabinet」，得到五個物件。疊圖進了圖片類，框和遮罩進了結構化資料。
2. 模型呼叫深度估計，上色的深度圖給模型看，原始陣列存起來。
3. 模型把「算每個偵測區域的平均深度」交給 Python 程式工具。程式工具在全新的上下文裡拿到資料的描述，寫出程式，執行時把真正的遮罩和深度陣列當變數帶進去，結果用文字回報。

整個過程裡，大陣列沒有被抄進任何一次請求，後面的步驟也不必靠前面的文字描述去猜位置。

```diagram
title: 一個問題裡證據怎麼流動
desc: 協調模型呼叫能力層的工具，工具結果存進每題記憶，Python 程式工具從記憶讀資料運算，記憶把可用的控制代碼回報給協調模型。
caption: 簡化示意：每個新問題都從空的記憶開始。
---
<svg viewBox="0 0 640 376">
  <path class="dg-line" d="M168 164H300Q308 164 308 156V84Q308 76 316 76H450" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M168 212H300Q308 212 308 220V292Q308 300 316 300H450" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M536 112V150" marker-end="url(#arrow)"/>
  <path class="dg-line dg-line--dashed" d="M536 264V226" marker-end="url(#arrow)"/>
  <path class="dg-line dg-line--dashed" d="M450 188H172" marker-end="url(#arrow)"/>

  <rect class="dg-box dg-box--accent" x="20" y="144" width="148" height="88" rx="6"/>
  <text class="dg-label" x="94" y="180" text-anchor="middle" dominant-baseline="central">協調模型</text>
  <text class="dg-sub" x="94" y="202" text-anchor="middle" dominant-baseline="central">選工具・讀證據</text>

  <rect class="dg-box" x="452" y="40" width="168" height="72" rx="6"/>
  <text class="dg-label" x="536" y="66" text-anchor="middle" dominant-baseline="central">能力層</text>
  <text class="dg-sub" x="536" y="88" text-anchor="middle" dominant-baseline="central">感知與搜尋工具</text>

  <rect class="dg-box dg-box--store" x="452" y="152" width="168" height="72" rx="6"/>
  <text class="dg-label" x="536" y="178" text-anchor="middle" dominant-baseline="central">每題記憶</text>
  <text class="dg-sub" x="536" y="200" text-anchor="middle" dominant-baseline="central">圖片・資料・網址</text>

  <rect class="dg-box" x="452" y="264" width="168" height="72" rx="6"/>
  <text class="dg-label" x="536" y="290" text-anchor="middle" dominant-baseline="central">Python 程式工具</text>
  <text class="dg-sub" x="536" y="312" text-anchor="middle" dominant-baseline="central">對儲存資料運算</text>

  <text class="dg-edge" x="384" y="64" text-anchor="middle" dominant-baseline="central">呼叫工具</text>
  <text class="dg-edge" x="384" y="288" text-anchor="middle" dominant-baseline="central">交代要算什麼</text>
  <text class="dg-edge" x="548" y="131" text-anchor="start" dominant-baseline="central">存成控制代碼</text>
  <text class="dg-edge" x="548" y="245" text-anchor="start" dominant-baseline="central">讀取資料</text>
  <text class="dg-edge" x="384" y="176" text-anchor="middle" dominant-baseline="central">可用控制代碼</text>
</svg>
```

記憶只在一題之內有效。框架明講每個新問題從空的記憶開始，所以它解決的是同一題裡證據接得起來，跟長期記住使用者或對話歷史是兩件事。要做跨對話的記憶，可以看[Agent 記憶系統的設計](/posts/ai/2026-03-19-agent-memory-systems)。

## 成績怎麼讀

22 項基準分四類：計數與定位、視覺搜尋與深度研究、一般 VQA 與幻覺、空間理解。以下數字都是作者在[論文](https://arxiv.org/abs/2610.26860)與[專案頁](https://openvlharness.github.io/)自己報告的評測結果。幾個讀者會拿來做判斷的結果：

**同一個模型加上框架，平均都進步。** [README](https://github.com/uclanlp/OpenVLHarness) 列出的七個主模型，平均進步在 9.7 到 12.6 分之間。GPT-6 Astra 的 22 項基準全數進步。論文共測八個模型，第八個是 Qwen2.5-VL-7B，結果放在附錄，用來和需要微調的方法比較。

**通用的程式代理不會自動變好。** 同樣用 GPT-6 Luna、中等推理強度，沒有工具是 45.8，[Codex](https://github.com/openai/codex) 是 43.8，OpenVLHarness 是 56.5，[Visual Sketchpad](https://arxiv.org/abs/2406.09403) 則和沒有工具差不多。附錄顯示 Codex 在多數題目幾乎不執行程式，等於在它自己的流程裡直接回答；拉到最高強度，它才略高於不用工具。論文的結論是通用的程式代理不會自動改善多模態推理，工具的輸出得為視覺任務設計。

**不微調也能贏過微調。** Qwen2.5-VL-7B 用原本的權重配上這套框架得 33.5，三個需要微調模型的方法最高只有 28.0。這組設定不在公開釋出的程式碼裡。

**多想幾步取代不了工具。** 同樣是 GPT-6 Luna，把推理強度拉到最高，沒有工具的版本也只升到 48.0。OpenVLHarness 在中等強度就有 56.5，模型 token 的費用最多是對手最高強度版本的 37%。費用不含搜尋 API 與 GPU 服務。它每題送出的 token 其實比不用工具多，因為每個回合都帶著工具輸出；對手的費用，則被最高強度的大量推理輸出拉高。

**哪個零件貢獻多少。** 論文用 Qwen3-VL-8B 一層一層加上去，下表是它的整體欄。這張表的口徑和上面的 22 項平均不同，基線數字不能互相對照，只看每一層加了多少：

| 配置 | 平均 |
|---|---|
| 沒有工具 | 37.1 |
| 直接給工具 | 40.8 |
| 加能力層（介面與證據渲染） | 44.2 |
| 加文字版記憶 | 44.9 |
| 加多模態記憶（圖片控制代碼） | 47.1 |

只是把工具交給模型，進步有限；把工具輸出整理成讀得懂的觀察，再多了一截；最後一步讓之前的圖可以被引用，在視覺搜尋領域進步最大。文字版記憶只描述工具產生的圖，沒有可重用的圖片控制代碼，幾乎沒有加分。

## 限制：失敗長什麼樣

論文請 [Kimi K3](https://arxiv.org/abs/2607.24653) 檢討 Qwen3-VL-8B 的近一萬條失敗軌跡，並抽樣和人工標註對照。以下是 8B 模型的結果，因領域而異：

- **計數與定位**：物件超過 25 個的擁擠畫面，定位會漏抓或把相鄰物件合併，「工具輸出錯誤」占這個領域失敗的 75%。如果你的任務是密集計數，框和遮罩要抽驗，不能只看最後的數字。
- **視覺搜尋**：失敗近半（49%）是該查的時候沒有呼叫工具。補法可能是把提示寫得更清楚，也可能要換一種工具組合。
- **簡單題別硬上**：一般 VQA 和空間理解在最低推理強度下，OpenVLHarness 略低於不用工具的版本，到中等強度才全面超前。

論文也試了兩種針對自家資料調整的做法。以文字修補為主的資料集，改系統提示和工具描述（harness search）進步約 4 分，寫專用新工具幾乎沒有幫助；缺少專用運算的資料集，例如要算度量 3D 關係的 SparBench，寫新工具進步約 8 分，改文字反而略為退步。挑哪一種，看你的失敗是沒呼叫工具，還是缺一個專用計算。

結果的可信度還有兩點：Qwen3-VL 的結果是三次執行的平均，GPT 與 Kimi 因為 API 成本只跑一次；搜尋與深度研究的評分由 GPT-4o 擔任評審。

## 部署要準備什麼，資料會去哪

完整跑九種工具，要自己準備：

- **模型**：主模型之外，搜尋摘要與網頁擷取預設使用另一個 Qwen3-VL-8B。主模型即使用託管的 GPT 或 Kimi，只要開搜尋，仍然需要這個輔助模型。
- **感知服務**：SAM 3、PaddleOCR-VL、Depth Anything 3 各自是獨立的 GPU 服務，透過一個路由服務（router）接進來。
- **搜尋**：三種搜尋工具走 Serper，這是付費的 Google 搜尋 API，有免費起始額度。

資料離開機器的地方，要沿著每個工具檢查，不能只看主模型放哪裡：

- 主模型端點收到問題文字、圖片與工具證據；輔助模型收到搜尋結果、網頁文字與被搜尋的圖片；Serper 收到查詢和被造訪的網址。
- 反向圖片搜尋要讓 Serper 抓得到圖片：可以用內建的圖片主機加 tunnel，或把圖上傳到你的 S3 或 GCS bucket。走 bucket 時，圖用一小時有效的簽名網址交給 Serper，物件不會自動刪除，需要自己設生命週期規則。

圖片不能離開你的環境時，先從設定的 `capabilities.tools` 移除 `image_search`。查詢文字與網址仍會送給 Serper，連這個也不行，就把 `text_search`、`image_search`、`web_visit` 一起移除，只留下縮放、定位這類在自己機器上跑的工具。

執行風險有三項，官方的[安全說明](https://github.com/uclanlp/OpenVLHarness/blob/main/SECURITY.md)寫得很直接：

- 模型寫的 Python 以你的使用者權限在主機的子行程執行，有網路和檔案存取，逾時限制不是沙箱。
- router 和 GPU 工作服務沒有驗證，預設只綁 `127.0.0.1`；能連到它們的人就能用你的 GPU、模型端點和 Serper 金鑰。
- 代理程式會執行 `TOOL_SERVER_URL` 那端回傳的 Python，所以只能指向自己架的 router。

## 怎麼開始試

1. **先挑一批你的模型反覆答錯的圖，連同正確答案。** 十來張就看得出方向，不夠再加。只用自己的題目比較，22 項基準的平均分數不代表你的任務。
2. **從最小設定起步。** 官方範例 `examples/local_tools.yaml` 只開縮放和 Python 程式工具，主模型接託管的 GPT 端點，不需要 GPU 工作站、Serper 或雲端儲存。設好 `MODEL_BASE_URL`、`MODEL_API_KEY`、`TOOL_SERVER_URL` 後：

   ```bash
   python -m openvlharness.services.server --config examples/local_tools.yaml
   ```

   ```python
   from openvlharness.bootstrap import build_agent

   agent = build_agent("examples/local_tools.yaml")
   result = agent.generate([
       {"type": "image", "value": "/path/to/image.jpg"},
       {"type": "text", "value": "How many bottles are visible?"},
   ])
   print(result["prediction"])
   trajectory = result["extra_records"]["trajectory"]
   ```

3. **每一題都看軌跡。** `trajectory` 記錄每一回合的工具呼叫與證據。先看框對不對，再看計算對不對，錯的起點在哪一步一目了然。
4. **缺什麼再開什麼。** 要定位、OCR、深度才起 GPU 服務；搜尋最後開。圖片不能外送，就從設定的 `capabilities.tools` 移除 `image_search`。
5. **在隔離的環境跑。** 用容器或虛擬機，不放重要資料，也不把 router 開到公開網路。上線前用 router 的 `/backend-status` 看 `degradations`：搜尋摘要逾時、圖片網址抓不到、Serper 額度用完都會在這裡累計。

## 整體來說

這套框架的取捨很清楚：用多個服務、多回合的模型呼叫，換一條可以逐步回查的證據鏈。它適合已經有看圖產品、而且知道自己錯在「看不清、數不準、不認識」的團隊，不適合想找現成 App 的人，也不適合只要描述一張簡單圖片的任務。圖片不能外送、又沒有自架能力的情況，先從只開縮放和計算的最小設定看有沒有效果，比一次把九種工具全接上更容易判斷哪個改動有用。

## 參考資料

- [OpenVLHarness: Real World Visual Agentic Tool-Use with Multimodal Memory](https://arxiv.org/abs/2610.26860)（arXiv:2610.26860，論文摘要頁；全文 [HTML 版](https://arxiv.org/html/2610.26860)）
- [OpenVLHarness 專案頁](https://openvlharness.github.io/)：作者、逐步軌跡、各基準結果
- [uclanlp/OpenVLHarness](https://github.com/uclanlp/OpenVLHarness)：程式碼、README、安裝與設定範例
- [OpenVLHarness SECURITY.md](https://github.com/uclanlp/OpenVLHarness/blob/main/SECURITY.md)：執行位置與資料外送說明
- [OpenVLHarness 視覺代理框架：不重訓模型，工具與多模態記憶能改善哪些看圖工作？](https://www.aiposthub.com/openvlharness-visual-agent-multimodal-memory-tools)（AI 郵報，中文導讀，內容回查至上述原始來源）
- [Agent 記憶系統的設計](/posts/ai/2026-03-19-agent-memory-systems)（本站：跨對話記憶的做法）
