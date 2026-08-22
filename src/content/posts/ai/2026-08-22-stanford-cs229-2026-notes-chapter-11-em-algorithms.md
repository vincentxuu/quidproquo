---
title: "EM 演算法：從高斯混合到 VAE"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs229, machine-learning, unsupervised-learning, em-algorithm, variational-inference, vae]
lang: zh-TW
series:
  name: "Stanford CS229 導讀"
  order: 12
tldr: "第 11 章從高斯混合模型的軟指派出發，用 Jensen inequality 建立 ELBO，將 EM 解釋為對變分分布與模型參數的交替最大化，再以近似後驗與 reparameterization trick 延伸到 VAE。"
description: "CS229 2026 主講義第 11 章導讀：Gaussian mixture、E-step/M-step、Jensen inequality、ELBO、單調 likelihood、variational inference 與 VAE。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-11-em-algorithms-en)

這是 [CS229 Lecture Notes](https://cs229.stanford.edu/main_notes.pdf) 2026 版第 11 章（印刷頁 150–166）的逐章導讀，依 Tengyu Ma 與 Andrew Ng 的官方主講義整理，**不是某學期錄影的重建**。本章的主脊是：隱變數讓直接 maximum likelihood 變難，EM 改為交替估計後驗分布、更新模型參數，VAE 再把這套做法推到神經網路與連續隱變數。

## 高斯混合把群別藏起來

高斯混合模型先抽群別 $z\sim\operatorname{Multinomial}(\phi)$，再依 $z=j$ 抽 $x\sim\mathcal N(\mu_j,\Sigma_j)$。若 $z^{(i)}$ 已知，$\phi_j$ 是第 $j$ 群比例，$\mu_j$ 與 $\Sigma_j$ 是該群樣本的平均與共變異矩陣；但未標記資料看不到 $z$，marginal likelihood 裡出現「先對群別加總、再取 log」，參數彼此纏在一起，沒有同樣簡單的封閉解。

EM 以兩步反覆處理：

$$
w_j^{(i)}=p(z^{(i)}=j\mid x^{(i)};\phi,\mu,\Sigma),
$$

$$
\phi_j\leftarrow\frac1n\sum_iw_j^{(i)},\qquad
\mu_j\leftarrow\frac{\sum_iw_j^{(i)}x^{(i)}}{\sum_iw_j^{(i)}}.
$$

E-step 算每筆資料屬於各成分的後驗機率；M-step 把原本的 0/1 計數換成責任度 $w_j^{(i)}$，更新參數。這是第 10 章 k-means 的軟版本：一個點不必立刻只屬於一群。

## Jensen inequality 如何產生 ELBO

一般隱變數模型有 $p(x;\theta)=\sum_zp(x,z;\theta)$。對任意分布 $Q(z)$，把 $Q(z)$ 乘進去再除回去，並對凹函數 $\log$ 使用 Jensen inequality：

$$
\log p(x;\theta)
=\log\sum_zQ(z)\frac{p(x,z;\theta)}{Q(z)}
\ge \sum_zQ(z)\log\frac{p(x,z;\theta)}{Q(z)}.
$$

右側就是 evidence lower bound（ELBO）。當 $Q(z)=p(z\mid x;\theta)$ 時，比例 $p(x,z;\theta)/Q(z)$ 對 $z$ 為常數，界變成等號。E-step 因此用目前參數把界拉緊；M-step 固定 $Q$，選新的 $\theta$ 把界抬高。

對全部樣本各自建立 $Q_i$ 後，EM 可視為在 $Q$ 與 $\theta$ 上交替最大化 ELBO。由於舊參數處界是緊的，而新參數讓界不下降，所以 observed-data log-likelihood 會單調不減。

## 單調改善不等於全域最佳

EM 的證明只保證 likelihood 序列不下降。隱變數模型通常非凸，初始化不同可能停在不同局部最佳或鞍點；高斯混合還可能出現某成分共變異矩陣縮到接近零、likelihood 失控的退化情況。實作上常用多次初始化、共變異矩陣下限或先驗約束。

另一個限制是 E-step 必須能取得後驗。高斯混合可解析計算 $p(z\mid x)$，複雜神經生成模型通常做不到。這正是 variational inference 的入口。

## 變分推論把精確後驗換成可最佳化家族

ELBO 也可寫成

$$
\operatorname{ELBO}(x;Q,\theta)
=\mathbb E_Q[\log p(x\mid z;\theta)]
-D_{KL}(Q\|p(z)),
$$

或 $\log p(x)-D_{KL}(Q\|p(z\mid x))$。後一式說明：若 $Q$ 不受限制，最大化 ELBO 就會得到真實後驗；若精確後驗不可算，只能在一個可處理的家族 $\mathcal Q$ 中找近似。

VAE 的例子令 $z\sim\mathcal N(0,I)$，decoder 以神經網路 $g(z;\theta)$ 產生 $x$ 的高斯平均；encoder 則以 $x$ 產生近似後驗的平均與對角標準差。對角高斯是假設，也是計算上的取捨：它容易取樣、容易算密度，卻可能離真實後驗很遠。

## reparameterization trick 讓梯度穿過取樣

若直接從依賴 encoder 參數的 $Q_i$ 取樣，不能把梯度天真地移進期望。VAE 改寫為

$$
z^{(i)}=q(x^{(i)};\phi)+v(x^{(i)};\psi)\odot\xi^{(i)},
\qquad \xi^{(i)}\sim\mathcal N(0,I).
$$

隨機性現在集中在與參數無關的 $\xi$；$z$ 成為 $\phi,\psi$ 的可微函數，就能用 Monte Carlo 樣本估計 ELBO 梯度，並同時更新 encoder 與 decoder。這項技巧不是把後驗變精確，而是讓所選近似家族可被有效訓練。

## 章節銜接

本章承接 k-means 的交替更新，把硬指派換成後驗責任度，再以 ELBO 給出一般化原理。第 12、13 章改從線性代數與獨立性尋找低維結構；第 14 章會再次使用第 11 章的 ELBO，把整條加噪路徑視為隱變數並導出擴散模型的去噪目標。

## 自學練習

為一維兩成分高斯混合手算一次 EM。先任選 $\phi_j,\mu_j,\sigma_j^2$，對四個資料點算責任度，再更新均值與混合權重。計算更新前後的 observed-data log-likelihood，確認它沒有下降；換一組初始均值再做一次，觀察最後解是否相同。

## 參考資料

- [CS229 Lecture Notes（2026）第 11.1 節：高斯混合模型與 EM](https://cs229.stanford.edu/main_notes.pdf#page=151)
- [CS229 Lecture Notes（2026）第 11.2–11.4 節：Jensen inequality、ELBO 與一般 EM](https://cs229.stanford.edu/main_notes.pdf#page=154)
- [CS229 Lecture Notes（2026）第 11.5 節：變分推論、VAE 與 reparameterization](https://cs229.stanford.edu/main_notes.pdf#page=163)
