"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  return (
    <button
      className="theme-switch"
      role="switch"
      aria-checked={theme === "dark"}
      aria-label="Toggle dark mode"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    />
  );
}
