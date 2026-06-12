'use client';

import Lottie from "lottie-react";

import capabilitiesAnimation from "@/data/capabilities-animation.json";

/** Lottie composition height vs visible window (matches island framing). */
const COMP_H = 1067;
const VIEW_H = 662;

/**
 * Shift framing down inside the 662px window so outer rings sit lower below the `#industries-home` seam
 * (island-era bias; strengthened for layout parity vs live).
 */
const RINGS_BIAS_DOWN_PX = 132;

const CROP_CENTER_Y = -(COMP_H - VIEW_H) / 2 + RINGS_BIAS_DOWN_PX;

export default function CapabilitiesIslandArt() {
  return (
    <div
      className="relative h-[662px] w-[1068px] shrink-0 overflow-hidden bg-transparent"
      data-testid="capabilities-island-lottie-shell"
      aria-hidden
    >
      <div
        className="relative"
        style={{ transform: `translateY(${CROP_CENTER_Y}px)` }}
      >
        <Lottie
          className="h-auto w-[1068px]"
          animationData={capabilitiesAnimation}
          loop
          autoplay
        />
      </div>
    </div>
  );
}
