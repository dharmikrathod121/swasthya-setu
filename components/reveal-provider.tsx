"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Mirrors Swasthyasetuhtml/js/shared.js initScrollReveal().
// Observes every `.reveal:not(.visible)` (including dynamically added
// hospital cards) and adds `.visible` on intersect. Without this,
// `.reveal` elements stay at opacity:0 and pages look blank/broken.
export function RevealProvider() {
  const pathname = usePathname();

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    const observeAll = () => {
      document
        .querySelectorAll(".reveal:not(.visible)")
        .forEach((el) => io.observe(el));
    };

    observeAll();

    // Catch client-rendered lists (hospital results, etc.)
    const mo = new MutationObserver(observeAll);
    mo.observe(document.body, { childList: true, subtree: true });

    // Safety net: if IO unsupported, show everything
    if (!("IntersectionObserver" in window)) {
      document
        .querySelectorAll(".reveal:not(.visible)")
        .forEach((el) => el.classList.add("visible"));
    }

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);

  return null;
}
