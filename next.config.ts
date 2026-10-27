import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Inntil 2 MiB profilbilde, pluss multipart-feltene rundt filen.
  experimental: { serverActions: { bodySizeLimit: "3mb" } },
  // Native databasedriver skal ikke bundles av Turbopack
  serverExternalPackages: ["@libsql/client"],
  // Migrasjonene leses fra disk ved oppstart, så de må med i serverbundelen
  outputFileTracingIncludes: { "/*": ["./drizzle/**/*"] },
};

export default nextConfig;
