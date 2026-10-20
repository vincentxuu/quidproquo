# 審稿紀錄：2026-10-19-outdoor-bouldering-pads-spotting

- 審稿日：2026-10-19（獨立審稿 agent）
- 對象：`src/content/posts/climbing/2026-10-19-outdoor-bouldering-pads-spotting.md` ＋ `-en.md`
- 流程：post-verify → post-review → post-polish → EN 對照
- 工具：Groundlane MCP `web_fetch`（這次能用，Gripped／Climbing×2／AAC×2 都是用它開的；有一次回 CONCURRENCY_LIMIT）、jina `read_url`（CWA、REI、Wikipedia、PMC 瑞典研究）、NCBI E-utilities（Josephsen 摘要；PubMed 頁面對 jina 回 reCAPTCHA）、curl（原岩、臺北捷運、AAC 2025 地點欄位）。12 份引用來源全部打開。

## post-verify

| # | 主張 | 判定 | 來源 | 建議 |
|---|---|---|---|---|
| 1 | Gripped：岩館地墊連成一整片；戶外有樹根、石頭、斜坡；墊子只有「一兩張」 | Confirmed | https://gripped.com/indoor-climbing/bouldering-outside-5-tips-for-a-safer-landing | — |
| 2 | Gripped：落地區常常超出起攀處，題目越陡、越橫移越明顯；估落地區要放寬，因為落在墊子邊緣是很常見的扭腳原因 | Confirmed | 同上 | — |
| 3 | **「Gripped 也說，墊子疊越多層越不穩，縫也越深」，被歸在「平鋪，少疊」那一派**（練習題 4 也寫「Kehl 和 Gripped 則認為……疊越多越不穩」） | **Contradicted（歸派錯誤）** | 同上，第 4 點標題就是 "Stack Pads (Properly) For Higher Boulders"：「even if a landing is quite flat, you may want to make your landing two or three crash pads deep. That said, as you add pads, you can lose stability and gaps between pads get deeper」 | Gripped 其實**建議**石頭高時疊兩三層，「不穩、縫深」是它附上的注意事項。改成第三種立場，或把這句移出「平鋪」派（見 Must fix 1、2） |
| 4 | Gripped：小墊折起來塞坑、大墊蓋上、走一遍；墊子會因走動、坐、摔落而移位 | Confirmed | 同上 | — |
| 5 | Gripped：起攀段過了之後可以把起攀處的墊子移到後段 | Confirmed（小落差） | 同上 | Gripped 沒說由 spotter 移；由 spotter 移墊的說法出自 Kehl。合併寫可以接受 |
| 6 | Gripped：不一定要 spot 的兩個例外（低矮前傾；垂直直上、top out 不高） | Confirmed | 同上 | — |
| 7 | Climbing 2022：用兩個問題決定鋪墊（掉的機率、後果）；10 呎題（約 3 m）的例子；大而硬的墊放在 lip 下；第二手用薄墊護 | Confirmed | https://www.climbing.com/skills/boulder-safely/ | — |
| 8 | Climbing 2022：「墊子要完全平整」是誤解；除非是全新墊，邊緣會被壓下去；縫才是大問題；薄墊（blubber）可能滑走，也可能把縫藏起來；每次嘗試之間都要調整 | Confirmed | 同上 | — |
| 9 | Climbing 2022：spot 三個目標；先讓人落墊再護頭；手指併攏像連指手套或游泳；身材差很多時只顧頭；戶外「幾乎都值得 spot」（heel hook、動態動作）；把鑰匙、手機、錢包、皮帶拿下 | Confirmed | 同上 | — |
| 10 | Kehl（Climbing 2022，原刊 Rock and Ice）：平鋪不疊、拼圖式疊法；用粉標記蓋住的石頭；小坑用衣服或背包、斜坡把一張墊對折墊在下面；拇指收進掌心；扶腋下或推上背；「一個懂的 spotter 勝過六個不懂的」；有時沒有 spotter 最安全；獨自爬時起攀用薄墊或地毯 | Confirmed | https://www.climbing.com/skills/how-to-spot-bouldering/（會轉址到 `/skills/how-to-highball-boulder/`） | 可選：參考資料改成轉址後的網址 |
| 11 | CWA：受訪的業界專家一致把 spot 定義成保護頭頸；戶外 spot 比岩館更常見 | Confirmed | https://cwapro.org/blog/perspectives-on-spotting（2013 年 7 月 Lines Newsletter 轉載） | 可選：補一句這篇是談岩館 spot 的 |
| 12 | REI：spotter 不是接人，而是護住頭和肩膀；「spotter 越多越好」 | Confirmed | https://www.rei.com/learn/expert-advice/bouldering.html | — |
| 13 | AAC 1986：spotter 被從 2–3 m 高掉下的同伴壓到頭，腳踩外斜的石頭，腓骨骨折；spotter 只能引導、不能接；手臂插到腋下 | Confirmed | https://publications.americanalpineclub.org/articles/13198603901 | — |
| 14 | AAC 2025：Hueco Tanks *See Spot Run*，約 25 呎；事先叫兩位 spotter 在過了難點後閃開；五張墊、鋪得比平常窄；約 15 呎墜落、左腳踩到岩石、嚴重扭傷；事後說應該多帶墊、用薄墊蓋縫 | Confirmed | https://publications.americanalpineclub.org/articles/13201217298（地點欄位：Texas, Hueco Tanks State Park, North Mountain） | 可選：補題名 *See Spot Run*（V6）、事故發生在 2024 年 1 月（報告是 2025 年刊出） |
| 15 | Wikipedia：兩到三層泡棉、尼龍外層；第一張商用墊 1992 年推出，和 Hueco Tanks 有關；hinge 是弱點 | Confirmed | https://en.wikipedia.org/wiki/Crashpad | — |
| 16 | 「沒有折線的墊子……落地比較均勻」 | Unverifiable | Wikipedia 只說 hinge 是弱點，沒有說無折線墊「落地較均勻」 | 刪掉這幾個字，或改成「沒有折線那條弱點」 |
| 17 | taco／burrito「各家定義不一致」 | Confirmed（靠研究筆記） | Wikipedia（taco＝無 hinge）vs Beta-gear（burrito＝有 hinge），見研究筆記 #29 | — |
| 18 | 原岩南港：租借日兩天前預約、簽紙本租賃契約、留身分證件；單張首日 300、第二天 200、第三天起每天 100 | Confirmed（2026-10-19 抓取） | https://tupclimbing.tw/gear/nangang/13 | 可選：補一句原岩出租的墊子最大約 121 × 100 cm，在捷運限制內 |
| 19 | 臺北捷運：最長邊 ≤ 165 cm、長寬高總和 ≤ 220 cm | Confirmed | https://www.metro.taipei/News_Content.aspx?n=566DA580861CEE77&sms=87415A8B9CE81B16&s=4878D2C91C044C0A | — |
| 20 | 瑞典研究：38 位戶外攀岩傷患，其中抱石 9 位；9 位全部是足踝傷，多數是骨折（8/9）；作者說樣本很小 | Confirmed | https://pmc.ncbi.nlm.nih.gov/articles/PMC8502181/ | 「不能拿來估計發生率」是推論：作者說的是「需要更大的前瞻研究才能提供發生率」。可改寫法（Optional） |
| 21 | Josephsen 2007：追蹤室內與戶外抱石者一年；戶外抱石手指受傷風險較高；傳統預防措施大致無效 | Confirmed | 摘要（NCBI efetch PMID 18076293）；https://pubmed.ncbi.nlm.nih.gov/18076293/ | 摘要也寫「室內與戶外差異很小」「幫人 spot 很少造成受傷」，跟本篇的 spot 段落直接相關，可補（Optional）。摘要沒有給樣本數；系列規格要求寫樣本數，要查全文才能補 |
| 22 | 「兩種情境不同：前者適合不高、落地平的題目，後者是在人還沒站穩時就扶正」 | Unverifiable（作者的調和） | 兩份來源都沒有這樣區分 | 系列規格寫「矛盾並列不選邊」；這句請標成作者推論，或刪掉 |

## post-review

- `pnpm check:references`（在 worktree 跑）：
  - zh：沒有 ERROR；1 個 WARN「參考資料和標題/主要段落缺少明顯關鍵詞重疊」。這是把中文標題拿去比對英文來源標題的 heuristic 誤報，參考資料本身已經涵蓋主題，不用處理。
  - en：2 個 ERROR，連到 `/posts/climbing/2026-10-19-taiwan-bouldering-areas-en` 和 `/posts/climbing/2026-10-19-highball-bouldering-risk-en`，因為這兩篇的英文版還沒寫。同一批其他篇也有同樣的 ERROR。要等姊妹篇的 `-en` 寫好才會消失；如果本篇要先 push，就要暫時改連 zh 版或拿掉連結。
- Frontmatter：必填欄位齊全；`type: guide`、`series {戶外抱石, 0}` 與 `src/utils/series.ts` 的 `outdoor-bouldering` 一致；tags 三個；glossary 4 條。glossary「spot」的 aliases 有「保護」，這個詞在繩攀也是 protection 的意思，可能讓詞彙表配錯。可選擇拿掉。
- tldr：約 150 字，涵蓋落地區、spot、證據薄弱三個重點。合格。
- 範圍卡對照：落地差異、墊子結構、租借價目、鋪墊步驟、疊墊兩派、只有兩張墊、spot 的目的、出手時機兩派、手勢、站位、身材差、何時不 spot、講好移墊、AAC 1986／2025、瑞典 9 人、Josephsen、清單、系列地圖、練習題 4 題（含範圍卡指定那題）都有寫到。Müller 2022（36.7%）和法國 2025（85%）的數字沒放進來，改連〈抱石墜落與腳踝受傷〉。這跟範圍卡「並列」的寫法不同，但不重複寫是合理的；可以考慮各留一句帶數字和「岩館樣本」。
- 使用者決定：
  - #5 傷害資料很薄：有明講（研究段第一句、瑞典 9 人、「沒有研究證明照做就不會受傷」）✅
  - #4 選購留在本篇：✅
  - #2 台灣區域、#3 高抱石：本篇沒有涉及；AAC 2025 那段已標明「高抱石，第 3 篇再談」，沒有越界 ✅
- 證據等級標示：每節都有 ✅。「今晚／下次出門前能做的動作」每節都有 ✅。練習題用 `<details>` ✅。
- 站內連結：zh 版連到的 6 篇都存在。

## post-polish

- 來源當主詞：「Climbing 雜誌」出現 16 次，多半在句首（「Climbing 雜誌說」「Climbing 雜誌提醒」）。spot 小節（怎麼站、什麼時候不需要）可以先講動作，把來源放進括號，跟「站姿」那條（Gripped、Climbing）同一種寫法。
- 長句（超過 70 字）：
  - 原岩那句：三個規則加三個價格擠在一句。拆成「規則」一句、「價目」一句。
  - 「Climbing 雜誌說，戶外『幾乎都值得 spot』，特別是……或做動態動作可能飛出墊子時。」可以改成條列。
  - Josephsen 那句：結論和「摘要也寫」拆成兩句。
  - 練習題 4 的答案：兩派各寫一句。
- 數字密度：原岩價目、捷運 165／220 集中在同一節，可以接受；價目建議改成「首日 300，之後遞減到每天 100」，完整價目留給連結。
- 後設句：「這一段要先講清楚：」「這件事來源之間意見不同，兩邊都列出來：」。可以直接進入內容（例如「大部分抱石傷害研究的對象是……」）。
- 「spot（保護）」：開頭第一次出現時附中文是對的，但「保護」容易跟繩攀的 protection 混淆。建議改成「spot（在下面護著攀爬者）」。

## EN parity

- 標題層級 15 個一一對應；段落、清單、練習題、參考資料都齊全。
- 抽查事實：300／200／100、165／220、1992、九位、2–3 m、腓骨、25 呎／15 呎、五張墊，數字都一致。
- EN 有同樣的 Gripped 歸派錯誤（第 94 行「Gripped adds that the more layers…」、第 205 行「Kehl and Gripped say…」）。zh 一起修。
- EN 也有「lands more evenly」（第 63 行），同 Verify #16。
- EN 連到 `taiwan-bouldering-areas-en`、`highball-bouldering-risk-en`，目前不存在（見 Review）。

## Must fix

1. **疊墊兩派：Gripped 歸派錯誤（zh）**
   - find：`讓露出來的邊越少越好。Gripped 也說，墊子疊越多層越不穩，縫也越深。`
   - replace：`讓露出來的邊越少越好。`
   - 並在兩派清單後面加一條：`- **石頭高就疊，但更要顧縫。** Gripped 建議石頭越高，即使地面平，也可以把落地區疊到兩三張墊的厚度；但它也提醒，疊越多層越不穩，墊子之間的縫也越深，前面講的落地區、整平、不留縫都要更小心。`
   - 「兩派說法」的標題可以改成「三種說法」，或保留「兩派」，在新增那條前面加一句「Gripped 介於兩者之間：」。
2. **練習題 4 答案（zh）**
   - find：`Kehl 和 Gripped 則認為踩到墊子邊緣是常見的扭傷原因，疊越多越不穩、縫越深。`
   - replace：`Kehl 認為踩到墊子邊緣是常見的扭傷原因，所以平鋪不疊；Gripped 則說石頭高時可以疊兩三層，但疊越多越不穩、縫越深。`
3. **EN 同步**
   - find：`If you must stack, fit them like a jigsaw to leave as few exposed edges as possible. Gripped adds that the more layers you add, the less stable the landing and the deeper the gaps.`
   - replace：`If you must stack, fit them like a jigsaw to leave as few exposed edges as possible.`，並加一條：`- **Stack for height, but mind the gaps.** Gripped suggests that on higher boulders you may want a landing two or three pads deep even on flat ground, while warning that every added layer costs stability and deepens the gaps between pads.`
   - find：`Kehl and Gripped say landing on a pad edge is a common cause of sprains, and more layers mean less stability and deeper gaps.`
   - replace：`Kehl says landing on a pad edge is a common cause of sprains, so he lays pads flat; Gripped says stacking two or three deep can make sense on higher boulders, but more layers mean less stability and deeper gaps.`
4. **沒有來源的「落地比較均勻」（zh + en）**
   - zh find：`沒有折線的墊子整塊泡棉連在一起，落地比較均勻，背的時候要把整塊彎起來。` → replace：`沒有折線的墊子整塊泡棉連在一起，少了折線那條弱點，背的時候要把整塊彎起來。`
   - en find：`A pad without a hinge is one continuous slab of foam, lands more evenly, and has to be bent to carry.` → replace：`A pad without a hinge is one continuous slab of foam with no hinge to act as a weak point, and has to be bent to carry.`
5. **出手時機「兩種情境不同」是作者自己的調和（zh + en 對應句）**：刪掉這句，或改成「兩份來源沒有說明各自適用的情境；本文推測前者比較適合不高、落地平的題目。」，符合「矛盾並列不選邊」。
6. **EN 斷連結（發布順序）**：`2026-10-19-taiwan-bouldering-areas-en`、`2026-10-19-highball-bouldering-risk-en` 寫好之前，`check:references` 會報 ERROR。如果本篇要先 push，就暫時改連 zh 版（`/posts/climbing/2026-10-19-taiwan-bouldering-areas`、`/posts/climbing/2026-10-19-highball-bouldering-risk`）。

## Optional

- 瑞典研究：「不能拿來估計發生率」→「作者說要更大的前瞻研究才能估計發生率」（en：`it can't estimate how often injuries happen` → `the authors say larger prospective studies are needed to estimate incidence`）。
- Josephsen 摘要再補兩點：室內與戶外抱石者「差異很小」，以及「幫人 spot 很少造成受傷」；有全文的話再補樣本數（系列規格要求寫樣本數）。
- 各留一句 Müller 2022（腳踝 36.7%）和法國 2025（85% 非自願墜落），標明是岩館或混合樣本，細節連到〈抱石墜落與腳踝受傷〉。
- Kehl 那篇的參考資料網址改成轉址後的 `https://www.climbing.com/skills/how-to-highball-boulder/`。
- AAC 2025 補題名 *See Spot Run*（V6），並註明事故發生在 2024 年 1 月。
- 原岩出租的墊子最大約 121 × 100 cm，在捷運 165 cm 的限制內，可以補一句。
- CWA 那段補一句「這篇談的是岩館 spot」。
- glossary「spot」的 aliases 拿掉「保護」；內文第一次出現改成「spot（在下面護著攀爬者）」。
- Polish 段列出的長句拆分、來源當主詞、後設句。

## Fixes applied (2026-10-19)

已修（zh + en 同步）：
- Must fix 1–3：Gripped 移出「平鋪」派，新增第三條「石頭高就疊，但更要顧縫」／"Stack for height, but mind the gaps"；小節標題改「三種說法」／"Three views"，引言、「三種說法都同意」、description 一併改；練習題 4 答案改為三方各寫一句。
- Must fix 4：「落地比較均勻」／"lands more evenly" 改成「少了折線那條弱點」／"no hinge to act as a weak point"。
- Must fix 5：出手時機的調和句改成「兩份來源沒有說明各自適用的情境；本文推測……」（明標推測）。
- Optional：瑞典研究改成「要更大的前瞻研究才能估計發生率」；Kehl 文章網址改為轉址後的 `/skills/how-to-highball-boulder/`（內文與參考資料兩處）；glossary spot aliases 拿掉「保護」，首次出現改「spot（在下面護著攀爬者）」；刪掉「這件事來源之間意見不同，兩邊都列出來」的後設句寫法。

未修：
- Must fix 6（EN 斷連結）：保留 `taiwan-bouldering-areas-en`、`highball-bouldering-risk-en` 連結，因為其他 agent 正在寫這兩篇的 -en 版，完成後連結即有效。
- Optional 未做：Josephsen 補「差異很小／spot 很少致傷」與樣本數、Müller 2022／法國 2025 數字、AAC 2025 題名與事故日期、原岩墊子尺寸、CWA 岩館註記、Polish 長句與來源主詞改寫——這些需要重新打開來源核對或屬較大改寫，本輪未開來源，依「不加未親自打開來源的主張」原則暫不加。
