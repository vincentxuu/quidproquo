T='src/content/posts/tech/2026-10-13-mit-67960-'
def ed(f,pairs):
    t=open(T+f).read()
    for a,b in pairs:
        assert t.count(a)==1,(f,a[:50],t.count(a)); t=t.replace(a,b)
    open(T+f,'w').write(t)
COND_OLD='''$$
\\|\\nabla_w f\\, \\Delta w\\| \\le \\delta\\, \\|\\Delta w\\|
\\qquad
\\|\\Delta w\\, \\nabla_w^2 f\\, \\Delta w\\| \\le \\alpha\\, \\|\\Delta w\\|^2
$$'''
COND_NEW='''$$
\\|\\nabla_w f\\, \\Delta w\\|^2 \\le \\delta\\, \\|\\Delta w\\|^2
\\qquad
\\|\\Delta w\\, \\nabla_w^2 f\\, \\Delta w\\| \\le \\alpha\\, \\|\\Delta w\\|^2
$$'''
ed('l23-metrized-deep-learning.md',[
('tldr: "梯度下降等於默認權重空間是歐氏的，','tldr: "梯度下降等於假定權重空間是歐氏的，'),
('- 用串接規則手算兩層網路的範數，並看出它怎麼分配各層的更新量。','- 用串接與並排規則手算組合後的範數，並看出它怎麼分配各層的更新量。'),
('積木只有兩種拼法：','這堂只考慮兩種拼法：'),
(COND_OLD,COND_NEW),
('前者說網路對權重是 Lipschitz 連續的，後者說它是 Lipschitz 平滑的。（投影片把第一條寫成兩邊平方的形式。）','前者說網路對權重是 Lipschitz 連續的，後者說它是 Lipschitz 平滑的。式子照投影片的寫法，第一條是範數平方的形式。'),
('有學生問所有範數不是等價嗎。Bernstein 回答：是，在一個範數下成立，換一個也成立，但鬆緊可以差很多。要的是讓這些條件成立得很緊的那一個。','有學生問這兩個條件是不是對任何範數都成立。Bernstein 回答：成立，因為範數彼此等價，在一個範數下成立，換一個也成立，但鬆緊可以差很多。要的是讓這些條件成立得很緊的那一個。'),
('程式設計裡有個樣式叫 combinator pattern：','程式設計裡有個模式叫 combinator pattern：'),
('深度方面，Adam 本來就縮放得不差，加上正規化後大致維持。投影片另外寫著這個正規化讓 GPT 可以用 SGD 訓練。','深度方面，Adam 本來就縮放得不差，加上正規化後大致維持。投影片另外列出論文裡的一個結果：這個正規化讓 GPT 可以用 SGD 訓練。'),
('他也坦白兩個缺口。有學生問，','他也坦白一個缺口。有學生問，'),
('另外，他說這些結果在意料之中，因為他們先有怎麼縮放的直覺，才建理論去解釋。','他也說這些結果在意料之中：他們先有怎麼縮放的直覺，再為了做到它而建了這套理論。'),
('4. $G$ 的奇異值是 5、2、0.01。','4. Well-normed 的兩條不等式各在限制什麼？sensitivity 出現在哪一條？\n   **答**：第一條限制權重變動造成的輸出變化，上界是模組範數量到的權重變動量，常數是 1。第二條限制輸入變動造成的輸出變化，上界是 sensitivity 乘上輸入的變動量。sensitivity 只出現在第二條。\n5. 直接做「權重減掉學習率乘梯度」，等於假設權重空間用的是什麼範數？在線性層用譜範數時，更新方向改成什麼？\n   **答**：等於假設歐氏範數。用譜範數時，方向改成對偶映射 $UV^\\top$，也就是保留梯度的奇異向量、把奇異值全設為 1。\n6. $G$ 的奇異值是 5、2、0.01。'),
])
ed('l23-metrized-deep-learning-en.md',[
('- Use the composition rule to compute the norm of a two-layer network by hand and see how it apportions updates across layers.','- Use the composition and concatenation rules to compute a combined norm by hand and see how it apportions updates across layers.'),
('There are only two ways to join bricks:','The lecture considers two ways to join bricks:'),
(COND_OLD,COND_NEW),
('The first says the network is Lipschitz continuous in its weights, the second that it is Lipschitz smooth. (The slides write the first condition with both sides squared.)','The first says the network is Lipschitz continuous in its weights, the second that it is Lipschitz smooth. The conditions are written as on the slides, with the first in terms of squared norms.'),
('A student asks whether all norms are not equivalent. Bernstein answers yes: if the conditions hold in one norm they hold in any other, but the guarantee can be far tighter in one than in another.','A student asks whether these conditions hold for any norm. Bernstein answers that they do, because all norms are equivalent: if the conditions hold in one norm they hold in any other, but the guarantee can be far tighter in one than in another.'),
('For depth, Adam already scales reasonably well, and with normalization on top things stay about the same. The slides also note that this normalization enables training GPT with SGD.','For depth, Adam already scales reasonably well, and with normalization on top things stay about the same. The slides also list a result from the paper: this normalization enables training GPT with SGD.'),
('He is candid about two gaps. A student asks','He is candid about one gap. A student asks'),
('He also says these results were expected, because they had the intuition for how to scale first and built the theory to account for it.','He also says these results were expected: they had the intuition for how to scale first and then built the theory in order to do it.'),
('4. $G$ has singular values 5, 2 and 0.01.','4. What does each of the two well-normed inequalities constrain, and in which one does sensitivity appear?\n   **Answer**: the first bounds the change in output caused by a change in weights by the size of that change measured in the module norm, with constant 1. The second bounds the change in output caused by a change in input by sensitivity times the size of the input change. Sensitivity appears only in the second.\n5. Doing "weights minus learning rate times gradient" directly assumes which norm on the weight space? For a linear layer under the spectral norm, what does the update direction become?\n   **Answer**: it assumes the Euclidean norm. Under the spectral norm the direction becomes the duality map $UV^\\top$: keep the gradient\'s singular vectors and set every singular value to 1.\n6. $G$ has singular values 5, 2 and 0.01.'),
])
# ---------- L24
ed('l24-inference-methods.md',[
('訓練是把這個過程攤提成一組權重，','訓練是把這個過程攤銷成一組權重，'),
('一步到位的 VAE 解碼沒有這個問題。','他認為一步到位的 VAE 解碼沒有這個問題。'),
('用上面的例子：每次取樣抽到 B z 的機率是 0.36。','用上面的例子，溫度為 1 時每次取樣抽到 B z 的機率是 0.36。'),
('Isola 的評語是：就他所知，這個最天真的做法目前與任何方法差不多好。','有學生建議從一個解出發、每次改一個詞看會不會更好。Isola 說這類做法很多（MCMC、Gibbs 取樣、爬山法），也有人直接請語言模型把答案改寫成十種可能更好的版本。\n\n他對 Best-of-N 的評語是：就他所知，這個最天真的做法目前與任何方法差不多好。'),
('上面的例子用 $k = 2$：第一步同時保留 A 與 B，第二步展開後就會找到 B z。\n\n有學生建議從一個解出發、每次改一個詞看會不會更好。Isola 說這類做法很多（MCMC、Gibbs 取樣、爬山法），也有人直接請語言模型把答案改寫成十種可能更好的版本。','上面的例子用 $k = 2$：第一步同時保留 A 與 B，第二步展開後就會找到 B z。Isola 說它有點像那位學生的建議。'),
('加上一個查詢，模型接著完成這個樣式。','加上一個查詢，模型接著把這個規律續完。'),
('也就是在某些情況下，in-context learning 可以表示成對上下文裡的範例做梯度下降。','式子照投影片的寫法；用加號是把下降方向收進 $\\lambda$ 的正負號裡。也就是在某些情況下，in-context learning 可以表示成對上下文裡的範例做梯度下降。'),
('測試時就用這個自監督損失在那張測試影像上微調主幹，任務頭保持不動，表示變好之後分類也跟著變準。','測試時就用這個自監督損失在那張測試影像上微調主幹；Isola 說他印象中任務頭保持不動。表示變好之後分類也跟著變準。'),
('推理過程是模型自己生成的，只需要少量人寫的當種子。','推理過程是模型自己生成的；Isola 說他不記得細節，印象中只用了少量人寫的當種子。'),
('以下是他的最佳猜測，也與 Sasha Rush 的一個候選解釋相同：','以下是他的最佳猜測，也與 Sasha Rush 的一個候選解釋相同（投影片列成四點，本文把部署拆出來成為第五點）：'),
('- **「自我改進是憑空變好」**：資訊來自驗證或評分那一步。沒有任何外部訊號或條件差異，模型學不到新東西。','- **「自我改進是憑空變好」**：課堂的說法是，驗證器在外部時，資訊其實是從驗證器進來的；驗證器也可以是學來的模型，因為學會驗證比學會生成容易，那才算純粹的自我改進。'),
('4. 一題 ARC 給了三組範例。','4. 同樣只能多做 5 次模型呼叫，Best-of-N 與 chain-of-thought 各拿這些運算做什麼？哪一個有保證？\n   **答**：Best-of-N 把它們花在 5 個獨立的候選上，再用概似或驗證器挑一個；只要評分可靠，候選愈多、挑到好答案的機率就愈高。Chain-of-thought 是讓模型在一次生成裡自己寫出中間步驟，像搜尋，但那是學來的行為，沒有搜尋演算法的保證。\n5. 在 STaR 的迴圈裡，搜尋、驗證、學習各是哪一步？把驗證器換成學來的模型會改變什麼？\n   **答**：搜尋是模型對每題生成推理過程與答案；驗證是檢查答案對不對；學習是把通過檢查的「推理過程加答案」拿去微調。驗證器是外部的時候，資訊從驗證器進來；換成學來的模型，就是課堂說的純粹自我改進，前提是驗證比生成容易學。\n6. 一題 ARC 給了三組範例。'),
])
ed('l24-inference-methods-en.md',[
('A VAE that decodes in one step does not have it.','He thinks a VAE that decodes in one step does not have it.'),
('With the example above: each sample is B z with probability 0.36.','With the example above at temperature 1, each sample is B z with probability 0.36.'),
("Isola's assessment: to his knowledge, this most naive approach is about as good as anything right now.","A student suggests starting from one solution and changing a word at a time to see whether it improves. Isola says there are many such methods (MCMC, Gibbs sampling, hill climbing), and some people simply ask a language model to rewrite the answer in ten ways that might be better.\n\nHis assessment of Best-of-N: to his knowledge, this most naive approach is about as good as anything right now."),
('the first step keeps both A and B, and after expanding the second step B z is found.\n\nA student suggests starting from one solution and changing a word at a time to see whether it improves. Isola says there are many such methods (MCMC, Gibbs sampling, hill climbing), and some people simply ask a language model to rewrite the answer in ten ways that might be better.','the first step keeps both A and B, and after expanding the second step B z is found. Isola says it is a little like what that student suggested.'),
('That is, in certain cases in-context learning can be expressed as gradient descent over the examples in the context.','The formula is written as on the slide; the plus sign folds the descent direction into the sign of $\\lambda$. That is, in certain cases in-context learning can be expressed as gradient descent over the examples in the context.'),
('At test time the trunk is fine-tuned on that test image with the self-supervised loss while the task head stays frozen, and with a better representation the classification improves as well.','At test time the trunk is fine-tuned on that test image with the self-supervised loss; Isola says he believes the task head stays frozen. With a better representation the classification improves as well.'),
('The rationales are generated by the model itself, and only a handful written by people are needed as a seed.','The rationales are generated by the model itself; Isola says he does not remember the details but thinks only a handful written by people were used as a seed.'),
("which matches one of Sasha Rush's candidate explanations:","which matches one of Sasha Rush's candidate explanations (the slide lists four points; this post splits deployment out as a fifth):"),
('- **"Self-improvement is getting better out of nothing."** The information comes from the verification or scoring step. With no outside signal and no difference in conditions, the model learns nothing new.','- **"Self-improvement is getting better out of nothing."** The lecture\'s account is that with an external verifier the information actually comes in through the verifier; the verifier can also be a learned model, because learning to verify is easier than learning to generate, and only then is it purely self-improvement.'),
('4. An ARC problem comes with three examples.','4. With the same budget of 5 extra model calls, what do Best-of-N and chain-of-thought each spend it on? Which one comes with a guarantee?\n   **Answer**: Best-of-N spends it on 5 independent candidates and then picks one by likelihood or with a verifier; as long as the scoring is reliable, more candidates raise the chance of picking a good answer. Chain-of-thought has the model write its own intermediate steps within one generation, which resembles search but is learned behavior without the guarantees of a search algorithm.\n5. In the STaR loop, which steps are search, verification and learning? What changes if the verifier is replaced by a learned model?\n   **Answer**: search is the model generating a rationale and an answer for each question; verification is checking whether the answer is right; learning is fine-tuning on the rationale-and-answer pairs that pass. With an external verifier the information comes in through the verifier; with a learned one it is what the lecture calls purely self-improvement, on the premise that verifying is easier to learn than generating.\n6. An ARC problem comes with three examples.'),
])
print('D ok')
