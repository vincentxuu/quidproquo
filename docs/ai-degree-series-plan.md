# 「AI 學位怎麼選」系列文章計畫

## Requirements Summary

- 目標：把現有 53 校與六個教育網路的研究，拆成讀者能逐篇消化、又能從任何一篇回到總地圖的系列。
- 建議讀者：正在評估 AI／CS 學士、碩士或博士路線的台灣讀者；也包含仍在「念學位或自學」之間猶豫的人。
- 核心承諾：不靠排名列名校清單，而是回答「學位名稱代表什麼、課表差在哪、國際生能不能申請、總成本與研究生態如何比較」。
- 類別統一使用 `learning`；系列名稱建議為「AI 學位怎麼選：全球課程與申請地圖」。
- 停止條件：8 篇核心文章互相不重複、每篇有單一讀者問題、區域篇只使用完成官方查證的學校，且 `pnpm verify` 全綠。

## Why this shape

研究筆記已經浮現六個可獨立成篇的結構性論點，包括 AI 學位是例外、學位有四種濃度、排名不能混用，以及教育網路解不同問題；這些比「53 校逐校介紹」更適合當系列骨架。[研究筆記](../../docs/research-ai-degree-programs.md:12)

站內目前有三個相鄰內容，但用途不同：

- CMU deep-dive 已經回答「一個完整 AI 學位的畢業要求長什麼樣」，適合直接收編為系列 order 2。[CMU 文章](../../src/content/posts/learning/2026-08-21-cmu-ai-degree.md:18)
- Stanford CS 導讀回答的是「公開課如何按先修關係自學」，應保留原系列歸屬，並作為新規劃的「世界名校 AI／CS 課程地圖」第一個校內分冊。[Stanford 導讀](../../src/content/posts/learning/2026-08-20-stanford-cs-course-map.md:24) [課程地圖系列計畫](./global-ai-cs-course-guide-series-plan.md)
- 2026 AI 課程總覽回答的是「不念學位如何自學」，應作為決策篇的替代方案，而不是本系列正文。[AI 課程總覽](../../src/content/posts/ai/2026-07-10-ai-courses-2026-guide.md:24)

## Recommended Series Architecture

### Order 0 — 系列導讀／全球地圖

暫定標題：`全球 AI 學位地圖：53 間學校裡，真正發 AI 學位的其實是少數`

- 讀者問題：世界上到底有哪些完整 AI 學位，哪些只是 CS 底下的 AI 課？
- 單一主張：先看學位結構，再看學校排名。
- 內容：四種濃度速覽、三區域地圖、8–12 校代表表、各區域篇入口、研究查證分級。
- 不做：不在這篇塞每校申請截止日與完整課表；那些留給區域篇。
- 建議長度：2,500–3,500 字。
- CTA：先讀 order 1 判斷名詞，再按目標區域跳 order 3–5。

### Order 1 — 學位名稱解碼

暫定標題：`AI 學位、major、track、specialisation、stream 到底差在哪？`

- 讀者問題：學校頁面都寫 AI，為什麼畢業證書、必修課與申請方式差這麼多？
- 單一主張：學位名稱是行政與課程約束，不等於教學品質，但會改變必修結構。
- 案例：CMU/NUS 的獨立學位、Stanford 的 track、NUS MComp specialisation、Oxford 的 stream。
- 核心圖表：四層濃度 × 畢業證名稱 × 強制 AI 課比例 × 轉換彈性。
- 建議長度：1,500–2,200 字。

### Order 2 — CMU 現成 deep-dive

現有標題：`CMU 的 AI 學位：全美第一個 AI 學士，把「AI 該學什麼」寫成了畢業要求`

- 動作：只補 `series` frontmatter、導讀／上一篇／下一篇內鏈，不重寫正文。
- 系列角色：用一間學校具體證明 order 1 的「獨立學位會把選修變成畢業約束」。
- 保留官方頁互相矛盾的兩處，這是文章辨識度，不要為了表格整齊自行選邊。[現有論點](../../src/content/posts/learning/2026-08-21-cmu-ai-degree.md:18)

### Order 3 — 美國篇

暫定標題：`為什麼 Stanford、MIT 沒有 AI 學位，CMU、UPenn 卻有？`

- 讀者問題：美國頂尖 AI 研究很強，為什麼很多學校不發 AI 學位？
- 單一主張：美國的差別不是 AI 強不強，而是學校把 AI 放在 CS 核心、track，還是新設學位。
- 代表學校：CMU、Stanford、MIT、Berkeley、Georgia Tech、UPenn、USC。
- 比較軸：學位名稱、研究型／職業型、是否有 terminal master's、線上選項、國際生限制。
- 不做：不把 US News 全球 AI 排名當教學排名；排名問題只放一個警告框。
- 建議長度：2,000–2,800 字。

### Order 4 — 歐洲篇

暫定標題：`歐洲 AI 碩士不一定便宜：ETH、TUM、Tübingen、Edinburgh 怎麼選`

- 讀者問題：歐洲真的是低學費、高研究密度的 AI 碩士捷徑嗎？
- 單一主張：歐洲的優勢是研究網路與路線多樣，不是所有國際生都免學費。
- 代表學校：ETH、Oxford、Edinburgh、TUM、Tübingen；完成補查後再納入 EPFL、Cambridge、Imperial、UCL、Amsterdam、KU Leuven。
- 核心比較：獨立 AI degree vs CS/ML、1 年 vs 2 年、國際生 tuition、語言、研究網路（ELLIS/Max Planck）。
- 必放糾錯：TUM Informatics 對一般新入學非 EU/EEA 生是 €6,000/學期，不是免學費。[已查證資料](../../docs/research-ai-degree-programs.md:280)
- 發稿前置：EPFL、Cambridge、Imperial、UCL、Amsterdam、KU Leuven 六校至少完成官方學程頁與學費頁雙查。
- 建議長度：2,500–3,200 字。

### Order 5 — 亞洲篇

暫定標題：`亞洲 AI 碩士地圖：NUS、HKUST 有獨立學位，東京大學、清華不是你以為的那種 AI 碩士`

- 讀者問題：想留在亞洲念 AI，哪些是真的獨立學位，哪些要從 CS／工程學程進去？
- 單一主張：亞洲研究排名很高，但國際生可申請的學位名稱、授課語言與簽證條件差異極大。
- 核心案例：NUS、HKUST、東京大學、清華；補查後加入 NTU Singapore、KAIST、SNU、CUHK、HKU、台大、陽明交大、成大。
- 必放糾錯：清華人工智能學院 2026 對國際生只列博士；東京大學 AI Center 不是授予 AI 學位的專攻。[清華資料](../../docs/research-ai-degree-programs.md:329) [東京大學資料](../../docs/research-ai-degree-programs.md:381)
- 比較軸：獨立學位、全英語、國際生能否申請、學費、Student Pass／簽證、就業導向 vs 研究導向。
- 發稿前置：NTU Singapore、KAIST、SNU、CUHK、HKU 至少完成官方招生與課程頁查證；紅色學校不進主比較表。
- 建議長度：2,500–3,200 字。

### Order 6 — 博士與研究網路篇

暫定標題：`念 AI 博士時，學校名稱可能沒有研究網路重要：ELLIS、Mila、Vector、NSF 怎麼運作`

- 讀者問題：博士到底是在選學校、教授、研究中心，還是跨校網路？
- 單一主張：博士階段的資源與流動性常由研究網路決定，學位名稱反而退居其次。
- 網路：NSF AI Institutes、ELLIS、Vector/Mila/AMII、TAICA、RIKEN AIP、Stanford HAI × Swiss National AI Institute。
- 核心比較：資金來源、是否授予學位、學生如何加入、跨校指導、交換要求、解決的區域問題。
- 不做：尚未成立的 Max Planck School in AI 只放「籌備中」，不得寫成可申請學程。
- 建議長度：2,000–2,800 字。

### Order 7 — 決策與申請篇

暫定標題：`別只看 AI 排名：選 AI 學位前真正要比較的 7 件事`

- 讀者問題：拿到一堆校名後，最後要怎麼選？
- 單一主張：排名只能當弱訊號；學位結構、先修缺口、總成本、簽證、研究／職業取向更直接影響結果。
- 七個決策欄位：學位濃度、先修匹配、總成本、修業長度、實習／簽證、研究網路、退出選項。
- 放一個可複製的 decision matrix，示範三種 persona：轉職者、研究預備、預算敏感。
- 必須連回站內替代路線：不念學位的讀者去 2026 AI 課程總覽；想補 CS 地基的讀者去 Stanford CS 主線導讀。
- 建議長度：2,000–2,800 字。

## Editorial Boundaries

- 每篇只回答一個決策問題；學校介紹只作為證據，不以「名校百科」為目標。
- 總覽只放代表校；區域篇才放完整比較。相同學校在兩篇出現時，總覽最多 2–3 句，區域篇才展開。
- 排名必須帶排名機構、榜單名稱、年份與衡量對象；US News 全球 AI 不得簡寫成「AI 排名」。
- 學費一律標明學年、國籍條件、每年或每學期、是否另收 semester fee。
- 「沒有獨立 AI 學位」不等於「沒有 AI 教學或研究」；每次都要補上實際入口。
- 🟡 資料可放補充清單但不能進核心比較；🔴 資料只留研究 backlog，不進已發文正文。

## Internal Linking Model

```text
Order 0 全球地圖
├─ Order 1 名稱解碼 ── Order 2 CMU deep-dive
├─ Order 3 美國篇 ───── 世界名校 AI／CS 課程地圖
│                       ├─ Stanford CS 課程地圖
│                       ├─ CMU AI／ML 課程地圖
│                       ├─ MIT AI／ML 課程地圖
│                       └─ Berkeley AI／ML 課程地圖
├─ Order 4 歐洲篇
├─ Order 5 亞洲篇
├─ Order 6 研究網路／博士
└─ Order 7 決策篇 ───── 2026 AI 課程總覽（不念學位）
                    └── Stanford CS 課程導讀（補 CS 地基）
```

每篇開頭放「本篇回答什麼／不回答什麼」，文末固定放上一篇、下一篇、總地圖三個入口。Order 0 的學校表直接連到區域篇錨點或 deep-dive，不複製長段落。

## Publication Sequence

1. 先補齊 order 4、5 的紅黃資料，不急著寫區域篇。
2. 發 order 0 與 order 1，建立系列語言與比較欄位。
3. 把既有 CMU 文掛成 order 2，補雙向內鏈。
4. 發 order 3 美國篇；現有研究成熟度最高，可先驗證系列讀者反應。
5. 發 order 4 歐洲篇與 order 5 亞洲篇。
6. 發 order 6 網路／博士篇，把視角從學程提升到研究生態。
7. 最後發 order 7 決策篇，吸收前面各篇的比較欄位並成為轉換入口。

建議節奏：每週 1–2 篇；區域篇之間至少隔一篇或一週，避免連續大表格造成閱讀疲勞。若只想先做最小版本，先發 order 0、1、3、7，CMU 作既有 order 2，其餘標為第二季。

## Implementation Steps

1. 在研究筆記為每校補齊共同欄位：degree label、level、duration、tuition basis、language、international eligibility、application window、research network、source date。[來源主檔](../../docs/research-ai-degree-programs.md:36)
2. 優先補查歐洲六校與亞洲五校；每校至少讀官方學程頁與官方招生／學費頁，建立事實交叉表。
3. 先用 `post` skill 建 order 0、1 草稿；兩篇都從原始來源重查數字，不從研究筆記直接複製後視為已驗證。
4. 更新 CMU frontmatter 加入系列 order 2，補 order 0/1/3 的導覽連結；不改 slug/date。[CMU frontmatter](../../src/content/posts/learning/2026-08-21-cmu-ai-degree.md:1)
5. 依序撰寫 order 3–7；每篇完成後用 `post-review` 做內容層 review、用 `post-verify` 做事實層驗證。
6. 每篇跑 `pnpm check:references`，系列整批完成後跑 `pnpm verify`、檢查 series order 與所有內鏈。

## Acceptance Criteria

- 系列恰有 order 0–7，無缺號、重號；CMU 現有文章作 order 2。
- 每篇 title、tldr、description 都能單獨回答該篇的讀者問題，且相鄰兩篇正文重複段落低於約 15%。
- Order 0 主表最多 12 間代表校；完整學校資訊留在區域篇，避免總覽失控。
- 每個費用數字都有幣別、計價期間、學年與國際生條件。
- 每個「有／沒有獨立 AI 學位」判斷至少由官方學程清單與另一個官方頁交叉確認。
- 區域篇主比較表只收 🟢 學校；🟡 只放「待補查」，🔴 不刊出具體判斷。
- 每篇至少有總地圖與相鄰篇內鏈；order 7 額外連到既有自學課程與 Stanford CS 導讀。
- 每篇 `post-review` 無 blocking issue、`post-verify` 無未解關鍵事實，最終 `pnpm verify` 全綠。

## Risks and Mitigations

- 風險：總覽與區域篇大量重複。緩解：總覽只下定位，細節與數字只在區域篇展開。
- 風險：學費與招生期很快過期。緩解：正文標註學年與查證日，集中用表格，未來可逐欄更新。
- 風險：系列變成排名文。緩解：所有篇章以決策問題開頭，排名只作輔助欄位且標明衡量對象。
- 風險：紅黃資料拖延整個系列。緩解：先發布研究成熟的 order 0、1、2、3、7；歐洲與亞洲篇在補查完成後發布。
- 風險：既有 Stanford／AI 課程文章被重複收編。緩解：維持其原系列，只用內鏈作為「課表」與「自學替代」支線。

## Verification Steps

1. `rg -n 'series:|name: "AI 學位怎麼選：全球課程與申請地圖"|order:' <series files>` 確認 0–7 完整。
2. `pnpm check:references` 驗證 learning 類文章的參考資料覆蓋。
3. `pnpm check:series-order` 驗證篇序。
4. `pnpm check:lang-parity` 確認若新增英文版，系列名稱與篇序成對。
5. `pnpm verify` 作唯一最終品質閘門。

## Remaining Decisions

- 預設先只寫 zh-TW；英文版等中文系列完成後再整批翻譯，避免研究更新在雙語稿間漂移。
- 預設不改 Stanford CS 主線導讀的 primary series；只透過 `additionalSeries` 把其入口地圖掛入「世界名校 AI／CS 課程地圖」。
- 預設 order 4、5 在補查完成前不發；若要縮短時程，採最小版本 order 0、1、2、3、7。
