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
  const beforeRef = useRef<HTMLDivElement>(null);
  const afterRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const shell = shellRef.current;
    const beforeMount = beforeRef.current;
    const afterMount = afterRef.current;
    if (!shell || !beforeMount || !afterMount) return;

    beforeMount.innerHTML = beforeHtml;
    afterMount.innerHTML = afterHtml;
    detachStaticShellIslands(shell);

    let cancelled = false;

    void (async () => {
      let anchor: HTMLElement = shell;

      try {
        anchor = await injectHeroIntroScroll(shell);
      } catch (e) {
        console.error('[endava-clone] hero intro script failed:', e);
      }

      if (steps.length === 0) return;

      await injectIslandStepsAfterShell(
        stripStaticShellIslandRegistrations(excludeHeroIntroFromSteps(steps)),
        () => cancelled,
        anchor,
      );
    })();

    return () => {
      cancelled = true;
    };
  }, [beforeHtml, afterHtml, steps]);

  return (
    <div id="endava-pixel-shell" ref={shellRef} suppressHydrationWarning>
      {[
        <div key="endava-pixel-before-html" ref={beforeRef} suppressHydrationWarning />,
        <Fragment key="endava-pixel-capabilities">{capabilities}</Fragment>,
        <div key="endava-pixel-after-html" ref={afterRef} suppressHydrationWarning />,
      ]}
    </div>
  );
}
