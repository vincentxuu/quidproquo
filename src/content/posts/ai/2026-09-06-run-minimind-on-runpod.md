---
title: "在 RunPod 上跑一遍 MiniMind：從零到能對話"
date: 2026-09-06
category: ai
type: deep-dive
tags: [minimind, runpod, llm, training, gpu, pytorch]
lang: zh-TW
series:
  name: "從零訓練一個 LLM"
  order: 10
tldr: "系列實作篇：在 RunPod 租一張 RTX 3090（Secure Cloud $0.5/hr、Community Cloud $0.22/hr），照 README 步驟跑完 MiniMind 的 pretrain（約 1.21h）+ SFT（約 1.10h），總成本約 $0.55–1.50 美元，就能在終端機跟自己從零訓出來的 64M 模型對話。"
description: "從註冊 RunPod、開 3090 pod、SSH 連線、下載 minimind_dataset、跑 train_pretrain.py 與 train_full_sft.py 到 eval_llm.py 對話的完整步驟，含成本結算與未實機驗證的限制標註。"
draft: false
---

> 🌏 [English version](/en/posts/ai/2026-09-06-run-minimind-on-runpod-en)

系列前面九篇把「該不該訓」、「訓什麼」、「用什麼工具」都講完了：[MiniMind 的設計解析](/posts/ai/2026-09-06-minimind-train-llm-from-scratch)（order 1）、[LitGPT 的框架路線](/posts/ai/2026-09-06-litgpt-from-scratch-framework)（order 9），以及 [要不要從零訓練的決策框架](/posts/ai/2026-09-06-when-to-train-llm-from-scratch)（order 6）。這篇是整個系列唯一的實作篇：不談架構，直接帶你在 [RunPod](https://www.runpod.io/) 租一張 RTX 3090，把 [MiniMind](https://github.com/jingyaogong/minimind) 的 pretrain → SFT → 對話測試完整跑一遍。

先講清楚這篇的性質：**我沒有實際租卡驗證**。每一步的指令都來自 MiniMind README 與 RunPod 官方文件（文末列出），訓練時長引用 README 在單卡 3090 上的實測數字，但 RunPod 介面細節、模板版本、下載速度都可能隨時間變動——照做之前，以官方文件當下內容為準。

## 為什麼是 RunPod，而不是 AutoDL

MiniMind README 的「3 塊錢」成本表是按中國租卡行情算的：3090 約 1.3 元人民幣/小時，2.31 小時（pretrain_t2t_mini + sft_t2t_mini 各 1 epoch）約 3 元。最常見的平台是 [AutoDL](https://www.autodl.com/)，[站內 order 1 的解析](/posts/ai/2026-09-06-minimind-train-llm-from-scratch)也提過它單價最低、ModelScope 與阿里雲 pip mirror 直連最順——但註冊需要中國手機號碼與支付方式，多數台灣與國際讀者過不了這關。

RunPod 沒有這個門檻：信箱註冊、信用卡或加密貨幣儲值。代價是單價高一些。依 RunPod 官方 [RTX 3090 頁面](https://www.runpod.io/gpu-models/rtx-3090)（2026-08-27 更新）：Secure Cloud $0.5/hr、Community Cloud $0.22/hr。同樣 2.5 小時左右的花費，Secure Cloud 約 $1.25 美元（約 NT$40），Community 約 $0.55——對照 AutoDL 的 3 元人民幣（約 $0.42），貴不到一美元，換到的是不用辦中國帳號。

## Step 0：註冊與 SSH key

RunPod 註冊用 email 即可，儲值後才能開機器。連線用 SSH key，官方文件（[Connect to a Pod with SSH](https://docs.runpod.io/pods/configuration/use-ssh)）的建議流程：

```bash
# 本機產生金鑰（已有可跳過）
ssh-keygen -t ed25519 -C "you@example.com"
cat ~/.ssh/id_ed25519.pub
```

把輸出（`ssh-ed25519` 開頭那一整行）貼到 Runpod 帳號設定的 **SSH Public Keys** 欄位。文件特別提醒兩個坑：貼成 `SHA256:` 開頭的 fingerprint 不會過，多把金鑰必須一行一把。

## Step 1：開一台 3090 pod

在 [Runpod console](https://console.runpod.io/pods) 選 **Pods → Deploy**，GPU 選 RTX 3090（24GB GDDR6X）。兩種雲的差異，官方頁面的對照是：Secure Cloud 貴但企業級可靠、有 24/7 支援；Community Cloud 便宜約一半、機器來自民間供應商、區域更多。練習用途 Community 就夠，但機器品質參差、可能被收回——好在小模型訓練腳本支援斷點續訓（後述），中斷了損失有限。

Template 選官方的 **Runpod PyTorch**：它內建 PyTorch 與 CUDA 環境，且官方文件明說這類官方模板「full SSH access is already configured for you」，不用自己裝 SSH daemon。磁碟空間給 30GB 以上（資料集 2.8GB、torch 環境與 checkpoint 都要地方），設定完按 Deploy。

## Step 2：SSH 連入

Pod 開好後，在 pod 的 **Connect** 分頁複製 SSH 指令。有公開 IP 的完整 SSH 長這樣（官方文件範例）：

```bash
ssh root@<POD_IP> -p <PORT> -i ~/.ssh/id_ed25519
```

使用者固定是 `root`，IP 與 port 每次 pod 不同，直接複製 console 給的指令最保險。連上後會落在容器內，工作目錄慣例用 `/workspace`（這個路徑在 pod 重建後仍可掛回，訓練產物放這裡）。

## Step 3：抓程式碼、裝環境

README 的第 0 步是：

```bash
git clone --depth 1 https://github.com/jingyaogong/minimind
cd minimind && pip install -r requirements.txt
```

**關鍵差異：把 README 裡的 `-i https://mirrors.aliyun.com/pypi/simple` 拿掉。** 這是阿里雲的 pip 鏡像站，在中國機器上是加速器，在 RunPod 的海外節點上反而可能更慢或連不上。README 寫這行是為了中國讀者；國際平台直接用預設的 PyPI 就好。這是整篇唯一需要「反向修改」官方指令的地方。

裝完先確認 GPU 有被看到（README 也建議這步）：

```bash
python -c "import torch; print(torch.cuda.is_available())"
```

輸出 `True` 才繼續。如果是 `False`，多半是模板的 torch 與驅動版本不匹配，換一個官方 PyTorch 模板通常比手動重裝 torch 快。

## Step 4：下載資料集

只需要兩個檔案：`pretrain_t2t_mini.jsonl`（1.2GB）與 `sft_t2t_mini.jsonl`（1.6GB），放進 `./dataset/`。README 明說「無需全部 clone，可單獨下載所需的文件」，資料集在 [HuggingFace](https://huggingface.co/datasets/jingyaogong/minimind_dataset)（另有 ModelScope 鏡像，國際節點用 HF 較快）。

順帶一提：這個資料集頁的 dataset viewer 目前是壞的——HF worker 報 `DatasetGenerationError`，因為資料夾裡各 jsonl 的欄位結構不一致（dpo.jsonl 用 `chosen/rejected`，SFT 用 `conversations`）。所以別用 `load_dataset()` 整包載入，老老實實抓單檔。

方式一，用 huggingface 的 CLI 抓指定檔案：

```bash
pip install -U huggingface_hub
huggingface-cli download jingyaogong/minimind_dataset \
  pretrain_t2t_mini.jsonl sft_t2t_mini.jsonl \
  --repo-type dataset --local-dir ./dataset
```

方式二，wget 直連 resolve URL：

```bash
mkdir -p dataset
wget -P dataset https://huggingface.co/datasets/jingyaogong/minimind_dataset/resolve/main/pretrain_t2t_mini.jsonl
wget -P dataset https://huggingface.co/datasets/jingyaogong/minimind_dataset/resolve/main/sft_t2t_mini.jsonl
```

兩個檔案合計 2.8GB，RunPod 節點到 HuggingFace 的頻寬通常不差，幾分鐘內應該結束（此段未實機驗證）。授權方面，README 聲明資料來源與處理流程遵守 Apache-2.0 與 CC-BY-NC-2.0——自己跑教材沒問題，要商用需先看清各來源協議。

## Step 5：預訓練

```bash
cd trainer && python train_pretrain.py
```

終端會持續印出每個 step 的 loss。README 附了 768 維配置的 loss 曲線：先快速下降、後段趨緩，單卡 3090 跑完 `pretrain_t2t_mini` 1 epoch 約 **1.21 小時**，產出 `out/pretrain_768.pth`。中途想看模型現在會什麼，回上層跑 `python eval_llm.py --weight pretrain`——README 的樣例顯示這個階段的模型已能答「為什麼天空是藍色的」，但只會接龍、還不會好好對話。

## Step 6：SFT

```bash
cd trainer && python train_full_sft.py
```

全參數微調，約 **1.10 小時**，產出 `out/full_sft_768.pth`。這一步讓模型學會多輪對話模板（README：`user / assistant / system / tool` 角色結構與指令跟隨），`sft_t2t_mini` 裡也已混入 Tool Call 樣本，所以訓完的 `full_sft` 權重自帶基礎工具調用格式。

兩個階段都支援斷點續訓：中斷後加 `--from_resume 1` 會從 `./checkpoints/` 自動恢復（模型、優化器狀態與進度）。用 Community Cloud 的話，這個功能就是保險——機器被收回也不至於從零再來。

## Step 7：跟你的模型對話

```bash
cd .. && python eval_llm.py --weight full_sft
```

README 用 GPT 風格 emoji 標示的互動介面（`💬:` 輸入、`🧠:` 回覆）。預期是什麼？README 自己貼的 Zero 樣例是：中文通順但知識會胡編（推薦杭州美食時編出「鳗鱼头」），英文直接亂碼。**這是正常結果**——2.31 小時、2.8GB 資料訓出來的 64M 模型就是這個水平，它在 C-Eval/C-MMLU 上接近隨機（約 25%）。這一步的價值是親手驗證「模型真的是從你的 GPU 上、從隨機初始化長出來的」，而不是得到一個好用的產品。

## 成本結算

| 項目 | Secure Cloud | Community Cloud |
|---|---|---|
| 3090 單價（RunPod 官方頁） | $0.5/hr | $0.22/hr |
| 純訓練 2.31h（README 實測） | ≈ $1.16 | ≈ $0.51 |
| 含環境＋下載約 2.5–3h | ≈ $1.25–1.50 | ≈ $0.55–0.66 |
| 對照：AutoDL 同流程 | ≈ 3 元人民幣（約 $0.42） | — |

RunPod 按用量計費，**pod 開著就持續扣錢**。訓練完、對話測試完，回 console 把 pod terminate 掉；想保留權重，先把 `out/` 下的 `.pth`（64M 模型，檔案不大）用 `scp` 抓回本機，或放進持久儲存。儲存與流量的計費細節以[官方定價頁](https://www.runpod.io/pricing)為準。

## 限制與可能的坑

誠實再標一次：以上步驟**未實機驗證**，以 README 與 RunPod 官方文件為準。預先能想到的風險：

- **版本漂移**：README 作者環境是 CUDA 12.2、Python 3.10.16；RunPod 的 PyTorch 模板版本隨官方更新，`requirements.txt` 的 pin 可能與模板內建 torch 衝突，屆時以模板版本為準、裁剪 requirements，比重裝 CUDA 省事。
- **下載速度**：HuggingFace 在部分節點可能不快，方法一的 CLI 支援斷點續傳；真的太慢可改用 ModelScope 鏡像。
- **Community 機器不穩**：可能被回收，靠 `--from_resume 1` 兜底；在意連續性就多花錢上 Secure Cloud。
- **結果天花板**：別期待 Zero 模型能幹活，它的價值在流程完整、每一行可讀（[CS336](/posts/ai/2026-08-21-stanford-cs336-language-modeling-from-scratch) 課程反覆強調的那種「讀懂你訓的東西」）。

## 整體來說

整條路是：註冊 → SSH key → 開 pod → clone（拿掉鏡像參數）→ 下兩個 jsonl → 兩條訓練指令 → 一條對話指令。真正的訓練程式碼只有兩行 `python train_*.py`，這正是 MiniMind 作為教材的價值：把工程摩擦壓到最低，讓你把時間花在讀 `trainer/` 底下的每一行。回到系列開頭的偏誤標註——這裡收的仍是偏英語圈與中文圈的 GitHub 明星專案——RunPod 這類國際租卡平台，算是把這條復現路線接給了沒有中國帳號的讀者。想先想清楚「要不要花這個錢」，回 [order 6 的決策框架](/posts/ai/2026-09-06-when-to-train-llm-from-scratch)；上一篇 [LitGPT](/posts/ai/2026-09-06-litgpt-from-scratch-framework) 交給你的是訓練骨架，這篇交給你的是那台機器。訓完之後想往哪走，可以回 [order 0 的系列總覽](/posts/ai/2026-09-06-train-llm-from-scratch-series-intro)挑下一站。

## 參考資料

- [MiniMind GitHub README](https://github.com/jingyaogong/minimind)
- [MiniMind 訓練資料集（HuggingFace Datasets）](https://huggingface.co/datasets/jingyaogong/minimind_dataset)
- [jingyaogong/minimind-3（HuggingFace 模型頁）](https://huggingface.co/jingyaogong/minimind-3)
- [RunPod：Rent NVIDIA RTX 3090 GPUs](https://www.runpod.io/gpu-models/rtx-3090)
- [RunPod 官方文件：Connect to a Pod with SSH](https://docs.runpod.io/pods/configuration/use-ssh)
- [MiniMind：用 3 塊錢從零訓練一個 LLM（站內系列 order 1）](/posts/ai/2026-09-06-minimind-train-llm-from-scratch)
- [從零訓練的框架：LitGPT（站內系列 order 9）](/posts/ai/2026-09-06-litgpt-from-scratch-framework)
- [該不該從零訓練 LLM？（站內系列 order 6）](/posts/ai/2026-09-06-when-to-train-llm-from-scratch)
