T='src/content/posts/tech/2026-10-13-mit-67960-'
def ed(f,pairs):
    t=open(T+f).read()
    for a,b in pairs:
        assert t.count(a)==1,(f,a[:50],t.count(a)); t=t.replace(a,b)
    open(T+f,'w').write(t)

# ---------- L02 zh
ed('l02-how-to-train-a-neural-net.md',[
('- 寫出線性層與 ReLU 的前向、反向、權重更新三條式子，並說出每個量的形狀。','- 寫出線性層的前向、反向、權重更新三條式子與 ReLU 的反向，並說出每個量的形狀。'),
('1. **哪些可微？** 只有平滑的碗形與完全平坦的那兩張。','1. **哪些可微？** 只有平滑的碗形與那張近乎平坦的。'),
('| 到處平坦（零梯度） | 梯度沒有任何訊號 | 梯度幫不上忙；只能靠取樣擾動碰運氣 |\n| 幾乎平坦（梯度消失） | 進展極慢，批次雜訊蓋過訊號 | 演化策略 |',
 '| 兩段平台、中間斷開（零梯度） | 梯度處處是 0，完全沒有訊號，到不了低損失的那一段 | 演化策略；投影片示範它能把這個函數降下來 |\n| 幾乎平坦（梯度消失） | 進展極慢，批次雜訊蓋過訊號 | 課堂沒有給專屬的解法；問答時提到演化策略也許有幫助 |'),
('Beery 稱它是「有用而且常用的 hack」。','Beery 稱它是「有用而且常用的 hack」。舉個本文的例子：梯度是 $(30, 40)$，大小是 50；上限 $m = 5$ 時把它縮成 $(3, 4)$，方向不變，只是步子變小。'),
('有學生問：既然 PyTorch 什麼都能微分，為什麼還有難訓練的地形？她的回答是','有學生追問 PyTorch 的可微性（提問在逐字稿裡不完整）。她的回答是'),
('連續、可微、平滑，這三個性質都讓最佳化比較容易。','連續、可微、平滑，這三個性質可能讓最佳化比較容易，但都不是必要條件。'),
('她的說法是：理論上還不知道訓練到底需要哪些性質，','她的說法是：實驗上與理論上都還不確定訓練到底需要哪些性質，'),
('Beery 轉述 Phillip Isola 的直覺：','Beery 轉述「Phil」（應指共同授課的 Phillip Isola）的直覺：'),
('真實的網路有殘差連接、多個輸出頭、共用權重，不是一條鏈。','真實的網路會共用權重、把資料分拆或串接、接多個輸出頭與目標，不是一條鏈。'),
('共用參數就是分岔的特例：同一組參數被送到多個地方用，所以它的梯度是各處梯度的總和。',
 '共用參數就是分岔的特例：同一組參數被送到多個地方用，所以它的梯度是各處梯度的總和。\n\n**算一個共用參數的例子**（本文自擬）。令 $y = w \\cdot \\tanh(w x)$，同一個 $w$ 用了兩次，取 $x = 1$、$w = 0.5$。\n\n- 前向：$u = wx = 0.5$，$h = \\tanh(0.5) = 0.4621$，$y = w h = 0.2311$。\n- 外層那次使用的梯度：$\\partial y / \\partial w = h = 0.4621$。\n- 內層那次使用的梯度：先穿過外層的乘法（乘上 $w$），再穿過 tanh（乘上 $1 - h^2 = 0.7864$），最後乘上輸入 $x$，得到 $0.5 \\times 0.7864 \\times 1 = 0.3932$。\n- 兩處相加：$0.4621 + 0.3932 = 0.8553$。\n\n只算其中一處都會低估。這就是分岔規則在共用參數上的樣子。'),
('投影片最後留了一題，課堂上沒時間講。以下數字是本文依題目自行計算的，結果與投影片公布的答案一致。','投影片最後留了一題，課堂上沒時間講，但投影片第 74–80 頁附了逐步解答。以下的寫法與符號是本文的，中間值與最終權重都和投影片的解答對過。'),
('訓練資料只有一筆：$x_1 = 1.0$、$x_2 = 0.1$，目標 $t = 0.5$。損失 $J = \\tfrac12 (y - t)^2$，學習率 0.2。','訓練資料只有一筆：$x_1 = 1.0$、$x_2 = 0.1$，目標 $t = 0.5$。題目寫的是 Euclidean loss，解答頁用的形式是 $J = \\tfrac12 (y - t)^2$；學習率 0.2。'),
('- $g_4 = g_5 \\, w_{45} \\, (1 - h_4^2) = -0.1869 \\times (-1) \\times 0.9151 = 0.1711$','- $g_4 = g_5 \\, w_{45} \\, (1 - h_4^2) = -0.1869 \\times (-1) \\times 0.9151 = 0.1711$\n\n（投影片的解答把 $g_3$ 寫成 −0.1186，是截斷到四位；四捨五入是 −0.1187。）'),
('Neural Module Networks](https://arxiv.org/abs/1511.02799) 是課堂舉的例子：解析問題的 parser 不必是學來的，辨識物件的 CNN 才是。','Neural Module Networks](https://arxiv.org/abs/1511.02799) 是課堂舉的例子：解析問題的 parser 可以不是學來的，辨識物件的 CNN 則可以由訓練資料更新。'),
('3. 同一個權重矩陣在網路裡被用了三次，它的梯度怎麼算？\n   **答**：三個使用位置各算一份梯度，再相加。這是分岔規則。','3. 把上面共用參數的例子改成 $x = 2$（$w$ 仍是 0.5），$\\partial y / \\partial w$ 是多少？\n   **答**：$u = 1$，$h = \\tanh(1) = 0.7616$，$1 - h^2 = 0.4200$。外層那次是 $h = 0.7616$，內層那次是 $0.5 \\times 0.4200 \\times 2 = 0.4200$，相加得 1.1816。兩個使用位置各算一份梯度再相加，就是分岔規則。'),
('課末習題課堂上沒有講解，計算過程是本文自行推導，只有最終權重與投影片答案對照過。','課末習題課堂上沒有講解；本文的計算已與投影片第 74–80 頁的逐步解答對照。梯度裁剪與共用參數的兩個小例子是本文自擬。'),
])
# ---------- L02 en
ed('l02-how-to-train-a-neural-net-en.md',[
('- Write the forward, backward and weight-update equations for a linear layer and for ReLU, with the shape of every quantity.','- Write the forward, backward and weight-update equations for a linear layer and the backward rule for ReLU, with the shape of every quantity.'),
('1. **Which are differentiable?** Only the smooth bowl and the completely flat one.','1. **Which are differentiable?** Only the smooth bowl and the nearly flat one.'),
('| Flat everywhere (zero gradient) | The gradient carries no signal | The gradient cannot help; only sampled perturbations might get lucky |\n| Nearly flat (vanishing gradient) | Progress is very slow and batch noise dominates the signal | Evolution strategies |',
 '| Two plateaus with a jump between them (zero gradient) | The gradient is 0 everywhere and completely uninformative; the low-loss part is never reached | Evolution strategies; the slides show them minimizing this function |\n| Nearly flat (vanishing gradient) | Progress is very slow and batch noise dominates the signal | No dedicated remedy given in class; in Q&A evolution strategies are said to maybe help |'),
('Beery calls it "a useful and commonly used hack."','Beery calls it "a useful and commonly used hack." An example of my own: the gradient is $(30, 40)$ with magnitude 50; with a cap of $m = 5$ it is scaled to $(3, 4)$, same direction, smaller step.'),
('A student asks: if PyTorch can differentiate anything, why are some landscapes still hard? Her answer is','A student follows up on differentiability in PyTorch (the question is incomplete in the transcript). Her answer is'),
('Continuous, differentiable and smooth: each of these makes optimization easier.','Continuous, differentiable and smooth: each of these might make optimization easier, though none is required.'),
('Her claim is that we do not yet know, in theory, which properties training needs,','Her claim is that we do not yet know, experimentally or theoretically, which properties training needs,'),
("Beery relays Phillip Isola's intuition:","Beery relays an intuition from \"Phil\" (presumably co-instructor Phillip Isola):"),
('Real networks have residual connections, multiple heads and shared weights; they are not chains.','Real networks share weights, split or concatenate data, and attach multiple heads and objectives; they are not chains.'),
('Parameter sharing is a special case of branching: one set of parameters is sent to several places, so its gradient is the sum of the gradients from each use.',
 'Parameter sharing is a special case of branching: one set of parameters is sent to several places, so its gradient is the sum of the gradients from each use.\n\n**A shared-parameter example, worked** (written for this post). Let $y = w \\cdot \\tanh(w x)$, where the same $w$ is used twice, with $x = 1$ and $w = 0.5$.\n\n- Forward: $u = wx = 0.5$, $h = \\tanh(0.5) = 0.4621$, $y = w h = 0.2311$.\n- Gradient from the outer use: $\\partial y / \\partial w = h = 0.4621$.\n- Gradient from the inner use: pass back through the outer multiplication (times $w$), then through tanh (times $1 - h^2 = 0.7864$), then multiply by the input $x$, giving $0.5 \\times 0.7864 \\times 1 = 0.3932$.\n- Add the two: $0.4621 + 0.3932 = 0.8553$.\n\nEither one alone underestimates it. This is what the branching rule looks like for a shared parameter.'),
('The slides end with an exercise the lecture had no time for. The numbers below are computed for this post from the problem statement, and the result matches the answer printed on the slides.','The slides end with an exercise the lecture had no time for, though slides 74–80 include a step-by-step solution. The presentation and notation below are this post\'s own, and both the intermediate values and the final weights were compared with that solution.'),
('There is one training example: $x_1 = 1.0$, $x_2 = 0.1$, target $t = 0.5$. The loss is $J = \\tfrac12 (y - t)^2$ and the learning rate is 0.2.','There is one training example: $x_1 = 1.0$, $x_2 = 0.1$, target $t = 0.5$. The problem says Euclidean loss, and the solution slides use the form $J = \\tfrac12 (y - t)^2$; the learning rate is 0.2.'),
('- $g_4 = g_5 \\, w_{45} \\, (1 - h_4^2) = -0.1869 \\times (-1) \\times 0.9151 = 0.1711$','- $g_4 = g_5 \\, w_{45} \\, (1 - h_4^2) = -0.1869 \\times (-1) \\times 0.9151 = 0.1711$\n\n(The slide solution writes $g_3$ as −0.1186, truncated to four digits; rounded it is −0.1187.)'),
('is the example from class: the parser that reads the question need not be learned, while the CNN that recognizes objects is.','is the example from class: the parser that reads the question might not be learned at all, while the CNN that recognizes objects might be updated from training data.'),
('3. The same weight matrix is used three times in a network. How do you compute its gradient?\n   **Answer**: compute one gradient per use and add them. This is the branching rule.','3. Change the shared-parameter example above to $x = 2$ (with $w$ still 0.5). What is $\\partial y / \\partial w$?\n   **Answer**: $u = 1$, $h = \\tanh(1) = 0.7616$, $1 - h^2 = 0.4200$. The outer use gives $h = 0.7616$ and the inner use gives $0.5 \\times 0.4200 \\times 2 = 0.4200$, for a total of 1.1816. One gradient per use, then add: that is the branching rule.'),
('The closing exercise is not explained in class; the working is derived for this post, and only the final weights were compared with the slide answer.','The closing exercise is not explained in class; the working here was compared with the step-by-step solution on slides 74–80. The two small examples on gradient clipping and a shared parameter are this post\'s own.'),
])

# ---------- L06 zh
ed('l06-generalization-theory.md',[
('title: "泛化理論：參數比資料多，為什麼深度網路還是沒有背答案｜MIT 6.7960 第 6 堂"','title: "泛化理論：容量大到能背下整份資料，為什麼深度網路還是沒有背答案｜MIT 6.7960 第 6 堂"'),
('教科書說模型太大會過擬合，所以要控制參數數量。但現在的網路參數遠多於訓練資料，卻愈大愈好。哪裡出了問題？','教科書說模型太大會過擬合，所以要控制參數數量。但現在的網路容量大到能把整份訓練資料背下來，連隨機標籤都背得起來，卻愈大愈好。哪裡出了問題？'),
('古典圖像是偏差與變異的取捨：','古典的看法是偏差與變異的取捨：'),
('容量剛好夠背資料時，只有一個很扭曲的函數做得到；','容量剛好夠背資料時，只能用很扭曲的函數才做得到；'),
('- double descent 在實驗裡不容易重現。Isola 說他自己試著做一個例子沒有成功，因為動量、weight decay 這些常用技巧都會把那個尖峰抹掉。在你的曲線上看不到是正常的。','- double descent 在實驗裡不容易重現。Isola 說他自己試著做一個例子沒有成功。他接著說，讀相關論文會發現它只在特定條件下出現，動量、weight decay 這些常用做法都可能讓那個尖峰消失。在你的曲線上看不到是正常的。'),
('VC 理論換一個算法：數假設空間裡有多少個不同的函數。','VC 理論換一種數法：數假設空間裡有多少個不同的函數。'),
('Isola 認為 VC 理論的思考方向是對的，錯在一個假設：它假設你從能擬合資料的函數裡**隨機**挑一個。梯度下降不是隨機挑的。','Isola 認為 VC 理論的思考方向是對的，但它的假設被違反了，其中最主要的一個是：它假設你從能擬合資料的函數裡**隨機**挑一個。梯度下降不是隨機挑的。'),
('他認為 ChatGPT 這類模型的泛化，很大一部分來自','他先說自己不確定，但認為 ChatGPT 這類模型的泛化，很大一部分來自'),
('這裡有個數字要對一下。$30^{10} \\approx 5.9 \\times 10^{14}$，約 590 兆；課堂口頭與投影片寫的都是「100 trillion」（100 兆），與題目給的 30 與 10 對不上，本文無法從教材確認他實際用的數字。','這裡有個數字要對一下。$30^{10} \\approx 5.9 \\times 10^{14}$，約 590 兆；課堂口頭與投影片寫的都是「100 trillion」（100 兆），與題目給的 30 與 10 對不上。教材裡還有兩處不一致：他口頭說成「10 的 30 次方」，投影片把 $n$ 與 $m$ 標反了；第二個實驗的 12.5 trillion 正好是 0.125 乘上 100 trillion，可見他一路用的就是 100 trillion。本文無法從教材確認他實際用的詞彙量與長度。'),
('4. 用投影片的圓點圖：','4. VC 界的算例把 $n$ 改成 20，界是多少？為什麼它沒有資訊？\n   **答**：$\\sqrt{2^{20}/20} \\approx 229$。錯誤率最高是 1，說它不超過 229 等於什麼都沒說；而且 $n$ 愈大這個界愈大，與「資料愈多愈可靠」的直覺相反。參數數量的反例則是 $h(x)$ 那個思想實驗：參數很多，但用幾個參數的 $g$ 就能近似。\n5. 用投影片的圓點圖：'),
])
ed('l06-generalization-theory-en.md',[
('title: "Generalization Theory: With More Parameters Than Data, Why Deep Nets Still Don\'t Just Memorize | MIT 6.7960 Lecture 6"','title: "Generalization Theory: With Enough Capacity to Memorize the Data, Why Deep Nets Still Don\'t Just Memorize | MIT 6.7960 Lecture 6"'),
("Yet today's networks have far more parameters than training examples and keep improving as they grow.","Yet today's networks have enough capacity to memorize their entire training set, random labels included, and keep improving as they grow."),
('only one very contorted function can do it;','it takes a very contorted function to do it;'),
('- Double descent is hard to reproduce. Isola says he tried to build his own example and could not get it to work, because common tricks such as momentum and weight decay erase the peak. Not seeing it in your curves is normal.','- Double descent is hard to reproduce. Isola says he tried to build his own example and could not get it to work. He goes on to say that the double descent papers show it only appears in certain regimes, and that common practices such as momentum and weight decay can make the peak disappear. Not seeing it in your curves is normal.'),
('Isola thinks VC theory has the right way of thinking and one wrong assumption: it assumes you pick **at random** among the functions that fit the data. Gradient descent does not pick at random.','Isola thinks VC theory has the right way of thinking but that its assumptions are violated, one of the main ones being that you pick **at random** among the functions that fit the data. Gradient descent does not pick at random.'),
('He thinks much of the generalization in models like ChatGPT comes from','He says first that he does not know, but thinks much of the generalization in models like ChatGPT comes from'),
('which does not match the stated 30 and 10, and the materials do not let this post confirm which numbers he actually used.','which does not match the stated 30 and 10. The materials are inconsistent in two more places: aloud he says "10 to the 30th," and the slide swaps the labels $n$ and $m$; and the 12.5 trillion in the second experiment is exactly 0.125 times 100 trillion, so 100 trillion is the figure he used throughout. The materials do not let this post confirm the vocabulary size and length he actually used.'),
('4. Using the dot picture from the slides:','4. In the worked VC bound, change $n$ to 20. What is the bound, and why is it uninformative?\n   **Answer**: $\\sqrt{2^{20}/20} \\approx 229$. Error is at most 1, so saying it is no more than 229 says nothing; and the bound grows with $n$, the opposite of the intuition that more data makes things more reliable. The counterexample for parameter count is the $h(x)$ thought experiment: many parameters, yet $g$ with a few approximates it.\n5. Using the dot picture from the slides:'),
])
print('A ok')
