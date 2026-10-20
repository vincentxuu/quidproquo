# 審稿紀錄：2026-10-19-kids-adaptive-climbing（中英共用）

日期：2026-10-19。審稿者：rev-a（獨立審稿，未參與撰寫）。對象：zh-TW 正文。審稿時 worktree 裡**還沒有 `-en` 版**；英文版寫好後，下面每條待修都要一併套用。本紀錄只列問題，未改文章。

工具：Groundlane MCP `web_fetch`（Adaptive Climbing Group、山協賽事頁）；其餘用 Jina reader（中途遇到 429 限流，改成逐一抓取）；BMC 吊帶指南 PDF 用 curl 下載後跑 `pdftotext`。toolDegradation：Groundlane → Jina reader／curl（為了批次抓取與 grep）。原始擷取存於 scratchpad `M/rev-a/dl/`。

## post-verify

🟢 Confirmed（逐一打開原文）
- 原岩中和店幼兒課（/367）：4–6 歲、每班最多 4 人、一期 6 堂 3,000 元、每堂約 1 小時、提供岩鞋／吊帶／岩盔、可單堂試上（600 元）；內容是「遊戲融入體能、協調活動與攀岩教學穿插」。
- 原岩兒童上攀課（/370）：7–12 歲、最多 4 人、6 堂 4,000 元、每堂約 1.5 小時；腳法、手點抓法、教練依程度出路線；試上 800 元。
- 原岩〈安全守則〉：未滿 18 歲本人與法定代理人共同簽署、要有成年人陪同；12 歲以下監護人隨時留意；未滿 12 歲上攀戴岩盔；未滿 16 歲不得確保，16 歲以上未成年人在監護人監督下可確保。
- 原岩價目表（/pricing/83）：「若無現場教練許可，18歲以下者不得為他人進行確保」。兩份文件寬嚴不同，文中已並列 ✅。
- EN 12277（Edelrid 摘要）：Type A Komplettgurt、Type B Kleinkörpergurt「für Personen bis zu einem Gewicht von 40 kg」、Type C Sitzgurt、Type D 不得單獨使用。
- BMC 吊帶指南：兒童全身式吊帶「tested for a maximum user weight of 40 kg」；重心較高、沒有明顯腰線；換成坐式「depends on many factors including their level of performance」；兒童對先鋒墜落的受傷耐受度「has not been clearly established」，建議謹慎。
- DAV 2025：墜落練習碰撞案例 80 kg 撞上 69 kg 確保者，「Schlüsselbeinbruch samt Bänderrissen」、「unklare Kommunikation」、沒有用平衡體重差的器材；建議檢查 Team-Setup、講清楚體重差，並使用 Bremsassistenten。
- Schöffl 2025（PMC11848689）：單一中心前瞻監測，2017–2020 年就診的未滿 18 歲攀岩者；PPSI 占全部傷害 45.3%。
- Paradox Sports ACI：「two day course」，主辦場地包括 commercial gyms、universities、rec centers，參加者包括 guides、students。
- Adaptive Climbing Group：創辦人 Kareemah Batts 因癌症截肢；2012-03-15 在布魯克林辦第一場 clinic，38 人；室內、戶外、青少年課程；free／discounted／donation-based。
- NICAS Climbing for All：一日課程、開了 20 多年、理論和實作各半、以 Social Model of Disability 為出發點。
- World Climbing〈Get to Know Para Climbing〉：B1–3、AL1–2、AU2–3、RP1–3；數字越小障礙越高；B1 戴眼罩，引導員用無線電；比賽都是上方確保，不用掛快扣。
- IPC 2025-06-03：帕拉攀岩在 LA28 首度登場，8 個比賽項目（男女各 4）。
- 台灣新聞聯播網：國體大邀小林幸一郎（Monkey Magic 創辦人）11/30 來台；12/1 與展翼視障天使協力車協會在 Camp 4 北投運動中心館辦活動。
- 愛盲基金會（廣慈中心）室內攀岩體驗；台灣盲人重建院南部服務中心 2/16 柴山攀岩、垂降與登山。
- 行政院 115-09-03：通過「國民體育法」修正草案，法名改為「國民運動法」，新增「適應運動」專章，「保障身心障礙及特殊需求者平權參與運動」，送立法院審議。
- 站內連結：〈岩館上攀確保〉有「體重差」一節；〈青少年攀岩與手指生長板〉、〈力量、肩與 campus board〉都存在，也有對應內容。

🔴／🟠 修正（列入待修清單）
- 🔴 山協賽事頁（ctaa.j91.me/race/502）是「2026 全國抱石運動攀登錦標賽」，第 10 條寫「比賽組別：男子甲組、女子甲組」，**沒有青年組**；文中寫「只有男女組和青年組」與原文不符。
- 🟠 Schöffl 2025 的「高峰在 13 到 15 歲」不是這篇研究自己的發現，是討論段引述文獻（「PPSIs typically present… around 13–15 years of age」，引文 35 40 45 54 55）；這篇研究的樣本平均 15.1 歲。另外，這間門診是攀岩傷害的轉診中心（「serves as a national and international referral centre」），作者自己承認有 selection bias。文中只寫「一家醫院」，沒交代這兩點。
- 🟠 Paradox：「上過課的岩館之後會自己辦固定的適應性攀岩之夜或社團」是把目標寫成事實。原文是「our course is a launching point to creating an adaptive climbing club」，也說他們「currently working to put together more thorough resources for gyms who… want to launch an ongoing program」。
- 🟠 DAV 建議的 Bremsassistent 是掛在第一個快扣、用來增加摩擦的器材（Ohm、Zorro 等），不是「輔助制動的確保器」。這個詞會讓讀者以為是 GriGri 那類器材。
- 🔵 World Climbing 自己說「three categories; visually impaired, limb deficiency, and limited power or mobility」，AL／AU 同屬肢體缺損。文中與 glossary 寫成「四大類／四類」。
- 🔵 「攀岩視界」：活動日期是 12/1，不是 11 月底；結論是「以時鐘方向**或身體某部位相對位置**表示下一個攀爬點最為合適」，文中只留了時鐘方向。

🟡 Unverifiable（列為建議修）
- 「沒有任何攀岩組織規定最低年齡」（tldr、正文、練習題 1）：全稱否定，研究筆記的說法是「No governing body sets a minimum age」，沒有附來源。建議改成「我們沒找到」的說法。
- 「這也是很多岩館限制未成年人確保的原因」：因果關係沒有來源。
- 「第一次上攀體驗通常由教練確保」：沒有來源，屬常識性描述，可保留。
- tldr「7–12 歲才上繩」：幼兒課頁沒說不上繩，只說「攀岩教學穿插」「視進度增加攀岩比例」。

本次只檢查了文中已提出的約 40 條宣告，沒有評估文章對主題的覆蓋是否完整。

## post-review

- 機械檢查：`check:tw` 0／0；`check:references` **1 個 ERROR**：第 29 行 `> 🌏 [English version](/posts/climbing/2026-10-19-kids-adaptive-climbing-en)` 指向不存在的文章；`check:links` 16 條無壞鏈（NICAS 回 403，是擋機器人，Jina 可讀）。
- frontmatter：tags 4 個（climbing, indoor-climbing, taiwan, beginner），都是既有 tag ✅；type guide ✅；glossary 3 條，其中「帕拉攀岩」的「四類」要改（待修 6）。
- 範圍卡（order 1）：原岩 4–6／7–12 ✅、EN 12277 ✅、體重差 ✅、生長板只摘要並連結 ✅、campus 只連結 ✅、Paradox／ACG／Climbing for All ✅、台灣視障體驗 ✅、全國賽無帕拉組 ✅（但組別寫錯）、國民運動法草案 ✅、帕拉分級與 LA28 ✅、帕拉規則純文字提及「攀岩賽事」系列 ✅；例子（家長問三件事）✅；自我檢查題（14 歲手指背側痛）✅。
- 範圍卡缺口：「青年賽分組只一句帶過」沒有寫到（目前唯一提到的「青年組」還是錯的）。研究筆記 S54–S57 有 World Climbing U17／U19 與 USAC U11 起跳的資料，我沒有打開，所以不提供替換文字，列為 🟢 可選（待修 12）。
- 銜接：開頭說「替一個比你輕很多……的人確保，責任又多了一層」，但〈岩館上攀確保〉的體重差一節講的是「攀爬者不超過確保者 1.5 倍」，方向相反。「已經講過」要說準一點（待修 11）。

## post-polish

- 長句 7 句（> 60 字）／69 段，可接受；但書 1%；姓名當主詞 0；引述 0。
- 數字密度：Schöffl 段 7 個數字（年份、45.3%、年齡）。照待修 2 改寫後，年齡會移到文獻背景句，剩下的數字是主張本身，保留。
- 模板化轉折 1 處（「不是成人常見的滑車受傷，而是手指的生長板」）；這句有內容，同篇只出現一次，保留。
- 每節都有「今晚就能做的事」✅。

## 待修清單

1. 🔴 全國錦標賽組別寫錯。來源：https://ctaa.j91.me/race/502 第 10 條。
   - 原文：「- 中華民國山岳協會辦的[全國錦標賽](https://ctaa.j91.me/race/502)只有男女組和青年組，沒有帕拉組。」
   - 改為：「- 中華民國山岳協會 2026 年的[全國抱石錦標賽](https://ctaa.j91.me/race/502)只分男子甲組和女子甲組，沒有帕拉組。」
   - 參考資料原文「[中華民國山岳協會全國錦標賽賽事頁]」→「[中華民國山岳協會 2026 全國抱石運動攀登錦標賽賽事頁]」
2. 🔴 English version 連結指向不存在的文章（第 29 行）。修法：merge 前補上 `2026-10-19-kids-adaptive-climbing-en.md`（系列規格要求中英同步）；如果來不及，就先刪掉第 29 行 `> 🌏 [English version](/posts/climbing/2026-10-19-kids-adaptive-climbing-en)`，英文版上線時再加回。最後跑 `pnpm check:references`。
3. 🟠 Schöffl 2025 的框架。來源：https://pmc.ncbi.nlm.nih.gov/articles/PMC11848689/（Methods 與 Discussion「Injury types」）。
   - 原文：「[Schöffl 等人 2025 年的前瞻研究](…)追蹤了一家醫院 2017 到 2020 年的 18 歲以下攀岩者，手指生長板周圍的壓力性傷害占了所有傷害的 45.3%，高峰在 13 到 15 歲。」
   - 改為：「[Schöffl 等人 2025 年的前瞻研究](https://pmc.ncbi.nlm.nih.gov/articles/PMC11848689/)追蹤了 2017 到 2020 年到德國一間攀岩傷害轉診門診就醫的 18 歲以下攀岩者，手指生長板周圍的壓力性傷害占了所有傷害的 45.3%。這間門診專收攀岩傷害，作者也承認比例因此偏高。文獻上，這類傷害好發在 13 到 15 歲的生長加速期。」
   - 練習題 3 答案原文：「Schöffl 等人 2025 年的研究裡，這類傷害占 18 歲以下攀岩傷害的 45.3%，高峰在 13 到 15 歲。」→ 改為：「在一間攀岩傷害轉診門診的研究裡，這類傷害占 18 歲以下個案的 45.3%，而且好發在 13 到 15 歲。」
   - 「今晚就能做的事」的「如果你的孩子在 13 到 15 歲之間」保留（有文獻支持）。
4. 🟠 Paradox 把目標寫成事實。來源：https://www.paradoxsports.org/adaptive-climbing-initiative/（FAQ）。
   - 原文：「上過課的岩館之後會自己辦固定的適應性攀岩之夜或社團。」
   - 改為：「課程的目標是讓主辦的岩館之後能自己成立適應性攀岩社團，辦固定的活動。」
5. 🟠 Bremsassistent 譯錯。來源：DAV 2025 統計頁，以及 https://www.alpenverein.de/artikel/sicherheitsforschung-bremsassistenten_d5f1dc70-b631-44e3-ad88-49230302a879（「Geräten, die im Seilverlauf an der ersten Exe angebracht werden, um den Gewichtsunterschied… auszugleichen」）。
   - 原文：「體重差大的組合可以用輔助制動的確保器。」
   - 改為：「體重差大的組合，可以在第一個快扣加掛平衡體重差的增阻器材（DAV 稱為 Bremsassistent）。」
   - 同節「今晚就能做的事」的「問現場人員有沒有平衡體重差的器材」可保留。
6. 🟡 帕拉分級「四大類」。來源：https://www.worldclimbing.com/news/get-to-know-para-climbing（「three categories」）。
   - 正文原文：「把選手分成四大類：」→ 改為：「把選手分成三大類、四組代碼（肢體障礙再分下肢 AL 和上肢 AU）：」
   - glossary「帕拉攀岩」context 原文：「World Climbing 的分級有視障 B、下肢 AL、上肢 AU、肌力與關節活動度 RP 四類。」→ 改為：「World Climbing 的分級代碼有視障 B、下肢 AL、上肢 AU、肌力與關節活動度 RP 四組。」
7. 🟡 「攀岩視界」的日期與結論。來源：https://twnewshub.com/archives/60776。
   - 原文：「- 2023 年 11 月底，國立體育大學邀請日本視障攀岩者小林幸一郎（NPO Monkey Magic 創辦人）來台，和展翼視障天使協力車協會在北投的岩館辦了[「攀岩視界」活動](…)。他們發現用時鐘方向報下一個點，對引導最有用。」
   - 改為：「- 2023 年 11 月底，國立體育大學邀請日本視障攀岩者小林幸一郎（NPO Monkey Magic 創辦人）來台，12 月 1 日和展翼視障天使協力車協會在北投的岩館辦了[「攀岩視界」活動](https://twnewshub.com/archives/60776)。志工先矇眼體驗，最後的結論是：用時鐘方向，或相對身體某個部位的位置，來報下一個點最合適。」
8. 🟡 國民運動法草案的名稱。來源：行政院 115-09-03 新聞稿。
   - 正文原文：「行政院 2026 年 9 月 3 日通過的[國民運動法草案](…)」→ 改為：「行政院 2026 年 9 月 3 日通過的[「國民體育法」修正草案](https://www.ey.gov.tw/Page/9277F759E41CCD91/d0eb8192-299e-4522-a74d-23435408aed2)（法名改為「國民運動法」）」
   - glossary「適應性攀岩」context 原文：「出現在 2026 年行政院通過的國民運動法草案。」→ 改為：「出現在行政院 2026 年通過的「國民體育法」修正草案（法名改為「國民運動法」）。」
9. 🟡 「沒有任何組織規定最低年齡」的全稱否定。
   - tldr 原文：「沒有任何組織規定小孩幾歲才能攀岩」→ 改為：「我們沒找到任何攀岩組織規定小孩幾歲才能開始」
   - 正文原文：「沒有任何攀岩組織規定最低年齡。」→ 改為：「我們沒找到任何攀岩組織規定入門的最低年齡。」
   - 練習題 1 答案原文：「沒有任何組織規定最低年齡。」→ 改為：「我們沒找到任何組織規定入門的最低年齡。」
10. 🟡 沒有來源的因果，以及「上繩」的推論。
   - 原文：「這也是很多岩館限制未成年人確保的原因。」→ 改為：「原岩等岩館也限制未成年人替他人確保。」
   - tldr 原文：「4–6 歲排成體能遊戲課、7–12 歲才上繩」→ 改為：「4–6 歲排成以體能遊戲為主的幼兒課、7–12 歲才是上攀課」
   - 練習題 1 答案原文：「7 歲以上才上繩」→ 改為：「7 歲以上才上上攀課」
11. 🟢 體重差的轉手句方向要說準。
   - 原文：「確保技術本身和體重差的處理，〈[岩館上攀確保](…)〉已經講過。」
   - 改為：「確保技術本身，以及攀爬者比確保者重時的上限，〈[岩館上攀確保](/posts/climbing/2026-10-17-gym-top-rope-belay)〉已經講過。」
12. 🟢 範圍卡要求「青年賽分組只一句帶過」，目前沒寫到。可選：先打開研究筆記 S54–S57（World Climbing 2025 年起的 U17／U19 分組、USAC U11 起跳）核實，再補一句，連到「攀岩賽事」系列（純文字）。我沒有打開這些來源，所以不提供替換文字。
13. 🟢 練習題 2 答案可加一句（來源：BMC 吊帶指南「Children's sit-harnesses fill this gap」）：「如果教練判斷可以換坐式，也有專為兒童設計的小尺寸坐式吊帶，不必硬套成人款。」

## 修正紀錄

- 待修 2：英文版同批補齊，連結保留。
- 待修 1、3–11、13：照建議文字改入 zh-TW 原文；練習題 4 的「最有用」同步改成「活動的結論之一」以符合待修 7。
- 待修 12（青年賽分組一句）：未改。審稿者沒有打開 S54–S57，本輪也沒有補查，不寫未查證的分組；留給賽事系列。
- 英文版以修正後的中文翻譯。
