# 歸因但書修正：2026-10-14-re-explaining-existing-courses（中／英）

規則：writing-guide「但書與歸因不堆疊」。修法代號：①刪（讀者用不到）②縮回來源原意 ③寫成作者主張（節首說一次或「我」當主詞）。

## 檢查器計數（check-process-leak HEDGE）

| 檔 | 修改前 | 修改後 |
|---|---|---|
| zh `…courses.md` | 13（含「這是我的推論」與「我的推論」重疊計數 2 組） | 1（限制節「我的推論有七處」） |
| en `…courses-en.md` | 7 | 1（「對照本站」節首 "my judgment"） |

作者判斷的標示句（含檢查器沒抓到的「是我的延伸」「我會用」「我從間接證據推出來」）修改後：研究債一節 1 處、維護一節 0 處（改用轉折語）、「可以做的事」節首 1 處、「對照本站」節首 1 處＋段內「我會用 Diátaxis 自己的方法判斷」1 處、限制節集中清單 1 處。

## 逐處修改

| # | 位置 | 原句（zh） | 新句（zh） | 修法 | en 對應 |
|---|---|---|---|---|---|
| 1 | 研究債，AI agent 起稿段末 | …以及本站審稿實際擋下哪些錯。這是我的推論。 | …以及本站審稿實際擋下哪些錯。 | ① 前句已是「這個流程算不算外包…沒有研究測過」，本身就是作者提出的開放問題；延伸已在限制節列出 | 刪 "This is my inference." |
| 2 | 開放教科書，作者推測段 | …兩個所有學生都拿得到商業教科書的研究；這三篇我都沒讀，是作者轉述。 | …兩個所有學生都拿得到商業教科書的研究。 | ① 「作者舉的依據是」已標明轉述；沒讀原文集中在限制節「轉引」 | 刪 "I haven't read any of these three; they are as reported by the authors." |
| 3 | Hilton 逐篇細節後 | 這幾項都是 Hilton 轉述的單篇研究，原文我沒有讀。 | 這幾項都是 Hilton 轉述的單篇研究。 | ① 保留轉述歸屬，沒讀併入限制節 | 刪 "; I have not read the originals" |
| 4 | Koedel 條列第 4 點 | …在 0.08 到 0.17 之間，那幾篇我沒有讀。 | …在 0.08 到 0.17 之間。 | ① 「Koedel 等人轉述」已在句首 | 刪 "; I have not read them" |
| 5 | Hilton 轉述的兩份早期綜整 | …無法判定哪一套最有效。這兩份我都沒有讀，是 Hilton 轉述。 | …無法判定哪一套最有效。 | ① 段首「Hilton 的綜述在導言轉述了兩份」已歸屬 | 刪 "I have read neither; they are as reported by Hilton." |
| 6 | Diátaxis How to use 段 | …做完就發布。這是作者的工作建議，頁面沒有給依據。 | …做完就發布。 | ① 節標題已寫「依據是概念推導，不是資料」，「可以做的事」第 4 條寫「沒有研究」，限制節寫「兩份論證不是資料」 | 刪 "This is working advice from the site's author; the page gives no basis for it." |
| 7 | 維護節末 | 我的推論是：重講一門有作業與程式的課，成本不只是寫的那一次； | 放到課程導讀上，重講一門有作業與程式的課，成本不會只付寫的那一次； | ③ 前句「對象是主機商的系統設定教學，不是課程導讀」接轉折「放到課程導讀上」，判斷語氣，不會讀成研究發現；限制節清單已列 | "My inference: the cost…" → "Carried over to course guides, the cost…" |
| 8 | 「可以做的事」節首 | 下面每一條都標明依據。這個題目沒有直接的研究，所以多數是我的推論。 | 這個題目沒有直接的研究，下面五條是我從間接證據推出來的做法，每一條附上依據。 | ③ 節首立場講一次 | 同步改寫 |
| 9 | 「可以做的事」第 1 條 | 我的推論是，重講的價值不會來自… | 所以重講的價值不會來自… | ③ 節首已講立場，條內不再標 | "My inference is that the value…" → "So the value…" |
| 10 | 「對照本站」節首 | 和這篇有關的有五處： | 下面是我拿這些研究對照本站的判斷，和這篇有關的有五處： | ③ 節首立場講一次 | 加 "Below is my judgment from checking this site against these studies." |
| 11 | 對照表第 2 列第 3 欄 | 本站的選擇。那句原文談的是人；套到 agent 是我的推論，沒有研究測過 | 本站的選擇。那句原文談的是人，套到 agent 沒有研究測過 | ②＋③ 保留「原文談的是人」的歸屬界線，去標籤 | "…applying it to agents is my inference, and no study has tested it" → "…and no study has tested applying it to agents" |
| 12 | 對照表第 4 列第 3 欄 | 本站的選擇。這個對應是我的判斷；沒有研究比較過… | 本站的選擇。沒有研究比較過… | ③ 節首已講立場 | 刪 "The mapping is my reading;" |
| 13 | CS50 AI 第 6 週例子開頭 | 以…為例，我的對應是：前半… | 以…為例：前半… | ③ 節首已講立場 | "here is my mapping. The first half" → "as an example: the first half" |
| 14 | CS50 AI 第 6 週例子結尾 | 照 Diátaxis 的說法，這種混合要不要拆開，該用它自己的方法判斷：…。這是我的推論。 | 這種混合要不要拆開，我會用 Diátaxis 自己的方法判斷：…。 | ③ 改成「我」當主詞；原句「照 Diátaxis 的說法…」容易讀成 Diátaxis 對本站下的結論，改寫後不會 | "By Diátaxis's own account…This is my inference." → "Whether this mix should be split up, I would decide with Diátaxis's own method: …" |
| 15 | 限制節「我的推論有七處」 | …今晚可以做的三件事。正文都標了或在這裡列出。 | …今晚可以做的三件事。正文不逐處標示，集中列在這裡。 | 配合集中寫一次，更正說明句（七處清單不動） | "Each is marked in the text or listed here." → "The text doesn't mark each one; they are listed here." |
| 16 | 附錄 Clinton 與 Khan | …與表末的合計對不上，原文沒有說明。 | …與表末的合計對不上。 | ① 數字對不上本身就是資訊 | 刪 "; the paper doesn't explain" |
| 17 | 附錄 Ginns 等 | …和這份研究的條件名稱不符，原文沒有說明。 | …和這份研究的條件名稱不符。 | ① 同上 | 刪 "; the document doesn't explain" |

未改動：數字、引文、來源歸屬（「轉述」「作者推測」「這是推測，不是這份統合分析的結果」「『近乎零』是依其他研究的平均價格推論的」都保留）、「是我的延伸」（研究債一節唯一的立場句）、Blazar／極簡手冊原始研究「沒讀到全文所以不引」（影響讀者解讀，保留）、附錄與表格裡的「我算的」「我從 Table 3 數的」、「我讀的三頁沒有引用任何研究」。

## 沒把握的地方

- #2–#5 不在檢查器計數內（「我沒讀，是某某轉述」），是依同一條規則順手收斂：轉述歸屬都保留，「沒讀原文」集中在限制節的「轉引」清單。若想保留正文的逐處提醒，可回復。
- #6 刪掉後，Diátaxis 四問「沒有依據」只剩節標題、「可以做的事」第 4 條與限制節三處；讀者在那一段讀到四問時本身看不到「沒依據」。
- #9 用「所以」接，在節首立場下是作者推出的做法；若單獨引這一句，可能讀成研究的直接推論。
- 英文版剩的一處是節首 "my judgment"，中文對應句「對照本站的判斷」沒被檢查器抓到；兩邊意思一致，只是計數不同（zh 1、en 1，剛好落在不同句子）。
