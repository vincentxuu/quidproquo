# Independent semantic review of advanced batch

Reviewer: foundations author, did not author or edit the reviewed advanced articles.

Review examines substantive paragraphs in both languages; no transcript or PDF visual-completeness claim. Sources cross-checked against source-audit and advanced primary-evidence; formula verification focuses on toy arithmetic.

Status: PASS: substantive content and final editorial corrections reviewed; hashes refreshed after corrections.


## src/content/posts/ai/2026-10-11-cmu10423-lecture-24a-audio-representation-asr.md

SHA256 `d4bcfe02d9d729bb82a050d4be0d552aee80fc3b239cf3e419c8112ade780c74`

Goal: 分清sample/frame/mel bin並計算shape與WER

Mechanism: waveform sample→STFT frame→mel aggregation→encoder/cross-attention→ASR autoregressive decoder

Example: 16000/window400/hop160,no-pad→98×201→98×80；convk3p1s2→49；WER兩edit/4=.5

Variation/answer: hop320→49frames→25positions；單插入4word WER=.25

Source premise: 明示非Whisper重現，Whisper實際padding/segment按程式；轉錄與翻譯不混

Actual section locations: 23: ## 聲音不是一列單字; 31: ## 一秒錄音，為什麼可能只有 98 個 frame; 45: ## ASR 如何把特徵變成可變長度的文字; 51: ## 轉錄驗收要看錯在哪; 60: ## 延伸閱讀; 65: ## 課程影片來源; 69: ## 參考資料


## src/content/posts/ai/2026-10-11-cmu10423-lecture-24a-audio-representation-asr-en.md

SHA256 `565a31893a32118c673dbe996fe996aa37d12474d64846eede0f76161fbfdd4a`

Goal: 分清sample/frame/mel bin並計算shape與WER

Mechanism: waveform sample→STFT frame→mel aggregation→encoder/cross-attention→ASR autoregressive decoder

Example: 16000/window400/hop160,no-pad→98×201→98×80；convk3p1s2→49；WER兩edit/4=.5

Variation/answer: hop320→49frames→25positions；單插入4word WER=.25

Source premise: 明示非Whisper重現，Whisper實際padding/segment按程式；轉錄與翻譯不混

Actual section locations: 23: ## Samples become time–frequency features; 31: ## A complete shape example; 45: ## Features become variable-length text; 51: ## Recognition needs a separate test; 60: ## Continue reading; 65: ## Course video sources; 69: ## References


## src/content/posts/ai/2026-10-11-cmu10423-lecture-24b-audio-generation.md

SHA256 `aa1ebdebf9b0fac3364985fb80127e500be16b8c6163ec3ae8d05084ab0df9f4`

Goal: 區分codec/生成器/decoder與擴散採樣，計算token與碼率

Mechanism: WaveNet波形AR、codec壓縮、generator條件token選擇、decoder重建、continuous diffusion互相區分

Example: 50frame/s×2codebooks1024→100indices/1000bit/s；20frame prompt40indices剩60

Variation/answer: 4codebooks512→200indices/1800bits/s，2sec400；shape正確但不遵從text指向conditional generator

Source premise: toy碼率非產品規格/音質保證；denoise step非audio time，mel需vocoder

Actual section locations: 23: ## 為什麼不一直預測下一個振幅; 29: ## Codec 是壓縮與重建，不是自動作曲; 37: ## 一秒聲音的完整 token 帳; 45: ## Diffusion 走的是另一條生成路徑; 51: ## 變式與真正的生成驗收; 58: ## 延伸閱讀; 63: ## 課程影片來源; 67: ## 參考資料


## src/content/posts/ai/2026-10-11-cmu10423-lecture-24b-audio-generation-en.md

SHA256 `fc9b8103704b7984b42bbd1f03aa6cd2790242528bcefd471bfce7590a379ce8`

Goal: 區分codec/生成器/decoder與擴散採樣，計算token與碼率

Mechanism: WaveNet波形AR、codec壓縮、generator條件token選擇、decoder重建、continuous diffusion互相區分

Example: 50frame/s×2codebooks1024→100indices/1000bit/s；20frame prompt40indices剩60

Variation/answer: 4codebooks512→200indices/1800bits/s，2sec400；shape正確但不遵從text指向conditional generator

Source premise: toy碼率非產品規格/音質保證；denoise step非audio time，mel需vocoder

Actual section locations: 23: ## Predicting individual samples; 29: ## A codec is not a composer; 37: ## A complete token budget; 45: ## Diffusion uses a different axis; 51: ## Variations and evaluation; 58: ## Continue reading; 63: ## Course video sources; 67: ## References


## src/content/posts/ai/2026-10-11-cmu10423-lecture-25-video-generation.md

SHA256 `256159491036b856f5ca4fc5b8212762bb4e7fffd7040b5212b17255abdfe325`

Goal: 能追時空attention shape並區分影片時間與去噪時間

Mechanism: 3D convolution與完整/分離spatial-temporal attention不同；影片time非diffusion time

Example: B2T3H2W2C4→spatial6×4×4/temporal8×3×4；scores96+72=168 vs288

Variation/answer: T6→192+288=480 vs1152；顏色穩但位置跳躍未通過temporal驗收

Source premise: score count非FLOPs/peak memory；reshape須permute，video VLM非generator，action另驗

Actual section locations: 23: ## 模型多看見一條軸; 31: ## 完整 reshape 算例; 39: ## 噪音與時間不是同一個 t; 47: ## 變式與時間驗收; 56: ## 延伸閱讀; 61: ## 課程影片來源; 65: ## 參考資料


## src/content/posts/ai/2026-10-11-cmu10423-lecture-25-video-generation-en.md

SHA256 `1691785309d05c29178327942a64072d4e8e1b457bd86eba02fd1e1b15704354`

Goal: 能追時空attention shape並區分影片時間與去噪時間

Mechanism: 3D convolution與完整/分離spatial-temporal attention不同；影片time非diffusion time

Example: B2T3H2W2C4→spatial6×4×4/temporal8×3×4；scores96+72=168 vs288

Variation/answer: T6→192+288=480 vs1152；顏色穩但位置跳躍未通過temporal驗收

Source premise: score count非FLOPs/peak memory；reshape須permute，video VLM非generator，action另驗

Actual section locations: 23: ## Adding time changes the problem; 29: ## A complete reshape example; 37: ## Video time and diffusion time differ; 45: ## Variations and evaluation; 54: ## Continue reading; 59: ## Course video sources; 63: ## References


## src/content/posts/ai/2026-10-11-cmu10423-lecture-26a-world-models.md

SHA256 `9bfee8e1aac338a5c54e5f741f5574cfb1971eb0ad391ad66e7b9a56c6836949`

Goal: 區分三種世界表示與動作介入證據

Mechanism: state/observation/action分開，3D視角/互動video/latent prediction各驗收；LAM train可看next inference不可

Example: x2 action+1→3→4→4，−1→1→0→0；z=x/4映.5→.75→1→1

Variation/answer: x4 +1,+1→4,4；−1,+1→3,4；latent背景換色測entanglement

Source premise: Genie latent code非鍵盤标签，少量label mapping；V-JEPA masked latent非action planning

Actual section locations: 23: ## 狀態、觀測與動作先分清楚; 29: ## 三種表示，各解決不同難題; 37: ## 同一格子世界的兩個未來; 45: ## Genie 的 latent action 不等於鍵盤標籤; 52: ## 延伸閱讀; 57: ## 課程影片來源; 61: ## 參考資料


## src/content/posts/ai/2026-10-11-cmu10423-lecture-26a-world-models-en.md

SHA256 `7ab67e5b428f634e2b859de4d05d3e33fdb6a6b65a85774fef243426414dd227`

Goal: 區分三種世界表示與動作介入證據

Mechanism: state/observation/action分開，3D視角/互動video/latent prediction各驗收；LAM train可看next inference不可

Example: x2 action+1→3→4→4，−1→1→0→0；z=x/4映.5→.75→1→1

Variation/answer: x4 +1,+1→4,4；−1,+1→3,4；latent背景換色測entanglement

Source premise: Genie latent code非鍵盤标签，少量label mapping；V-JEPA masked latent非action planning

Actual section locations: 23: ## State, observation, and action; 29: ## Three representations, three tests; 37: ## Two futures in one corridor; 45: ## Latent codes are not keyboard labels; 52: ## Continue reading; 57: ## Course video sources; 61: ## References


## src/content/posts/ai/2026-10-11-cmu10423-lecture-26b-science-of-alignment.md

SHA256 `3c4731dc71740374d9a588495d18f7a9f5d31dee69c96f2f28ec9ecdaa978c0e`

Goal: 區分worst-case共識成本、toy偏好與corrigibility定理條件

Mechanism: agreement M/N有限state ε/δ設定；存在hard instance量詞；corrigibility五utility優先次序有W1–W3前提

Example: A/B .8/.3差.5 fail ε.1，.55/.50差.05pass；binaryS,boundedR0–10 weight11→safe11>unsafe10

Variation/answer: 差.12 fail .1/pass .15；Rmax20破weight11；continuousS失.001不夠，明示toy非theorem

Source premise: general lower bound與restricted D dependence分開；單步PO off-switch optimalpolicy與multi-step error不同，無all-alignment-impossible

Actual section locations: 23: ## 共識是一個有定義的目標; 31: ## 一個共識算例，不冒充下界證明; 39: ## 可修正性不是「任務拿高分」; 47: ## 定理保證到哪裡; 56: ## 延伸閱讀; 61: ## 課程影片來源; 65: ## 參考資料


## src/content/posts/ai/2026-10-11-cmu10423-lecture-26b-science-of-alignment-en.md

SHA256 `55c1224d6b5ccf5b93d05c31feeb7e33dd91b82794562996bfd7dd3625369bac`

Goal: 區分worst-case共識成本、toy偏好與corrigibility定理條件

Mechanism: agreement M/N有限state ε/δ設定；存在hard instance量詞；corrigibility五utility優先次序有W1–W3前提

Example: A/B .8/.3差.5 fail ε.1，.55/.50差.05pass；binaryS,boundedR0–10 weight11→safe11>unsafe10

Variation/answer: 差.12 fail .1/pass .15；Rmax20破weight11；continuousS失.001不夠，明示toy非theorem

Source premise: general lower bound與restricted D dependence分開；單步PO off-switch optimalpolicy與multi-step error不同，無all-alignment-impossible

Actual section locations: 23: ## Agreement has a precise target; 31: ## An agreement example, not a complexity proof; 39: ## Corrigibility differs from task success; 47: ## The guarantees have assumptions; 56: ## Continue reading; 61: ## Course video sources; 65: ## References


## src/content/posts/ai/2026-10-11-cmu10423-lecture-19-long-context.md

SHA256 `b93b15447aafb7cc7279051e06c2a8a3dedb6f04a06844c0d2de1537142b5011`

Goal: 區分位置/記憶體/資訊取用並設計受控驗收

Mechanism: 位置表示、dense attention IO、KV儲存與資訊取用分開；interpolation不是品質保證

Example: L8→16位置0/4/8/12映0/2/4/6；KV每token65536 bytes；8192→512MiB

Variation/answer: 3/1/1/3→8/12；變式4/2/1/4→11/16；接受32k不能定位單一失敗原因

Source premise: Lost in Middle明確限定研究模型/任務，不擴張為所有模型

Actual section locations: 23: ## 位置延伸先處理模型沒看過的距離; 31: ## 能算得下是另一道門; 39: ## 一個可定位的長文實驗; 47: ## 變式怎樣區分失敗原因; 54: ## 延伸閱讀; 59: ## 課程影片來源; 63: ## 參考資料


## src/content/posts/ai/2026-10-11-cmu10423-lecture-19-long-context-en.md

SHA256 `1edbb0565ea73f0ca769438a59f18588aa90274778dd02a95761bb671eeed0a3`

Goal: 區分位置/記憶體/資訊取用並設計受控驗收

Mechanism: 位置表示、dense attention IO、KV儲存與資訊取用分開；interpolation不是品質保證

Example: L8→16位置0/4/8/12映0/2/4/6；KV每token65536 bytes；8192→512MiB

Variation/answer: 3/1/1/3→8/12；變式4/2/1/4→11/16；接受32k不能定位單一失敗原因

Source premise: Lost in Middle明確限定研究模型/任務，不擴張為所有模型

Actual section locations: 23: ## Extending positions; 31: ## Memory is a separate constraint; 39: ## A controlled retrieval experiment; 47: ## Variations diagnose causes; 54: ## Continue reading; 59: ## Course video sources; 63: ## References


## src/content/posts/ai/2026-09-30-cmu10423-reasoning-models.md

SHA256 `71c042bc351cb5500c8c18745f23d6186f111df5a459e7f8fb6eccdaccb273e1`

Goal: 能比較候選選擇與GRPO優勢且區分機制因果證據

Mechanism: CoT提示/STaR微調/RL參數更新/推論候選選擇分開；mechanistic介入不同於文字解釋

Example: 票價240+24=264；多數錯誤候選可選252；GRPO reward mean .5,std .5→±1

Variation/answer: clip .2正adv ratio1.3→1.2，負adv .7→−.8；reward全1中心化優勢0仍可能KL梯度

Source premise: R1與R1-Zero區別保留；o1不反推未公開pipeline；interpretability相關非因果

Actual section locations: 23: ## 訓練算力與推論算力改不同東西; 31: ## 候選多不多，先看能否驗證; 37: ## GRPO 如何用一組回答建立比較基準; 45: ## 「看懂步驟」與「看懂模型」; 54: ## 延伸閱讀; 59: ## 課程影片來源; 63: ## 參考資料


## src/content/posts/ai/2026-09-30-cmu10423-reasoning-models-en.md

SHA256 `b945da7217ff870fb65d36dbe765be8d7e17a615adc25ca2cbdd5ba7b4320f64`

Goal: 能比較候選選擇與GRPO優勢且區分機制因果證據

Mechanism: CoT提示/STaR微調/RL參數更新/推論候選選擇分開；mechanistic介入不同於文字解釋

Example: 票價240+24=264；多數錯誤候選可選252；GRPO reward mean .5,std .5→±1

Variation/answer: clip .2正adv ratio1.3→1.2，負adv .7→−.8；reward全1中心化優勢0仍可能KL梯度

Source premise: R1與R1-Zero區別保留；o1不反推未公開pipeline；interpretability相關非因果

Actual section locations: 23: ## Training and inference compute; 31: ## A worked candidate test; 37: ## GRPO's group-relative advantage; 45: ## Explanations and mechanisms; 54: ## Continue reading; 59: ## Course video sources; 63: ## References


## src/content/posts/ai/2026-10-11-cmu10423-lecture-21-state-space-models.md

SHA256 `4ed04f37111a668f4b2f6ec0fbce5884e78a59162723e96fa9ed812ff533dab3`

Goal: 從recurrence展開固定卷積並識別selection邊界

Mechanism: 連續/離散SSM分開，固定線性遞迴對應卷積；selection破壞固定kernel

Example: A=.5,inputs1/2/0→states1/2.5/1.25；kernel1/.5/.25一致；selective→1/2.1/1.89

Variation/answer: x4=1→1.625；[1,0]與[0,.5]同state .5，反例確立資訊壓縮限制

Source premise: 小例不是完整Mamba，硬體scan非固定卷積；hybrid非優點自動相加

Actual section locations: 23: ## 先看離散狀態，再回到連續系統; 31: ## 完整遞迴，完整展開; 45: ## Mamba 為什麼不能沿用同一個固定kernel; 53: ## 變式與記憶取捨; 62: ## 延伸閱讀; 67: ## 課程影片來源; 71: ## 參考資料


## src/content/posts/ai/2026-10-11-cmu10423-lecture-21-state-space-models-en.md

SHA256 `dec96975cf4150ff771a66e4f39180a609d49a3b418cdaaa834e2a6eb8e1bc78`

Goal: 從recurrence展開固定卷積並識別selection邊界

Mechanism: 連續/離散SSM分開，固定線性遞迴對應卷積；selection破壞固定kernel

Example: A=.5,inputs1/2/0→states1/2.5/1.25；kernel1/.5/.25一致；selective→1/2.1/1.89

Variation/answer: x4=1→1.625；[1,0]與[0,.5]同state .5，反例確立資訊壓縮限制

Source premise: 小例不是完整Mamba，硬體scan非固定卷積；hybrid非優點自動相加

Actual section locations: 23: ## Discrete and continuous systems; 29: ## Recurrence becomes convolution; 43: ## Selection breaks the fixed kernel; 51: ## Variation and tradeoffs; 60: ## Continue reading; 65: ## Course video sources; 69: ## References


## src/content/posts/ai/2026-10-11-cmu10423-lecture-22-real-world-risks.md

SHA256 `7f98aabfe26ce44c036af8fb33b0054b92eab1747b36e0b3212d5953bd813975`

Goal: 把不同危害對應不同資料流與指標

Mechanism: 幻覺、分群差異、間接攻擊、資料記憶、環境成本各有控制點

Example: 20題12known/8unknown，初18answers；擋9後剩8correct1wrong，coverage9/20 accuracy8/9

Variation/answer: 10attack3success→30%；0/10非普遍0；2000requests→4kWh/1.6kg

Source premise: 無現行法律結論；能源邊界排除training/manufacture

Actual section locations: 23: ## 同一個客服，四種失敗路徑; 29: ## 幻覺與不確定性，先定義可評分目標; 37: ## 攻擊入口要放在資料流上看; 43: ## 記憶、版權與環境成本不能混為幻覺; 52: ## 延伸閱讀; 57: ## 課程影片來源; 61: ## 參考資料


## src/content/posts/ai/2026-10-11-cmu10423-lecture-22-real-world-risks-en.md

SHA256 `57a6ed5e8d356e231bdc349d47d58bbabbb032b353f018f80263b61367af4ad8`

Goal: 把不同危害對應不同資料流與指標

Mechanism: 幻覺、分群差異、間接攻擊、資料記憶、環境成本各有控制點

Example: 20題12known/8unknown，初18answers；擋9後剩8correct1wrong，coverage9/20 accuracy8/9

Variation/answer: 10attack3success→30%；0/10非普遍0；2000requests→4kWh/1.6kg

Source premise: 無現行法律結論；能源邊界排除training/manufacture

Actual section locations: 23: ## Four paths in one assistant; 29: ## Accuracy, abstention, and coverage; 37: ## Follow the attack path; 43: ## Separate memorization and environmental costs; 52: ## Continue reading; 57: ## Course video sources; 61: ## References


## src/content/posts/ai/2026-09-30-cmu10423-code-generation-agents.md

SHA256 `98913823e8d627c3ca7d9e76d2c89880c45aa482f33a09a0b06abc4b729acfc3`

Goal: 能執行測試修復迴圈並計算pass@k與區分交付成功

Mechanism: 程式規格→測試→工具feedback→修復→停止；pass@k候選存在非selector成功

Example: clamp只min缺下界，max(lo,min(x,hi))修−2/3/8→0/3/5；n5c2 k1/2/3→.4/.7/.9

Variation/answer: n4c1k2→.5；lo>hi新增swap非原spec；NaN與型別未涵蓋

Source premise: HumanEval/SWE-bench評估條件不同；exit0零測試非證據，授權與工具觀測分開

Actual section locations: 23: ## 程式「像對」與「會對」分開; 31: ## pass@k 算的是候選集合機會; 39: ## 把生成放進可停止的工具迴圈; 47: ## Agent 還有程式正確性之外的界線; 54: ## 延伸閱讀; 59: ## 課程影片來源; 63: ## 參考資料


## src/content/posts/ai/2026-09-30-cmu10423-code-generation-agents-en.md

SHA256 `7452964d414735606c0162a74e43f1379e84a584713f68b97d015f67b3938fff`

Goal: 能執行測試修復迴圈並計算pass@k與區分交付成功

Mechanism: 程式規格→測試→工具feedback→修復→停止；pass@k候選存在非selector成功

Example: clamp只min缺下界，max(lo,min(x,hi))修−2/3/8→0/3/5；n5c2 k1/2/3→.4/.7/.9

Variation/answer: n4c1k2→.5；lo>hi新增swap非原spec；NaN與型別未涵蓋

Source premise: HumanEval/SWE-bench評估條件不同；exit0零測試非證據，授權與工具觀測分開

Actual section locations: 23: ## Execute the specification; 31: ## What pass@k estimates; 39: ## A stoppable tool loop; 47: ## Beyond functional correctness; 54: ## Continue reading; 59: ## Course video sources; 63: ## References