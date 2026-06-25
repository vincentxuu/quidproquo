---
title: "Expo + React Native: What It's Actually Like to Ship One Codebase for iOS and Android"
date: 2026-03-27
type: guide
category: tech
tags: [expo, react-native, mobile, cross-platform]
lang: en
tldr: "Expo turns React Native development from 'environment setup hell' into a state where you can just start writing logic. Expo Router brings file-based routing that dramatically lowers the barrier for web developers making the switch. Both DaoDao and NobodyClimb use it to ship across iOS and Android."
description: "An introduction to cross-platform development with Expo + React Native: Expo Router, why it makes React Native far more approachable, and why DaoDao and NobodyClimb both chose it."
draft: false
---

🌏 [中文版](/posts/tech/2026-03-27-expo-react-native-cross-platform)

The idea behind React Native has always been compelling: one JavaScript codebase, compiled into native components on both iOS and Android — not a WebView wrapper, but real native UI. The problem has historically been the setup. Xcode, Android SDK, simulators, bridge layer version dependencies — just getting a hello world running could eat an entire afternoon.

Expo's primary job is to make that problem disappear. It's a framework and toolchain built on top of React Native that eliminates most of the configuration so you can start writing actual product logic right away.

Both DaoDao and NobodyClimb use Expo + React Native as their mobile stack, sharing types and utilities with their Next.js frontends inside a shared monorepo.

## What Expo Actually Does

Expo operates at several levels:

**Expo Go**: During development, you install one app on your phone, scan a QR code, and your code runs on a real device instantly — no build step required. This dramatically tightens the feedback loop; save a file, see the result on your phone.

**Expo SDK**: A curated collection of pre-built native modules — Camera, Location, Notifications, FileSystem, and many more — with a consistent API design that abstracts away iOS/Android differences so you don't have to handle them manually.

**EAS (Expo Application Services)**: Cloud build and publishing service. You can produce `.ipa` and `.apk` files without Xcode or Android Studio on your local machine, and there are dedicated tools for pushing to the App Store and Play Store.

**Expo Router**: File-based routing — same concept as the Next.js App Router.

## Expo Router: File-Based Routing

Expo Router is now Expo's recommended navigation solution, replacing the manual configuration required by older React Navigation setups:

```
app/
├── _layout.tsx      # Root layout (bottom tabs, global providers)
├── index.tsx        # Home screen, maps to /
├── (tabs)/
│   ├── _layout.tsx  # Tab navigator config
│   ├── feed.tsx     # /feed
│   └── profile.tsx  # /profile
└── posts/
    └── [id].tsx     # /posts/:id, dynamic route
```

Navigation doesn't require manual navigator calls — use the `Link` component or `router.push`:

```tsx
import { Link, router } from "expo-router";

// Declarative
<Link href="/posts/123">View Post</Link>

// Imperative
router.push({ pathname: "/posts/[id]", params: { id: post.id } });
```

For developers coming from Next.js, this pattern is immediately familiar — there's no new navigation mental model to internalize.

## A Basic Screen Example

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

State management works the same way as on the web. Both DaoDao's and NobodyClimb's mobile apps share Zustand stores and TanStack Query hooks from `packages/` — no need to write a separate data layer for mobile.

## Why Both DaoDao and NobodyClimb Chose It

**Shared logic**: `packages/shared`, `packages/api`, and `packages/schemas` in the monorepo are all usable by both web and mobile. Type definitions don't need to be written twice; neither does the API client. This is the primary benefit.

**Lower maintenance overhead**: Two platforms (iOS + Android) from one codebase means you don't need separate iOS and Android engineers. For a small team, this is a genuinely meaningful saving.

**Ecosystem maturity**: Since Expo SDK 52+, stability has improved noticeably. The New Architecture (JSI + Fabric) is now the default, and the performance issues tied to the old bridge have been largely resolved.

**Developer experience**: Expo Go + Fast Refresh keeps the development loop tight — you don't need to rebuild every time you tweak the UI.

## Things to Watch Out For

**Native modules**: If you need functionality that isn't in the Expo SDK — a specific Bluetooth protocol, deep camera control — you'll need to write a custom native module with `expo-modules-core`, or eject and manage native code yourself. The barrier here is higher than anything on the web.

**App size**: Apps built with Expo's managed workflow are larger than plain React Native apps because they include the full Expo runtime. If bundle size is a hard constraint, bare workflow may be necessary.

**iOS publishing**: Even with EAS remote builds, shipping to iOS still requires an Apple Developer account and certificate management. EAS simplifies this process significantly, but it doesn't eliminate it entirely.

**Web support has limits**: Expo Router does support a web target, but not all React Native components have web equivalents. You'll need `Platform.OS` conditionals or web-compatible package alternatives where coverage gaps exist.

## Overall

Expo is no longer "training wheels for React Native" — it's the default starting point for most new projects. The New Architecture has made performance a non-issue for the vast majority of use cases, Expo Router aligns mobile navigation with web development patterns, and EAS automates the release pipeline.

For a small team that needs both a web app and a mobile app, Expo + React Native living alongside Next.js in a monorepo is the most pragmatic choice available right now.

## References

- [Expo Official Docs](https://docs.expo.dev/)
- [Expo Router Docs](https://expo.github.io/router/docs)
- [React Native New Architecture](https://reactnative.dev/docs/the-new-architecture/landing-page)
- [EAS (Expo Application Services)](https://expo.dev/eas)
- [DaoDao Tech Architecture Overview](/posts/tech/deep-dive/2026-03-12-daodao-tech-architecture)
- [NobodyClimb System Architecture](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture)
