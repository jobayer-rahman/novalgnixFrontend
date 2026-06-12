'use client';

import { Fragment, type ReactNode, useLayoutEffect, useRef } from 'react';

import {
  type IslandStep,
  detachStaticShellIslands,
  excludeHeroIntroFromSteps,
  injectHeroIntroScroll,
  injectIslandStepsAfterShell,
  stripStaticShellIslandRegistrations,
} from '@/components/endavaIslandBootstrap';

type Props = {
  beforeHtml: string;
  afterHtml: string;
  capabilities: ReactNode;
  steps: IslandStep[];
};

/**
 * Large Endava markup is injected client-side after mount (layout effect),
 * avoiding React hydration errors from browser-repaired static HTML blobs.
 *
 * Hero scroll choreography loads immediately — it cannot wait behind the HubSpot island
 * module graph, which often blocks for a long time on network or deadlocks during tests.
 */
export default function EndavaPixelExperience({
  beforeHtml,
  afterHtml,
  capabilities,
  steps,
}: Props) {
  const shellRef = useRef<HTMLDivElement>(null);
  
  useLayoutEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;

    detachStaticShellIslands(shell);

    let cancelled = false;

    if (steps.length > 0) {
      void (async () => {
        await injectIslandStepsAfterShell(
          stripStaticShellIslandRegistrations(excludeHeroIntroFromSteps(steps)),
          () => cancelled,
          shell,
        );
      })();
    }

    return () => {
      cancelled = true;
    };
  }, [steps]);

  return (
    <div id="endava-pixel-shell" ref={shellRef} suppressHydrationWarning>
      <script src="/endava-pixel/home-intro-animation.js" defer />
      <div
        dangerouslySetInnerHTML={{ __html: beforeHtml }}
        suppressHydrationWarning
      />
      <Fragment key="endava-pixel-capabilities">{capabilities}</Fragment>
      <div
        dangerouslySetInnerHTML={{ __html: afterHtml }}
        suppressHydrationWarning
      />
    </div>
  );
}
