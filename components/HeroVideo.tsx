import { existsSync } from "node:fs";
import { join } from "node:path";

// Background film for the hero. Drop the file at public/hero.mp4 (and an optional
// still at public/hero.jpg, shown while it loads). Until then the hero sits on plain ink.
export default function HeroVideo() {
  const pub = join(process.cwd(), "public");
  const hasVideo = existsSync(join(pub, "hero.mp4"));
  const hasPoster = existsSync(join(pub, "hero.jpg"));

  return (
    <div className="absolute inset-0" aria-hidden>
      {hasVideo ? (
        <video
          className="h-full w-full object-cover"
          src="/hero.mp4"
          poster={hasPoster ? "/hero.jpg" : undefined}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      ) : (
        <div className="h-full w-full bg-[radial-gradient(120%_90%_at_70%_20%,#3a2a22_0%,#1b1612_62%)]" />
      )}
      {/* Veil: keeps the headline readable over any footage */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-ink/30" />
    </div>
  );
}
