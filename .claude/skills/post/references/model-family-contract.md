# AI 模型家族文章規格

適用：`series.name` 為 `AI 模型家族`／`AI Model Families` 的介紹文。建立、更新、審稿、查證時先讀此檔。這是本站編輯規格，不是外部模型卡標準的逐字套用。

## 文章角色

- **家族主篇**：一個家族或一條有獨立選型問題的產品線，使用下列共同骨架。
- **總覽／跨家族比較**：用途總覽、語音音訊、影片生成等，依任務與比較維度安排章節，不硬套單一家族時間線。仍遵守資訊揭露、中英一致與參考資料要求。
- 新增總覽／跨家族比較時，將去除 `-en` 的檔名 slug 登錄到 `model-family-roles.json` 的 comparison；專項檢查依此辨識角色，不以家族 tag 或 order 猜角色。
- **每日模型卡**：`AI Model Tracker`，使用 daily-digest-model-card，不套本長文模板。家族 tag 不代表它是家族主篇。

## 固定骨架

開頭用 2–4 句回答「這是什麼、適合誰、讀完能做什麼決定」。`tldr` 必填且與正文一致。資料日期只填真正核對過的日期，格式整理不能冒充新一輪事實查證。

| 順序 | 中文 H2 | 英文 H2 | 讀者問題 |
|---|---|---|---|
| 1 | 家族定位與版本矩陣 | Family positioning and model matrix | 有哪些模型／產品線，先看哪一個？ |
| 2 | 家族演化 | Family evolution | 哪些轉折改變了選型？ |
| 3 | 架構與訓練取捨 | Architecture and training trade-offs | 為什麼採這種設計，代價是什麼？ |
| 4 | 評測與競品比較 | Evaluation and alternatives | 在哪些條件下表現如何？ |
| 5 | 授權、價格與部署 | Licensing, pricing, and deployment | 我能怎麼取得、使用與付費？ |
| 6 | Agent 使用與選型 | Agent integration and selection | 在我的工作流裡用哪個、怎麼驗證？ |
| 7 | 限制與取捨 | Limitations and trade-offs | 什麼情況不適合，還有哪些未知？ |
| 選填 | 更新紀錄 | Update history | 更新了哪些內容？ |
| 最後 | 參考資料 | References | 證據在哪裡？ |

固定的是讀者查閱位置與 H2 名稱。各節 H3 隨家族特色安排，不要求同樣篇幅、同樣子線數，也不硬寫「兩條產品線」。不能用空標題或空泛模板句湊格式。無資料時明確說明「本文引用來源未揭露／沒有可比較的結果」，並指出影響；不能把未查到直接寫成確定不存在。

版本矩陣用已核對的代表模型，至少包含「模型／產品線、定位、關鍵差異、存取方式」；context、授權、價格等有可靠資料才補。確切 model ID 與 API 端點不同時分開；開放權重與託管服務分開；歷史版本與本篇選型版本分開。不複製整個版本史到矩陣，也不在各節重抄整張表。

## 資訊揭露與事實邊界

- 版本、context、參數、語言／模態、工具能力、價格與授權，指向具體 model card／官方文件；未知不憑家族名補猜。
- 評測附模型版本、benchmark／資料集版本、指標、來源與影響比較的條件（harness、工具、推理預算、精度等已知項）。區分官方自報、第三方與本站實測。條件不齊或不一致就限定結論，不能混表直接排名。
- 價格附供應商、計費單位、免費／付費端點與資料日期；權重授權、API／服務條款、使用政策分別核對，不能只寫「開源可商用」。
- 架構／訓練只寫公開資訊。閉源模型未揭露參數或資料時，標清楚來源邊界。
- 嵌入、影像、語音等家族按其任務寫 Agent 整合，不硬填原生 tool calling。程式範例區分模型能力與 host loop／路由平台能力；未執行的範例不能稱實測。
- `glossary` 依讀者需要選填；缺少不是格式錯誤。不能為補詞彙而引入未經查證的新版本、數字或宣稱。
- 格式整理沿用既有來源與核對日期。價格／模型更新另走 post-verify；不以今日日期或 verify 綠偽裝事實最新。

## 中英文與維護

中文 `series.name: "AI 模型家族"`；英文 `series.name: "AI Model Families"`。兩版的 order、模型版本、數值、來源、限制與選型結論相同；以同一語意節點對照，不只數 H2。

保留檔名、slug、原始 date、category、lang、order。只有實際更新才能改核對日期。內容重組在更新紀錄明示整理範圍；舊紀錄保留且最新在上，參考資料放最後。不用文末重複整個系列清單；網站元件負責完整導覽，正文中有語意的跨篇轉手連結應保留。

## 驗收

1. 執行 `node .agents/skills/post/scripts/check-model-family-format.mjs <中英檔案...>`，檢查角色、H2 順序、非空段落、tldr 與語言化系列名；可直接執行掃本系列。
2. `pnpm verify`、`pnpm astro check`，改 skill 後先 `pnpm skills:sync`。
3. 人工核對矩陣與正文、跨節指代、舊引文與連結、數字／model ID、中英語意。機械綠不證明事實更新或選型品質。
4. 回報分列：格式整理、事實查證範圍、未補齊的公開資訊、發布狀態。只改格式不宣稱全篇 fact-check。

## 來源與設計依據

- [Hugging Face Model Cards](https://huggingface.co/docs/hub/model-cards)：metadata 與正文互補。
- [Annotated Model Card](https://huggingface.co/docs/hub/model-card-annotated)：用途、評估條件、限制、授權與選填欄位。
- [Diátaxis reference](https://diataxis.fr/reference/)／[explanation](https://diataxis.fr/explanation/)：查閱模式一致，解說可依背景與設計展開。本規格為本站文章的折衷，不宣稱 Diátaxis 規定混合文體。
- [Google headings](https://developers.google.com/style/headings)／[timeless documentation](https://developers.google.com/style/timeless-documentation)：描述性標題、正確層級、日期／版本錨點。
