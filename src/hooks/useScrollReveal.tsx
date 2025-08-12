import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const useScrollReveal = () => {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>("[data-animate]");
    elements.forEach((el) => {
      const type = el.dataset.animate || "fade-up";
      const from =
        type === "fade-up"
          ? { y: 20, opacity: 0 }
          : type === "fade-right"
          ? { x: -20, opacity: 0 }
          : type === "zoom-in"
          ? { scale: 0.95, opacity: 0 }
          : { opacity: 0 };

      gsap.from(el, {
        ...from,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);
};

export default useScrollReveal;
