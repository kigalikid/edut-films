import { existsSync } from "node:fs";
import { join } from "node:path";

// Michael's portrait. Drop a photo at public/michael.jpg (or .webp / .png), taller than
// it is wide, and it appears here. Until then a marked, empty frame holds the place.
const FILES = ["michael.jpg", "michael.webp", "michael.png"];

export default function Portrait({ name }: { name: string }) {
  const file = FILES.find((f) => existsSync(join(process.cwd(), "public", f)));

  return (
    <div className="portrait relative aspect-[4/5] w-[132px] shrink-0 overflow-hidden rounded-[2px] bg-meleke sm:w-[168px]">
      {file ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={`/${file}`} alt={`Portrait of ${name}`} className="h-full w-full object-cover" style={{ objectPosition: "50% 30%" }} />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-ash" role="img" aria-label="Portrait to be added">
          {/* crop marks, like an empty frame on a contact sheet */}
          <span className="absolute left-2 top-2 h-3 w-3 border-l border-t border-ink/30" />
          <span className="absolute right-2 top-2 h-3 w-3 border-r border-t border-ink/30" />
          <span className="absolute bottom-2 left-2 h-3 w-3 border-b border-l border-ink/30" />
          <span className="absolute bottom-2 right-2 h-3 w-3 border-b border-r border-ink/30" />
          <svg viewBox="0 0 48 48" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden>
            <circle cx="24" cy="18" r="8" />
            <path d="M8 42c2-9 8.5-13 16-13s14 4 16 13" strokeLinecap="round" />
          </svg>
          <span className="font-mono text-[9px] uppercase tracking-[0.2em]">Portrait</span>
        </div>
      )}
    </div>
  );
}
