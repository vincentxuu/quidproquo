---
title: "Tamagui：React Native 的 UI framework，為什麼 NobodyClimb 選它而不是 NativeWind"
date: 2026-03-27
type: guide
category: tech
tags: [tamagui, react-native, ui, styling]
lang: zh-TW
tldr: "Tamagui 是針對 React Native 設計的 UI framework，有完整的 design token 系統和 theme 支援，編譯時期優化讓樣式計算移到 build time。NobodyClimb 選它而不是 NativeWind，主要是因為跨平台的 token 系統更完整。"
description: "介紹 Tamagui UI framework：design token、theme、跨平台樣式，以及 NobodyClimb 選擇 Tamagui 而不是 NativeWind 的理由與取捨。"
draft: false
---

React Native 的樣式系統和 web CSS 相差很大——沒有 cascade，沒有 `em`/`rem`，flexbox 是預設佈局，字型大小要在每個平台分別測試。這讓「把 web 的 UI 套件帶進 React Native」比看起來難。

NobodyClimb 的 mobile app（Expo 54 + React Native 0.81）用 **Tamagui** 做 UI 框架。這篇說明 Tamagui 是什麼、設計概念是什麼，以及為什麼在 NativeWind 和 Tamagui 之間選了後者。

## Tamagui 是什麼

Tamagui 是一個針對 React Native（含 web target）設計的 UI framework，核心是三件事：

1. **Design Token 系統**：顏色、間距、字型、圓角統一用 token 管理，不用在元件裡寫 magic number
2. **Theme 支援**：亮色/暗色模式切換，token 值隨 theme 自動換
3. **編譯時期優化**：樣式計算在 build time 完成，runtime 少做事，效能比純 runtime styling 好

Tamagui 提供自己的元件集（`Button`、`Input`、`Sheet`、`Dialog` 等），也提供 `styled()` API 讓你建立自訂元件，用法類似 styled-components 但針對 React Native 優化。

## Token 和 Theme

設定 design token：

```typescript
// tamagui.config.ts
import { createTamagui } from "tamagui";
import { config } from "@tamagui/config/v3";

export const tamaguiConfig = createTamagui({
  ...config,
  tokens: {
    ...config.tokens,
    color: {
      brand: "#2563eb",
      brandDark: "#1d4ed8",
    },
    space: {
      sm: 8,
      md: 16,
      lg: 24,
    },
  },
  themes: {
    light: {
      background: "#ffffff",
      text: "#0f172a",
      border: "#e2e8f0",
    },
    dark: {
      background: "#0f172a",
      text: "#f8fafc",
      border: "#334155",
    },
  },
});
```

元件裡直接用 token name，不用寫 hex：

```tsx
import { View, Text, Button } from "tamagui";

function PostCard({ title, author }: Props) {
  return (
    <View
      backgroundColor="$background"
      borderColor="$border"
      borderWidth={1}
      borderRadius="$4"
      padding="$md"
      gap="$sm"
    >
      <Text fontSize="$5" fontWeight="bold" color="$text">
        {title}
      </Text>
      <Text fontSize="$3" color="$gray10">
        {author}
      </Text>
    </View>
  );
}
```

`$` 前綴的 prop 值對應 token，切換 theme 時 `$background`、`$text` 自動換值，元件本身不需要改。

## 自訂元件：styled()

```tsx
import { styled, Button } from "tamagui";

const PrimaryButton = styled(Button, {
  backgroundColor: "$brand",
  color: "white",
  borderRadius: "$3",
  pressStyle: {
    backgroundColor: "$brandDark",
    scale: 0.97,
  },
  variants: {
    size: {
      sm: { height: 36, paddingHorizontal: "$sm" },
      md: { height: 44, paddingHorizontal: "$md" },
      lg: { height: 52, paddingHorizontal: "$lg" },
    },
  } as const,
});

// 使用
<PrimaryButton size="md" onPress={handleSubmit}>
  送出
</PrimaryButton>
```

`pressStyle` 是 Tamagui 內建的互動狀態，不需要手動管理 `Animated.Value` 或 `Pressable` 的 callback。

## 為什麼選 Tamagui 而不是 NativeWind

NativeWind 把 TailwindCSS 的 utility class 帶進 React Native，讓你可以寫：

```tsx
<View className="flex-1 bg-white p-4 rounded-lg border border-gray-200">
  <Text className="text-xl font-bold text-gray-900">{title}</Text>
</View>
```

這個方式對 web 開發者很直覺，學習曲線低。NobodyClimb 的 web 端（Next.js）用 TailwindCSS，所以 NativeWind 看起來是自然的選擇。

但 NobodyClimb 最終選了 Tamagui，原因：

**Token 系統的完整性**：Tamagui 的 token 不只是顏色，間距、字型比例、陰影、動畫時間都可以 tokenize，theme 切換是一等公民。NativeWind 的 theme 支援依賴 CSS variables，在 React Native 上的實作比較曲折。

**元件庫**：Tamagui 本身附帶 `Sheet`、`Dialog`、`Popover`、`Select` 這些複雜的互動元件，這些在 mobile 上很常用，NativeWind 本身不包含，需要另外找套件。

**型別安全**：Tamagui 的 props 有完整的 TypeScript 型別，包含 token 的 autocomplete，`$background` 不存在的 token 會在編譯時期報錯。

**取捨**：Tamagui 的設定比 NativeWind 複雜，`tamagui.config.ts` 的設定量不小，`TamaguiProvider` 要包在 app 根層。如果專案規模小、不需要複雜的 theme 系統，NativeWind 的低設定成本可能更值得。

## 需要注意的地方

**編譯設定**：Tamagui 需要 Babel plugin（`babel-plugin-transform-inline-environment-variables` + Tamagui compiler），Expo 需要額外設定 metro 和 babel config。第一次設定比 NativeWind 麻煩。

**Web 支援**：Tamagui 支援 web target，但有些元件在 web 上的渲染方式和 React Native 不同，需要測試兩個平台。NobodyClimb 的 web 端用 Next.js + TailwindCSS，mobile 用 Tamagui，兩邊沒有共用 UI 元件，只共用資料邏輯。

**Bundle size**：Tamagui 的 tree-shaking 做得不錯，但如果只用基本的 `View`/`Text`，引入整個 Tamagui 仍然比 StyleSheet 重。

## 整體來說

Tamagui 適合需要完整 design system 的 mobile 專案：多個 theme、設計 token 的一致性、複雜的互動元件。如果專案只需要基本的樣式統一，NativeWind 的學習曲線更低。

NobodyClimb 的選擇合理——攀岩社群平台有亮/暗模式需求，UI 元件複雜度夠高（Sheet 展開攀岩路線詳情、Dialog 確認操作等），Tamagui 的設定成本在這個規模下是值得的。

## 參考資料

- [Tamagui 官方文件](https://tamagui.dev/)
- [Tamagui styled() API](https://tamagui.dev/docs/core/styled)
- [NativeWind 官方文件](https://www.nativewind.dev/)
- [Expo + Tamagui 設定指南](https://tamagui.dev/docs/guides/expo)
- [NobodyClimb 系統架構](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture)
