if (typeof window !== "undefined") {
  const introHome = document.getElementById("HomeIntroContainer");
  let ticking = false;

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!introHome) return;
          const orangeTrail = document.querySelector('[aria-label="Path Orange"]');
          const orangeDot = document.querySelector('[aria-label="Dot Orange"]');
          const animatedDiv = document.getElementById("ItemCTextContainer");
          const introImage = document.getElementById("IntroImageContainer");

          if (!orangeTrail || !orangeDot || !animatedDiv) return;

          const scrollTop = window.scrollY - introHome.offsetTop;
          const scrollHeight = introHome.offsetHeight - window.innerHeight;

          if (scrollHeight <= 0) return;

          let scrollFraction = scrollTop / scrollHeight;
          scrollFraction = Math.max(0, Math.min(scrollFraction, 1));

          const displacementMeasure = scrollFraction * 800;

          const animationClasses = [
            "animate-fade-up",
            "animate-once",
            "animate-duration-[1000ms]",
            "animate-ease-in-out",
            "animate-fill-forwards",
          ];

          if (scrollFraction > 0) {
            orangeDot.style.setProperty(
              "offset-path",
              `path('M110,102.21C110,410,470,320,460,${709 + displacementMeasure}')`,
            );
            orangeTrail.setAttribute(
              "d",
              `M-165.5,-303.895c-40,303.895,360,207.79,340,607.79 v${displacementMeasure}`,
            );
            orangeTrail.setAttribute("stroke-dasharray", `${742.47 + displacementMeasure}`);
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

          ticking = false;
        });
        ticking = true;
      }
    },
    false,
  );
}