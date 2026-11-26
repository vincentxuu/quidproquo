# climbing-gym-beta-english evidence

核對日期：2026-10-25。工具：完整 callable inventory 無 Groundlane；使用 Exa web_search_exa / web_fetch_exa fallback，只處理公開頁。這不是 Groundlane 路徑的驗證。

## 來源選擇與閱讀範圍

便利取樣：先讀既有 teaching-materials.md，再選語言教材、字典與領域來源。未主張母語者頻率或跨地區通則。工具完整回傳保留 raw/；字典以對應編輯義項/例句為核對範圍，不把自動語料例句當編輯判準。

表達的原句/同骨架，與自寫對話情境分開：全部 contextEvidenceType=adapted。原文在該頁出現，不代表文章的自寫場景也來自該頁。

| 卡片 | 表達 | 支持與原句 | 情境 | 支持範圍／不支持 |
|---|---|---|---|---|
| climb-beta | adapted | Collins how 的原句是 How did you do it?；只把受詞 it 換成 this move。REI 動作文章支持 move 的攀岩動作語境。 [Collins：how](https://www.collinsdictionary.com/dictionary/english-chinese/how)；[REI：Rock Climbing Terms & Lingo Guide](https://www.rei.com/learn/expert-advice/rock-climbing-glossary.html) | adapted | did 問朋友已經做過的動作；如果要對方現在示範，改成 Can you show me how to do it?。 |
| climb-show-move | direct | Cambridge 英法字典 how 直接列出 Can you show me how to do it?。 [Cambridge：how（英法字典）](https://dictionary.cambridge.org/dictionary/english-french/how) | adapted | 完整英文是來源例句；攀岩館請求示範的情境為自寫，不是來源對話。 |
| climb-left-foot | adapted | Geniebook WHERE 節原句為 Where did you put it?；只把受詞 it 換成 your left foot。REI 的動作文章支持 foot placement 語境。 [Geniebook：Interrogative Words & Modal Verbs](https://geniebook.com/vn/chuong-trinh/primary-5/tieng-anh/interrogative-words-modal-verbs)；[REI：Rock Climbing Terms & Lingo Guide](https://www.rei.com/learn/expert-advice/rock-climbing-glossary.html) | adapted | 問已經做過的動作，不是在替眼前路線指定腳點。 |
| climb-reach-hold | adapted | Cambridge reach 有 I can’t reach my zip - could you unfasten it, please?；保留 I can’t reach + 受詞，將 my zip 換成 that hold。REI 支持 hold 的攀岩意思。 [Cambridge：reach](https://dictionary.cambridge.org/dictionary/english/reach)；[REI：Rock Climbing Terms & Lingo Guide](https://www.rei.com/learn/expert-advice/rock-climbing-glossary.html) | adapted | 描述搆不到，不判定是身高、力量或動作的問題，也不是攀登操作建議。 |
| climb-offer-beta | direct | Climb On Equipment 的 I know the beta 節直接示範 Do you want beta?。 [Climb On Equipment：攀岩館禮儀](https://climbonequipment.com/en-us/blogs/knowledge/top-10-unwritten-rules-of-the-climbing-gym) | adapted | 這句是提供建議的人問對方，不是向別人討 beta。 |

## 功能與現有卡片對照

- 原有 climb-beta 保留同一 ID 與主答案，補上 Collins 同骨架依據；不能因單純補來源而清空熟悉度。
- 新增請示範、左腳追問、搆不到、提供beta前先問四個目的。
- REI 兩頁是領域詞彙/動作背景；Cambridge、Collins、Geniebook 是完整句/同骨架的語言來源；Climb On Equipment 是真實攀岩場景中問beta的示範。
- 本篇不納入確保口令、繩索操作、實際路線腳點或身體能力診斷。
- Geniebook 部分額外文法敘述未採用；只採 WHERE 節的 Where did you put it?。

## 語言與來源複核

- 逐題中文、context、英文動作一致；direct只指表達，不把自寫情境標成direct。
- 自寫短對話已逐回合閱讀，先表達問題，再追問/請示範；未拼接來源整段對話。
- 無未核對的推薦替代句；文章沒有「仍待核對」節。
- 未主張最自然/最常用/唯一正確，未做母語者測試。
- 主線負責speakingCards/speakingEvidence、音檔與manifest；本agent只交卡片JSON。
