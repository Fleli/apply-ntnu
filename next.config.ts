import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Native databasedriver skal ikke bundles av Turbopack
  serverExternalPackages: ["@libsql/client"],
};

export default nextConfig;
