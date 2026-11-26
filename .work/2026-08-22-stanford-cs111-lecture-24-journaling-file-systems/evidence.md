# 查證紀錄：2026-08-22-stanford-cs111-lecture-24-journaling-file-systems

（2026-11-12 從正文「逐頁核對清單」一節移出，依 writing-guide「查證過程不寫進正文」）

- 第 1–15 頁：由 Lecture 23 承擔 crash model、`fsck`、ordered writes 與 WAL 入口。
- 第 16–18 頁：logical／physical entry、idempotence、consistent group、Assignment 8 transaction。
- 第 19–22 頁：checkpoint、metadata-only logging、優缺點、delayed log writes、`fsync`、裝置失效。
- 第 23 頁：performance、durability、consistency 與可恢復失敗範圍的取捨。
