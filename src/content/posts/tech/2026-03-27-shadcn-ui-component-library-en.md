---
title: "shadcn/ui: Not a Package — It's Copy-Pasted Component Source Code"
date: 2026-03-27
type: guide
category: tech
tags: [shadcn-ui, tailwindcss, react, ui]
lang: en
tldr: "shadcn/ui is not an npm package — it copies component source code directly into your project, giving you full ownership. DaoDao uses it to build packages/ui, a shared component library used across three Next.js apps."
description: "An introduction to the design philosophy behind shadcn/ui: the copy-paste model instead of npm dependencies, Radix UI as the accessible foundation, TailwindCSS for styling, and how DaoDao uses it to build a shared component library in a monorepo."
draft: false
---

🌏 [中文版](/posts/tech/2026-03-27-shadcn-ui-component-library)

The typical UI library model works like this: install an npm package, import components, customize through props, and work around anything the package doesn't support — or wait for the maintainer to add it. Your flexibility ceiling is defined by the package's API.

shadcn/ui takes a different approach. It's not a package — it's a CLI tool that copies component source code directly into your project. From that point on, the code is yours. You can modify it directly, without going through a prop API, without being tied to package versions.

DaoDao's `packages/ui` is built on exactly this model — shadcn/ui components are copied in, modified as needed, and shared across three apps (`website`, `product`, and `mobile` excluded).

## What's Under the Hood

shadcn/ui components are built on two foundations:

**Radix UI**: handles accessible behavior logic. Focus trapping in dialogs, keyboard navigation in dropdowns, tooltip display logic — all of this is handled by Radix's headless components, which carry no styles of their own.

**TailwindCSS**: provides all visual styling. Every component's appearance is described entirely through Tailwind utility classes.

shadcn/ui's job is to combine these two into ready-to-use components, using `class-variance-authority` (CVA) to manage component variants:

```tsx
// components/ui/button.tsx (source code copied into your project)
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export function Button({ variant, size, className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
```

This code lives in your project. You can add variants, change classes, or extend the props — no forking, no overriding.

## Adding Components

```bash
npx shadcn@latest add button
npx shadcn@latest add dialog
npx shadcn@latest add form
```

Each command copies the corresponding component's source code into `components/ui/` (or whichever directory you've configured). After that, these files are just regular TypeScript files — no different from code you wrote yourself.

## Using shadcn/ui in a Monorepo: DaoDao's packages/ui

DaoDao's monorepo structure:

```
packages/
└── ui/
    ├── src/
    │   └── components/
    │       ├── button.tsx
    │       ├── dialog.tsx
    │       ├── form.tsx
    │       └── ...
    └── package.json
```

`packages/ui` is a standalone workspace package. shadcn/ui components are copied here, and individual apps reference it via workspace dependencies:

```json
// apps/product/package.json
{
  "dependencies": {
    "@daodao/ui": "workspace:*"
  }
}
```

```tsx
// apps/product/src/components/SomeFeature.tsx
import { Button } from "@daodao/ui";
```

The benefit: `website` and `product` share a visually consistent UI. Update a Button's style once, and both apps reflect the change.

Components in `packages/ui` can also be extended into domain-specific components:

```tsx
// packages/ui/src/components/practice-card.tsx
// A domain-specific component, but still placed in packages/ui to be shared across apps
import { Card, Badge, Button } from "./";

export function PracticeCard({ practice }: { practice: Practice }) {
  return (
    <Card>
      <Badge variant={practice.isActive ? "default" : "secondary"}>
        {practice.status}
      </Badge>
      <h3>{practice.title}</h3>
      <Button variant="outline">View Progress</Button>
    </Card>
  );
}
```

## The CSS Variables Design

shadcn/ui's color system uses CSS variables instead of direct Tailwind color tokens, which makes theme switching much simpler:

```css
/* globals.css */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 210 40% 98%;
  --primary-foreground: 222.2 47.4% 11.2%;
}
```

Tailwind config references these variables:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        primary: "hsl(var(--primary))",
      },
    },
  },
};
```

Toggling between light and dark mode is as simple as switching the `.dark` class on the root element — no changes to the Tailwind config needed.

## Things to Watch Out For

**No automatic updates**: Once components are copied in, upstream changes to shadcn/ui won't sync automatically. If shadcn fixes a bug in a component, you'll need to manually compare or re-run the `add` command to overwrite your copy. This is the cost of the copy-paste model.

**Tailwind version dependency**: Starting with shadcn/ui v2, the library is moving toward Tailwind v4, and the two versions have meaningfully different configuration approaches (CSS-first config vs. JS config). New projects should follow the latest shadcn version, but existing projects should plan their upgrade carefully.

**Not great for data-heavy components**: shadcn/ui's versions of Table and DataGrid are fairly basic. If you need sorting, virtual scrolling, or complex filtering, you'll still need a dedicated library like TanStack Table.

## Overall

shadcn/ui's copy-paste model seems counterintuitive at first, but it addresses a genuine pain point: the customization ceiling of UI libraries. When you need something the props API doesn't expose, you're stuck choosing between a hacky workaround or forking the entire package — neither is pleasant.

Bringing the source code into your project eliminates that pain. The trade-off is that you're now responsible for maintaining those files, including tracking upstream bug fixes. For most projects, that's a trade worth making.

## References

- [shadcn/ui Official Docs](https://ui.shadcn.com/)
- [Radix UI Official Docs](https://www.radix-ui.com/)
- [class-variance-authority](https://cva.style/docs)
- [Tailwind CSS Official Docs](https://tailwindcss.com/docs)
- [DaoDao Tech Architecture Overview](/posts/tech/deep-dive/2026-03-12-daodao-tech-architecture)
