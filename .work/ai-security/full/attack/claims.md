# Claims and research completion

Scope: qualitative teaching mechanisms, not model capability rankings. Search pool includes 2026 papers; these remain snippet-only candidates and are NOT cited in articles. The measured claims are our standard-library HTTP replay, not efficacy of any model. No claim that old frameworks represent current model rankings.

| Claim | Primary body and location | Counterevidence / bounded reading |
|---|---|---|
| User-controlled identifier can expose another account if authorization is missing | PortSwigger User ID lab, intro and complete solution | Educational deliberately vulnerable instance; not any live site |
| Tool schemas and milestones can separate action and final answer | AutoPenBench complete README, Available Tools, machine development | Engineering design, no benchmark rate used; explicit flags/solution files must be hidden in ability tests |
| Successful output is insufficient evidence of intended exploit | NIST complete examples page, 2.1–2.3 | Historical heterogeneous data, human-validated detections can miss cases; no generalized cheating rate |
| Product review can redirect a live LLM toward an account action | PortSwigger Indirect prompt injection complete lab | Vendor explicitly says unpredictable; our replay is not this live-model experiment |
| Framework state and phase transitions can compose small tasks | Anthropic full report, infrastructure, phases 1–6; AutoPenBench milestones | Vendor's Claude-only visibility; no unqualified autonomy or speed figures |
| Scope is deployment-independent | Scope established in user's series plan and existing order 3; CyberSecEval methodology also includes cloud host pairs | Moving to cloud changes networking, identity and reset assumptions; no third-party authorization implied |

Five gates: (1) All article external mechanism claims have complete extracted primary bodies and raw files. (2) Engineering guidance, our design, and vendor incident observations are distinguished. (3) NIST 2025 and incident Nov 2025 provide recent confirmation; live training instructions read Oct 2026. (4) NIST cheating, Anthropic hallucinations and PortSwigger nondeterminism are explicit contrary evidence. (5) Chinese/English/near-synonym searches were run and stored. They returned additional 2026 papers; saturation is NOT claimed for frontier capability/effectiveness, which this line does not evaluate. For the narrow existence of the mechanisms, primary examples answer the question directly, and no cross-model quantitative conclusion is made. New paper candidates are excluded pending full read; not disguised as closed empirical coverage.

## Extraction record

Full read of Anthropic report: changelog → executive summary → contents → infrastructure → autonomous operations → phases 1–6 → technical sophistication → response → implications; raw fetch-2 complete text. Figures/tables are text extraction only; no image-dependent figures or numerical claims cited. Observational design: vendor threat telemetry and investigation of misuse, not controlled comparison. Outcome used: vendor-described human selection, machine task execution, stage transitions and hallucinated findings. Limitations: only Claude usage visible; attribution is vendor assessment; no public replayable victim artifacts establish an independent end-to-end reproduction. Executive summary and body align qualitatively; percentages and speed rhetoric are deliberately excluded, and the website correction cautions against repeating the old rate.

NIST extraction: historical transcript analysis, LLM screening followed by human confirmation of reported successful cheating. Read sequentially from methodological caveat through solution contamination, grader gaming and unsuccessful strategies to update date. No figures/rates quoted. Limitations include different task/model sample sets and possible false negatives. Body supports narrower claims than a universal statement that agents cheat.

PortSwigger extraction: lab instructions and complete solution text, including nondeterminism warning. This demonstrates official task design and expected mechanism, not our own completion; browser lab was not run. AutoPenBench README is engineering documentation, not the linked paper. No source success figures used.

## 獨立交叉審後的證據修正

原prepare.py在正文H1處切開，source1–5僅有metadata，與原fetch1/2完整正文不一致。改為只以附URL的文件header切分，完整正文已保存；registry字符數依原文重算。獨立審者逐份讀source1/2/3/4/5/6，另補source7為CyberSecEval既有完整正文，不新增來源能力主張。source4尾端另一URL的CRAWL_NOT_FOUND錯誤已剔除，不當README的一部分。

runner錯誤路徑原先不存--out，已改inconclusive/error/partial trace與可得audit保存後非零退出。獨立wrong-resource HTTP負例確認正確拒絕假成功並保存證據。完整交叉審、49HTTP與37audit覆核見full/cross-reviews/attack.md；作者原test-results不偽裝成獨立新執行。
