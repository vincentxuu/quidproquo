# 審稿紀錄：2026-10-18-climbing-shoulder（中英共用）

日期：2026-10-18。工具：Groundlane MCP 回 `not connected`；PubMed E-utilities（esearch 找攀岩肩肘論文、efetch 摘要）、Europe PMC（Quarmby 全文，確認肌力證據出處）、Jina reader、curl＋pdftotext（UIAA PDF）。原始擷取存於 scratchpad `e45src/`。

## post-verify

🟢 Confirmed
- Schöffl 2015：911 件、前瞻單一院所、手指 52% 第一、肩第二、肩傷增加（摘要）。Grønhaug 2018：肩 19.4% 排第二。Schöffl 2019 Orthopäde：SLAP 為該病人群第五常見診斷；旋轉肌、二頭肌長頭腱斷裂、夾擠、脫臼（Bankart）漸重要；抱石與新比賽形式使肩傷預期增加。
- UIAA factsheet：夾擠「quite common」、反覆伸手抓過頭的點被「pinched」、物理治療與肌力；肩痛原因多、需正確醫學診斷。
- Hooper 夾擠頁（2020）：原發（鉤狀肩峰）／次發（不穩、肩胛動作障礙）；症狀（過頭痛、往後伸、側躺）；與旋轉肌撕裂區分（外旋無力、drop arm、外傷）；夾擠外旋痛但不明顯無力；「Best advice: see a professional」；外旋肌力常不足。
- 安健維康李鑌：夾擠、旋轉肌群、肩胛骨動作障礙、前鋸肌、斜方肌下束、胸小肌。
- Mena 2024：35 位室內抱石者、橫斷面、動態風格與前側不安感相關。
- Simon 2023：外傷性脫臼為最常見肩傷之一且增加；27 人、53±29 個月、93% 回攀、78% 在 ±0.33 UIAA 級內。
- Cooper 2022：50 位無症狀菁英、80% 關節內病灶、明確盂唇撕裂 56%、各項百分比。Beeler 2021：31 位 ≥25 年、與同齡對照比、盂唇／長頭腱／軟骨差異、Constant 分數較佳、終生肩痛 77%、與強度正相關。
- Kozin 2021 RCT：84 位 18–19 歲男性學生、閉鎖鏈＋離心＋肌力、肩傷 3.182 vs 0.5／1,000 AE。Quarmby 2023 全文表格：肩肘預防結論的來源是 Kozin 等人兩篇（ref 30、31）。
- Grohnert 2022：20 人、4 週、6 個動作、VAS 5.25→2.4、Constant 82→104.1、作者明講是否能預防未知。
- Wong & Ng 2009：攀岩者 con ER:IR 0.79 vs 1.03、臨床意義未研究。BMC 2016：肩肌失衡常見、方向性動作放進暖身或輔助訓練。Esther Smith：prone I/Y/T、quadruped serratus push-up。
- NHS：變形、麻刺 → A&E。Lin 2026：下肢 50.6%、骨折為最常見類型、墜落為主因。

🔴／🟠 修正（已改）
- 「Quarmby 的結論來自這個團隊的兩篇研究」→ 兩篇中第二篇（Kozin ref 31）是技術訓練、測肘傷，不能都稱為肌力訓練；改為「來自這個團隊、這群學生攀岩者的研究」。
- 「不要讓岩友幫你喬回去」與「很多醫院有運動醫學或肩關節門診」→ 本 session 無來源，刪除。
- 就醫清單「痛到影響睡眠、減量幾週」→ 無來源的門檻，改成引 UIAA「肩痛需要正確醫學診斷」。
- Lin 2026「下肢最常見的是骨折」→ 摘要的骨折是全體傷害類型，改成「傷害類型以骨折最多」。
- glossary SLAP 定義中的二頭肌附著解剖描述 → 無本 session 來源，刪除。

🟡 Unverifiable（未寫入）
- 攀岩者 SLAP 的專門病例系列、台灣物理治療師國考 SLAP 題（研究筆記未開啟）→ 正文只寫 Schöffl 2019 的排名並明講研究少。
- Hooper 的 Hawkins-Kennedy、painful arc 等自我測試 → 屬診斷測驗，不放進讀者自我檢查；自我檢查只做左右比較、疼痛時機、外旋力氣，用來決定是否就醫。

本次只檢查了文中已提出的約 40 條宣告。

## post-review

- 機械檢查：`check:tw` 0 blocking／0 review；`check:references` 0 error；`check:process-leak` 中英通過；`check:post-quality` 本篇無警告；`check:links` 無壞鏈；內部連結（肘腕、拮抗肌與核心、動態、力量與 campus、總覽、抱石墜落）目標全部存在。完整 `pnpm verify`／`astro check` 未跑。
- frontmatter：series order 5 ✓；tags 與同系列一致 ✓；glossary 4 條（terms.ts 無重複）✓；tldr 有數字（第二、80%、84 人）且與 description 不重複 ✓。
- 範圍卡對照：夾擠、SLAP（標明攀岩研究有限）✓、肩胛穩定 ✓、拮抗訓練並連 D 系列〈拮抗肌與核心〉✓；「讀完後能做一次肩的自我檢查與預防動作」→ 自我檢查三步驟＋俯臥 Y 字 ✓。另含旋轉肌撕裂鑑別、脫臼、MRI 迷思（規劃研究 §8「肩 MRI 有撕裂就是受傷」）。
- 醫療規則：每項標證據等級 ✓；時程只引 Simon 2023 並註明族群（開刀者）✓；不給治療計畫 ✓；今晚動作皆為記錄、自我檢查或預防 ✓；練習題 4 題含就醫判斷 ✓。
- 弧線：開頭接上一篇肘腕，結尾用 Lin 2026「急診資料下肢占一半」轉到抱石墜落篇，符合規劃表 5→6 斷崖處理 ✓。

## post-polish

- register-scan：初版長句 10 句 → 斷句後剩 3 句（`<details>` 內 1、練習題答案 1、下一步 1，可接受）；但書段落 14%；引述區塊 0；數字密度高的段落集中在 `<details>`；研究者姓名當主詞 4 段（Cooper／Beeler／Kozin／Simon 開頭的研究介紹，屬引用句型；Mena 一段已改成「巴西一篇研究」開頭）；模板化轉折 1 處「不是說…而是」→ 改成「MRI 還是有用，只是…」。
- writing-phrase-ledger：無命中。
- 中英同步。
