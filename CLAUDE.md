# CLAUDE.md — @aicujp/ui

## 絶対禁止事項

- `any` 型の使用禁止。必ず適切な型を定義する
- インラインスタイルの使用禁止（CSS変数 or Tailwindクラスを使用）
- `!important` の使用禁止
- `node_modules/` や `dist/` のコミット禁止
- peer dependency を dependencies に入れない

## 必須パターン

### コンポーネントファイル構造

```tsx
"use client";

import { type FC } from "react";
import type { ComponentNameProps } from "./types";

/**
 * ComponentName - 一行の説明
 *
 * @example
 * ```tsx
 * <ComponentName items={[...]} theme="dark" />
 * ```
 */
export const ComponentName: FC<ComponentNameProps> = ({
  prop1,
  prop2 = "default",
  ...props
}) => {
  // implementation
};

ComponentName.displayName = "ComponentName";
export default ComponentName;
```

### 型定義ファイル構造

```tsx
import type { ReactNode, ComponentPropsWithoutRef } from "react";
import type { LucideIcon } from "lucide-react";

export interface ComponentNameProps extends ComponentPropsWithoutRef<"div"> {
  /** prop の説明 */
  propName: string;
  /** オプショナルpropの説明 @default "value" */
  optionalProp?: string;
}
```

## ビルドコマンド

```bash
pnpm install          # 依存関係インストール
pnpm build            # tsup でバンドル → dist/
pnpm typecheck        # tsc --noEmit で型チェック
pnpm dev              # watch mode（開発中）
pnpm clean            # dist/ 削除
pnpm prepublishOnly   # build + typecheck（publish前に自動実行）
```

## バンドル出力

tsup が以下を生成する:

```
dist/
├── index.mjs          # ESM
├── index.js           # CJS
├── index.d.ts         # TypeScript 型定義
├── index.d.mts        # ESM 型定義
└── styles/
    └── glass.css      # CSS変数定義
```

## タスクチェックリスト

### Phase 1: LiquidGlassNav (MVP)

- [x] LiquidGlassNav コンポーネント実装
- [x] Dark/Light テーマ対応
- [x] Bottom Pill / Side Rail ポジション
- [x] アクティブインジケーターアニメーション
- [x] ラベル展開アニメーション（Bottom mode）
- [ ] リサイズ時のインジケーター再計算
- [ ] キーボードナビゲーション（矢印キー）
- [ ] Framer Motion オプション統合
- [ ] Storybook or デモサイト

### Phase 2: 追加コンポーネント（候補）

- [ ] LiquidGlassCard
- [ ] LiquidGlassModal
- [ ] LiquidGlassToast
- [ ] AicuHead (favicon/meta一括)
- [ ] AicuLogo

## トラブルシューティング

### tsup ビルドが失敗する

```bash
rm -rf dist node_modules/.cache
pnpm install
pnpm build
```

### Tailwind クラスが効かない

利用側の `tailwind.config` に以下を追加:

```js
content: [
  "./node_modules/@aicujp/ui/dist/**/*.{js,mjs}",
]
```

### "use client" エラー

Next.js App Router でのみ必要。それ以外の環境では無視される。
tsup の `banner` 設定で自動挿入済み。
