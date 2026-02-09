# SKILLS.md — @aicujp/ui 実装パターン集

## 1. Liquid Glass 基本パターン

### ガラス質感の CSS

```css
.liquid-glass {
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
  border: 1px solid var(--glass-border);
  box-shadow: var(--glass-shadow);
  border-radius: var(--glass-radius-pill);
}
```

### Tailwind での表現

```tsx
className={`
  bg-[rgba(22,22,23,0.72)]
  backdrop-blur-[16px] backdrop-saturate-[1.6]
  border border-[rgba(255,255,255,0.08)]
  shadow-[0_8px_32px_rgba(0,0,0,0.24),inset_0_0.5px_0_rgba(255,255,255,0.06)]
  rounded-[80px]
`}
```

### テーマ切り替えパターン

```tsx
const glassClasses = theme === "dark"
  ? "bg-[rgba(22,22,23,0.72)] border-[rgba(255,255,255,0.08)]"
  : "bg-[rgba(255,255,255,0.72)] border-[rgba(0,0,0,0.06)]";
```

## 2. アクティブインジケーター（スライドアニメーション）

要素の位置を `getBoundingClientRect()` で取得し、`position: absolute` の要素をスライドさせる。

```tsx
const updateIndicator = useCallback(() => {
  if (!navRef.current) return;
  const activeEl = navRef.current.querySelector(`[data-nav-id="${active}"]`);
  if (!activeEl) return;

  const navRect = navRef.current.getBoundingClientRect();
  const elRect = activeEl.getBoundingClientRect();

  if (position === "bottom") {
    setIndicatorStyle({
      left: elRect.left - navRect.left,
      width: elRect.width,
      top: 0,
      height: "100%",
    });
  } else {
    setIndicatorStyle({
      top: elRect.top - navRect.top,
      height: elRect.height,
      left: 0,
      width: "100%",
    });
  }
}, [active, position]);

// リサイズ追従
useEffect(() => {
  updateIndicator();
  window.addEventListener("resize", updateIndicator);
  return () => window.removeEventListener("resize", updateIndicator);
}, [updateIndicator]);
```

### CSS トランジション

```css
.nav-indicator {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

## 3. ラベル展開アニメーション

アクティブなアイテムのラベルを `max-width` アニメーションで展開する。

```tsx
<span
  className={`
    text-[13px] font-medium leading-none
    transition-all duration-250
    ${isActive ? "max-w-[80px] opacity-100" : "max-w-0 opacity-0 overflow-hidden"}
  `}
>
  {label}
</span>
```

**ポイント**: `width` アニメーションは GPU 非対応だが、`max-width` なら
`overflow: hidden` と組み合わせて擬似的に実現可能。

## 4. レスポンシブ切り替え（Bottom ↔ Side）

```tsx
// Props で制御
<LiquidGlassNav position="bottom" /> // モバイル
<LiquidGlassNav position="left" />   // デスクトップ

// or: 自動切り替え
const isMobile = useMediaQuery("(max-width: 640px)");
<LiquidGlassNav position={isMobile ? "bottom" : "left"} />
```

### useMediaQuery フック

```tsx
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);

  return matches;
}
```

## 5. アクセシビリティパターン

### キーボードナビゲーション

```tsx
const handleKeyDown = (e: KeyboardEvent) => {
  const items = navRef.current?.querySelectorAll("[data-nav-id]");
  if (!items) return;
  const currentIndex = Array.from(items).findIndex(
    (el) => el.getAttribute("data-nav-id") === active
  );

  const isHorizontal = position === "bottom";
  const nextKey = isHorizontal ? "ArrowRight" : "ArrowDown";
  const prevKey = isHorizontal ? "ArrowLeft" : "ArrowUp";

  if (e.key === nextKey) {
    const next = (currentIndex + 1) % items.length;
    setActive(items[next].getAttribute("data-nav-id"));
    (items[next] as HTMLElement).focus();
  } else if (e.key === prevKey) {
    const prev = (currentIndex - 1 + items.length) % items.length;
    setActive(items[prev].getAttribute("data-nav-id"));
    (items[prev] as HTMLElement).focus();
  }
};
```

### ARIA 属性

```tsx
<nav role="navigation" aria-label="Main navigation">
  <button
    role="tab"
    aria-selected={isActive}
    aria-label={item.label}
    tabIndex={isActive ? 0 : -1}
  />
</nav>
```

## 6. tsup バンドル設定

```ts
// tsup.config.ts
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  splitting: true,
  treeshake: true,
  clean: true,
  external: ["react", "react-dom", "lucide-react"],
  banner: {
    js: '"use client";',
  },
});
```

## 7. npm パッケージとしての peer dependency 設定

```json
{
  "peerDependencies": {
    "react": ">=18.0.0",
    "react-dom": ">=18.0.0",
    "tailwindcss": ">=3.0.0"
  },
  "peerDependenciesMeta": {
    "lucide-react": {
      "optional": true
    }
  }
}
```

利用者が `lucide-react` を使わない場合、アイコンを `ReactNode` として直接渡せるようにする:

```tsx
interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon | FC<{ size?: number }> | ReactNode;
}
```
