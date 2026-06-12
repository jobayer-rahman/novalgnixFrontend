/**
 * Vendored home hero scroll choreography (replaces HubSpot `template_home-intro-animation`).
 * Loads from `/endava-pixel/` so Next never proxies `/hubfs` → CDN (unpatched) when online.
 */
(function () {
  if (typeof window === "undefined") return;

  const animationClasses = [
    "animate-fade-up",
    "animate-once",
    "animate-duration-[1000ms]",
    "animate-ease-in-out",
    "animate-fill-forwards",
  ];

  let ticking = false;

  function update() {
    const introHome = document.getElementById("HomeIntroContainer");
    if (!introHome || !introHome.isConnected) return;

    const orangeTrail = document.querySelector('[aria-label="Path Orange"]');
    const orangeDot = document.querySelector('[aria-label="Dot Orange"]');
    const animatedDiv = document.getElementById("ItemCTextContainer");
    const introImage = document.getElementById("IntroImageContainer");

    if (!orangeTrail || !orangeDot || !animatedDiv || !introImage) return;

    const scrollTop = window.scrollY - introHome.offsetTop;
    const scrollHeight = introHome.offsetHeight - window.innerHeight;

    if (scrollHeight <= 0) return;

    let scrollFraction = scrollTop / scrollHeight;
    scrollFraction = Math.max(0, Math.min(scrollFraction, 1));

    const displacementMeasure = 800 * scrollFraction;

    if (scrollFraction > 0) {
      orangeDot.style.setProperty(
        "offset-path",
        `path('M110,102.21C110,410,470,320,460,${709 + displacementMeasure}')`,
      );
      orangeTrail.setAttribute(
        "d",
        `M-165.5,-303.895c-40,303.895,360,207.79,340,607.79 v${displacementMeasure}`,
      );
      orangeTrail.setAttribute(
        "stroke-dasharray",
        `${742.47 + displacementMeasure}`,
      );
    }

    if (scrollFraction > 0.6) {
      introImage.style.transform = "scale(1)";
      animatedDiv.classList.remove("opacity-0");
      animatedDiv.classList.add("opacity-100", "transition-opacity", ...animationClasses);
    } else {
      introImage.style.transform = "scale(0)";
      animatedDiv.classList.remove("opacity-100", ...animationClasses);
      animatedDiv.classList.add("opacity-0", "transition-opacity");
    }
  }

  function schedule() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      try {
        update();
      } finally {
        ticking = false;
      }
    });
  }

  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);

  function kickAfterLayout() {
    window.requestAnimationFrame(() => {
      schedule();
      window.requestAnimationFrame(schedule);
    });
  }

  if (document.readyState === "complete") {
    kickAfterLayout();
  } else {
    window.addEventListener("load", kickAfterLayout, { once: true });
    kickAfterLayout();
  }

  window.__ENDAVA_HOME_INTRO_READY = true;
})();
