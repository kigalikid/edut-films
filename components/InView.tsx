"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";

// Marks its children as "in" the first time the block scrolls into view.
// The reveal itself is CSS (see `.reveal` in globals.css).
export default function InView({ className = "", children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      // Fire once the block's top edge is a fifth of the way up the screen. (A "35% visible"
      // rule never fires for a block taller than the screen, which is every block on a phone.)
      { threshold: 0, rootMargin: "0px 0px -20% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} data-in={seen} className={`reveal ${className}`}>
      {children}
    </div>
  );
}
