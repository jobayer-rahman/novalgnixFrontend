import type { NextConfig } from "next";

/**
 * Homepage uses vendored assets under `public/` only (no rewrites to live Endava/HubSpot hosts).
 * Optional HubSpot island scripts: set `NEXT_PUBLIC_ENDAVA_PIXEL_ENABLE_ISLANDS=true` and ensure matching files exist under `public/`.
 */
const nextConfig: NextConfig = {
  /**
   * Dev shows fewer duplicate-effect / hydration warnings from HubSpot islands that
   * mount their own React 18 subtrees beside Next’s React 19 tree.
   */
  reactStrictMode: false,

  /** Prefer quiet terminal: HubSpot React 18 islands throw hydration messages that duplicate in the CLI. Use DevTools console for browser errors instead. */
  logging: {
    incomingRequests: false,
    browserToTerminal: false,
  },

};

export default nextConfig;
