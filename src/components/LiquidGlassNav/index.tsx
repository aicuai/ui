"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type FC,
  type CSSProperties,
  type KeyboardEvent,
  isValidElement,
} from "react";
import type { LiquidGlassNavProps } from "./types";

/**
 * LiquidGlassNav — Floating pill-shaped navigation with glass morphism.
 *
 * @example
 * ```tsx
 * import { LiquidGlassNav } from "@aicu/ui";
 * import { Calendar, Search, User } from "lucide-react";
 *
 * <LiquidGlassNav
 *   items={[
 *     { id: "events", label: "Events", icon: Calendar },
 *     { id: "search", label: "Search", icon: Search },
 *     { id: "profile", label: "Profile", icon: User },
 *   ]}
 *   theme="dark"
 *   position="bottom"
 *   onSelect={(id) => navigate(id)}
 * />
 * ```
 */
export const LiquidGlassNav: FC<LiquidGlassNavProps> = ({
  items,
  activeId,
  onSelect,
  position = "bottom",
  theme = "dark",
  showLabels = true,
  className = "",
  ...props
}) => {
  const [active, setActive] = useState(activeId ?? items[0]?.id);
  const [indicatorStyle, setIndicatorStyle] = useState<CSSProperties>({});
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (activeId !== undefined) setActive(activeId);
  }, [activeId]);

  const updateIndicator = useCallback(() => {
    if (!navRef.current) return;
    const el = navRef.current.querySelector(
      `[data-nav-id="${active}"]`
    ) as HTMLElement | null;
    if (!el) return;

    const navRect = navRef.current.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();

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

  useEffect(() => {
    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [updateIndicator]);

  const handleSelect = (id: string) => {
    setActive(id);
    onSelect?.(id);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    const navItems = navRef.current?.querySelectorAll("[data-nav-id]");
    if (!navItems) return;

    const ids = Array.from(navItems).map((el) =>
      el.getAttribute("data-nav-id")
    );
    const idx = ids.indexOf(active);
    const isH = position === "bottom";
    const nextKey = isH ? "ArrowRight" : "ArrowDown";
    const prevKey = isH ? "ArrowLeft" : "ArrowUp";

    let nextIdx = -1;
    if (e.key === nextKey) nextIdx = (idx + 1) % ids.length;
    else if (e.key === prevKey) nextIdx = (idx - 1 + ids.length) % ids.length;

    if (nextIdx >= 0) {
      e.preventDefault();
      const nextId = ids[nextIdx];
      if (nextId) {
        handleSelect(nextId);
        (navItems[nextIdx] as HTMLElement).focus();
      }
    }
  };

  const isBottom = position === "bottom";
  const isDark = theme === "dark";

  const glassBg = isDark
    ? "rgba(22,22,23,0.72)"
    : "rgba(255,255,255,0.72)";
  const glassBorder = isDark
    ? "rgba(255,255,255,0.08)"
    : "rgba(0,0,0,0.06)";
  const glassHighlight = isDark
    ? "rgba(255,255,255,0.09)"
    : "rgba(0,0,0,0.06)";

  const textColor = (isActive: boolean, isHover: boolean) => {
    if (isActive) return isDark ? "#ffffff" : "#1a1a1a";
    if (isHover) return isDark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.7)";
    return isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)";
  };

  const navStyle: CSSProperties = {
    position: "fixed",
    zIndex: 50,
    display: "flex",
    alignItems: "center",
    gap: 2,
    padding: 4,
    borderRadius: 80,
    backdropFilter: "blur(16px) saturate(1.6)",
    WebkitBackdropFilter: "blur(16px) saturate(1.6)",
    background: glassBg,
    border: `1px solid ${glassBorder}`,
    boxShadow:
      "0 8px 32px rgba(0,0,0,0.24), inset 0 0.5px 0 rgba(255,255,255,0.06)",
    transition: "all 0.3s ease-out",
    ...(isBottom
      ? { bottom: 20, left: "50%", transform: "translateX(-50%)", flexDirection: "row" as const }
      : { left: 16, top: "50%", transform: "translateY(-50%)", flexDirection: "column" as const }),
  };

  const indicatorBaseStyle: CSSProperties = {
    position: "absolute",
    borderRadius: 72,
    background: glassHighlight,
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    pointerEvents: "none",
    opacity: active ? 1 : 0,
    ...indicatorStyle,
  };

  return (
    <nav
      ref={navRef}
      role="navigation"
      aria-label="Main navigation"
      style={navStyle}
      className={className}
      onKeyDown={handleKeyDown}
      {...props}
    >
      <div style={indicatorBaseStyle} aria-hidden="true" />

      {items.map((item, index) => {
        const isActive = active === item.id;
        const [isHover, setIsHover] = useState(false);
        const Icon = item.icon;

        const renderIcon = () => {
          if (isValidElement(Icon)) return Icon;
          if (typeof Icon === "function") {
            const IconComponent = Icon as FC<{
              size?: number;
              strokeWidth?: number;
            }>;
            return (
              <IconComponent
                size={20}
                strokeWidth={isActive ? 2 : 1.6}
              />
            );
          }
          return null;
        };

        const btnStyle: CSSProperties = {
          position: "relative",
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          padding: isBottom ? "10px 16px" : "12px 12px",
          minWidth: 44,
          minHeight: 44,
          borderRadius: 72,
          border: "none",
          background: "none",
          cursor: "pointer",
          transition: "color 0.15s",
          color: textColor(isActive, isHover),
          outline: "none",
          WebkitTapHighlightColor: "transparent",
          userSelect: "none",
        };

        const labelStyle: CSSProperties = {
          fontSize: 13,
          fontWeight: 500,
          lineHeight: 1,
          letterSpacing: "-0.01em",
          whiteSpace: "nowrap",
          maxWidth: isActive ? 80 : 0,
          opacity: isActive ? 1 : 0,
          overflow: "hidden",
          transition: "max-width 0.25s ease, opacity 0.2s ease",
          paddingRight: isActive ? 2 : 0,
        };

        return (
          <button
            key={item.id}
            data-nav-id={item.id}
            role="tab"
            aria-selected={isActive}
            aria-label={item.label}
            tabIndex={isActive ? 0 : -1}
            onClick={() => handleSelect(item.id)}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            onFocus={() => setIsHover(true)}
            onBlur={() => setIsHover(false)}
            style={btnStyle}
          >
            {renderIcon()}
            {showLabels && isBottom && (
              <span style={labelStyle}>{item.label}</span>
            )}
          </button>
        );
      })}
    </nav>
  );
};

LiquidGlassNav.displayName = "LiquidGlassNav";
export default LiquidGlassNav;
