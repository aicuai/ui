# @aicu/ui — AI Coding Agent Guide

## プロジェクト概要

AICU Inc. の共通UIコンポーネントライブラリ。
Apple Liquid Glass デザイン言語にインスパイアされた、モダンなガラス質感のUIコンポーネントを提供する。

**npm パッケージ名**: `@aicu/ui`
**ライセンス**: MIT
**対象フレームワーク**: React 18+ / Next.js 14+ (App Router)
**スタイリング**: Tailwind CSS v3/v4 (peer dependency)

## ディレクトリ構成

```
@aicu/ui/
├── src/
│   ├── components/           # UIコンポーネント
│   │   └── LiquidGlassNav/
│   │       ├── index.tsx     # メインコンポーネント
│   │       ├── types.ts      # 型定義
│   │       └── utils.ts      # ヘルパー関数
│   ├── styles/
│   │   └── glass.css         # Liquid Glass 共通スタイル変数
│   └── index.ts              # パッケージエントリポイント
├── docs/                     # ドキュメント・デモ
│   └── demo.html             # スタンドアロンHTMLデモ
├── AGENTS.md                 # ← このファイル（AIエージェント向け）
├── CLAUDE.md                 # Claude Code 向け指示書
├── SKILLS.md                 # 実装パターン集
├── README.md                 # 人間向けドキュメント
├── package.json
├── tsconfig.json
├── tsup.config.ts            # バンドル設定
└── .github/
    └── workflows/
        └── publish.yml       # npm publish CI
```

## 技術スタック

| 技術 | 用途 |
|------|------|
| React 18+ | コンポーネント |
| TypeScript | 型安全 |
| Tailwind CSS | スタイリング (peer dep) |
| tsup | ESM/CJS バンドル |
| lucide-react | アイコン (peer dep) |

## デザイン原則

### Liquid Glass スタイル

すべてのコンポーネントは以下の視覚特性を共有する:

1. **半透明背景**: `rgba()` で背景色を透過させる
2. **Backdrop Blur**: `backdrop-filter: blur(16px) saturate(1.6)` でガラス質感
3. **微細なボーダー**: `1px solid rgba(255,255,255,0.08)` (dark) / `rgba(0,0,0,0.06)` (light)
4. **影の重層**: `box-shadow` で奥行き感（外側シャドウ + inset ハイライト）
5. **丸み**: `border-radius: 80px`（ピル型）または `16px`（カード型）
6. **アニメーション**: `cubic-bezier(0.4, 0, 0.2, 1)` ベースの滑らかな遷移

### CSS変数（Dark / Light）

```css
/* Dark theme (default) */
--glass-bg: rgba(22, 22, 23, 0.72);
--glass-border: rgba(255, 255, 255, 0.08);
--glass-highlight: rgba(255, 255, 255, 0.09);
--glass-blur: 16px;
--glass-saturate: 1.6;
--glass-radius-pill: 80px;
--glass-radius-card: 16px;
--glass-shadow: 0 8px 32px rgba(0,0,0,0.24), inset 0 0.5px 0 rgba(255,255,255,0.06);

/* Light theme */
--glass-bg: rgba(255, 255, 255, 0.72);
--glass-border: rgba(0, 0, 0, 0.06);
--glass-highlight: rgba(0, 0, 0, 0.06);
```

## コンポーネント実装ガイド

### 必須パターン

1. **"use client" ディレクティブ**: すべてのコンポーネントファイル先頭に記述
2. **Props型の明示的エクスポート**: `export type { LiquidGlassNavProps }` を必ず提供
3. **デフォルトエクスポート**: 各コンポーネントは named export + default export 両方
4. **テーマ対応**: `theme: "dark" | "light"` prop をすべてのコンポーネントで受け取る
5. **アクセシビリティ**: `aria-label`, `aria-current`, キーボードナビゲーション必須
6. **タッチターゲット**: 最小 44x44px を確保

### コンポーネント追加手順

```bash
# 1. ディレクトリ作成
mkdir src/components/NewComponent

# 2. ファイル作成
touch src/components/NewComponent/{index.tsx,types.ts}

# 3. エントリポイントにエクスポート追加
# src/index.ts に export を追加

# 4. ビルド確認
pnpm build

# 5. 型チェック
pnpm typecheck
```

### コミット規約

```
feat(nav): add LiquidGlassNav component
fix(nav): correct indicator animation on resize
docs: update README with usage examples
chore: update tsup config for tree-shaking
```

## 品質基準

- TypeScript strict mode エラーゼロ
- すべての props に JSDoc コメント
- bundle size: 個別コンポーネント < 5KB gzipped
- Lighthouse Accessibility スコア 100
- React StrictMode での警告ゼロ

## 利用サイト

| サイト | URL | 用途 |
|--------|-----|------|
| AICU メイン | aicu.ai | コーポレート |
| AICU Japan | aicu.jp | 日本語ポータル |
| ComfyUI サービス | c.aicu.jp | SaaS |
| コンテストプラットフォーム | (TBD) | イベント管理 |
