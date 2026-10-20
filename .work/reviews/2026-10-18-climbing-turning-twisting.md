# 審稿紀錄：2026-10-18-climbing-turning-twisting（中英共用）

日期：2026-10-18。工具：Groundlane MCP 未連線；Jina reader（間歇 429）、curl＋去標籤（climbing.com 三篇、PRG spin-out）、PubMed E-utilities（Lutter 2020）、pdftotext（BMC）。mermaid 圖中英各用 mermaid-cli 11.4.2 渲染成 PNG 檢視過。原始擷取存於 scratchpad `b23src/`。

## post-verify

🟢 Confirmed
- 方格子〈攀岩術語、名詞大補帖〉：術語多從國外傳入、大家講原文；開門是少數有中文的術語，定義為兩個同側支點時繞支點旋轉。
- iclimb prose2_6（黃國維 2007 第 20 期）：側身同時指 Lay back 與 Twist-Lock；交叉平衡（Flag）；開門通常出現在同手同腳；膝蓋朝下（Dropknee）；Twist-Lock 上半身轉向 lock-off 那手、多出肩膀長度。
- 阿倫抱石教室 climb10：外側／內側 Flagging 定義；Dropknee 中文也有人稱「折膝」。
- Gresham（Climbing.com ×3，作者 meta 確認）：正身是爬樹的直覺方式；前傾牆正身兩個問題；step-through 在單一腳點時用、外側用鞋前端、約 45°、出手臂近乎伸直、成為前傾牆的 staple；flag 用在不能 step-through 時（屋簷邊、volume、腳點太偏、自然走成正身）、外側 flag 腳點約膝蓋以上、內側 flag 膝蓋以下、外側 flag 一定要拉與鎖臂、平衡要在拉上去之後、flag 腳常擺不夠遠（兩個軸）、太費力時考慮換腳 outside edge、內側 flag 更省手；drop knee 兩側等高腳點、同手同膝無例外、腳尖前端轉、先放不轉的腳、30–75° 最好用、5–25° 不好用、稜角／volume／屋簷邊做不出、膝蓋有傷避開、腳越開越吃腿力與柔軟度、地面模擬練習。
- REI：髖部正對牆把重量推離牆、一側髖部靠牆、肩膀靠近改變拉力角度；backstep 外側踩、髖靠牆、直臂休息、多伸展、前傾特別省；drop knee 腳點約髖部高度、腳尖踩再轉膝；flag 定義與手點同側時用；側拉三種對抗方法。
- BMC：轉髖讓重心靠牆、更落在腳上方。
- Climb Strong Hip Shapes：onsight −2/−3 的抱石題，正身與只用 backstep 各爬一次比較。
- PRG（Dave Rowland，Owner & CTO、30 年以上）：開門定義、對角支撐修法、放掉下面那隻腳從三點變兩點、在 slab 故意開門練習；twist-lock 家族；backstep 四步驟；spin-out 只在 backstep、腳點在線後面（手點左邊 10–12 吋）、膝蓋無法把體重往後拉、選線上或線前腳點、否則用 drop knee；drop knee 兩腳都在牆上、對向腳踩直防 spin-out。
- Hörst：flag 把空腳放到支撐腳後方、最強手腳同側時用。
- Lutter 2020 摘要：71 人 77 次急性膝傷、heel hook 40.3%、地面墜落 22.1%、high step 20.8%、drop knee 16.9%、內側半月板撕裂 28.6%（非競技較多）、46.8% 室內抱石、4 年回溯多中心。

🔴／🟠 修正（已改）
- 「drop knee 是少數有傷害統計的動作」→ heel hook、high step 也在同一研究，改成「有直接的受傷統計」。
- 「這份研究沒有把半月板撕裂和機轉對應」→ 本次只讀摘要，改成「研究摘要沒有……所以不能據此說」。
- spin-out 初稿「腳點在手點那條垂直線外側太遠」方向含糊 → 改成以右手左腳為例：左腳在右手垂直線左邊太遠（對應 PRG 原文）。
- 外側 flag 方向初稿「從站立腳外側擺出去」→ 補「離牆那側、交叉過去」，練習與練習題 1 統一寫成「擺到支撐腳後方」（Hörst 原文）。
- Rowland 頭銜初稿「教練」→ 改為頁面寫的共同經營者、30 多年教學經驗。

🟡 Unverifiable（未寫入）
- drop knee 專屬半月板病例：無來源，不寫具體病例。
- 「擰身／扭身」台灣用例：查無，正文標「本文譯名」。
- Kinematic analysis of the Lolotte（ASME 2017）只見摘要片段，未引用；lolotte 只放 glossary aliases（BMC 文件有 egyptian）。

## post-review

- 機械檢查：`check:tw` 初稿 1 個 A 級（「抓手」，實為「抓手點」誤判）→ 改寫成「拉手點的角度」，現 0 blocking；`check:references` 本篇中英無錯；`check:process-leak` 通過；`check-post-quality` 無警告。mermaid 中英兩版渲染無誤、節點文字短。`pnpm verify`／`astro check` 未跑（交給 commit gate）。
- 範圍卡對照（order 3）：正身 vs 側身 ✓、backstep ✓、twist-lock（本文譯名擰身）✓、drop knee ✓、flag 內／外 ✓、開門的成因與修正 ✓；drop knee 風險用 Lutter 2020 整體數字、不寫半月板病例 ✓。讀完能說出開門原因並用 flag 修正：開門節＋flag 節＋練習題 1 ✓。
- 術語：側身先定義；擰身標本文譯名；開門有台灣用例；膝蓋朝下／折膝／交叉平衡附出處；側拉＝sidepull ✓。
- 結構：每節有今晚動作（含開門、backstep、drop knee、flag、髖部形狀）；練習題 4 題；下一步連 order 4、8 ✓；決策圖用實線，每條線對應 Gresham 的腳點配置說法 ✓。
- 數字：正文每主張最多一個數字（45 度、30–75 度為同一主張的範圍、16.9%）；Lutter 其餘數字收 details ✓。
- 與兄弟篇一致：order 8 牆角度篇稱 drop knee 為「折膝」並連回本篇，一致；order 4 手點篇的側拉／倒抓／扳點用詞與本篇下一步一致 ✓。
- inline link：所有來源第一次出現皆有連結 ✓。

## post-polish

- register-scan（中文）：長句初稿 6 句（方格子、REI、Rowland、牆角度、flag 用途、練習題答案）→ 斷句後剩 Rowland 開頭一句（連結文字長，保留）；但書 6%；數字密度只在 details 內（允許）；模板化轉折 0；引述區塊 0。
- writing-phrase-ledger：無命中。
- 英文版：register-scan 長句指標以字元計，對英文不適用；人讀確認與中文段落對齊。
- 人讀：「先把名詞講清楚」一節放在最前，避免讀者在 backstep 節才遇到側身歧義；開門節先講成因再給兩種修法，符合範圍卡要求的「成因與修正」。
