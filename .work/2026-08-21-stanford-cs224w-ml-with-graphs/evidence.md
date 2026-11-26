# 查證紀錄：stanford-cs224w-ml-with-graphs

（2026-11-12 從 zh 與 en 正文移出的「附錄：數字與查證方式」整節，依 writing-guide「查證過程不寫進正文」）

## [zh] 附錄：數字與查證方式

- **學分與時段**：3–4 學分，只在秋季開。2026-27 秋季班號 2058，2026/09/22–2026/12/04，週二週四 15:00–16:20，NVIDIA Auditorium，Letter 或 Credit/No Credit。出處：ExploreCourses 2026-27 條目。
- **評分權重**：Homework 20%（三份各 6.67%）、Colab 15%（五份各 3%）、Exam 35%、Final Project 30%，Ed 參與另計加分。專案內部再拆成 proposal 13.33%、milestone 6.67%、report 80%，換算成總成績分別是 4%、2%、24%。出處：`info.html` 與專案說明文件。
- **遲交政策**：兩個 no-questions-asked 的 late period，每個 4 天，不適用於期末專案報告；用完之後每個 late period 扣 50%，超過一個 late period 不收。Gradescope 有 15 分鐘寬限期。
- **作業配分細節**：HW1 第一節 GNN Expressiveness 28 分、第三節 GCN 11 分（另有 3 分 BONUS 題）；HW2 三節分別 20、21、10 分；HW3 三節分別 20、13、15 分。三份都有 0 分的 Honor Code 節。
- **RDL 的對照數字**：第 12 堂投影片上，Stack Exchange 使用者活躍度預測任務，人工路線是「12 hours manual work / ~682 lines of code / 1hr model training」，RDL 路線是「<1 hour manual work / 54 lines of code / 1hr model training」。投影片標註工作量的定義是「the marginal effort to solve a new task」。這是投影片上的效率對照，**投影片上的這一組數字沒有同時給準確度對照**，不要把它讀成模型表現的比較。
- **STaRK 的 18%**：出自第 17 堂投影片的原文「For all methods, Hit@1 is below 18%」，指 STaRK benchmark 上所有受測的檢索增強方法與 LLM。
- **Neo4j 案例的 Hit@1**：第 16 堂投影片列出 .16→.32，資料集是 STaRK Prime。PyG 方案的組成是「LLAMA3.1-8B w/ LoRA + 10M param GAT」；對照組是 agentic GraphRAG 的 claude-3-opus（.18）與 gpt-4-turbo（.2）。這是投影片轉述的第三方案例，不是課程自己跑的實驗。
- **付費修課的金額**：AI Professional Program 個別報名 1,950 美元一門（XCS224W）；研究生學分的 CS224W 在 Stanford Online 標示學費 6,300 美元。兩者查詢當下皆為 Enrollment Closed，且 XCS224W 沒有列出開課日期，而同一頁上多門姊妹課有。**頁面沒有說明原因。**
- **DeepSNAP 與 OGB 的維護狀態**：查詢當下 GitHub API 顯示 `snap-stanford/deepsnap` 最後推送於 2025-11-24、`snap-stanford/ogb` 最後推送於 2025-05-06、`pyg-team/pytorch_geometric` 最後推送於 2026-08-17。兩個 repo 都沒有被標記為 archived。
- **未能確認的三項**：（1）Colab 0 的 Google Drive 連結回 200，但它是 Drive 的檢視頁而非 notebook，我沒有取得它的 cell 內容，上表因此留白；（2）Stanford Online 的兩個 YouTube 播放清單分別是 47 支與 60 支，但我沒有逐支比對確認兩者的差集是什麼；（3）第 16 堂投影片的講者未在投影片上具名，我沒有找到官方頁面說明那堂由誰主講，因此文中沒有寫講者姓名。

## [en] Appendix: the numbers and how they were checked

- **Units and schedule**: 3–4 units, autumn only. The 2026-27 autumn section is 2058, 2026/09/22–2026/12/04, Tuesdays and Thursdays 15:00–16:20, NVIDIA Auditorium, letter or credit/no credit. Source: the ExploreCourses 2026-27 entry.
- **Grade weights**: homework 20% (three at 6.67% each), Colabs 15% (five at 3% each), exam 35%, final project 30%, with extra credit for Ed participation on top. The project splits internally into proposal 13.33%, milestone 6.67%, report 80% — 4%, 2% and 24% of the final grade. Source: `info.html` and the project handout.
- **Late policy**: two no-questions-asked late periods of 4 days each, not applicable to the final project report; past that, each late period costs 50%, and nothing is accepted beyond one late period. Gradescope allows a 15-minute grace window.
- **Homework point breakdown**: HW1 section 1 (GNN Expressiveness) 28 points, section 3 (GCN) 11 points plus a 3-point bonus problem; HW2's three sections are 20, 21 and 10; HW3's are 20, 13 and 15. All three carry a 0-point honor code section.
- **The RDL comparison numbers**: on lecture 12's slides, for the Stack Exchange user-activity prediction task, the manual route is "12 hours manual work / ~682 lines of code / 1hr model training" and the RDL route is "<1 hour manual work / 54 lines of code / 1hr model training." The slide defines the effort measure as "the marginal effort to solve a new task." This is an efficiency comparison, and **the slide does not pair these numbers with an accuracy comparison** — don't read it as a claim about model performance.
- **STaRK's 18%**: from lecture 17's slides, verbatim, "For all methods, Hit@1 is below 18%," referring to every retrieval-augmented method and LLM tested on the STaRK benchmark.
- **Hit@1 in the Neo4j case study**: lecture 16's slides show .16→.32 on STaRK Prime. The PyG setup is "LLAMA3.1-8B w/ LoRA + 10M param GAT"; the baselines are agentic GraphRAG with claude-3-opus (.18) and gpt-4-turbo (.2). This is a third-party case study relayed on the slides, not an experiment the course ran.
- **Paid enrollment prices**: the AI Professional Program charges $1,950 for a single course (XCS224W); CS224W for graduate credit is listed on Stanford Online at $6,300 in tuition. Both read Enrollment Closed when checked, and XCS224W lists no start date although several sibling courses on the same page do. **The page gives no reason.**
- **Maintenance status of DeepSNAP and OGB**: when checked, the GitHub API showed `snap-stanford/deepsnap` last pushed 2025-11-24, `snap-stanford/ogb` 2025-05-06, and `pyg-team/pytorch_geometric` 2026-08-17. Neither repo is marked archived.
- **Three things I could not confirm**: (1) Colab 0's Google Drive link returns 200, but it's a Drive viewer page rather than the notebook, and I did not obtain its cell contents — hence the blank row in the table above; (2) Stanford Online's two YouTube playlists hold 47 and 60 videos, but I did not compare them video by video to establish what the difference consists of; (3) lecture 16's slides do not name their speaker, and I found no official page saying who taught it, so no name appears in the text.
