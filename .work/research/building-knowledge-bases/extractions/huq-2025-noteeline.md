# Huq et al. 2025 — NoTeeline: Supporting Real-Time, Personalized Notetaking with LLM-Enhanced Micronotes

read_status=read（arXiv v2 全文含附錄前的所有正文；角色：order 5 反證平衡——AI 協助整理筆記的正面效果）

## 書目（實際讀的版本）

- 作者：Faria Huq*、Abdus Samee*（共同第一作者）、David Chuan-En Lin、Xiaodi Alice Tang、Jeffrey P. Bigham（CMU；Samee 為 Bangladesh University of Engineering & Technology）。
- 正式出版：ACM DL 頁面 https://dl.acm.org/doi/10.1145/3708359.3712086，Published 2025-03-24（DOI 前綴對應 IUI '25；會議名稱以 ACM DL 為準，本紀錄未打開 ACM 頁確認版面）。
- **讀的檔是 arXiv:2409.16493v2 [cs.HC] 15 Oct 2024**（https://arxiv.org/pdf/2409.16493v2），版面仍是 ACM 範本佔位（「Conference'17, July 2017, Washington, DC」、DOI XXXXXXX），17 pages。正式版數字是否有改未比對；摘要句在 ACM DL 頁與 arXiv v2 一致（93.2%、8.33%、47.0%、43.9%）。

## 選這篇的理由與查詢

- Exa 查詢：「empirical user study 2024 LLM-assisted personal knowledge management note organization automatic tagging improves retrieval or sensemaking, controlled experiment」。
- 結果中候選：Google PAIR AutoNotes 部落格（2024，自動階層標籤；**設計師自用兩週的經驗文，不是實證研究**，排除）、NoTeeline（n=12 受試者內）、Marco（CHI 2024, n=16, 文件集資訊搜集快 16%、正確率無差）、Selenite（CHI 2024, n=12, LLM 概覽使閱讀快 36.3%、有效準則數 +90.4%）、OrgBox（SIGIR 2021，非 LLM）。
- 選 NoTeeline：唯一同時是「AI 協助整理個人筆記」（擴寫短筆記、按主題自動分組＝自動歸類、自動摘要、自動出複習題）且有對照的研究，和 Chen 2025 的情境（聽講／影片即時筆記）最接近，可正面對照。Marco、Selenite 未讀全文，不引用。

## 研究設計

- 受試者：12 人（北美，郵件名單與公告招募，$30 禮卡），**同一批人先做需求訪談、再做評估**。
- 設計：受試者內，NoTeeline vs baseline，各看一支影片記筆記；分四組平衡順序；每場 1 小時（含 onboarding 與自選影片試用）。
- baseline：同介面隱藏進階功能（模仿 Mac Notes），但**保留一個不依筆記、只依逐字稿的自動摘要**（模仿 NoteGPT）。
- NoTeeline 功能：使用者打「micronote」（縮寫短句）→ GPT-4-Turbo 依該時間點逐字稿＋onboarding 三則使用者範例擴寫成完整筆記；按主題重排（Order by Theme）；生成 5 題 cue 問題；生成個人化摘要。
- 量了什麼：
  - 行為：筆記長度（字數）、每則所花時間、筆記數、暫停／倒轉次數。
  - 自評：NASA-TLX（7 點）、SUS（改編，7 點）、擴寫品質評分、風格一致性評分、各功能評分。
  - 自動指標：GRUEN（語言品質）、HHEM（事實一致性，模型評分）、SBERT 相似度、Kilgarriff 卡方距離（文體）。
  - **沒有量理解、記憶或學習成果**。

## 可引用結果

1. **省字、省時**（§8.1）：每則筆記長度 NoTeeline μ=32.11（σ 12.33）vs baseline μ=60.64（σ 16.94）→ 摘要稱「47.0% less text」；每則時間 15.59 vs 27.79 → 「43.9% less time」；筆記數 18.75 vs 14.75；暫停／倒轉 0.56 vs 4.94 次。
2. **自評負荷較低**（§8.1.1）：Wilcoxon 單尾、Bonferroni 0.0125：Mental Demand p=0.0123、Effort p=0.0024、Frustration p=0.0047 顯著；Performance 不顯著（p=0.0803；baseline 5.58 vs 6.25）。
3. **可用性兩者一樣高**（§8.1.2）：SUS NoTeeline 80.972 vs baseline 80.833。
4. **擴寫品質**（§8.2）：使用者評 6.0/7（σ 1.044）；GRUEN 0.84 vs 0.56（p<0.0001, t(11)=10.87）；HHEM 幻覺率 6.8%（事實一致 93.2%）；文體卡方距離有範例 350.90 vs 無範例 382.78（8.33% 改善；12 人中 2 人反而變差：P1 −5.98%、P8 −3.75%）。
5. **擴寫內容偏向使用者的短筆記**：與 micronote 的 SBERT 相似度 0.58，與逐字稿 0.42（§8.2.5）。個人化摘要比 baseline 摘要與使用者筆記的相似度高 11%（§8.2.6）。
6. 偏好（§8.3.2, §9.1）：「All 12 participants wished to continue using NoTeeline in the future」；「All participants in the study preferred NoTeeline over the baseline」。P7 研究後繼續用於訪談標註。
7. 作者回應「省力是否降低投入」（§9.2）：「users are still responsible for initiating which parts of the material to take notes for and what information they want to capture」——與 Chen 2025 的 Intermediate AI 邏輯相同（人決定記什麼，AI 補細節）。
8. 負面回饋（§8.3.3）：4 則評論指擴寫冗長重複；5 人認為 cue 題太複雜；3 人複習時偏好自己的筆記而非摘要。

## 作者列的限制

- 只支援線性筆記；未整合視覺筆記。
- **未量資訊保留**（§10）：「we did not measure the long-term effect of NoTeeline on information retention. The primary goal of this work was to evaluate the system's ability to facilitate efficient note-taking, not to assess how the generated notes impact user learning outcomes.」

## 與摘要或常見轉述不一致處

1. 摘要說「significantly reduced mental effort」——顯著性只對 NASA-TLX 的 Mental Demand、Effort、Frustration 做了檢定；**「47.0% less text」「43.9% less time」、筆記數與暫停次數只報平均與標準差，正文沒有報統計檢定**（Fig. 5 圖說寫「significantly less」，但沒有檢定值）。
2. 「93.2% factual correctness」是 HHEM 模型自動評分，不是人工逐條核對。
3. 「47% less text」比較的是使用者**自己打的字**；最終筆記長度（擴寫後）不比 baseline 短——省的是打字，不是筆記量。
4. 樣本 12 人，且就是需求訪談那 12 人（對系統設計目標已熟悉），有需求特性偏誤；作者未列為限制。
5. 本研究容易被歸為「AI 筆記工具有效」的證據；它證明的是**效率與滿意度**，不是理解或記憶，不能拿來直接反駁 Chen 2025 的學習成績結果。

## 對 order 5 的意義（反證平衡）

- 正面：當 AI 只擴寫使用者自己挑的重點、並自動依主題分組時，使用者打字少、負荷低、不中斷觀看，而且全體偏好；顯示「人選、AI 補」的協作能保有控制感。
- 侷限：沒有學習成果數據；與 Chen 2025 一起看，能支持的是「AI 協助整理在效率上有利，學習效果要看人保留多少選擇與加工」，不能支持「AI 整理讓你學得更好」。

## 讀取紀錄

- 取得：`curl -sL -A "Mozilla/5.0" https://arxiv.org/pdf/2409.16493v2` → PDF 成功；`pdftotext -layout` 與非 layout 各抽一份。
- 全文檔：
  - `/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/noteeline-2025.flow.txt`（閱讀順序，2,285 行，94,175 bytes）：依序讀第 1–800 行（首頁圖、摘要、§1–§8.1.2）、800–1529 行（§8.1.2 結尾至 §11、Societal Impact、致謝、參考文獻開頭）。1525 行起為參考文獻與附錄（附錄含 prompts、問卷、Table 3–5），未逐條讀。
  - `…/fulltext/noteeline-2025.txt`（`-layout`，1,198 行，148,164 bytes）：未另讀，備查。
- 圖表數值：Fig. 6、7 為圖，數值取自正文；Table 1 與 Fig. 9 的逐人數字在文字檔中可讀到。
