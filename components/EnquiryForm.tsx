"use client";

import { type FormEvent, useState } from "react";

const label = "font-mono text-[11px] uppercase tracking-[0.22em]";

type Status = "idle" | "sending" | "sent" | "error";

// The enquiry is written as one sentence with blanks, so sending it feels like
// finishing a note to Michael rather than filling in a form.
export default function EnquiryForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [name, setName] = useState("");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    setStatus("sending");
    setError("");
    try {
      if (process.env.NODE_ENV === "production") {
        // Live site: Netlify Forms collects the enquiry (see public/__forms.html).
        const fields = Object.fromEntries(Object.entries(data).map(([k, v]) => [k, String(v)]));
        const res = await fetch("/__forms.html", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({ "form-name": "enquiry", ...fields }).toString(),
        });
        if (!res.ok) throw new Error("That did not go through. Please try again.");
      } else {
        // Local development: saved to data/enquiries.jsonl by app/api/enquiry.
        const res = await fetch("/api/enquiry", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
        if (!res.ok || !json.ok) throw new Error(json.error || "That did not go through. Please try again.");
      }
      setName(String(data.name || "").trim().split(" ")[0]);
      setStatus("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "That did not go through. Please try again.");
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
