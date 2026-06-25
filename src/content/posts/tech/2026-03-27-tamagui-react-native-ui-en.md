---
title: "Tamagui: A React Native UI Framework — Why NobodyClimb Chose It Over NativeWind"
date: 2026-03-27
type: guide
category: tech
tags: [tamagui, react-native, ui, styling]
lang: en
tldr: "Tamagui is a UI framework built for React Native with a complete design token system, theme support, and compile-time optimization that moves style computation to build time. NobodyClimb chose it over NativeWind primarily because its cross-platform token system is more robust."
description: "An introduction to the Tamagui UI framework: design tokens, theming, cross-platform styling, and why NobodyClimb chose Tamagui over NativeWind — including the trade-offs involved."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-03-27-tamagui-react-native-ui)

React Native's styling system differs significantly from web CSS — there's no cascade, no `em`/`rem`, flexbox is the default layout, and font sizes need to be tested separately on each platform. This makes "bringing web UI libraries into React Native" harder than it looks.

NobodyClimb's mobile app (Expo 54 + React Native 0.81) uses **Tamagui** as its UI framework. This post explains what Tamagui is, its design philosophy, and why we chose it over NativeWind.

## What Is Tamagui

Tamagui is a UI framework designed for React Native (including web targets), built around three core ideas:

1. **Design Token System**: Colors, spacing, typography, and border radii are managed through tokens — no magic numbers scattered across components
2. **Theme Support**: Light/dark mode switching with token values that automatically update per theme
3. **Compile-Time Optimization**: Style computation happens at build time, reducing runtime work and delivering better performance than pure runtime styling

Tamagui ships with its own component library (`Button`, `Input`, `Sheet`, `Dialog`, etc.) and also provides a `styled()` API for building custom components — similar in spirit to styled-components, but optimized for React Native.

## Tokens and Themes

Defining design tokens:

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

Inside components, you reference token names directly — no hex values needed:

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

Props prefixed with `$` map to tokens. When the theme switches, `$background` and `$text` update automatically — no changes needed in the component itself.

## Custom Components: styled()

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

// Usage
<PrimaryButton size="md" onPress={handleSubmit}>
  Submit
</PrimaryButton>
```

`pressStyle` is a built-in interaction state in Tamagui — no need to manually manage `Animated.Value` or `Pressable` callbacks.

## Why Tamagui Over NativeWind

NativeWind brings TailwindCSS utility classes into React Native, letting you write:

```tsx
<View className="flex-1 bg-white p-4 rounded-lg border border-gray-200">
  <Text className="text-xl font-bold text-gray-900">{title}</Text>
</View>
```

This approach feels intuitive to web developers and has a low learning curve. NobodyClimb's web client (Next.js) already uses TailwindCSS, so NativeWind seemed like the natural fit.

But NobodyClimb ultimately chose Tamagui, for these reasons:

**Token system completeness**: Tamagui's tokens go beyond color — spacing scales, type scales, shadows, and animation durations can all be tokenized. Theme switching is a first-class feature. NativeWind's theme support relies on CSS variables, which requires a more convoluted implementation on React Native.

**Component library**: Tamagui ships complex interactive components like `Sheet`, `Dialog`, `Popover`, and `Select` out of the box. These are commonly needed in mobile apps. NativeWind doesn't include any, so you'd need to source them separately.

**Type safety**: Tamagui props have full TypeScript types, including token autocomplete. Referencing a non-existent token like `$background` will surface a compile-time error.

**Trade-offs**: Tamagui's setup is more involved than NativeWind's. The `tamagui.config.ts` configuration is substantial, and `TamaguiProvider` must wrap the app root. For small projects that don't need a complex theme system, NativeWind's minimal configuration overhead may be the better call.

## Things to Watch Out For

**Build configuration**: Tamagui requires a Babel plugin (`babel-plugin-transform-inline-environment-variables` + the Tamagui compiler). With Expo, you'll need extra configuration for both Metro and Babel. The initial setup is more involved than NativeWind.

**Web support**: Tamagui supports web targets, but some components render differently on web versus React Native, so you'll need to test both platforms. NobodyClimb's web client uses Next.js + TailwindCSS while mobile uses Tamagui — the two sides share no UI components, only data logic.

**Bundle size**: Tamagui's tree-shaking is solid, but if you're only using basic `View`/`Text` primitives, pulling in Tamagui still adds more weight than using `StyleSheet` directly.

## Overall

Tamagui is a strong fit for mobile projects that need a complete design system: multiple themes, consistent design tokens, and complex interactive components. If a project only needs basic style consistency, NativeWind has a gentler learning curve.

NobodyClimb's choice makes sense — a climbing community platform needs light/dark mode, and the UI complexity is high enough (a Sheet for expanding route details, Dialogs for confirmations, etc.) that Tamagui's setup cost is worth it at this scale.

## References

- [Tamagui Official Docs](https://tamagui.dev/)
- [Tamagui styled() API](https://tamagui.dev/docs/core/styled)
- [NativeWind Official Docs](https://www.nativewind.dev/)
- [Expo + Tamagui Setup Guide](https://tamagui.dev/docs/guides/expo)
- [NobodyClimb System Architecture](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture)
