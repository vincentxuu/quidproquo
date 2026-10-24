# C 組來源候選掃描：姿勢、背痛、疼痛、核心、伸展、滾筒放鬆

掃描日：2026-10-22。方法：全部 PMID/PMCID/OA 欄位來自 Europe PMC REST（lite）回傳；Groundlane web_fetch 抓取（curl 在此環境被 proxy 403）。
全文可讀判定：用 `/rest/<PMCID>/fullTextXML` 實測。**重要發現：Europe PMC 的 `isOpenAccess=N` 但 `inEPMC=Y`（作者稿／Cochrane／出版社延後開放）者，fullTextXML 回 HTTP 500，等於讀不到全文。只有 `isOpenAccess=Y` 的才抓得到。** 這些標 🔴（僅摘要，Europe PMC search 的 metadata 可查，內文需另找路徑）。
「✅」= 我實際抓到前段內容；「OA未測」= isOpenAccess=Y 但本次沒抓全文；「🔴」= 全文抓不到或不在 EPMC。
本檔不含任何數字結論，只記錄來源存在與主題。

## 1. 姿勢（圓肩、骨盆前傾、駝背、頭前傾）與疼痛

| 來源 | 類型 | PMID | PMCID | isOA | 全文 | 它回答什麼 | 正/反 | 備註 |
|---|---|---|---|---|---|---|---|---|
| Swain 等 2020 J Biomech「No consensus on causality of spine postures or physical exposure and LBP」 | 系統性回顧的回顧（umbrella） | 31451200 | 無 | N | 🔴（不在 EPMC） | 脊椎姿勢／工作暴露與下背痛因果關係的整體證據 | 反證／限制（標題即「無共識」） | 本組最適合當「姿勢—疼痛證據薄弱」的主錨 |
| Sugavanam 等 2025 Disabil Rehabil「Postural asymmetry in LBP」 | SR+統合分析（觀察性） | 39166267 | 無 | N | 🔴 | 下背痛者與無痛者姿勢不對稱是否有差 | 中性／2024 後 | 2024-08 線上 |
| Liu 等 2026 Int J Occup Med Environ Health「Work-related movement and lumbar spine direction: lifting, posture, pain risk」 | SR | 42823924 | PMC13674534 | Y | ✅ | 工作中抬舉／姿勢與腰痛風險 | 中性／2024 後 | 職業情境，非運動 |
| Chun 等 2017 Spine J「Relationships between LBP and lumbar lordosis」 | SR+統合分析 | 28476690 | 無 | N | 🔴 | 腰椎前凸角度與下背痛關聯 | 待讀（可能反證骨盆前傾說） | 僅確認存在 |
| Sadler 等 2017 BMC Musculoskelet Disord「Restriction in lateral bending ROM, lumbar lordosis, hamstring flexibility predicts LBP」 | SR（前瞻性世代） | 28476110 | PMC5418732 | Y | ✅ | 活動度／前凸／腿後肌柔軟度能否預測日後下背痛 | 中性（可橫跨姿勢＋柔軟度兩節） | 開放授權 |
| Mahmoud 等 2019 Curr Rev Musculoskelet Med「Forward head posture and neck pain」 | SR+統合分析 | 31773477 | PMC6942109 | N | 🔴（inEPMC=Y 但 OA=N） | 頭前傾與頸痛關聯 | 正方傾向（待讀） | 不要引結論 |
| Rani 等 2023 Indian J Orthop「Is neck pain related to sagittal head and neck posture?」 | SR+統合分析 | 36825268 | PMC9941407 | N | 🔴（同上） | 頭頸矢狀面姿勢與頸痛 | 待讀 | |
| Chaudhuri 等 2023 Cureus「Physiotherapeutic interventions for upper cross syndrome」 | SR+統合分析 | 37859911 | 見 PubMed（本次未用 EPMC 驗證 PMCID） | 未驗證 | 未驗證 | 上交叉症候群（圓肩＋頭前傾）的物理治療介入 | 中性 | PubMed 搜尋頁顯示 Free PMC；EPMC 欄位未查，列「部分驗證」 |
| Singla & Veqar 2017 J Chiropr Med「Association between forward head, rounded shoulders, increased thoracic kyphosis」 | 敘事型回顧 | 29097952 | PMC5659804 | N | 🔴 | 三種姿勢偏差是否彼此相關 | 中性 | 非系統性回顧 |

## 2. 影像異常與疼痛（無症狀族群盛行率）

| 來源 | 類型 | PMID | PMCID | isOA | 全文 | 它回答什麼 | 正/反 | 備註 |
|---|---|---|---|---|---|---|---|---|
| Brinjikji 等 2015 AJNR「Systematic literature review of imaging features of spinal degeneration in asymptomatic populations」 | SR | 25430861 | PMC4464797 | N | 🔴（fullTextXML HTTP 500） | 無症狀者各年齡層的脊椎退化影像表現 | 正方（支持「影像異常很常見」） | 存在已證實，被引 771。全文需走他路（AJNR 官網或作者稿 PMC 網頁，PMC 網站此環境 403） |
| Brinjikji 等 2015 AJNR「MRI findings of disc degeneration are more prevalent in adults with LBP than in asymptomatic controls」 | SR+統合分析 | 26359154 | PMC7964277 | N | 🔴 | 同組人另一篇：有痛者與無痛者的盤退化盛行率比較 | **限制／反證**（避免單看第一篇就說「影像不重要」） | 兩篇必須配對引用 |
| Teraguchi 等 2026 Neurospine「Functional resilience in CLBP: dissociating MRI abnormalities from real-world disability (Wakayama Spine Study)」 | 世代研究 | 42097743 | PMC13152712 | Y | OA未測 | MRI 異常與實際失能的脫鉤 | 正方／2024 後 | 開放授權 |
| Ueda 2026 Neurospine 評論 | 評論 | 42097744 | PMC13152708 | Y | ✅ | 針對上篇的評論 | 正方／2024 後 | 內容短，可當導讀輔助 |
| Sawaf 2026 Cureus「Re-examining the disc-centric interpretation of CLBP」 | 敘事回顧 | 42333336 | PMC13283523 | Y | ✅ | 重新檢視「以椎間盤為中心」的慢性腰痛解讀 | 正方／2024 後 | 敘事型，等級較低，品質需 source-eval |
| Ibounig 等 2025 J Orthop Surg Res「Imaging abnormalities of AC joint and subacromial space are common in asymptomatic shoulders」 | SR | 39754140 | PMC11697641 | Y | ✅ | 無症狀肩膀的影像異常（攀岩者肩常見） | 正方／2024 後 | SCRUTINY 系列之一，另有同系列 PMID 38876437（盂肱關節，OA=N）與 41308021（旋轉肌袖，OA=N，🔴） |

## 3. 疼痛定義（IASP 2020）與疼痛神經科學教育（PNE）

| 來源 | 類型 | PMID | PMCID | isOA | 全文 | 它回答什麼 | 正/反 | 備註 |
|---|---|---|---|---|---|---|---|---|
| Raja 等 2020 Pain「The revised IASP definition of pain: concepts, challenges, and compromises」 | 官方定義說明文 | 32694387 | PMC7680716 | N | 🔴（fullTextXML 500） | IASP 2020 修訂定義與 6 條附註的由來 | 定義本身（非正反） | 被引 2881。定義原文可另找 IASP 官網（本次未驗證） |
| Louw 等 2016 Physiother Theory Pract「Efficacy of PNE on musculoskeletal pain: SR」 | SR | 27351541 | 無 | N | 🔴 | PNE 早期證據回顧（原始回顧） | 正方 | 被引 457 |
| Watson 等 2019 J Pain「PNE for adults with chronic MSK pain: mixed-methods SR & MA」 | SR+統合分析 | 30831273 | 無 | N | 🔴 | PNE 對慢性肌肉骨骼痛成人 | 中性 | |
| Siddall 等 2022 Pain「Short-term impact of combining PNE with exercise for chronic MSK pain」 | SR+統合分析 | 33863860 | 無 | N | 🔴 | PNE＋運動 vs 運動 | 中性 | |
| Ma 等 2024 Physiother Theory Pract「SR & MA of PNE for chronic LBP: short-term pain and disability」 | SR+統合分析 | 37395152 | 無 | N | 🔴 | PNE 對慢性下背痛短期成效（直接對題） | 正方／2024 | EPMC pubYear=2024，線上 2023-07 |
| Núñez-Cortés 等 2024 Pain「Optimal dose of PNE added to exercise for chronic spinal pain」 | SR＋劑量反應統合 | 38047772 | 無 | N | 🔴 | 加在運動上的 PNE 劑量 | 中性／2024 | |
| Tatikola 等 2025 J Bodyw Mov Ther「PNE+ in people with different mechanisms of chronic pain」 | SR+統合分析 | 39663091 | 無 | N | 🔴 | 不同疼痛機制 | 中性／2024-25 | |
| **Medina-Viedma 等 2025 Med Sci (Basel)「Effectiveness of PNE ... in chronic low back pain: SR & MA」** | SR+統合分析 | 41440522 | PMC12734988 | Y（CC BY） | ✅ | PNE 對慢性下背痛的疼痛、失能、運動恐懼、災難化 | 正方／**2024 後、可讀** | **本子題最佳可讀主來源** |
| Cancela 等 2025 Ann Phys Rehabil Med「PNE in chronic non-specific LBP: umbrella review with MA」 | 傘狀回顧 | 41005108 | 無 | N | 🔴 | 彙整多篇 PNE 回顧 | 中性／2025 | |
| **Riley 等 2026 J Man Manip Ther「PNE combined with any singular PT intervention is not more effective than the single intervention itself」** | SR | 41262073 | 無 | N | 🔴 | PNE 附加在單一物理治療上有無額外效果 | **反證／限制** | 2026；僅標題層級確認，結論須待讀全文 |
| Kühn 等 2026 Pain Rep「Acceptance of PNE in chronic MSK pain: qualitative SR」 | 質性 SR | 41868689 | PMC13004225 | Y | OA未測 | 患者如何接受 PNE | 中性／2026 | |
| Adenis 等 2026 Physiother Theory Pract「PNE vs spinal physiology & ergonomics education ... 12-month RCT」 | RCT | 42482622 | 無 | N | 🔴 | PNE 與傳統脊椎教育比較 | 待讀 | |

## 4. 核心穩定訓練與下背痛

| 來源 | 類型 | PMID | PMCID | isOA | 全文 | 它回答什麼 | 正/反 | 備註 |
|---|---|---|---|---|---|---|---|---|
| Hayden 等 2021 Cochrane「Exercise therapy for chronic low back pain」 | Cochrane SR | 34580864 | PMC8477273 | N | 🔴（fullTextXML 500） | 運動治療整體對慢性下背痛 | 正方（上位證據，非僅核心） | 被引 351；全文走 Cochrane 官網（未驗證可讀） |
| Saragiotto 等 2016 Cochrane「Motor control exercise for chronic non-specific LBP」 | Cochrane SR | 26742533 | PMC8761501 | N | 🔴 | 動作控制（核心穩定）運動 vs 其他治療 | 正方／限制（待讀） | 另有急性版 PMID 26863390（PMC8734597，OA=N）與 Spine 版 PMID 27128390 |
| Wang 等 2012 PLoS One「Meta-analysis of core stability exercise versus general exercise for chronic LBP」 | SR+統合分析 | 23284879 | PMC3524111 | Y | OA未測 | 核心穩定 vs 一般運動（對照式比較） | 中性（常被引為「核心沒有比一般運動好很多」的來源，待讀確認） | 2012，較舊 |
| Smrcina 等 2022 Int J Sports Phys Ther「SR of core stability exercises in non-specific LBP」 | SR | 35949382 | PMC9340836 | Y | OA未測 | 核心穩定運動效果 | 待讀 | 物理治療期刊，品質需 source-eval |
| **Guo 等 2025 Front Physiol「Effects of different types of core training on pain and functional status in chronic nonspecific LBP: SR & MA」** | SR+統合分析 | 41178988 | PMC12571568 | Y | ✅ | 不同類型核心訓練對慢性腰痛的疼痛與功能 | 正方／**2024 後、可讀** | 本子題最佳可讀 |
| Stuber 等 2014 Clin J Sport Med「Core stability exercises for LBP in athletes: SR」 | SR | 24662572 | 無 | N | 🔴 | 運動員族群 | 待讀 | 與攀岩讀者相近 |
| IJzelenberg 等 2024 Arch Phys Med Rehabil「Exercise therapy for acute non-specific LBP: Cochrane SR & MA」 | Cochrane SR | 38513994 | 無 | N | 🔴 | 急性腰痛的運動治療 | 中性／2024 | |
| Riley 2026（見第 3 節） | | | | | | | 反證類 | 運動為主、衛教附加無額外效果的概念相關 |

> 反證缺口：本節尚未找到「核心穩定訓練並不優於一般運動／其他運動」且可讀的 2024 後來源。Wang 2012 與 Smrcina 2022 可能提供此面向，需精讀確認，不可先下結論。

## 5. 伸展、柔軟度、滾筒放鬆

| 來源 | 類型 | PMID | PMCID | isOA | 全文 | 它回答什麼 | 正/反 | 備註 |
|---|---|---|---|---|---|---|---|---|
| **Konrad 等 2024 J Sport Health Sci「Chronic effects of stretching on ROM ... SR with MA」** | SR+統合分析 | 37301370 | PMC10980866 | Y（CC BY-NC-ND） | ✅ | 長期伸展訓練對關節活動度 | 正方／2024 | |
| Arntz 等 2023 Sports Med「Chronic effects of static stretching on muscle strength and power」 | SR+多層統合 | 36719536 | PMC9935669 | Y | ✅ | 長期靜態伸展對肌力與爆發力 | 中性 | 2023 |
| **Warneke 等 2024 Sports Med Open「Chronic static stretching on maximal strength and muscle hypertrophy」** | SR+統合迴歸 | 38637473 | PMC11026323 | Y | OA未測 | 長期靜態伸展對最大肌力與肌肥大 | 中性／2024 | |
| Behm 等 2023 Sports Med Open「Acute effects of various stretching techniques on ROM」 | SR+統合分析 | 37962709 | PMC10645614 | Y | OA未測 | 各種伸展技術的立即活動度效果 | 中性 | |
| Afonso 等 2021 Front Physiol「Post-exercise stretching on recovery of strength, ROM, DOMS」 | SR+統合分析 | 34025459 | PMC8133317 | Y | OA未測 | 運動後伸展與恢復 | 待讀 | 對應「恢復」 |
| Thacker 等 2004 Med Sci Sports Exerc「Impact of stretching on sports injury risk」 | SR | 15076777 | 無 | N | 🔴 | 伸展與運動傷害風險 | 反證（常被引為「伸展與傷害預防證據不足」，**待讀確認**） | 舊；非開放 |
| Herbert 等 2011 Cochrane「Stretching to prevent or reduce muscle soreness after exercise」 | Cochrane SR | 21735398 | 無 | N | 🔴 | 伸展與延遲性肌肉痠痛 | 反證傾向（待讀） | |
| Lewis 2014 Orthop Nurs「Stretching and athletic injury prevention: systematic literature review」 | SR | 25401202 | 無 | N | 🔴 | 同上 | 待讀 | |
| **Wiewelhove 等 2019 Front Physiol「A meta-analysis of the effects of foam rolling on performance and recovery」** | 統合分析 | 31024339 | PMC6465761 | Y | ✅ | 滾筒對表現與恢復 | 中性／正方（待讀） | 被引 171，經典；2024 前 |
| Wilke 等 2020 Sports Med「Acute effects of foam rolling on ROM in healthy adults」 | SR+多層統合 | 31628662 | 無 | N | 🔴 | 滾筒立即活動度 | 正方（待讀） | |
| Skinner 等 2020 J Bodyw Mov Ther「SR & MA of foam rolling on ROM, recovery, markers of athletic performance」 | SR+統合分析 | 32825976 | 無 | N | 🔴 | 同上 | 待讀 | |
| Konrad 等 2022 Sports Med「Foam rolling training effects on ROM」 | SR+統合分析 | 35616852 | PMC9474417 | Y | ✅ | 長期滾筒訓練對活動度 | 中性 | |
| **Warneke 等 2024 J Sport Health Sci「Foam rolling and stretching do not provide superior acute flexibility and stiffness improvements compared to any other warm-up intervention」** | SR+統合分析 | 38244921 | PMC11184403 | Y | ✅ | 滾筒／伸展相對其他熱身的急性效果 | **反證／限制，2024** | 本組最佳「滾筒不特別優越」來源 |
| Konrad 等 2024 Sports Med「Static stretch training versus foam rolling training effects on ROM」 | SR+統合分析 | 38760635 | PMC11393112 | Y | OA未測 | 伸展訓練 vs 滾筒訓練 | 中性／2024 | |
| Zhou 等 2024 J Bodyw Mov Ther「Preventive effect of foam rolling on muscle soreness after exercise」 | SR+統合分析 | 39593540 | 無 | N | 🔴 | 滾筒預防運動後痠痛 | 待讀／2024 | |
| Habscheid 等 2024 J Bodyw Mov Ther「Foam rolling on local and distant pain sensitivity (pressure pain thresholds)」 | SR | 39593677 | 無 | N | 🔴 | 滾筒與疼痛敏感度（涉及疼痛機制） | 待讀／2024 | |
| Beardsley & Škarabot 2015 J Bodyw Mov Ther「Effects of self-myofascial release: SR」 | SR | 26592233 | 無 | N | 🔴 | 自我肌筋膜放鬆整體 | 待讀 | |
| Laimi 等 2018 Clin Rehabil「Effectiveness of myofascial release in chronic musculoskeletal pain: SR」 | SR | 28956477 | 無 | N | 🔴 | 肌筋膜放鬆（治療師施作）對慢性痛 | 待讀 | 與自我滾筒不同，需區分 |
| Chen 等 2021 Complement Ther Med「Myofascial release technique for LBP: SR & MA」 | SR+統合分析 | 33984499 | 無 | N | 🔴 | 肌筋膜放鬆對下背痛 | 待讀 | |

## 6. 單槓懸吊／脊椎牽引對腰椎

誠實結論：本次以 Europe PMC 標題搜尋（hanging, dead hang, inversion, pull-up bar, passive hanging, gravity-assisted, axial decompression, suspension 搭配 back pain/lumbar/spinal）**沒有找到單槓懸吊對腰椎的同儕審查研究**；搜尋結果被腎結石倒立排石、自縊傷害、腦室分流閥等無關文獻淹沒。以下是已驗證的相鄰證據。

| 來源 | 類型 | PMID | PMCID | isOA | 全文 | 它回答什麼 | 正/反 | 備註 |
|---|---|---|---|---|---|---|---|---|
| Tekeoglu 等 1998 Spine「Distraction of lumbar vertebrae in gravitational traction」 | 實驗研究（裝置） | 9589547 | 無 | N | 🔴 | 重力牽引裝置下腰椎間距變化 | 非單槓；裝置研究 | EPMC 驗證存在，與先前結論一致 |
| Gianakopoulos 等 1985 Arch Phys Med Rehabil「Inversion devices: their role in producing lumbar distraction」 | 臨床試驗（裝置） | 3155939 | 無 | N | 🔴 | 倒立裝置產生腰椎牽開 | 非單槓；裝置研究 | EPMC 驗證存在 |
| Wegner 等 2013 Cochrane「Traction for low-back pain with or without sciatica」 | Cochrane SR | 23959683 | PMC6823219 | N | 🔴（fullTextXML 500） | 牽引治療下背痛的整體證據 | **限制導向**（牽引類，非懸吊） | 被引 52；最重要的相鄰證據 |
| Cheng 等 2020 Clin Rehabil「Mechanical traction on LBP in herniated disks」 | SR+統合分析 | 31456418 | 無 | N | 🔴 | 機械牽引對椎間盤突出者 | 待讀 | |
| Vanti 等 2021 Phys Ther「Mechanical traction for lumbar radiculopathy」 | SR+統合分析 | 33382419 | 無 | N | 🔴 | 機械牽引對腰椎神經根病 | 待讀 | |
| Wang 等 2022 Comput Math Methods Med「Mechanical traction for lumbar disc herniation: meta-analysis」 | 統合分析 | 35774300 | PMC9239808 | Y | OA未測 | 機械牽引對腰椎間盤突出 | 待讀 | 品質需 source-eval |

## 7. 反證／爭議彙整（每題至少一篇）

| 子題 | 反證／限制來源 | PMID | 是否可讀全文 |
|---|---|---|---|
| 姿勢—疼痛 | Swain 2020 J Biomech「No consensus on causality...」 | 31451200 | 🔴 |
| 影像—疼痛 | Brinjikji 2015「MRI disc degeneration more prevalent in LBP than asymptomatic」（配對） | 26359154 | 🔴 |
| PNE | Riley 2026「PNE + single PT intervention not more effective」 | 41262073 | 🔴 |
| 核心 | 暫缺（見缺口）；候選 Wang 2012 PLoS One（核心 vs 一般運動） | 23284879 | OA未測 |
| 伸展 | Thacker 2004（傷害風險）、Herbert 2011 Cochrane（痠痛） | 15076777、21735398 | 🔴 |
| 滾筒 | Warneke 2024 JSHS「not superior to any other warm-up」 | 38244921 | ✅ |
| 懸吊／牽引 | Wegner 2013 Cochrane（牽引） | 23959683 | 🔴 |

## 還沒查到的缺口

1. **單槓懸吊直接研究**：沒有。僅 Tekeoglu 1998、Gianakopoulos 1985（皆裝置研究，非 OA）。可靠結論只能寫「找不到直接研究」。
2. **IASP 2020 定義全文／官方頁面**：Raja 2020 解說文已驗證存在，但 Europe PMC 抓不到全文（500）。IASP 官網定義頁本次未抓，未驗證。
3. **PNE 的「更新（2024 以後）」大多不可讀**：可讀的只有 Medina-Viedma 2025（PMC12734988）；Ma 2024、Núñez-Cortés 2024、Cancela 2025、Riley 2026、Tatikola 2025 皆 isOA=N，全文未取得。需另走 Groundlane/Exa/Firecrawl 抓出版社頁或 PubMed 摘要，本次未做。
4. **Cochrane 全文**：Hayden 2021、Saragiotto 2016、Wegner 2013 在 EPMC 有條目但 fullTextXML 500，需走 Cochrane 官網（未測）。
5. **核心穩定的 2024 後反證**：未找到明確「核心訓練不優於其他運動」的 2024 後可讀來源。
6. **伸展—傷害預防／疼痛的 2024 後來源**：伸展對 ROM／肌力有 2023-24 的可讀 SR，但「傷害預防」與「伸展治療疼痛」只找到 2004–2014 年、非 OA 的 SR；沒有 2024 後。
7. **姿勢題的 2024 後可讀 SR**：只有 Liu 2026（職業情境）可讀，其餘 2024-25 的（Sugavanam）不可讀；缺針對圓肩／骨盆前傾與運動表現的可讀 SR。
8. **Chaudhuri 2023 Cureus（PMID 37859911）**：僅由 PubMed 搜尋頁看到，未用 Europe PMC 驗證 PMCID 與 OA 欄位，故不列為已驗證候選。
9. **全文可讀性只測了部分 OA=Y 來源**（標「OA未測」者），使用前須補測。
10. **所有「正/反」標記是依標題與期刊判斷，不是精讀結論**；每篇引用前要讀摘要或全文再定位。
11. 未納入商業健身網站與部落格（未當線索使用）。
