import { writeFile } from "node:fs/promises";
import { join } from "node:path";

// Development only: saves the captured stone wall image into public/.
export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production") return new Response("Not found", { status: 404 });
  const bytes = Buffer.from(await request.arrayBuffer());
  if (bytes.length < 1000 || bytes.length > 5_000_000) return Response.json({ ok: false }, { status: 400 });
  await writeFile(join(process.cwd(), "public", "stone-wall.webp"), bytes);
  return Response.json({ ok: true, bytes: bytes.length });
}
