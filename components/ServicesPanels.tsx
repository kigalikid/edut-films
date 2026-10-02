"use client";

import { type CSSProperties, useEffect, useState } from "react";

type Service = {
  n: string;
  hebrew: string;
  translit: string;
  gloss: string;
  title: string;
  body: string;
  still: string;
};

const label = "font-mono text-[11px] uppercase tracking-[0.22em]";
const HOLD_MS = 5200; // how long each panel stays open while the section runs itself

const letters = (word: string) => word.match(/\p{L}\p{M}*/gu) ?? [word];

export default function ServicesPanels({ services }: { services: readonly Service[] }) {
  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false);
  const [moving, setMoving] = useState(false);

  useEffect(() => {
    // no timer for people who have asked for less motion
    const ok = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const id = window.setTimeout(() => setMoving(ok), 0);
    return () => window.clearTimeout(id);
  }, []);

  const running = moving && !held;

  useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(() => setActive((a) => (a + 1) % services.length), HOLD_MS);
    return () => window.clearTimeout(id);
  }, [running, active, services.length]);

  return (
    <section id="services" className="scroll-mt-8">
      <div className="mx-auto max-w-[1240px] px-6 py-10 sm:px-8 lg:py-12">
        <p className={`${label} mb-4 text-ash`}>What we film</p>

        <div
          className="flex flex-col border-y border-ink/15 md:h-[224px] md:flex-row"
          style={{ "--svc-ms": `${HOLD_MS}ms` } as CSSProperties}
          onMouseEnter={() => setHeld(true)}
          onMouseLeave={() => setHeld(false)}
          onFocus={() => setHeld(true)}
          onBlur={() => setHeld(false)}
        >
          {services.map((s, i) => {
            const on = i === active;
            return (
              <button
                key={s.n}
                type="button"
                aria-expanded={on}
                data-on={on}
                data-running={running}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                className={`svc-panel relative min-w-0 cursor-pointer overflow-hidden text-left ${
                  i > 0 ? "border-t border-ink/15 md:border-l md:border-t-0" : ""
                }`}
              >
                {/* the picture, and the pale veil that keeps the words readable over it */}
                <span
                  className="svc-still absolute inset-0 hidden bg-cover bg-center md:block"
                  style={{ backgroundImage: `url(https://i.ytimg.com/vi_webp/${s.still}/maxresdefault.webp)` }}
                  aria-hidden
                />
                <span className="svc-veil absolute inset-0 hidden md:block" aria-hidden />
                <span className="svc-timer absolute inset-x-0 top-0 h-[2px] bg-ahmar" aria-hidden />

                <span className="relative flex h-full flex-col justify-between gap-3 p-5 md:w-[270px] md:gap-0 md:p-6">
                  <span className={`${label} svc-dim text-ink/70`}>
                    {s.n} <span className="text-ink/30">—</span> {s.translit} · {s.gloss}
                  </span>
                  <span className="flex items-end justify-between gap-4 md:block">
                    <span lang="he" dir="rtl" className="svc-word block text-left font-hebrew text-[52px] leading-[0.95] md:text-[76px]" aria-hidden>
                      {letters(s.hebrew).map((ch, k) => (
                        // keyed on `on` so the letters are set down again each time the panel opens
                        <span key={`${on}-${k}`} style={{ "--i": k } as CSSProperties}>
                          {ch}
                        </span>
                      ))}
                    </span>
                    <span className="svc-dim block font-display text-[22px] leading-tight md:mt-3 md:text-[24px]">{s.title}</span>
                  </span>

                  {/* phones: the description folds open here */}
                  <span className="svc-fold md:hidden">
                    <span className="block text-[15.5px] leading-relaxed text-ink/80">{s.body}</span>
                  </span>
                </span>

                {/* wider screens: the description stands beside the word */}
                <span className="svc-body absolute left-[290px] top-1/2 hidden w-[290px] -translate-y-1/2 text-[15.5px] leading-relaxed text-ink/85 md:block">
                  {s.body}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
