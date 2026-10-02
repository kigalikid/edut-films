import { appendFile, mkdir } from "node:fs/promises";
import { join } from "node:path";

// Receives the enquiry form. For now it only appends to data/enquiries.jsonl on this
// machine (git-ignored). TODO before launch: send each enquiry to Michael by email
// and/or WhatsApp, because a hosted site has no disk to write to.
const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Bad request." }, { status: 400 });
  }

  // honeypot: real visitors never see or fill this field
  if (clean(body.website, 200)) return Response.json({ ok: true });

  const entry = {
    name: clean(body.name, 120),
    group: clean(body.group, 160),
    size: clean(body.size, 40),
    dates: clean(body.dates, 120),
    email: clean(body.email, 200),
    at: new Date().toISOString(),
  };

  if (!entry.name) return Response.json({ ok: false, error: "Please add your name." }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(entry.email)) {
    return Response.json({ ok: false, error: "Please add an email address Michael can reply to." }, { status: 400 });
  }

  try {
    const dir = join(process.cwd(), "data");
    await mkdir(dir, { recursive: true });
    await appendFile(join(dir, "enquiries.jsonl"), JSON.stringify(entry) + "\n", "utf8");
  } catch {
    return Response.json({ ok: false, error: "That did not go through. Please try again." }, { status: 500 });
  }

  return Response.json({ ok: true });
}
