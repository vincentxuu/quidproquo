---
title: "Taking Apart Cathay United Bank's Personal Loan Rates: 1.88% Is Marketing, the Real Price Lives in the Spread and the APR"
date: 2026-07-27
category: investing
type: deep-dive
tags: [personal-loan, interest-rate, apr, taiwan-banking, debt]
lang: en
tldr: "Cathay United Bank advertises its flagship personal loan at 'from 1.88%', but the officially disclosed annual percentage rate is 5.99%–17.40%. Break it down and every plan is the same 1.74% deposit rate index plus a different spread — ranging from 1.25% on the preferred-occupation program to 3.69% on the tiered-rate plan, nearly a 3x gap. On a NT$1M seven-year loan, the tiered plan costs NT$8,893 more than the flat one."
description: "Using Cathay United Bank's 2026 official rate disclosures, this piece dissects the 'index + spread + fees' pricing structure behind Taiwanese personal loans, and computes the real cost difference and break-even point between tiered and flat rate plans."
draft: false
---

> 🌏 [中文版](/posts/investing/2026-07-27-cathay-personal-loan-rate)

The product page for [Cathay United Bank's Taixingfu personal loan](https://www.cathaybk.com.tw/CATHAYBK/Personal/Loan/Product/Personal-Loan) (泰幸福信用貸款) leads with a large "rates from 1.88%". Scroll down the same page and the officially disclosed annual percentage rate reads "tiered: 5.99%–16.08%; flat: 5.99%–17.40%".

Same product, same page, one number is 1.88% and the other is 17.40%. This is not a contradiction — it is the standard way personal loans are priced in Taiwan: **the advertisement states the entry threshold, the disclosure states the price.**

This piece uses Cathay United Bank's 2026 official rate data as a worked sample, because every bank's personal loan runs on the same arithmetic — understand one and you understand all of them. Every calculation here is reproducible, and I validated the model against the bank's own worked example.

## A personal loan is only three numbers

Whatever the advertisement says, the price of a floating-rate personal loan is determined by three things:

```
your rate  = benchmark index (deposit rate index) + spread (how the bank prices you)
your cost  = the rate above                       + one-off fees (origination fee)
```

The benchmark index is public and identical for everyone. The spread is the bank's pricing of you personally. The fee is a fixed cost, but because it is paid at drawdown, it hits short-tenor, small-principal loans surprisingly hard.

On the **benchmark index**, per [Cathay United Bank's official rate board](https://accessibility.cathaybk.com.tw/rate-search.aspx) (data as of 2026/07/27):

| Item | Rate |
|---|---|
| Deposit rate index — quarterly reset | 1.74% |
| Deposit rate index — monthly reset (flexible index) | 1.74% |
| Base rate | 3.569% |
| Prime lending rate | 6.484% |

Per the [Cathay deposit and lending rate page](https://www.cathaybk.com.tw/cathaybk/personal/product/deposit/rate/), the index is defined as:

> The "deposit rate index" references the average fixed rate on one-year general time savings deposits across ten banks, namely: Bank of Taiwan, Land Bank, Taiwan Cooperative Bank, First Bank, Hua Nan Bank, Chang Hwa Bank, Taipei Fubon, Mega Bank, Taiwan Business Bank, and CTBC Bank. (in Chinese)

That 1.74% deserves a second look. The Taixingfu product page cites the "November of ROC year 114" posting — that is November 2025. Today's board (2026/07/27) still reads 1.74%, meaning **the index has not moved in eight months**. So in the near term your rate is unlikely to change; but the contract specifies floating interest, and the moment the index moves, your monthly payment moves with it.

## The spread is how the bank actually prices you

Subtract 1.74% from each plan's headline rate and the bank's pricing of different customer segments is laid bare:

| Plan | Headline rate (from) | = Index + Spread | Fee |
|---|---|---|---|
| [Preferred-occupation program (code F16)](https://www.cathaybk.com.tw/cathaybk/promo/event/loan/product/AJOB_PJ/index.html) | 2.99% | 1.74% + **1.25%** | NT$9,000 |
| [Corporate employee loan (flat)](https://www.cathaybk.com.tw/cathaybk/personal/loan/product/employee-loan) | 3.15% | 1.74% + **1.41%** | NT$3,000 |
| [Dashu Express Loan](https://www.cathaybk.com.tw/cathaybk/personal/campaigns/loan/taxsup-loan) | 3.33% | 1.74% + **1.59%** | NT$5,000–7,000 |
| Corporate employee loan (tiered, from period 4) | 3.35% | 1.74% + **1.61%** | NT$3,000 |
| Taixingfu (flat) | 4.73% | 1.74% + **2.99%** | NT$9,000 |
| Taixingfu (tiered, from period 7) | 5.43% | 1.74% + **3.69%** | NT$9,000 |

Same bank, same index, same day — and the spread ranges from 1.25% to 3.69%, **close to a 3x difference**. Almost none of the price variation comes from "market rates"; it comes from which product line you land in.

The relationship between "Taixingfu" and the "preferred-occupation program" is the most striking part. The official F16 page discloses a flat rate of 2.99%–7.99% and an APR of 4.23%–9.29%. The public Taixingfu flat rate is 4.73%–16%, APR 5.99%–17.40%.

They are in fact **the same product** — the F16 page states explicitly that the promotion "is limited to general personal loans (i.e. the Taixingfu personal loan)". The only difference is whether you typed `F16` into the "program code" field when applying. Type it, and the rate ceiling drops from 16% to 7.99%, the APR ceiling from 17.40% to 9.29%.

**Same product, same person, one code — and the worst-case price halves.** This is the most actionable line in the article: before applying, check whether your occupation qualifies under the bank's preferred-customer definition, then decide which entry point to submit through.

## Tiered vs flat: I ran the numbers, and intuition is wrong

Taixingfu offers two interest structures. The official [promotional page worked example](https://www.cathaybk.com.tw/cathaybk/promo/event/loan/product/personalloan/index.html) spells it out:

> Loan amount: NT$300,000. Term: 5 years
> Tiered: first six periods fixed at 1.88%–9.88%, from period seven 5.43%–16%
> Flat: 4.73%–16%
> Total related fees: NT$9,000. (in Chinese)

"1.88% for the first six periods" is hard to resist. But look back at the spread table: the tiered plan's spread from period 7 is 3.69%, versus 2.99% flat. **You are trading six months of cheap interest for a permanently higher spread — 0.70 percentage points — across every remaining period.**

The longer you borrow, the worse that trade gets. I built an amortization model to compute it (on a tier change, the payment is recalculated from the remaining balance over the remaining periods, which is standard Taiwanese bank practice).

First, validate the model: feeding in the official worked example (NT$300,000 / 5 years / NT$9,000 fee), both the flat and tiered structures produce an APR of **5.99%** — exactly matching the bank's disclosed "from 5.99%". The model checks out, so let's go further.

**NT$300,000 / 5 years** (official example conditions):

| | First payment | Final payment | Total interest | + Fee | Total cost |
|---|---|---|---|---|---|
| Flat 4.73% | 5,624 | 5,624 | 37,460 | 9,000 | **46,460** |
| Tiered 1.88%→5.43% | 5,243 | 5,673 | 37,806 | 9,000 | **46,806** |

A difference of NT$346. Essentially equivalent — which is precisely why the bank can label both "APR from 5.99%".

**NT$1,000,000 / 7 years** (closer to a realistic borrowing size):

| | First payment | Final payment | Total interest | + Fee | Total cost | APR |
|---|---|---|---|---|---|---|
| Flat 4.73% | 14,007 | 14,007 | 176,621 | 9,000 | **185,621** | 5.00% |
| Tiered 1.88%→5.43% | 12,715 | 14,221 | 185,513 | 9,000 | **194,513** | 5.19% |

A difference of **NT$8,893**.

Extended across tenors and principals (positive = tiered costs more):

| Term | NT$300K | NT$500K | NT$1M | NT$2M |
|---|---|---|---|---|
| 1 year | −3,110 | −5,183 | −10,365 | −20,731 |
| 2 years | −2,631 | −4,386 | −8,772 | −17,543 |
| 3 years | −1,749 | −2,914 | −5,828 | −11,657 |
| 4 years | −737 | −1,229 | −2,458 | −4,917 |
| 5 years | +346 | +577 | +1,154 | +2,308 |
| 6 years | +1,484 | +2,473 | +4,947 | +9,893 |
| 7 years | +2,668 | +4,446 | **+8,893** | +17,786 |

The conclusion runs against intuition:

- **Under 4 years, the tiered plan really is cheaper** — the interest saved in the first six periods has not yet been overtaken by the higher spread.
- **Break-even sits between 4 and 5 years**, and it is independent of principal. It is purely a function of the rate structure; the principal only scales it proportionally.
- **Above 5 years the tiered plan loses**, and the longer the term the more it loses.

So "the tiered plan has lower monthly payments, therefore it's better" is a trap — but "the tiered plan is always a trap" is equally wrong. The right question is: **how many years am I borrowing for?** Under four years, take tiered. Five or more, take flat.

## The APR is the only number you can shop on

Taiwan's annual percentage rate folds fees into the rate, making it the only basis for comparison across banks and plans. The bank itself notes that "the annual percentage rate is not the loan interest rate".

Its effect is most visible on small, short loans. With the same NT$9,000 fee:

- NT$300,000 / 5 years at 4.73% → APR 5.99%. **Fees inflate the real cost by 1.26 percentage points.**
- NT$1,000,000 / 7 years at 4.73% → APR 5.00%. Only 0.27 points of inflation.

In other words, **the fee penalizes small borrowers more than four times as heavily as large ones**. If you only need NT$300,000, a plan at "5.5% with a NT$3,000 fee" is genuinely cheaper than "4.73% with a NT$9,000 fee". Comparing headline rates alone picks the wrong one.

This is also why the corporate employee loan deserves attention: its fee is NT$3,000, one third of Taixingfu's.

When comparing across banks, competitors' "0.01% first period" offers are a more aggressive version of the same technique. Per [CashFeel's 2026 comparison table](https://www.cashfeel.com.tw/article/%E4%BF%A1%E8%B2%B8%E5%88%A9%E7%8E%87-%E4%BF%A1%E7%94%A8%E8%B2%B8%E6%AC%BE%E5%88%A9%E7%8E%87-%E5%88%A9%E7%8E%87%E6%AF%94%E8%BC%83) (updated 2026/01/29, in Chinese), SinoPac's digital loan runs 0.01% for the first period then 2.51%–14.84%, APR 2.43%–15.66%; CTBC's general loan runs 0.01% then 2.99%–14.98%, APR 4.13%–15.80%. That 0.01% first period has a near-zero effect on total cost. What matters is the APR range — compared at **the same principal and the same term**.

## Lock-in: a 3% prepayment penalty eats your refinancing upside

Taixingfu's prepayment rules are stated plainly on the official product page: **both** the tiered and flat structures carry "a 3% penalty on principal repaid within 12 months".

3% is a lot. Borrow NT$1M, decide within a year to refinance to a cheaper bank, and you pay NT$30,000 up front — roughly a full year of the interest savings you were chasing. In practice, this clause means **you have no bargaining power in year one**.

Lock-in terms vary far more than headline rates, and get discussed far less:

| Plan | Prepayment penalty |
|---|---|
| Taixingfu (tiered) | 3% within 12 months |
| Taixingfu (flat) | 3% within 12 months |
| Corporate employee loan (tiered) | 2% within 1 year |
| **Corporate employee loan (flat)** | **None** |

The flat-rate corporate employee plan is the only one here with no lock-in at all. Cathay's promotional page also mentions "the bank offers programs with no repayment-period restriction, please consult a representative" — but discloses no rate for it, so the trade-off against the 3% penalty cannot be quantified.

## Credit limits: 22x is a ceiling, not what you will get

The upper bound on your limit is set by regulation. Per the [Financial Supervisory Commission ruling Jin-Guan-Yin (4) No. 09600523370, dated 7 January 2008](https://law.fsc.gov.tw/LawContent.aspx?id=FE052046), "a debtor's aggregate unsecured debt balance across all financial institutions (including credit cards, cash cards, and personal loans) divided by average monthly income should not exceed 22 times" — the rule known as DBR 22x.

Two things to note:

1. **This is the aggregate across all institutions**, not one bank. Your existing card revolving balance and other loan balances consume the same allowance.
2. **22x is a ceiling, not the norm.** Per [Money101's summary](https://www.money101.com.tw/blog/%E4%BF%A1%E8%B2%B8%E9%A1%8D%E5%BA%A6%E6%9C%89%E5%A4%9A%E5%B0%91-%E6%8F%AD%E9%9C%B2%E9%8A%80%E8%A1%8C%E4%B8%8D%E6%9C%83%E8%AA%AA%E7%9A%84%E9%97%9C%E9%8D%B5%E6%95%B8%E5%AD%97) (in Chinese), banks typically approve 15–18x monthly income. That is industry observation rather than official statistics, but the direction is consistent.

Taixingfu's disclosed ceiling is NT$5M over a maximum of 7 years, with eligibility requiring age 20+, age plus loan term ≤ 65, annual income ≥ NT$300,000, and a clean banking credit record. But "a NT$5M ceiling" and "what you can actually borrow" are different questions — the latter is set by DBR.

## On "actual approved rates", I am not going to give you a range

Plenty of articles will tell you "borrowers typically get 4%–7%". I saw a great deal of this while researching.

But those numbers have no population, no sampling method, and no time basis — and people who share approval results are self-selected, since borrowers who got good rates are likelier to post. Citing them as a statistic would be dishonest.

What can be said honestly is qualitative. The upper end of the disclosed range (16%–17.40%) is not decoration; it means the bank genuinely lends at that price to marginal applicants. The advertised 1.88% corresponds to the bottom of the range and requires top-tier credit plus a specific occupational status. **Most people land in the middle, and where the middle sits is not public — anyone claiming to know is guessing.**

One thing is certain, though: credit bureau inquiries are themselves a cost. Submitting to many banks in a short window depresses your score and raises the spread later applicants quote you. Getting indicative quotes through official calculators and free consultations before formally applying is cheaper than a scattergun approach.

## Overall

When evaluating a personal loan, move your attention off the headline rate and onto three things:

1. **What is the spread** (headline rate minus the current deposit rate index) — that is how the bank prices you.
2. **What is the APR**, compared at the same principal and term — fees punish small, short loans severely.
3. **How many months of lock-in, and what penalty** — this determines whether you retain any refinancing leverage.

As for tiered versus flat, the answer depends on the term: under four years take tiered, five or more take flat. That is not a matter of preference; it is computable.

Two closing caveats on things I could not verify. The rate figures circulating online for Cathay's "Flex Loan" (彈力貸) and "Green Loan" (綠色信貸) — 4.13% and 1.88% respectively — have no corresponding official public product disclosure that I could find; the sources are all lead-generation content sites. **Treat them as unverified.** All rates are subject to the terms the bank offers at signing. This article is informational and does not constitute lending or investment advice.

## References

- [Taixingfu Personal Loan — Cathay United Bank official product page](https://www.cathaybk.com.tw/CATHAYBK/Personal/Loan/Product/Personal-Loan) (in Chinese)
- [Taixingfu promotional page — Cathay United Bank, with APR worked example and disclosures](https://www.cathaybk.com.tw/cathaybk/promo/event/loan/product/personalloan/index.html) (in Chinese)
- [Corporate Employee Loan Program — Cathay United Bank official product page](https://www.cathaybk.com.tw/cathaybk/personal/loan/product/employee-loan) (in Chinese)
- [Preferred-occupation program (code F16) — Cathay United Bank official page](https://www.cathaybk.com.tw/cathaybk/promo/event/loan/product/AJOB_PJ/index.html) (in Chinese)
- [Tax-season campaign page — Cathay United Bank, with Dashu Express Loan APR disclosure](https://www.cathaybk.com.tw/cathaybk/personal/campaigns/loan/taxsup-loan) (in Chinese)
- [NTD deposit and lending rate board — Cathay United Bank](https://accessibility.cathaybk.com.tw/rate-search.aspx) (in Chinese)
- [NTD and foreign currency rates — Cathay United Bank, with deposit rate index definition](https://www.cathaybk.com.tw/cathaybk/personal/product/deposit/rate/) (in Chinese)
- [DBR 22x rule — FSC ruling Jin-Guan-Yin (4) No. 09600523370](https://law.fsc.gov.tw/LawContent.aspx?id=FE052046) (in Chinese)
- [2026 personal loan rate comparison across banks — CashFeel](https://www.cashfeel.com.tw/article/%E4%BF%A1%E8%B2%B8%E5%88%A9%E7%8E%87-%E4%BF%A1%E7%94%A8%E8%B2%B8%E6%AC%BE%E5%88%A9%E7%8E%87-%E5%88%A9%E7%8E%87%E6%AF%94%E8%BC%83) (in Chinese)
- [Personal loan limits and DBR explained — Money101](https://www.money101.com.tw/blog/%E4%BF%A1%E8%B2%B8%E9%A1%8D%E5%BA%A6%E6%9C%89%E5%A4%9A%E5%B0%91-%E6%8F%AD%E9%9C%B2%E9%8A%80%E8%A1%8C%E4%B8%8D%E6%9C%83%E8%AA%AA%E7%9A%84%E9%97%9C%E9%8D%B5%E6%95%B8%E5%AD%97) (in Chinese)
- [2026 personal loan comparison — Mr.Market](https://rich01.com/what-is-credit-loans) (in Chinese)
