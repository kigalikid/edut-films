import { existsSync } from "node:fs";
import { join } from "node:path";

// Background film for the hero: Michael's drone footage of Magdala, Arbel and the lake.
//   public/hero.mp4     1600x900, for tablets and desktops
//   public/hero-sm.mp4  960x540, for phones (about half the download)
//   public/hero.jpg     first frame, shown the instant the page opens, before the film starts
// All silent. To replace the film, swap those three files; if they are missing the hero
// falls back to plain ink.
export default function HeroVideo() {
  const has = (f: string) => existsSync(join(process.cwd(), "public", f));
  const hasVideo = has("hero.mp4");

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      {hasVideo ? (
        <video
          className="h-full w-full object-cover"
          poster={has("hero.jpg") ? "/hero.jpg" : undefined}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          {has("hero-sm.mp4") && <source src="/hero-sm.mp4" type="video/mp4" media="(max-width: 700px)" />}
          <source src="/hero.mp4" type="video/mp4" />
        </video>
      ) : (
        <div className="h-full w-full bg-[radial-gradient(120%_90%_at_70%_20%,#3a2a22_0%,#1b1612_62%)]" />
      )}
      {/* Veil: the footage runs from bright noon sky to dusk, so the words need a steady
          ground. Darker on the left where the headline sits and along the bottom where
          the wall stands; the right side of the frame is left open for the film. */}
      <div className="hero-veil absolute inset-0" />
    </div>
  );
}
