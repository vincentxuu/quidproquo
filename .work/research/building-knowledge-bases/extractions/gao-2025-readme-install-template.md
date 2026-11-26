# 抽取紀錄：Gao, Treude & Zahedi 2025, Adapting Installation Instructions in Rapidly Evolving Software Ecosystems（IEEE TSE）

read_status=full（arXiv 2312.03250v3 預印本，2025-01-07 版，22 頁；未與 TSE 正式版比對。§IV 的 189 個代碼逐項例子以略讀方式讀過，其餘逐段讀）

角色：order 8「how-to／README 模板」的實證——從 1,168 次 README 安裝段修改歸納出模板，再用讀者問卷與真實 PR 驗證。也提供「文件為什麼要改」的觸發因素（order 9 可用）。

## 書目

- 作者：Haoyu Gao、Christoph Treude、Mansooreh Zahedi（預印本首頁只列姓名，所屬機構未在抽出的文字中出現，未查證）
- 刊物：IEEE Transactions on Software Engineering，2025-03-18 線上；DOI 10.1109/TSE.2025.3552614。預印本 arXiv:2312.03250v3。
- 資料：https://github.com/Haoyu-Gao/README_Empirical_Study（未開）
- 全文文字檔：/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/o8-gao-2025-readme-install.txt（pdftotext 非 layout，4,439 行，148,495 bytes）

## 設計、樣本、量了什麼

- 資料（行 355–441、477–565）：GH Archive 2015-01 到 2023-02，Python／Java、≥500 commits、≥10 stars 等篩選 → 12,908 repo → 隨機 400 repo → 25,209 次 README commit → 半自動標註 8,673 次與安裝相關 → 分層抽 1,168 次做質性編碼，得 6 大類、189 個代碼。
- 觸發因素（§V，行 3157–3345）：逐筆追 commit 訊息、PR、release，找到 614 個觸發、其餘「無明確證據」。
- 模板驗證（§VI，行 3346–3815）：
  - 讀者問卷：隨機 20 份 README，用 ChatGPT-4o 套模板改寫（指示「不刪、不增資訊」），Prolific 上 30 位 IT 從業者（平均 6.9 年經驗）盲評原版 vs 改寫版，十個品質面向 1–5 分。
  - PR 研究：對 30 個活躍 repo 送套用模板的 PR。

## 可引用結果（行號指 o8-gao-2025-readme-install.txt）

1. README 安裝段改了什麼（行 1041–1046、1066–1071）
   - 六類：安裝前、安裝、安裝後、求助資訊、文件呈現、外部資源。
   - 「628 out of 1,168 performed updates are related to environment setup topics」（行 1066）；依賴相關 527 次，「more than 40% of the documentation updates contain dependency-related instructional modifications」（行 1069–1071）。
2. 為什麼改（行 3184–3345）
   - 三大類：先前文件有錯、程式碼變了、想改善。
   - 最常見觸發：軟體版本更新 131 次（行 3297）；功能增改 83（行 3302）；指令或路徑變更 76（行 3316）；依賴更新 52（行 3324）。
   - 先前版本的錯：呈現問題 93、內容不完整 78、指令錯 48、過時 12（行 3264–3288）。過時例：Python 2→3 遷移三年後 README 才改（行 3291–3294）。
3. 模板內容（Fig. 10，行 3355–3433；說明行 3444–3458）
   - Prerequisites（語言版本、依賴）→ Installation（手動／套件管理器兩種選項）→ Verification（驗證安裝成功的指令）→ Usage（基本指令、進階選項）→ External Documents → Version History → Help and Support（FAQ、常見錯誤、求助管道）。未完成處留 TODO，作者稱為 "self-admitted document debt"（行 3407–3410）。
4. 讀者評分（行 3564–3587、Fig. 11 行 3639–3724）
   - 十個面向中 8 個 p<0.05。增幅最大：structure +0.80（d=0.82）、understandability +0.53（d=0.62）、conciseness +0.53（d=0.60）（行 3567–3569、3640–3649）。
   - clarity（p=0.35, d=0.15）與 consistency（p=0.89, d=0.02）沒有顯著差異（行 3712–3724）。
   - 評分者一致性 Krippendorff's α = 0.34（行 3559）。
5. 真實 PR（行 3588–3803）
   - 30 個 repo 中 8 個回應且接受 LLM 改寫：6 正面、2 負面；另有 4 個拒絕 LLM 產生內容或質疑不請自來的 PR（行 3602–3607）。合併例：aerleon、spring/uberserver、actinia-core、apache/openmeetings（改後合併）（行 3609–3624）。
   - 負面理由：「Some sections that are important for us ... are missing」——通用模板缺專案特有內容（行 3787–3790）；pyvespa 維護者："some also are not correct/ helpful"、"do a human review before creating a PR"（行 3778–3780）。
   - 作者結論：「a general template may not be suitable for all scenarios」，需要 human-in-the-loop（行 4002–4005）。
6. 呈現面的教訓（行 3920–3961）
   - 「change section header name」是呈現類最常見的修改（88 次，行 3926）——建議用標準化的段落標題。
   - README 不該是全部文件：太長時把內容移到 INSTALL.md／CONTRIBUTE.md、README 留連結（行 3950–3961）。

## 作者限制（行 4020–4092）

- 只看 Python／Java、開源 GitHub（行 4025–4056）。
- 模板驗證只有 20 份文件、30 人；評分者沒有實際照著安裝——「we only claim an improvement in the documentation reading experience rather than in documentation accuracy.」（行 4073–4083）
- PR 研究只 30 個 repo、沒有長期資料看合併的內容會不會留著（行 4086–4089）。

## 沒寫的事

- 沒有「模板 vs 沒模板」的寫作者實驗（寫的人用模板會不會寫得更快、更完整）。改寫是 ChatGPT 做的，所以讀者評到的是「LLM 依模板重排」的效果，模板本身與 LLM 改寫無法分開。
- 沒量讀者照著做能否裝起來（作者自己承認）。

## 與摘要或常見轉述不一致處

- 摘要說 "1,163 README commits"（行 21–22），方法節與結論是 1,168（行 669–670、4110）；觸發節同一段同時出現 1,163 與 1,168（行 3158、3185）。commit 總數也有 25,209（行 481、4106）與 25,230（行 562）兩個數字。引用用 1,168 與 25,209，註明出處行。
- 摘要說 "documentation maintainers find it useful"——實際是 8 個回應者中 6 個正面，30 個送出的 PR 多數沒回應；"useful" 不能推成「多數維護者接受」。
- 「模板提高文件品質」：提高的是讀者感受的結構與易懂度；clarity 與 consistency 沒變，正確性沒測。

## 限制（我的判斷）

- README 安裝段是 how-to 的一種，但是對外部使用者；對團隊內部 how-to（runbook、操作步驟）要轉譯，不能直接套。

## 讀取紀錄

- 管道：Exa search 找到 TSE 摘要 → arXiv API 標題搜尋得 2312.03250v3 → `curl -sL https://arxiv.org/pdf/2312.03250v3` → 200 PDF → `pdftotext`（非 layout）。
- 依序讀：行 1–832（摘要、§I–III）逐段；行 832–3156（§IV 六類的逐項例子與 Table II，大量 diff 範例與圖中文字）略讀，讀了各概念段落開頭與計數；行 3157–4142（§V–IX）逐段；參考文獻掃過。
