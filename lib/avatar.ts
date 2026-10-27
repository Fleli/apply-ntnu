import sharp from "sharp";

export const MAX_AVATAR_BYTES = 2 * 1024 * 1024;
const MAX_AVATAR_PIXELS = 16_000_000;
const allowedFormats: Record<string, string> = {
  "image/jpeg": "jpeg",
  "image/png": "png",
  "image/webp": "webp",
};

export class AvatarValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AvatarValidationError";
  }
}

export type NormalizedAvatar = { data: Buffer; mimeType: "image/webp" };

/** Fully decode untrusted uploads before anything is persisted; sharp strips metadata by default. */
export async function normalizeAvatar(input: FormDataEntryValue | null): Promise<NormalizedAvatar | null> {
  if (input === null) return null;
  if (typeof input === "string") throw new AvatarValidationError("Velg en bildefil.");
  // Empty optional file controls can acquire a placeholder filename in React multipart decoding.
  if (input.size === 0) return null;
  if (input.size > MAX_AVATAR_BYTES) throw new AvatarValidationError("Bildet må være på maksimalt 2 MiB.");
  const expectedFormat = allowedFormats[input.type];
  if (!expectedFormat) throw new AvatarValidationError("Velg et JPEG-, PNG- eller WebP-bilde.");

  try {
    const source = sharp(Buffer.from(await input.arrayBuffer()), {
      limitInputPixels: MAX_AVATAR_PIXELS,
      failOn: "warning",
      animated: false,
    });
    const metadata = await source.metadata();
    if (metadata.format !== expectedFormat || !metadata.width || !metadata.height || (metadata.pages ?? 1) > 1) {
      throw new Error("Unexpected image format");
    }
    const data = await source.rotate().resize(256, 256, { fit: "cover" }).webp({ quality: 82 }).toBuffer();
    return { data, mimeType: "image/webp" };
  } catch {
    throw new AvatarValidationError("Bildet kunne ikke leses. Velg et gyldig JPEG-, PNG- eller WebP-bilde med høyst 16 megapiksler.");
  }
}
