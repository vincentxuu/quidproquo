# 抽取紀錄：Guo、Kim、Rubin 2014，How Video Production Affects Student Engagement: An Empirical Study of MOOC Videos（L@S 2014）

- **書目**：Philip J. Guo（MIT CSAIL／University of Rochester）、Juho Kim（MIT CSAIL）、Rob Rubin（edX）。How Video Production Affects Student Engagement: An Empirical Study of MOOC Videos. *Proceedings of the First ACM Conference on Learning @ Scale (L@S 2014)*，2014 年 3 月 4–5 日，Atlanta，頁 41–50。DOI 10.1145/2556325.2566239（Crossref 2026-10-14 查核：題名、三位作者、頁碼 41–50）。作者全名與單位對過 PDF 首頁。
- **版本**：會議論文定稿（首頁有 ACM 版權聲明與 DOI），10 頁。
- **原文檔**：PDF `.work/video-guide-research/dl/guo.pdf`（1,684,026 位元組，sha256 開頭 834debe260b2ce22）。2026-10-14 從作者研究群網站 https://up.csail.mit.edu/other-pubs/las2014-pguo-engagement.pdf 重新下載，`cmp` 與本機檔位元組相同，確認是作者公開版本。
- **讀的文字檔**：清單列的 `dl/guo.txt` 是 `-layout` 雙欄版（574 行、59,108 字元），沒用。改用不帶 `-layout` 重轉的 `.work/video-guide-research/dl/guo.flow.txt`（828 行、46,444 字元），下面行號都是這個檔的行號（簡寫 L）。
- **讀取日期**：2026-10-14
- **供哪幾篇使用**：系列第 5 篇（影片）。
- **不要和另一份紀錄混淆**：`guo2014-mooc-navigation.md` 是 Guo & Reinecke 2014（人口統計與 MOOC 瀏覽），不是這篇。

## 研究設計

- **類型**：混合方法的回溯研究：edX 伺服器記錄分析，加上對 6 位 edX 製作人員的非正式訪談（4 位主要影片製作人、2 位專案經理）（L253–256、L354–359）。作者明說「This paper presents a retrospective study, not a controlled experiment.」（L653）
- **資料**：edX 2012 年秋季第一批課程中的四門（Table 2，PDF 第 3 頁，已對版面）：

  | 課 | 學科 | 學校 | 講課拍攝場地 | 影片數 | 學生數 | 觀看次數（sessions） |
  |---|---|---|---|---|---|---|
  | 6.00x | 入門 CS 與程式設計 | MIT | 辦公桌 | 141 | 59,126 | 2,218,821 |
  | PH207x | 公衛統計 | Harvard | 電視攝影棚 | 301 | 30,742 | 2,846,960 |
  | CS188.1x | 人工智慧 | Berkeley | 教室 | 149 | 22,690 | 1,030,215 |
  | 3.091x | 固態化學 | MIT | 教室 | 271 | 15,281 | 806,362 |
  | 合計 | | | | 862 | 127,839 | 6,902,358 |

  「Students」是至少看過一支影片的人數（表說）。作者能取得完整記錄的只有 7 門 2012 秋季課，全是數理類，從中挑 4 門（L653–655）。
- **觀看次數（video watching session）的切法**（L270–298）：以「play video」事件開始；遇到與該影片無關的事件、登出、與下一事件間隔 30 分鐘以上、或影片播完即結束。短於 5 秒的 session 濾掉，因為多半是自動播放造成（L294–298）。
- **兩個投入（engagement）代理指標**（L304–324）：
  - 投入時間：session 長度。作者明說其限制：「it cannot capture whether a watcher is actively paying attention to the video or just playing it in the background while multitasking.」（L311–314）
  - 作答嘗試：32% 的影片後面緊接一題評量（多半是選擇題）；記錄學生是否在看完後 30 分鐘內嘗試作答（L315–321）。
- **影片屬性**（L325–351）：片長（從 YouTube 取）、語速（字幕字數 ÷ 說話時間）、類型（講課、操作教學、其他；89% 是前兩類，只分析這兩類）、製作風格（投影片、程式、Khan 式、教室、攝影棚、辦公桌，可多標）。
- **只報 1 倍速**：註腳 1：「In this paper, we report results only for 1x-speed plays, which comprise 76% of all sessions.」（L375–376）並說納入所有速度會把分布往下拉，但趨勢相同。

## 結果（逐項）

Table 1（PDF 第 2 頁，已對版面）列七項發現與建議，下面依正文順序。

### 片長（Shorter Videos Are More Engaging，L363–427；圖 2 在 PDF 第 4 頁）

- 「Video length was by far the most significant indicator of engagement.」（L365）圖 2 依片長分成五個大致等量的區間：0–3、3–6、6–9、9–12、12–40 分鐘（區間標籤從圖 2 橫軸讀出）。
- 「The top boxplot (absolute engagement times) shows that median engagement time is at most 6 minutes, regardless of total video length.」（L367–368）
- 「The bottom boxplot (engagement times normalized to video length) shows that students often make it less than halfway through videos longer than 9 minutes.」（L368–370）
  - 對 PDF 圖 2 下圖目測：9–12 分鐘區間的中位數約 0.54，12–40 分鐘約 0.2（從 120 dpi 轉圖量像素，誤差約 ±0.03）。也就是「看不到一半」在 12 分鐘以上的區間是中位數層次的事；9–12 分鐘的中位數略超過一半，原文用的是「often」不是「median」。上圖 6–9 分鐘區間的中位數目測約 6.1 分鐘，與「at most 6 minutes」差在目測誤差內，不確定。
- 最短的 0–3 分鐘影片投入最高、變異最小：「75% of sessions lasted over three quarters of the video length.」（L384–386）正規化值可大於 1（暫停或倒帶重看）。
- 四門課分開畫，趨勢相同（L390）。
- **作答嘗試**：「For the five length buckets in Figure 2, we computed the percentage of video watching sessions followed by a problem attempt: The percentages were 56%, 48%, 43%, 41%, and 31%, respectively.」（L391–392）分母是哪些 session（全部或只有後面接題目的影片）原文這句沒有明說；作答嘗試的定義只適用於後面接題目的影片（L315–321），推測是後者，不確定。
- edX 製作人員早就要求老師把課切成 6 分鐘以內，「based solely upon their prior intuitions」（L394–396）；製作人員另提一個假說：短片可能因為規劃較仔細才比較好，作者說沒有資料檢驗（L400–411）。
- 建議：「Instructors should segment videos into short chunks, ideally less than 6 minutes.」（L426–427）之後所有分析都先依片長分組（L415–417）。

### 講者頭像（Talking Head Is More Engaging，L428–451；圖 3）

- 6.00x 有 60%、PH207x 有 25% 的影片剪成頭像與投影片／程式交替（L432–433）；兩門課學生通常對有頭像的影片投入更多（圖 3）。誤差線不重疊時 Mann-Whitney U 檢定 p << 0.001（L435–437）。播放／暫停次數兩組無顯著差異（L438–441）。
- 作答嘗試：6.00x 看完頭像影片後 46%，其他影片 33%（卡方 p << 0.001）；PH207x 兩組都是 33%（L442–443、L413）。

### 製作成本（High Production Value Might Not Matter，L453–494）

- 6.00x（辦公桌、非正式）比 PH207x（數百萬美元的電視攝影棚）投入更高：6–12 分鐘影片接近兩倍、12 分鐘以上接近三倍（L457–460）。
- 作者自己的保留：「it is hard to generalize from only one pair of courses, since the effects could be due to differences in instructor skill.」（L488–489）

### Khan 式操作教學（L495–531；圖 4）

- 四門課中，Khan 式手寫板操作教學的投入時間是投影片／程式操作教學的 1.5 到 2 倍；後面接題目時作答嘗試 40% 對 31%（卡方 p << 0.001）（L500–502）。

### 事前規劃（Pre-Production Improves Engagement，L542–582；圖 5）

- CS188.1x（為 edX 規劃後在教室錄）比 3.091x（把 2011 年舊課堂錄影剪開）投入更高，尤其長片；作答嘗試 55% 對 41%（卡方 p << 0.001）（L559–563）。
- 限制：只有一對課、講者與科目都不同（L578–580）。

### 語速（L583–628；圖 6）

- 語速 48–254 字／分（平均 156，sd 31）（L586–588）。同一片長區間內，投入時間通常隨語速上升（最多 2 倍）；6–12 分鐘影片在中間區間（145–165 wpm）下凹（L589–593）。播放／暫停次數在不同語速間無顯著差異（L601–604）。作者說語速只是與熱忱相關的表面特徵，不建議強迫講者講快（L617–619）。

### 講課與操作教學（L629–650；圖 7、圖 8）

- 「Figure 7 shows that students only watch, on average, 2 to 3 minutes of each tutorial video, regardless of the video's length. Figure 8 shows that students re-watch tutorials more frequently than lectures.」（L633–634）圖 8 圖說另說片長越長越常被重看（L641–643）。
- 建議：「For lecture videos, optimize the first-time watching experience. For tutorials, length does not matter as much, but support re-watching and skimming.」（L649–650）也提到在操作教學影片加超連結書籤或醒目的轉場文字方塊（L635–638）。

### 進行中的工作：影片內互動（L692–757；圖 9–11，初步結果）

- 操作教學影片的暫停較多（interactivity）、也較集中在特定點（selectivity）；投影片／程式操作教學比 Khan 式更集中暫停。作者說尚未訪談製作人員，屬初步結果（L708–709）。

## 作者自己列的限制（LIMITATIONS，L651–691）

- 回溯研究，不是對照實驗；只有 7 門數理類課可用，挑了 4 門；應在更多元的課程重做（L653–656）。
- 2012 秋季第一批 edX 學生多半是自我驅動、早期採用者，未必代表一般線上影片觀眾（L657–662）。
- 從伺服器記錄量不到真正的投入；代理指標可能不具代表性，例如邊看影片邊逛 Facebook（L663–669）。
- 下載離線觀看的學生無法追蹤；學生數與總選課人數接近，推測多數在線上看（L670–677）。
- 只看整支影片層次的投入，尚未研究影片內哪些段落被看、略過、重看（L682–685；另見 Kim 等 2014）。
- 「it is important not to draw any conclusions about student learning solely from our findings about video engagement.」（L686）

## 與摘要說法不一致的地方

- 摘要說「shorter videos are much more engaging」，正文一致。摘要說「informal talking-head videos are more engaging」，把頭像（6.00x 與 PH207x 內部比較）與非正式場地（6.00x 對 PH207x，只有一對課）兩項合成一句；後者作者在正文說難以推論（L488–489）。摘要語氣比正文的保留強，但不算數字矛盾。
- 摘要說「even high-quality pre-recorded classroom lectures might not make for engaging online videos」，正文的依據是一對課（CS188.1x 對 3.091x），作者在正文列為主要限制。
- 其餘逐項對過，沒有。

## 與清單「要撐的結論」不合的地方

清單 V-5 列的：6 分鐘、9 分鐘、127,839 人、約 690 萬次觀看、1 倍速占 76%、作答率 56／48／43／41／31%。

- 數字全部在原文找得到且正確（Table 2、L367–370、L376、L391–392）。
- 「6 分鐘」是觀看時間中位數的上限（不論片長），也是 edX 製作人員原本憑直覺給的切段建議；作者的建議措辭是「ideally less than 6 minutes」。原文沒有測試把影片切成 6 分鐘以內會發生什麼。
- 「9 分鐘」那句原文用「often」；圖 2 目測 9–12 分鐘區間的中位數略超過一半，只有 12 分鐘以上的區間中位數明顯低於一半。
- 127,839 人與 862 支影片是四門課的總數；投入時間分析只用講課與操作教學兩類（占 89%）且只用 1 倍速 session（76%）。

## 已發佈文章引用核對（第 5 篇，現行檔行號）

| 文章行 | 文章說法 | 原文 | 判定 |
|---|---|---|---|
| 128 | 用同一批 edX 資料算觀看時間 | 與 Kim 等 2014 同為 2012 秋四門課（Table 2 與 Kim Table 1 的課、影片數、學生數相同） | 一致 |
| 128 | 不論影片多長，觀看時間的中位數最多 6 分鐘 | L367–368 | 一致 |
| 128 | 超過 9 分鐘的影片，學生常常看不到一半 | L368–370「often make it less than halfway through videos longer than 9 minutes」 | 與原文文字一致；圖 2 目測 9–12 分鐘區間中位數約 0.54，若要更精確可寫「超過 12 分鐘的影片，多數人看不到一半」或保留原文的「常常」 |
| 128 | 給製作者的建議是切成 6 分鐘以內 | L426–427「ideally less than 6 minutes」；Table 1「shorter than 6 minutes」 | 一致 |
| 186 | Guo 的 6 分鐘 | 同上 | 一致 |
| 224 | Guo 與 Kim 量的是操作紀錄 | Guo 量的是 session 長度與作答嘗試，來自伺服器記錄 | 一致 |
| 229 | edX 資料來自 2012 年秋季的四門理工課 | Table 2；作者稱「math/science-focused」（L264） | 一致 |
| 229 | 學生是第一批 MOOC 使用者 | 「edX students in the first Fall 2012 batch, who are more likely to be self-motivated learners and technology early adopters」（L658–661） | 大致一致；原文是 edX 第一批，不是所有 MOOC 的第一批，措辭可收緊為「edX 第一批學生」 |
| 229 | Guo 也說明觀看時間只是代理指標，分不出學生是在看還是放著播 | L311–314、L663–667 | 一致 |
| 240 | 四門課名稱與學校 | Table 2 | 一致 |
| 240 | 862 支影片、127,839 名學生、約 690 萬次觀看 | Table 2（6,902,358） | 一致 |
| 240 | 只計 1 倍速的觀看，占全部的 76% | 註腳 1（L375–376） | 一致；原文「只報 1 倍速」是就本文呈現的結果而言 |
| 240 | 練習題作答率隨片長下降，五個區間依序 56、48、43、41、31% | L391–392 | 一致 |
| 240 | 這是回溯分析，沒有對照實驗 | L653 | 一致 |
| 240 | 講課型重點放在第一次觀看的體驗，操作教學型要支援重看與略讀 | L649–650 | 一致 |
| 263 | 參考資料連結 up.csail.mit.edu；讀取範圍「摘要、資料與方法、片長一節、講課與操作教學的比較、限制」 | 作者研究群網站，合法 | 連結合規；讀取範圍可更新為「讀了全文」 |

## 讀取紀錄

- `dl/guo.flow.txt` L1–828 依序讀完（一次讀入，首尾相接）：L1–36 題名、作者、摘要、關鍵詞；L37–157 導言（含 Table 1 文字層 L88–133、首頁版權欄 L48–58）；L159–250 相關研究（含 Table 2 文字層 L188–246）；L251–359 方法；L360–650 發現與建議（含圖 2–8 圖說）；L651–691 限制；L692–757 進行中的工作；L758–776 結論與致謝；L732–745、L778–828 參考文獻（文字層把參考文獻與圖 11 圖說交錯，掃過）。
- 對 PDF 版面：第 2 頁（Table 1）、第 3 頁（Table 2）、第 4 頁（圖 2，含區間標籤與中位數目測）轉圖看過。flow 文字層的 Table 2 數字與版面一致。
