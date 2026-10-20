# 審稿紀錄：2026-10-17-building-anchors（zh + en）

日期：2026-10-17。來源原文快照同 `/private/tmp/claude-501/-Users-xiaoxu-Projects-quidproquo/eefceeef-ad9b-4e77-b0f9-6d606c5f451b/scratchpad/agent-trad/`（Petzl 頁面以 curl 取得完整 HTML）。

## post-verify

腳本字串比對全部命中：
- 🟢 TOCC 龍洞大事紀 2019/05/16 #313 通道：三人繩隊、傳攀固定點三個保護支點、兩人轉移體重時全數脫出、原因不明、約 20 m、永久性傷害、龍洞第一起多傷患重大意外。
- 🟢 Petzl Forces at work in a real fall：80 kg／80 kg、GRIGRI 2、FF 0.3／0.7／1 三組數字（2.5/1.5/4、3/2/5、4/2/6 kN）、±0.3 kN、small wire critical、first point after the belay must be solid。
- 🟢 Petzl fall factor theory：0–2、4/10＝0.4、4/2＝2、實際墜落係數＝有效繩長。
- 🟢 Petzl belay anchor：≥2 點、傳攀部分概念不適用、先鋒墜落負荷最大且起步更大、轉向點超載（滑輪效應）、Quad 優缺點與兩股扣法、180 cm 扁帶、半向均分要扭一圈、單向均分無衝擊但側拉分攤差、90° 上限、靜態體重不會讓可靠固定點失效。
- 🟢 AAI：SERENE／ERNEST 定義、「basically equivalent」、Magic X 要限位結。起源（RENE→SRENE→SERENE）只有已刪頁摘要 → 未寫入。
- 🟢 Arenz：傳攀固定點 ≥3 點、魔法剪刀、60–90°、cordelette 流程、八字結限制延伸、撥弦檢查、15 分鐘（未用）。
- 🟢 Delap 2020：均分實驗室也難達成、轉向 distribution of force、初學者至少 3 點。
- 🟢 BD sling QC：48" 扁帶三種接法、Sliding X 拉不斷、有結 >20 kN、降 40–60%、每種一個樣本、不評論延伸／衝擊／均分（文中明確標出，未 overclaim）。
- 🟢 艾格（E.A.R.N.E.S.T.、事先／自我均力、兩天 14 小時）、百合搖滾（SERENE、墜落衝擊力試算）。
- 修正（已改）：刪除無來源的「確保者受力較小是因位移吸收」；「頂端點約為兩邊總和」改寫為數據上相加＋Petzl「滑輪效應」；檢查清單第 5 點原誤把 Arenz 的「第一顆放 cam」挪用到固定點，改成 Petzl 對 Quad 方向性的說法；「盡快放第一個保護點」改為 Petzl 的「第一個點一定要牢」；練習用扁帶長度改為 Petzl 的 180 cm；Delap 頭銜未在頁面確認，刪除「美國嚮導」。
- 🔵 注意：Petzl「靜態體重不會讓可靠固定點失效」出自 bolted 確保站教學；文中只用來對照 #313 的時點，未推論事故原因。cordelette 與 Petzl「單向均分」的對照以「我的理解是」標為作者推論（全篇唯一一處）。
- 未用 `$…$`，公式放 `<details>`，故未設 `math: true`。
- 本次只檢查了文中已提出的宣告，未評估文章對主題的覆蓋是否完整。

## post-review

- 機械檢查：`check:tw` 0；`check:references` zh 版原有「參考資料關鍵詞重疊」WARN，已在 Petzl 條目補「（含 Quad）」等中文標籤後消除；剩下的 ERROR 只有連到尚未存在的 sibling（sport-to-trad-learning-path、multi-pitch-basics-en）。`check:links` 無壞連結；`check-process-leak` 通過。
- frontmatter：tags 5 個既有 tag；series order 8；tldr 含 4／2／6 kN 與 #313，和正文一致。
- 結構（困難篇）：情境（#313）→ 直覺（三關＋口訣表）→ 機制（墜落係數、Petzl 實測，公式與滑輪解釋折疊）→ 回到實作（Quad／cordelette／打結強度）→ 檢查別人的固定點（讀者成果）→ 往深處學 → 練習題 4 題＋nobodyclimb trad-anchor。範圍卡全覆蓋。
- 已修：en 版中文資源標 (in Mandarin)；TOCC 英文全名頁面上查不到，改為「TOCC（臺灣戶外攀岩協會）」。

## post-polish

- register-scan：長句原 3 句（Arenz、Delap、課程段）已斷句，現為 0；但書 9%；模板化轉折原 1 處（「看的不是…而是…」）已改；phrase ledger 0 命中。
- 數字密度 ≥4 的段落：開場事故（日期、路線號、20 m，保留）與 `<details>` 內公式例（附錄，不受閾值限制）。
- 每節有「今晚就能做的動作」；#313 段落未加入任何原因推測。
