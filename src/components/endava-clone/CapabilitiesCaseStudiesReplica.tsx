"use client";

import CapabilitiesIslandArt from "@/components/endava-clone/CapabilitiesIslandArt";

/** Mirrors hydrated `CapabilitiesCaseStudiesHomeIsland` JSX + ParagraphTypeThree classes from synced HTML. */

/** Exact mirror of SSR `capabilities-case-studies-home-*-wrapper` in `endava-pixel-body.html` (no extra max-width). */
const WRAPPER =
  "flex h-fit w-full flex-col items-start lg:items-start mr-auto ";

/** Synced heading + balanced multi-line wraps (parity with live ParagraphTypeThree in this rail). */
const HEADING_CLASS =
  " max-w-none text-text-primary text-balance break-words font-medium text-2xl lg:max-w-[36rem] lg:text-4xl ";

/** Exact paragraph classes from synced HTML. */
const BODY_P_CLASS = " font-regular mt-l text-text-primary body ";

const CTA_BTN_CLASS =
  "focusable-full h-56 focusable-full !no-underline text-ui-primary hover:text-ui-secondary svg-icon-primary hover:svg-icon-primary-hover bg-transparent border-2 border-ui-primary hover:border-ui-secondary rounded-full w-full flex items-center _buttonClass_z8alv_1 font-medium justify-center";

const CTA_INNER_SPAN_CLASS =
  "flex items-center transition-all duration-200 rounded-md text-base lg:text-lg gap-2 h-full px-8 py-2";

const CTA_ARROW = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Arrow pointing right"
    width={24}
    height={24}
    role="img"
  >
    <path
      d="M5 11.0002L19.586 11.0002L15.2929 6.70711C14.9024 6.31658 14.9024 5.68342 15.2929 5.29289C15.6834 4.90237 16.3166 4.90237 16.7071 5.29289L22.7071 11.2929C22.8225 11.4083 22.9038 11.5449 22.951 11.6902C22.9808 11.7818 22.997 11.8768 22.9996 11.9722C22.9996 11.9732 22.9997 11.9742 22.9997 11.9751C22.9999 11.9822 23 11.9893 23 11.9964C23 11.9976 23 11.9989 23 12.0001C23 12.2821 22.8833 12.5369 22.6955 12.7187L16.7071 18.7071C16.3166 19.0976 15.6834 19.0976 15.2929 18.7071C14.9024 18.3166 14.9024 17.6834 15.2929 17.2929L19.5856 13.0002L5 13.0002L4.99668 13.0002C4.72171 12.9993 4.47299 12.8875 4.29271 12.7072L3.89655 12.307C3.78702 12.1975 3.64344 12.143 3.49987 12.1433C3.35629 12.143 3.21272 12.1975 3.10318 12.307L2.70703 12.7072C2.52606 12.8882 2.27613 13.0002 1.99991 13.0002C1.44766 13.0002 1 12.5525 1 12.0003C1 11.448 1.44766 11.0004 1.99991 11.0004C2.27613 11.0004 2.52606 11.1122 2.70703 11.2932L3.10318 11.6934C3.21272 11.8029 3.35629 11.8574 3.49987 11.857C3.64344 11.8574 3.78702 11.8029 3.89655 11.6934L4.29271 11.2932C4.3613 11.2246 4.43981 11.1659 4.5259 11.1195C4.66699 11.0434 4.82845 11.0002 5 11.0002Z"
      fill="currentColor"
    />
  </svg>
);

export default function CapabilitiesCaseStudiesReplica() {
  const pillars = [
    {
      heading: "Create real value with leading capabilities",
      body:
        "Whether you're bringing a new product to life or strategising how to leverage AI to embrace the digital shift, we can help you meet the ever-changing needs of your industry, market and customers.",
      href: "/capabilities",
      cta: "See how we can help",
      testSuffix: "0",
    },
    {
      heading: "Move your business forward with tailored expertise",
      body:
        "As technology evolves, so too does our approach in supporting our clients. That's why we've developed Dava.X, where we provide tailored expertise in areas – like AI, core modernisation, cloud and more – that help you embrace and implement technologies rapidly and at scale.",
      href: "/dava-x",
      cta: "Explore our focus areas",
      testSuffix: "1",
    },
    {
      heading: "Discover how we help leading brands",
      body:
        "Over the past 25 years, we've supported technology modernisation and industry growth around the world. Explore our work to learn how we can help you create a success story of your own.",
      href: "/case-studies",
      cta: "Explore case studies",
      testSuffix: "2",
    },
  ] as const;

  const pillarBlocks = pillars.map((p) => (
    <div key={p.testSuffix} style={{ opacity: 1 }}>
      <div
        className={WRAPPER}
        data-testid={`capabilities-case-studies-home-${p.testSuffix}-wrapper`}
      >
        <h2
          className={HEADING_CLASS}
          data-testid="paragraph-type-three-header"
        >
          {p.heading}
        </h2>
        <div style={{ height: "unset" }}>
          <p
            className={BODY_P_CLASS}
            data-testid="paragraph-type-three-paragraph"
          >
            {p.body}
          </p>
        </div>
        <a
          href={p.href}
          type="button"
          className={CTA_BTN_CLASS}
          tabIndex={0}
          target="_self"
          rel="noreferrer"
          data-testid="paragraph-type-three-button"
        >
          <span className={CTA_INNER_SPAN_CLASS}>
            {p.cta}
            {CTA_ARROW}
          </span>
        </a>
      </div>
    </div>
  ));

  return (
    <section
      id="capabilities-case-studies-home"
      className="bg-bg-inverse dark relative z-[2] w-full"
    >
      <div className="dark flex w-full justify-center px-l md:px-xl lg:px-2xl">
        <div className="capabilities-desktop-row mx-auto gap-y-[56px] flex w-full max-w-[1312px] flex-col p-0 lg:flex-row lg:items-start lg:gap-x-4 xl:gap-x-6 lg:gap-y-0 lg:pt-[clamp(2rem,min(6vw,4rem),4rem)]">
          <div className="flex w-full shrink-0 justify-start lg:w-[32%] lg:min-h-0 lg:min-w-0 lg:flex-col lg:justify-start lg:self-start lg:pb-10 lg:pl-2 lg:pr-0 lg:pt-0 lg:relative">
            <div className="capabilities-home-lottie-wrap">
              <CapabilitiesIslandArt />
            </div>
          </div>
          <div className="gap-3xl flex w-full flex-col justify-start px-xl pb-xl pt-xl lg:min-h-0 lg:min-w-0 lg:flex-1 lg:justify-start lg:gap-y-[clamp(3.75rem,_min(10vw,_6.5rem),_7rem)] lg:self-stretch lg:p-0 lg:pt-0">
            {pillarBlocks}
          </div>
        </div>
      </div>
    </section>
  );
}
