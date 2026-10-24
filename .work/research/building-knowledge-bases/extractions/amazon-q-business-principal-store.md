# 抽取紀錄：Amazon Q Business — How the User Store works（principal store / ACL 同步）

read_status=full（curl 取 HTML → 取 main-col-body → pandoc 轉 Markdown → 刪空行，從標題讀到頁尾 API 清單；另以 pandoc plain 全頁確認尾段無遺漏）

## 書目

- AWS Documentation，Amazon Q Business User Guide，"How the User Store works"，https://docs.aws.amazon.com/amazonq/latest/qbusiness-ug/principal-store-hiw.html
- 頁面無日期；頁內提到 "As of Dec 17, 2024" 的 email 規則變更。讀取日 2026-10-22。
- 全文檔：scratchpad/fulltext/o17-qprincipal.md（40 行、7,479 bytes），已讀 1–40 全部。原始 HTML o17raw/qprincipal.html（24,486 bytes）。
- scratchpad 完整路徑：/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/
- 下文「行」為 o17-qprincipal.md 行號。

## 性質

- 廠商官方說明文件，沒有數據。
- **產品狀態**（行 1）："Amazon Q Business is no longer open to new customers. For capabilities similar to Q Business, explore Amazon Quick." 文章引用時要註明產品已停止接新客戶，當「設計範例」而非推薦產品。

## 可引用內容（原文）

1. ACL 是文件的 metadata（行 3）："Each document in any data source has access control list (ACL) information inherently attached to it as metadata. ACLs contain information about which users and groups have access to a document."
2. **ACL 變更只在爬取時更新，要定期重新同步**（行 5）："An Amazon Q Business connector updates any changes in ACLs each time that your data source content is crawled. To capture ACL changes to make sure that the right end users have access to the right content, re-sync your data source regularly."
3. 主控台路徑同樣（行 26）："If you use the console, you must re-sync your data to your index to capture any changes in the ACL and user and group membership within your data source."
4. 預設爬 ACL、開了關不掉（行 9）："Amazon Q Business supports crawling ACLs for document security by default. As a general rule, turning off ACLs and identity crawling once they have been enabled are no longer supported."；沒 ACL 的文件被當公開文件索引（行 4）。
5. User Store 的角色（行 10、23–25）：爬取時抽出資料源的使用者與群組，存在 user store，用來「match and map user and group IDs with their document access details」；Identity crawler 只能在同時爬 ACL（Authorization）時使用。
6. **同名群組重建的陷阱**（行 11）："If you delete a group in the User Store and then re-create it later with the same name but with different group members, document ACLs which contain this group may be impacted. We recommend that this type of change ... be done in the data source instead of the Amazon Q Business User Store."
7. 回收 email 的陷阱（行 12）：重新指派的 email 要先刪掉原使用者 UUID，否則 API 呼叫被拒。
8. **改 User Store 是特權操作**（行 14–16）："Inadvertent mistakes when you update the User Store's user, group, group membership, and mapping information can result in unintentional and unacceptable changes in the accessibility of documents to users." "Treat the ability to update the User Store ... as a privileged operation." "We recommend establishing a documented approval process be followed for making such changes."
9. Email 正規化（行 7）：2024-12-17 起 email 不分大小寫、`+subaddress` 視為同一人（JohnDoe@、johndoe@、johndoe+work@ 同一人）。
10. API（行 28–40）：CreateUser、DeleteUser、UpdateUser、GetUser、PutGroup、DeleteGroup、GetGroup。

## 沒寫的事

- 沒說重新同步要多頻繁、ACL 變更到生效的延遲多久。
- 沒說查詢時怎麼套用過濾（在索引內還是事後），只說「用來 match」。
- 沒談多使用者情境。

## 與範圍卡說法的核對

- 範圍卡「Amazon Q 要定期重新同步」：**正確**，原文行 5 "re-sync your data source regularly"。補兩點：(1) 產品已不接新客戶（行 1）；(2) 原文的理由是「ACL 只在內容被爬取時才更新」，也就是權限和內容綁在同一次爬取。

## 對 order 17 的用法

- 「權限資料本身也是要維護的資料」：身分對應（email、群組名）錯了，權限就錯（行 7、11、12、14）。
- 越權測試題的來源：刪掉再重建同名群組、email 被回收給新員工——這兩種情境都可以寫成測試題。
