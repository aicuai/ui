import type { ComponentPropsWithoutRef, FC, ReactNode } from "react";

/**
 * A single navigation item in LiquidGlassNav.
 */
export interface NavItem {
  /** Unique identifier for this nav item */
  id: string;
  /** Display label */
  label: string;
  /**
   * Icon component. Accepts lucide-react icons, custom FC with size prop,
   * or any ReactNode.
   */
  icon: FC<{ size?: number; strokeWidth?: number }> | ReactNode;
}

/**
 * Props for the LiquidGlassNav component.
 */
export interface LiquidGlassNavProps
  extends Omit<ComponentPropsWithoutRef<"nav">, "onSelect"> {
  /** Navigation items to display */
  items: NavItem[];
  /** Currently active item ID. Defaults to first item. */
  activeId?: string;
  /** Callback when a nav item is selected */
  onSelect?: (id: string) => void;
  /** Nav position. "bottom" = floating pill, "left" = side rail @default "bottom" */
  position?: "bottom" | "left";
  /** Color theme @default "dark" */
  theme?: "dark" | "light";
  /** Show text labels in bottom mode @default true */
  showLabels?: boolean;
}
