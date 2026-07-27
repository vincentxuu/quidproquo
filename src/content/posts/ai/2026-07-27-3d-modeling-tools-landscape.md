---
title: "2026 做 3D 模型的工具地圖：AI 生成、掃描、CAD、手工建模怎麼選"
date: 2026-07-27
category: ai
type: deep-dive
tags:
  - 3d-generation
  - meshy
  - tripo
  - hunyuan3d
  - 3d-printing
  - photogrammetry
  - ai-tools
lang: zh-TW
tldr: "做 3D 模型在 2026 年有四條路：AI 生成（Meshy-6 / Tripo / Rodin Gen-2.5 / 混元 3D）、手機掃描、Text-to-CAD、手工建模。選錯的代價很具體——AI 生成的 mesh 改不動尺寸、Rodin 的 STL 常需修補、Meshy 免費版的資產是公開的。這篇按「模型最後要拿去幹嘛」給選型建議，並附各家官網當前價格。"
description: "2026 年 3D 模型製作工具的完整選型指南：比較 Meshy、Tripo、Rodin、騰訊混元 3D 四大 AI 生成平台的價格與拓撲品質，開源自架選項（TRELLIS.2 / Hunyuan3D），手機掃描 App，Text-to-CAD，以及 Blender 等手工建模工具。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-07-27-3d-modeling-tools-landscape-en)

「我想做一個 3D 模型」在 2026 年已經不是一個問題，而是四個問題。輸入是文字、照片、實體物件，還是尺寸規格？輸出要進遊戲引擎、3D 印表機、電商網頁，還是 CNC？這兩個維度組合出四條完全不同的工具鏈，選錯的代價不是「效果差一點」，而是做到一半發現東西根本改不動。

這篇是工具選型地圖。如果想看技術原理——video diffusion 怎麼 lift 成 3D、3DGS 為什麼可能只是過渡技術——站上另一篇[從 Lyra 2.0 拆解 2026 年 3D 生成技術地圖](/posts/ai/2026-07-22-3d-generative-models-landscape)講的是論文層面，這篇講的是「今天下午就能開始用什麼」。

## 先分清楚四條路

```
你手上有什麼？
├── 只有想法 / 一張參考圖 ──────→ AI 生成（Meshy / Tripo / Rodin / 混元 3D）
├── 實體物件就在眼前 ──────────→ 手機掃描（KIRI / RealityScan / Scaniverse）
├── 明確尺寸與公差 ────────────→ CAD（AdamCAD / Fusion 360 / Onshape）
└── 想完全控制每個頂點 ────────→ 手工建模（Blender / Plasticity / Nomad）
                                        ↑
                            前三條路的產出，最後幾乎都會回到這裡收尾
```

最後那句是關鍵：**AI 生成和掃描都不是終點站**。它們把「從零到八成」的時間從幾天壓到幾分鐘，但剩下兩成——修破面、調拓撲、對尺寸——目前還是得手動。把 AI 工具當成草模產生器而不是成品產生器，期待值會正常很多。

## AI 生成：四大商用平台

這是入門門檻最低的一條路，文字或圖片進去，幾十秒到幾分鐘吐出一個帶 PBR 貼圖的 mesh。四家各有明顯偏向：

| 平台 | 當前版本 | 最強的地方 | 免費額度 | 付費起點 |
|---|---|---|---|---|
| [Meshy](https://www.meshy.ai/) | Meshy-6 | 介面成熟、功能最全、新手最不會卡住 | 200 credits/月 | Pro $20/月・1,000 credits |
| [Tripo AI](https://www.tripo3d.ai/) | Tripo 3.0 | 四邊面拓撲最乾淨、自動綁骨 | 200 credits/月 | Pro $13.93/月・3,000 credits |
| [Rodin（Hyper3D）](https://hyper3d.ai/) | Gen-2.5 | 貼圖與 PBR 寫實度最高 | 有 Free 方案 | Creator $24/月・60 credits |
| [騰訊混元 3D](https://3d.hunyuan.tencent.com/) | 網頁版 3.x | 一站到動畫，且核心模型開源 | 有免費額度 | 依官網方案 |

（價格為 2026 年 7 月各家官方定價頁的快照，且多數平台年繳與月繳價差很大，下單前請以官網為準。）

### Meshy：最不會卡住的那個

[Meshy](https://www.meshy.ai/) 的價值不在單項最強，而在「每一項都夠好，而且你不會被卡住」。依 [Toolworthy 的 v6 評測](https://www.toolworthy.ai/tool/meshy-ai-v6)，Meshy-6 在 2026-01-18 發布，另有一個 sculpting 等級的 Meshy-6 Preview，單次生成 20 credits 而非 10。

Meshy [官方 Help Center](https://help.meshy.ai/en/articles/10000507-how-many-credits-does-each-generation-task-cost) 說明，一次完整的 Text to 3D 或 Image to 3D（Model Stage + Texture Stage）在 Meshy-6 上約消耗 20 credits——也就是免費版每月 200 credits 大約可以完整生成 10 個模型。

真正要注意的是授權：依 [Meshy 官方定價頁](https://www.meshy.ai/pricing)，**私有資產（private assets）與 API 存取從 Pro（$20/月、1,000 credits、10 個併發任務）才開始**，免費方案是 1 個併發、資產公開。要拿去商用的話，免費版不是「省錢版」而是「不能用版」。往上還有 Premium $40/3,000 credits、Studio $70/5,500 credits、Ultra $100/8,000 credits。

### Tripo：拓撲最乾淨，最省後製

如果產出要進 Unity 或 Unreal，[Tripo AI](https://www.tripo3d.ai/) 是預設選項。它的差異化很明確：**四邊面（quad）拓撲 + 自動 retopology + 自動綁骨**。依 [Tripo 自己的比較文件](https://www.tripo3d.ai/tutorials/tripo-ai-vs-other-ai-3d-generators)，平台涵蓋建模、貼圖、retopology、綁骨到動畫的完整管線，還有 AI 分件功能可以把模型拆成可獨立編輯的部件。

三角面 soup 和乾淨 quad 的差別，在你要對模型做形變、加骨架、或是丟進 subdivision 的那一刻才會顯現。這也是為什麼 Tripo 在遊戲資產族群裡口碑特別好——省下的是後面幾小時的 retopo 工。

價格上 Tripo 相對激進：[官方定價頁](https://www.tripo3d.ai/pricing)目前列 Free 200 credits/月、Pro 約 $13.93/月 3,000 credits（含商用授權）、Max 約 $53.94/月 25,000 credits、Team 約 $54.93/月 45,000 credits。同樣是 3,000 credits，Tripo 的價格大約是 Meshy Premium 的三分之一。

### Rodin：貼圖寫實度的天花板

[Hyper3D 的 Rodin](https://hyper3d.ai/) 走的是另一條路——不追求管線完整，追求單一資產的視覺品質。當前世代是 Gen-2.5，提供 creative geometry 模式、HD 貼圖增強、貼圖去光（delighting）、強制對稱、微細節控制這些偏美術向的旋鈕。

依 [Hyper3D 官方定價頁](https://hyper3d.ai/pricing)，Creator 方案 $24/月含 60 credits，而 **API 存取、4K 貼圖、high-poly quad 這三項要到 Business（$96/月、416 credits）才解鎖**。它也支援「先預覽結果再決定要不要扣點」的 pay-by-result 模式，這在高單價生成上是有意義的設計。

但要注意適用邊界：Rodin 的 mesh 最佳化目標是**渲染**不是**列印**，第三方評測普遍指出它的 STL 匯出經常需要大量修補。要拿去 3D 列印的話，這是最不適合的一家。

### 騰訊混元 3D：唯一「商用平台 + 開源權重」雙軌的

[騰訊混元 3D](https://3d.hunyuan.tencent.com/) 的特別之處是它兩邊都給：網頁版是完整的一站式平台（3D 動畫生成含骨骼綁定與動作選擇、智能減面、紋理生成、草圖生 3D，輸出支援 OBJ / GLB / FBX / STL / USDZ），同時核心模型權重在 GitHub 上完全開源。

依 [Hunyuan3D-2 的 GitHub repo](https://github.com/Tencent-Hunyuan/Hunyuan3D-2)，2025-06-13 開源了 Hunyuan3D-2.1，附帶「new PBR model, VAE encoder, and all training code」——連訓練程式碼都放出來，這在 3D 生成領域相當罕見。2.5 版技術報告見 [arXiv 2506.16504](https://arxiv.org/abs/2506.16504)。第三方報導指出網頁版的 3.1 於 2026-01-29 上線，支援最多 8 視角輸入以提升重建精度。

硬體門檻比想像中低。repo 的原話是：

> It takes 6 GB VRAM for shape generation and 16 GB for shape and texture generation in total.

也就是說只做形狀生成，6 GB 顯卡就夠；要連貼圖一起才需要 16 GB。2mini 版本更進一步剪枝到 0.6B 參數（完整版 DiT-v2-1 是 3.0B），RTX 4060 等級的消費卡就能跑。

## 開源自架：量大或有授權顧慮時的解

2025 到 2026 年最大的結構性變化，是開源 3D 模型真的追上了商用平台。如果你的用量大到 credit 制不划算，或是有商用授權的合規顧慮，這條路現在是認真的選項：

- **[TRELLIS](https://github.com/microsoft/TRELLIS)（Microsoft）** — 依 [3D AI Studio 的 2026 年度報告](https://www.3daistudio.com/state-of-ai-3d-generation-2026)，TRELLIS.2 以 MIT 授權釋出，4B 參數、20 秒內產出 1536 解析度資產。**授權最乾淨**是它最大的賣點，商用完全無包袱。
- **[Hunyuan3D](https://github.com/Tencent-Hunyuan/Hunyuan3D-2)（Tencent）** — 貼圖與 PBR 品質最好的開源選項，前面已述。
- **[TripoSG](https://github.com/VAST-AI-Research/TripoSG)** — 用大規模 rectified flow 做高保真形狀合成。
- **[PartCrafter](https://github.com/wgsxm/PartCrafter)** — NeurIPS 2025，生成**結構化、可拆件**的 mesh。要做可動組件或需要分件編輯時，這個特性其他模型給不了。
- **[InstantMesh](https://github.com/TencentARC/InstantMesh)** — 多視角擴散 + 前饋重建的經典實作，適合當作理解這條技術路線的入門。

主流架構已經收斂成「多視角擴散 → 前饋重建」：先生成幾張一致的 2D 視角，再用前饋網路重建成 mesh。這也是 2026 年拓撲品質最好的路線。

## 掃描：東西在手上就別用生成的

如果要複製的物件實體就在眼前，掃描的精度遠勝任何 AI 生成——生成模型是在「合理猜測」被遮擋的部分，掃描是在測量。

| App | 技術路線 | 適合場景 |
|---|---|---|
| [KIRI Engine](https://www.kiriengine.app/) | 攝影測量 + 可轉 mesh 的 3DGS | Android 首選；能把 Gaussian Splatting 轉成真 mesh 進 Blender / UE |
| [RealityScan](https://www.realityscan.com/)（Epic） | 純攝影測量 | 要進 Unreal 的直接選這個，同一個生態系 |
| [Scaniverse](https://scaniverse.com/)（Niantic） | 端上 3DGS，免費 | 不想把掃描資料上雲的隱私考量 |
| [Polycam](https://poly.cam/) | 攝影測量 + LiDAR + 3DGS | 功能最全面，但費用結構 2026 年變動過 |

兩點值得注意。第一，Gaussian Splatting 拍起來漂亮但**沒有表面**——它是一團半透明橢球，不能直接丟進遊戲引擎或做物理模擬，所以 KIRI 那種「3DGS 轉 mesh」的能力比看起來重要。第二，依 [SwiftWand 的 2026 年比較](https://swiftwand.com/en/smartphone-3d-scanning-app-comparison-2026-en/)，Polycam 在 2026 年砍掉了 Pro 方案，目前是 Free / Basic $30 月 / Business 每人每年 $400 的結構，訂閱前先確認。

## Text-to-CAD：AI 生成的 mesh 改不動，這裡可以

這是最容易選錯的一條路。AI 生成給你的是**一坨 mesh**——頂點、邊、面，沒有「這個孔徑是 8mm」這種語意，想把孔改成 10mm 只能重新生成或手動雕。CAD 給你的是**參數化實體**，改個數字，模型跟著重算。

依 [Leo AI 的 Text-to-CAD 實測比較](https://www.getleo.ai/blog/text-to-cad-tools-comparison-guide)，這個領域目前的分野很清楚：

- **[AdamCAD](https://www.adamcad.com/)** — 文字生**參數化 3D 模型**，帶可拉的尺寸滑桿，不用重做就能調尺寸，最後可匯出 STL。要「之後還會改」就選它。
- **[Zoo（Text-to-CAD）](https://zoo.dev/text-to-cad)** — 直接生 mesh，輸出 STL / OBJ，適合概念探索與快速原型，但不是參數化。
- **Spectral Labs SGS-1**、**Leo AI** — 更偏工程端的 CAD copilot。

如果是穩定成熟的選擇，[Fusion 360](https://www.autodesk.com/products/fusion-360/)、[Onshape](https://www.onshape.com/)、[FreeCAD](https://www.freecad.org/) 仍然是機構件的正解。判斷準則很簡單：**這個模型將來會不會需要改尺寸或標公差？會的話走 CAD，不管 AI 生成看起來多快。**

## 手工建模：所有路線的收尾站

| 工具 | 定位 | 費用 |
|---|---|---|
| [Blender](https://www.blender.org/) | 全能免費，AI / 掃描產出的收尾標準站 | 免費 |
| [Nomad Sculpt](https://nomadsculpt.com/) | iPad 有機雕塑，行動端體驗最好 | 一次性買斷 |
| [ZBrush](https://www.maxon.net/zbrush) | 專業雕塑天花板 | 訂閱 |
| [Plasticity](https://www.plasticity.xyz/) | NURBS / 實體，硬表面布林與倒角極乾淨 | 約 $175 買斷 |
| [Womp](https://womp.com/) | 瀏覽器 SDF 建模，比 Tinkercad 強、比 Blender 好上手 | 免費版可匯出 STL |
| [Tinkercad](https://www.tinkercad.com/) | 純新手與教學 | 免費 |

依 [3Dprinting.com 的 2026 軟體指南](https://3dprinting.com/software-guides/best-3d-modeling-cad-software/)，Plasticity 走的是 NURBS / 實體路線——用數學曲線和 watertight 實體來建模，布林運算和倒角特別乾淨，這是硬表面概念設計最舒服的工具。而 [Womp 的比較文](https://womp.com/blogs/womp-vs-tinkercad-vs-blender-the-ultimate-3d-software-comparison-for-beginners-in-2025/)指出，截至 2026 年 7 月其免費方案已包含核心工具、標準材質，以及含 STL 在內的模型匯出。

## 依用途選：一張對照表

| 你要做什麼 | 建議路線 |
|---|---|
| 遊戲 / 動畫資產 | Tripo（quad + 自動綁骨）或混元 3D（一站到動畫），Blender 收尾 |
| 電商展示 / 渲染圖 | Rodin Gen-2.5，貼圖寫實度最高 |
| 快速探索、還在試手感 | Meshy 免費版（200 credits ≈ 10 個完整模型） |
| 3D 列印（複製既有物件） | KIRI Engine 或 RealityScan 掃描 → Blender 修補 |
| 3D 列印（功能件、要對尺寸） | AdamCAD 或 Fusion 360，不要用 AI 生成 |
| 大量生成 / 有商用合規顧慮 | 自架 TRELLIS.2（MIT）或 Hunyuan3D 2.1 |

## 三個容易踩的坑

**授權比品質更容易出事。** 各平台的商用條款差異很大——Meshy 的私有資產要 Pro 起跳，Tripo 的免費版模型也是公開的。先確認再生成，比生了一堆才發現不能用好。

**AI 生成的 mesh 對 3D 列印不友善。** 非流形幾何、破面、內部殘留是常態，直接丟進切片軟體通常會出事。Tripo 有自動修復功能算是加分，但仍建議過一次 Blender 的 3D Print Toolbox。

**Credit 制的成本是非線性的。** 一次「完整生成」通常是模型階段 + 貼圖階段兩段收費，加上重試、改 prompt、換風格，實際消耗常是預估的三到五倍。要認真評估的話，用免費額度先跑完一個真實案例再決定訂閱層級。

## 整體來說

2026 年 3D 工具的核心取捨不是「哪家 AI 比較強」，而是**你願意在哪個環節放棄控制權**。AI 生成用速度換掉了尺寸與拓撲的控制，掃描用精度換掉了對物件的想像自由，CAD 用控制權換掉了速度和有機造型能力。

實務上最有效率的組合通常是混搭：用 AI 生成或掃描做草模，用 Blender 收尾，需要精確尺寸的部件另外用 CAD 走一遍。單押任何一條路，都會在管線的某一段撞牆。

## 參考資料

- [Meshy 官方定價頁](https://www.meshy.ai/pricing) — 方案、credits 與私有資產門檻
- [Meshy Help Center：各任務消耗多少 credits](https://help.meshy.ai/en/articles/10000507-how-many-credits-does-each-generation-task-cost)
- [Meshy AI v6 Review（Toolworthy, 2026）](https://www.toolworthy.ai/tool/meshy-ai-v6) — Meshy-6 發布時間與版本差異
- [Tripo AI 官方定價頁](https://www.tripo3d.ai/pricing)
- [Tripo AI vs. 其他 AI 3D 生成器比較（官方）](https://www.tripo3d.ai/tutorials/tripo-ai-vs-other-ai-3d-generators)
- [Hyper3D Rodin 官方定價頁](https://hyper3d.ai/pricing) — Gen-2.5 方案與 4K / quad 解鎖門檻
- [騰訊混元 3D 官方網站](https://3d.hunyuan.tencent.com/)
- [Hunyuan3D-2 GitHub repo](https://github.com/Tencent-Hunyuan/Hunyuan3D-2) — 模型版本、VRAM 需求、開源時程
- [Hunyuan3D 2.5 技術報告（arXiv:2506.16504）](https://arxiv.org/abs/2506.16504)
- [TRELLIS GitHub repo（Microsoft）](https://github.com/microsoft/TRELLIS)
- [TripoSG GitHub repo](https://github.com/VAST-AI-Research/TripoSG)
- [PartCrafter GitHub repo（NeurIPS 2025）](https://github.com/wgsxm/PartCrafter)
- [InstantMesh GitHub repo](https://github.com/TencentARC/InstantMesh)
- [State of AI 3D Generation 2026（3D AI Studio）](https://www.3daistudio.com/state-of-ai-3d-generation-2026) — TRELLIS.2 規格與開源現況
- [手機 3D 掃描 App 比較 2026（SwiftWand）](https://swiftwand.com/en/smartphone-3d-scanning-app-comparison-2026-en/) — Polycam 費用結構變動
- [KIRI Engine 官網](https://www.kiriengine.app/)
- [RealityScan（Epic Games）](https://www.realityscan.com/)
- [Scaniverse（Niantic）](https://scaniverse.com/)
- [Polycam 官網](https://poly.cam/)
- [Text-to-CAD 工具比較：Zoo vs Adam vs Spectral Labs SGS-1（Leo AI）](https://www.getleo.ai/blog/text-to-cad-tools-comparison-guide)
- [AdamCAD 官網](https://www.adamcad.com/)
- [Zoo Text-to-CAD](https://zoo.dev/text-to-cad)
- [Blender 官網](https://www.blender.org/)
- [Plasticity 官網](https://www.plasticity.xyz/)
- [Nomad Sculpt 官網](https://nomadsculpt.com/)
- [Womp 官網](https://womp.com/)
- [Best 3D Modeling & CAD Software for 3D Printing 2026（3Dprinting.com）](https://3dprinting.com/software-guides/best-3d-modeling-cad-software/)
- 站內延伸：[3D 生成式模型走到哪了：從 Lyra 2.0 拆解 2026 年的技術地圖](/posts/ai/2026-07-22-3d-generative-models-landscape)
