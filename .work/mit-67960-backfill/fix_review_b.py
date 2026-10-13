T='src/content/posts/tech/2026-10-13-mit-67960-'
def ed(f,pairs):
    t=open(T+f).read()
    for a,b in pairs:
        assert t.count(a)==1,(f,a[:50],t.count(a)); t=t.replace(a,b)
    open(T+f,'w').write(t)
# ---------- L19 zh
ed('l19-transfer-learning-data.md',[
('Beery 提醒這些都還是進行中的研究。',
 '「用途」一欄是本文依後面的例子整理的對應；課堂只列出圖學、視覺化、資料增強、反事實推理這幾個應用方向。Beery 提醒這些都還是進行中的研究。\n\n用一張貓的照片把四種操作走一遍（本文的例子）。先用 $G^{-1}$ 找到它的 $z$。**內插**：取它與另一隻貓的 $z$ 的中點再生成，得到介於兩隻之間的貓。**操弄**：把 $z$ 加上「夜晚」方向，得到同一隻貓在晚上的樣子。**組合**：保留這隻貓對應的部分、換上另一張圖的背景部分。**最佳化**：沿著讓分類器的「狗」分數上升最快的方向改 $z$，看是哪些特徵先變，這就是後面 StylEx 的做法。四種操作都需要 $z$ 與 $G$，只有一疊照片做不到。'),
('Beery 的解釋是中間層扭曲得比較少，比較不會踩到接縫。後續的 [StyleSpace](https://arxiv.org/abs/2011.12799) 在這類中間空間裡分離出很細的控制，例如車子的引擎蓋樣式、頭燈形狀、車身顏色。她的評語是「經驗上、定性上，有時候成立」。',
 'Beery 的解釋是中間層扭曲得比較少，比較不會踩到接縫；她對這個說法的評語是「經驗上、定性上，有時候成立」。後續的 [StyleSpace](https://arxiv.org/abs/2011.12799) 在這類中間空間裡分離出很細的控制，例如車子的引擎蓋樣式、頭燈形狀、車身顏色，她說定性的結果很漂亮。'),
('這是課堂上花最多時間討論的問題，也沒有定論。','課堂上反覆回到這個問題，也沒有定論。'),
('學一個能在影像流形上內插的生成器，與這些增強的差別只是程度。','她反問：學一個能在影像流形上內插的生成器，與這些增強有什麼不同？並說這有點是語意上的爭論。'),
('要一顆毛茸茸的棒球很容易，要一顆星形的棒球就難；','要一顆毛茸茸的棒球很容易，要一顆星形的棒球就比較難；'),
('這做得到，因為一步 SGD 本身就是前向加反向，而[第 2 堂](/posts/tech/2026-10-13-mit-67960-l02-how-to-train-a-neural-net)已經說過前向加反向可以攤開成一個大的前向傳遞。',
 '這做得到，因為一步 SGD 本身就是前向加反向。課堂在這裡回顧了先前講過的一點（對應[第 2 堂](/posts/tech/2026-10-13-mit-67960-l02-how-to-train-a-neural-net)的反向傳播）：前向加反向可以攤開成一個大的前向傳遞。'),
('如果兩個任務的曲率相同，兩種做法會給出同一個初始值，這也說明了為什麼 MAML 常常不比預訓練好多少。','如果兩個任務的曲率相同，兩種做法會給出同一個初始值；在這個玩具例子裡，兩者的差別完全來自曲率不同。'),
('- **「MAML 一定比預訓練加微調好」**：課堂的說法是常常不值得，除非加進任務特定的資訊。','- **「MAML 一定比預訓練加微調好」**：課堂的說法是常常不值得多出來的運算成本，並舉了一個加進任務脈絡後才有明顯提升的例子。'),
('4. 把 in-context learning 看成元學習時，','4. 下面四件事各對應 data++ 的哪一種操作？（a）把一張人像變成戴眼鏡的版本；（b）找出最能讓年齡分類器把人判成年輕的那個改動；（c）產生介於兩張臉之間的一系列臉；（d）把一輛車放到另一張圖的街景裡。\n   **答**：（a）操弄，沿「戴眼鏡」方向加偏移；（b）最佳化，目標是分類器的輸出；（c）內插；（d）組合。\n5. 把 in-context learning 看成元學習時，'),
])
ed('l19-transfer-learning-data-en.md',[
('Beery notes that all of this is work in progress.',
 'The "Use" column is this post\'s mapping, drawn from the examples later on; the lecture lists only the application areas of graphics, visualization, data augmentation and counterfactual reasoning. Beery notes that all of this is work in progress.\n\nWalk one cat photo through the four operations (an example written for this post). First find its $z$ with $G^{-1}$. **Interpolation**: generate from the midpoint between its $z$ and another cat\'s, giving a cat between the two. **Manipulation**: add the "night" direction to $z$ to get the same cat at night. **Composition**: keep the part that corresponds to this cat and swap in the background part of another image. **Optimization**: change $z$ in the direction that raises a classifier\'s "dog" score fastest and see which features change first, which is what StylEx does below. All four need $z$ and $G$; a stack of photos alone cannot do them.'),
("Beery's explanation is that the intermediate space is less distorted and less likely to hit a seam. The follow-up [StyleSpace](https://arxiv.org/abs/2011.12799) isolates very fine controls in such an intermediate space, like a car's hood style, headlight shape and body color. Her verdict: \"empirically and qualitatively, that's sometimes true.\"",
 "Beery's explanation is that the intermediate space is less distorted and less likely to hit a seam; her verdict on that claim is \"empirically and qualitatively, that's sometimes true.\" The follow-up [StyleSpace](https://arxiv.org/abs/2011.12799) isolates very fine controls in such an intermediate space, like a car's hood style, headlight shape and body color, and she says the qualitative results are really nice."),
('This is the question the lecture spends the most time on, and it is not settled.','The lecture keeps returning to this question, and it is not settled.'),
('A learned generator that interpolates on the image manifold differs from these augmentations only in degree.','She asks how that is any different from learning a generator that interpolates on the image manifold, and says the question is "a bit semantic."'),
('a furry baseball is easy, a star-shaped baseball is hard,','a furry baseball is easy, a star-shaped baseball is somewhat harder,'),
('That is possible because one SGD step is itself a forward pass plus a backward pass, and [Lecture 2](/posts/tech/2026-10-13-mit-67960-l02-how-to-train-a-neural-net-en) already showed that forward plus backward unrolls into one large forward pass.',
 'That is possible because one SGD step is itself a forward pass plus a backward pass. Here the lecture recalls a point made earlier (it corresponds to backpropagation in [Lecture 2](/posts/tech/2026-10-13-mit-67960-l02-how-to-train-a-neural-net-en)): forward plus backward unrolls into one large forward pass.'),
('If the two tasks had the same curvature, both methods would give the same initialization, which also shows why MAML is often not much better than pretraining.','If the two tasks had the same curvature, both methods would give the same initialization; in this toy example the entire difference comes from the curvatures being different.'),
('- **"MAML always beats pretraining plus fine-tuning."** The lecture says it is often not worth it unless task-specific information is added.','- **"MAML always beats pretraining plus fine-tuning."** The lecture says it is often not worth the extra compute, and gives one case where a clear gain appeared only after task context was added.'),
('4. Viewing in-context learning as meta-learning,','4. Which data++ operation does each of these correspond to? (a) Turning a portrait into a version with glasses; (b) finding the change that most makes an age classifier call a person young; (c) producing a series of faces between two faces; (d) putting a car into the street scene of another image.\n   **Answer**: (a) manipulation, an offset along the "glasses" direction; (b) optimization, with the classifier output as the objective; (c) interpolation; (d) composition.\n5. Viewing in-context learning as meta-learning,'),
])
# ---------- L20
ed('l20-scaling-laws.md',[
('Isola 給了三個研究規模的理由。','他的說明可以整理成三個理由。'),
('兩個課堂上的問答值得記下來：','課堂上的一個問答與一個提醒值得記下來：'),
('Isola 對這類式子的態度是保留的。第一條有五個自由常數，他引了「五個參數可以擬合一頭大象」這句話，說這裡面可能有看茶葉占卜的成分。課堂上沒有確定這句話的出處；一般的說法是 von Neumann 講的，由 Fermi 轉述，原話是四個參數擬合大象、五個參數讓牠搖鼻子。',
 'Isola 對這類式子的態度是保留的。他引了「五個參數可以擬合一頭大象」這句話，說這裡面可能有看茶葉占卜的成分。他當場把第一條的自由常數數成五個；照式子看是 $N_c$、$D_c$、$\\alpha_N$、$\\alpha_D$ 四個。這句話的出處，他先猜是 von Neumann，有學生說聽過是 Anderson，他就接受了。本文補充：通行的出處是 Freeman Dyson 回憶 Fermi 轉述 von Neumann 的話，原話是四個參數擬合大象、五個參數讓牠搖鼻子（見 [A meeting with Enrico Fermi](https://www.nature.com/articles/427297a)）。'),
('只用小規模的點擬合，再去預測沒用來擬合的規模，預測是準的。','只用一部分規模的點擬合，再去預測沒用來擬合的規模，預測是準的。'),
('三種方法的結論一致：','三種方法得到的分配都大約是：'),
('投影片列的限制：用平滑過的訓練損失代替測試損失；','投影片另一頁列了其他研究的結果，其中提到視覺模型（CNN）對模型大小的指數比較大，$\\alpha \\approx 0.5$。\n\n投影片列的限制：用平滑過的訓練損失代替測試損失；'),
('- **「批次愈大愈有效率」**：超過臨界批次大小後，多出來的運算幾乎都浪費在已經夠準的梯度估計上。','- **「批次愈大愈有效率」**：遠超過臨界批次大小後，多出來的運算幾乎都花在已經夠準的梯度估計上。'),
('- Rosenfeld et al.，[A Constructive Prediction','- Freeman Dyson，[A meeting with Enrico Fermi](https://www.nature.com/articles/427297a)（Nature，2004）\n- Rosenfeld et al.，[A Constructive Prediction'),
])
ed('l20-scaling-laws-en.md',[
('Isola gives three reasons to study scale.','His account can be organized into three reasons.'),
('If one training run of the final model costs millions of dollars,','If one training run of the final model costs a million dollars,'),
('Two exchanges from class are worth recording:','One exchange and one caution from class are worth recording:'),
('Isola treats formulas like these with reserve. The first has five free constants; he quotes "with five parameters you can fit an elephant" and says there may be some reading of tea leaves here. The class does not settle who said it; it is usually attributed to von Neumann as relayed by Fermi, and the original has four parameters fitting the elephant and a fifth making it wiggle its trunk.',
 'Isola treats formulas like these with reserve. He quotes "with five parameters you can fit an elephant" and says there may be some reading of tea leaves here. Counting on the spot he gets five free constants in the first formula; as written there are four: $N_c$, $D_c$, $\\alpha_N$ and $\\alpha_D$. As for who said it, he first guesses von Neumann, a student says they heard it attributed to Anderson, and he accepts that. An addition of mine: the usual source is Freeman Dyson recalling Fermi quoting von Neumann, and the original has four parameters fitting the elephant and a fifth making it wiggle its trunk (see [A meeting with Enrico Fermi](https://www.nature.com/articles/427297a)).'),
('using only points at small scale, then predict scales that were held out,','using only points at some scales, then predict scales that were held out,'),
('All three agree:','All three give roughly the same allocation:'),
('Limitations listed on the slides: smoothed training loss stands in for test loss;','Another slide lists results from other work, including that vision models (CNNs) have a larger exponent in model size, $\\alpha \\approx 0.5$.\n\nLimitations listed on the slides: smoothed training loss stands in for test loss;'),
('- **"Bigger batches are always more efficient."** Past the critical batch size, almost all the extra compute goes into a gradient estimate that was already accurate enough.','- **"Bigger batches are always more efficient."** Far past the critical batch size, almost all the extra compute goes into a gradient estimate that was already accurate enough.'),
('- Rosenfeld et al., [A Constructive Prediction','- Freeman Dyson, [A meeting with Enrico Fermi](https://www.nature.com/articles/427297a) (Nature, 2004)\n- Rosenfeld et al., [A Constructive Prediction'),
])
print('B ok')
