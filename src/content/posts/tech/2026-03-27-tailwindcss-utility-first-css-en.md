---
title: "TailwindCSS: Utility-First Is a CSS Management Strategy, Not Just a Style Preference"
date: 2026-03-27
type: guide
category: tech
tags: [tailwindcss, css, utility-first, frontend]
lang: en
tldr: "TailwindCSS's core value is solving CSS's global namespace pollution and dead code problems. Utility classes keep styles co-located with components, and unused classes are automatically purged at build time — production CSS bundles typically come in at just a few dozen KB. Both DaoDao and NobodyClimb use it for web styling."
description: "TailwindCSS's design philosophy, why utility-first is an architectural decision rather than a stylistic preference, and how to use it effectively in React ecosystems."
draft: false
---

🌏 [中文版](/posts/tech/2026-03-27-tailwindcss-utility-first-css)

CSS has a fundamental problem: its scope is global. Write `.button { color: blue }` and that rule affects every element with the `button` class. Many solutions have emerged over the years — BEM naming conventions, CSS Modules, CSS-in-JS — each attempting to answer the same question: how do you make CSS scoping manageable?

TailwindCSS takes a different path: instead of semantic class names, it uses utility classes that directly describe visual properties. Styles live alongside components, eliminating naming conflicts and the fear that changing one class will break something elsewhere.

DaoDao's `packages/ui`, its two Next.js apps, and NobodyClimb's Next.js web client all use TailwindCSS for styling.

## Core Concept

Utility-first means: instead of writing `.card { padding: 16px; border-radius: 8px; background: white }`, you apply pre-existing utility classes directly in your HTML/JSX:

```tsx
// Traditional CSS approach
<div className="card">
  <h2 className="card-title">Title</h2>
</div>

// Tailwind approach
<div className="p-4 rounded-lg bg-white shadow-sm border border-gray-200">
  <h2 className="text-xl font-bold text-gray-900">Title</h2>
</div>
```

The first reaction many developers have to Tailwind's style is "how is this different from inline styles?" The difference comes down to a few key points:

**Design system constraints**: Tailwind's spacing scale (`p-1` = 4px, `p-2` = 8px, `p-4` = 16px...), color palette, and font sizes are predefined. You choose from within the system, making it much harder to accidentally write `padding: 13px` and break visual consistency.

**Responsive and state variants**: Modifiers like `md:flex`, `hover:bg-blue-600`, and `dark:text-white` are applied directly to the class attribute — no need to write separate media queries or pseudo-classes:

```tsx
<button className="
  bg-blue-500 text-white px-4 py-2 rounded
  hover:bg-blue-600
  focus:outline-none focus:ring-2 focus:ring-blue-500
  dark:bg-blue-400
  md:px-6
">
  Submit
</button>
```

**Build-time purging**: Tailwind v3+ only outputs the classes you actually use. Production CSS typically lands between 5–20 KB, regardless of how many tokens your Tailwind config defines.

## Practical Usage Patterns

In React components, repeated class combinations are extracted into variables or functions:

```tsx
import { cn } from "@/lib/utils"; // wrapper around clsx + tailwind-merge

// Basic usage
function Card({ className, children }: CardProps) {
  return (
    <div className={cn("rounded-lg border bg-white p-4 shadow-sm", className)}>
      {children}
    </div>
  );
}

// Component with variants
function Badge({ variant = "default", children }: BadgeProps) {
  const variantClasses = {
    default: "bg-blue-100 text-blue-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-800",
  };

  return (
    <span className={cn("rounded-full px-2 py-1 text-xs font-medium", variantClasses[variant])}>
      {children}
    </span>
  );
}
```

The `cn` utility (typically `clsx` + `tailwind-merge` combined) solves two problems: conditional class composition, and class conflicts — when both `p-4` and `p-2` are present, merge ensures the last one wins:

```tsx
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## Configuration and Customization

`tailwind.config.js` (or Tailwind v4's CSS config) lets you extend or override the design system:

```javascript
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eff6ff",
          500: "#3b82f6",
          900: "#1e3a8a",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        xl: "12px",
        "2xl": "16px",
      },
    },
  },
};
```

After extending, custom tokens like `text-brand-500`, `font-sans`, and `rounded-2xl` become available throughout your project.

## What Changed in Tailwind v4

Tailwind v4 (released in 2025) moves configuration from JavaScript into CSS:

```css
/* app.css */
@import "tailwindcss";

@theme {
  --color-brand: #3b82f6;
  --font-sans: "Inter", sans-serif;
}
```

No more `tailwind.config.js` — configuration lives in your CSS file, which aligns much more closely with native CSS design principles. The latest version of shadcn/ui has also migrated to v4.

## Things to Watch Out For

**Class ordering**: `hover:bg-blue-500 bg-blue-600` and `bg-blue-600 hover:bg-blue-500` produce identical results in Tailwind's output. But if you have both `p-4` and `p-2` under different conditions without `tailwind-merge`, which one takes effect depends on CSS class order in the stylesheet, not the order in your JSX.

**Linter class sorting**: When class lists grow long, inconsistent ordering makes code hard to read. `prettier-plugin-tailwindcss` automates sorting so semantically related classes always appear in a predictable position.

**Lack of semantic class names**: Tailwind class names are visual descriptions (`text-blue-500`), not semantic ones (`text-primary`). If the design system's primary color changes, you'll need to find and replace every `text-blue-500` across the codebase — unless you wrap values in CSS custom properties, which is exactly what shadcn/ui does.

**HTML readability**: Components with ten or more classes are the norm, which can be disorienting for developers reading the code for the first time. The solution is extracting related classes into components rather than piling all styles onto a single JSX element.

## The Bottom Line

Criticism of TailwindCSS tends to focus on "too many classes, too ugly" — but this is a secondary concern. The primary problems CSS has always had — global naming conflicts and dead code — Tailwind solves both.

In the React ecosystem, Tailwind pairs naturally with component-based thinking: each component owns its classes, there are no global conflicts, unused styles are tree-shaken at build time, and design system constraints keep visual consistency in check.

If you're still using traditional CSS classes in a React project, it's worth seriously considering a migration.

## References

- [TailwindCSS Official Docs](https://tailwindcss.com/docs)
- [TailwindCSS v4 Upgrade Guide](https://tailwindcss.com/docs/upgrade-guide)
- [tailwind-merge](https://github.com/dcastil/tailwind-merge)
- [clsx](https://github.com/lukeed/clsx)
- [prettier-plugin-tailwindcss](https://github.com/tailwindlabs/prettier-plugin-tailwindcss)
- [DaoDao Tech Architecture Overview](/posts/tech/deep-dive/2026-03-12-daodao-tech-architecture)
- [NobodyClimb System Architecture](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture)
