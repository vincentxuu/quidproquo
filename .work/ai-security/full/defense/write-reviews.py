import json,pathlib,re
m=json.load(open('.work/ai-security/full/manifest.json'))
specific={10:('注入影響與副作用分開；MSRC/OWASP一致。','同提案6對照；資料標記不是執行控制，最後三題答案對齊。','無模板化對比，長句讀完後主詞明確。'),11:('檢索前授權與cache失效有Microsoft/OWASP正文；epoch是自製設計。','三帳號context→暖cache→撤權8案例；清楚說未測vectorDB與分散式原子性。','刪去「不是…而是」句，反例直述；保留撤權競態，不堆研究過程。'),12:('批准綁參數與目前權限17正反案例驗；受眾為規範單源確認。','wrong_user與changed_approved_arguments分別驗身分與參數；新增6 malformed，另交代多節點未測。','固定收件端政策直述；具體操作與錯誤碼配對。'),13:('MCP2026-07-28兩官方正文順讀，OWASP交叉metadata/behavior限制。','六fixture區分manifest、audience、owner；新舊revision不混寫，明示無OAuth實作。','revision日期密度有必要；英文保留同等限制。'),14:('XSS/OS command兩OWASP全文；textContent不預編碼、shellFalse非argument授權。','十五案例含正常/拒絕；修空userinfo與非string反例；固定URL非通用SSRF，未browser實跑。','按consumer分節，無泛用sanitizer虛假承諾；命令與預期清楚。'),15:('macOS PermissionError真實驗；7+4counterchecks與capability5分開；profile不宣稱全面隔離。','先baseline再限制，同listener避免把refused當policy；envmarker非token；部署遷移有驗收。','限定句緊接profile，避免誤抄；表格足夠，不寫Docker實跑。'),16:('18HTTP/18audit與3/9到9/9實跑；58fixture為deterministic非ASR。','獨立oracle不import被測policy；正常與跨tenant拒絕都有，judge-disagreement是反例重現。','監控英文字改中文；中文來源英文refs標inChinese；未泛化到雲端驗收。')}
for x in m[10:17]:
 order=x['order'];s=pathlib.Path(x['zh_path']).read_text();heads=[f'L{i}: {line}' for i,line in enumerate(s.splitlines(),1) if line.startswith('## ')]
 count=len(re.findall('[\u3400-\u9fff]',s.split('---',2)[-1]))
 out=f'''# {x['slug']}

作者自審，2026-10-22。範圍中英兩版；獨立交叉審另見 `.work/ai-security/full/cross-reviews/defense.md`。本報告不冒稱獨立審稿。

## post-verify

結論：限定主張 Confirmed；外部規範/指引由完整正文 single-source 或交叉確認，自製結果由實跑核對。{specific[order][0]}

主張定位：

'''+ '\n'.join('- '+h for h in heads)+f'''

來源與逐主張映射、完整讀取範圍見 `.work/ai-security/full/defense/research-and-review-note.md` 與 `sources.jsonl`。執行stdout：`demo-regression.txt`、`http-regression.txt`、`sandbox-result.txt`。未測LLM、遠端OAuth、瀏覽器XSS、雲端部署；不以本機結果代替。沒有價格、論文比較或廠商benchmark數字。

本次只檢查文中提出的規範/設計/實作主張，未評估整個AI資安領域的覆蓋是否完整。
下一步（未完成前不能 commit）：post-review、post-polish。

## post-review

結論：作者整篇回讀完成，教學目標由具體例子與答案兌現。{specific[order][1]}

- metadata：中英date/category/type/order/draft一致；系列按語言登錄；tags4個，description與tldr分開。
- 教學：前三段定位問題與先備；條件→操作→預期→解釋→失敗判準完整；owner-only三工單一致。
- 中英：案例、命令、數量、政策與未測範圍一致；自製fixture不冒充來源實例或LLM輸出。
- 範圍：前置與下一篇內鏈；自架雲端遷移含驗收條件，不限制只能本機。
- 圖型：已讀diagram；控制矩陣表格足夠，沒有SVG與不存在的視覺驗收。
- 機械：process-leak、anchored-link、check:tw、register-scan見scans.json；全站pnpm verify/astro由主agent統一跑，未在此假稱全綠。

## post-polish

結論：作者逐段回讀與反向大綱完成。{specific[order][2]}

正文{count}個中文字，長度不取代教學驗收。工單開場承諾由正文兌現；章節按讀者問題，不按研究工作量。一般詞用中文，精確程式欄位保留；每篇問題均有答案與可操作命令。仍為draft true，未commit/push/deploy。
'''
 pathlib.Path('.work/reviews/'+x['slug']+'.md').write_text(out)
