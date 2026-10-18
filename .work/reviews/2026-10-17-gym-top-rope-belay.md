# 審稿紀錄：2026-10-17-gym-top-rope-belay（中英共用）

日期：2026-10-18。工具：Groundlane MCP 未連線（web_fetch 回「MCP server not connected」），firecrawl MCP 也未連線；改用 curl 直接下載 DAV PDF（pdftotext）、Jina reader over curl（REI 兩篇、原岩 358／360／232、艾格 top-roping、World Climbing TPE、nobodyclimb、Wikipedia GriGri）、Keenable keyless 搜尋（找 GRIGRI 來源）。Petzl GRIGRI 產品頁經 Jina 只拿到 JS 外殼、沒有內文，改用 Wikipedia。原始擷取存於 scratchpad `agent-tr/`。

## post-verify

逐條對照本 session 打開的原文，共約 55 條宣告（正文、表格、練習題、tldr、glossary）。

🟢 Confirmed
- DAV PDF（2024 英文版）：四點互檢、兩人都負責、上攀先鋒都要做；吊帶在髂骨上方；繩結可用八字結或雙套稱人結、繩尾至少 10 cm；確保器穿對、鉤環上鎖；繩尾打結或固定在繩袋、注意繩長；一隻手永遠握制動端；體重差 1.5 倍（60/90 kg 例）、近地面收緊因繩子延展；Take→收緊→Lower、坐穩且有口令才放、眼神接觸與喊名字；落地區淨空、注意牆上其他人、平順放到地面；墜落練習屬上攀證課程、頂端固定點、垂直到微前傾、無大凸出岩點、三階段（坐繩不喊 Take→較鬆但無多餘繩→模擬往上動作時放手、最多一支快扣距離、由攀爬者決定）；建議輔助制動確保器、鉤環照廠商建議；2005 年起超過 10 萬張、「not a licence」、攀爬能力次要；上攀／先鋒兩張證、附統一考試表格。
- REI How to Belay：「instruction from a qualified teacher is essential」、最早教的基礎技能；站位三方向；制動手慣用手、確保器下方約 6 吋、太近會被夾；引導手頭頂略高；PBUS 四步與「短而快」、攀爬者停你也停在制動姿勢；互檢含「Command Check」；口令表（On belay/Belay on、Climbing/Climb on、Slack、Up rope、Tension/Gotcha、Lower/Lowering、Off belay/Belay off、Rock、Falling）；講大聲、溝通失誤和其他系統失誤一樣嚴重；下放雙手在制動端、等速、遇障礙暫停、近地面放慢；Off belay 時給繩回 Belay off；換確保器要重新學、先鋒差異更大；繩尾 stopper knot 讓繩子不會整條穿出確保器。
- REI Climbing Knots：八字結步驟、五組平行線、繩尾至少 6 吋；雙套稱人結較好解、必須以 double overhand 備份。
- 原岩 358：5 堂、NT$5,500（團課）、ATC＋Grigri 上攀確保。原岩 360 Q&A：「原岩確保卡可以在其他場館使用嗎？這要依各家攀岩館的各別規定」。
- 艾格 top-roping：NT$3,900、兩次 3 小時共 6 小時、內容含繩結／確保／口號／裝備檢查、完成一週後可考上方確保安檢卡、Camp 4 認可。
- 原岩 232（CBT 2023）：考 TR 確保、先鋒確保、先鋒攀登 5.7–5.8、收繩；費用 1,200 元。
- World Climbing TPE 頁：Chinese Taipei Alpine Association 為台灣會員。
- nobodyclimb：繩索系統練習「Basic Belaying」頁存在、15 題。
- Wikipedia GriGri（文中未引，作背景核對）：GRIGRI 是輔助制動、墜落時鎖住；ATC 的制動完全依賴使用者握繩。

🔴／🟠 修正（已改，中英同步）
- 「REI 確保原則第一條全部大寫」→ 原文只有結尾的 ALWAYS 大寫，改寫。
- 雙套稱人結備份「雙半結」→ REI 寫 double overhand，改成「雙重單結（double overhand）」。
- 口令表 Tension 回應「Got you.」→ REI 原文「Gotcha.」。
- 「兩條相鄰路線同時有人喊 Take 也很常見」→ 無來源；改成 REI 原意（人多時難分辨是誰在喊，建議口令前加對方名字）＋DAV 眼神接觸／喊名字。
- 墜落練習備援只寫「第三個人握制動端」→ DAV 原文是「第三個人備援或在繩上打結」，補上後者。
- 「練過一次之後，爬到難的地方比較敢出手」→ 無來源；改成 DAV 寫的目的（累積墜落與接墜的初步經驗）。
- 「原岩上完課取得原岩的確保證」→ 358 頁沒寫結業考試或發證；改成頁面上實有的「複習課只開放給上過確保課並取得原岩確保證的學員」。
- 「CBT 是報考山協 C 級教練、裁判、定線員的前置資格」→ 引用的原岩公告只把「之後想報名 C 級教練／裁判／定線員課程」列為適合報考的人；改成公告原意。（研究筆記另有 2007 論壇流程圖支持前置關係，但屬 🟡，未採用。）
- 「跨館能不能用由那間岩館決定」原本無 inline 來源 → 補原岩 360 Q&A 連結，參考資料同步新增。

🟡 Unverifiable（未寫入／維持原寫法）
- 「台灣沒有全國統一的岩館確保證」是否定陳述，無單一來源可直接證明；依研究筆記（原岩、岩究所、iClimb、艾格各自發證）與原岩 360 Q&A 推得，維持原句。
- Petzl GRIGRI 官方產品頁：Jina 只取得 JS 外殼、firecrawl 未連線，未讀到 Petzl 原文；改以 Wikipedia 核對 GRIGRI 的功能描述。

本次只檢查文中已提出的宣告，未評估文章對主題的覆蓋是否完整。

## post-review

- 機械檢查：`check:tw` 0 blocking、1 review（「保安」命中「上方確保安檢卡」的「確保安」，誤判，不改）；`check:references` 全站 0 error，本篇 1 條 WARN（中文標題與英文參考資料關鍵詞重疊低，屬啟發式警告，不改）；`check-post-quality` 中英兩檔皆 OK；`check-process-leak` 無輸出。完整 `pnpm verify`／`astro check`／`check:links` 未跑（REI 擋機器人會 403，本 session 已用 Jina 讀全文；全站驗證交由 commit gate）。
- frontmatter：`series` 已依指示登錄為「運動攀登與傳統攀登」order 0，未動；tldr 有具體數字（5 堂 NT$5,500）且與 description 不重複 ✓。glossary 四條與正文一致 ✓。
- 結構對照 guide 型：系統組成 → 開爬前 → 收繩 → 口令 → 下放 → 墜落練習 → 確保器 → 台灣怎麼學 → 練習題（<details>）→ 下一步 ✓。「下一步」已連到系列下一篇 gym-lead-climbing 與總覽，未重構。
- inline link：每個來源第一次出現都有連結；本次補上原岩 360 ✓。
- 範圍：上攀確保五件事、DAV／REI 對照、台灣兩館與 CBT 都有覆蓋；先鋒內容只留一句並轉到下一篇 ✓。

## post-polish

- register-scan（zh）：長句初版 0，修正時新增 1 句（REI 原則段 62 字）→ 斷句後 0。但書 7%、引述區塊 0、研究者姓名當主詞 0、模板化轉折 0、英文術語 0。數字密度 1 段（CBT 段 4 個：2023、5.7–5.8、1,200、C 級），皆為讀者需要的考試條件，保留。
- register-scan（en）：中文閾值不適用英文長句統計（22 句 >60 字元屬英文正常長度），其餘項 0。
- 可執行動作：「今晚就能做的動作」在互檢與台灣考法兩節，練習題五題都在 <details>，風格保留。中英同步修改。
