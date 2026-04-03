import type { NextConfig } from "next";
import os from "os";

function nonInternalIPv4Hosts(): string[] {
  const out = new Set<string>();
  for (const list of Object.values(os.networkInterfaces())) {
    if (!list) continue;
    for (const i of list) {
      if (i.family === "IPv4" && !i.internal) out.add(i.address);
    }
  }
  return [...out];
}

/** Optional comma-separated hostnames (e.g. tailscale IP) */
const envExtra =
  process.env.AGM_ALLOWED_DEV_ORIGINS?.split(",")
    .map((s) => s.trim())
    .filter(Boolean) ?? [];

const nextConfig: NextConfig = {
  // Next 15+ blocks HMR / _next dev assets unless Origin host is allowlisted.
  allowedDevOrigins: [
    "127.0.0.1",
    ...nonInternalIPv4Hosts(),
    ...envExtra,
  ],
};

export default nextConfig;
