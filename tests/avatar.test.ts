import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";
import sharp from "sharp";
import { normalizeAvatar, AvatarValidationError, MAX_AVATAR_BYTES } from "../lib/avatar";

const upload = (data: Uint8Array, type = "image/png") => new File([new Uint8Array(data)], "photo", { type });

test("no photo is optional, including empty browser file fields", async () => {
  assert.equal(await normalizeAvatar(null), null);
  assert.equal(await normalizeAvatar(new File([], "", { type: "application/octet-stream" })), null);
});

test("no photo remains optional after the server action multipart decoder assigns a filename", async () => {
  assert.equal(await normalizeAvatar(new File([], "undefined", { type: "application/octet-stream" })), null);
  assert.equal(await normalizeAvatar(new File([], "blob", { type: "application/octet-stream" })), null);
});

test("empty browser file survives a real multipart roundtrip as an optional photo", async () => {
  const data = new FormData();
  data.append("avatar", new File([], "", { type: "application/octet-stream" }));
  const request = new Request("http://localhost", { method: "POST", body: data });
  const busboy = createRequire(import.meta.url)("next/dist/compiled/busboy")({ headers: { "content-type": request.headers.get("content-type") } });
  const decoded = new Promise<File>((resolve, reject) => {
    busboy.on("error", reject);
    busboy.on("file", (_name: string, stream: NodeJS.ReadableStream, info: { filename: string; mimeType: string }) => {
      const chunks: Uint8Array<ArrayBuffer>[] = [];
      stream.on("data", (chunk: Uint8Array) => chunks.push(new Uint8Array(chunk)));
      // React's decodeReplyFromBusboy constructs File from exactly this metadata.
      stream.on("end", () => resolve(new File(chunks, info.filename, { type: info.mimeType })));
    });
  });
  busboy.end(Buffer.from(await request.arrayBuffer()));
  const file = await decoded;
  assert.equal(file.name, "undefined");
  assert.equal(await normalizeAvatar(file), null);
});

test("rejects unsupported MIME and forged image bytes", async () => {
  await assert.rejects(normalizeAvatar(upload(Buffer.from("hello"), "image/svg+xml")), AvatarValidationError);
  await assert.rejects(normalizeAvatar(upload(Buffer.from("not an image"))), AvatarValidationError);
  await assert.rejects(normalizeAvatar("data:image/png,hello"), AvatarValidationError);
});

test("rejects files beyond 2 MiB", async () => {
  await assert.rejects(normalizeAvatar(upload(Buffer.alloc(MAX_AVATAR_BYTES + 1))), /2 MiB/);
});

test("bounds decoder pixel input before processing", async () => {
  const large = await sharp({ create: { width: 5000, height: 5000, channels: 3, background: "white" } }).png().toBuffer();
  await assert.rejects(normalizeAvatar(upload(large)), AvatarValidationError);
});

test("decodes real PNG JPEG and WebP into a small metadata-free 256px WebP", async () => {
  for (const format of ["png", "jpeg", "webp"] as const) {
    const data = await sharp({ create: { width: 600, height: 400, channels: 3, background: "red" } })[format]().withMetadata({ orientation: 6 }).toBuffer();
    const result = await normalizeAvatar(upload(data, `image/${format}`));
    assert.ok(result);
    assert.equal(result.mimeType, "image/webp");
    const metadata = await sharp(result.data).metadata();
    assert.equal(metadata.format, "webp");
    assert.equal(metadata.width, 256);
    assert.equal(metadata.height, 256);
    assert.equal(metadata.exif, undefined);
    assert.equal(metadata.icc, undefined);
    assert.equal(metadata.orientation, undefined);
  }
});

test("rejects MIME that does not match the decoded format", async () => {
  const jpeg = await sharp({ create: { width: 10, height: 10, channels: 3, background: "red" } }).jpeg().toBuffer();
  await assert.rejects(normalizeAvatar(upload(jpeg, "image/png")), AvatarValidationError);
});
