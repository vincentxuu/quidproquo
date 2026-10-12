---
title: "Contrastive Learning and Semantic Retrieval: How to Learn Vectors You Can Compare Without Labels | Stanford CS229 Lecture 13"
date: 2026-10-12
category: ai
type: guide
tags: [cs229, ai-course, stanford, machine-learning, representation-learning, contrastive-learning, rag]
lang: en
series:
  name: "Reading Stanford CS229"
  order: 13
tldr: "This lecture unpacks the SimCLR loss into a B×B similarity matrix: each row is one softmax classification problem whose answer is the diagonal entry. The diagonal gets pulled up and everything else gets pushed down, so the model learns that similar things have nearby vectors without any labels. The second half uses the same vectors for semantic retrieval, then connects that to RAG."
description: "A guide to Lecture 13 of Stanford CS229 Spring 2026: supervised pretraining, contrastive learning and a step-by-step derivation of the SimCLR loss, hard negatives and how batches are sampled, semantic retrieval with embeddings, and the motivation and trade-offs of RAG."
draft: false
math: true
---

> 🌏 [中文版](/posts/ai/2026-10-12-stanford-cs229-lecture-13-representation-learning-semantic-search)

**Video status: Videos included.** This article is written from the English captions of the Spring 2026 Lecture 13 recording published by Stanford Online, with notation checked against Chapter 16 (Representation Learning) of the 2026 main lecture notes. I did not see the board, so the formulas written on it are reconstructed from what the lecturer said and from the notes.

This lecture closes out representation learning in [Reading Stanford CS229](/posts/ai/2026-08-21-stanford-cs229-machine-learning-en). The [previous lecture](/posts/ai/2026-10-12-stanford-cs229-lecture-12-diffusion-loss-foundation-models-lora-en) ended with the idea that a pretrained model can be fine-tuned or topped with a linear probe. This one answers the two questions that follow: what loss function produces that "useful vector" in the first place, and what the vector is still good for in the age of large language models. The lecturer is Tengyu Ma. He and Chris Ré split the spring offering between them, and Chris Ré said at the end of Lecture 10 that it was his last one of the term. The prerequisites are softmax, the cross-entropy loss, and the inner product of two vectors. After reading, you should be able to write down the SimCLR loss yourself, compute it by hand on a small batch, and say which step of semantic retrieval and of RAG uses these vectors.

One thing to settle first. The YouTube title of this video is "LLMs, Next-Word Prediction Loss", but the 61 minutes never reach the training objective of language models. Large language models appear only in the last eight minutes, as users of RAG, and the next-word prediction loss is left for the [next lecture](/posts/ai/2026-10-12-stanford-cs229-lecture-14-llm-next-token-attention-en). What this lecture actually covers is Chapter 16 of the notes.

```youtube
url: https://www.youtube.com/watch?v=lNTajqxxOn4
title: Stanford CS229 Machine Learning | Spring 2026 | Lecture 13: LLMs, Next-Word Prediction Loss
captions: en
```

## What the vector we want looks like

(Recording 00:00–03:12)

Representation learning wants a function $\phi_\theta$, with parameters $\theta$, that maps a raw input $x$ (an image, a piece of text, an audio clip, or a video) to an $m$-dimensional vector $\phi_\theta(x)\in\mathbb{R}^m$. That vector goes by several names: representation, feature, embedding. The lecturer says "representation" is too generic a word and that "embedding" is the one you hear most these days, so that is the word he uses.

A good embedding has to do one thing: similar inputs land close together and dissimilar ones land far apart. Two photos of different cats should have vectors near each other, and an airplane's vector should be somewhere else. With that property you can run a similarity search. Given one cat image, you find other cat images by looking for the vectors closest to it.

The previous lecture mentioned another use for embeddings, which is putting a linear classifier on top (a linear probe). Here the lecturer says outright that this use has become less common, because the whole model can be trained end to end and there is no need to split it into two stages. So in his view the most important use of embeddings today is similarity search, and the second half of the lecture comes back to it.

## Supervised pretraining: take the classifier's penultimate layer

(Recording 03:12–12:21)

The first training method is easy to describe. The lecturer says it is no longer common and moves through it quickly.

Take a large labeled dataset, such as ImageNet with its one thousand classes, and train an ordinary classification network. The network has many layers. The output of the penultimate layer is a vector, which a matrix $W$ turns into logits, which then go through a softmax. After training, throw away $W$ and the softmax and declare the penultimate layer's output to be $\phi_\theta(x)$.

Why would that vector be useful? The lecturer says there is no proof, only an intuition. The last layer is just a linear classifier, and if the penultimate vectors did not already put similar images together, a linear classifier could not separate the classes at all. A network that gets a thousand classes right has already sorted out the semantics in its earlier layers.

The method has two limits. First, the labels have to be diverse enough. If the labels are only the ten digits 0 to 9, the network only needs to recognize strokes that matter for digits. In a more extreme case the labels are just "black-and-white photo" and "color photo", and the network can get every example right without any sophisticated representation, so the vectors it learns are useless for other tasks. Second, scaling up means labeling more data, which is expensive. That second point is the reason to move to unsupervised methods.

Three student questions come up in this part, all of them places where a self-learner tends to get stuck:

- **"Where does the correct embedding come from?"** There is no such thing. The lecturer's answer is "There's no so-called ground truth representation, by the way." (around 08:19). The training labels are discrete classes (bulldog, Persian cat, fire truck), not vectors. The vectors are a by-product of training, and whether they are good depends only on whether they have the property described above.
- **"Can't you just concatenate the pixels into one vector?"** No. The same Persian cat can appear at different positions in the frame, and a pixel-by-pixel comparison will show a huge difference, yet a person sees the same cat immediately. An embedding has to extract semantics, and raw pixels cannot do that.
- **"How is this different from fine-tuning?"** Here you train a classification network from scratch, remove the final linear layer when training is done, and the deliverable is the penultimate layer. There is no later adjustment step.

## Contrastive learning: one pull, one push

(Recording 12:21–25:42)

Now all we have is a pile of unlabeled images. The goal is unchanged: similar images should get nearby vectors.

**Step one: manufacture a "similar pair".** Apply random data augmentation to the same image $x$ twice, producing $\hat{x}$ and $\tilde{x}$. Augmentations include random cropping, flipping, blurring, adding noise, and changing colors or converting to grayscale. The lecturer thinks cropping is probably the most important one, and that the exact set matters little as long as it is diverse. The two augmentations use different random seeds, so one might be the top-right corner of the original and the other the bottom-left. They come from the same image, so we ask $\phi_\theta(\hat{x})$ and $\phi_\theta(\tilde{x})$ to be close. None of this needs a label.

**Step two: notice that a pull alone breaks.** If the loss only asks these two vectors to be close, the cheapest solution maps every image to the same point, and every pair has distance zero. In the lecturer's words, "close" means nothing without a relative comparison. You have to say at the same time what should be far.

**Step three: add a push.** Draw another image $z$ at random from the dataset and augment it too, getting $\hat{z}$ (the lecturer says the only reason to augment $z$ is to put it in the same kind of input space as $\hat{x}$). Then ask $\phi_\theta(\hat{x})$ and $\phi_\theta(\hat{z})$ to be far apart. The whole objective is these two rules: augmentations of the same image should be close, and augmentations of different images should be far.

### What if the other randomly drawn image is also a cat

The lecturer asks the class what is wrong with this design, and a student answers right away: $x$ and $z$ might be similar to begin with. Both could be Persian cats, or two airplanes that look alike, and pushing them apart then does the opposite of what we want.

The lecturer agrees this is real, then says it is fine. Draw two images at random from a large collection and nearly always you get an airplane with a chair, or a cat with a building. The chance that they are truly similar is small. His words are "With some small chance, they are similar, but you just say those are collateral damage." (around 16:23). The benefit of the push outweighs the damage.

Students follow up several times, each phrasing it differently, and the lecturer's eventual summary is to think of it as several forces in balance: "you should think of this as multiple different forces that balance each other." (around 25:42). Even when the loss occasionally tries to push two cats apart, the other terms (each cat's own positive pair, and the pushes between the cats and the airplanes and chairs) keep them in the same region, so the mistaken push does not succeed.

Two more clarifications from this exchange are worth writing down:

- **Nobody asks for "cats closer to dogs than to airplanes".** The lecturer says that is not the goal at this point. Treat cats, dogs, and airplanes as three different things, all far from one another. He adds that when you look at real data, a cat's nearest neighbors are often only cats of the same breed, and cats of different breeds are already fairly far apart. Some hierarchical structure does emerge in the end, but it is a secondary effect.
- **What you need is diverse images, not labels.** If the dataset is all cats, the assumption that two random draws are mostly dissimilar fails. The lecturer agrees, then points out that diverse unlabeled images are easy to get, since you can download them from the web. Labels have always been the hard part.

## The SimCLR loss: writing the goal as a matrix

(Recording 25:42–38:47)

The next job is to turn "these pairs close, those pairs far" into a formula you can optimize. The lecturer uses the SimCLR approach, with a warning up front: this formula is not the most concise way to express the idea above, and it is written this way for computational efficiency.

### Building the similarity matrix

Sample a batch of $B$ images $x^{(1)},\dots,x^{(B)}$. Augment each image twice to get $2B$ inputs:

$$
\hat{x}^{(1)},\dots,\hat{x}^{(B)},\qquad \tilde{x}^{(1)},\dots,\tilde{x}^{(B)}
$$

The similarity of two inputs is defined as the inner product of their embeddings. In practice the embeddings are usually normalized to unit length first, in which case the inner product equals the cosine similarity. Arrange all the similarities between "hat" versions and "tilde" versions into a $B\times B$ matrix:

$$
S_{ij}=\phi_\theta(\hat{x}^{(i)})^\top\phi_\theta(\tilde{x}^{(j)})
$$

The diagonal entry $S_{ii}$ compares two augmentations of the same image, and we want it large. An off-diagonal entry $S_{ij}$ ($j\neq i$) compares augmentations of different images, say a cat against an airplane, and we want it small. The lecturer says nothing deep has happened so far. This is the same goal in a different language. The question still open is: how large is large, and how small is small?

### Writing the loss row by row

The answer is to look one row at a time. The loss for row $i$ is

$$
\ell_i=-\log\frac{\exp(S_{ii})}{\exp(S_{ii})+\sum_{j\neq i}\exp(S_{ij})}
$$

The loss for the whole batch adds up the rows:

$$
L_{\text{pre}}(\theta)=\sum_{i=1}^{B}\ell_i
$$

This matches the formula in Section 16.2 of the notes: fix $\hat{x}^{(i)}$ and sum over $\tilde{x}^{(j)}$, which under the definition of $S_{ij}$ above is a sum along row $i$. In the video you will hear the lecturer first say "each row" and then switch to "each column" partway through. He says himself that this is only a matter of notation (around 31:06). This article follows the notes and writes rows throughout.

### Checking that it does what we want

Call the numerator $A=\exp(S_{ii})$ and the extra term in the denominator $B_{\text{neg}}=\sum_{j\neq i}\exp(S_{ij})$ (in class it is just called B; the subscript here keeps it from being confused with the batch size). Both are positive, and the loss is

$$
\ell_i=-\log\frac{A}{A+B_{\text{neg}}}
$$

**Monotonicity in $B_{\text{neg}}$.** When $B_{\text{neg}}$ grows, the denominator grows and the fraction $\frac{A}{A+B_{\text{neg}}}$ shrinks. $\log$ is increasing, so $\log$ of the fraction shrinks too. The minus sign in front then makes $\ell_i$ grow. So $\ell_i$ is increasing in $B_{\text{neg}}$, and a small loss needs a small $B_{\text{neg}}$, which means every $S_{ij}$ ($j\neq i$) should be small.

**Monotonicity in $A$.** This time $A$ appears in both numerator and denominator, so you cannot read it off directly. The lecturer rewrites it:

$$
\frac{A}{A+B_{\text{neg}}}=1-\frac{B_{\text{neg}}}{A+B_{\text{neg}}}
$$

When $A$ grows, $\frac{B_{\text{neg}}}{A+B_{\text{neg}}}$ shrinks, so one minus it grows, its $\log$ grows as well, and the minus sign makes the result shrink. So $\ell_i$ is decreasing in $A$, and a small loss needs a large $S_{ii}$.

Both directions line up: minimizing $\ell_i$ raises the diagonal and lowers the other entries in the same row. As for "how large is large", the answer is in the shape of the formula. The loss only cares how much $S_{ii}$ stands out relative to the other entries in its row. The absolute value does not matter.

### Another view: this is multiclass classification

The lecturer then points out that this formula is something familiar. Hand someone $\hat{x}^{(i)}$ and ask which of $\tilde{x}^{(1)},\dots,\tilde{x}^{(B)}$ is its partner. That is a $B$-class classification problem whose correct answer is class $i$ and whose logits are the similarities in row $i$, $S_{i1},\dots,S_{iB}$. Apply a softmax to the logits and take the negative log of the probability of the correct class, and you have the cross-entropy loss, which is the $\ell_i$ above. The lecturer says "This is just literally a softmax." (around 35:30), and adds that the people who first proposed this objective probably arrived at it this way.

The probability form is easier to remember. Let

$$
p_{ij}=\frac{\exp(S_{ij})}{\sum_{k=1}^{B}\exp(S_{ik})}
$$

Then $\ell_i=-\log p_{ii}$. Each row is one multiple-choice question, and $p_{ii}$ is the probability that the model picks the right partner.

## Computing one batch by hand

The following is an example made up for this article, not from the lecture.

Take $B=3$ and let the embeddings be two-dimensional unit vectors, each described by its angle from the x-axis, so the inner product of two vectors is the cosine of the difference between their angles. Suppose that at some point the model gives:

| Image | Content | Angle of $\hat{x}$ | Angle of $\tilde{x}$ |
|---|---|---|---|
| 1 | Cat | 0° | 20° |
| 2 | Airplane | 90° | 110° |
| 3 | Chair | 200° | 230° |

**Compute the similarity matrix.** $S_{ij}=\cos(\text{angle of }\hat{x}^{(i)}-\text{angle of }\tilde{x}^{(j)})$:

$$
S=\begin{pmatrix}0.940 & -0.342 & -0.643\\ 0.342 & 0.940 & -0.766\\ -1.000 & 0.000 & 0.866\end{pmatrix}
$$

For example, $S_{11}=\cos 20°=0.940$, $S_{12}=\cos 110°=-0.342$, and $S_{13}=\cos 230°=-0.643$.

**Compute the loss for row 1.** Exponentiate first: $e^{0.940}=2.559$, $e^{-0.342}=0.710$, $e^{-0.643}=0.526$, which sum to $3.795$. So

$$
p_{11}=\frac{2.559}{3.795}=0.674,\qquad \ell_1=-\log 0.674=0.394
$$

The same calculation gives $p_{22}=0.577$ and $\ell_2=0.549$, and $p_{33}=0.635$ and $\ell_3=0.454$. The batch loss is the sum of the three rows, about $1.398$ (summing the unrounded values; adding the three three-decimal figures above directly gives $1.397$).

**That number only means something next to a baseline.** Consider the degenerate solution from earlier, where every image maps to the same point. Every entry of $S$ is then 1, the softmax in each row is uniform at $1/3$, each row's loss is $\log 3=1.099$, and the batch loss is $3.296$. With only the pull, the degenerate solution has zero loss. Once the sum in the denominator is added, its loss becomes $B\log B$, far higher than the $1.398$ of the reasonably tidy arrangement above. It is no longer where the loss is lowest, and optimization has no reason to stop there. That is how the push gets written into the formula.

**What collateral damage looks like.** Replace image 3 with another cat at angles $\hat{x}^{(3)}=10°$ and $\tilde{x}^{(3)}=30°$, crowded into the same region as the cat in image 1. Row 1 becomes $S_{11}=0.940$, $S_{12}=-0.342$, $S_{13}=\cos 30°=0.866$, so

$$
p_{11}=\frac{2.559}{2.559+0.710+2.377}=0.453,\qquad \ell_1=0.791
$$

The loss rises from $0.394$ to $0.791$, and the reason it rises is that the model put the two cats close together, which is exactly the behavior we want. This is the collateral damage the lecturer describes: in this entry the loss penalizes the right thing.

### How hard each entry gets pushed or pulled

This subsection is a derivation added in this article. It was not written in class, but it explains why the next section goes looking for hard negatives. Expand $\ell_i$:

$$
\ell_i=-S_{ii}+\log\sum_{k=1}^{B}\exp(S_{ik})
$$

Differentiate with respect to each $S$. The derivative of the second term with respect to $S_{ij}$ is $\frac{\exp(S_{ij})}{\sum_k\exp(S_{ik})}=p_{ij}$, so

$$
\frac{\partial\ell_i}{\partial S_{ii}}=p_{ii}-1,\qquad \frac{\partial\ell_i}{\partial S_{ij}}=p_{ij}\quad(j\neq i)
$$

Gradient descent moves along the negative gradient. $p_{ii}-1$ is negative, so $S_{ii}$ gets pushed up with strength $1-p_{ii}$. $p_{ij}$ is positive, so $S_{ij}$ gets pressed down with strength $p_{ij}$.

Apply this to row 1 of the first example: $p_{11}=0.674$, $p_{12}=0.187$, $p_{13}=0.139$. The pull on the positive pair has strength $0.326$, and the pushes on the two negative pairs have strengths $0.187$ and $0.139$, which also add up to exactly $0.326$. That holds in general, because the probabilities in a row sum to 1.

Two things follow. First, the strength with which a negative pair is pushed apart equals the probability that the model mistakes it for the partner. A negative pair that is already far away has $p_{ij}$ near zero and supplies almost no signal. Second, in the collateral-damage example $p_{13}=0.421$, so the cat treated as a negative receives more than three times the push that the real negative does (the airplane, at $0.126$). False negatives hurt most exactly when the model has placed them correctly.

## Where positive and negative pairs come from, and how to make the question harder

(Recording 38:47–49:03)

A student asks: counted this way there are far more negative pairs than positive pairs, so is that the ratio you want? The lecturer first supplies the vocabulary. Two augmentations of the same image are a **positive pair**, and the rest are **negative pairs**. Some people call them random pairs, because they are not necessarily "negative", but the lecturer has seen the field settle on negative pair. A footnote in the notes also says random pair may be the more accurate term.

### Positive pairs do not have to come from augmentation

Positive pairs can be made in other ways. Pair an image with a piece of text describing it, with the image as $\hat{x}^{(i)}$ and the text as $\tilde{x}^{(i)}$. Now every hat version is an image and every tilde version is text. Matching indices are positive pairs and different indices are negative pairs. The lecturer says this is how shared representations for images and text are trained.

Pure text usually has no augmentation as natural as cropping. The lecturer mentions one approach from published papers: a document's title and subheadings form one version and its body forms the other, and together they make a positive pair. The title of document A paired with the body of document B is a negative pair.

### Having many negative pairs is reasonable, but random negatives are too easy

Back to the student's question. Only the diagonal of the matrix holds positive pairs and the other $B^2-B$ entries are all negative pairs, so the counts really are lopsided. The lecturer thinks this is reasonable, because a negative pair carries a much weaker signal. Two completely different images are easy to tell apart, so you need more of them to balance the signal from the positive pairs. The gradient in the previous section says the same thing: an easy negative pair has $p_{ij}$ near zero, and one of them does not offset much.

Going further, practice has shown that random negative pairs are not strong enough and that you need to find **hard negatives**, a process called negative mining. A hard negative is a pair that looks somewhat alike but should not be matched. The lecturer's example: an image shows a cat playing soccer, and a piece of text talks about the World Cup with no cat in it. Should that text be matched to that image? It is ambiguous. Putting such easily confused pairs into the training data raises what the loss demands, and the model can no longer get by on separating things that are obviously different.

The lecturer calls this one of the most useful techniques in practice: "this is actually one of the biggest trick in practice." (around 42:54). The difficulty is that there is no clear place to stop. The negatives you mine look more and more alike, and past some point they really ought to count as positive pairs. Filtering further only confuses the model, so you have to stop somewhere.

A student then asks: if you have very good negative pairs, do you still need the whole matrix? The lecturer says no. You can replace that row with one positive pair plus a set of hard negatives.

### The batch is not the whole dataset, and how you sample it matters

The lecturer adds something he had not made clear earlier: $B$ is not the size of the whole dataset. It is a mini-batch, maybe 128, 1,000, or 4,000. Each time you sample $B$ images, build one matrix, take one update, and move on to the next batch.

How you sample those $B$ examples matters too. In practice the data comes from many sources, for example one dataset that is all buildings and another scraped from web pages. Items from the same source resemble each other more, so people make each batch come entirely from one source, which gives harder negatives for free. The lecturer gives an example from a startup he was involved in, which applied this method to natural language, and he uses code to illustrate. If the examples in a batch are in different programming languages such as Java and C++, they can be told apart at a glance, the loss is naturally small, and the model has nothing to learn. So a batch should come at least from the same programming language, or even the same codebase.

### Where the computational cost is

A student asks why every entry of the matrix has to be computed, since that is $B^2$ numbers. The lecturer's answer is that $B^2$ is not the problem. The real cost is computing the embeddings: each of the $2B$ inputs needs a forward pass, and each forward pass goes through a network with billions of parameters. He says that is the bottleneck ("that's the real computational bottleneck", around 43:58). Once you have the $2B$ vectors, the $B^2$ inner products are cheap.

The lecturer said at the start that the formula is written this way for computational efficiency, and this is where the efficiency shows (connecting the two is this article's reading): $2B$ forward passes buy $B$ positive pairs and $B^2-B$ negative pairs, so the negative pairs come almost for free. With $B=4{,}000$ (the arithmetic here is this article's), 8,000 forward passes yield 4,000 positive pairs and 15,996,000 negative pairs.

As for how many augmented versions to make: sample one random set of augmentations on each pass through the data, and run more epochs if you want more versions. The lecturer adds that in practice people rarely run through the data more than a few times.

### An addition in this article: why the original SimCLR has a temperature parameter

A footnote in the notes says the formula used in class is a simplified version of the original loss. The original SimCLR divides the similarity by a temperature parameter $\tau$ before exponentiating, and both the lecture and the notes leave it out. The explanation below is an addition in this article, not lecture content.

If the embeddings are normalized to unit length, $S_{ij}$ can only fall between $-1$ and $1$. The best case is $S_{ii}=1$ with everything else at $-1$ (for $B>2$ this is geometrically impossible, so it is a loose upper bound), which gives

$$
p_{ii}\le\frac{e}{e+(B-1)e^{-1}}
$$

For $B=3$ the upper bound is $0.787$. For $B=128$ it is only $0.055$, which corresponds to a per-row loss of at least $2.90$. In other words, without a temperature and with a large batch, the softmax cannot concentrate probability on the positive pair even under the most favorable arrangement. Dividing by a $\tau$ smaller than 1 widens the range of the logits, so the multiple-choice question can be answered with confidence. Take $\tau=0.1$ (a number picked arbitrarily for this article): the logits now range from $-10$ to $10$, and for $B=128$ the same upper bound becomes $\frac{e^{10}}{e^{10}+127e^{-10}}\approx 0.9999997$.

## Semantic retrieval: turning search into finding the nearest vector

(Recording 49:03–52:09)

Once you have an embedding model, semantic retrieval is straightforward.

The setup: there is a collection of documents (or images) $d_1,\dots,d_n$, a query $q$ arrives, and you want the most relevant few. In the image version you find similar images for a new image. In the text version you find the documents that best answer a question.

It works in two stages:

1. **Ahead of time**: run every document through the model, compute $\phi_\theta(d_1),\dots,\phi_\theta(d_n)$, and store them.
2. **At query time**: compute $\phi_\theta(q)$, then find

$$
i^\star=\arg\max_{i}\ \phi_\theta(q)^\top\phi_\theta(d_i)
$$

You usually take more than the top one. The top ten or so works too.

The simplest implementation is brute force: take the inner product of the query vector with every stored vector and sort. This step does not run the neural network again. The document vectors were computed long ago, and all you hold is a pile of vectors. The notes add the cost: with $n$ documents and $m$-dimensional vectors, each query is $O(nm)$ (the notes write the number of documents as a capital $N$).

To go faster, use a k-nearest neighbor algorithm, which finds the $k$ points closest to the query among a large set. The lecturer says this is a purely algorithmic problem outside the scope of this course, and that in practice you use a vector database, which is built to store vectors and find the largest inner products quickly.

A small example (made up for this article): keep the two-dimensional unit vectors, put the query at 25°, and put four documents at 10°, 100°, 50°, and 250°. The inner products are $\cos 15°=0.966$, $\cos 75°=0.259$, $\cos 25°=0.906$, and $\cos 225°=-0.707$. The top two are documents 1 and 3. No words were matched anywhere in the process. Relevance is decided entirely by the geometry learned in training, so how well the embedding is trained directly determines retrieval quality.

## RAG: handing the retrieved results to a language model

(Recording 52:09–1:00:33)

The lecturer first says that semantic retrieval is useful on its own. Apart from some long-established systems, anyone building a search system today should probably use this method. He mentions that Google most likely uses semantic retrieval to some degree as well, but outsiders do not know the details, and it is a blend of many methods.

Then comes another use that appeared with large language models: retrieval-augmented generation (RAG).

### Motivation

Off-the-shelf large language models are trained by a handful of frontier labs. They have never seen the internal data of individual companies, and that data cannot flow into their training sets. The same goes for individuals: you want a personal assistant, but there is some data you do not want to send out for someone else to train on. So at the moment you use the model, you need some way to feed it this proprietary data.

One way is fine-tuning: start from the base model and keep training on your own data. The lecturer says this is a good idea in some applications but is often too expensive. The data may be small, and you would not want to stand up a model with a huge number of parameters on your own GPUs for it, or pay for fine-tuning and hosting.

### The pipeline

RAG is the simpler route:

1. You have a query and a corpus (the files on a laptop, or a company's internal documents).
2. Retrieve first, finding the relevant documents in the corpus. This step is the semantic retrieval of the previous section.
3. Put the retrieved documents (usually around five or ten) into the language model's context along with the query.
4. The language model sees both the query and the documents and produces an answer.

The model's parameters are not touched at all. It is simply given extra information in the chat interface. The notes write this step as conditional generation: if $\hat{R}(q)$ is the top $k$ items retrieved for the query $q$, the language model generates $y\sim p_\psi(y\mid q,\hat{R}(q))$.

### Trade-offs

The lecturer lists several advantages of RAG over fine-tuning, all of which come from the fact that the retrieval piece is almost entirely separate from the language model:

- **Access control is easy.** Some users should not see certain documents, such as a company's unreleased earnings forecast. You just keep them from finding those documents at the retrieval stage.
- **Deletion is easy.** Delete a document from the corpus and it will never be retrieved again. By contrast, if you fine-tune all of a company's data into the model, making the model "forget" one item is hard. The lecturer says this is still a fairly open problem.
- **It is cheap.** The retrieval step costs far less than training.

### Retrieval does not have to use embeddings

In the last two minutes the lecturer adds a note on the current frontier, and he hedges it carefully. He says Anthropic now uses a different kind of search at this stage: the language model generates regular expressions to search for keywords, and it generates many of them, covering variations of the keywords. He also says he is not sure of the details, because outsiders cannot see what frontier models actually do, and this is only the general understanding.

This approach works very well on code, because a codebase is highly structured: there is a clear file tree, variable names and function names are strict keywords, and regular expressions can do a great deal. In other settings semantic retrieval is still very useful, and the two can be combined. His conclusion is that RAG itself is definitely needed, but how to do the retrieval step depends on the application: "we don't know exactly which one is the best way yet." (around 59:31).

The lecturer says the remaining ten minutes are not enough to start the next topic, and the lecture ends here.

## Self-check

**1. If you keep only the "positive pairs should be close" term, what is the optimal solution? How does the SimCLR loss rule it out? Compute the batch loss of the degenerate solution for $B=4$.**

Answer: the optimal solution maps every input to the same vector, so every distance is zero. Under the SimCLR loss this solution makes every entry of $S$ equal, each row's softmax is uniform at $1/B$, and each row's loss is $\log B$. For $B=4$ the batch loss is $4\log 4\approx 5.545$, which is not zero, so it is no longer optimal.

**2. One row has similarities $(S_{i1},S_{i2},S_{i3})=(2,\,0,\,0)$, with the positive pair in entry 1. Compute $\ell_i$, and say how much lowering $S_{i2}$ from 0 to $-5$ helps the loss.**

Answer: $\ell_i=-\log\frac{e^2}{e^2+1+1}=-\log\frac{7.389}{9.389}=0.240$. After lowering $S_{i2}$ to $-5$, the denominator becomes $7.389+0.007+1=8.396$ and $\ell_i=-\log 0.880=0.128$. The loss drops by only about $0.11$. If you lower it again from $-5$ to $-10$, the denominator barely changes and neither does the loss. Criterion: you can say that "pushing an already distant negative pair further does nothing" and connect it to the motivation for hard negatives.

**3. A student says: "The negative pairs contain false negatives, so the vectors learned by contrastive learning must push things of the same class apart." What is wrong with this statement?**

Answer: the criterion is that the answer includes two points. One, the chance of randomly drawing the same class is small, provided the data is diverse enough. Two, the loss is a sum of many terms, and the other terms keep the same class together, so the mistaken push does not succeed. Better still if you can add that "this problem does become serious when hard-negative mining goes too far, which is why you have to stop".

**4. When the batch size goes from $B$ to $2B$, by what factor does the number of forward passes grow, and by what factor does the number of entries in the similarity matrix grow? Which one determines the training cost?**

Answer: forward passes go from $2B$ to $4B$, a factor of two. Matrix entries go from $B^2$ to $4B^2$, a factor of four. The cost is determined by the forward passes, because each one goes through the entire network, while each matrix entry is a single inner product.

**5. A company wants a language model to answer questions about its internal documents. Some of the documents are visible only to the finance department, and documents are added and removed every week. How would fine-tuning and RAG each handle these two requirements?**

Answer: RAG filters documents by user permission at the retrieval stage, and adding or removing documents only requires updating the corpus and the corresponding vectors. Fine-tuning writes the content into the parameters, so it cannot distinguish who is allowed to see what, there is no clean way to remove the influence of one document, and weekly updates mean retraining. Criterion: the answer has to point out that the difference between the two approaches comes from "whether the knowledge sits outside the model or inside it".

## Corresponding reading

Main lecture notes, Chapter 16 Representation Learning, pages 196–201:

- **16.1 Supervised pretraining** (page 196): corresponds to the second section of this article. The notes call the last layer $U$, while the lecturer says $W$ out loud.
- **16.2 Contrastive learning** (pages 196–198): corresponds to the contrastive learning and SimCLR sections of this article. The loss function is the same as in class. The notes use a husky and an elephant as the example, and the lecture uses a cat and an airplane. The monotonicity check is only a footnote in the notes ($-\log\frac{p}{p+q}$ is decreasing in $p$ and increasing in $q$), while in class it gets worked through in full because of student questions. Figure 16.1 illustrates positive and negative pairs.
- **16.3 Semantic retrieval** (pages 198–200): corresponds to the semantic retrieval section.
- **16.4 Retrieval-augmented generation** (page 201): corresponds to the RAG section. The notes give it a single paragraph.

**In the lecture but not in the notes:** the picture of several forces in balance and the whole exchange about false negatives; the multiclass classification interpretation; hard negatives and negative mining; image-text pairs and the "title paired with body" way of making positive pairs; sampling a batch from a single source; the $2B$ forward passes as the real cost bottleneck; the trade-offs of RAG against fine-tuning in access control, deletion, and cost; and replacing semantic retrieval with regular-expression search.

**In the notes but not covered in the lecture:** the supervised contrastive approach, which defines positive pairs by class label; the kinds of approximate nearest neighbor index (graph indexes such as HNSW, quantization, inverted indexes, and centroid-based indexes); and the retrieval evaluation metrics Recall@k and NDCG@k (Equations 16.1–16.3). If you plan to evaluate a retrieval system yourself, read that part of pages 199–200 separately.

**Title versus content:** the "LLMs, Next-Word Prediction Loss" in the video title corresponds to Chapter 17 of the notes, which this lecture does not reach.

Series navigation: previous [Lecture 12: the noise-prediction loss of diffusion models, foundation models, and LoRA](/posts/ai/2026-10-12-stanford-cs229-lecture-12-diffusion-loss-foundation-models-lora-en) | next [Lecture 14: the next-token loss of large language models and attention](/posts/ai/2026-10-12-stanford-cs229-lecture-14-llm-next-token-attention-en) | [Course overview](/posts/ai/2026-08-21-stanford-cs229-machine-learning-en)

## Course video sources

Original video: [Stanford CS229 Machine Learning | Spring 2026 | Lecture 13: LLMs, Next-Word Prediction Loss](https://www.youtube.com/watch?v=lNTajqxxOn4)

- [Stanford CS229 Machine Learning | Spring 2026 playlist (Stanford Online, 17 videos)](https://www.youtube.com/playlist?list=PLaqpC4kq8Gpw)
- [CS229 course website](https://cs229.stanford.edu/)
- [CS229 main lecture notes, main_notes.pdf](https://cs229.stanford.edu/main_notes.pdf)

Checked: 2026-10-12.

Content check: verified against the video transcript (2026-10-12): I read the full English captions (about 61 minutes). The English quotations and timestamps in this article all come from the captions, and each timestamp is the start of the caption segment containing that sentence. I did not watch the board, and the loss function is reconstructed from Section 16.2 of the notes. The places where the lecturer switches between "row" and "column" are noted in the text. Several student questions are not clearly audible in the captions, so this article only covers the parts where the lecturer's answer gives clear content.

## References

- [Stanford CS229 Machine Learning | Spring 2026 | Lecture 13 (YouTube)](https://www.youtube.com/watch?v=lNTajqxxOn4): the main source for this article. The order of the lecture, the lecturer's statements, and the quotations all come from this video's English captions.
- [CS229 main lecture notes, main_notes.pdf, Chapter 16 Representation Learning](https://cs229.stanford.edu/main_notes.pdf): the notation for the SimCLR loss, the cost of brute-force search, the conditional-generation form of RAG, and the page numbers and not-covered-in-class material in "Corresponding reading".
- [Chen et al. (2020). A Simple Framework for Contrastive Learning of Visual Representations](https://arxiv.org/abs/2002.05709): the original SimCLR paper, which Section 16.2 of the notes cites. The temperature parameter added in this article comes from this paper.
- [Reading Stanford CS229: Course Overview](/posts/ai/2026-08-21-stanford-cs229-machine-learning-en): the entry point to the series and the prerequisite relationships between lectures.
