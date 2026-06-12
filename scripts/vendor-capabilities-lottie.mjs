/**
 * Re-materialises homepage Capabilities animation JSON embedded in HubSpot bundle.
 * Safe offline: slices the vendored `.js`; does not fetch endava.com.
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const bundlePath = path.join(
  repoRoot,
  "public/hubfs/build_assets/Endava-com-React/122/js_client_assets/assets/CapabilitiesCaseStudiesHomeIsland-D9LjsTMI.js",
);
const outPath = path.join(repoRoot, "src/data/capabilities-animation.json");

const bundle = readFileSync(bundlePath, "utf8");
const start = bundle.indexOf("const b=");
const endMarker = bundle.indexOf("markers:w},m=");
if (start < 0 || endMarker < 0) {
  throw new Error("Could not locate Lottie prelude in island bundle.");
}
const end = endMarker + "markers:w}".length;
const fragment = bundle.slice(start, end);
const getAnim = new Function(`${fragment}; return B;`);
const animationData = getAnim();

writeFileSync(outPath, JSON.stringify(animationData));
console.log(`Wrote ${path.relative(repoRoot, outPath)} (${Buffer.byteLength(JSON.stringify(animationData))} bytes).`);
