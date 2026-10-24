# Review — 2026-10-22-ai-kb-evaluation-launch（order 19）

- 檔案：`src/content/posts/learning/2026-10-22-ai-kb-evaluation-launch.md`（中）、`-en.md`（英），各 127 行，中英行號一一對應，下文「L34」指中英兩檔的第 34 行。
- 審稿日期 2026-10-22。審稿者：獨立審稿員（沒參與寫作與精讀）。只寫報告，沒有改文章。
- 證據：`.work/research/building-knowledge-bases/extractions/_spotcheck-batch12.md` 第 8–14 節，以及本次回 `scratchpad/fulltext/o19-*`、`o19dl/` 的追加核對；Thakur 用 `thakur-2025-trec-rag-support.md` 與 order 11 第 150 行。系列一致性對照 order 0（`2026-10-22-knowledge-base-three-readers.md` 第 59–66 行）、order 11、order 16、order 17。規劃表範圍卡：`.work/series-plans/building-knowledge-bases.md` 的 Order 19。
- 機械檢查：`check-tw-terms` 0 blocking；`check-process-leak` 通過；`scan-ledger` 0 命中；`register-scan` 長句 12 句（約 91 句中 13%，介於綠線 10% 與處理線 15% 之間）、但書段落 4/42（9%）、引述區塊 0、單段 4 個以上數字 3（L17、L83、L114；L114 是 order 編號，屬誤報）、模板轉折 0。
- 統計：🔴 3、🟡 5、🟢 17。

## post-verify

- 🔴 **Joren 的 35–62% 不是「排除閉卷題之後」的數字（L34）**
  - 原句：中「給模型的資料明明不足以回答問題，模型仍有三到六成答對，即使排除了不給資料也答得出來的題目。換句話說，模型在用自己的知識補答案」；英 "models still got 35% to 62% of questions right, even after removing questions they could answer with no context at all. In other words, models fill in answers from their own knowledge."
  - 依據：`o19-joren2025-sufficient-context.txt` 第 117 行 "SOTA LLMs output correct responses 35–62% of the time with insufficient context" 是原始比例；第 632–633 行作者說閉卷就會 "mostly explains the 35–62% correct rate"。第 99–100 行「排除閉卷答對的題後仍然成立」只是定性說法，沒有給排除後的比例。正文把兩句接成「排除後仍有 35–62%」，而且下一句「換句話說，模型在用自己的知識」又和「已排除自己知道的題」矛盾。另外 Table 2（第 561–633 行）的成因還有猜中是非題、資料補了一部分線索、評審判錯。
  - 改法：中「給模型的資料明明不足以回答問題，模型仍有三到六成答對。作者認為大部分是模型本來就知道答案；其餘有的是是非題猜中，有的是資料雖然不夠，卻補上了模型缺的那一塊。換句話說，答對不代表知識庫有出力」；英 "even when the context wasn't enough to answer, models still got 35% to 62% right. The authors attribute most of that to what the models already knew; the rest comes from lucky guesses on yes/no questions or context that filled in a missing piece. In other words, a right answer doesn't mean the knowledge base did the work."
- 🔴 **「答不了的題，檢索指標應該接近零」與「前 K 名精確率、召回率」都出自 IR 頁，正文卻連到 LLM evaluation 頁（L23、L52）**
  - 原句：L52 中「Azure 的指南說，對這類題目，檢索指標應該接近零」；英 "Azure's guide says retrieval metrics on such questions should be close to zero"。L23 中「檢索階段看有沒有找到對的內容，用前 K 名的精確率、召回率這類指標（[Azure: LLM end-to-end evaluation](…rag-llm-evaluation-phase)）」；英同。
  - 依據：negative examples「as close to 0 as possible」與 Precision at K、Recall at K、MRR 都只在 `o19-azure-rag-ir-phase.github.md` 第 619–627 行（"Evaluate your search results" 一節）。`o19-azure-rag-eval-phase.md` 全頁沒有 negative examples（`grep -i negative` 0 筆），也沒有 precision／recall@K。IR 頁不在參考資料裡，而且紀錄寫明只讀了 1–56、396–420、518–639。讀者點連結找不到這兩句。
  - 改法（二選一）：
    1. 補 IR 頁：既然「Evaluate your search results」一節（第 616–627 行）已完整讀過，把 L23 的檢索部分與 L52 改連 IR 頁，在參考資料加 `- [Microsoft Azure Architecture Center, Information retrieval phase](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/rag/rag-information-retrieval)`，並在 `.work/` 證據檔註明只讀了相關章節。中 L23「Azure 的 RAG 指南把評估分成兩個階段：檢索階段用前 K 名的精確率、召回率這類指標看有沒有找到對的內容（[Azure: Information retrieval](…)）；回答階段另外看……（[Azure: LLM end-to-end evaluation](…)）」；英同結構。
    2. 不補：L23 刪掉「用前 K 名的精確率、召回率這類指標」；L52 中改「站內的〈私有語料 Retrieval Eval 實測〉提醒，這類題目不能用召回率硬算，要分開報；回答則要看有沒有拒答或追問」並刪掉 L56 重複的那句；英同。
- 🔴 **DoorDash 2024 的連結網址和讀過的不同（L36、L124）**
  - 原句：中英 `https://careersatdoordash.com/blog/large-language-modules-based-dasher-support`。
  - 依據：抽取紀錄與全文檔 `o19-doordash2024-dasher-support.md` 第 3 行的 URL Source 都是 `https://careersatdoordash.com/blog/large-language-modules-based-dasher-support-automation/`；正文少了 `-automation/`。這次不上網，沒辦法確認短網址會不會轉址，照讀過的網址改最保險。
  - 改法：中英 L36、L124 都換成 `https://careersatdoordash.com/blog/large-language-modules-based-dasher-support-automation/`，改完跑 `pnpm check:references`。
- 🟡 **DoorDash 的「五類錯誤」是五個品質面向，評審也不全是 LLM（L44）**
  - 原句：中「人工讀了數千份對話，整理出五類錯誤，再讓 LLM 評審照這五類檢查」；英 "sorted the errors into five categories; then an LLM judge checked against those five categories"。
  - 依據：`o19-doordash2024-dasher-support.md` 第 94–102 行 "categorize LLM chatbot quality aspects into five areas"：檢索正確、回答準確、文法與語言、切合上下文、切合 Dasher 的需求；監控是 "prompting a more sophisticated LLM or creating rules-based regular expression metrics"。原文的粗略指標是 Dasher feedback、human engagement rate、delivery speed，「使用者滿意度這類」可以接受。人工抽樣與持續校準（第 104 行）相符。
  - 改法：中「人工讀了數千份對話，把品質拆成五個面向：檢索對不對、回答準不準、語言通不通順、有沒有接上前文、有沒有回應到需求。每個面向各做一個監控，有的用 LLM 評審，有的用規則」；英 "people read thousands of conversations and broke quality into five aspects: retrieval correctness, response accuracy, language quality, coherence with the conversation, and relevance to the request. Each got its own monitor, some an LLM judge, some rule-based checks"。
- 🟡 **78%→43% 是 A/B 對照組比實驗組，不是前後比較（L83）**
  - 原句：中「在高流量的問題群裡，轉人工的比例從 78% 降到 43%」；英 "the share escalated to humans fell from 78% to 43%"。
  - 依據：`o19-doordash2025-ugc-kb.md` 第 90 行 "escalation rates drop from 78% in the control group to 43% in the treatment group"。
  - 改法：中「他們自述，在高流量的問題群裡做 A/B 測試，轉人工的比例對照組是 78%，用了新內容的實驗組是 43%」；英 "In an A/B test on high-traffic issue clusters, they report escalation rates of 78% in the control group and 43% with the new content"。
- 🟡 **Thakur 評的是「答案有沒有被引用支持」，不是答案對不對（L42）**
  - 原句：中「題目多了，自然會用 LLM 判斷答案對不對。order 11 提過 Thakur 等人的研究：拿 GPT-4o 排序系統的好壞，跟人工相當一致；但逐題比較，兩者只有約一半完全一致」；英同。
  - 依據：`thakur-2025-trec-rag-support.md`「限制」：只評支持度一個面向；逐筆是「答案句 × 引用段落」，從零標完全一致 56%；GPT-4o 偏寬鬆相符。order 11 第 150 行有寫「答案有沒有被引用的段落支持」，這裡省掉後讀者會以為量的是正確率。
  - 改法：中「order 11 提過 Thakur 等人的研究：讓 GPT-4o 判斷答案有沒有被引用的段落支持，拿來排系統的好壞，跟人工相當一致；逐筆比較，只有 56% 完全一致，而且 GPT-4o 比人寬鬆」；英 "Order 11 mentioned Thakur and colleagues' study: when GPT-4o judged whether answers were supported by their cited passages, its system rankings matched human judges well, but item by item they agreed exactly only 56% of the time, and GPT-4o was more lenient"。
- 🟢 **Azure LLM evaluation 頁（L23 回答部分、L42、L81）**：`o19-azure-rag-eval-phase.md` 第 85–90 行 groundedness、completeness、utilization、relevancy、correctness；第 248–251 行 "ideally a different language model than the one used to generate the result"；第 415–421 行文件與問題會變、要保存過去的評估。相符。
- 🟢 **RAGAS（L23、L97）**：`o19-es2024-ragas.txt` 第 177–182 行三個面向（faithfulness、answer relevance、context relevance）；WikiEval 50 題。正文只說「分成不同的指標」，沒有多寫指標數，正確。
- 🟢 **Roychowdhury（L34）**：第 317–322 行，檢索錯時 "the generator LLM is answering questions from it's enriched domain adapted knowledge, leading to a lower FaiFul and higher FacCor"。正文相符。可選補「尤其是做過領域調適的模型」：中「檢索錯了、答案卻對的那些題目（尤其是用電信資料微調過的模型）」；英 "(especially models fine-tuned on telecom data)"。
- 🟢 **DoorDash 2024 過時公開資訊（L36）**：第 49 行 "outdated or incorrect DoorDash-related information included during the LLM's training phase"。相符。
- 🟢 **Salemi（L38）**：Table 1 BM25 欄 KILT provenance Hit Ratio τ 0.019–0.216，LLM 標註接近 0；第 133–134 行文件不含答案也可能有用。「相關性很低」相符。「標註的出處本身不完整」是合理延伸，可接受。
- 🟢 **DoorDash 2025 流程（L83、L85）**：`o19-doordash2025-ugc-kb.md` 第 38、44、68–73 行，只挑轉人工、依頻率與嚴重度排序、內容專員與營運夥伴審稿。相符。
- 🟢 **系列交叉引用**：order 11 四種題型（第 127–134 行）與 order 17 越權測試（第 86 行）對得上 L50；order 16 前 5 名命中率（第 63 行）對得上 L29；order 9、order 11、總覽、三篇站內評估文的中英連結都存在。
- 🟢 **系列回顧與 order 0 一致（L114）**：order 0 第 59–66 行，個人 order 1–5（收件匣、放哪裡、怎麼連、工具、每週回顧）、團隊 order 6–10（文件類型、資訊架構、寫作規範、owner、搜尋紀錄）、AI order 11–19。L114 的分段與各段內容都對得上；讀者用「自己、同事、AI」，order 0 用「未來的自己、同事、模型」，意思一致。
- 🟢 **參考資料都讀過全文**：8 條外部來源都有全文檔；Thakur 正文讀完、參考文獻略讀。Azure IR 頁目前沒列，見上面 🔴。

## post-review

- 🟡 **開頭的 85%／11 題和例子表對不上（L17、L60–L68）**
  - 原句：L17 中「回答正確率 85%……只有 11 題的出處段落出現在前 5 名」；表格回答正確合計 12＋1＋0＋2＋1＝16 題（80%），檢索命中 9 題。
  - 依據：開頭和例子都是「20 題」，讀者會把兩者當同一次評估去對數字。另外表格「要追問」2 題只對 1 題，判讀段沒交代那一題。
  - 改法：讓開頭用表格的數字。中 L17「回答正確率 80%，大家準備上線。有人多看了一眼檢索的結果：14 題可回答的題目裡，只有 9 題的出處段落出現在前 5 名」；英 "80% of answers are correct … of the 14 answerable questions, the source passage appeared in the top 5 for only 9"。判讀段補一條：中「**要追問的題有一題直接給了答案。** 和前提錯那題一樣，是提示詞要求模型資訊不夠時先問清楚」；英 "**One follow-up question got a direct answer instead of a question back.** Like the false-premise one, it's a prompt fix: tell the model to ask when information is missing."
- 🟡 **長句 13%，有兩句 96 字（L23、L44）**
  - 原句：L23「Azure 的 RAG 指南把評估分成兩部分：……」；L44「DoorDash 的做法值得參考：他們先發現……」。
  - 依據：register-scan 12 句超過 60 字，接近 15% 處理線；最長兩句各塞了三到四件事。
  - 改法：L23 照上面 🔴 的改法分成兩句；L44 照上面 🟡 的改法拆成「先發現粗略指標不夠用」「拆成五個面向」「人工抽樣校準」三句。L34、L36、L38 的 70–83 字句順手在逗號處斷開即可。
- 🟢 **範圍卡覆蓋**：分開評（L21–30）、用 order 11 題庫（L27）、LLM 評審偏誤與人工校準（L40–46）、越權題與答不了的題（L48–56）、失敗案例回流到 owner 接回 order 9（L79–93）、題庫定期對照來源（L93）、不講框架比較（L19）、例子、自我檢查都在。範圍卡提到的 NVIDIA FACTS 沒用，不影響主張。
- 🟢 **示意表標明非實測（L77）**：有寫「這張表的數字是示意，不是實測」。可選把這句移到表格前（L60「假設 20 題的結果是」之後），讀者在看數字前就知道。
- 🟢 **自我檢查（L108–110）**：判準和範圍卡一致，也補了「出處標不完整」「題目容易猜對」兩種其他可能，和 Joren、Salemi 的限制對得上。改完 L34 後兩處說法一致。
- 🟢 **作者主張有標出來**：L46「我的建議是」、L85「是我的簡化說法」、L87「我的回流流程」、L97「是我依此推論的」，各一次，沒有堆疊。

## post-polish

- 🟢 **tldr 的「靠的是它自己的知識」（L8）**：作者說是「大部分」，改 L34 時一併收斂：中「模型仍有三到六成答對，多半靠它本來就知道」；英 "models still got 35% to 62% right, mostly from what they already knew"。
- 🟢 **Joren 的資料集（L97）**：「公開的維基百科類資料集」——用到的 FreshQA 不是維基百科，可改中「公開的問答資料集（HotpotQA、Musique、FreshQA）」；英 "public QA datasets (HotpotQA, Musique, FreshQA)"。
- 🟢 **數字密度**：L17、L83 各 4 個數字，改完上面兩條後仍是讀者判讀要用的數字，可留。
- 🟢 **英文版**：語氣自然；"permission-crossing questions" 全篇一致。

## 修正紀錄（2026-10-22）

- 🔴 與 🟡 主要項目已採用（中英同步）：Ahmed 數字與「換成新文件」、Bedrock 條件、Google 出處、repo 用語；Joren 說明、Azure IR 頁句子刪除、DoorDash 網址與五個品質面向、A/B 描述、Thakur 56%、例子數字與追問題說明。長句潤稿與 🟢 視為可選。
