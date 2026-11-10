# 韓劇職人篇（order 8）待提交備份

因 check:course-videos 紅燈（見 docs/governance/escalation-queue.md 2026-11-09 條目）無法提交文章，先備份在這裡。verify 轉綠後還原：

```bash
P=.work/pending/kdrama-medical-legal-workplace
cp $P/post-zh.md.txt src/content/posts/film/2026-11-09-kdrama-medical-legal-workplace.md
cp $P/post-en.md.txt src/content/posts/film/2026-11-09-kdrama-medical-legal-workplace-en.md
cp $P/review.md .work/reviews/2026-11-09-kdrama-medical-legal-workplace.md
git apply --include='src/*' $P/overview-progress.patch  # progress.txt 那段已由 2026-11-10 的 progress 更新取代
```

然後 commit 這些檔案並刪除本資料夾。
