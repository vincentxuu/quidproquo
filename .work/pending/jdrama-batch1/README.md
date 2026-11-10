# 日劇第一批（order 10 愛情喜劇與 BL、order 11 懸疑犯罪與動作）待提交備份

因 check:course-videos 紅燈（見 docs/governance/escalation-queue.md 2026-11-09 條目）無法提交文章，先備份在這裡。verify 轉綠後還原：

```bash
P=.work/pending/jdrama-batch1
for s in romance-comedy-bl mystery-crime-action; do
  cp $P/$s-zh.md.txt src/content/posts/film/2026-11-10-jdrama-$s.md
  cp $P/$s-en.md.txt src/content/posts/film/2026-11-10-jdrama-$s-en.md
  cp $P/$s-review.md .work/reviews/2026-11-10-jdrama-$s.md
done
```

兩篇互相連結，要一起還原。還要同步總覽篇系列地圖（改成 0–16 列：10–12 日劇三篇，陸劇以後順延到 13–16），並和韓劇職人篇（`.work/pending/kdrama-medical-legal-workplace/`）一起提交。卡片產生腳本在 session scratchpad（j1、j2），不在 repo；文章檔即為最終內容。
