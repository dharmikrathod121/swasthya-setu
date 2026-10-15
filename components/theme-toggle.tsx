"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);

  if (!mounted) {
    return (
      <button
        className="theme-switch"
        role="switch"
        aria-checked="false"
        aria-label="Toggle dark mode"
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      className="theme-switch"
      role="switch"
      aria-checked={isDark}
      aria-label="Toggle dark mode"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    />
  );
}
