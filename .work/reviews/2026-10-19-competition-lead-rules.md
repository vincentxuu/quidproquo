# 審稿紀錄：2026-10-19-competition-lead-rules（中英共用）

日期：2026-10-19。審稿：K-rev-a（獨立審稿，非作者）。工具：World Climbing Competition Rules v3、Event Regulations v3（2026-01）PDF curl＋pdftotext 全文比對（含名詞解釋與註腳）；worldclimbing.com/lead/index 以 curl 抓全文。Groundlane 未使用（前序 agent 回報 401）。

## post-verify

| Verdict | 數量 |
|---|---|
| 🟢 Confirmed | 23 |
| 🔴 Contradicted | 1 |
| 🔵 Misframed | 2 |
| 🟡 Unverifiable | 1 |

🟢 Confirmed（條號逐一對過）
- 附件 A 表 1：資格賽 2 條 Flash、準決賽／決賽 1 條 On-Sight、皆 6'；準決賽 24、決賽 8。
- 附件 A §4.7 flash 示範至少開賽前 60 分鐘（影片或現場）；§4.8 on-sight 集體看線 6 分鐘；§4.2 回暖身區隔離。
- 競賽規則 §6.1 單次計分嘗試；§8.3 扣終點完攀；§9.1 最後控制的計分點（establishing／advancing）、advancing 加「+」；§9.2 §8.2 情形不給「+」；§8.2 三種先鋒失敗（扣錯順序、拆快扣除修正 z-clip、越過 Last Safe Position）。
- 附件 A §5.1 定線長計分圖；§7.1 單線排名；§7.2 QP 幾何平均、小數三位、fractional ranking；註 23 只爬一條＝另一條並列最後；§7.3 回溯（分組不適用）→ 僅獎牌輪比時間；註 24 時間捨去到秒、完攀算到扣門關上、未完攀算到掉落。
- QP 算例（4.000／4.000／4.243）與練習題 1–4 重算正確；練習題 1「碰到未控制＝前一點 +」符合 §9.1B 與註 24（Advancing Movement）。
- lead/index 頁：15 m 牆、6 分鐘、「+」、集體看線 6 分鐘、資格賽無看線。

🔴 Contradicted（已改）
- 「+」表 A 列：「抓到第 30 顆，還沒穩住就掉 → 29」。依 §9.1B，從第 29 顆朝第 30 顆做出推進動作就是 29+；而且本篇練習題 1 對選手 I 的判法（碰到 36 沒控制 → 35+）與此列互相矛盾。改為 29+，並補一句「碰到但沒控制不算第 30 顆」。排名 D ＞ C ＞ B ＞ A 不變。

🔵 Misframed（已改）
- glossary「最後安全位置」定義為「路線上最後一個還能把繩子扣進快扣的位置」，alias 列 last clipping position：規則把 Last Clipping Position 與 Last Safe Position 分成兩個名詞。Last Safe Position＝控制住標示 Safety Hold 但對應快扣未扣、或裁判認為再往上不安全的點。改寫定義、刪 alias；正文 §8.2 第 3 點同步改寫。
- 「第三種最常見」：無統計來源 → 改為「在轉播上最容易看懂」。

🟡 Unverifiable → 補充
- 「每次嘗試只有一次機會，不能重來」：§6.2 有技術事故（名詞解釋 A：broken or loose hold）可重爬的例外 → 補上。

本次只檢查了文中已提出的約 27 條宣告，未評估文章對主題的覆蓋是否完整。

## post-review

- 機械檢查：`check:tw` 0 blocking；phrase ledger 0 命中；`check:references` 中文版無錯誤；英文版唯一錯誤是第 3 篇 `-en` 尚未建立。
- 站內連結：第 1、3 篇（本系列）與〈岩館先鋒〉（main 已存在）。
- tldr 與正文一致（6 分鐘、「+」、幾何平均、回溯→時間）。glossary 改完與正文用語一致。
- 結構：三輪表 → 成績 → 「+」→ 不給「+」→ 排名 → 轉播 → 練習題，guide 型完整。

## post-polish

- 長句、但書、數字密度皆在綠區；QP 公式與算例已收在 `<details>`。
- 只做與事實修正連動的句子改寫，未另做風格改動。

## 已修正

1. 「+」表 A 列 29 → 29+，補說明句。
2. glossary「最後安全位置」依規則名詞解釋重寫，刪 last clipping position alias。
3. §8.2 第 3 點改寫成規則定義；「最常見」改為「在轉播上最容易看懂」。
4. 一次機會段補 §6.2 技術事故重爬例外。
5. 新增英文版 `2026-10-19-competition-lead-rules-en.md`。
