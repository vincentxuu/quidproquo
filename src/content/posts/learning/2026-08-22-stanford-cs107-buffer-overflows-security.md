---
title: "Stanford CS107 Lecture 7：從字串搜尋到 Buffer Overflow，輸入驗證不是容量檢查"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs107, stanford, c-language, systems-programming, buffer-overflow, security]
lang: zh-TW
series:
  name: "Stanford CS107 導讀"
  order: 8
tldr: "CS107 第 7 講先用 strchr、strstr、strspn 建立指標式字串掃描，再指出只驗證內容仍擋不住 buffer overflow：安全邊界必須同時涵蓋輸入規則、目的地容量、終止字元與記憶體檢測。"
description: "逐段導讀 Stanford CS107 Winter 2026 Lecture 7：字元與子字串搜尋、span 函式、反向搜尋、密碼驗證、buffer overflow、安全防護與 Valgrind。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs107-buffer-overflows-security-en)

Lecture 6 把 C string 定義成一份記憶體契約：從某個 `char *` 起點向後讀，必須在合法範圍內遇到 `\0`。Lecture 7 先利用這份契約做更靈活的搜尋，再把鏡頭轉向契約破裂時的後果。這個順序很關鍵。Buffer overflow 不是一種離字串很遠的「資安魔法」，而是程式把輸入寫進固定空間時，沒有證明資料放得下。

本講最值得留下的區分是：**內容有效不等於記憶體操作安全。** 密碼可以全部由允許字元組成，也不含任何禁用片段，卻仍可能長到塞不進目的陣列。`strspn` 與 `strstr` 回答內容規則；capacity reasoning 回答寫入邊界。把兩種檢查混成一種，正是漏洞容易躲進正常業務邏輯的地方。

## 本講資料與完整 agenda

- 課程：Stanford CS107: Computer Organization & Systems
- 學期：Winter 2026
- 官方講次：Lecture 7，2026-01-21
- calendar 標題：C-Strings, Buffer Overflows and Security
- 投影片標題：More C Strings
- 講者：課程 syllabus 列 Jerry Cain 授課；本講 PDF 沒有另列講者
- 已讀材料：官方 calendar、完整 13 頁投影片、文末三份 POSIX 函式規格與 MITRE CWE-120
- 材料缺口：Canvas 錄影、課堂示範逐字內容與 lecture code 未公開；最後一頁只有「Demo: Memory Errors」，因此本文不虛構 demo 的命令或輸出

[官方 calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html)將本講描述成前一講的延伸：繼續熟悉 `string.h`，並研究 buffer overflow 為何發生、如何降低風險。投影片的完整 agenda 是 `strchr`／`strrchr`／`strstr`、自行實作 reverse substring search、`strspn`／`strcspn`、字串參數與 `const`、password validation、overflow 機制與歷史 exploit、capacity reasoning、函式文件與 Valgrind demo。

## 搜尋函式回傳的不是索引，而是原字串裡的位址

```c
char laureate[] = "Katalin Kariko";
char *first = strchr(laureate, 'a');
printf("%s\n", first);  // atalin Kariko

char *second = strchr(first + 1, 'a');
printf("%s\n", second); // alin Kariko
```

[POSIX `strchr` 規格](https://pubs.opengroup.org/onlinepubs/9799919799/functions/strchr.html)說，它定位字元第一次出現的位置，找到時回傳指向該 byte 的指標，找不到則回傳 null pointer。回傳值不是新配置的字串，也不是索引；它是原陣列內部的一個 alias。用 `%s` 從那裡開始印，自然得到 suffix。

第二次搜尋必須從 `first + 1` 開始。如果仍傳 `first`，搜尋範圍的第一個 byte 就是剛找到的 `'a'`，結果永遠是同一個位址。這個 `+ 1` 是進度條件：每輪不是只「再找一次」，而是縮小尚未檢查的範圍。

```c
char *p = laureate;
while ((p = strchr(p, 'a')) != NULL) {
    printf("offset = %td\n", p - laureate);
    p++;
}
```

先判斷 `p != NULL` 才能對它做指標運算。若先寫 `strchr(...)+1`，搜尋失敗時等於對 null pointer 加一，程式已失去合法語意。另外有個容易漏掉的邊界：POSIX 明列 terminating NUL 也算字串的一部分，所以 `strchr(s, '\0')` 會回傳結尾位置，而不是 `NULL`。

`strrchr` 做相同的事，但回傳最後一次出現的位置。投影片以同一字串示範，最後一個 `'a'` 對應 suffix `"ariko"`。兩者都不複製資料；原陣列失效後，回傳指標也不能繼續使用。

## `strstr` 找子字串，空 needle 是一個必須知道的邊界

```c
char laureate[] = "Carolyn Bertozzi";
char *only = strstr(laureate, "zz");
printf("%s\n", only);  // zzi
```

[POSIX `strstr` 規格](https://pubs.opengroup.org/onlinepubs/9799919799/functions/strstr.html)把問題定義為：在 `s1` 指向的字串中，找到 `s2` 的 byte sequence 第一次出現處；needle 的 terminator 不屬於要比對的內容。找到就回傳該位置，找不到回傳 null pointer。如果 needle 是空字串，則回傳 haystack 起點。

空 needle 規則會影響迴圈。若自行做重複搜尋，卻沒處理 `needle[0] == '\0'`，每次 `strstr(curr, needle)` 都立即成功；即使 `curr++`，最後也可能把起點推到陣列之外再搜尋。正式介面要先決定「空 pattern」應回傳起點、終點，還是視為無效輸入，不能把標準函式的邊界行為留給偶然結果。

與 `strchr` 一樣，`strstr` 回傳的是原 haystack 的內部指標。只想知道「有沒有」時，判斷 `!= NULL` 即可；需要位置時可在同一陣列內用 `found - haystack` 得到 offset。不要釋放這個回傳值，也不要誤以為修改它不會影響原陣列。

## 沒有 `strrstr`，可以組合現有契約，但要看見成本

投影片指出標準函式庫沒有 `strrstr`，接著用 `strstr` 實作「最後一次子字串出現位置」：

```c
char *strrstr(char *haystack, char *needle) {
    char *curr = haystack;
    char *last = NULL;

    if (needle[0] == '\0') return haystack + strlen(haystack);

    while (true) {
        curr = strstr(curr, needle);
        if (curr == NULL) return last;
        last = curr;
        curr++;
    }
}
```

每次找到 match 後只前進一格，而不是前進 `strlen(needle)`，因此重疊的 matches 也不會漏掉。例如在 `"aaaa"` 找 `"aa"`，合法起點有 0、1、2；若每次跳兩格，就會漏掉索引 1。

代價是重複掃描。投影片要求思考：在一長串 `w` 後接 `xyz` 的 haystack 中找 `"wwwww"`，每次 `strstr` 都從稍後位置重新比對，前綴高度重複時工作會反覆發生。這份短實作容易驗證，卻不是對所有輸入都具有最佳漸近效率的 reverse search。

「把 haystack 與 needle 都反轉後再搜尋」也不是免費解答。你得配置或原地修改資料、把反轉後的位置映射回原字串，還要正確處理重疊。這講的重點不是選出唯一演算法，而是學會區分 API 組合的正確性與成本：能回傳答案，不代表輸入規模擴大後仍合適。

## `strspn` 與 `strcspn`：問的是前綴符合了多久

`strspn(str, accept)` 回傳從字串起點開始、全部 bytes 都屬於 accept 集合的最大初始區段長度。[POSIX `strspn` 規格](https://pubs.opengroup.org/onlinepubs/9799919799/functions/strspn.html)強調是 bytes 與 initial segment，不是「整個字串中有幾個字元符合」。

```c
char laureate[] = "Barry Sharpless";
size_t count = strspn(laureate, "Broad"); // 4: B a r r
```

`B`、`a`、`r`、`r` 都在 accept 裡，下一個 `y` 不在，掃描立刻停止。後面就算再出現 accept 字元，也不會計入。accept 本身是集合式條件，排列順序與重複字元不影響結果。

`strcspn(str, reject)` 是 complement 版本：回傳初始區段中完全沒有 reject 字元的長度。投影片的 `"Maryam Mirzakhani"` 對 `"Field"` 得到 8，因為第一個屬於 reject 集合的字元出現在 offset 8。

兩個函式都回傳長度而非指標，但能直接與指標組合：`str + strcspn(str, reject)` 指向第一個被拒絕的字元；若結果等於 `strlen(str)`，代表一路到 terminator 都沒遇到。這種「span 長度等於整體長度」正是下一個驗證器的核心。

## Password validation：`const` 寫出資料流，span 寫出允許清單

```c
bool validate(const char *candidate,
              const char *permitted,
              const char *forbidden[],
              size_t length) {
    if (strspn(candidate, permitted) != strlen(candidate)) {
        return false;
    }

    for (size_t i = 0; i < length; i++) {
        if (strstr(candidate, forbidden[i]) != NULL) {
            return false;
        }
    }
    return true;
}
```

第一個條件把 allowlist 寫得很緊：只要 candidate 任一 byte 不在 permitted 集合，初始 span 就會短於全長。第二段逐一尋找禁用片段；這裡不在乎 match 的確切位址，只在乎回傳值是否非 `NULL`。

三組字串都宣告為 `const char *`，因為驗證器只讀資料。`forbidden` 是「指向 const char 的指標陣列」；陣列本身以 pointer 與 length 傳入，所以迴圈邊界必須由 `length` 提供。`const` 不會驗證長度，也不會讓不合法指標變安全，但它縮小函式允許做的事：編譯器可以阻止驗證器意外改寫輸入字元。

這份程式碼回答的是內容政策，而且是 byte-based policy。若 permitted 是 ASCII 集合，它不會自動理解 Unicode 字元。空 candidate 會讓 `strspn` 與 `strlen` 都回傳零，因此通過第一關；若密碼政策不接受空字串，必須另加規則。安全介面的重要習慣就是把這些邊界明寫出來，不把「看起來合理」當成需求。

## 內容驗證通過，仍可能發生 buffer overflow

假設上面的 `validate` 回傳 true，接著程式執行：

```c
char saved[8];
strcpy(saved, candidate);
```

只要 candidate 超過七個可見 bytes，就放不進 `saved`。它可以完全由 permitted 字元組成，也不含 forbidden substring；內容政策全部通過，記憶體操作仍越界。正確前置條件還需要 `strlen(candidate) < sizeof saved`，其中嚴格小於是替 `\0` 留一格。

[MITRE CWE-120](https://cwe.mitre.org/data/definitions/120.html)把 classic buffer overflow 定義為：把輸入 buffer 複製到輸出 buffer，卻沒有確認輸入大小小於輸出大小。該頁列出的後果包括修改記憶體、程式崩潰，以及在可利用條件成立時執行未授權程式碼；它也提醒 `strncpy` 的限制值等於來源大小時可能沒有 NUL。

這裡要把 bug 與 exploit 分開。越界寫本身已是程式錯誤；能否穩定改寫控制資料，取決於記憶體布局、編譯器與執行環境防護等條件。不能把每次 overflow 都說成必然取得任意程式碼執行權，但也不能因一次測試「只是印出怪字」就視為無害。

## 為什麼溢位可能改變控制流程

固定大小陣列旁邊可能放著其他區域資料、函式指標、return address 或配置器 metadata。`strcpy` 不知道邊界，會一直寫到來源 NUL 為止。若越界 bytes 改到普通資料，程式可能算錯；改到指標，之後可能讀寫錯誤位址；改到控制資料，執行流程可能跳去原本不會到達的位置。

投影片用兩個歷史案例建立直覺：AOL Instant Messenger 的惡意訊息，以及 1988 Morris worm 對早期網路服務漏洞的利用。這些案例的共同點不是某個神奇 payload，而是未受限輸入進入固定 buffer，覆寫原本不屬於訊息的記憶體，進而影響程式執行。本文沒有讀到案例的原始 advisory 或 worm 原始分析，因此不在投影片摘要之外補充技術細節。

同樣重要的是 privilege。若被破壞的程序擁有使用者帳號、檔案或網路服務權限，攻擊者取得的能力可能跟著擴大。這也是為什麼「它只是一個字串 copy bug」是錯的風險分類：記憶體錯誤發生在具備權限與外部輸入的系統裡，後果由整個執行情境決定。

## `gets` 的問題不是大家不夠小心，而是介面沒有容量

投影片引用系統 man page 對 `gets` 的警告。原型只有：

```c
char *gets(char *s);
```

這個介面沒有任何位置傳入 destination capacity。若事前不知道輸入長度，函式就不可能判斷何時必須停止寫入；「呼叫者更謹慎」無法補回 API 根本沒提供的資訊。投影片的結論很直接：不要使用 `gets`，改用能接收界線的 `fgets`。

但有 length 參數也不自動等於安全。要先讀文件確認它包含或排除 terminator、限制 input 還是 output、截斷時留下什麼狀態，以及如何回報失敗。Lecture 6 的 `strncpy` 與這講的 `strncat` 已經示範：名字多一個 `n`，不會替你完成契約推理。

## 防護不是單一函式，而是從設計到執行期的多層證據

投影片列出的做法可以整理成四層。

第一層是設計容量。每次 copy 或 append 前，寫出最大輸出公式，把 terminator 算進去。若使用 `sizeof array`，確認眼前真的是陣列；陣列傳進函式後常已退化成 pointer，此時 `sizeof pointer` 不是 buffer capacity。需要跨函式傳遞時，把 pointer 與 capacity 一起放進介面。

第二層是輸入與回傳值。內容政策使用 allowlist、長度、語法與業務規則分別驗證；呼叫可能失敗或截斷的函式後，檢查回傳值。CWE-120 同樣建議接受已知良好輸入，而不是只列舉猜得到的惡意樣式，但也明說 input validation 不是完整解法，因為不是所有 overflow 都源自外部字串。

第三層是測試。邊界案例至少涵蓋空字串、剛好放得下、剛好差一格、超長輸入、缺 terminator 的 raw buffer，以及來源與目的重疊。測試的目標不是只確認正常輸出，而是證明 overflow 不可能，或超界需求會被偵測並妥善拒絕。

第四層是工具與環境防護。投影片以 Valgrind 示範方向：用動態工具找 invalid read/write，因為記憶體錯誤不一定當場 crash。CWE-120 另外把 compiler hardening、canary、ASLR 與非可執行記憶體列為 defense in depth；這些機制能增加利用難度或提早終止，但不是放任越界寫存在的理由。

## 一個可執行的 code review 順序

面對字串輸入路徑，可以沿著資料流逐站檢查：

1. 輸入從哪裡來，呼叫端知道的是長度、capacity，還是只有 pointer？
2. 第一次轉存在哪裡，目的地容量如何得到？
3. 計算所需空間時是否包含 `\0`，加法是否可能溢位？
4. 內容驗證與容量驗證是否分開存在？
5. 截斷是允許的產品行為，還是應該拒絕輸入？
6. 每個搜尋回傳值是否先與 `NULL` 比較，再解參照或加一？
7. 測試是否真的送入邊界外資料，並在記憶體檢測工具下執行？

這套順序把抽象的「小心 buffer overflow」變成能逐行查核的動作。它也解釋本講為何花一半時間談搜尋函式：`strchr`、`strstr` 與 spans 都回傳帶有邊界意義的結果。正確使用它們，需要維持進度、處理 `NULL`、理解 alias 與 terminator；安全不是最後才加上的章節，而是同一套指標推理的延伸。

Lecture 7 的收束可以濃縮成一句話：**驗證文字寫了什麼，和證明記憶體放得下，是兩份不同的工作。** 前者讓產品規則成立，後者讓程式仍在 C 語言允許的範圍內執行。可靠的系統程式必須同時完成兩份證明。

## 參考資料

- [Stanford CS107 Winter 2026 Calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html)
- [Stanford CS107 Lecture 7: More C Strings（PDF）](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/07/Lecture07.pdf)
- [POSIX Issue 8: strchr](https://pubs.opengroup.org/onlinepubs/9799919799/functions/strchr.html)
- [POSIX Issue 8: strstr](https://pubs.opengroup.org/onlinepubs/9799919799/functions/strstr.html)
- [POSIX Issue 8: strspn](https://pubs.opengroup.org/onlinepubs/9799919799/functions/strspn.html)
- [MITRE CWE-120: Buffer Copy without Checking Size of Input](https://cwe.mitre.org/data/definitions/120.html)
