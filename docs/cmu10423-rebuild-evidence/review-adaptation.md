# Adaptation獨立教學語意審稿
審稿者：root（未參與這28檔撰寫）。完整閱讀兩語教學主體與正式任務，另手算以下例子；來源檢索與作者數值檢查是輔助，不替代此審稿。
日期：2026-10-12。HW3/HW4舊研究過程整合與重複更新區修正後版本，逐檔hash如下。
不認證未取得錄影、逐字稿、完整PDF圖表視覺核對或實際GPU訓練。

## src/content/posts/ai/2026-10-11-cmu10423-peft.md
SHA256: `f2cfc939b86b423a0a1c849d9484f143800fdf8f5afd4d911c33d66a7f14de16`
判定：通過教學語意審稿。
學習目標：計算低秩參數量與首次梯度。
正文機制：4×3權重的rank1更新BA；A非零B零使初次dA零。
完整例子（輸入→計算→結果→解讀）：Ax=1，輸出[1,2,0,-1]，參數7對12。
檢驗及答案：rank2成本14；同時零初始化停滯；與前述目標一致。
具體位置：L21 為什麼先問「要更新哪裡」；L27 把低秩更新真的算一次；L33 初始化與梯度為何重要；L39 其他 PEFT 方法改了不同部位；L43 變式練習與答案；L47 課程影片來源；L51 參考資料。
中文與英文例子、條件、限制相符；原官方任務與本站toy分清。

## src/content/posts/ai/2026-10-11-cmu10423-peft-en.md
SHA256: `ad2bd12c703dbd8681c56cbd53177ece46b1e3d0360a41a81e323953aa0487d2`
判定：通過教學語意審稿。
學習目標：計算低秩參數量與首次梯度。
正文機制：4×3權重的rank1更新BA；A非零B零使初次dA零。
完整例子（輸入→計算→結果→解讀）：Ax=1，輸出[1,2,0,-1]，參數7對12。
檢驗及答案：rank2成本14；同時零初始化停滯；與前述目標一致。
具體位置：L21 Ask what actually gets updated；L27 Work through the update；L33 Initialization determines the first gradients；L39 Other PEFT methods change other components；L43 Check your understanding；L47 Course video sources；L51 References。
中文與英文例子、條件、限制相符；原官方任務與本站toy分清。

## src/content/posts/ai/2026-10-11-cmu10423-lecture-11a-in-context-learning.md
SHA256: `fa28810289bad14d0fe6f71b5cb1fa25ffb64774a0be865209676c258d2ee6f6`
判定：通過教學語意審稿。
學習目標：區分ICL與參數微調，設計控制實驗。
正文機制：同一權重由上下文示例改條件分布。
完整例子（輸入→計算→結果→解讀）：電影同一輸入用A/B標籤，控制順序、相關性與映射。
檢驗及答案：固定權重不代表輸出固定；需反轉標籤測例；與前述目標一致。
具體位置：L21 同一個模型，為什麼換提示就換答案；L27 一個可控制的分類例子；L33 為何示例可以有用，也可能誤導；L39 推理示例不是正確性的保證；L43 變式練習與答案；L47 課程影片來源；L51 參考資料。
中文與英文例子、條件、限制相符；原官方任務與本站toy分清。

## src/content/posts/ai/2026-10-11-cmu10423-lecture-11a-in-context-learning-en.md
SHA256: `17350ef060e7680d28143c32100da0e4aa29ea130d0b4c1a058695cbff77cc64`
判定：通過教學語意審稿。
學習目標：區分ICL與參數微調，設計控制實驗。
正文機制：同一權重由上下文示例改條件分布。
完整例子（輸入→計算→結果→解讀）：電影同一輸入用A/B標籤，控制順序、相關性與映射。
檢驗及答案：固定權重不代表輸出固定；需反轉標籤測例；與前述目標一致。
具體位置：L21 Same weights, different conditions；L27 A controlled classification example；L33 Useful examples can also mislead；L39 Reasoning examples do not guarantee correctness；L43 Check your understanding；L47 Course video sources；L51 References。
中文與英文例子、條件、限制相符；原官方任務與本站toy分清。

## src/content/posts/ai/2026-10-11-cmu10423-lecture-11b-sft-rlhf.md
SHA256: `4083c269b70e0814ae846c3ecbaec41a18e6baad5949531236bb2c4ab042d31a`
判定：通過教學語意審稿。
學習目標：區分SFT、reward與PPO訊號。
正文機制：示範NLL、偏好BT、reference KL與old-policy ratio。
完整例子（輸入→計算→結果→解讀）：兩token .5/.25 NLL=2.079；reward差2 sigmoid=.881。
檢驗及答案：負sample logratio不代表負KL，期望與單樣本分清；與前述目標一致。
具體位置：L21 三種資料，三種訓練訊號；L27 同一個客服問題走三階段；L33 Reference 為什麼留在流程裡；L39 能學到偏好，仍要另外驗證事實；L43 變式練習與答案；L47 課程影片來源；L51 參考資料。
中文與英文例子、條件、限制相符；原官方任務與本站toy分清。

## src/content/posts/ai/2026-10-11-cmu10423-lecture-11b-sft-rlhf-en.md
SHA256: `bf757839330eab876d5c0593eec3b826eaa0cd7897efbe3a80fbdc79f8afa6d1`
判定：通過教學語意審稿。
學習目標：區分SFT、reward與PPO訊號。
正文機制：示範NLL、偏好BT、reference KL與old-policy ratio。
完整例子（輸入→計算→結果→解讀）：兩token .5/.25 NLL=2.079；reward差2 sigmoid=.881。
檢驗及答案：負sample logratio不代表負KL，期望與單樣本分清；與前述目標一致。
具體位置：L21 Three kinds of data, three learning signals；L27 Follow one support question through the pipeline；L33 Why keep a reference policy?；L39 Preference fit still needs factual evaluation；L43 Check your understanding；L47 Course video sources；L51 References。
中文與英文例子、條件、限制相符；原官方任務與本站toy分清。

## src/content/posts/ai/2026-10-11-cmu10423-lecture-12a-dpo.md
SHA256: `8d60d724b8365cea8f18a56ccaf047ecada97f87ceaf45a75c8eb1a13333e0e7`
判定：通過教學語意審稿。
學習目標：由reference logratio算DPO。
正文機制：同prompt normalizer相消；β與winner/loser比值。
完整例子（輸入→計算→結果→解讀）：β=.5，policy ratio3/reference ratio2，loss=.5969。
檢驗及答案：比reference退步時s=-.3466，loss=.8814；與前述目標一致。
具體位置：L21 把兩階段流程改寫成一個 loss；L27 為什麼 Z 可以不算；L33 一筆可重算的數值例子；L39 梯度說了什麼，也沒有說什麼；L45 變式練習與答案；L49 課程影片來源；L53 參考資料。
中文與英文例子、條件、限制相符；原官方任務與本站toy分清。

## src/content/posts/ai/2026-10-11-cmu10423-lecture-12a-dpo-en.md
SHA256: `7df7668bd3b1c13ea01557afde12a0d55377e7a597487eb2c97d8f8759df7958`
判定：通過教學語意審稿。
學習目標：由reference logratio算DPO。
正文機制：同prompt normalizer相消；β與winner/loser比值。
完整例子（輸入→計算→結果→解讀）：β=.5，policy ratio3/reference ratio2，loss=.5969。
檢驗及答案：比reference退步時s=-.3466，loss=.8814；與前述目標一致。
具體位置：L21 Turn a two-stage pipeline into one loss；L27 Why the normalizer disappears；L33 Calculate a pair；L39 What the gradient does and does not imply；L45 Check your understanding；L49 Course video sources；L53 References。
中文與英文例子、條件、限制相符；原官方任務與本站toy分清。

## src/content/posts/ai/2026-09-30-cmu10423-hw3-lora-gpt2.md
SHA256: `f1294a1777e8b307deac99f21f7ce1c0da2bd1ae7eaa8c94b23c23d854602275`
判定：通過教學語意審稿。
學習目標：驗LoRA梯度、資料與未見評估。
正文機制：固定W、B梯度與answer-only shifted labels。
完整例子（輸入→計算→結果→解讀）：loss .5，B梯度[-1,0,0,0]，lr .1後loss .405。
檢驗及答案：lr .2後loss .32；底座變動即不合格，reload與原tests；與前述目標一致。
具體位置：L26 作業不是把 loss 跑低就結束；L32 自擬的一次 forward/backward；L38 把測試接回語言模型資料；L44 評估與儲存要驗同一件事；L50 變式練習與答案；L54 把驗收接回官方作業；L70 課程影片來源。
中文與英文例子、條件、限制相符；原官方任務與本站toy分清。

## src/content/posts/ai/2026-09-30-cmu10423-hw3-lora-gpt2-en.md
SHA256: `b38f7fa1d339fb30131a67431bd1bde926df9fa7b1674210a5530ae6c07b2fbf`
判定：通過教學語意審稿。
學習目標：驗LoRA梯度、資料與未見評估。
正文機制：固定W、B梯度與answer-only shifted labels。
完整例子（輸入→計算→結果→解讀）：loss .5，B梯度[-1,0,0,0]，lr .1後loss .405。
檢驗及答案：lr .2後loss .32；底座變動即不合格，reload與原tests；與前述目標一致。
具體位置：L26 Falling loss is not the whole assignment；L32 An original forward/backward test；L38 Connect the test to language-model data；L44 Evaluation and reload tests；L50 Check your understanding；L54 Connect the tests to the official assignment；L70 Course video sources。
中文與英文例子、條件、限制相符；原官方任務與本站toy分清。

## src/content/posts/ai/2026-10-11-cmu10423-lecture-12b-latent-diffusion.md
SHA256: `7e4e6ec6f09ddfcce370a1919b88e4f202e11c0383220961420a18ad6e2223a5`
判定：通過教學語意審稿。
學習目標：追latent形狀與條件去噪。
正文機制：autoencoder空間壓縮和文字條件分工，訓練vs生成。
完整例子（輸入→計算→結果→解讀）：3072到256元素為12倍；zt=1，epshat=-.5→x0hat=1.625。
檢驗及答案：epshat=-1→x0hat=2；移除文字控制驗條件；與前述目標一致。
具體位置：L21 先把兩條資料流分開；L27 一張小圖片的形狀與數值；L33 訓練見真圖，生成從噪聲開始；L39 文字條件還有其他設計；L43 變式練習與答案；L47 課程影片來源；L51 參考資料。
中文與英文例子、條件、限制相符；原官方任務與本站toy分清。

## src/content/posts/ai/2026-10-11-cmu10423-lecture-12b-latent-diffusion-en.md
SHA256: `b5e7c3bff4c586150dfc4115e83b49342683d99b720b9c85a98070becd4968e8`
判定：通過教學語意審稿。
學習目標：追latent形狀與條件去噪。
正文機制：autoencoder空間壓縮和文字條件分工，訓練vs生成。
完整例子（輸入→計算→結果→解讀）：3072到256元素為12倍；zt=1，epshat=-.5→x0hat=1.625。
檢驗及答案：epshat=-1→x0hat=2；移除文字控制驗條件；與前述目標一致。
具體位置：L21 Separate two data paths；L27 Shapes and one coordinate；L33 Training sees images; generation starts with noise；L39 Text-to-image has other architectures；L43 Check your understanding；L47 Course video sources；L51 References。
中文與英文例子、條件、限制相符；原官方任務與本站toy分清。

## src/content/posts/ai/2026-10-11-cmu10423-lecture-13-vision-language.md
SHA256: `8691779c4a4f243bd9df0257d2b50740146dd3bde6a314df7dd84149b53e7bf3`
判定：通過教學語意審稿。
學習目標：追image encoder、橋接與LLM。
正文機制：patch projection後與文字序列對齊；CLIP不是生成器。
完整例子（輸入→計算→結果→解讀）：8×8圖patch4得到4×6→4×8，再接3text共7tokens。
檢驗及答案：patch2共19tokens；換圖/空圖控制防語言prior誤認；與前述目標一致。
具體位置：L21 圖片不能直接當文字 token；L27 一張圖片走完形狀；L33 對比學習與生成回答不同；L39 答對一次不是圖像理解驗收；L43 變式練習與答案；L47 課程影片來源；L51 參考資料。
中文與英文例子、條件、限制相符；原官方任務與本站toy分清。

## src/content/posts/ai/2026-10-11-cmu10423-lecture-13-vision-language-en.md
SHA256: `5aa37c8d877737ad14273c1f132d4cf291ad2644f31c5d67c254e02c9101597d`
判定：通過教學語意審稿。
學習目標：追image encoder、橋接與LLM。
正文機制：patch projection後與文字序列對齊；CLIP不是生成器。
完整例子（輸入→計算→結果→解讀）：8×8圖patch4得到4×6→4×8，再接3text共7tokens。
檢驗及答案：patch2共19tokens；換圖/空圖控制防語言prior誤認；與前述目標一致。
具體位置：L21 An image is not a text token；L27 Follow the shapes through one image；L33 Contrastive learning and answer generation differ；L39 One correct answer is insufficient；L43 Check your understanding；L47 Course video sources；L51 References。
中文與英文例子、條件、限制相符；原官方任務與本站toy分清。

## src/content/posts/ai/2026-10-11-cmu10423-lecture-14-cross-attention-dit.md
SHA256: `bfb59477b5d15e3d0c3b5243e940734e312b9e7e96b7814dea9ad268e4f477f1`
判定：通過教學語意審稿。
學習目標：辨cross-attention、DiT與CFG。
正文機制：Q來自待更新表示、KV來自条件，DiT不限文字cross。
完整例子（輸入→計算→結果→解讀）：logits[0,ln3]讀[2,6]得5；16token pairs256。
檢驗及答案：value[0,8]得6；CFG s0=uncond，P2P無pixel保證；與前述目標一致。
具體位置：L21 問題不是只有換成 Transformer；L27 一個位置怎麼讀兩個詞；L33 DiT 改骨幹，條件注入還要另外說；L39 CFG 與 Prompt-to-Prompt 的兩種控制；L45 變式練習與答案；L49 課程影片來源；L53 參考資料。
中文與英文例子、條件、限制相符；原官方任務與本站toy分清。

## src/content/posts/ai/2026-10-11-cmu10423-lecture-14-cross-attention-dit-en.md
SHA256: `bdce55e124f481f7f94f48a8b6b4e24674beed82d47bac599eb883d9b3da31a3`
判定：通過教學語意審稿。
學習目標：辨cross-attention、DiT與CFG。
正文機制：Q來自待更新表示、KV來自条件，DiT不限文字cross。
完整例子（輸入→計算→結果→解讀）：logits[0,ln3]讀[2,6]得5；16token pairs256。
檢驗及答案：value[0,8]得6；CFG s0=uncond，P2P無pixel保證；與前述目標一致。
具體位置：L21 More than replacing a backbone；L27 One position reads two words；L33 DiT changes the backbone；L39 Two other control mechanisms；L45 Check your understanding；L49 Course video sources；L53 References。
中文與英文例子、條件、限制相符；原官方任務與本站toy分清。

## src/content/posts/ai/2026-10-11-cmu10423-lecture-15a-qformer.md
SHA256: `24799b5e0d6eabb9b22953190d785c39d95c1e07d945a7c3e2ca521afc5addf3`
判定：通過教學語意審稿。
學習目標：辨BLIP2與HW4橋接方向。
正文機制：learned queries bottleneck、兩階段loss及凍結LLM傳梯度。
完整例子（輸入→計算→結果→解讀）：4features→2×4→2×8；兩weights讀得2和4.4。
檢驗及答案：16sources仍2×4 output；同weights無多資訊保證；與前述目標一致。
具體位置：L21 先問橋接方向，再問 query 數量；L27 自擬的兩個 query 讀取；L33 BLIP-2 的兩階段不是同一個 loss；L39 HW4 則把箭頭反過來；L45 變式練習與答案；L49 課程影片來源；L53 參考資料。
中文與英文例子、條件、限制相符；原官方任務與本站toy分清。

## src/content/posts/ai/2026-10-11-cmu10423-lecture-15a-qformer-en.md
SHA256: `7fd05a3e13a7a91ba9da0881f8c5ff22119cbd69a7016f538292191b1e276398`
判定：通過教學語意審稿。
學習目標：辨BLIP2與HW4橋接方向。
正文機制：learned queries bottleneck、兩階段loss及凍結LLM傳梯度。
完整例子（輸入→計算→結果→解讀）：4features→2×4→2×8；兩weights讀得2和4.4。
檢驗及答案：16sources仍2×4 output；同weights無多資訊保證；與前述目標一致。
具體位置：L21 Identify the direction of the bridge；L27 Two queries read an image；L33 BLIP-2 has two training stages；L39 Assignment 4 reverses the direction；L45 Check your understanding；L49 Course video sources；L53 References。
中文與英文例子、條件、限制相符；原官方任務與本站toy分清。

## src/content/posts/ai/2026-09-30-cmu10423-hw4-qformer-text-to-image.md
SHA256: `c57107e799d118a5b01de78cf545413c505e3a9076ff4820f86dc6a588db1e30`
判定：通過教學語意審稿。
學習目標：檢查凍結底座後梯度與文字控制。
正文機制：freeze權重不同於no_grad全forward；mask與配對。
完整例子（輸入→計算→結果→解讀）：h2,a.5,zt.2,target.8：loss .08，grad .8→a.42 loss .0288。
檢驗及答案：h0梯度零不意味斷圖；shuffle、reload、starter測試；與前述目標一致。
具體位置：L34 橋接器要同時通過三種檢查；L40 自擬的一次條件去噪；L46 no_grad 要放在正確邊界；L52 條件 mask 與 batch 對應；L58 變式練習與答案；L62 把橋接驗收接回正式任務；L78 課程影片來源。
中文與英文例子、條件、限制相符；原官方任務與本站toy分清。

## src/content/posts/ai/2026-09-30-cmu10423-hw4-qformer-text-to-image-en.md
SHA256: `8c6e59417c28c1b785ca1eacb0f5fc8fe0b684415cce15bf8629b698b047de78`
判定：通過教學語意審稿。
學習目標：檢查凍結底座後梯度與文字控制。
正文機制：freeze權重不同於no_grad全forward；mask與配對。
完整例子（輸入→計算→結果→解讀）：h2,a.5,zt.2,target.8：loss .08，grad .8→a.42 loss .0288。
檢驗及答案：h0梯度零不意味斷圖；shuffle、reload、starter測試；與前述目標一致。
具體位置：L34 Three separate checks for the bridge；L40 An original conditioned-denoising step；L46 Place no_grad at the right boundary；L52 Masks and pairings；L58 Check your understanding；L62 Connect the bridge to the specified task；L78 Course video sources。
中文與英文例子、條件、限制相符；原官方任務與本站toy分清。

## src/content/posts/ai/2026-10-11-cmu10423-lecture-15b-scaling-laws.md
SHA256: `d7a8ed19a1aa8a31b5bf38c7a956033b8753cf4338b1a8689c70a4ecbc46f59b`
判定：通過教學語意審稿。
學習目標：固定compute選模型/資料配置。
正文機制：C約6ND，empirical loss假設和serving成本分清。
完整例子（輸入→計算→結果→解讀）：C2400；N40D10 loss2.8974；N20D20 loss2.7889。
檢驗及答案：N10D40對稱同A；資料係數改變須重算最適；與前述目標一致。
具體位置：L21 大模型與多資料不是同一件事；L27 用固定預算算一次；L33 Kaplan 與 Chinchilla 在比較什麼；L39 訓練最佳不一定是服務最佳；L45 變式練習與答案；L49 課程影片來源；L53 參考資料。
中文與英文例子、條件、限制相符；原官方任務與本站toy分清。

## src/content/posts/ai/2026-10-11-cmu10423-lecture-15b-scaling-laws-en.md
SHA256: `e5af31e20a37a658a767ec7daa123ea532ebb542a3a58f4228047b52ed9cc1ac`
判定：通過教學語意審稿。
學習目標：固定compute選模型/資料配置。
正文機制：C約6ND，empirical loss假設和serving成本分清。
完整例子（輸入→計算→結果→解讀）：C2400；N40D10 loss2.8974；N20D20 loss2.7889。
檢驗及答案：N10D40對稱同A；資料係數改變須重算最適；與前述目標一致。
具體位置：L21 Parameters and data are different resources；L27 Calculate a fixed-budget example；L33 Read empirical conclusions in context；L39 Training-optimal is not serving-optimal；L45 Check your understanding；L49 Course video sources；L53 References。
中文與英文例子、條件、限制相符；原官方任務與本站toy分清。

## src/content/posts/ai/2026-10-11-cmu10423-lecture-16-mixture-of-experts.md
SHA256: `04fb44ec8995bd348adb25dcb366ba24123e52cad1af3627d7f621836e6286e6`
判定：通過教學語意審稿。
學習目標：辨total/active參數與router負載。
正文機制：topk權重normalization、overflow與alltoall。
完整例子（輸入→計算→結果→解讀）：6M total4M active；.625×2+.375×(-2)=.5；overflow4。
檢驗及答案：top1 active3M但total6M；負載均衡不保証效率；與前述目標一致。
具體位置：L21 一個 token 不必使用所有專家；L27 四專家的自擬例子；L33 為何負載是模型的一部分；L39 放到多 GPU 後增加什麼成本；L45 變式練習與答案；L49 課程影片來源；L53 參考資料。
中文與英文例子、條件、限制相符；原官方任務與本站toy分清。

## src/content/posts/ai/2026-10-11-cmu10423-lecture-16-mixture-of-experts-en.md
SHA256: `21e421a09eef7e82a78b68056d851812c97448f87b20a4d7dd50243eb0c100b6`
判定：通過教學語意審稿。
學習目標：辨total/active參數與router負載。
正文機制：topk權重normalization、overflow與alltoall。
完整例子（輸入→計算→結果→解讀）：6M total4M active；.625×2+.375×(-2)=.5；overflow4。
檢驗及答案：top1 active3M但total6M；負載均衡不保証效率；與前述目標一致。
具體位置：L21 A token need not use every expert；L27 An original four-expert example；L33 Load is part of the design；L39 Multi-GPU execution adds communication；L45 Check your understanding；L49 Course video sources；L53 References。
中文與英文例子、條件、限制相符；原官方任務與本站toy分清。

## src/content/posts/ai/2026-10-11-cmu10423-lecture-17-distributed-training.md
SHA256: `1064f8c6384951c61d77ddc917776298d73f356feb83b1cc60af8569126293d1`
判定：通過教學語意審稿。
學習目標：核算data parallel同步更新。
正文機制：localmean按樣本數加權；TP/PP/ZeRO不同切分。
完整例子（輸入→計算→結果→解讀）：gA=-2,gB=2平均0；Btarget2後平均-1→w1.1。
檢驗及答案：1與3樣本gradmeans-2/2→global1→w.9；與前述目標一致。
具體位置：L21 多張 GPU 不是一種單一方法；L27 兩張卡算出同一個更新；L33 不均等 batch 要按樣本數加權；L39 模型與狀態的兩種切分；L45 變式練習與答案；L49 課程影片來源；L53 參考資料。
中文與英文例子、條件、限制相符；原官方任務與本站toy分清。

## src/content/posts/ai/2026-10-11-cmu10423-lecture-17-distributed-training-en.md
SHA256: `567fc87c5b6e4cf8ea63290102e10ef4a9cb6493c3ea351970bf9908daafdde0`
判定：通過教學語意審稿。
學習目標：核算data parallel同步更新。
正文機制：localmean按樣本數加權；TP/PP/ZeRO不同切分。
完整例子（輸入→計算→結果→解讀）：gA=-2,gB=2平均0；Btarget2後平均-1→w1.1。
檢驗及答案：1與3樣本gradmeans-2/2→global1→w.9；與前述目標一致。
具體位置：L21 More GPUs do not specify one algorithm；L27 Calculate one synchronized step；L33 Unequal batches require weighting；L39 Splitting models versus splitting state；L45 Check your understanding；L49 Course video sources；L53 References。
中文與英文例子、條件、限制相符；原官方任務與本站toy分清。

## src/content/posts/ai/2026-10-11-cmu10423-lecture-18-efficient-inference.md
SHA256: `3a51f41c3d4dfa1c43dcd6d4e43716a41797465b7e1797dc8b50c2539be1ef85`
判定：通過教學語意審稿。
學習目標：區分IO、歷史重算與draft驗證。
正文機制：online softmax rescale；KV heads；p/q接受及殘差。
完整例子（輸入→計算→結果→解讀）：ln3後l4/3,o20/3→5；cache2560bytes；p.6/.4恢復。
檢驗及答案：q.2/.8接受1/.5殘差a；温度top-p需使用處理後p/q；與前述目標一致。
具體位置：L21 三種方法，省的是不同成本；L27 分塊讀取仍得到同一答案；L33 Prefill 與 decode 的 KV 成本；L39 推測解碼為何不能直接信 draft；L45 變式練習與答案；L49 課程影片來源；L53 參考資料。
中文與英文例子、條件、限制相符；原官方任務與本站toy分清。

## src/content/posts/ai/2026-10-11-cmu10423-lecture-18-efficient-inference-en.md
SHA256: `d1dc0e8969f23a5230a6494a5c04820035987f2049c8ac0a19b4d2c19c255fb0`
判定：通過教學語意審稿。
學習目標：區分IO、歷史重算與draft驗證。
正文機制：online softmax rescale；KV heads；p/q接受及殘差。
完整例子（輸入→計算→結果→解讀）：ln3後l4/3,o20/3→5；cache2560bytes；p.6/.4恢復。
檢驗及答案：q.2/.8接受1/.5殘差a；温度top-p需使用處理後p/q；與前述目標一致。
具體位置：L21 Three methods address different costs；L27 Blockwise readout preserves the answer；L33 Prefill, decode, and cache memory；L39 Why draft proposals require correction；L45 Check your understanding；L49 Course video sources；L53 References。
中文與英文例子、條件、限制相符；原官方任務與本站toy分清。
