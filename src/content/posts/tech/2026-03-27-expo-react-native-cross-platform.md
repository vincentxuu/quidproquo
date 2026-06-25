---
title: "Expo + React Native：一套程式碼跑 iOS 和 Android，實際上是什麼體驗"
date: 2026-03-27
type: guide
category: tech
tags: [expo, react-native, mobile, cross-platform]
lang: zh-TW
tldr: "Expo 讓 React Native 開發從「環境設定地獄」變成可以直接寫邏輯的狀態。Expo Router 帶來 file-based routing，讓 web 開發者轉移成本更低。島島和 NobodyClimb 都用它跨 iOS/Android。"
description: "介紹 Expo + React Native 跨平台開發：Expo Router、為什麼它讓 React Native 更容易上手，以及島島和 NobodyClimb 選擇它的理由。"
draft: false
---

🌏 [English version](/posts/tech/2026-03-27-expo-react-native-cross-platform-en)

React Native 的想法一直很吸引人：一套 JavaScript 程式碼，iOS 和 Android 各自編譯成原生元件，不是 WebView 包裝，而是真正的原生 UI。但 React Native 的設定歷來是一個問題——Xcode、Android SDK、模擬器、橋接層的版本相依，光是跑起來 hello world 就能卡很久。

Expo 解決的主要是這個問題。它是 React Native 的 framework 和工具鏈，讓大部分的設定消失，讓開發者可以直接開始寫邏輯。

島島（DaoDao）和 NobodyClimb 都用 Expo + React Native 作為 mobile app 的技術棧，和 Next.js 前端共用同一個 monorepo 的型別和工具。

## Expo 在做什麼

Expo 有幾個層次：

**Expo Go**：開發階段，手機裝一個 app，掃 QR code，直接在真機上看到你的程式，不需要編譯。這讓開發迴圈快很多，改完儲存立刻在手機上看到結果。

**Expo SDK**：包裝好的 native module 集合，Camera、Location、Notifications、FileSystem 這些常見功能都有，API 設計一致，不需要手動處理 iOS/Android 的差異。

**EAS（Expo Application Services）**：雲端編譯和發布服務，本機不需要 Xcode 或 Android Studio 就能 build 出 .ipa 和 .apk，push 到 App Store 和 Play Store 也有對應工具。

**Expo Router**：file-based routing，概念和 Next.js App Router 相同。

## Expo Router：file-based routing

Expo Router 是目前 Expo 推薦的導航方案，取代舊版的 React Navigation 手動設定：

```
app/
├── _layout.tsx      # 根層 layout（底部 tab、全域 provider）
├── index.tsx        # 首頁，對應路徑 /
├── (tabs)/
│   ├── _layout.tsx  # Tab 導航設定
│   ├── feed.tsx     # /feed
│   └── profile.tsx  # /profile
└── posts/
    └── [id].tsx     # /posts/:id，動態路由
```

跳頁不需要手動呼叫 navigator，用 `Link` 元件或 `router.push`：

```tsx
import { Link, router } from "expo-router";

// 宣告式
<Link href="/posts/123">查看文章</Link>

// 命令式
router.push({ pathname: "/posts/[id]", params: { id: post.id } });
```

對從 Next.js 轉過來的開發者，這個模式很熟悉——不需要重新學一套導航概念。

## 基本的 Screen 範例

```tsx
// app/posts/[id].tsx
import { useLocalSearchParams } from "expo-router";
import { View, Text, ScrollView } from "react-native";

export default function PostScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: post } = useQuery(["post", id], () => fetchPost(id));

  return (
    <ScrollView>
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold" }}>{post?.title}</Text>
        <Text>{post?.content}</Text>
      </View>
    </ScrollView>
  );
}
```

狀態管理和 web 端一樣，島島和 NobodyClimb 的 mobile app 都透過 `packages/` 共用 Zustand store 和 TanStack Query hooks，不需要為 mobile 另外寫一套資料層。

## 為什麼島島和 NobodyClimb 都選它

**共用邏輯**：monorepo 裡的 `packages/shared`、`packages/api`、`packages/schemas` 都可以在 web 和 mobile 之間共用，型別定義不用寫兩份，API client 也一樣。這是主要的效益。

**降低維護成本**：兩個平台（iOS + Android）只需要一套程式碼，不需要 iOS 工程師和 Android 工程師各自維護。對小團隊來說，這個節省是很實際的。

**生態成熟度**：Expo SDK 52+ 之後穩定度明顯提升，New Architecture（JSI + Fabric）已經是預設，bridge 的效能問題大幅改善。

**開發體驗**：Expo Go + Fast Refresh 讓開發迴圈快，不需要每次改 UI 都重新 build。

## 需要注意的地方

**Native modules**：如果需要的功能不在 Expo SDK 裡（例如特定藍牙協定、深度整合的相機控制），需要用 `expo-modules-core` 寫自訂 native module，或 eject 出去自己管 native 程式碼。這個門檻比 web 高。

**App 大小**：Expo managed workflow 的 app bundle 比純 React Native 大，因為包含了完整的 Expo runtime。如果 app size 是硬需求，可能需要 bare workflow。

**iOS 開發**：就算用 EAS 遠端 build，iOS 上架還是需要 Apple Developer 帳號和 certificate 管理。EAS 讓這個流程簡化很多，但不是完全不需要處理。

**Web 支援有限制**：Expo Router 支援 web target，但 React Native 的元件不是所有都有 web 版本，需要用 `Platform.OS` 做條件分支，或用支援 web 的套件。

## 整體來說

Expo 現在已經不是「React Native 的訓練輪」，而是大多數新專案的預設選擇。New Architecture 讓效能問題不再是主要顧慮，Expo Router 讓導航邏輯和 web 開發對齊，EAS 讓發布流程自動化。

對一個同時有 web 和 mobile 需求的小團隊，Expo + React Native 在 monorepo 裡和 Next.js 並存是目前最務實的方案。

## 參考資料

- [Expo 官方文件](https://docs.expo.dev/)
- [Expo Router 官方文件](https://expo.github.io/router/docs)
- [React Native New Architecture](https://reactnative.dev/docs/the-new-architecture/landing-page)
- [EAS（Expo Application Services）](https://expo.dev/eas)
- [島島阿學技術架構全覽](/posts/tech/deep-dive/2026-03-12-daodao-tech-architecture)
- [NobodyClimb 系統架構](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture)
