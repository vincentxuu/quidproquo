---
name: media-to-post
description: Prepare YouTube videos, podcasts, audio/video files, subtitles, or transcripts for evidence-backed articles. Use when the user gives a YT/podcast link and asks 寫成文章 / 整理成導讀 / turn an episode into a post. Run before post or post-update. Do not use for embedding a video only, fixing a link, or translating an existing article.
---

# media-to-post

把影音轉成可回查的材料，再交給 post 或 post-update。遵守 `docs/content-source-writing-rules.md`；本流程不取代雙語寫作與品質閘門。

## 1. 範圍與工作目錄

在 `.work/media-to-post/<episode-id>/` 保存來源、原稿、校正版與證據。目錄已存在時檢查來源版本，不覆寫其他 session 材料。使用 `templates/source.json` 與 `templates/evidence.md`。

只給連結也自行選讀者問題與文章角度。預設交付有來源定位的導讀。使用者要求完整逐字稿／逐句翻譯時保留需求與缺口，不能自行降成摘要並稱完成。未知 metadata 填 null 或 unknown，不編造日期、時長與說話者。

## 2. 來源取得

公開網頁 Groundlane-first：查完整 callable inventory，用 web_search 找官方來源、web_fetch 讀頁面；需要 selector 才用 web_extract。使用者指定工具優先；未指定時，Groundlane 未掛載或一次 bounded request 整體失敗，依專案 AGENTS 規則選合適其他 MCP，再用平台公開網頁工具，簡短揭露實際路徑。Fallback 不算 Groundlane 驗證。不得用已退役抓取工具或 Playwright scraping，不得向公開工具傳 secrets 或私有資料。

優先序：

1. 作者／節目官網提供且經編輯的逐字稿或字幕。
2. 官方播放器的原語字幕／逐字稿，記錄人工、自動或未知；自動翻譯不當原語逐字稿。
3. 使用者提供、已授權或允許取得的影音檔，用當前可用轉錄工具。先確認格式、時間戳與說話者能力，不預設工具可直接接 YouTube URL。

Podcast 查單集官網、show notes 與 RSS transcript 入口。平台顯示逐字稿不代表能匯出或任意轉載。Show notes、章節與二手摘要只能作索引，不能冒充整集內容。沒有文字或可用音訊時，完成來源盤點並回報缺口，不宣稱已分析整集。

先檢查回應真的含所需字幕／逐字稿，而非導覽、登入頁或 show notes：HTTP 200、工具 ok 與 truncated=false 都不代表已取得影音內容。官方配套文章可作獨立文字來源，但不能冒充原音逐字稿；頁面 updatedAt 也不能當影片發布日期。

保存來源原樣為 transcript.raw.txt 或原始 VTT/SRT。分頁必須讀完，記錄 truncation、續頁與取得區間。對照最後字幕時間、媒體時長與章節，標疑似缺段；片尾音樂、廣告、動態插入音訊另記。時間對齊不能證明轉錄完整或正確。

## 3. 校正與畫面核對

保存 transcript.corrected.md，保留原始時間基準、說話者與修正紀錄，不改原始快照。

- 核對人名、術語、數字／單位、否定、條件、直接引語與說話者；去贅詞不得改立場或確定程度。
- 回聽將引用的原話與重要主張。無法回聽時標「字幕核對完成／原音未核對」，不可稱原音驗證。
- 聽不清標 `[unclear @ 時間]`；不猜原話，不從中文反譯冒充英文原句。身份未確認用 Speaker A/B。
- 影片的圖表、程式碼、投影片或示範可能沒有口述；核對相關畫面並記位置。只有字幕時明示未核對畫面，省略或限制依賴畫面的結論。

## 4. 主題地圖、證據與覆蓋

長影音按主題或自然停頓分段，保留邊界上下文與原始時間。不可直接串接片段摘要。

依 evidence 模板寫：

- topic-map.md：論點、條件、例子、反例、分歧與時間；全文完成後檢查後段修正前段、來賓相互反對與推測被當結論。
- claim-evidence.md：重要主張／引語對應說話者、原文依據、時間區間與核對狀態；無時間戳用段落 ID 並標限制。講者意見與可驗證事實分開；版本、數據等另查一手來源，外加資料明示為編輯補充。
- coverage-report.md：取得／已讀範圍、缺段、字幕／回聽／畫面各自狀態、未解疑點、權利與交付形式。只對已讀範圍下結論。

## 5. 文章交接與完成條件

按讀者問題重組大綱，保留條件、限制與例子，再交 `../post/SKILL.md`（新文章）或 `../post-update/SKILL.md`（既有文章，不擴大更新範圍）。

引語與重要主張附原始單集來源與時間定位；來源無時間戳時沿用段落 ID 並明示限制，不估造時間。平台不支援時間連結就用可讀時間，不造無效 URL。YouTube 沿用 post 的 youtube fence；podcast 提供官方單集／播放器入口，不自造 renderer 不支援的嵌入語法。

英文原音練習沿用 post 的 shadowing checklist；沒有核實文字保留待補。完整逐字稿／完整翻譯先確認轉載依據，不能把原站字幕、短引文或摘要稱頁內全文。雙語版核對說話者、數字、否定、條件與引用範圍一致。

完成前確認 metadata、分頁／截斷、疑似缺段、主張定位、引語辨識、音訊與畫面驗證、承諾與交付一致。仍有缺口就交付可完成部分與精確缺口，不稱完整整集分析。按文章 skill 跑檢查與 pnpm verify；檢查通過不代表原音正確、已發布或播放器已實測。

## 依據

- [YouTube 自動字幕校正](https://support.google.com/youtube/answer/6373554?hl=en)
- [Apple Podcasts 逐字稿與說話者](https://podcasters.apple.com/support/5316-transcripts-on-apple-podcasts)
- [W3C 逐字稿與畫面資訊](https://www.w3.org/WAI/media/av/transcripts/)
- [Descript 轉錄後重組文章（工具商實務建議）](https://www.descript.com/blog/article/how-to-repurpose-content)
