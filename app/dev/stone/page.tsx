import { notFound } from "next/navigation";
import StoneWallSource from "@/components/StoneWallSource";

// Development only. The stone wall is drawn here as live SVG with its lighting filters,
// then captured once into public/stone-wall.webp (see README note in StoneWall.tsx).
// The site itself only ever loads that image, because the live filters are slow to paint.
export default function StoneExport() {
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <div id="stone-source" style={{ width: 2600, height: 1040 }}>
      <StoneWallSource />
    </div>
  );
}
