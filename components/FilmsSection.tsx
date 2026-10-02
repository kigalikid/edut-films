"use client";

import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import type { Film } from "@/lib/content";

const label = "font-mono text-[11px] uppercase tracking-[0.22em]";
const pad = (n: number) => String(n).padStart(2, "0");

// WebP stills are about half the weight of YouTube's JPEGs.
const still = (f: Film) =>
  `https://i.ytimg.com/vi_webp/${f.id}/${f.thumb === "sd" ? "sddefault" : "maxresdefault"}.webp`;

type Props = {
  eyebrow: string;
  title: string;
  body: string;
  films: Film[];
  wall: ReactNode;
};

export default function FilmsSection({ eyebrow, title, body, films, wall }: Props) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const drift = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState<string | null>(null);

  // Which card sits at the centre of the track
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let frame = 0;
    const measure = () => {
      const mid = el.scrollLeft + el.clientWidth / 2;
      let best = 0;
      let dist = Infinity;
      Array.from(el.children).forEach((c, i) => {
        const card = c as HTMLElement;
        const d = Math.abs(card.offsetLeft + card.offsetWidth / 2 - mid);
        if (d < dist) {
          dist = d;
          best = i;
        }
      });
      setActive(best);
      // leaving a film stops it
      setPlaying((p) => (p && p !== films[best]?.id ? null : p));
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [films]);

  // The wall drifts slower than the page, so the stones feel a step behind the frames
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const update = () => {
      const s = section.current;
      const d = drift.current;
      if (!s || !d) return;
      const r = s.getBoundingClientRect();
      const progress = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
      d.style.transform = `translate3d(0, ${(progress * 60).toFixed(1)}px, 0)`;
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const go = useCallback((i: number) => {
    const el = track.current;
    if (!el) return;
    const n = Math.max(0, Math.min(el.children.length - 1, i));
    const card = el.children[n] as HTMLElement;
    el.scrollTo({ left: card.offsetLeft - (el.clientWidth - card.offsetWidth) / 2, behavior: "smooth" });
  }, []);

  return (
    <section ref={section} id="films" className="relative scroll-mt-0 overflow-hidden">
      {/* open the connections early, so stills and the player start without a handshake */}
      <link rel="preconnect" href="https://i.ytimg.com" />
      <link rel="preconnect" href="https://www.youtube-nocookie.com" />
      <link rel="preconnect" href="https://www.youtube.com" />
      {/* The wall */}
      <div className="absolute inset-0" aria-hidden>
        <div ref={drift} className="absolute -inset-y-20 inset-x-0 will-change-transform">
          {/* walking along the wall: the stones slide a little with every film */}
          <div
            className="stone-walk absolute inset-y-0 -inset-x-[8%]"
            style={{ transform: `translate3d(${-active * 22}px, 0, 0)` }}
          >
            {wall}
          </div>
        </div>
        {/* staining, then a pale wash so the wall sits back behind the films */}
        <div className="stone-weather absolute inset-0" />
        <div className="absolute inset-0 bg-meleke/50" />
        {/* light falling into the street from above; the sides fall into shade */}
        <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_38%,rgba(255,250,240,0.5),rgba(255,250,240,0)_72%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(90,70,48,0.16),rgba(90,70,48,0)_26%,rgba(90,70,48,0)_74%,rgba(90,70,48,0.16))]" />
        {/* the wall rises out of the page and settles back into it */}
        <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-meleke via-meleke/85 to-meleke/0" />
        <div className="absolute inset-x-0 bottom-0 h-80 bg-gradient-to-t from-meleke via-meleke/85 to-meleke/0" />
      </div>

      <div className="relative py-20 lg:py-28">
        <div className="mx-auto max-w-[1240px] px-6 sm:px-8">
          <p className={`${label} text-ink/60`}>{eyebrow}</p>
          <div className="mt-5 flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
            <h2 className="font-display text-[44px] leading-[1.02] tracking-[-0.01em] sm:text-[64px]">{title}</h2>
            <p className="max-w-[26rem] pb-2 text-[16px] leading-relaxed text-ink/75">{body}</p>
          </div>
        </div>

        <div
          ref={track}
          className="no-scrollbar relative mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-[calc((100%-min(78vw,560px))/2)] pb-10 pt-2 sm:gap-6"
        >
          {films.map((f, i) => {
            const isActive = i === active;
            const isPlaying = playing === f.id;
            return (
              <article
                key={f.id}
                data-active={isActive}
                className="film-card group w-[min(78vw,560px)] shrink-0 snap-center"
              >
                <div className="film-frame relative aspect-video overflow-hidden rounded-[2px] bg-ink">
                  {isPlaying ? (
                    <iframe
                      className="absolute inset-0 h-full w-full"
                      src={`https://www.youtube-nocookie.com/embed/${f.id}?autoplay=1&rel=0`}
                      title={f.title}
                      allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                      allowFullScreen
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => (isActive ? setPlaying(f.id) : go(i))}
                      className="absolute inset-0 block h-full w-full cursor-pointer"
                      aria-label={isActive ? `Play ${f.title}` : `Show ${f.title}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={still(f)}
                        alt=""
                        loading="eager"
                        decoding="async"
                        fetchPriority={i < 3 ? "high" : "low"}
                        className="film-still h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-data-[active=true]:group-hover:scale-[1.03]"
                      />
                                            <span className="film-play absolute left-1/2 top-1/2 flex h-[60px] w-[60px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-ink/40 ring-1 ring-bone/80 transition-transform duration-300 group-hover:scale-105">
                        <svg viewBox="0 0 24 24" className="ml-0.5 h-5 w-5 fill-bone" aria-hidden>
                          <path d="M7 4.5v15l13-7.5z" />
                        </svg>
                      </span>
                    </button>
                  )}
                </div>

                <div className="film-meta mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                  <h3 className="font-display text-[20px] leading-tight sm:text-[23px]">{f.title}</h3>
                  <p className={`${label} shrink-0 text-ink/75`}>
                    {f.place} · {f.length}
                  </p>
                </div>
              </article>
            );
          })}
        </div>

        {/* Controls */}
        <div className="mx-auto flex max-w-[1240px] items-center gap-6 px-6 sm:px-8">
          <p className={`${label} tabular-nums text-ink/70`}>
            {pad(active + 1)} <span className="text-ink/35">/ {pad(films.length)}</span>
          </p>
          <div className="relative h-px flex-1 bg-ink/20">
            <span
              className="absolute left-0 top-[-0.5px] h-[2px] bg-ahmar transition-[width] duration-500 ease-out"
              style={{ width: `${((active + 1) / films.length) * 100}%` }}
            />
          </div>
          <div className="flex gap-2">
            {[-1, 1].map((dir) => (
              <button
                key={dir}
                type="button"
                onClick={() => go(active + dir)}
                disabled={dir < 0 ? active === 0 : active === films.length - 1}
                aria-label={dir < 0 ? "Previous film" : "Next film"}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-bone/85 ring-1 ring-ink/25 transition hover:bg-bone hover:ring-ink/50 disabled:opacity-35 disabled:hover:bg-bone/85"
              >
                <svg viewBox="0 0 24 24" className={`h-4 w-4 ${dir < 0 ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                  <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
