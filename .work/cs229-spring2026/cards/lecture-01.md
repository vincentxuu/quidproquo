# 範圍卡：CS229 Spring 2026 第 1 堂

- **課程／版本**：Stanford CS229 Machine Learning，Spring 2026（Tengyu Ma 與 Chris Ré 分堂授課）。
- **原課堂次與 order**：第 1 堂（YouTube 標題 Lecture 1: Introduction，videoId DATnpGoGhM8，36:59）；series.order 1。
- **文章**：`src/content/posts/ai/2026-10-12-stanford-cs229-lecture-01-introduction.md`，角色為概念導讀。
- **講者判定**：Tengyu Ma。依據：字幕「this is me and Chris. I guess Chris is not here today」，並自述博士班做 deep learning theory、現在做 AI for math 與自動定理證明。
- **讀者先備**：看得懂 y = ax + b、平均數、向量內積；不需要微積分。
- **主問題**：監督式、非監督式、強化學習三類，各自的資料、輸出與回饋訊號差在哪，後面哪一堂教哪一塊。
- **讀完的能力**：
  1. 用 Mitchell 的 E／T／P 拆解任何一個機器學習任務。
  2. 判斷一個任務是迴歸還是分類，並說明 LLM 為什麼是分類。
  3. 解釋取樣為什麼擋住反向傳播、強化學習補上哪一塊。
  4. 對照講義六部分與 17 支錄影。
- **完整例子**（皆為本文自擬，文中已標明）：
  1. 三筆房屋資料 (600,180)、(1000,260)、(1400,380)，直線 A：0.25x+20，MSE 100；直線 B：0.2x+70，MSE 366.7；x=800 時 A 預測 220、B 預測 230。
  2. 4×4 文件與詞的次數表，cos(D0,D2)=35/37.34≈0.94、cos(D0,D1)=0，重排後成兩個區塊。
  3. 詞向量方向：France(2,3)→Paris(5,4) 得方向 (3,1)，Italy(1,1)+(3,1)=(4,2)。
  4. 三個詞的機率 (0.5,0.3,0.2) 說明取樣不可微分（無計算，僅示意）。
- **自我檢查題與答案**：
  1. 垃圾郵件過濾器的 E／T／P 與類型：一萬封帶標籤的信／判斷新信／未見過信件上的準確率；分類。
  2. 直線 C：0.25x+30 的 MSE：誤差 0、−20、0，MSE 400/3≈133.3，比 A 差。
  3. LLM 既是分類又歸在非監督式：資料無人工標籤，但下一個詞可當答案。
  4. 為何要 RL：取樣不可微分，加上獎勵在整段產生完才給。
  5. 拿掉驗證器會怎樣：沒有回饋訊號，P 不會上升（需自行推論，課堂未答）。
- **來源底本**：`.work/cs229-spring2026/txt/01-DATnpGoGhM8.txt`（英文字幕，全篇讀完）；`main_notes.txt` 目錄與第 6–8 頁；課程總覽文（客座講座未上傳一事）。未看投影片畫面。
- **非字幕、非講義的事實**：1959 年定義歸給 Arthur Samuel；Mitchell《Machine Learning》1997 年出版（講者口述 1998）；Fei-Fei Li、Geoffrey Hinton、Ilya Sutskever 的姓名拼法。
