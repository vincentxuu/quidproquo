# 抽取紀錄：Stack Overflow Developer Survey 2024 — §6 Professional Developers（知識與工作流程題）

read_status=full（§6 頁面全文＋圖表 SVG 內嵌數字＋§7 Methodology 全文；原始資料集未取得，見讀取紀錄）

## 書目

- 發布者：Stack Overflow，2024 Developer Survey
- 頁面：https://survey.stackoverflow.co/2024/professional-developers （§6.1 Productivity Impacts、§6.2 Developer Experience、§6.3 Job Industry and Satisfaction）
- 方法：https://survey.stackoverflow.co/2024/methodology
- 抓取日期：2026-10-22（curl live HTML）
- 全文文字檔：/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/so2024-professional.txt（頁面文字）、so2024-professional-charts.txt（從 SVG 抽出的圖表數字）、so2024-methodology.txt
- 利益關係：Stack Overflow 販售內部知識庫產品（頁首即 "Stack Overflow for Teams Where developers & technologists share private knowledge with coworkers"）。這組題目與其產品直接相關。

## 設計與樣本

- 全體：65,437 份有效回覆，185 國；另約 20K 份因注意力檢查、同意題、身分題未通過被剔除（§7.1）。
- 期間：2024-05-19 至 2024-06-20。中位作答時間約 21 分鐘。
- 招募："Respondents were recruited primarily through channels owned by Stack Overflow ... highly-engaged users on Stack Overflow were more likely to notice the prompts to take the survey"（§7.1）——非機率樣本。
- §6 是選答的 "Professional Developer Series"："Roughly 29K professional developers contributed"；「是否參加」題回覆 44,477，其中 Yes 67.4%。
- 角色：Individual contributor 86.9%、People manager 13.1%（回覆 29,801）。
- 每張圖有三個版本（All Respondents／Individual Contributor／People Manager）；IC 約 2.5 萬、Manager 約 3.8 千。

## 可引用結果（確切題目、選項、百分比、回覆數）

以下「All」為全部回覆者；括號內為 IC／Manager。百分比由頁面 SVG 圖表讀出，頁面標題敘述的數字與我加總一致處已註明。

### 1. Ability to find knowledge and information within their organization

- 題目："Please rate your level of agreement with the following statement:"
- 量表：Strongly agree／Agree／Neither agree nor disagree／Disagree／Strongly disagree
- 回覆數：All 28,747（43.9%）；IC 24,869；Manager 3,791
- All 各陳述（SA／A／N／D／SD）：
  - "I know which system or resource to use to find information and answers to questions I have." 17.9／52.4／18.3／9.4／2.0 → 同意 70.3%
  - "I am able to quickly find answers to my questions with existing tools and resources." 11.6／44.6／25.7／14.9／3.1 → 同意 56.2%
  - "Waiting on answers to questions often causes interruptions and disrupts my workflow." 16.0／37.0／23.6／19.5／3.9 → 同意 53.0%
  - "I can find up-to-date information within my organization to help me do my job." 9.7／39.1／26.4／19.7／5.1 → 同意 48.8%；不同意 24.8%
  - "I often find myself answering questions that I've already answered before." 13.2／35.6／26.5／21.2／3.5 → 同意 48.8%（Manager 57.4%）
  - "Knowledge silos prevent me from getting ideas across the organization." 12.9／32.3／26.0／21.3／7.5 → 同意 45.2%
  - "I feel like I have the tools and/or resources to quickly understand and work on any area of my company's code/system/platform." 11.1／38.8／25.4／18.6／6.2 → 同意 49.9%
  - "I have interactions with people outside of my immediate team." 36.0／46.9／8.3／6.3／2.4
  - "I have asked my employer to reimburse me for tools or a product that helps me do my job better or faster" 9.2／24.1／22.3／21.3／23.1
- 頁面敘述原文："70% of respondents agree or strongly agree that they know where to go to find answers to their questions and 56% agree they can do so quickly. How quick is quickly? 53% agree or strongly agree that waiting on answers disrupts their workflow, even if they know where to go to find those answers."（與我加總一致）

### 2. Frequency of productivity frictions

- 題目："How frequently do you experience each of the following?"
- 選項：Never／1-2 times a week／3-5 times a week／6-10 times a week／10+ times a week
- 回覆數：All 28,462（43.5%）；IC 24,632；Manager 3,747
- All：
  - "Encountering knowledge silos (where one individual or team has information that's not shared or distributed with other individuals or teams) at work?" Never 52.1／1-2 2.8／3-5 12.4／6-10 3.1／10+ 29.6（IC 10+ 30.4；Manager 10+ 24.7）
  - "Interacting with people outside of your immediate team?" 44.3／12.2／23.0／10.8／9.6
  - "Needing help from people outside of your immediate team?" 59.9／1.7／9.6／2.0／26.8
- 頁面敘述原文："30% of developers say knowledge silos impact their productivity ten or more times per week."；"Knowledge silos aren't a problem for everyone (45% agree or strongly agree that they are a nuisance), but if you have them, they are a frequent problem."

### 3. Daily time spent searching for answers/solutions

- 題目："On an average day, how much time do you typically spend searching for answers or solutions to problems you encounter at work? (This includes time spent searching on your own, asking a colleague, and waiting for a response)."
- 回覆數：All 28,911（44.2%）；IC 25,020；Manager 3,803
- All：Less than 15 min 9.3%／15-30 min 27.0%／30-60 min 37.9%／60-120 min 18.3%／Over 120 min 7.6% → 超過 30 分鐘 63.8%
- IC：9.0／26.7／38.0／18.6／7.8；Manager：11.1／29.3／37.4／15.8／6.4
- 頁面敘述原文："61% of all respondents spend more than 30 minutes a day searching for answers or solutions to problems."；"People managers spend less time searching than individual contributors (40% vs. 36% spend 30 minutes or less)."

### 4. Daily time spent answering questions

- 題目："On an average day, how much time do you typically spend answering questions you get asked at work?"
- 回覆數：All 28,844（44.1%）；Manager 3,794
- All：<15 20.5／15-30 32.4／30-60 30.0／60-120 12.8／>120 4.3
- Manager：9.2／20.1／35.1／25.0／10.5 → 超過 30 分鐘 70.6%
- 頁面敘述原文："People managers spend a lot of time answering questions: 61% spend more than 30 minutes a day answering questions."

### 5. Resources for technical questions at work（§6.2）

- 題目："When you have a technical question at work, where do you first go to get an answer?"
- 回覆數：All 28,807
- All：Traditional public search engine 54.9%、A coworker 18.5%、AI-powered search 7.8% 與 6.8%（兩個選項，標籤被截斷，應為免費／付費）、Slack search 3.7%、"Do search of internal share dr…" 3.3%、Internal Dev portal 2.7%、Other 1.9%、Microsoft Teams search 0.5%
- 頁面敘述原文："Public search engines are the top resource used by professional developers to find answers to technical questions. 55% use traditional search and 15% use AI-powered search, either free or paid."

### 6. Processes, tools, and programs（§6.2）

- 題目："My company has:"（回覆 27,764）
- "Knowledge sharing community" 39.9%；"Dev portal or other central pl…" 29.0%；"Innersource initiative" 15.6%；AI-assisted technology tool 32.4%（頁面："doubled: 15.7% last year to 32.4% this year"）。

## 限制（發布者自己寫的與結構上的）

- 發布者寫的（§7.1）：主要透過 Stack Overflow 自有管道招募，高度活躍的使用者較可能看到邀請。
- 發布者寫的（§7.1）："Some questions that are multi-select for the available choices have switched to be displayed as a percentage of total unique responses instead of total frequency of responses this year."
- 結構上：§6 是選答區塊，約 44% 的有效回覆者作答；自陳時間與頻率，未經測量；沒有定義「answer」「knowledge silo」以外的名詞（如 "up-to-date information"）。
- 利益關係：發布者販售內部知識分享產品。

## 與摘要或常見轉述不一致處

- 「61% 開發者每天花超過 30 分鐘找答案」：頁面這麼寫，但我從圖表加總是 63.8%（37.9+18.3+7.6）。頁面同段又寫 "40% vs. 36% spend 30 minutes or less"（Manager vs IC），但圖表是 Manager 40.4%、IC 35.7%，這個對得上。所以 "61%" 疑似頁面敘述數字與圖表不一致；引用時建議用圖表數字並註明，或直接寫「約六成」。
- 「找答案的時間」包含自己搜尋、問同事、等回覆——題目明寫。不是只算查文件。
- 「30% 每週遇到知識孤島 10 次以上」：頻率分布很怪，Never 52.1%、10+ 29.6%，中間 1-2 次只有 2.8%、6-10 次只有 3.1%。同一張圖「Needing help from people outside」也是 Never 59.9%、1-2 次 1.7%。這種兩極分布可能是題目呈現或編碼問題，我無法從頁面判斷；顏色對應已核對（Never=#1DA1FF … 10+=#BAFFC9），頁面確實這樣畫。引用「30%」時應同時說「也有 52% 說從沒遇過」。
- 頁面說 45% 同意 knowledge silos "are a nuisance"：實際陳述是 "Knowledge silos prevent me from getting ideas across the organization."，不是「是種困擾」。轉述要用原陳述。
- 「只有不到一半能找到最新資訊」：48.8% 同意 "I can find up-to-date information within my organization"，24.8% 不同意，26.4% 中立。可以說「不到一半同意」，不能說「一半找不到」。
- 樣本是 Stack Overflow 使用者中自願作答的專業開發者，不代表所有知識工作者。

## 讀取紀錄

- so2024-professional.txt：660 行，13,635 bytes（pandoc 轉頁面 HTML，圖表數字不在文字層）。一次讀完 1–660。
- so2024-professional-charts.txt：94 行，14,092 bytes（自寫 script 按順序抽出頁面標題與每個 `<svg>` 內的 `<text>`）。一次讀完 1–94。每個圖表三個 SVG 依序是 All／IC／Manager（由 Responses 數與頁面標籤順序推定）。Frequency 圖另以 rect 顏色與 legend circle 顏色逐段核對。
- so2024-methodology.txt：114 行，2,939 bytes。一次讀完。
- 管道：
  1. `curl` professional-developers 頁 → 200 HTML（421,466 bytes），SvelteKit 伺服器端渲染的 SVG → pandoc＋python 抽取（成功）。
  2. 原始資料集驗證（想重算頻率分布）：`https://survey.stackoverflow.co/datasets/stack-overflow-developer-survey-2024.zip` 回 HTML 頁（失敗）；tidytuesday README 中的 `cdn.sanity.io/.../stack-overflow-developer-survey-2024.zip` 回 404 JSON（失敗）；survey 首頁的下載連結由 JS 產生，未取得。原始資料未驗證。
