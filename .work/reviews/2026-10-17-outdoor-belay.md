# Review: 2026-10-17-outdoor-belay（中英共用）

日期：2026-10-17。文章：`src/content/posts/climbing/2026-10-17-outdoor-belay.md`、`-en.md`。系列〈運動攀登與傳統攀登〉order 1。

## post-verify

逐條對照本 session 打開的原文（Jina 存檔於 scratchpad/agent-belay/，Petzl 頁以 Playwright 讀取）。共抽 24 條宣告。

- 🟢 AAC Lowering（Poborsky）：下放事故一半以上是繩尾穿出確保器；固定點 >30 m 增多、有些需 70 m 繩；起攀岩階情境；地上剩 10–15 ft 要有備案；確保者站太遠被拉失衡；口令加名字；「up rope」取代「take」；確保者以為垂降而放開確保；確保者暫時後退看頂端；體重差大時確保者 clove hitch 到地錨；三重單結或確保者綁繩尾。
- 🟢 AAC KTR Belaying：第一個保護點正下方、跨出墜落線約 10 度；繩堆在制動手側；繩尾打結封閉系統。
- 🟢 AAC Prescription 2021-08／事故報告：兩起運攀岩場落石砸確保者；「torso-size」、昏迷、右臂兩處骨折、顱內出血、借戴頭盔；第二起傷右腿；編輯指出確保者「arguably much more likely」被打到；兩起都用 ABD。
- 🟢 AAC Cleaning Sport Routes：拖過大石、灌木、撞樹的開場畫面。
- 🟢 AAC Gym to Crag：影片 7 主題（頭盔、落石、approach、確保地面不平、接更大墜落）。
- 🟢 Climbing 5 tips：「incorrect procedures bred from the gym」；除非窄岩階或體重差大，不建議單繩距錨定確保者，保持移動可閃落石。
- 🟢 Petzl Rope too short：岩場一律繩尾打結；帶長 5 m 的繩。Petzl rope length：最多縮 10%、兩半不對稱。Petzl GRIGRI 地錨：1–2 m、強烈不建議 GRIGRI 直接掛地錨的兩個理由、僅限上攀。Petzl Communication：坐繩下放前仍連著固定點。
- 🟢 東管處龍洞頁：10–3 月東北季風長浪，請勿前往海邊。TOCC 上方固定點：盡可能雙繩垂降、避免下放。TOCC 大事紀：2019 兩起重大意外皆船艇接駁送醫。
- 🔵→已修：glossary「封閉系統」原寫「下放事故一半以上只要封閉系統就能避免」，原文是「一半以上是繩尾穿出，其中 most 可藉封閉系統避免」。中英 glossary 已改成兩段式。
- 🔵→已修：「確保者被落石打到的機會其實更高」原文是編輯 arguably 的看法，改成「編輯的看法是…恐怕更高」。
- 🟡→已刪：「岩館的牆十幾公尺」無來源，改為「在岩館，兩人通常看得到彼此」。
- 推論句（作者推導，非來源原句）：練習題 3「下放需要路線長度兩倍繩長」由 AAC「路線短於半條繩時地面封閉系統」推得，保留。
- 未寫入（查不到一手來源）：龍洞求救電話、繩索拉扯訊號（rope tug）、DAV 1.5 倍體重差（本 session 未重開 DAV 文件，只以站內連結帶過）。

本次只檢查了文中已提出的宣告，未評估文章對主題的覆蓋是否完整（覆蓋交 post-review）。

## post-review

- 機械檢查：`pnpm check:tw` 0 blocking（1 WARN「頭部」為解剖語境，保留）；`check:references` 只剩 sibling slug 尚未存在的錯誤（overview／first-outdoor-sport-lead／lower-or-rappel 的 -en 等），屬預期；`check:links` 21 條外部連結 0 壞；`process-leak` 通過；mermaid 圖語法經 Mermaid Chart 驗證 valid。`pnpm verify` 失敗項為全站既有問題（他人文章的 post-quality、sibling 連結、缺審稿紀錄），本篇在補上本檔後不再列名。
- frontmatter：tags 5 個皆既有；tldr 有具體名詞與 AAC 數字；description 與 tldr 不重複；series order 1、中英系列名正確。
- 範圍卡覆蓋：站位 ✅、落石與頭盔 ✅、地形與體重差 ✅、繩長與繩尾結 ✅、溝通距離與風浪聲 ✅；不講先鋒確保細節，改連 order 2 ✅；「讀完能做一次完整上攀確保前檢查」→ 有檢查清單圖 ✅。
- 已修：inline 來源缺口三處（「繩長」節的 Poborsky 數字、「溝通」節的三類分法、「地形」節回指「上面那篇 Climbing 文章」）補上 inline 連結，跨節指代改成「開頭提到的 [Climbing 文章]」。
- 已修：英文版連結文字對齊 sibling 實際標題（Learning to Lead at the Gym）。
- 台灣讀者位置：有獨立「在龍洞要多想的事」一節（海浪、TOCC 垂降建議、救援靠船艇）。
- 練習題 5 題、`<details>`、nobodyclimb sport-belay 連結 ✅；每節都有「今晚就能做的動作」（龍洞節為 post-polish 後補）。

## post-polish

- 第一輪 register-scan：長句 12 句 → 分兩輪斷句後 0 句；但書密度 4%；引述 0；姓名當主詞 0；模板化轉折 0；數字密度 1 段（繩長清單第 4 點）→ 把「10–15 英尺（約 3–4.5 公尺）」與「一兩呎」精簡成單一公制數字後解除。
- 可執行動作：龍洞一節原本沒有動作，補「先讀 TOCC 上方固定點頁、認得羊角／垂降環／梅隆鎖、跟夥伴講好下降方式」。
- 保護片段（數字、引號、連結）回讀未變；改後重跑 check:tw、check:references、process-leak 皆同前。
