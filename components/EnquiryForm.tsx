"use client";

import { type FormEvent, useState } from "react";

const label = "font-mono text-[11px] uppercase tracking-[0.22em]";

type Status = "idle" | "sending" | "sent" | "mailed" | "error";

const FAILED = "That did not go through. Please try again.";

// Is Netlify Forms switched on for this site? When it is, Netlify rewrites the form in
// public/__forms.html and removes its `data-netlify` marker. If the marker is still there,
// posting to it would be accepted by nobody.
async function netlifyFormsLive() {
  try {
    const res = await fetch("/__forms.html", { cache: "no-store" });
    return res.ok && !(await res.text()).includes("data-netlify");
  } catch {
    return false;
  }
}

// The enquiry as an email the visitor sends from their own mail app.
function mailtoFor(to: string, f: Record<string, string>) {
  const lines = [
    `Name: ${f.name}`,
    f.group && `Church or group: ${f.group}`,
    f.size && `Group size: about ${f.size}`,
    f.dates && `In the Holy Land: ${f.dates}`,
    `Reply to: ${f.email}`,
  ].filter(Boolean);
  const subject = `Edut Films enquiry from ${f.name}${f.group ? ` (${f.group})` : ""}`;
  const body = `Hello Michael,\n\n${lines.join("\n")}\n`;
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

// The enquiry is written as one sentence with blanks, so sending it feels like
// finishing a note to Michael rather than filling in a form.
//
// Delivery, in order of preference:
//   1. Netlify Forms, if it is switched on for the site (silent; Netlify emails Michael).
//   2. Otherwise the visitor's own email app opens with the note addressed to `to`.
// In local development it is saved to data/enquiries.jsonl instead.
export default function EnquiryForm({ to }: { to: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [mailto, setMailto] = useState("");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const raw = Object.fromEntries(new FormData(e.currentTarget).entries());
    const f = Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, String(v).trim()]));
    setStatus("sending");
    setError("");
    setName(f.name.split(" ")[0]);

    // honeypot: a real visitor never fills this in
    if (f.website) return setStatus("sent");

    try {
      if (process.env.NODE_ENV !== "production") {
        const res = await fetch("/api/enquiry", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(f),
        });
        const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
        if (!res.ok || !json.ok) throw new Error(json.error || FAILED);
        return setStatus("sent");
      }

      if (await netlifyFormsLive()) {
        const res = await fetch("/__forms.html", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({ "form-name": "enquiry", ...f }).toString(),
        });
        if (res.ok) return setStatus("sent");
      }

      if (!to) throw new Error(FAILED);
      const url = mailtoFor(to, f);
      setMailto(url);
      setStatus("mailed");
      window.location.href = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : FAILED);
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div role="status" className="enquiry-sent" style={{ minHeight: 232 }}>
        <p className="font-display text-[30px] leading-[1.2] sm:text-[36px]">Thank you{name ? `, ${name}` : ""}.</p>
        <p className="mt-3 max-w-[30rem] text-[17px] leading-relaxed text-bone/75">
          Your note is on its way to Michael. He will write back to the address you gave.
        </p>
      </div>
    );
  }

  if (status === "mailed") {
    return (
      <div role="status" className="enquiry-sent" style={{ minHeight: 232 }}>
        <p className="font-display text-[30px] leading-[1.2] sm:text-[36px]">One more step{name ? `, ${name}` : ""}.</p>
        <p className="mt-3 max-w-[30rem] text-[17px] leading-relaxed text-bone/75">
          Your email has opened with your note to Michael already written. Press send there and it is on its way.
        </p>
        <p className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-[15px]">
          <a href={mailto} className="rounded-full bg-bone px-6 py-3 font-medium text-ink transition-colors hover:bg-white">
            Open the email again
          </a>
          <span className="text-bone/60">
            or write to{" "}
            <a href={`mailto:${to}`} className="text-bone/90 underline decoration-bone/35 underline-offset-[5px] hover:decoration-bone">
              {to}
            </a>
          </span>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate={false}>
      <p className="enquiry-line font-display text-[23px] leading-[2] text-bone/80 sm:text-[27px] sm:leading-[1.95]">
        I&rsquo;m{" "}
        <input name="name" required autoComplete="name" placeholder="your name" aria-label="Your name" style={{ width: "9.5ch" }} />, with{" "}
        <input name="group" autoComplete="organization" placeholder="church or group" aria-label="Church or group" style={{ width: "13ch" }} />. We are about{" "}
        <input name="size" inputMode="numeric" placeholder="how many" aria-label="How many people" style={{ width: "8.5ch" }} /> people, in the Holy Land{" "}
        <input name="dates" placeholder="when" aria-label="When you are travelling" style={{ width: "10ch" }} />. Write to me at{" "}
        <input name="email" type="email" required autoComplete="email" placeholder="your email" aria-label="Your email" style={{ width: "14ch" }} />.
      </p>

      {/* honeypot */}
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="absolute left-[-9999px] h-0 w-0 opacity-0" />

      <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
        <button
          type="submit"
          disabled={status === "sending"}
          className="group inline-flex items-center gap-3 rounded-full bg-bone px-6 py-3 text-[15px] font-medium text-ink transition-colors hover:bg-white disabled:opacity-60"
        >
          {status === "sending" ? "Sending" : "Send to Michael"}
          <svg viewBox="0 0 24 24" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
            <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <p className={`${label} text-bone/50`} aria-live="polite">
          {status === "error" ? <span className="text-[#e39a8c]">{error}</span> : "Goes straight to Michael"}
        </p>
      </div>
    </form>
  );
}
