---
title: "CS221 Lecture 4：Learning III：深度網路是可重複組合的計算圖"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs221, artificial-intelligence, stanford]
lang: zh-TW
series:
  name: "Stanford CS221 導讀"
  order: 5
tldr: "Stanford CS221 Autumn 2025 第 4 講，從 Learning III：深度網路是可重複組合的計算圖 建立可操作的 AI 問題表示與演算法直覺。"
description: "逐講讀 Stanford CS221 Autumn 2025 Lecture 4，依官方可執行講義整理核心 agenda、例子與限制。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-stanford-cs221-lecture-04-learning-deep-networks-en)

本篇對應 **Stanford CS221, Autumn 2025, Lecture 4**，2025-10-01 由 Percy Liang 主講。官方課表、講義與作業入口在[課程網站](https://stanford-cs221.github.io/autumn2025/)，本講主要材料是 [deep_learning](https://stanford-cs221.github.io/autumn2025-lectures/?trace=deep_learning)。

> 材料缺口：PyTorch 可執行示例公開；實際課堂錄影另見官方播放清單。

## 這一講的路線

官方可執行檔案的入口是 `main()`：先回顧 NumPy、手寫計算圖與 PyTorch，再依序走過非線性動機、線性 MLP、多層感知器、深網、殘差、layer normalization、初始化和 optimizer。順序是先說清楚值如何沿圖計算，再處理深度帶來的訓練穩定性問題。

本文只整理 `.work/stanford-cs221-notes/source/deep_learning.py`；未在來源展開的課堂解說、錄影逐字稿、隱藏測資與官方解答，都是材料缺口。

## 1. 從手寫計算圖到 PyTorch

上一單元使用 NumPy 和自製的 computation-graph library；這一單元先用一個最小例子對照。令 `x = [1, 2, 3]`、`y = [4, 5, 6]`，`z = x · y`。圖上的 `Input` 是節點，`DotProduct` 是把兩個上游節點接起來的運算；forward 得到 `z = 32`。呼叫手寫的 `backpropagation(z)` 後，梯度沿圖反向走：對 `x` 的梯度是 `y`，對 `y` 的梯度是 `x`，也就是 `[4,5,6]` 與 `[1,2,3]`。這不是把梯度「猜」出來，而是每個運算節點都知道自己的局部導數，再交給 traversal 串起來。

同一件事在 PyTorch 寫成 `x = torch.tensor([1.,2,3], requires_grad=True)`、`y = torch.tensor([4.,5,6], requires_grad=True)`、`z = x @ y`、`z.backward()`。PyTorch tensor 在這段程式裡同時是值和計算圖中的節點；運算 `@` 對應 NumPy 的矩陣／內積運算，值在建構節點時 eager 計算，不需要另外呼叫 `forward()`。`backward()` 會遞迴反向傳播，結果放在葉節點的 `.grad`；`requires_grad=True` 表示要為這些參數保留和計算梯度。這就是來源所說的 PyTorch：NumPy 式運算、自動微分，以及已實作好的常見模組。

這裡的 node semantics 是整節的地基。手寫 library 可把 node 接到新運算，讓結果沿原圖反傳；也可只取 value，讓新圖不再知道原節點。來源用 `x=1`、`y=x²`、`z=y²`、`u=3` 建立 `l2 = (value(y))² + u`；反傳時 `u.grad` 會算出來，但 `x.grad` 不會。

PyTorch 通常直接引用 tensor node；要採用「只引用值」的語義，使用 `y.detach()`。`l2 = y.detach() ** 2 + u` 反傳時，`u.grad` 有結果，`x.grad` 沒有：`detach()` 切斷了上游梯度路徑。另一種用途是 `with torch.no_grad()`；來源在其中計算 `y=x²`、`z=y²`，之後對 `z` 呼叫 `backward()` 會得到 RuntimeError。前者是局部 graph break，後者是整段不追蹤梯度。

## 2. 線性模型、logits 與完整更新

PyTorch 已提供 `nn.Linear`、`nn.CrossEntropyLoss` 和 `torch.optim.SGD`。來源用 `x` 的 shape `[4]` 和 one-hot 形式的 `target_y` `[0.,1,0]`，建立 `nn.Linear(4,3)`：權重把四維輸入映射到三個輸出，`logits = model(x)` 的 shape 是 `[3]`。這些輸出先是 logits，不是已正規化的機率；cross-entropy 以 logits 和 target 比較，對應 softmax 後的分類分布與目標，得到 scalar `loss`。呼叫 `loss.backward()` 後，`model.weight.grad` 與 `model.bias.grad` 都可檢查。

接著建立 `torch.optim.SGD(model.parameters(), lr=0.1)`，`optimizer.step()` 依梯度更新 weight 和 bias。參數在 model、梯度在各參數的 `.grad`，optimizer 記住要更新的參數與 learning rate。完整迴圈前呼叫 `optimizer.zero_grad()`，避免梯度跨 iteration 累加；來源只指出可改用 Adam，未展開其內部狀態。

`get_training_data()` 提供三筆四維資料：`[1,2,0,1]` 對 `[0,1,0]`、`[-1,0,2,0]` 對 `[1,0,0]`、`[0,3,1,0]` 對 `[0,0,1]`。`torch.stack` 後，`x` 是 `[3,4]`、`target_y` 是 `[3,3]`。每步依序做 `model(x)`（logits `[3,3]`）、cross entropy、記錄 loss、`zero_grad()`、`backward()`、`step()`；預設 80 steps、learning rate `0.1`，最後畫 loss 曲線。這把完整更新放在同一個可執行閉環裡。

## 3. 為什麼需要非線性

來源先回看線性分類器：決策邊界是直線，但資料也可能呈現圓形等非線性分布。`quadratic_classifier` 使用 `(x[0]-1)^2 + (x[1]-1)^2 - 2`，正值預測 `1`、否則 `-1`；執行例子是 `[1,1]` 和 `[3,0]`，邊界是圓。

一個直接做法是固定非線性 feature map：`phi(x)=[x0,x1,x0²+x1²]`，再在 `phi` 空間學線性 predictor，logit 為 `-2*phi[0]-2*phi[1]+phi[2]`。所以「線性」可以是對高維特徵的線性；映回原始輸入後，決策邊界仍可非線性。來源把方法寫成兩步：先 preprocess 套 feature map，再學線性 predictor。限制也同時明示：feature map 是固定的，問題變成能不能連它一起學。

接著先試兩個 linear layer。`LinearMLP` 用 `nn.Linear(input_dim,5)` 把四維輸入映到 hidden size 5，再用 `nn.Linear(5,3)` 映到三個 logits。輸入 shape `[4]` 時 hidden 是 `[5]`、logits 是 `[3]`；對三筆 batch 則相應是 `[3,5]` 和 `[3,3]`。但這仍等價於一個線性分類器：若忽略 bias 的細節，`(x @ w1) @ w2 = x @ (w1 @ w2)`，矩陣乘法的結合律讓兩個權重可合成一個 `w=w1@w2`。來源用 `x` shape `[2,3]`、`w1` shape `[3,2]`、`w2` shape `[2,3]` 實際算 `logits` 與 `logits2`，兩者一致；因此增加線性層本身沒有增加表達力。

這個反例也很清楚具體地說明「參數更多」和「函式類別更有表達力」不是同一句話。兩層線性 map 的參數化方式雖然不同，最後仍只能畫出線性 decision boundary；hidden dimension 改變計算路徑，卻沒有改變可表示函式的基本形狀。判斷架構時不能只數 layers 或 parameters，還要問各層之間是否有真正改變函式類別的 operation。下一段的 activation 正是這個 operation。

## 4. MLP、深度與梯度

要超越線性分類器，在層與層之間加入非線性 activation。來源列出 sigmoid、tanh、ReLU、GeLU、Swish 等選擇，示範採用 ReLU：`relu(x)=max(x,0)`，對 `[-1,0,1]` 輸出 `[0,0,1]`。`MultiLayerPerceptron` 的順序是 `x → w1(x) → ReLU → w2(hidden) → logits`；hidden units 也稱 activations 或 neurons。ReLU 的限制是 `x <= 0` 時梯度為零，可能形成 dead neurons；來源列出的替代方向是 Leaky ReLU、GeLU、Swish，取捨是線性區域較好傳梯度、非線性則帶來較多表達力。

單一 MLP layer 可能仍不夠，因此 `DeepNeuralNetwork` 疊三個 linear map：input 到 hidden 5、hidden 5 到 hidden 5、hidden 5 到三個 logits；前兩層後接 ReLU。來源以同一批三筆資料訓練，並指出層數更多時一開始較慢。它的直覺是每層學更抽象的輸入特徵；來源沒有提供特徵圖的定量分析。

難點是 vanishing／exploding gradient。來源用純量例子把 `x=1` 連續乘上可訓練的 `w` 20 次：`w=0.5` 時反傳會讓梯度變得很小，`w=2` 時會變得很大。矩陣也有同樣問題，來源給出的穩定直覺是權重接近 1；矩陣情況則關心 `w` 的 eigenvalues 是否接近 1。這裡沒有把例子延伸成通用收斂定理，也沒有補充來源未寫出的數值表。

## 5. 讓深網比較穩定

第一個方法是 residual／skip connection，也稱 highway network。沒有殘差時是 `x → f(x)`；有殘差時是 `x → x + f(x)`。若 `f(x)=wx`，每層成為 `(1+w)x`，可讓 multiplier 遠離零，但 `w` 很大時仍可能 explode。示範把第二個 hidden 更新改成 `x = x + ReLU(w2(x))`，來源觀察訓練快很多。歷史例子依序是 McCulloch/Pitts 1943、Rosenblatt 1961、LSTM 1997、residual networks 2015。

第二個方法是 layer normalization：不要讓 activation 的 magnitude 太大或太小。簡化版本先算 mean、variance，再做 `(x-mean)/sqrt(var)`；`[1,2,3]` 和 `[100,200,300]` 是來源的對照輸入。真正示範的版本加入 `epsilon=1e-5` 避免除以零，再用可學的 `gamma` 做 scaling、`beta` 做 shifting。PyTorch 對應 `nn.LayerNorm(3)`，它的參數可由 `named_parameters()` 檢查；來源總結為把 activation magnitude 維持在遠離零和無限大的範圍。這裡的簡化程式是概念示意，不取代 PyTorch 模組的完整定義。

第三個方法是 proper initialization。來源令 `input_dim=16384`、`output_dim=32`，以常態權重和輸入做 `y=x@w`；每個 `y` 元素按 `sqrt(input_dim)` 的尺度放大，可能造成梯度爆掉。將權重除以 `sqrt(input_dim)` 讓尺度不依賴 input dimension；來源把它連到 Xavier initialization，並把常態分布截斷在 `[-3,3]` 避免 outlier。原始資料是 Glorot and Bengio 2010。

第四個方法是 stochastic optimizer。全資料 gradient 需加總所有 examples，大資料集上每次更新太昂貴，因此每步抽子集，得到 unbiased estimate。來源用四個梯度 `[1,2]、[3,4]、[5,6]、[7,8]`，先算全體 mean，再固定 seed 1、取 batch size 2 的 indices，計算抽樣 mean。實作上每個 epoch 先 permute，再切 consecutive chunks，最後比較 batch mean 的平均與全體 gradient；並提示可用 Adam 取代 SGD。

## 參考資料

- [CS221 Autumn 2025 課程網站](https://stanford-cs221.github.io/autumn2025/)
- [本講官方材料：deep_learning](https://stanford-cs221.github.io/autumn2025-lectures/?trace=deep_learning)
- [CS221 Autumn 2025 可執行講義 repository](https://github.com/stanford-cs221/autumn2025-lectures)
- [Stanford Online 官方 CS221 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rMeDqwS1yFl3j3sR_-MQNEN)
