# 審稿紀錄：2026-11-17-mass-irrationality-overview（order 0，中英共用）

## post-verify

- 事實層：Bernstein 兩句引文（「I had read the script…」「near 100% certainty…」）對 New Bazaar 逐字稿原文 ✅；Budak et al. 三誤解＋fringe 論對 Nature 摘要 ✅；Ecker「selective reading」「only partially effective」、40%/70% 數字對 Nature comment 全文 ✅；同年同刊 05 June 2024 兩篇對打 ✅。
- 書單年代清點：初稿「十一本裡九本寫於 1960 年前」為錯（實際六本寫於 1964 年前），且「全是英美作者」錯（Le Bon 法語、Canetti 德語原著）→ 已修為「兩本原著非英語…六本寫於 1964 年以前」（中英同修）。
- 譯本狀態四句（Le Bon 四家＋簡體 30+、洪蘭譯 2013 退書、Canetti 絕版、Paranoid Style 無繁中、Rauch 無中譯）對掃描書目 ✅ snippet 級，正文以狀況陳述不誇飾。
- 連結：5 條參考資料皆有效（兩條 Gutenberg/Nature 類 main session 讀過；DNR Taiwan 讀過；Bernstein 逐字稿讀過；Nature Budak 摘要讀過）。
- 檢查器：pnpm verify 全綠（2026-11-17，含 check:series-plan／lang-parity／references／process-leak／diagram-geometry）；diagram-preview 兩版 ✓ 無重疊／裁切／過小字；淺色／深色／手機三張截圖已目視。

## post-review

- 結構：開頭兩句引文直接給「知道劇本也擋不住」的系列動機，三段警告在地图之後讀者不會被偏誤突襲；每篇固定四段與台灣回扣在「每篇怎麼寫」段預告，與規劃表一致。
- 體裁：導讀系列總覽，對象前三段成立（沒接觸過的人知道五層是什麼）；主脊按「地圖→警告→讀法→篇目」，非工作量排序。
- 但書堆疊：check-process-leak 0 處；歸因句皆有出處。
- 缺角：Canetti 譯本絕版只一句帶過（細節留 order 5）；L0 的 Altay & Gilardi 未引用（掃描級，不進正文）——皆符合「不引用未讀來源」。

## post-polish

- register-scan（1500+ 字門檻）：0 處。
- 修了「九本／全是英美作者」兩處事實錯誤（見 evidence.md）；其餘無潤稿改動。
- 中英同步：兩版結構、圖、表格、篇目表一致；英文版非機翻（hook 用 Bernstein 原話，警告段重寫語序）。

## 2026-11-20 重寫（冷讀判「需重寫」：整篇是規劃表，讀完只記得書單）

- 依 book-guide-contract 重寫：開頭三段交代系列問題、怎麼讀、讀完能做什麼；先給總答案（經典「像得病」→ 後來研究改寫四件事）；四題問題清單；書單改為「每本書回答什麼」；拿掉 L1–L5、order、解釋鏈、回扣、固定四段說明與五層圖。
- 每本書的一句話答案取自各篇 tldr 與正文（Le Bon 社會認同、Hoffer 網路招募與希特勒引文、Canetti 共同身分、Kahneman 佛州效應／自我耗損、McIntyre 逆火效應、偏執狂風格「被排除在權力之外」、反智「Intellect is resented as a form of power or privilege」、Rauch、Nichols）。
- Bernstein「I just don't see any way out of it」出自 New Bazaar 訪談結尾（bernstein2021.extract.md:51），舊版寫成「同一本書的結尾」是錯的，已改。

## 冷讀

- 子代理只讀正文：說得出系列總答案與四題清單；想點 Mackay、Rauch；判「小修」。
- 已修：Bernstein 引文出處、清單第 2 題（規則）缺鋪陳（第四點補鬱金香合約例）、社會促發／自我耗損未解釋、「前四題」筆誤、陰謀信念與標題關係、Canetti 與失去理性的關係、Hofstadter／Bernstein 表格句歧義、「～地一致」與「複製」翻譯腔、Nature 段縮短、更新紀錄不寫內部作業。

## 2026-11-20 第三版（使用者：「不夠豐富與多元，能夠回應文章架構嗎？」）

- 改成五個問題串起十一本書（歷史→人群→個人大腦→文化制度→資訊環境），每段結尾「這一段留下的問題」接下一段。
- 新案例皆讀過一手：梨泰院 Liang et al. 2024 PLOS ONE 摘要（7.57 ped/m²；主因人數、雙向對撞、逐漸升高的恐慌）；Müller-Vahl et al. 2022 Brain 摘要（德國、YouTube 創作者為虛擬指標個案、社群媒體擴散）；余英時〈反智論與中國政治傳統〉聯經全文開頭兩節；PNAS 2025 Community Notes（-46.1% 轉發、附得更快會更有效）；Reuters 2025-01-07 Meta 停止美國第三方查核（官方公告頁 404）；DNR 2025 Taiwan（信任 30%、-3；YouTube 46%、LINE 42%）。台股處分效應、Enders 2022、中研院美國肖像沿用各篇已查證內容。

## 冷讀（第三版）

- 子代理說得出五段架構與總答案；判「小修」。已修：tldr 平台不一致、三場金錢狂熱、普通球莖與法院因果、Canetti 擁擠前提、依賴→怨恨跳太快、陰謀信念研究範圍、台灣極化句無關、Meta 段補意義、第五段書序說明、第三段補台股案例、第四段補美國肖像並壓縮余英時、翻譯腔與「清算」、更新紀錄與 description 的規劃口吻。
