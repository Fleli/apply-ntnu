import { eq } from "drizzle-orm";
import { getAccount } from "@/lib/account";
import { ensureDb } from "@/lib/db";
import { profileImages } from "@/lib/db/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const responseHeaders = {
    "Cache-Control": "private, no-store, max-age=0",
    "X-Content-Type-Options": "nosniff",
    "Vary": "Cookie",
  };
  const account = await getAccount(request.headers);
  if (!account) return new Response(null, { status: 401, headers: responseHeaders });
  const [image] = await (await ensureDb()).select({ data: profileImages.data, mimeType: profileImages.mimeType }).from(profileImages).where(eq(profileImages.userId, account.id)).limit(1);
  if (!image) return new Response(null, { status: 404, headers: responseHeaders });
  return new Response(new Uint8Array(image.data), { headers: { ...responseHeaders, "Content-Type": image.mimeType, "Content-Disposition": "inline" } });
}
