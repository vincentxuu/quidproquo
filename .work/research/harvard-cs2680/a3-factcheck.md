# A3「Harness competition」（Mads-Opt）主張查證

- 查證日期：2026-10-22
- 對象：Harvard CS2680 作業 3 頁面 https://cs2680.com/assignments/assignment3（2026-10-22 重抓，與 2026-10-21 存檔 `sources/pages/assignments_assignment3.html` 去標籤後逐段比對：規格正文無差異，只多了頁首「slides」連結，頁尾下一份作業的標題由「Serve your own agent」改為「Mads-Serve: own the model」）；作業總覽頁 https://cs2680.com/assignments/（2026-10-22 重抓）；作業 3 投影片 `slides/8_assignment3.pdf`（7 頁）；第 7 堂投影片 p35；第 8 堂投影片 p2、p7、p22、p26、p29、p31、p38；starter 壓縮檔 `assignment3.tar.gz`（64,359 bytes，下載到 scratchpad 的獨立目錄、只讀檔，沒有執行其中任何腳本）。
- 工具：本 session 沒有 Groundlane MCP；Groundlane HTTP 先前回 401；Exa 連線失敗。課程頁與 starter 用 `curl -sL` 直接抓；arXiv 用 export API；Skyline 論文先用 Keenable 搜到 HandWiki 條目（經 `r.jina.ai` 讀全文）取得 DOI，再用 Crossref API 核對題名、作者與會議名。
- 判定：Confirmed（原文支持）｜Outdated｜Contradicted｜Not found｜Observed（頁面或 starter 檔的可觀察事實，文中照實描述、不推測出題意圖）

## 結果統計

| Verdict | 數量 |
|---|---|
| Confirmed | 26 |
| Observed | 4 |
| Contradicted（課程自己兩處說法不一致） | 2 |
| Outdated | 0 |
| Not found | 0 |

## 查證表

| # | 主張 | 來源 | 原文（節錄） | Verdict |
|---|---|---|---|---|
| 1 | 作業 3 佔 20%，10/5（一）發、10/20（二）23:59 截止；leaderboard 不接受 late days，截止時關閉，沒交就是 0 分；late days 只適用 repo 與影片 | 作業頁開頭 | "Assignment 3 — Harness competition (20%) Out Mon Oct 5 · due Tue Oct 20, 11:59pm"；"THE LEADERBOARD DOES NOT ACCEPT LATE DAYS AND WILL CLOSE ON TUESDAY, OCTOBER 20, AT 11:59 P.M."；"Late days apply only to the repo and the video." | Confirmed |
| 2 | 第 8 堂（10/7）投影片寫「Assignment 3 starting today」，與作業頁的 10/5 發布不同 | L8 p2；作業頁 | "Assignment 3 starting today" | Contradicted（課程內部不一致；文中用作業頁日期，不提這處） |
| 3 | 作業總覽頁的作業 3 名稱是「Mads-Opt: Make every token count」，目標是模型仍當黑盒，在不掉成功率的前提下壓低成本與延遲 | 作業總覽頁 | "Mads-Opt: Make every token count — The model is still a black-box API, so optimize everything around it. … Hold task success fixed while driving cost and latency down." | Confirmed |
| 4 | 繳交形式：作業總覽頁說作業 3 以公開的 blog post 繳交；作業 3 頁面的 Submission 與 Grading 寫的是 src.zip（leaderboard）＋ writeup.pdf ＋ 影片 | 作業總覽頁；作業頁 Part 3 | 總覽："Assignments 3 and 5 are submitted as a published blog post"；作業頁："The submission has three parts: the code (your src/ on the leaderboard), a write-up, and a video."、"Commit it to your repository as assignment3/writeup.pdf" | Contradicted（兩頁不一致；文中照作業頁的評分表寫，並用一句話點出總覽頁的不同說法） |
| 5 | 兩種容器：agent container（掛載學生的 src/，主 loop、memory、subagent 都在這裡）與每題一個 task container（repo 在該題起始 commit，含工具鏈與測試依賴） | 作業頁 Part 0 | "The main agent runs in the agent container … memory, subagents and any other features should live in it as well."；"Every task runs in its own task container, built from that task's own image" | Confirmed |
| 6 | starter_code 以唯讀掛在 /madsOpt，agent 只能寫 .tasks/ 與 madsOpt_logs/，其他暫存放 /tmp 之類 | 作業頁 Part 0 | "The starter_code folder is mounted read-only at /madsOpt, and your agent can write to only two places in it" | Confirmed |
| 7 | 兩種容器都連不到網路；agent container 唯一的出口是到課程 API 的 egress proxy，task container 完全沒有 | 作業頁 Part 0；A3 投影片 p2 | "Neither container can reach the internet: the agent container's only way out is an egress proxy to the course API … task containers have none."；投影片 "Offline evaluation, can only access api.cs2680.com." | Confirmed |
| 8 | task container 裡的 sandbox_server.py 有 /health、/exec、/read、/write 四個路由（port 8000）；Sandbox(url, workdir) 包成 exec／read_text／write_text；不能在 agent container 用 open()／subprocess 碰 repo；可以自己加路由 | 作業頁 Part 0；starter src/agentic_loop.py | "four routes: /health, /exec …, /read (a file), /write (a file)"；"Do not touch the repo with local open() or subprocess"；"You can add routes for any features you need" | Confirmed |
| 9 | Go 題的模組快取預先放好，GOPROXY=off，go get 與 go mod tidy 離線可用 | 作業頁 Part 0 | "Their task containers come with a pre-warmed module cache and have GOPROXY=off set" | Confirmed |
| 10 | extract_patch(k) 取 task container 的 git diff；也可 submit_patch 自己寫；evaluate(k) 在乾淨的 task image 上套 patch 跑隱藏測試，回傳失敗數、總數與第幾次嘗試 | 作業頁 Part 0；starter dispatcher.py | "ev = dispatcher.evaluate(k) # -> {"tests_failed": F, "tests_total": T, "attempt": a}"；"applies the task's hidden tests, runs them, and sends the agent the total number of tests and how many failed" | Confirmed |
| 11 | 評估之後二選一：continue_task(k) 保留容器與修改、刪掉已交的 patch，可再評估；done(k) 定案，以最後一次評估為結果，交了沒評估的 patch 當場評，沒 patch 算失敗 | 作業頁 Part 0 | "the task is final. Its last evaluation is its result; a patch you submitted but never evaluated is graded now; no patch counts as a failure." | Confirmed |
| 12 | 同時最多 5 題；第 6 題 next_task() 丟 DispatcherError；每題一次只能有一個評估在跑；單次評估上限 35 分鐘，卡住的測試全部算失敗 | 作業頁 Part 0；A3 投影片 p3、p4；starter dispatcher.py `MAX_LIVE = 5` | "At most 5 tasks live at once."；"Grading has a time limit: 35 minutes. A test suite that hangs counts as all of its tests failing." | Confirmed |
| 13 | 整個 run 上限 4 小時，從開第一題起算；時間到丟 DispatcherShutdown，開著的題照 done 處理，沒開過的題算失敗 | 作業頁 Part 0；A3 投影片 p4 | "The whole run has a time limit: 4 hours. The clock starts when your agent opens its first task."；"tasks never opened count as failures" | Confirmed |
| 14 | 入口是 Agent(dispatcher).run()，流程（開幾題、平行與否、何時評估、失敗要不要再試、跨題帶什麼）都由你決定；starter 一次一題、什麼都不修，本機跑會是 0/5 | 作業頁 Part 0、Step 3；starter agentic_loop.py | "After that, you decide the flow: how many tasks to keep open, whether to work on them in parallel, when to evaluate, whether to spend another attempt on a failing task or move on, and what to carry from one task to the next."；"expect 0/5 passed from it" | Confirmed |
| 15 | 模型呼叫與工具呼叫都要經 dispatcher.logger(k) 記下；作業頁說 leaderboard 從 trace 讀 turn 數，starter 的說明則說成本與 turn 數都從 trace 算 | 作業頁 Part 0；starter agentic_loop.py docstring | 作業頁："The leaderboard reads your turn counts from that trace."；starter："the leaderboard computes your cost and turn counts from it." | Observed（成本的定義文中照作業頁 Step 4「API 帳號被扣的錢」寫，另提醒每次呼叫都要記） |
| 16 | 三種模型與價格（每百萬 token）：Expert 輸入 $2.00／快取輸入 $0.10／輸出 $10.00；Standard $0.08／$0.004／$0.28；Starter $0.01／$0.0005／$0.04；一個 run 可以混用 | 作業頁 Part 1 Step 2；A3 投影片 p4 | "Expert: most capable model; per 1M tokens: $2.00 input, $0.10 cached input, $10.00 output"；"It may use any of the three models in one run, and as many of them as it likes." | Confirmed（三種模型的快取輸入都是一般輸入的 1/20，為本文計算） |
| 17 | 只能改 src/；dispatcher/、madsOpt.py、evaluation_scripts/ 和 leaderboard 用的一樣（student_name.json 除外）；leaderboard 只取上傳的 src/ | 作業頁 Part 1、Part 2；A3 投影片 p5 | "You can modify anything under src/ and add features there. The rest (dispatcher/, madsOpt.py and evaluation_scripts/) is the same as what the leaderboard uses." | Confirmed |
| 18 | 本機題目檔 agent_task_input.json 有 5 題；leaderboard 的評估集有 26 題、編號 1–26；題目來自固定 commit 的 SWE-bench Pro | starter evaluation_scripts/agent_task_input.json；作業頁 Part 2；prepare_images 說明 | 本機檔 5 筆（openlibrary、flipt、vuls、teleport、element-web）；"The leaderboard has 26 tasks, numbered 1 to 26"；"fetches the task data (SWE-bench Pro, at a fixed commit)" | Observed＋Confirmed（文中只寫「本機 5 題、leaderboard 26 題」，不列 repo 名） |
| 19 | 本機需求：Linux x86_64、Docker、git、python3 3.10+、約 15 GB 磁碟 | 作業頁 Step 0 | "Linux x86_64; Docker; git; python3 (3.10+) with pip; about 15 GB of free disk for the images." | Confirmed |
| 20 | 三個指標：解出題數；每題成本＝整個 run 期間 API 帳號被扣的錢 ÷ 解出題數；每題時間＝從開第一題到最後一題 done 的牆鐘時間 ÷ 解出題數 | 作業頁 Part 2 Step 4；A3 投影片 p6 | "the cost per solved task (what the course API account was charged during the run, divided by the number of tasks solved), the time per solved task (the end-to-end host-clock time, from the first task opened to the last task done, divided by the number of tasks solved)" | Confirmed |
| 21 | 每人每天 $30、每次提交 $10；碰到任一上限就停，完成的部分照記；一次只能有一筆在排隊或評分；排隊中取消不花錢，評分中取消照扣、以取消當下的指標記錄；每 2 分鐘檢查一次花費 | 作業頁 Part 2 Step 5 與 More information；A3 投影片 p6 | "Every student has $30 per day for leaderboard grading, with a $10 limit per submission."；"Cancelling a submission that is still queued removes it from the queue at no cost."；"Every 2 minutes the grader adds up what the run has spent so far." | Confirmed（投影片 p6 寫「Cancelled submission also counts, and consumes the daily budget」，作業頁區分了排隊中與評分中，文中照作業頁） |
| 22 | 排名：每人以最佳提交計；解 ≥7 題的提交照三指標分 skyline 層；A 支配 B＝三項都不差且至少一項更好；第 1 名是沒被任何人支配的；同名次並列，下一名算前面的人數（1,1,1,4）；解不到 7 題的排在所有人後面、只看題數；新提交要嚴格更好才會取代最佳提交，平手保留舊的 | 作業頁 Part 2 Step 6；A3 投影片 p7 | "One submission dominates another if it is at least as good on all three metrics and better on at least one. Rank 1 is every submission that no other submission dominates; rank 2 applies the same rule to the rest"；"Equal ranks are ties, and the next rank counts everyone ahead of it: 1, 1, 1, 4, ..."；"A new submission becomes your best only if it ranks strictly better than your current best. On a tie, the current best stays." | Confirmed |
| 23 | 每題失敗原因：not opened、not finished、no patch、tests did not run、import error、broke existing tests、new tests failed | 作業頁 More information | 原文逐項列出七種 | Confirmed |
| 24 | 當掉或逾時的 run 仍計分，以當時已完成的題目為準 | 作業頁 More information | "Crashed or timed-out runs still count, with the tasks they had finished by then." | Confirmed |
| 25 | 配分：leaderboard 80、writeup 10、影片 10；分數＝max(81 − r, 50)（任一提交達 baseline）否則 81 − r；baseline 是 4 小時、$10 內解 16 題；達 baseline 的那筆不必是最佳提交；例：第 1 名 80、第 12 名 69、第 40 名達 baseline 50 否則 41 | 作業頁 Grading；A3 投影片 p7 | "The baseline solves 16 tasks in 4 hours within a limit of $10. If any of your submissions achieves the baseline, you get credit for it, even if that submission is not your best. For example, rank 1 scores 80; rank 12 scores 69 whether or not it beats the baseline; rank 40 scores 50 if it beats the baseline and 41 if it does not." | Confirmed |
| 26 | writeup 回答三題（harness 主要元件、做了哪些優化與取捨、踩到的坑與有幫助的做法），一頁、不得有 AI 產生的文字；影片 3 分鐘、露臉、自己的聲音、打開程式碼指給人看；資安漏洞回報最多加 3 分總成績，濫用則該提交作廢 | 作業頁 Part 3、Grading、Bonus | "The write-up must be entirely your own work, with no AI-generated text."；"A clear 3-minute presentation"；"you can earn up to 3 bonus points toward your final course score … Abusing a vulnerability forfeits your submission." | Confirmed |
| 27 | 第 7 堂 p35：作業 3 三個指標都評；A 支配 B 的定義；第 1 名是 Pareto frontier，圖上沒畫速度 | L7 PDF p35 | "Assignment 3: You will be evaluated on all three metrics"；"A dominates B if A is no worse on any metric and better on at least one. Rank 1 is the Pareto frontier; speed is not drawn" | Confirmed |
| 28 | 第 8 堂槓桿：成本公式（p7）、model routing 三型（p22）、每題預算上限與停止條件（p26，數字是示意）、完成時間看關鍵路徑（p29）、orchestration 四招（p31）、run→measure→change one thing→re-evaluate（p38） | L8 PDF 各頁 | p22 "Choose up front / Escalate on failure / Re-route each step"、"Hard part: one cheap planning mistake can waste many later actions"；p26 "Example limits are illustrative."；p29 "Completion time is the critical path, not the sum of every step"、"Cheaper can be slower"；p38 "Change one thing" | Confirmed |
| 29 | skyline 一詞來自資料庫的 Skyline operator：Börzsönyi、Kossmann、Stocker，ICDE 2001，DOI 10.1109/ICDE.2001.914855；只保留沒有被其他點在所有維度上支配的物件 | Crossref API；HandWiki 條目 | Crossref：title "The Skyline operator"、container "Proceedings 17th International Conference on Data Engineering"、authors Borzsony／Kossmann／Stocker；HandWiki："to keep only those objects that are not dominated by any other point on all dimensions" | Confirmed |
| 30 | Kapoor et al.〈AI Agents That Matter〉（2024）：agent benchmark 只看準確率，主張同時優化成本與準確率 | arXiv 2407.01502 摘要 | "there is a narrow focus on accuracy without attention to other metrics. … Our focus on cost in addition to accuracy motivates the new goal of jointly optimizing the two metrics." | Confirmed |
| 31 | leaderboard 網址 2026-10-22 已轉到作業 4 的頁面 | curl https://leaderboard.cs2680.com/ | 回 200，最終網址 https://leaderboard.cs2680.com/a4/ | Observed（文中寫「作業 3 的 leaderboard 已在 10/20 關閉」，照作業頁，不寫轉址細節） |
| 32 | A3 投影片 p6 與作業頁寫了 leaderboard 的初始密碼格式 | A3 投影片 p6；作業頁 Part 2 Step 1 | （不錄原文） | Observed（屬帳密資訊，文中不寫） |

## 文章處理

- #2、#4：課程自己前後不一致。#2 不提；#4 用一句話點出，主文照作業頁的評分表。
- #15：成本照作業頁的定義寫，並提醒每次呼叫都要記進 trace，不推論 leaderboard 實際用哪一個算。
- #16：手算例子用這組價格；步數、每步 token 數、快取命中率是本文假設，文中標明。
- #18：不列本機 5 題的 repo 名，也不談 26 題的內容。
- #22、#25：Pareto 排名例子與分數全部照規則手算，算術另用 Python 驗過。
- #28：每個槓桿只說「在這份作業裡對應到什麼」，不給具體做法或參數。
- #32：不寫。
