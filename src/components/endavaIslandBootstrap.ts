export type IslandStep =
  | { kind: 'inline'; code?: string }
  | { kind: 'module'; code?: string }
  | { kind: 'src'; src?: string; defer?: boolean };

/** Vendored hero scroll script under `public/endava-pixel/`. */
export const HERO_INTRO_SCROLL_SRC = '/endava-pixel/home-intro-animation.js';

const NO_OP_ISLAND_PUSH = `var newIslands = [];
    if (Array.isArray(window.__islands)) {
      window.__islands.push(...newIslands);
    } else {
      window.__islands = newIslands;
    }`;

/**
 * HubSpot islands we keep as static SSR only — hydrating them often wipes the subtree in this clone.
 * (Capabilities / Case Studies intentionally NOT listed: parity with www.endava.com needs the HubSpot bundle.)
 */
const SHELL_STATIC_ISLANDS: ReadonlyArray<{ wrapperId: string; islandId: string }> = [
  {
    wrapperId: 'hs_cos_wrapper_Our_Customers_Value_Home_module',
    islandId: 'island-41d211i1R0',
  },
];

/** Remove HubSpot markers so island-runtime skips these mount nodes; static HTML stays. */
export function detachStaticShellIslands(shell: HTMLElement): void {
  for (const { wrapperId, islandId } of SHELL_STATIC_ISLANDS) {
    const mount = shell.querySelector<HTMLElement>(
      `[id="${wrapperId}"] > div[data-hs-island="true"]#${islandId}`,
    );
    if (!mount) continue;
    mount.removeAttribute('data-hs-island');
    mount.removeAttribute('data-hs-boundary');
    mount.removeAttribute('id');
  }
}

/** Drop matching `window.__islands` registrations so the runtime does not replace static shells. */
export function stripStaticShellIslandRegistrations(
  steps: IslandStep[],
): IslandStep[] {
  const markers = SHELL_STATIC_ISLANDS.map((s) => s.islandId);
  return steps.map((step) => {
    if (step.kind !== 'inline' || !step.code)
      return step;
    if (!markers.some((id) => step.code!.includes(id)))
      return step;
    return {
      kind: 'inline',
      code: NO_OP_ISLAND_PUSH,
    };
  });
}

function appendInline(code: string, insertAfter: HTMLElement): HTMLScriptElement {
  const s = document.createElement('script');
  s.textContent = code;
  insertAfter.insertAdjacentElement('afterend', s);
  return s;
}

function appendModule(
  code: string,
  insertAfter: HTMLElement,
): Promise<HTMLScriptElement> {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.type = 'module';
    s.crossOrigin = 'anonymous';
    s.textContent = code;
    s.onload = () => resolve(s);
    s.onerror = () =>
      reject(new Error('Endava clone: module bootstrap failed'));
    insertAfter.insertAdjacentElement('afterend', s);
  });
}

function appendSrc(
  src: string,
  defer: boolean,
  insertAfter: HTMLElement,
): Promise<HTMLScriptElement> {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.async = false;
    if (defer) {
      s.defer = true;
    }
    const resolved = new URL(src, window.location.href);
    if (resolved.origin !== window.location.origin) {
      s.crossOrigin = 'anonymous';
    }
    s.onload = () => resolve(s);
    s.onerror = () =>
      reject(new Error(`Endava clone: failed to load ${src}`));
    insertAfter.insertAdjacentElement('afterend', s);
  });
}

/** HubSpot chain includes the same URL at the end; skip so we can load it first. */
export function excludeHeroIntroFromSteps(steps: IslandStep[]): IslandStep[] {
  return steps.filter(
    (s) =>
      !(
        s.kind === 'src' &&
        s.src &&
        s.src.includes('home-intro-animation.js')
      ),
  );
}

/** Hero scroll script only — must not wait behind long HubSpot module graphs. */
export function injectHeroIntroScroll(
  insertAfter: HTMLElement,
): Promise<HTMLScriptElement> {
  return appendSrc(HERO_INTRO_SCROLL_SRC, false, insertAfter);
}

/**
 * HubSpot/CMS island payloads in doc order — same as production footer scripts after `</main>`.
 * @param startAfter — if set, first script is inserted after this node (e.g. after hero script tag).
 */
export async function injectIslandStepsAfterShell(
  steps: IslandStep[],
  cancelled: () => boolean,
  startAfter?: HTMLElement,
): Promise<void> {
  if (!steps.length) return;

  let insertAfter: HTMLElement =
    startAfter ??
    document.getElementById('endava-pixel-shell') ??
    document.body;

  for (const step of steps) {
    if (cancelled()) break;
    try {
      if (step.kind === 'inline' && step.code) {
        insertAfter = appendInline(step.code, insertAfter);
      } else if (step.kind === 'module' && step.code) {
        insertAfter = await appendModule(step.code, insertAfter);
      } else if (step.kind === 'src' && step.src) {
        insertAfter = await appendSrc(
          step.src,
          Boolean(step.defer),
          insertAfter,
        );
      }
    } catch (e) {
      console.error('[endava-clone] island step failed:', e, step);
    }
  }
}
