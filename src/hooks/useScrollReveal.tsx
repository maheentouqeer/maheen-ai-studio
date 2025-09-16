import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const useScrollReveal = () => {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>("[data-animate]");
    elements.forEach((el, index) => {
      const type = el.dataset.animate || "fade-up";
      const delay = index * 0.1; // Stagger animation
      
      let from: any = {};
      let transformOrigin = "center center";
      
      switch (type) {
        case "fade-up":
          from = { 
            y: 80, 
            opacity: 0, 
            scale: 0.95,
            rotationX: 15
          };
          break;
        case "fade-right":
          from = { 
            x: -80, 
            opacity: 0, 
            rotationY: -10
          };
          transformOrigin = "left center";
          break;
        case "fade-left":
          from = { 
            x: 80, 
            opacity: 0, 
            rotationY: 10
          };
          transformOrigin = "right center";
          break;
        case "zoom-in":
          from = { 
            scale: 0.8, 
            opacity: 0,
            rotation: -5
          };
          break;
        case "heading-reveal":
          from = {
            y: 100,
            opacity: 0,
            scale: 0.9,
            rotationX: 20,
            skewY: 5
          };
          break;
        default:
          from = { opacity: 0 };
      }

      gsap.set(el, { transformOrigin });

      gsap.from(el, {
        ...from,
        duration: 1.2,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
          onEnter: () => {
            // Add extra effects for headings
            if (type === "heading-reveal") {
              gsap.to(el, {
                textShadow: "0 0 30px rgba(41, 151, 214, 0.6)",
                duration: 0.5,
                delay: 0.5
              });
            }
          }
        },
      });
    });

    // Enhanced parallax for hero elements
    const parallaxElements = document.querySelectorAll<HTMLElement>("[data-parallax]");
    parallaxElements.forEach((el) => {
      const speed = parseFloat(el.dataset.parallax || "0.5");
      gsap.to(el, {
        yPercent: -50 * speed,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);
};

export default useScrollReveal;
