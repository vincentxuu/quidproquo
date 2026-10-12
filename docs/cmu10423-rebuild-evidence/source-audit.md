# CMU 10-423 官方來源核對（2026-10-11）
## 取得方法與完整性
- 第一輪本agent inventory未出現Groundlane，先用Exa MCP讀官方首頁/課表。父agent提示後重查inventory出現Groundlane。故最初「無Groundlane」判斷不成立，不能拿Exa資料當Groundlane成功證據。
- Groundlane web_fetch L24（20MB上限）及 document_parse L8（10MB最大值）各一次 bounded request 回 OUTPUT_LIMIT。document_parse 50MB先被參數上限拒絕；不是來源不可讀證據。
- 按允許fallback用Exa MCP一批取得L9/15/21/22/24/25/26-alignment，第二批L8/11/12/19/26-world。maxCharacters=80,000 / 90,000，各deck末段均抵達結尾。保存的是工具文字抽取，不是原PDF；圖像與公式抽取有損、沒有口述與影片字幕，不能宣稱逐字稿或完整視覺閱讀。
- 平台web讀PDF另核頁數：L8 30、L9 67、L11 55、L12 71、L19 40、L21 42、L24 38、L25 34、L26-world 40。部分open/find間歇Internal Error。L15/22/26-alignment頁數未平台確認，不能把deck印刷slide序號當PDF頁碼。
- 父agentGroundlane課表完整回應為 sources/schedule.json。Exa原始抽取：sources/exa-pdf-extracts.md、sources/exa-pdf-extracts-part2.md。
## 課表不等於實際內容
官方課表 https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html 是Spring2026；頁尾更新2026-04-20，26堂但L26列兩份deck。課表只列L9 VAE，實際deck題名VAE+Zero-shot/Few-shot；L8課表只列Diffusion II，deck含VAE簡介。L26-world題名包括alignment，但另一份alignment是獨立Part II。不能按課表一行或檔名推斷完整範圍。
## 核對與建議分篇界線（編輯判斷，不是官方要求）
| 講次 | 實際內容與證據定位 | 合理界線與必要驗收 |
|---|---|---|
| L8 | part2.md:23–613 forward/reverse Gaussian、三種parameterization、training/sampling、DDPM objective；615–681才VAE導入。PDF p3–27 diffusion，末段VAE引介 | 獨立Diffusion II：推q(x_t|x0)、比較mu/x0/epsilon prediction，分清訓練抽t與採樣逆迭代；勿與完整VAE混為一篇 |
| L9 | extracts.md:22–953 VAE/ELBO/MC/reparameterization/VQ-VAE；955–1024 zero/few-shot。PDF p7–15 AE/KL，後續VI/MC/reparam；deck印刷頁碼不是PDF頁碼 | VAE本篇需完整ELBO推導與梯度路徑；zero/few-shot段作L11 ICL先修並明列來源，不能把L9當成純VAE或丟掉末段 |
| L11 | part2.md:696–827 ICL/prompt/CoT；828起IFT/data，後段RLHF | 可分ICL/prompt與SFT/RLHF兩篇；ICL與PEFT不是同一訓練机制。驗收控制示例順序/格式，SFT需mask與RM/PPO資料流 |
| L12 | part2.md L12，平台PDF p4–32 RLHF continued/PPO/DPO，p33–71 conditional images/Parti/DALL-E2/Imagen/LDM；p25 DPO章開頭，p33 conditional界線 | 至少DPO與conditional image/LDM分開。DPO需reference-relative log-ratio且不能說逐token無條件降低所有loser；LDM需凍結AE與條件注入 |
| L15 | extracts.md:1045–1081 Q-Former/BLIP-2 two stages/metaqueries/PerceiverIO；1082–1403 Kaplan/Chinchilla/data-quality scaling | Q-Former與scaling各一篇，不塞L14或MoE；Q-Former需query/readout形狀與兩stage losses，scaling需固定compute比較N/D |
| L19 | part2.md L19 section，Positional Embeddings/RoPE interpolation、long-context efficient attention、BPT/Ring/LWM；總40PDF頁 | long context獨立：位置延伸與attention memory兩種問題；驗收within-length vs extrapolation與retrieval位置曲線 |
| L21 | extracts.md:1444–1787 SSM continuous/recurrent/convolution/S4；1788–1831 selective Mamba/linear attention；1832–1907 hybrids/Jamba/Nemotron/Qwen | SSM/hybrid獨立且不只Mamba摘要；要從recurrence展開convolution，指出selective破壞固定kernel與scan，驗收state size/context memory |
| L22 | extracts.md:1911–end section risk taxonomy、copyright/memorization、adversarial attack、hallucination/uncertainty、carbon mitigation | operational risks獨立，與L26理論alignment分開。驗收按failures對應observables/mitigations，不把課堂法律討論變現行法律結論 |
| L24 | extracts.md Audio section，waveforms/sampling/spectrogram、Whisper、WaveNet、VQ-VAE/codecs、AudioLM/SpeechLM、音訊影片聯合 | audio一篇或理解/生成分兩篇；頻譜練習只能驗收表示法，另需自回歸waveform vs codec-token generation比較與ASR評測邊界 |
| L25 | extracts.md Video section，3D U-Net、分離spatial/temporal attention reshape、joint image/video training、reconstruction guidance、VideoLDM、DiT/Sora/OpenSora、video VLM與Neural OS | video獨立：需時間一致性、條件續片/插幀、attention shape與latent壓縮；video是否好看不足以驗收action-conditioned dynamics |
| L26 world | part2.md:2428–2743，p(s'|s,a)、三範式（3D scene/interactive video/latent）、NeRF/GS/DreamFusion、Genie LAM/tokenizer/dynamics、V-JEPA/PAN | world model独立：明確action介入；驗收同state不同action的反事實rollout，不能用一般video prediction替代 |
| L26 alignment | extracts.md最後section，agreement complexity的M/N/D界線、reward hacking、corrigibility/lexicographic approach；末尾論文2502.05934與2507.20964 | alignment独立：限定theorem assumptions，不推「所有reward必然被hack」無條件；驗收區分empirical RLHF failure vs formal setting保證 |
## 寫作來源邊界
每篇標明「依公開投影片整理，公式/小例子為導讀補充」；不能說講者課堂如何口述、補充問答或影片講法。Exa抽取有明顯公式符號破損，如epsilon變 !，須以標準數學與primary paper核對，不直接複製。
