from pathlib import Path
import json
p=Path('.work/series-plans/ai-security.md'); s=p.read_text(); s=s.replace('狀態：使用者要求直接完成全系列，order4–23研究／寫作／實作與交叉審閱進行中。','狀態：24篇中英48檔與配套完成；交叉審閱完成，最終品質閘門見full/acceptance.md。')
s=s.replace('待寫 |','中英草稿與實作／審稿完成 |').replace('中英草稿完成，待使用者審閱','中英草稿與審稿完成').replace('中英草稿與可執行範例完成，待使用者審閱','中英草稿與可執行範例／審稿完成').replace('中英草稿與14案例完成，待使用者審閱','中英草稿與14案例／審稿完成').replace('中英草稿與環境紀錄完成，待使用者審閱','中英草稿與環境紀錄／審稿完成').replace('狀態：尚未寫作；篇前完成來源精讀與實作驗證。','狀態：中英草稿與查證／審稿完成，詳見full/manifest.json及逐篇review。')
a=s.index('## 交付與驗收'); b=s.index('## 首批交稿紀錄',a)
s=s[:a]+'''## 交付與驗收
使用者「直接完成全系列」覆蓋兩篇停等；24篇中英48檔均完成，draft true。首兩批紀錄保留為歷史，不代表目前進度。
研究索引：`.work/ai-security/full/research-index.md`；完整manifest、實作產物、獨立交叉審與最終閘門見`.work/ai-security/full/acceptance.md`。未commit／push／deploy。

'''+s[b:]; s=s.replace('後續22篇仍待寫作；本批交閱後停下','當時後續22篇待寫；現已全系列完成').replace('後續20篇仍待寫作；','當時後續20篇待寫；現已全系列完成；')
p.write_text(s)
p=Path('progress.txt'); s=p.read_text(); lines=s.splitlines(); lines=[('- **AI資安系列 2026-10-22**：全24篇中英48檔與配套草稿完成，三線獨立交叉審必修已修；最終閘門與實測限制見 `.work/ai-security/full/acceptance.md`。SSOT `.work/series-plans/ai-security.md`；未commit/push/deploy。' if '**AI資安系列 2026-10-22**' in x else x) for x in lines]; p.write_text('\n'.join(lines)+'\n')
p=Path('.work/reviews/2026-10-22-ai-security-integrated-exercise.md'); s=p.read_text().replace('獨立交叉審完成前不標已獨立通過。','獨立交叉審已完成：full/cross-reviews/analyst-and-capstone.md，全文與程式、final run03及hash核對，無剩餘必修。').replace('獨立交叉審另補。','獨立交叉審已回讀中英並核對現存產物。');p.write_text(s)
for slug in ['overview','experiment-environments']:
 p=Path('.work/reviews/2026-10-22-ai-security-'+slug+'.md')
 with p.open('a') as f:f.write('\n## 全系列導覽更新複核\n2026-10-22：補齊24篇已存在的中英站內連結；order3接order4，未變更既有slug/date。最終delivery audit核對連結與語言。\n')
Path('.work/ai-security/full/research-index.md').write_text('''# 全系列研究與證據索引
2026-10-22。公開研究先搜尋完整callable inventory，Groundlane未掛載，使用Exa MCP讀取一手全文；此為fallback結果，不宣稱驗證Groundlane路徑。

- 共用0–1：../batch-1/research/research-note.md；2–3：../batch-2/研究與驗收；原課綱母群/coverage矩陣見.work/research/ai-security/。
- 攻擊4–9：attack/claims.md、writing-gate.md、sources.jsonl與raw全文。PortSwigger、NIST、AutoPenBench、Anthropic事件長版含限制與勘誤。固定動作重播不等於AI自主成效。
- 防護10–16：defense/research-and-review-note.md、sources.jsonl與raw全文。MCP固定revision、OWASP各控制層；58函式checks、18 HTTP與macOS沙盒結果分開。
- 調查17–22：analyst/research-note.md、sources.jsonl與raw全文。SIABench正文/附錄、OWASP Logging、GitHub功能與限制；不把廠商說明當獨立成效。
- 整合23：capstone-evidence.md；final source-matching產物integrated-run-03。其他舊run不是最終hash證據。

所有模型能力、雲端、第三方目標與Docker結果均未實測，不用固定案例數字代替它們。各組逐篇主張與原始來源的範圍優先於初始課綱來源代號；初始研究尚未飽和的說明是規劃時點紀錄。
''')
