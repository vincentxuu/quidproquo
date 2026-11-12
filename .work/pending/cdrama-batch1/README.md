# 陸劇第一批（order 13 古裝愛情與仙俠、order 14 權謀懸疑武俠與奇幻）待提交備份

因 check:course-videos 紅燈無法提交文章，先備份在這裡。還原：

```bash
P=.work/pending/cdrama-batch1
for s in costume-romance-xianxia intrigue-mystery-wuxia; do
  [ -f $P/$s-zh.md.txt ] || continue
  cp $P/$s-zh.md.txt src/content/posts/film/2026-11-12-cdrama-$s.md
  cp $P/$s-en.md.txt src/content/posts/film/2026-11-12-cdrama-$s-en.md
  cp $P/$s-review.md .work/reviews/2026-11-12-cdrama-$s.md
done
```

和其他 pending（kdrama-medical-legal-workplace、jdrama-batch1、jdrama-batch2）一起還原，並同步總覽地圖。
