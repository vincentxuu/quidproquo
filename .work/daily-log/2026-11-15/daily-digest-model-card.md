產出 LongCat-2.5（Meituan）模型卡，中英雙版，series order 73。

例外：
- diagram-preview 未跑：無瀏覽器（/opt/pw-browsers 僅有 chromium 與 chromium_headless_shell-1243，script 預設路徑是 chrome-headless-shell-1208，改用 --skip-if-no-browser 跳過；已跑 check:diagram-geometry 0 error）
- MinimaLabs/KLM-1.6（HF trending 候選，createdAt 6 天內、likes 75）評估後排除：模型卡自述「continues training from a checkpoint of our KLM 1.5... not much has changed」，屬同一 base model 的延續性 checkpoint，不是新 base model
- deepseek-ai/DeepSeek-V4.1-Flash-1017 評估後排除：多個來源明確定性為「dated refresh rather than a new model generation」，且已是一個月前的事件
