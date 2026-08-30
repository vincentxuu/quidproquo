---
title: "CMU 的 AI 學位：全美第一個 AI 學士，把「AI 該學什麼」寫成了畢業要求"
date: 2026-08-21
category: learning
tags:
  - cmu
  - ai-course
  - cs-course
  - learning-path
  - self-study
lang: zh-TW
type: deep-dive
tldr: "Stanford 沒有 AI 學位，AI 是 CS 底下的一條 track；CMU 2018 年開出全美第一個 B.S. in Artificial Intelligence，把 AI 拆成四個 cluster 並強制各修一門，還把倫理課列進畢業要求。碩士這條線則是 MSAII——不在 CS 系，在語言技術研究所，195 學分裡有 84 分是創業流程，最後要交一個能拿去募資的 capstone。查證時發現兩處官方頁面自己打架：AI Core 是 2 門還 3 門、總學分是 192 還 195。"
description: "Carnegie Mellon 的 AI 學位體系完整拆解：BSAI 的數學／CS／AI 三層核心與四個 cluster 電修、AI 輔系與雙主修的差異、MSAII 碩士的 195 學分結構與 capstone 設計，以及機器學習系另一條 MS in Machine Learning 路線，並標出官方頁面互相矛盾之處。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-21-cmu-ai-degree-en)

大多數學校的「AI 課程」是掛在資工系底下的一組選修。Stanford 是這樣，MIT 是這樣，Berkeley 也是這樣——你修完 CS 學位，順便修了幾門 AI 課。

**Carnegie Mellon 不是。** 2018 年它開出全美第一個獨立的 AI 學士學位，畢業證書上寫的是 Artificial Intelligence，不是 Computer Science。

這件事的意義不在「名字比較好聽」，而在於：**一旦要發學位，學校就被迫回答「AI 到底該學什麼」這個問題，而且要寫成白紙黑字的畢業要求。** 那份要求本身，比任何一份「AI 學習路徑」部落格文章都更值得讀——因為它是一整個學院吵出來、每年要對招生委員會負責的版本。

這篇拆解 CMU 這條線：學士怎麼排、輔系與雙主修差在哪、碩士有哪些，以及查證過程中撞到的兩處官方矛盾。

## 學士：BSAI 的四層結構

依 [CMU 課程總目錄](http://coursecatalog.web.cmu.edu/schools-colleges/schoolofcomputerscience/artificialintelligence)的官方說法：

> The program and its curriculum focus on how complex inputs — such as vision, language and huge databases — can be used to make decisions or enhance human capabilities.

畢業要求分成這幾塊：

| 區塊 | 門數 |
|---|---|
| Math and Statistics Core | 7 |
| Computer Science Core | 5 |
| Artificial Intelligence Core | 2 或 3（見下方矛盾） |
| **AI Cluster Electives** | **4（四個 cluster 各一門）** |
| Ethics Elective | 1 |
| SCS Electives | 2 |
| 人文與藝術 | 7（其中一門必須是認知科學或認知心理） |
| 科學與工程 | 4 |

### CS Core 是完整的資工地基，沒有打折

五門課是 CMU 資工本科生修的同一批：

```
15-122  Principles of Imperative Computation      12 units
15-150  Principles of Functional Programming      12 units
15-210  Parallel and Sequential Data Structures   12 units
15-213  Introduction to Computer Systems          12 units
15-251  Great Ideas in Theoretical Computer Science 12 units
```

**這點值得停下來看。** 很多人以為「AI 學位」是拿 AI 課換掉硬課，實際上剛好相反——15-213（電腦系統）和 15-251（理論計算）都在裡面，一門都沒少。AI 學位是**在資工地基上再疊 AI**，不是取代。

### 真正的設計在四個 cluster

BSAI 最有意思的規定是這條：**AI Cluster Electives 四門，必須從四個 cluster 各選一門**，不能全押同一個方向。

| Cluster | 部分選項 |
|---|---|
| Decision Making and Robotics | 15-386 Neural Computation、15-482 Autonomous Agents、16-350 Planning Techniques for Robotics、16-384 Robot Kinematics and Dynamics |
| Machine Learning | 10-403 Deep RL & Control、**10-414 Deep Learning Systems**、10-417 Intermediate Deep Learning、10-423 Generative AI、10-425 Convex Optimization、11-485 Intro to Deep Learning |
| Perception and Language | 11-411 NLP、11-442 Search Engines、11-492 Speech Technology for Conversational AI、15-387 Computational Perception、16-385 Computer Vision |
| Human-AI Interaction | 05-317 Design of AI Products、05-318 Human AI Interaction、05-391 Designing Human Centered Software |

這個「不准偏食」的設計是整份課表最強的觀點：**CMU 認為只會深度學習不算懂 AI**。你必須碰過規劃與機器人、碰過感知與語言、而且碰過人機互動——最後那個 cluster 尤其少見，多數學校的 AI 課表裡根本沒有 HCI 的位置。

順帶一提，[csdiy.wiki](https://csdiy.wiki/) 上收錄的 **CMU 10-414 Deep Learning Systems** 就在 Machine Learning cluster 裡，公開教材完整——想自學的人不必等學位，可以直接從這門開始。

### 倫理是畢業要求，不是加分項

Ethics Elective 是獨立一欄，必修一門。加上人文七門裡強制有一門認知科學或認知心理，**這份課表花在「人」上面的份量，比多數 AI 學程都重**。

## 輔系與雙主修：不是 SCS 學生的入口

依 [BSAI 官方頁](https://www.cs.cmu.edu/bs-in-artificial-intelligence/)：

> CMU offers both a minor in artificial intelligence and an additional (double) major. Both programs are open to students from any primary major.

兩者都對**所有主修**開放。但有個容易誤會的限制寫在[輔系頁](https://www.cs.cmu.edu/bs-in-artificial-intelligence/minor)上：

> Note: The AI minor is not available to SCS students, nor is there an AI concentration.

**資工學院自己的學生不能修 AI 輔系。** 邏輯上說得通——SCS 學生要走 AI，該走的是機器學習、機器人、語言技術、HCI 這幾個 concentration，而不是繞回來修一個為外系設計的輔系。

輔系是六門：AI core 三門 + 技術選修兩門（從三個 cluster 裡挑兩個不同的）+ 一門 AI 社會面向的課。

## 碩士：AI 學位在這裡換了一個系

問「CMU 有沒有 AI 碩士」，答案是**有，但它不在資工系**。

### MSAII：掛在語言技術研究所的創業型碩士

[Master of Science in Artificial Intelligence and Innovation (MSAII)](https://www.lti.cs.cmu.edu/academics/masters-programs/msaii.html) 由 Language Technologies Institute 開設，前身是 M.S. in Biotechnology, Innovation and Computing (MSBIC)。官方定位寫得很直白：

> It combines a rigorous AI and machine learning curriculum with real-world team experience in identifying an AI market niche and developing a responsive product in cooperation with external stakeholders.

學分結構：

| 區塊 | 學分 |
|---|---|
| Core Curriculum（含 36 學分 Capstone） | 84 |
| Knowledge Requirements | 72 |
| 核准選修 | ≥36 |
| LTI Practicum（配合暑期實習） | 3 |

**這裡的重點是 84 學分的 Core 幾乎不是 AI 課，是創業流程。** 官方說明它是「五門課的序列，對應創新開發的四個階段」——機會辨識、機會開發、商業計畫、事業孵化。學生分組調查 AI 應用領域、對教授與同學做簡報、提出產品提案，然後這個提案要撐過接下來三個學期，最後變成 11-699 Capstone Project。

> The purpose of the Core Curriculum is to prepare you to discover new AI applicants and develop them into a product suitable for further development, often leading to a startup enterprise.

真正的 AI 硬課在 72 學分的 Knowledge Requirements 裡（六門），例如 10-601 Machine Learning。選修池則橫跨 11-747 Neural Networks for NLP、11-777 Advanced Multimodal ML、10-605 ML with Large Datasets、15-780 Graduate Artificial Intelligence、16-824 Visual Learning and Recognition 等。

還有一條入學前的補課條款：**必須先通過 15-513 Introduction to Computer Systems（6 學分）**，通常在開學前的暑假修完，那是 15-213 的遠距版。沒過的話得在學期中補修，而且**那 6 學分不計入畢業學分**。

申請資訊（Fall 2027 梯次）：2026 年 9 月 9 日開放，早鳥截止 2026 年 11 月 18 日下午 3 點 EST，最終截止 2026 年 12 月 9 日；申請費早鳥 $80、之後 $100。

### 另一條線：機器學習系的 MS in Machine Learning

如果你要的是研究導向而非創業導向，[機器學習系（MLD）](https://www.ml.cmu.edu/academics/)有自己的碩士：

> The M.S. in Machine Learning is ideal for students preparing for a career in industry. This 16-month program is mostly coursework-based, with research being optional. It does not allow for a master's thesis.

16 個月、以修課為主、**不能寫碩士論文**。另有 M.S. in Machine Learning – Advanced Study 變體，所有變體的修課與 practicum 要求相同。

MLD 這邊的完整光譜比 LTI 寬：大學部有機器學習輔系、機器學習 concentration、Statistics and Machine Learning 雙主修；博士除了 ML PhD 之外還有四個聯合學位——Statistics and Machine Learning、Machine Learning and Public Policy、Neural Computation and Machine Learning、Autonomous & Human Decision Making。

**「Machine Learning and Public Policy」這個聯合博士值得單獨指出**，它跟 BSAI 把倫理列為必修是同一個institutional 取向：CMU 把「AI 的社會後果」當成學位結構的一部分，不是選配。

## 兩處官方頁面自己打架

查證時撞到兩個矛盾，兩邊都是 CMU 官方頁，這裡照實記下來，不自行「修正」成看起來合理的版本。

**矛盾一：AI Core 是 2 門還是 3 門。**

- [SCS 的 BSAI 課程頁](https://www.cs.cmu.edu/bs-in-artificial-intelligence/curriculum)寫「Artificial Intelligence Core (**3 Courses**)」
- [大學課程總目錄](http://coursecatalog.web.cmu.edu/schools-colleges/schoolofcomputerscience/artificialintelligence)寫「Artificial Intelligence Core (**2 courses**)」，列的是 07-280 Artificial Intelligence and Machine Learning I 與 07-380 Artificial Intelligence and Machine Learning II

課程頁還附了一句線索：「If you have already taken 10-301, please contact bsai@cs.cmu.edu about an alternate pathway to completing the AI core.」——看起來是**課程改版進行中**，07-280/07-380 這組新編號正在取代原本以 10-301（Introduction to Machine Learning）為主的舊路徑，兩個頁面停在不同版本。要申請的人請以系上為準，別照目錄猜。

**矛盾二：MSAII 總學分是 192 還是 195。**

同一頁 `msaii.html` 上，Curriculum 段落寫：

> In total, you will complete **195** eligible units of study, including 84 units of Core Curriculum (including the 36-unit Capstone), 72 units of Knowledge Requirements, at least 36 units of approved Electives and the LTI Practicum (3 units...).

但同一頁的 Preparation Prerequisite 段落寫：

> ...the units will not count toward your **192** eligible units of study.

84 + 72 + 36 = 192，加上 3 學分的 LTI Practicum 才是 195。**看起來是加了 Practicum 之後只改了一處**，舊數字留在另一段沒同步。這不影響你能不能畢業，但它是個提醒：**官方頁面不等於一致的頁面**，看到數字對不上時，先確認是不是版本沒同步，再去問系上。

## 跟 Stanford 比，差在哪

本站另有一篇 [Stanford CS 課程導讀](/posts/learning/2026-08-20-stanford-cs-course-map)，兩相對照差異很清楚：

| | Stanford | CMU |
|---|---|---|
| AI 學位 | 沒有，AI 是 CS 底下的 track | **有獨立 B.S. in Artificial Intelligence** |
| 課表怎麼定義 AI | 靠先修關係隱含 | **明文四個 cluster，強制各修一門** |
| 倫理 | 散在各課 | **獨立必修一欄** |
| 碩士 AI 學位 | 無同名學位 | MSAII（LTI）、MS in Machine Learning（MLD） |
| 公開教材 | 極多（CS229、CS224n、CS336 等） | 較分散，10-414、11-785、10-708 等有公開版 |

**自學者的實際結論**：Stanford 的教材更容易拿到，但 CMU 的課表更值得拿來當地圖。如果你在排自己的 AI 學習順序，BSAI 那份「四個 cluster 各一門」的要求可以直接抄——它是一個有人為它負責的答案，而不是某個部落格作者的偏好。

## 參考資料

- [B.S. in Artificial Intelligence（CMU School of Computer Science）](https://www.cs.cmu.edu/bs-in-artificial-intelligence/)
- [BSAI Curriculum（系上課程頁）](https://www.cs.cmu.edu/bs-in-artificial-intelligence/curriculum)
- [BSAI Minor（AI 輔系要求）](https://www.cs.cmu.edu/bs-in-artificial-intelligence/minor)
- [Artificial Intelligence Program（CMU 大學課程總目錄）](http://coursecatalog.web.cmu.edu/schools-colleges/schoolofcomputerscience/artificialintelligence)
- [School of Computer Science Courses（課程描述與先修條件）](http://coursecatalog.web.cmu.edu/schools-colleges/schoolofcomputerscience/courses)
- [Master of Science in Artificial Intelligence and Innovation（MSAII，LTI）](https://www.lti.cs.cmu.edu/academics/masters-programs/msaii.html)
- [Academics（CMU Machine Learning Department）](https://www.ml.cmu.edu/academics/)
- [csdiy.wiki 计算机自学指南（收錄 CMU 10-414、11-785、10-708 等公開課）](https://csdiy.wiki/)
- [Stanford CS 課程導讀：按先修關係排一次，從 CS106A 到 CS336](/posts/learning/2026-08-20-stanford-cs-course-map)
