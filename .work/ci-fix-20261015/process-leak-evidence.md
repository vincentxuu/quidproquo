# Legacy article editorial evidence

Six-file editorial repair. No new experimental result or full fact audit is claimed. Existing code, output, source URLs, dates, and metadata remain intact. Removed first-person pricing explanations were hypotheses, not vendor explanations. The body now emphasizes observed security boundaries and report requirements. ASan intra-struct behavior and the early fortify abort retain observed outcomes without asserting unverified internal causes. L1/L2 diagrams remain explanatory models; sandbox outputs cannot establish provider configuration. TEE audit exclusions remain explicit.

## Original paragraphs retained for provenance

### 2026-10-13-bug-bounty-zero-06-memory-bugs-buffer-overflow.md

我的判斷是：這幾層擋的是不同的事，彼此搭配才有效，沒有哪一層讓溢位無害。這也呼應 CWE-120 的整體說法：大多數編譯器或作業系統層級的緩解只處理溢位問題的一部分，很少能完整保護。

### 2026-10-13-bug-bounty-zero-06-memory-bugs-buffer-overflow.md

所以合理的說法只有一個：溢位是一種成因，它導致的後果如果是任意程式碼執行，在分類上就會落到 RCE 這一列。OWASP 與 CWE 都寫了溢位常常可以被用來執行任意程式碼，這是來源的說法；「所以會落到那一列」是我的推論。至於獎金表上某一格是不是由緩衝區溢位賺來的，規則頁沒有寫，我也沒有查到可靠的來源，這一篇不推測。

### 2026-10-13-bug-bounty-zero-06-memory-bugs-buffer-overflow.md

這一篇是入門直覺，幾件事沒有涵蓋。範例是同一個 struct 內相鄰的欄位，目的是讓結果穩定好觀察；真實的堆疊與堆積溢位面對的是更多層防護，實際利用遠比文中複雜。範例也只在 x86-64 Linux 上跑過，旗標變成 65 這個數字，我的判斷是與這個平台把整數的低位元組放在前面有關，換平台數字可能不同。另外溢位只是記憶體錯誤的一類，use-after-free、格式化字串之類的問題，這一篇都沒有講。

### 2026-10-13-bug-bounty-zero-06-memory-bugs-buffer-overflow.md

後面三個旗標的原因：`-O1` 與 `-fno-omit-frame-pointer` 是 Clang 文件為了效能與較好的堆疊追蹤給的建議。`-U_FORTIFY_SOURCE -D_FORTIFY_SOURCE=0` 是我的沙盒踩到的：不加的話，程式在 ASan 回報之前就被另一道檢查中止，只印出 `*** buffer overflow detected ***: terminated`。我的判斷是這來自 glibc 的 `_FORTIFY_SOURCE`（`strcpy` 的 man page 在說目的地不夠大時行為未定義後，指向了這個機制），但我沒有深入驗證這個因果。實際輸出，節錄重點：

### 2026-10-13-bug-bounty-zero-06-memory-bugs-buffer-overflow.md

ASan 沒有報任何錯誤，程式照樣被改了判斷。我只確定這個結果發生了，沒有查到文件明說原因，我的推測是 ASan 在不同物件之間放警戒區，而 `name` 與 `is_admin` 同屬一個 `struct`、中間沒有警戒區可以踩到，但這是推測，不是文件寫的。重點是：工具有盲區，沒報錯不等於沒有問題。CISA 的警示也只說，在測試涵蓋足夠的程式碼庫裡，這類工具可以偵測到許多（不是全部）記憶體安全問題。

### 2026-10-13-bug-bounty-zero-06-memory-bugs-buffer-overflow-en.md

My own judgment is that these layers stop different things and work best together; none of them makes an overflow harmless. That matches CWE-120's general statement that most mitigating technologies at the compiler or OS level address only a subset of buffer overflow problems and rarely provide complete protection against even that subset.

### 2026-10-13-bug-bounty-zero-06-memory-bugs-buffer-overflow-en.md

So only one statement is justified: an overflow is a cause, and if its consequence is arbitrary code execution, it falls under the RCE row by category. OWASP and CWE say overflows often can be used to execute arbitrary code, which is the sources' claim; "so it lands in that row" is my inference. Whether any particular cell of the reward table was earned through a buffer overflow, the rules page does not say and I found no reliable source, so this post does not speculate.

### 2026-10-13-bug-bounty-zero-06-memory-bugs-buffer-overflow-en.md

This is an introduction and leaves several things out. The demo overflows between adjacent fields of one struct so that the result is stable and easy to observe; real stack and heap overflows face more layers of defense, and real exploitation is far more complicated than anything here. The demo was run only on x86-64 Linux, and the number 65 is, in my judgment, tied to this platform storing the low byte of an integer first, so the number may differ elsewhere. And an overflow is only one kind of memory error; use-after-free, format string bugs and others are not covered.

### 2026-10-13-bug-bounty-zero-06-memory-bugs-buffer-overflow-en.md

Why the extra flags: `-O1` and `-fno-omit-frame-pointer` are the Clang docs' recommendations for reasonable performance and nicer stack traces. `-U_FORTIFY_SOURCE -D_FORTIFY_SOURCE=0` is something my sandbox forced: without it, the program was stopped by a different check before ASan could report, printing only `*** buffer overflow detected ***: terminated`. My judgment is that this comes from glibc's `_FORTIFY_SOURCE` (the `strcpy` man page points to that mechanism right after saying the behavior is undefined when the destination is too small), but I did not verify that causal link in depth. Actual output, trimmed to the key lines:

### 2026-10-13-bug-bounty-zero-06-memory-bugs-buffer-overflow-en.md

ASan reported nothing, and the decision was still changed. I am sure only that this happened; I found no documentation giving the reason. My guess is that ASan places guard zones between separate objects, while `name` and `is_admin` are part of one struct with no guard zone between them, but that is a guess, not something the docs say. The lesson is that tools have blind spots, and no report does not mean no bug. CISA's alert likewise says only that, in a codebase with significant unit test coverage, such tools can detect many (but not all) memory safety issues.

### 2026-10-13-bug-bounty-zero-07-vm-and-hypervisor.md

這幾頁沒有細講這些擴充功能在硬體層面做了什麼，所以這篇也不替它們補細節。能從來源確定的只有兩件事：Hyper-V 要求處理器有這類功能；以及依 Learn 架構頁，分割區看到的是處理器的虛擬視圖，不直接碰實體處理器，處理器的中斷由 hypervisor 接手再轉給對應的分割區。

### 2026-10-13-bug-bounty-zero-07-vm-and-hypervisor.md

1. **管理室不是另一個人。** Red Hat 的頁面說，實際執行指令的仍是實體硬體，hypervisor 只是管理排程。接下來是我的概括，不是 Red Hat 的說法：牆不是水泥，而是處理器的硬體支援加上 hypervisor 的軟體檢查。Learn 能支持的部分是，Hyper-V 要求有硬體輔助虛擬化的處理器，分割區看到的是處理器的虛擬視圖，中斷由 hypervisor 接手，詞彙表另列了用於裝置隔離的 IOMMU。

### 2026-10-13-bug-bounty-zero-07-vm-and-hypervisor.md

4. **這是 Hyper-V 的版本。** 不同 hypervisor 的架構不同。Red Hat 的頁面把 KVM、Hyper-V、VMware vSphere 列為 Type 1 的例子，還提到 Xen 是開源選項、VMware 有 ESXi 與 vSphere、KVM 在 2007 年併入 Linux 核心；各家架構上的差異，這篇沒有可靠來源，就不寫。

### 2026-10-13-bug-bounty-zero-07-vm-and-hypervisor.md

MSRC 獎金表裡的 L1、L2，從它的文字可以推出這樣的對應（這是我從措辭讀出來的，頁面沒有給正式定義）：

### 2026-10-13-bug-bounty-zero-07-vm-and-hypervisor.md

我在 2026-10-13 讀了 MSRC 頁面全文。頁面把 RCE 分成兩張表，每張表開頭先寫「什麼情況算數」：

### 2026-10-13-bug-bounty-zero-07-vm-and-hypervisor.md

兩張表有一個值得注意的地方：L2 表的目標寫的是 L1 hypervisor 與 L1 host，沒有提實體主機。而依 Learn，L1 本身也是跑在 Hyper-V 上的 guest。我的判斷是，L2 的上限較低，可能反映它穿過的是更內層的牆；但頁面沒有解釋定價理由，這只是我的推測。

### 2026-10-13-bug-bounty-zero-07-vm-and-hypervisor.md

同一頁還有另外兩類獎金。MSRC 頁面並沒有把它們和上面的 L1、L2 表對應起來，說它們「打的是同一批牆」是我的概括；它們的結果不是執行程式：

### 2026-10-13-bug-bounty-zero-07-vm-and-hypervisor.md

先講來源說得到的部分。

### 2026-10-13-bug-bounty-zero-07-vm-and-hypervisor.md

以上是來源明說的。接下來是我的判斷：把這兩點接起來，就是一個客戶的程式碼可能碰到同一台機器上其他客戶的資料，這是雲端服務最不能發生的事，我認為這是獎金最高的原因之一。難度也是原因（[第 13 篇](/posts/tech/2026-10-13-bug-bounty-top-payouts-fact-check)已經討論過，這類漏洞需要的功力門檻高）。但 MSRC 頁面沒有寫它怎麼訂價，所以「值這麼多錢」的理由，嚴格說只有第一段是有來源的，其餘是我的推論。

### 2026-10-13-bug-bounty-zero-07-vm-and-hypervisor.md

Azure 的頁面還提到客戶可以買「隔離 VM 大小」，保證那台伺服器上只有自己的 VM，或是買專用主機，整台實體機只放同一個訂閱的 VM。我的推論是，共用實體機在 Azure 眼中是一種客戶可以選擇避開的風險，但頁面沒有這樣下結論。同一頁也寫到，Azure 以 VM 放置演算法，以及對已知 side-channel 攻擊的防護，來降低跨 VM 攻擊的風險；頁面沒有談隔離選項的價格。

### 2026-10-13-bug-bounty-zero-07-vm-and-hypervisor.md

必須強調：Learn 只是描述這些元件如何運作，沒有說它們是漏洞的來源。「這些溝通路徑值得特別檢查」是我的直覺，不是來源的結論。哪些元件實際出過問題，下一篇看具體案例時再說。

### 2026-10-13-bug-bounty-zero-07-vm-and-hypervisor.md

- `systemd-detect-virt` 不加參數回 `docker`，加 `--vm` 才回 `kvm`。我的解讀是這台沙盒是一個容器（docker），而容器所在的機器又是 KVM 虛擬機：兩層包裝。容器和 VM 的差別，依 Red Hat：容器是一組與系統其他部分隔離的行程，VM 則自帶作業系統。

### 2026-10-13-bug-bounty-zero-07-vm-and-hypervisor.md

- `vmx`／`svm` 是 Intel／AMD 硬體虛擬化功能在 `/proc/cpuinfo` 的旗標名稱。我對照了[Linux 核心原始碼的 cpufeatures.h](https://github.com/torvalds/linux/blob/master/arch/x86/include/asm/cpufeatures.h)：`X86_FEATURE_VMX` 的註解是 `"vmx" Hardware virtualization`，`X86_FEATURE_SVM` 的註解是 `"svm" Secure Virtual Machine`，檔頭也說明引號內的字串就是 `/proc/cpuinfo` 顯示的名稱。這台裡一個也沒有，`/dev/kvm` 也不存在。我的推論是，這個 guest 沒有拿到硬體虛擬化功能，所以沒辦法在裡面再跑一層硬體加速的 VM。換句話說，這台沙盒是 guest，且沒有被開放巢狀虛擬化。我沒有查證這個沙盒的底層廠商或組態，只能說輸出是這樣。

### 2026-10-13-bug-bounty-zero-07-vm-and-hypervisor.md

- 對 L1、L2 的對應是我從 MSRC 措辭推出的，頁面沒有給正式定義。

### 2026-10-13-bug-bounty-zero-07-vm-and-hypervisor.md

- 沒有讀 Intel 或 AMD 的官方手冊，所以 CPU 硬體虛擬化只寫到 Microsoft 文件明說的程度；`vmx`／`svm` 的旗標名稱只對照了 Linux 核心的 cpufeatures.h，手冊本身沒讀。

### 2026-10-13-bug-bounty-zero-07-vm-and-hypervisor-en.md

Those pages do not go into what the extensions do at the hardware level, so this post will not invent details. What the sources do support: Hyper-V requires such a processor, and per the architecture page, partitions get a virtual view of the processor rather than touching the physical one, with processor interrupts handled by the hypervisor and redirected to the right partition.

### 2026-10-13-bug-bounty-zero-07-vm-and-hypervisor-en.md

1. **The management office is not a separate person.** Red Hat's page says the physical hardware still does the execution, and the hypervisor manages scheduling. What follows is my own summary, not Red Hat's: the walls are not concrete; they are hardware support in the processor plus software checks by the hypervisor. What Learn does support is that Hyper-V requires a processor with hardware-assisted virtualization, partitions see a virtual view of the processor, the hypervisor takes over interrupts, and the glossary also lists the IOMMU for device isolation.

### 2026-10-13-bug-bounty-zero-07-vm-and-hypervisor-en.md

4. **This is the Hyper-V version.** Hypervisors differ in architecture. Red Hat's page lists KVM, Hyper-V and VMware vSphere as Type 1 examples and also mentions Xen as an open source option, VMware's ESXi and vSphere, and KVM being merged into the Linux kernel in 2007. I found no reliable source for the architectural differences between them in what I read, so I leave them out.

### 2026-10-13-bug-bounty-zero-07-vm-and-hypervisor-en.md

The L1 and L2 in MSRC's table map as follows. This is my reading of the wording, not a definition the page gives:

### 2026-10-13-bug-bounty-zero-07-vm-and-hypervisor-en.md

I read the full MSRC page on 2026-10-13. It splits RCE into two tables, each opening with what counts:

### 2026-10-13-bug-bounty-zero-07-vm-and-hypervisor-en.md

One thing worth noticing: the L2 table names the L1 hypervisor and the L1 host as targets, not the physical machine. And per Learn, an L1 guest is itself a guest running on Hyper-V. My judgment is that the lower L2 ceiling may reflect it crossing a more inner wall, but the page does not explain its pricing, so that is only a guess.

### 2026-10-13-bug-bounty-zero-07-vm-and-hypervisor-en.md

The same page has two other award classes. The MSRC page does not tie them to the L1 and L2 tables above; saying they hit the same walls is my own summary. Their outcome is not code execution:

### 2026-10-13-bug-bounty-zero-07-vm-and-hypervisor-en.md

First, what the sources support.

### 2026-10-13-bug-bounty-zero-07-vm-and-hypervisor-en.md

That is what the sources say. What follows is my judgment: put those two together and one customer's code may reach other customers' data on the same machine, which is the thing a cloud service least wants to happen, and I think that is one of the reasons the top award is so high. Difficulty is another reason ([post 13](/posts/tech/2026-10-13-bug-bounty-top-payouts-fact-check-en) already discussed the skill bar for this kind of bug). But MSRC's page never says how it sets prices, so strictly only the first paragraph above is sourced; the rest is inference.

### 2026-10-13-bug-bounty-zero-07-vm-and-hypervisor-en.md

Azure's page also mentions isolated VM sizes, which it says guarantee your VM is the only one on that server, and dedicated hosts, physical servers dedicated to a single subscription. My inference is that Azure treats sharing a physical machine as a risk customers can choose to avoid, but the page does not say so. The same page also says Azure uses a VM placement algorithm and protection against known side-channel attacks to reduce the risk of cross-VM attacks; it does not discuss the price of the isolation options.

### 2026-10-13-bug-bounty-zero-07-vm-and-hypervisor-en.md

To be clear, Learn only describes how these components work. It does not say they are where bugs come from. "These paths deserve extra scrutiny" is my intuition, not a conclusion from the sources. Which components have actually had problems is for the next post.

### 2026-10-13-bug-bounty-zero-07-vm-and-hypervisor-en.md

- `systemd-detect-virt` with no argument says `docker`, and only with `--vm` does it say `kvm`. My reading is that the sandbox is a container (docker) on a machine that is itself a KVM virtual machine: two layers. On the container-versus-VM difference, Red Hat says a container is a set of processes isolated from the rest of the system, while a VM brings its own operating system.

### 2026-10-13-bug-bounty-zero-07-vm-and-hypervisor-en.md

- `vmx` and `svm` are the flag names for Intel and AMD hardware virtualization in `/proc/cpuinfo`. I checked them against the [Linux kernel's cpufeatures.h](https://github.com/torvalds/linux/blob/master/arch/x86/include/asm/cpufeatures.h): `X86_FEATURE_VMX` is commented `"vmx" Hardware virtualization` and `X86_FEATURE_SVM` is commented `"svm" Secure Virtual Machine`, and the file header says the quoted string is what `/proc/cpuinfo` shows. This machine has neither, and `/dev/kvm` does not exist. My inference is that this guest was not given the hardware virtualization feature, so it could not run a hardware-accelerated VM of its own. In other words, this sandbox is a guest with nested virtualization not offered to it. I did not investigate the underlying provider or configuration; the output is all I can report.

### 2026-10-13-bug-bounty-zero-07-vm-and-hypervisor-en.md

- The L1 and L2 mapping is my reading of MSRC's wording; the page gives no formal definition.

### 2026-10-13-bug-bounty-zero-07-vm-and-hypervisor-en.md

- I did not read Intel's or AMD's official manuals, so CPU hardware virtualization goes only as far as Microsoft's documents say; the `vmx` and `svm` flag names were checked only against the Linux kernel's cpufeatures.h, not the manuals themselves.

### 2026-10-14-bug-bounty-zero-09-tee-and-confidential-computing.md

各列的白話解讀（我的對照）：

### 2026-10-14-bug-bounty-zero-09-tee-and-confidential-computing.md

- **資料洩漏**：頁面舉的例子是外部儲存、含使用者資料的記憶體洩漏。回頭看 Meta 的設計目標：處理完不保留訊息、只放行有限的記錄。這一列檢查的就是這個承諾。不過「只放行有限的記錄」這項設計（log filtering），Trail of Bits 的報告列為未審查的範圍（見下一節），所以它有沒有被外部審查驗證過，來源沒有說。

### 2026-10-14-bug-bounty-zero-09-tee-and-confidential-computing.md

- **VM 逃脫**：牆的另一面是 host。這就是[第 9 篇](/posts/tech/2026-10-13-bug-bounty-zero-07-vm-and-hypervisor)的主題，只是這次 host 是營運者自己，是設計上最不該被信任的一方。內部情境下這列是 N/A，頁面沒有解釋原因，我不推測。

### 2026-10-14-bug-bounty-zero-09-tee-and-confidential-computing.md

- **持久化**：頁面說的是對某個工作負載保有存取。金額最低，來源沒寫為什麼；Meta 的設計說明裡有「無狀態」的目標，兩者是否相關，來源沒說，我不替它補。

### 2026-10-14-bug-bounty-zero-09-tee-and-confidential-computing.md

至於為什麼最高 30 萬：獎金頁沒有解釋定價理由。我的判斷是，因為這個系統承諾的是「連 Meta 都看不到」，一旦被打穿，承諾本身就破了，但這是推論，頁面沒有這樣寫。

### 2026-10-14-bug-bounty-zero-09-tee-and-confidential-computing.md

這四條跟獎金表有什麼關係？我的判斷是：它們說明了「繞過程式碼證明」為什麼值得單獨寫進一列；證明機制的缺口，多半出在實作細節。但這是我的解讀，Meta 沒有說過獎金表是依這份報告設計的。

### 2026-10-14-bug-bounty-zero-09-tee-and-confidential-computing-en.md

Row by row, in plain words (my mapping):

### 2026-10-14-bug-bounty-zero-09-tee-and-confidential-computing-en.md

- **Data leaks**: the page's examples are external storage and memory leaks containing user data. Meta's design goals say messages aren't retained after processing and only limited logs leave the CVM; this row tests that promise. The log-filtering part of that design, though, is listed in Trail of Bits' report as outside its review (see the next section), so the sources don't say whether it was independently verified.

### 2026-10-14-bug-bounty-zero-09-tee-and-confidential-computing-en.md

- **VM escape**: the other side of the wall is the host. That's part 9's subject, except here the host is the operator, the party the design trusts least. For internal scenarios this row is N/A; the page doesn't say why, and I won't guess.

### 2026-10-14-bug-bounty-zero-09-tee-and-confidential-computing-en.md

- **Persistence**: the page says persisting access to a workload. It has the lowest amount, and the source doesn't say why. Meta's design lists statelessness as a goal; whether the two are related, the sources don't say, and I won't fill that in.

### 2026-10-14-bug-bounty-zero-09-tee-and-confidential-computing-en.md

As for why the top figure is $300,000: the bounty page doesn't explain its pricing. My judgment is that the system promises "even Meta can't see it," so breaking in breaks the promise itself, but that is inference, not something the page says.

### 2026-10-14-bug-bounty-zero-09-tee-and-confidential-computing-en.md

What do these have to do with the bounty table? My judgment: they show why "bypassing code attestation" earns its own mention in a row, since gaps in attestation tend to come from implementation details. That's my reading; Meta has never said the table was designed from this report.
