import { Fragment } from "react";

// Turns every mention of Magdala and One Step Closer in a piece of copy into a link
// to that organisation's own website. Add a name and address here to link another.
const SITES: Record<string, string> = {
  "One Step Closer": "https://www.onestepcloser.org/",
  Magdala: "https://www.magdala.org/",
};

const PATTERN = new RegExp(`(${Object.keys(SITES).join("|")})`, "g");

export default function Linked({ text }: { text: string }) {
  return (
    <>
      {text.split(PATTERN).map((part, i) =>
        SITES[part] ? (
          <a key={i} href={SITES[part]} target="_blank" rel="noopener noreferrer" className="ext-link">
            {part}
          </a>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}
