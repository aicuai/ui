# @aicu/ui

> Liquid Glass UI components for React — by [AICU Inc.](https://aicu.ai)

Apple Liquid Glass デザイン言語にインスパイアされた、ガラス質感のUIコンポーネントライブラリ。

## Install

```bash
npm install @aicu/ui
# or
pnpm add @aicu/ui
```

**Peer Dependencies:**

```bash
npm install react react-dom tailwindcss lucide-react
```

## Quick Start

```tsx
import { LiquidGlassNav } from "@aicu/ui";
import { Calendar, Search, User } from "lucide-react";

export default function App() {
  return (
    <LiquidGlassNav
      items={[
        { id: "events", label: "Events", icon: Calendar },
        { id: "search", label: "Search", icon: Search },
        { id: "profile", label: "Profile", icon: User },
      ]}
      theme="dark"
      position="bottom"
      onSelect={(id) => console.log(id)}
    />
  );
}
```

## Tailwind Config

Add `@aicu/ui` to your content paths:

```js
// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@aicu/ui/dist/**/*.{js,mjs}",
  ],
};
```

## Components

### `<LiquidGlassNav />`

Floating pill-shaped navigation bar with glass morphism.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `NavItem[]` | required | Navigation items |
| `activeId` | `string` | first item | Active item ID |
| `onSelect` | `(id: string) => void` | — | Selection callback |
| `position` | `"bottom" \| "left"` | `"bottom"` | Nav position |
| `theme` | `"dark" \| "light"` | `"dark"` | Color theme |
| `showLabels` | `boolean` | `true` | Show text labels (bottom only) |
| `className` | `string` | — | Additional CSS classes |

```ts
interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon | React.FC<{ size?: number }>;
}
```

## Design Tokens

The library uses CSS custom properties for theming:

```css
/* Dark (default) */
--glass-bg: rgba(22, 22, 23, 0.72);
--glass-border: rgba(255, 255, 255, 0.08);
--glass-highlight: rgba(255, 255, 255, 0.09);

/* Light */
--glass-bg: rgba(255, 255, 255, 0.72);
--glass-border: rgba(0, 0, 0, 0.06);
--glass-highlight: rgba(0, 0, 0, 0.06);
```

## License

MIT © [AICU Inc.](https://aicu.ai)

---

**GitHub**: [github.com/aicuai/ui](https://github.com/aicuai/ui)
