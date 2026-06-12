import { readFile } from "node:fs/promises";
import path from "node:path";

import CapabilitiesCaseStudiesReplica from "@/components/endava-clone/CapabilitiesCaseStudiesReplica";
import EndavaPixelExperience from "@/components/EndavaPixelExperience";
import { extractAroundCapabilities } from "@/lib/capabilitiesSectionShell";
import type { IslandStep } from "@/components/endavaIslandBootstrap";

/**
 * Homepage shell: CSS + images are served from `public/hubfs`; this app does not call live Endava/HubSpot APIs.
 * Third-party “island” JS is disabled (`steps=[]`): layout is static HTML + vendored hero scroll only.
 *
 * Optional: `NEXT_PUBLIC_ENDAVA_PIXEL_ENABLE_ISLANDS=true` re-enables legacy HubSpot island scripts (loads more React 18 from /hubfs — not recommended).
 */
function islandStepsEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENDAVA_PIXEL_ENABLE_ISLANDS === "true";
}

export default async function Home() {
  const bodyPath = path.join(process.cwd(), "src/data/endava-pixel-body.html");
  const stepsPath = path.join(
    process.cwd(),
    "public/endava-pixel/island-steps.json",
  );

  const htmlRaw = await readFile(bodyPath, "utf8");
  const { before, after } = extractAroundCapabilities(htmlRaw);

  let islandSteps: IslandStep[] = [];
  if (islandStepsEnabled()) {
    try {
      const raw = await readFile(stepsPath, "utf8");
      const parsed = JSON.parse(raw) as { steps?: IslandStep[] };
      islandSteps = parsed.steps ?? [];
    } catch {
      islandSteps = [];
    }
  }

  return (
    <EndavaPixelExperience
      beforeHtml={before}
      afterHtml={after}
      capabilities={<CapabilitiesCaseStudiesReplica />}
      steps={islandSteps}
    />
  );
}
