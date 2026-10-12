import re,glob,sys,collections
P='/posts/ai/2026-10-12-stanford-cs229-lecture-'
PDF='https://cs229.stanford.edu/main_notes.pdf'
L={ '02':('02-supervised-learning-linear-regression','第 2 堂：監督式學習設定與線性迴歸','Lecture 2: supervised learning setup and linear regression'),
 '03':('03-probabilistic-view-logistic-regression','第 3 堂：最大概似與邏輯斯迴歸','Lecture 3: maximum likelihood and logistic regression'),
 '04':('04-exponential-family-glm','第 4 堂：指數族、廣義線性模型與 softmax','Lecture 4: exponential families, GLMs, and softmax'),
 '05':('05-gaussian-discriminant-analysis','第 5 堂：高斯判別分析與 Naive Bayes','Lecture 5: Gaussian discriminant analysis and Naive Bayes'),
 '06':('06-bias-variance-regularization','第 6 堂：偏差與變異、正規化與模型選擇','Lecture 6: bias and variance, regularization, and model selection'),
 '07':('07-neural-network-architecture','第 7 堂：神經網路的架構','Lecture 7: neural network architecture'),
 '09':('09-k-means-gmm','第 9 堂：k-means 與高斯混合模型','Lecture 9: k-means and Gaussian mixture models'),
 '10':('10-em-pca','第 10 堂：EM 演算法與 PCA','Lecture 10: the EM algorithm and PCA'),
 '11':('11-diffusion-models','第 11 堂：擴散模型','Lecture 11: diffusion models'),
 '12':('12-diffusion-loss-foundation-models-lora','第 12 堂：擴散模型的雜訊預測損失、基礎模型與 LoRA','Lecture 12: the diffusion noise-prediction loss, foundation models, and LoRA'),
 '13':('13-representation-learning-semantic-search','第 13 堂：對比學習與語意檢索','Lecture 13: contrastive learning and semantic search'),
 '14':('14-llm-next-token-attention','第 14 堂：大型語言模型的 next-token 損失與 attention','Lecture 14: LLMs, the next-token loss, and attention'),
 '18':('18-rl-basics-policy-gradient','第 18 堂：強化學習基礎與 Policy Gradient','Lecture 18: reinforcement learning basics and policy gradient'),
 '20':('20-ppo-rl-for-reasoning','第 20 堂：Baseline、PPO 與可驗證獎勵','Lecture 20: baselines, PPO, and verifiable rewards')}
CH={'01':'02','02':'03','03':'04','04':'05','07':'07','08':'06','09':'06','10':'09','11':'10','12':'10','14':'11','15':'12','16':'13','17':'14','18':'20','19':'18','21':'18'}
ORPH={'05':('第 5 章：kernel 方法','chapter 5: kernel methods'),'06':('第 6 章：支援向量機','chapter 6: support vector machines'),'13':('第 13 章：獨立成分分析','chapter 13: independent components analysis'),'20':('第 20 章：LQR、DDP 與 LQG','chapter 20: LQR, DDP, and LQG')}
OLDSLUG={}
for f in glob.glob('src/content/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-*.md'):
    s=f.split('/')[-1][:-3]; OLDSLUG[s]=re.search(r'chapter-(\d\d)',s).group(1)
link=re.compile(r'\[([^\]]*)\]\(/posts/ai/(2026-08-22-stanford-cs229-2026-notes-chapter-[0-9a-z-]+)\)')
def target(slug):
    ch=OLDSLUG[slug]; en=slug.endswith('-en')
    if ch in ORPH: return None,ch,en
    return L[CH[ch]],ch,en
if __name__=='__main__':
    apply='--apply' in sys.argv; n=0; dup=[]
    for f in glob.glob('src/content/posts/**/*.md',recursive=True):
        if 'stanford-cs229-2026-notes-chapter' in f: continue
        s=open(f).read()
        if 'stanford-cs229-2026-notes-chapter' not in s: continue
        out=[]
        for line in s.split('\n'):
            if 'stanford-cs229-2026-notes-chapter' in line:
                orphan=False
                def rep(m):
                    global n; nonlocal_orph[0]=nonlocal_orph[0]
                    t,ch,en=target(m.group(2)); n+=1
                    if t is None:
                        nonlocal_orph[0]=True
                        return f"[{'CS229 lecture notes, ' if en else 'CS229 主講義'}{ORPH[ch][1 if en else 0]}]({PDF})"
                    return f"[Stanford CS229 {t[2] if en else t[1]}]({P}{t[0]}{'-en' if en else ''})"
                nonlocal_orph=[False]
                new=link.sub(rep,line)
                if nonlocal_orph[0]:
                    new=new.replace('站內 [CS229 主講義','[CS229 主講義').replace("The site's [CS229 lecture notes","[CS229 lecture notes")
                    new=re.sub(r'\]\(%s\)與\[CS229 主講義第'%re.escape(PDF),'](%s)與[第'%PDF,new)
                urls=re.findall(r'\((/posts/ai/2026-10-12-stanford-cs229[^)]*)\)',new)
                if len(urls)!=len(set(urls)): dup.append((f,new[:300]))
                if 'stanford-cs229-2026-notes-chapter' in new: print('LEFT',f,new[:200])
                line=new
            out.append(line)
        if apply: open(f,'w').write('\n'.join(out))
    print('replaced',n,'dup lines',len(dup))
    for d in dup: print('DUP',d)
