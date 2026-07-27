# 你的 AI 部落格

從這裡開始。照著做，你會在一小時內看到自己的網址。

**你不需要會寫程式。** 下面每一步都是在網頁上點按鈕。

---

## 你需要準備

- 一個 GitHub 帳號（免費，等下會教）
- 一個 Cloudflare 帳號（免費）
- Claude 付費方案（Pro，每月 $20）或 ChatGPT 付費方案

網站主機不用錢。網域是選配，一年大約 $8，之後想綁再綁。

---

## 第一步：拿到你自己的一份

1. 到 [github.com](https://github.com) 註冊帳號。介面是英文的，但只要填帳號、信箱、密碼。
2. 回到這個專案的頁面，按綠色的 **Use this template** → **Create a new repository**。
3. 取一個名字（例如 `my-blog`），選 **Public**，按 **Create repository**。

現在這份東西是你的了。

---

## 第二步：讓它上線

1. 到 [dash.cloudflare.com](https://dash.cloudflare.com) 註冊帳號。
2. 左邊選 **Workers & Pages** → **Create** → **Pages** → **Connect to Git**。
3. 授權 GitHub，選你剛剛建立的那個 repository。
4. 設定畫面填這兩個：
   - **Build command**：`npm run build`
   - **Build output directory**：`dist`
5. 按 **Save and Deploy**，等一兩分鐘。

完成後你會拿到一個像 `my-blog.pages.dev` 的網址。打開它，你的部落格已經在線上了。

---

## 第三步：改成你的

1. 回到 GitHub，點開 `site.config.ts` 這個檔案。
2. 按右上角的鉛筆圖示開始編輯。
3. 把 `title`、`description`、`author` 換成你自己的。
4. 把 `url` 換成第二步拿到的那個網址（結尾不要加斜線）。
5. 拉到最下面按 **Commit changes**。

一兩分鐘後重新整理你的網站，就會看到改好的樣子。

---

## 第四步：讓 AI 幫你寫

1. 到 [claude.com/download](https://claude.com/download) 下載桌面版，登入。
2. 左邊側欄找到 **Customize** → **Plugins**。
3. 按 **+** → **Add marketplace**，貼上設定檔的網址，按加入。
4. 找到部落格寫作的 plugin，按 **Install**。
5. 連接 GitHub（會跳出授權畫面，按同意）。

裝好之後，切到 **Cowork**，說：

> 幫我研究〈你想寫的主題〉，寫成一篇文章

它會查資料、把來源列給你看、寫成草稿。你讀過、改幾句、把自己的看法補進去，然後說：

> 發布

一兩分鐘後重新整理網站，文章就在上面。

---

## 卡住了怎麼辦

| 狀況 | 怎麼辦 |
|---|---|
| 網站沒有更新 | 到 Cloudflare 的 Deployments 頁面看最新一筆。紅色代表有東西沒填對，點進去看訊息 |
| 建置失敗，看到一堆紅字 | 把整段複製給 Claude，說「幫我修這個」 |
| 文章寫好了但沒出現 | 檢查是不是 `draft: true`，或日期填成未來 |
| 標題有冒號就壞掉 | 標題用雙引號包起來：`title: "咖啡：入門筆記"` |

---

## 想在自己電腦上先看看（選配，需要一點技術）

大部分人不需要這一段。

```bash
npm install
npm run dev
```

打開 http://localhost:4321

---

## 這個部落格的規矩

`AGENTS.md` 那份檔案寫的是給 AI 看的規則——文章要放哪、欄位怎麼填、什麼不能做。
你可以改它，改了之後 AI 就會照新的規矩做事。
