# Independent semantic review: main owned 30 files

Reviewer: rewrite_adaptation; not the author of these files. Read every bilingual teaching body and the four revised glossary entries. Source checking uses schedule/source-audit and sources/assessment-0.md; no claim of complete PDF visual inspection, playable lecture verification, deployment, or official grading.

## Findings and resolution

1. Required fix: P2P glossary promised unchanged layout/pixels; author narrowed to controlled attention with token/layer/timestep conditions. Final Chinese and English reread: resolved.
2. Required fix: ELBO glossary lacked fixed-p assumption for posterior-KL equivalence. Author added fixed p/only q and joint-VAE caveat in both languages. Final reread: resolved.
3. Minor traditional-Chinese cleanup communicated to author; no remaining teaching blocker found.

## Verdict

PASS for current recorded hashes: 3 bilingual assessment units and 12 bilingual relationship/assessment hubs. Hubs judged against relationship-map criteria, not as full single-lecture coverage. All have mechanisms/comparison, complete original example, answered check and separate lesson links; assessment units add independent task process and source-policy boundaries. Any later edits invalidate the corresponding review hash.

## src/content/posts/ai/2026-10-11-cmu10423-practice-exam.md

SHA256 `1d76e189413dd55ddbd003aa0653bc7c2715db2a662faeed44b5a731f2f62f2c`

- 目標：用錯誤分類指定下一個練習
- 機制：序列鏈式法則、teacher forcing與生成歷史區分
- 完整例子／核算：0.5×0.4×0.25=0.05；NLL2.996、平均0.999重算正確
- 變式答案／判準：末項改0.5得到0.1/NLL2.303；不推出整體品質
- 來源／邊界：assessment-0.md 第1.1原題與13主題核對；官方解答與自擬變式分明
- 具體位置：24: 練習卷能驗什麼; 30: 走完一個機率例子; 40: 把錯誤轉成可重做的任務; 46: 自我檢查：改一個條件; 61: 課程影片來源; 67: 參考資料
- 判定：PASS；中英概念、輸入與判準一致。

## src/content/posts/ai/2026-10-11-cmu10423-practice-exam-en.md

SHA256 `39d64dac1b12ed2f9a3aabf6e76316ad573877d1747b3be133c05702bc29f735`

- 目標：用錯誤分類指定下一個練習
- 機制：序列鏈式法則、teacher forcing與生成歷史區分
- 完整例子／核算：0.5×0.4×0.25=0.05；NLL2.996、平均0.999重算正確
- 變式答案／判準：末項改0.5得到0.1/NLL2.303；不推出整體品質
- 來源／邊界：assessment-0.md 第1.1原題與13主題核對；官方解答與自擬變式分明
- 具體位置：24: What the practice material covers; 30: A complete probability example; 40: Turn errors into reproducible tasks; 46: Check: change one condition; 59: Course Video Sources; 65: References
- 判定：PASS；中英概念、輸入與判準一致。

## src/content/posts/ai/2026-10-11-cmu10423-hw623-paper-report.md

SHA256 `daae71bc1d92dfe81d9d98d298cbb48973d18aafac298e4473d88204c0a54420`

- 目標：分清論文claim、作者實驗與自己的建議
- 機制：DPO問題/方法/證據分列，角色不免除查證
- 完整例子／核算：100題62/58%例子指出訓練資料混淆與缺paired uncertainty
- 變式答案／判準：70%不消除混淆；先要求同資料/底座比較
- 來源／邊界：assessment-0.md 六角色、清單22的DPO、5–10/7–10衝突、AI禁交件均核對
- 具體位置：24: 先定你要負責哪一種論證; 30: 把DPO拆成三個可核對的句子; 36: 一個證據判斷例子; 44: 自我檢查：一個漂亮數字夠不夠; 55: 做出可講、也可追問的報告; 63: 課程影片來源; 69: 參考資料
- 判定：PASS；中英概念、輸入與判準一致。

## src/content/posts/ai/2026-10-11-cmu10423-hw623-paper-report-en.md

SHA256 `e6006e725e80568a47d55b16c0992ff68e08be58e1b318af381b12f8497e8fa0`

- 目標：分清論文claim、作者實驗與自己的建議
- 機制：DPO問題/方法/證據分列，角色不免除查證
- 完整例子／核算：100題62/58%例子指出訓練資料混淆與缺paired uncertainty
- 變式答案／判準：70%不消除混淆；先要求同資料/底座比較
- 來源／邊界：assessment-0.md 六角色、清單22的DPO、5–10/7–10衝突、AI禁交件均核對
- 具體位置：24: Choose the argument you will own; 30: Separate problem, method, and evidence; 36: A complete evidence example; 44: Check: is a larger improvement enough?; 55: Build a presentation that survives questions; 63: Course Video Sources; 69: References
- 判定：PASS；中英概念、輸入與判準一致。

## src/content/posts/ai/2026-10-11-cmu10423-final-project.md

SHA256 `dd27fd1ddb3e79e8267409edb0b8b5cb5971e97789112a839e371168d55b93b1`

- 目標：定protocol與可重現比較
- 機制：固定唯一變因、配對資料、replication vs reimplementation
- 完整例子／核算：100題A60/B68，失15贏23，差8pp算對
- 變式答案／判準：同時換模型與資料不能歸因條件強度；單因素補實驗
- 來源／邊界：assessment-0.md replication要求、例外流程、AI disclosure與log要求核對
- 具體位置：24: 把題目縮成一個可以失敗的問題; 30: 走完一份小型實驗表; 38: 重現不是程式跑起來; 44: 自我檢查：兩個改善來源混在一起; 55: 把失敗與算力寫進主體; 63: 課程影片來源; 69: 參考資料
- 判定：PASS；中英概念、輸入與判準一致。

## src/content/posts/ai/2026-10-11-cmu10423-final-project-en.md

SHA256 `b3a5159bf89aacfd59cd7de3951149e48ff300066a0d385a3320575ec62611d4`

- 目標：定protocol與可重現比較
- 機制：固定唯一變因、配對資料、replication vs reimplementation
- 完整例子／核算：100題A60/B68，失15贏23，差8pp算對
- 變式答案／判準：同時換模型與資料不能歸因條件強度；單因素補實驗
- 來源／邊界：assessment-0.md replication要求、例外流程、AI disclosure與log要求核對
- 具體位置：24: Choose a question that can fail; 28: Work through a small experiment; 36: Replication means a result, not merely working code; 42: Check: can you attribute an improvement?; 53: Make failures and compute part of the argument; 61: Course Video Sources; 67: References
- 判定：PASS；中英概念、輸入與判準一致。

## src/content/posts/ai/2026-09-30-cmu10423-transformer-lm-decoding.md

SHA256 `ea93fdde6bba56ebcfde54d563c6df93f88038f907088d1957f6c4a8d9d49aa0`

- 目標：分模型讀取/訓練/抽樣
- 機制：attention先於output distribution，解碼不更新weights
- 完整例子／核算：A0.6/B0.3/C0.1→top-p0.8保留A/B；T0.5平方正規化
- 變式答案／判準：top-p0.5只A；原loss不改，生成評估可變
- 來源／邊界：L2/L3原引用保留；hub分篇links完整
- 具體位置：31: 先讀哪一篇; 39: 用一個例子看出分界; 43: 自我檢查; 54: 怎麼使用這張地圖; 60: 課程影片來源; 66: 更新紀錄; 73: 參考資料
- 判定：PASS；中英概念、輸入與判準一致。

## src/content/posts/ai/2026-09-30-cmu10423-transformer-lm-decoding-en.md

SHA256 `2a62671e372b5f2bdabd3a42b1d4347f123055956bb38058d10732aacebefb69`

- 目標：分模型讀取/訓練/抽樣
- 機制：attention先於output distribution，解碼不更新weights
- 完整例子／核算：A0.6/B0.3/C0.1→top-p0.8保留A/B；T0.5平方正規化
- 變式答案／判準：top-p0.5只A；原loss不改，生成評估可變
- 來源／邊界：L2/L3原引用保留；hub分篇links完整
- 具體位置：30: Choose a lesson; 38: A worked comparison; 42: Check your understanding; 53: How to use this map; 59: Course video sources; 65: Update Log; 72: References
- 判定：PASS；中英概念、輸入與判準一致。

## src/content/posts/ai/2026-09-30-cmu10423-variational-inference-vae.md

SHA256 `7e9d2f51b26c3d231c01bd22dd0b089fdfc0d90661ac1f005c215d22fda6732b`

- 目標：分diffusion與VAE latent含義
- 機制：noise chain vs posterior/prior；ELBO glossary限定固定p
- 完整例子／核算：x0=2/alpha0.25/epsilon0→xt1→還原2；VAE mu1/sigma0.5→z1→D2
- 變式答案／判準：單筆重建相同不證同distribution
- 來源／邊界：L8/L9引用完整；修正ELBO固定p條件已複審
- 具體位置：31: 先讀哪一篇; 39: 用一個例子看出分界; 43: 自我檢查; 54: 怎麼使用這張地圖; 60: 課程影片來源; 66: 更新紀錄; 73: 參考資料
- 判定：PASS；中英概念、輸入與判準一致。

## src/content/posts/ai/2026-09-30-cmu10423-variational-inference-vae-en.md

SHA256 `fd55814a948b0f14029f01a130ad2ec5589951ab38b0ca1752987cfe0c8e254b`

- 目標：分diffusion與VAE latent含義
- 機制：noise chain vs posterior/prior；ELBO glossary限定固定p
- 完整例子／核算：x0=2/alpha0.25/epsilon0→xt1→還原2；VAE mu1/sigma0.5→z1→D2
- 變式答案／判準：單筆重建相同不證同distribution
- 來源／邊界：L8/L9引用完整；修正ELBO固定p條件已複審
- 具體位置：30: Choose a lesson; 38: A worked comparison; 42: Check your understanding; 53: How to use this map; 59: Course video sources; 65: Update Log; 72: References
- 判定：PASS；中英概念、輸入與判準一致。

## src/content/posts/ai/2026-09-30-cmu10423-peft-in-context-learning.md

SHA256 `1d4cb9311b99a48c5d25e5c6f9f3da5a6dedc47c4ecdaa350f8b62503f63bfd0`

- 目標：分ICL上下文與PEFT參數更新
- 機制：示例占context不做step；LoRA透過BA更新
- 完整例子／核算：4×4 rank1 A1×4/B4×1共8，full16算對
- 變式答案／判準：效果持續不證LoRA，可能system/memory/底座能力
- 來源／邊界：L9末段/L10/L11來源界線正確、分篇links到達
- 具體位置：37: 先讀哪一篇; 45: 用一個例子看出分界; 49: 自我檢查; 60: 怎麼使用這張地圖; 66: 課程影片來源; 72: 更新紀錄; 79: 參考資料
- 判定：PASS；中英概念、輸入與判準一致。

## src/content/posts/ai/2026-09-30-cmu10423-peft-in-context-learning-en.md

SHA256 `469aba978357b2b35323cb0498733f50fe8368b54e42aef2892d0e461e7e5c32`

- 目標：分ICL上下文與PEFT參數更新
- 機制：示例占context不做step；LoRA透過BA更新
- 完整例子／核算：4×4 rank1 A1×4/B4×1共8，full16算對
- 變式答案／判準：效果持續不證LoRA，可能system/memory/底座能力
- 來源／邊界：L9末段/L10/L11來源界線正確、分篇links到達
- 具體位置：37: Choose a lesson; 45: A worked comparison; 49: Check your understanding; 60: How to use this map; 66: Course video sources; 72: Update Log; 79: References
- 判定：PASS；中英概念、輸入與判準一致。

## src/content/posts/ai/2026-09-30-cmu10423-ift-rlhf-dpo.md

SHA256 `dd6d5592957a2ab7d3782d1d870322110734685b42f9b1bd9ad6a3e9b61e06f9`

- 目標：分SFT/RLHF/DPO資料與loss
- 機制：SFT單回答 vs偏好對；reference-relative ratio
- 完整例子／核算：winner0.4/0.2 loser0.2/0.2 beta1→sigmoid2/3 loss0.405
- 變式答案／判準：相同policy/reference→losslog2，非任務中性保證
- 來源／邊界：DPO primary支持機制，原L11/12 refs保留
- 具體位置：38: 先讀哪一篇; 45: 用一個例子看出分界; 49: 自我檢查; 60: 怎麼使用這張地圖; 66: 課程影片來源; 72: 更新紀錄; 79: 參考資料
- 判定：PASS；中英概念、輸入與判準一致。

## src/content/posts/ai/2026-09-30-cmu10423-ift-rlhf-dpo-en.md

SHA256 `c529c5f5d1b82903e2de38adc9c8afd1c3cc581433908466166132e6256095fe`

- 目標：分SFT/RLHF/DPO資料與loss
- 機制：SFT單回答 vs偏好對；reference-relative ratio
- 完整例子／核算：winner0.4/0.2 loser0.2/0.2 beta1→sigmoid2/3 loss0.405
- 變式答案／判準：相同policy/reference→losslog2，非任務中性保證
- 來源／邊界：DPO primary支持機制，原L11/12 refs保留
- 具體位置：38: Choose a lesson; 45: A worked comparison; 49: Check your understanding; 60: How to use this map; 66: Course video sources; 72: Update Log; 79: References
- 判定：PASS；中英概念、輸入與判準一致。

## src/content/posts/ai/2026-09-30-cmu10423-text-to-image-vlm.md

SHA256 `332c2823273fc81657764c7dd66b1d7a29d27e5c0f5af847cc5a81946cf29d85`

- 目標：分讀圖與生圖方向
- 機制：text→noise denoising→image；image→encoder→LLM answer
- 完整例子／核算：紅杯toy，換蓝杯檢查grounding；輸入輸出判準完整
- 變式答案／判準：答顏色不證生圖，需各測
- 來源／邊界：L12/L13底本與原引用保留；沒有錯稱所有VLM只能讀圖
- 具體位置：29: 先讀哪一篇; 37: 用一個例子看出分界; 41: 自我檢查; 52: 怎麼使用這張地圖; 58: 課程影片來源; 64: 更新紀錄; 71: 參考資料
- 判定：PASS；中英概念、輸入與判準一致。

## src/content/posts/ai/2026-09-30-cmu10423-text-to-image-vlm-en.md

SHA256 `8ab665545e8d91cbbe48b32a6242cddef9b583ee778b82babc8cd166c4a5cd60`

- 目標：分讀圖與生圖方向
- 機制：text→noise denoising→image；image→encoder→LLM answer
- 完整例子／核算：紅杯toy，換蓝杯檢查grounding；輸入輸出判準完整
- 變式答案／判準：答顏色不證生圖，需各測
- 來源／邊界：L12/L13底本與原引用保留；沒有錯稱所有VLM只能讀圖
- 具體位置：29: Choose a lesson; 37: A worked comparison; 41: Check your understanding; 52: How to use this map; 58: Course video sources; 64: Update Log; 71: References
- 判定：PASS；中英概念、輸入與判準一致。

## src/content/posts/ai/2026-09-30-cmu10423-cross-attention-dit-qformer.md

SHA256 `860220bc1a0bca10bd877befabd52ef6ef0dcea1eefd394d2f003ff1535a8c71`

- 目標：分運算/骨幹/橋接
- 機制：cross Q來image KV來text；query outputs數由Q決定
- 完整例子／核算：4×3 weights×3×2 V→4×2；2query讀4feature→2×2
- 變式答案／判準：text3→5仍output4×2
- 來源／邊界：L14/15底本；P2P glossary已改不保證layout/背景全不動
- 具體位置：29: 先讀哪一篇; 37: 用一個例子看出分界; 41: 自我檢查; 52: 怎麼使用這張地圖; 58: 課程影片來源; 64: 更新紀錄; 71: 參考資料
- 判定：PASS；中英概念、輸入與判準一致。

## src/content/posts/ai/2026-09-30-cmu10423-cross-attention-dit-qformer-en.md

SHA256 `4076546489e1aca91d6f0a7f5f4804e97acb397aee7bf2ae45047e9dfa083dad`

- 目標：分運算/骨幹/橋接
- 機制：cross Q來image KV來text；query outputs數由Q決定
- 完整例子／核算：4×3 weights×3×2 V→4×2；2query讀4feature→2×2
- 變式答案／判準：text3→5仍output4×2
- 來源／邊界：L14/15底本；P2P glossary已改不保證layout/背景全不動
- 具體位置：29: Choose a lesson; 37: A worked comparison; 41: Check your understanding; 52: How to use this map; 58: Course video sources; 64: Update Log; 71: References
- 判定：PASS；中英概念、輸入與判準一致。

## src/content/posts/ai/2026-09-30-cmu10423-scaling-laws-moe.md

SHA256 `95326826c0e4aa7ebffc1976dec3030828b63a6bf7c6c8e8a9ddc5938228f0f8`

- 目標：分compute allocation與active capacity
- 機制：N×D預算與每token expert參數單位不同
- 完整例子／核算：N10D20=N20D10=200；4expert×100 total400 top2active200
- 變式答案／判準：top1 total400 active100，不代表負載相同
- 來源／邊界：L15/16 refs與新核心links正確
- 具體位置：31: 先讀哪一篇; 39: 用一個例子看出分界; 43: 自我檢查; 54: 怎麼使用這張地圖; 60: 課程影片來源; 66: 更新紀錄; 73: 參考資料
- 判定：PASS；中英概念、輸入與判準一致。

## src/content/posts/ai/2026-09-30-cmu10423-scaling-laws-moe-en.md

SHA256 `729ef6b77a3eb09a7669716773de664f745df11910a454383ae2429a6e969674`

- 目標：分compute allocation與active capacity
- 機制：N×D預算與每token expert參數單位不同
- 完整例子／核算：N10D20=N20D10=200；4expert×100 total400 top2active200
- 變式答案／判準：top1 total400 active100，不代表負載相同
- 來源／邊界：L15/16 refs與新核心links正確
- 具體位置：31: Choose a lesson; 39: A worked comparison; 43: Check your understanding; 54: How to use this map; 60: Course video sources; 66: Update Log; 73: References
- 判定：PASS；中英概念、輸入與判準一致。

## src/content/posts/ai/2026-09-30-cmu10423-distributed-efficient-inference.md

SHA256 `a5238a1effc4fb85f86e2fd76a6fff0e99699a14a40c284bb6afd8d0d4b098f4`

- 目標：分distributed updates與KV caching
- 機制：同步mean gradient vs復用historical K/V
- 完整例子／核算：兩等batch gradients2/6平均4，每卡同update；cache不平均梯度
- 變式答案／判準：不等batch需樣本加權
- 來源／邊界：L17/18 refs保留，hub不冒充完整效率教學
- 具體位置：33: 先讀哪一篇; 40: 用一個例子看出分界; 44: 自我檢查; 55: 怎麼使用這張地圖; 61: 課程影片來源; 67: 更新紀錄; 74: 參考資料
- 判定：PASS；中英概念、輸入與判準一致。

## src/content/posts/ai/2026-09-30-cmu10423-distributed-efficient-inference-en.md

SHA256 `b2fd55eb550ea3cc4bab704050edd408b60cb352215067c84536555d44f3a395`

- 目標：分distributed updates與KV caching
- 機制：同步mean gradient vs復用historical K/V
- 完整例子／核算：兩等batch gradients2/6平均4，每卡同update；cache不平均梯度
- 變式答案／判準：不等batch需樣本加權
- 來源／邊界：L17/18 refs保留，hub不冒充完整效率教學
- 具體位置：33: Choose a lesson; 40: A worked comparison; 44: Check your understanding; 55: How to use this map; 61: Course video sources; 67: Update Log; 74: References
- 判定：PASS；中英概念、輸入與判準一致。

## src/content/posts/ai/2026-09-30-cmu10423-long-context-ssm.md

SHA256 `5dd91e49358745a7080c890d167906c91b0bfc24f0060b817fa3ad253c0f1d15`

- 目標：分long-context可用性與SSM狀態機制
- 機制：固定state recurrence與position-controlled retrieval是兩檢查
- 完整例子／核算：h=[2,1,6.5,5.25]，初輸入直接貢獻0.25算對
- 變式答案／判準：first2→4 final5.5增0.25，不代替檢索證據
- 來源／邊界：L19/21來源與分篇links完整，不泛稱所有SSM固定衰减
- 具體位置：37: 先讀哪一篇; 45: 用一個例子看出分界; 49: 自我檢查; 60: 怎麼使用這張地圖; 66: 課程影片來源; 72: 更新紀錄; 79: 參考資料
- 判定：PASS；中英概念、輸入與判準一致。

## src/content/posts/ai/2026-09-30-cmu10423-long-context-ssm-en.md

SHA256 `def550b060da17ab204c6bc5dd3c413c8529d4e13909eac0a7ead0747d883a7d`

- 目標：分long-context可用性與SSM狀態機制
- 機制：固定state recurrence與position-controlled retrieval是兩檢查
- 完整例子／核算：h=[2,1,6.5,5.25]，初輸入直接貢獻0.25算對
- 變式答案／判準：first2→4 final5.5增0.25，不代替檢索證據
- 來源／邊界：L19/21來源與分篇links完整，不泛稱所有SSM固定衰减
- 具體位置：37: Choose a lesson; 45: A worked comparison; 49: Check your understanding; 60: How to use this map; 66: Course video sources; 72: Update Log; 79: References
- 判定：PASS；中英概念、輸入與判準一致。

## src/content/posts/ai/2026-09-30-cmu10423-risks-alignment.md

SHA256 `8191979f619d44446f9c10854bf4c0f86f1631aba55b5b483e02aeb98fbace07`

- 目標：分operational failures與formal bounds
- 機制：工具授權/injection観測 vs theorem前提
- 完整例子／核算：invoice指令、tool call與十案例成功範圍說清
- 變式答案／判準：100新增passing不證all injection防住
- 來源／邊界：L22/26來源與獨立篇對應，無普遍impossibility擴張
- 具體位置：37: 先讀哪一篇; 45: 用一個例子看出分界; 49: 自我檢查; 60: 怎麼使用這張地圖; 66: 課程影片來源; 72: 更新紀錄; 79: 參考資料
- 判定：PASS；中英概念、輸入與判準一致。

## src/content/posts/ai/2026-09-30-cmu10423-risks-alignment-en.md

SHA256 `13d4bd562195fba2e1b28f7965909f9e111b42cfc82ce143a6edbda56f81a1c5`

- 目標：分operational failures與formal bounds
- 機制：工具授權/injection観測 vs theorem前提
- 完整例子／核算：invoice指令、tool call與十案例成功範圍說清
- 變式答案／判準：100新增passing不證all injection防住
- 來源／邊界：L22/26來源與獨立篇對應，無普遍impossibility擴張
- 具體位置：37: Choose a lesson; 45: A worked comparison; 49: Check your understanding; 60: How to use this map; 66: Course video sources; 72: Update Log; 79: References
- 判定：PASS；中英概念、輸入與判準一致。

## src/content/posts/ai/2026-09-30-cmu10423-audio-video-world-models.md

SHA256 `a1da8693cbe7ec568bac5f2e562c4e0de0c91bcfbb523ea04a54ba8c9937ad22`

- 目標：分聲音/影片/動作條件轉移
- 機制：相同state改action驗反事實，流暢影片非dynamics
- 完整例子／核算：x0 right1/left−1，兩right2；忽略action fail
- 變式答案／判準：text prompt右走而無action介面不足驗互動
- 來源／邊界：L24–26 refs留，五核心link正確，98frames與audio篇對照
- 具體位置：37: 先讀哪一篇; 47: 用一個例子看出分界; 51: 自我檢查; 62: 怎麼使用這張地圖; 68: 課程影片來源; 74: 更新紀錄; 81: 參考資料
- 判定：PASS；中英概念、輸入與判準一致。

## src/content/posts/ai/2026-09-30-cmu10423-audio-video-world-models-en.md

SHA256 `e4b3eff415e1c302d87d8d53bcbda971780ad796782813280c9cd78a9b5c5fff`

- 目標：分聲音/影片/動作條件轉移
- 機制：相同state改action驗反事實，流暢影片非dynamics
- 完整例子／核算：x0 right1/left−1，兩right2；忽略action fail
- 變式答案／判準：text prompt右走而無action介面不足驗互動
- 來源／邊界：L24–26 refs留，五核心link正確，98frames與audio篇對照
- 具體位置：37: Choose a lesson; 47: A worked comparison; 51: Check your understanding; 62: How to use this map; 68: Course video sources; 74: Update Log; 81: References
- 判定：PASS；中英概念、輸入與判準一致。

## src/content/posts/ai/2026-09-30-cmu10423-exam-hw623-project.md

SHA256 `255a2ed3f5c400673ba070cb785b56b24d132dde6f6e1731c8e685d4f276a5eb`

- 目標：分考卷/報告/專案證據
- 機制：算式→查別人claim→自己controlled experiment
- 完整例子／核算：A100easy/B100hard均loss不能比模型；三種交付對照
- 變式答案／判準：code跑/文字順/答對均不單独證明research
- 來源／邊界：三assessment links與官方底本完整
- 具體位置：30: 先讀哪一篇; 38: 用一個例子看出分界; 42: 自我檢查; 53: 怎麼使用這張地圖; 59: 課程影片來源; 65: 更新紀錄; 72: 參考資料
- 判定：PASS；中英概念、輸入與判準一致。

## src/content/posts/ai/2026-09-30-cmu10423-exam-hw623-project-en.md

SHA256 `e0b0328acccb7cbdc08fcecf3360158c188f372cddff61190687266f206950c8`

- 目標：分考卷/報告/專案證據
- 機制：算式→查別人claim→自己controlled experiment
- 完整例子／核算：A100easy/B100hard均loss不能比模型；三種交付對照
- 變式答案／判準：code跑/文字順/答對均不單独證明research
- 來源／邊界：三assessment links與官方底本完整
- 具體位置：30: Choose a lesson; 38: A worked comparison; 42: Check your understanding; 53: How to use this map; 59: Course video sources; 65: Update Log; 72: References
- 判定：PASS；中英概念、輸入與判準一致。

## Full inherited glossary follow-up

Reviewed every inherited frontmatter glossary in the 30-file manifest, not only the initial four corrections. Final reread includes five additional bilingual pairs changed by main/fix-glossaries.py; the hashes above were regenerated after these changes.

- DPO glossary now describes a preference-directed reference-relative log-ratio objective and explicitly avoids per-response/per-token absolute-probability guarantees. This matches the standalone DPO lesson.
- Active-parameter glossary now distinguishes a rough arithmetic proxy from attention/router FLOPs, communication time, and memory conditioned on precision/sharding/cache. It matches the hub's warning about different units.
- World-model context now covers 3D scenes, interactive video, and latent states rather than reducing Lecture 26 to 3D physics. Mel/log-mel definition now explicitly adds the logarithm and distinguishes the representations.
- GCG transfer is now a possibility requiring target/defense testing, rather than a guarantee.
- Selective SSM now includes input-dependent discretization step Δ alongside B/C; fixed convolution-kernel caveat remains correct.
- Other inherited entries (causal mask, ancestral sampling, PEFT/prefix/ICL, instruction tuning/Bradley–Terry, VQ-VAE/SigLIP, Q-Former, 1F1B/online softmax, Ring Attention, corrigibility, and role-playing reports) have no substantive contradiction with the rewritten body. Entries can give extra contextual definitions beyond the hub body; they do not count as completing the linked single-lecture lessons.

Final verdict remains PASS for all 30 current recorded hashes. No unresolved substantive glossary defect found. Minor historical wording in dated update entries remains history and is not presented as a current access test.
