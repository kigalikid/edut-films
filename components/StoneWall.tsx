// The wall of worn Jerusalem limestone behind the films.
//
// It is a single image (public/stone-wall.webp), not live SVG. The stones are drawn in
// StoneWallSource.tsx with lighting and displacement filters, which look right but take the
// browser a long time to paint and repaint. So they are captured once and served as a picture.
// To change the stones: edit StoneWallSource.tsx, open /dev/stone on the dev server, and
// re-capture (the snippet is in the project notes); the image is then replaced.
export default function StoneWall() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/stone-wall.webp"
      alt=""
      aria-hidden
      decoding="async"
      className="h-full w-full object-cover"
      draggable={false}
    />
  );
}
