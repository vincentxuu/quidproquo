---
title: "Power Plants, Waterworks, Fabs: Critical Infrastructure Does Not Have a Single Row in the Civil Aviation Act's Authority Table"
date: 2026-08-09
type: deep-dive
category: policy
tags: [drone, taiwan, counter-uas, critical-infrastructure, law, security]
lang: en
tldr: "Paragraphs 3 and 4 of Article 99-13 of the Civil Aviation Act use a three-part formula — 'government agencies, schools or legal persons'. But the proviso in paragraph 7, the single sentence letting a site operator 'take appropriate measures to stop or remove' a drone, says only 'government agencies'. Taipower, Taiwan Water, CPC, the telcos and the fabs are all legal persons, not government agencies. What is left to them is the proviso in paragraph 2: the central competent authority asks the municipal government to announce a restricted zone, and the municipal government then 'enforces against' violators. The penalty drops a tier too: an incursion into prohibited airspace or an airport zone carries a minimum of NT$300,000 under Article 118-1, while Taipei City's announcement effective 26 June 2024 states that violating its announced zones carries 'up to NT$300,000'. The equipment layer is more convoluted still: the drone jammers the NCC opened to import in February 2025 require proof that the applicant is a 'critical infrastructure provider' — and under Articles 3 and 20 of the Cyber Security Management Act, the Executive Yuan announces the sectors while providers are designated by their sector regulator, approved by the Executive Yuan, and then 'notified in writing'. You find out whether you are one by receiving a letter."
description: "Taking Taiwan's critical-infrastructure drone defence chain apart link by link: how Article 99-13's wording leaves state-owned and private operators outside the 'stop or remove' power, why the alternative route runs through a municipal announcement, why the penalty drops a tier, and why the NCC's jammer import door is keyed to a list that is never published."
draft: false
---

> 🌏 [中文版](/posts/policy/2026-08-09-critical-infrastructure-drone-defence)

[The airport post](/posts/policy/2026-08-09-airport-drone-incursions-taiwan-en) concluded that airports are the weakest row in [the six-setting authority table](/posts/policy/2026-08-09-who-may-down-a-drone-en), holding only "enforce against."

This post adds a harsher line: **that is the weakest row among the rows that have names. Power plants, waterworks, fabs and telecom exchanges do not have a row at all.**

## The same article uses a three-part formula, and the proviso keeps one part

Paragraphs 3 and 4 of [Article 99-13 of the Civil Aviation Act](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=K0090001&flno=99-13) set out who may apply to operate inside restricted or announced areas:

> Where **a government agency, school or legal person** needs to conduct drone flight activity within the areas under paragraph 1 in performing its business, it shall apply to the CAA, which shall consult the sector regulator, before doing so. (para 3)
>
> Where **a government agency, school or legal person** needs to conduct drone flight activity outside the areas, times and other management matters announced under paragraph 2 in performing its business, it shall apply to the municipal or county government, which shall consult the relevant central authority, before doing so. (para 4)

Paragraph 7 of the same article sets out who may deal with a drone that comes in:

> A drone operating without permission outside the areas, times and other management matters announced under paragraph 2 shall be enforced against by the municipal or county government; where necessary, police assistance may be requested. However, where a drone enters the premises of **a government agency** without permission, **the government agency** may take appropriate measures to stop or remove it.

**The drafter named three kinds of subject in paragraphs 3 and 4, and kept one in the paragraph 7 proviso.**

Interpretively that is a strong signal: within a single article, the drafter demonstrated knowing how to include "legal persons", and then did not include them in the sentence that authorises removal. Taiwan Power Company, Taiwan Water Corporation and CPC Corporation are companies — legal persons. Telecom operators, semiconductor fabs and data centres are unambiguously private legal persons. **On the text of this article, none of them is a subject of the proviso.**

To be clear about how confident this is: it is an interpretation from comparing the article's own wording, not a court holding. I did not find a CAA interpretive ruling treating state-owned enterprises as "government agencies", but nor did I search every interpretive ruling — this is the most fragile link in the post, and it is restated at the end.

## What is left: ask the local government to publish an announcement

If legal persons are outside the proviso, how does a power station get no-fly protection at all? The answer is the proviso in paragraph 2 of the same article:

> Areas outside the preceding range and not exceeding 400 feet above ground shall be announced by the municipal or county government, according to the needs of public interest and safety, as to drone activity areas, times and other management matters. However, where **the relevant central competent authority** considers it necessary to prohibit or restrict drone flight activity, it may **request the municipal or county government of the location to make such an announcement**, and the municipal or county government shall comply.

So the statutory protective move for a power plant looks like this:

```
power plant  →  Ministry of Economic Affairs (sector regulator)
             →  requests the local government to announce a restricted zone
             →  local government announces (and shall comply with the request)
             →  someone violates it  →  local government "enforces against"
             →  where necessary, requests police assistance
```

**The first step in protecting a piece of critical infrastructure is asking a local government to publish a notice.** That is not a bad route — it turns "where you may not fly" into public, searchable data that gets uploaded to the CAA's drone management information system. But it is an ex-ante administrative route, and "there is one overhead right now" is a different timescale entirely.

## The penalty drops a tier: a NT$300,000 floor versus a NT$300,000 ceiling

Following that route also changes which penalty provision applies.

Entering prohibited airspace, restricted airspace or the announced airport zone falls under [Article 118-1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=K0090001&flno=118-1): a fine of **NT$300,000 to NT$1.5 million**, revocation of the operator certificate, and possible confiscation.

Entering a zone announced by a municipal government falls under [Article 118-2](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=K0090001&flno=118-2). [Taipei City's announcement effective 26 June 2024](https://dot.gov.taipei/News_Content.aspx?n=6DC49D53C63D3B11&sms=85A480C00645651D&s=EA4CAC5608D08D61) states it plainly:

> Where the owner or operator of a drone violates the matters in this announcement, the City Government shall, under Article 118-2 of the Civil Aviation Act, prohibit the activity and impose a fine of **up to NT$300,000**; in serious cases the drone may also be confiscated.

**One side's floor is NT$300,000; the other side's ceiling is NT$300,000.** Same drone, same operator: flying just outside an airport fence starts at NT$300,000, flying over a substation tops out at NT$300,000.

(I did not read every subparagraph of Article 118-2; the ceiling figure comes from Taipei City's announcement text, while the Article 118-1 range comes from the provision itself.)

## The enforcement chain is spelled out clearly — and clarity makes the shape obvious

Point 4 of that Taipei announcement is the most complete local division of labour I found, and is worth reading closely:

> 4. To give effect to drone management, **each site's managing authority** shall act under Article 99-13(7) of the Civil Aviation Act (a drone entering the premises of a government agency without permission may be stopped or removed by the government agency through appropriate measures). The City Government's division of drone management and enforcement is as follows:
>
> (1) On receiving a report of a violation, the Department of Transportation shall immediately query the Drone Management Information System for the drone's registration and flight-activity applications.
>
> (2) If the reported location falls under a site managing authority's jurisdiction, **that authority shall attend the scene to advise, stop or remove**, and shall investigate the facts and evidence under the Administrative Procedure Act and the Administrative Penalty Act, then hand the evidence to the Department of Transportation for penalty proceedings … where necessary, the City Police may be asked to attend and assist with enforcement.

Point (3) then enumerates four "where necessary" situations:

1. Events in the city with 5,000 or more attendees.
2. Security-detail duties.
3. Endangerment of public safety, criminal cases, or other suspected offences (such as using a drone to drop explosives or spray unidentified liquids or powders).
4. Where the responsible agency, carrying out enforcement or inspection duties, meets a danger that cannot be removed without police assistance, or that disturbs public order.

Two things stand out.

**First, this is an investigation-and-penalty flow, not an interception flow.** Attend, advise, investigate facts and evidence, hand the evidence over for a fine — every step is an Administrative Procedure Act / Administrative Penalty Act action. The problem it solves well is *how to lawfully fine the right person*.

**Second, the announcement assigns "stop or remove" to "each site's managing authority", while the provision's subject is "a government agency".** If a given site's managing authority is a company, an announcement cannot change that — **an administrative announcement cannot create for a legal person an authority the parent statute never granted**. That is not a criticism of Taipei City; an announcement can only cite its parent statute. The defect is that the parent statute's proviso named one kind of subject.

Incidentally, subparagraph 3's example is worth remembering: "using a drone to drop explosives or spray unidentified liquids or powders." **The threshold for calling the police is written as after the drop.**

## The key to the NCC's door sits on a list that is never published

[The "who may bring it down" post](/posts/policy/2026-08-09-who-may-down-a-drone-en) took apart the equipment layer: the NCC's Regulations Governing the Manufacture, Import and Reporting of Controlled Telecommunications RF Equipment, reissued 3 February 2025, classify drone-restricting jammers as Class 1 controlled RF equipment and open a stated import purpose in Article 8(3)(9) — "for maintaining national security, public order, the public interest, or **protecting national critical infrastructure**" — with Article 8(5) requiring documentation proving the applicant is such an agency or a critical infrastructure provider.

So who is a critical infrastructure provider? [Article 3 of the Cyber Security Management Act](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030297&flno=3):

> 7. **Critical infrastructure**: physical or virtual assets, systems or networks … within the **sectors periodically reviewed and announced** by the Executive Yuan.
>
> 8. **Critical infrastructure provider**: one that operates or provides all or part of critical infrastructure, **designated by the central sector regulator** and **approved by the Executive Yuan**.

[Article 20](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030297&flno=20) sets out the procedure:

> The central sector regulator shall, after consulting relevant public agencies, civil groups and experts, designate critical infrastructure providers, submit them through the competent authority for Executive Yuan approval, and **notify the approved parties in writing**.

**What is announced is the sector; what is notified is the approved party.** The sectors are public, the list is not — you learn whether you are a critical infrastructure provider by receiving an official letter, not by consulting a table.

And even the sector list has two official versions. The [Ministry of Digital Affairs' critical-infrastructure security page](https://moda.gov.tw/ACS/operations/ciip/650), citing the Executive Yuan's *National Critical Infrastructure Security Protection Guidelines*, lists: energy, water resources, communications and broadcasting, transport, finance, emergency services and hospitals, government agencies, **science parks and industrial parks**, and **food**. An [Executive Yuan clarification](https://www.ey.gov.tw/Page/9277F759E41CCD91/ee9e6d8f-b3ff-4f82-99fd-f6953fc383d5) instead gives eight sectors: energy, water resources, communications and broadcasting, transport, banking and finance, emergency services and hospitals, central and local government agencies, and **high-tech parks** — with no food sector.

Both are official documents and their enumerations differ. This does not change the conclusion here — eight or nine, the *provider* level is unpublished either way — but it does illustrate something: **working out whether you are inside this system already yields two answers at the first step.**

## Four things, side by side

For a state-owned or private critical infrastructure operator to lawfully bring down an intruding drone, four things are needed:

| What is needed | Where it stands |
|---|---|
| A legal "no flying here" boundary | Requires the sector regulator to **ask the local government to announce it** — not the operator's own decision |
| An authority to "stop or remove" | The Article 99-13(7) proviso names only "government agencies"; legal persons are outside it |
| A jammer | Importable since 2025-02-03 under the NCC rules, on proof of being on a list that is not published |
| A rule permitting emission | Article 67(1) of the Telecommunications Management Act forbids interference with lawful communications or affecting flight safety, **with no public-duty exception** |

Of the four, the number the operator can obtain by itself is zero. The first needs a central agency to make the request on its behalf; the second the statute does not grant; the third requires an invisible list; the fourth does not exist.

**Compare an airport**: an airport at least has a paragraph in the Civil Aviation Act with its name in it (Article 99-13(6)), a statutory co-enforcer in the Aviation Police Bureau, and a NT$300,000–1.5m penalty. [The airport post](/posts/policy/2026-08-09-airport-drone-incursions-taiwan-en) called airports the weakest cell — **true, with a qualifier: the weakest among the cells that have names.**

## Three conclusions

1. **Establish which kind of subject you are before discussing what to buy.** The three counter-drone posts in this series compress into one ordering: are you a government agency? If not, you have no removal authority in the Civil Aviation Act, only the route of asking a local government to announce a zone. That determines more than any spec sheet.
2. **"Protecting critical infrastructure" is a different door in each statute.** The NCC uses it to open an import door; the Cyber Security Management Act uses it to impose security duties and reporting obligations; and the Civil Aviation Act does not use the concept at all — it recognises "government agency / school / legal person" and "municipally announced areas". **The same phrase not being portable across three statutes is part of why this subject stays muddled.**
3. **The announcement mechanism deserves to be used seriously, because it is the only cell that currently moves.** Municipal announcements are uploaded to the CAA's drone management information system and become a source for consumer-drone geofencing — meaning they stop law-abiding operators in advance. They will not stop a deliberate intruder, but of the four things above, this is the only one that can be completed today.

## What this post does not answer, and whether those gaps could refute it

- **I did not check for a CAA or MOTC interpretive ruling folding state-owned enterprises into "government agencies."** **Could this refute the post? Yes — it would refute the first section directly.** If such a ruling exists, Taipower, Taiwan Water and CPC fall back inside the proviso, and this post would need rewriting as "patched by interpretive ruling; private operators still outside." I found nothing at the statutory level in the Laws & Regulations Database, but interpretive rulings do not live there and I did not search that database systematically. **This is the gap most in need of filling, and the sentence in this post I am least sure of.**
- **I did not pull each municipality's announced restricted-zone lists to see which critical infrastructure they actually name.** Taipei's annex is an ODS coordinate file; other municipalities each have their own. **Could this refute the post?** Not the authority structure, but it would substantially change the weight of the third conclusion: if announcements already cover the major power stations, water treatment plants and science parks, then "the only cell that moves" has already moved a great deal; if they do not, that is a concrete, nameable gap. **This is fillable, and it is the obvious next step.**
- **I did not investigate any actual drone incident at a piece of critical infrastructure.** [The airport post](/posts/policy/2026-08-09-airport-drone-incursions-taiwan-en) has six itemised records only because a Legislative Yuan budget review made the CAA produce them; power plants and waterworks have no equivalent public series that I could find.
- **I did not read Article 118-2 subparagraph by subparagraph.** The NT$300,000 ceiling is taken from Taipei City's restatement, not from my own reading of the tiers.

## References

**Primary: statutory text**

- [Civil Aviation Act, Article 99-13](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=K0090001&flno=99-13) (para 2 proviso, the central authority requests a municipal announcement; paras 3 and 4, "government agency, school or legal person"; para 7 proviso, "government agency" only)
- [Civil Aviation Act, Article 118-1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=K0090001&flno=118-1) (NT$300,000–1.5m) and [Article 118-2](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=K0090001&flno=118-2)
- [Cyber Security Management Act, Article 3](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030297&flno=3) (subpara 7, critical infrastructure as "announced sectors"; subpara 8, providers designated by the sector regulator and approved by the Executive Yuan)
- [Cyber Security Management Act, Article 20](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030297&flno=20) (designation procedure; approved parties notified in writing)
- [Telecommunications Management Act, Article 67](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=K0060111&flno=67) (use shall not interfere with lawful communications or affect flight safety)
- [Regulations Governing Manufacture, Import and Reporting of Controlled Telecom RF Equipment, Article 8](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=K0060146&flno=8) (para 3 subpara 9 "protecting national critical infrastructure"; para 5 required documentation)

**Primary: agency announcements and portals**

- [Taipei City Government — amended areas, times and other management matters for drone flight activity, effective 2024-06-26](https://dot.gov.taipei/News_Content.aspx?n=6DC49D53C63D3B11&sms=85A480C00645651D&s=EA4CAC5608D08D61) (point 3 penalties; point 4 division of management and enforcement; the four "where necessary" police-assistance situations)
- [Ministry of Digital Affairs — Critical Infrastructure Information Protection](https://moda.gov.tw/ACS/operations/ciip/650) (sector enumeration under the Executive Yuan guidelines, including science/industrial parks and food; how providers are designated)
- [Executive Yuan — clarification that the Cyber Security Management Act regulates "high-tech park critical infrastructure providers"](https://www.ey.gov.tw/Page/9277F759E41CCD91/ee9e6d8f-b3ff-4f82-99fd-f6953fc383d5) (the Cyber Security Department's eight-sector enumeration)

**On this site**

- [Who May Bring a Drone Down? Taiwan's Law Authorises the Outcome and No Means of Achieving It](/posts/policy/2026-08-09-who-may-down-a-drone-en)
- [Taiwan's Airports Have Been Closed by Drones Six Times, for 300 Minutes Total](/posts/policy/2026-08-09-airport-drone-incursions-taiwan-en)
- [Why Countering Drones Is Hard: Jamming Is Failing, and Taiwan's Problem Is Not Only Technical](/posts/tech/2026-08-07-counter-drone-why-hard-en)
- [Taking Apart Taiwan's Drone Cybersecurity Testing Specification](/posts/policy/2026-08-08-drone-cybersecurity-testing-spec-en)
- [Taiwan's Drone Industry Map](/posts/tech/2026-08-06-drone-industry-map-en)
